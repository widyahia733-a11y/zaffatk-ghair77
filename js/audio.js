/**
 * زفتك غير — مشغل الصوت السحابي في الكواليس (Headless / Hidden YouTube Player Audio Engine)
 * ZaffatakGhair Cloud YouTube Audio Controller
 * يعمل بنظام مشغل يوتيوب المخفي بنسبة 100% لبث جميع الزفات والمكتبات الصوتية سحابياً
 * بدون الحاجة لتخزين أي ملفات صوتية محلية، وخالٍ تماماً من AudioContext والمذبذبات الصناعية.
 */

'use strict';

const AudioEngine = (() => {
  // معرف الفيديو البديل الافتراضي عالي الاستقرار والموثوقية
  const DEFAULT_FALLBACK_ID = 'sK2WlF32Sxo';

  let player = null;
  let isReady = false;
  let isPlaying = false;
  let currentVideoId = null;
  let currentTrackData = null;
  let currentVolume = 0.8; // 0.0 to 1.0
  let progressInterval = null;
  let pendingPlay = null;
  let hasAttemptedFallback = false;

  let onErrorCallback = null;
  let onEndedCallback = null;
  const timeUpdateListeners = new Set();
  const stateChangeListeners = new Set();

  /**
   * استخراج معرّف يوتيوب النقي (11 حرفاً) من أي نص أو رابط
   */
  function extractVideoId(input) {
    if (!input || typeof input !== 'string') return DEFAULT_FALLBACK_ID;
    input = input.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
      return input;
    }
    const match = input.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : input.slice(0, 11) || DEFAULT_FALLBACK_ID;
  }

  /**
   * تهيئة وتضمين حاوية إطار اليوتيوب المخفية في الكواليس
   */
  function setupHiddenPlayerDOM() {
    let container = document.getElementById('yt-hidden-audio-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'yt-hidden-audio-container';
      container.setAttribute('aria-hidden', 'true');
      container.style.cssText = 'position:fixed;bottom:-9999px;right:-9999px;width:1px;height:1px;opacity:0.001;pointer-events:none;z-index:-9999;overflow:hidden;visibility:hidden;';
      
      const playerSlot = document.createElement('div');
      playerSlot.id = 'yt-hidden-audio-slot';
      container.appendChild(playerSlot);
      document.body.appendChild(container);
    }
    return 'yt-hidden-audio-slot';
  }

  /**
   * تهيئة واجهة برمجة تطبيقات يوتيوب (YouTube Iframe Player API)
   */
  function initYouTubeAPI() {
    if (window.YT && window.YT.Player) {
      createPlayerInstance();
      return;
    }

    // إعداد الدالة العامة التي يستدعيها يوتيوب عند اكتمال تحميل الـ API
    const previousAPIReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousAPIReady === 'function') {
        try { previousAPIReady(); } catch (e) { console.warn(e); }
      }
      createPlayerInstance();
    };

    // إضافة سكريبت YouTube API إلى الصفحة إذا لم يكن موجوداً
    if (!document.getElementById('yt-iframe-api-script')) {
      const tag = document.createElement('script');
      tag.id = 'yt-iframe-api-script';
      tag.src = 'https://www.youtube.com/iframe_api';
      tag.async = true;
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }
    }
  }

  /**
   * إنشاء كائن مشغل اليوتيوب في الخلفية
   */
  function createPlayerInstance() {
    if (player || !window.YT || !window.YT.Player) return;

    const slotId = setupHiddenPlayerDOM();
    try {
      player = new window.YT.Player(slotId, {
        height: '1',
        width: '1',
        videoId: DEFAULT_FALLBACK_ID,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.origin || undefined,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
          onError: onPlayerError,
        },
      });
    } catch (e) {
      console.error('تعذر إنشاء مشغل يوتيوب السحابي:', e);
    }
  }

  /**
   * عند جاهزية مشغل يوتيوب
   */
  function onPlayerReady(event) {
    isReady = true;
    try {
      if (player && typeof player.setVolume === 'function') {
        player.setVolume(Math.round(currentVolume * 100));
      }
    } catch (e) {}

    // تشغيل أي طلب كان معلقاً أثناء التحميل
    if (pendingPlay) {
      const { targetId, onError, onEnded, trackObj } = pendingPlay;
      pendingPlay = null;
      play(targetId, onError, onEnded, trackObj);
    }
  }

  /**
   * تتبع تغييرات حالة المشغل
   */
  function onPlayerStateChange(event) {
    if (!window.YT) return;

    if (event.data === window.YT.PlayerState.PLAYING) {
      isPlaying = true;
      hasAttemptedFallback = false;
      startProgressTracker();
      notifyStateChange(true);
    } else if (event.data === window.YT.PlayerState.PAUSED) {
      isPlaying = false;
      stopProgressTracker();
      notifyStateChange(false);
    } else if (event.data === window.YT.PlayerState.ENDED) {
      isPlaying = false;
      stopProgressTracker();
      notifyStateChange(false);
      if (typeof onEndedCallback === 'function') {
        onEndedCallback();
      }
      if (typeof window.onAudioEnded === 'function') {
        window.onAudioEnded();
      }
    } else if (event.data === window.YT.PlayerState.BUFFERING) {
      // جاري التخزين المؤقت
    }
  }

  /**
   * معالجة أخطاء تشغيل اليوتيوب مع التبديل التلقائي الذكي للبديل (Automatic Fallback)
   */
  function onPlayerError(event) {
    console.warn(`تنبيه مشغل يوتيوب السحابي (كود الخطأ: ${event.data})`);
    
    // إذا كان هناك خطأ قيود في الفيديو (100, 101, 150) ولم نجرب البديل بعد
    if (!hasAttemptedFallback) {
      hasAttemptedFallback = true;
      const fallbackId = (currentTrackData && currentTrackData.fallbackYoutubeId) 
        ? currentTrackData.fallbackYoutubeId 
        : DEFAULT_FALLBACK_ID;

      if (fallbackId && fallbackId !== currentVideoId) {
        console.info(`🔄 جاري التبديل التلقائي لمعرف الزفة البديل: ${fallbackId}`);
        currentVideoId = fallbackId;
        if (player && typeof player.loadVideoById === 'function') {
          player.loadVideoById(fallbackId, 0);
          player.playVideo();
          return;
        }
      }
    }

    isPlaying = false;
    stopProgressTracker();
    notifyStateChange(false);

    if (typeof onErrorCallback === 'function') {
      onErrorCallback(currentVideoId, event.data);
    } else if (typeof window.showToast === 'function') {
      window.showToast('تعذر بث هذه الزفة السحابية حالياً، يرجى تجربة زفة أخرى', 'error');
    }
  }

  /**
   * تتبع التقدم والوقت وتحديث الواجهة دورياً
   */
  function startProgressTracker() {
    stopProgressTracker();
    progressInterval = setInterval(() => {
      if (!player || !isPlaying) return;
      try {
        const cur = (typeof player.getCurrentTime === 'function') ? player.getCurrentTime() : 0;
        const dur = (typeof player.getDuration === 'function') ? player.getDuration() : 0;
        notifyTimeUpdate(cur, dur);
      } catch (e) {}
    }, 200);
  }

  function stopProgressTracker() {
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
  }

  function notifyTimeUpdate(cur, dur) {
    timeUpdateListeners.forEach(fn => {
      try { fn(cur, dur); } catch (e) { console.error(e); }
    });
  }

  function notifyStateChange(statePlaying) {
    stateChangeListeners.forEach(fn => {
      try { fn(statePlaying); } catch (e) { console.error(e); }
    });
  }

  /**
   * تشغيل زفة عبر معرّف يوتيوب السحابي في الكواليس
   * @param {string|object} trackOrId - معرّف يوتيوب أو كائن الزفة
   * @param {Function} [onError] - معالج الخطأ
   * @param {Function} [onEnded] - معالج انتهاء المقطع
   * @param {object} [trackObj] - بيانات الزفة الاختيارية
   */
  function play(trackOrId, onError, onEnded, trackObj) {
    let videoId = '';
    let trackData = trackObj || null;

    if (typeof trackOrId === 'object' && trackOrId !== null) {
      trackData = trackOrId;
      videoId = trackOrId.youtubeId || trackOrId.audioUrl || DEFAULT_FALLBACK_ID;
    } else if (typeof trackOrId === 'string') {
      videoId = trackOrId;
    }

    videoId = extractVideoId(videoId);
    if (onError) onErrorCallback = onError;
    if (onEnded) onEndedCallback = onEnded;
    currentTrackData = trackData;

    // إذا لم يكن المشغل جاهزاً بعد
    if (!isReady || !player || typeof player.loadVideoById !== 'function') {
      pendingPlay = { targetId: videoId, onError, onEnded, trackObj: trackData };
      initYouTubeAPI();
      return true;
    }

    // إذا كان نفس المقطع يعمل بالفعل
    if (currentVideoId === videoId && isPlaying) {
      return true;
    }

    // إذا كان نفس المقطع متوقفاً مؤقتاً
    if (currentVideoId === videoId && !isPlaying) {
      try {
        player.playVideo();
        isPlaying = true;
        startProgressTracker();
        notifyStateChange(true);
        return true;
      } catch (e) {}
    }

    // تحميل وتشغيل مقطع جديد
    currentVideoId = videoId;
    hasAttemptedFallback = false;
    try {
      player.loadVideoById(videoId, 0);
      player.setVolume(Math.round(currentVolume * 100));
      player.playVideo();
      isPlaying = true;
      startProgressTracker();
      notifyStateChange(true);
    } catch (err) {
      console.warn('تعذر تحميل زفة يوتيوب السحابية:', err);
      if (typeof onErrorCallback === 'function') {
        onErrorCallback(videoId, err);
      }
    }

    return true;
  }

  /**
   * إيقاف مؤقت للتشغيل
   */
  function pause() {
    if (player && typeof player.pauseVideo === 'function') {
      try {
        player.pauseVideo();
      } catch (e) {}
    }
    isPlaying = false;
    stopProgressTracker();
    notifyStateChange(false);
  }

  /**
   * استئناف التشغيل
   */
  function resume() {
    if (player && typeof player.playVideo === 'function') {
      try {
        player.playVideo();
        isPlaying = true;
        startProgressTracker();
        notifyStateChange(true);
      } catch (e) {}
    }
  }

  /**
   * إيقاف تام وإعادة للبداية
   */
  function stop() {
    if (player) {
      try {
        if (typeof player.stopVideo === 'function') player.stopVideo();
        if (typeof player.seekTo === 'function') player.seekTo(0, true);
      } catch (e) {}
    }
    isPlaying = false;
    stopProgressTracker();
    notifyStateChange(false);
    notifyTimeUpdate(0, getDuration());
  }

  /**
   * القفز إلى ثانية محددة في المقطع
   * @param {number} timeInSeconds
   */
  function seek(timeInSeconds) {
    if (player && typeof player.seekTo === 'function') {
      try {
        player.seekTo(Math.max(0, timeInSeconds), true);
        notifyTimeUpdate(timeInSeconds, getDuration());
      } catch (e) {}
    }
  }

  /**
   * تعديل مستوى الصوت (من 0.0 إلى 1.0)
   * @param {number} vol
   */
  function setVolume(vol) {
    currentVolume = Math.max(0, Math.min(1, vol));
    if (player && typeof player.setVolume === 'function') {
      try {
        player.setVolume(Math.round(currentVolume * 100));
      } catch (e) {}
    }
  }

  function getCurrentTime() {
    if (player && typeof player.getCurrentTime === 'function') {
      try {
        return player.getCurrentTime() || 0;
      } catch (e) {}
    }
    return 0;
  }

  function getDuration() {
    if (player && typeof player.getDuration === 'function') {
      try {
        return player.getDuration() || 0;
      } catch (e) {}
    }
    return 0;
  }

  function getState() {
    return isPlaying;
  }

  function getCurrentVideoId() {
    return currentVideoId;
  }

  function onTimeUpdate(fn) {
    if (typeof fn === 'function') {
      timeUpdateListeners.add(fn);
    }
    return () => timeUpdateListeners.delete(fn);
  }

  function onStateChange(fn) {
    if (typeof fn === 'function') {
      stateChangeListeners.add(fn);
    }
    return () => stateChangeListeners.delete(fn);
  }

  function setErrorHandler(fn) {
    onErrorCallback = fn;
  }

  function setEndedHandler(fn) {
    onEndedCallback = fn;
  }

  // التهيئة التلقائية عند استدعاء الملف
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initYouTubeAPI);
  } else {
    initYouTubeAPI();
  }

  return {
    play,
    pause,
    resume,
    stop,
    seek,
    setVolume,
    getCurrentTime,
    getDuration,
    getState,
    getCurrentVideoId,
    extractVideoId,
    onTimeUpdate,
    onStateChange,
    setErrorHandler,
    setEndedHandler,
  };
})();

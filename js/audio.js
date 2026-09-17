/**
 * زفتك غير — محرك الصوت السحابي المزدوج المتقدم (Dual Cloud Audio Engine & Streaming Controller)
 * ZaffatakGhair Hybrid Background Audio Controller
 * يدعم البث الصوتي المباشر السحابي عبر الروابط الخارجية (HTML5 Cloud Streaming)
 * ومشغل يوتيوب المخفي في الكواليس (Headless YouTube Player)
 * مع دعم كامل للتشغيل في الخلفية (Background Playback & MediaSession API)
 */

'use strict';

const AudioEngine = (() => {
  // معرف الفيديو البديل الافتراضي عالي الاستقرار والموثوقية (بلقيس - مبروك)
  const DEFAULT_FALLBACK_ID = 'Rh9M8EBs6bw';
  // رابط صوت سحابي بديل عالي الموثوقية
  const DEFAULT_STREAM_FALLBACK = 'https://ia801503.us.archive.org/15/items/audio-wedding-sample-gulf/zaffa-sample.mp3';

  // State
  let activeMode = 'none'; // 'stream' | 'youtube' | 'none'
  let isPlaying = false;
  let currentVolume = 0.8; // 0.0 to 1.0
  let currentTrackData = null;
  let currentVideoId = null;
  let currentStreamUrl = null;
  let hasAttemptedFallback = false;
  let progressInterval = null;

  // Listeners & Callbacks
  let onErrorCallback = null;
  let onEndedCallback = null;
  const timeUpdateListeners = new Set();
  const stateChangeListeners = new Set();

  // ══════════════════════════════════════════════════════════
  // 1. HTML5 NATIVE STREAMING AUDIO PLAYER
  // ══════════════════════════════════════════════════════════
  let streamAudio = null;

  function getStreamAudio() {
    if (!streamAudio) {
      streamAudio = new Audio();
      streamAudio.preload = 'auto';
      streamAudio.crossOrigin = 'anonymous';

      streamAudio.addEventListener('play', () => {
        if (activeMode === 'stream') {
          isPlaying = true;
          updateMediaSessionState('playing');
          notifyStateChange(true);
        }
      });

      streamAudio.addEventListener('pause', () => {
        if (activeMode === 'stream') {
          isPlaying = false;
          updateMediaSessionState('paused');
          notifyStateChange(false);
        }
      });

      streamAudio.addEventListener('timeupdate', () => {
        if (activeMode === 'stream' && streamAudio) {
          const cur = streamAudio.currentTime || 0;
          const dur = streamAudio.duration && !isNaN(streamAudio.duration) ? streamAudio.duration : 0;
          notifyTimeUpdate(cur, dur);
        }
      });

      streamAudio.addEventListener('ended', () => {
        if (activeMode === 'stream') {
          isPlaying = false;
          updateMediaSessionState('none');
          notifyStateChange(false);
          if (typeof onEndedCallback === 'function') onEndedCallback();
          if (typeof window.onAudioEnded === 'function') window.onAudioEnded();
        }
      });

      streamAudio.addEventListener('error', (e) => {
        if (activeMode === 'stream') {
          console.warn('تنبيه: خطأ في رابط البث المباشر، جاري التبديل للمشغل السحابي البديل...');
          handleStreamError();
        }
      });
    }
    return streamAudio;
  }

  function handleStreamError() {
    if (!hasAttemptedFallback && currentTrackData && (currentTrackData.youtubeId || currentTrackData.fallbackYoutubeId)) {
      hasAttemptedFallback = true;
      const yId = currentTrackData.youtubeId || currentTrackData.fallbackYoutubeId || DEFAULT_FALLBACK_ID;
      playViaYouTube(yId);
    } else {
      isPlaying = false;
      notifyStateChange(false);
      if (typeof onErrorCallback === 'function') {
        onErrorCallback(currentStreamUrl, 'STREAM_ERROR');
      }
    }
  }

  // ══════════════════════════════════════════════════════════
  // 2. HEADLESS YOUTUBE PLAYER (IN THE BACKGROUND / بالكواليس)
  // ══════════════════════════════════════════════════════════
  let ytPlayer = null;
  let isYtReady = false;
  let pendingYtPlay = null;

  function extractVideoId(input) {
    if (!input || typeof input !== 'string') return DEFAULT_FALLBACK_ID;
    input = input.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) {
      return input;
    }
    const match = input.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : (input.slice(0, 11) || DEFAULT_FALLBACK_ID);
  }

  function setupHiddenPlayerDOM() {
    let container = document.getElementById('yt-hidden-audio-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'yt-hidden-audio-container';
      container.setAttribute('aria-hidden', 'true');
      container.style.cssText = 'position:fixed;bottom:0;right:0;width:1px;height:1px;opacity:0.01;pointer-events:none;z-index:-1;overflow:hidden;';
      
      const playerSlot = document.createElement('div');
      playerSlot.id = 'yt-hidden-audio-slot';
      container.appendChild(playerSlot);
      document.body.appendChild(container);
    }
    return 'yt-hidden-audio-slot';
  }

  function initYouTubeAPI() {
    if (window.YT && window.YT.Player) {
      createYtPlayerInstance();
      return;
    }

    const previousAPIReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousAPIReady === 'function') {
        try { previousAPIReady(); } catch (e) { console.warn(e); }
      }
      createYtPlayerInstance();
    };

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

  function createYtPlayerInstance() {
    if (ytPlayer || !window.YT || !window.YT.Player) return;

    const slotId = setupHiddenPlayerDOM();
    try {
      ytPlayer = new window.YT.Player(slotId, {
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
          onReady: onYtPlayerReady,
          onStateChange: onYtPlayerStateChange,
          onError: onYtPlayerError,
        },
      });
    } catch (e) {
      console.warn('تعذر إنشاء مشغل يوتيوب السحابي:', e);
    }
  }

  function onYtPlayerReady(event) {
    isYtReady = true;
    try {
      if (ytPlayer && typeof ytPlayer.setVolume === 'function') {
        ytPlayer.setVolume(Math.round(currentVolume * 100));
      }
    } catch (e) {}

    if (pendingYtPlay) {
      const vid = pendingYtPlay;
      pendingYtPlay = null;
      playViaYouTube(vid);
    }
  }

  function onYtPlayerStateChange(event) {
    if (!window.YT || activeMode !== 'youtube') return;

    if (event.data === window.YT.PlayerState.PLAYING) {
      isPlaying = true;
      hasAttemptedFallback = false;
      startYtProgressTracker();
      updateMediaSessionState('playing');
      notifyStateChange(true);
    } else if (event.data === window.YT.PlayerState.PAUSED) {
      isPlaying = false;
      stopYtProgressTracker();
      updateMediaSessionState('paused');
      notifyStateChange(false);
    } else if (event.data === window.YT.PlayerState.ENDED) {
      isPlaying = false;
      stopYtProgressTracker();
      updateMediaSessionState('none');
      notifyStateChange(false);
      if (typeof onEndedCallback === 'function') onEndedCallback();
      if (typeof window.onAudioEnded === 'function') window.onAudioEnded();
    }
  }

  function onYtPlayerError(event) {
    if (activeMode !== 'youtube') return;
    console.warn(`تنبيه يوتيوب في الكواليس (رمز الخطأ: ${event.data})`);

    if (!hasAttemptedFallback) {
      hasAttemptedFallback = true;
      // إذا كان للزفة رابط بديل
      const fallbackId = (currentTrackData && currentTrackData.fallbackYoutubeId)
        ? currentTrackData.fallbackYoutubeId
        : DEFAULT_FALLBACK_ID;

      if (fallbackId && fallbackId !== currentVideoId) {
        currentVideoId = fallbackId;
        if (ytPlayer && typeof ytPlayer.loadVideoById === 'function') {
          ytPlayer.loadVideoById(fallbackId, 0);
          ytPlayer.playVideo();
          return;
        }
      }
    }

    isPlaying = false;
    stopYtProgressTracker();
    notifyStateChange(false);

    if (typeof onErrorCallback === 'function') {
      onErrorCallback(currentVideoId, event.data);
    }
  }

  function startYtProgressTracker() {
    stopYtProgressTracker();
    progressInterval = setInterval(() => {
      if (activeMode !== 'youtube' || !ytPlayer || !isPlaying) return;
      try {
        const cur = (typeof ytPlayer.getCurrentTime === 'function') ? ytPlayer.getCurrentTime() : 0;
        const dur = (typeof ytPlayer.getDuration === 'function') ? ytPlayer.getDuration() : 0;
        notifyTimeUpdate(cur, dur);
      } catch (e) {}
    }, 250);
  }

  function stopYtProgressTracker() {
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
  }

  // ══════════════════════════════════════════════════════════
  // 3. MEDIA SESSION API (Background Lockscreen & Controls)
  // ══════════════════════════════════════════════════════════
  function setupMediaSession(track) {
    if (!('mediaSession' in navigator)) return;

    const title = track?.title || 'زفة ملكية خاصة';
    const artist = track?.artist || 'زفتك غير — ZaffatakGhair';
    const album = 'منصة الزفات الخليجية الأولى';

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: title,
        artist: artist,
        album: album,
        artwork: [
          { src: 'assets/hero-bg.jpg', sizes: '512x512', type: 'image/jpeg' },
        ],
      });

      navigator.mediaSession.setActionHandler('play', () => resume());
      navigator.mediaSession.setActionHandler('pause', () => pause());
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.seekTime !== undefined) seek(details.seekTime);
      });
      navigator.mediaSession.setActionHandler('previoustrack', () => {
        const prevBtn = document.getElementById('player-prev-btn');
        if (prevBtn) prevBtn.click();
      });
      navigator.mediaSession.setActionHandler('nexttrack', () => {
        const nextBtn = document.getElementById('player-next-btn');
        if (nextBtn) nextBtn.click();
      });
    } catch (e) {}
  }

  function updateMediaSessionState(playbackState) {
    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.playbackState = playbackState; // 'playing' | 'paused' | 'none'
      } catch (e) {}
    }
  }

  // ══════════════════════════════════════════════════════════
  // 4. MAIN PUBLIC CONTROLLER API
  // ══════════════════════════════════════════════════════════

  /**
   * تشغيل مقطع عبر البث المباشر السحابي أو يوتيوب في الكواليس
   * @param {string|object} trackOrId
   * @param {Function} [onError]
   * @param {Function} [onEnded]
   * @param {object} [trackObj]
   */
  function play(trackOrId, onError, onEnded, trackObj) {
    if (onError) onErrorCallback = onError;
    if (onEnded) onEndedCallback = onEnded;

    let track = trackObj || null;
    let target = '';

    if (typeof trackOrId === 'object' && trackOrId !== null) {
      track = trackOrId;
      target = track.audioUrl || track.streamUrl || track.youtubeId || DEFAULT_FALLBACK_ID;
    } else if (typeof trackOrId === 'string') {
      target = trackOrId.trim();
    }

    currentTrackData = track;
    hasAttemptedFallback = false;
    setupMediaSession(track);

    // فحص ما إذا كان الهدف رابط صوت مباشر (MP3 / Audio URL / Cloud Stream)
    const isDirectAudioUrl = /^(https?:)?\/\/.+\.(mp3|aac|m4a|ogg|wav)(\?.*)?$/i.test(target) ||
      (track && (track.audioUrl || track.streamUrl));

    if (isDirectAudioUrl) {
      const streamUrl = track?.audioUrl || track?.streamUrl || target;
      return playViaStream(streamUrl);
    } else {
      const vid = extractVideoId(target);
      return playViaYouTube(vid);
    }
  }

  function playViaStream(url) {
    // إيقاف مشغل يوتيوب إن كان يعمل
    if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
      try { ytPlayer.pauseVideo(); } catch (e) {}
    }
    stopYtProgressTracker();

    activeMode = 'stream';
    currentStreamUrl = url;
    const audio = getStreamAudio();

    if (audio.src !== url) {
      audio.src = url;
    }
    audio.volume = currentVolume;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isPlaying = true;
          updateMediaSessionState('playing');
          notifyStateChange(true);
        })
        .catch((err) => {
          console.warn('تنبيه في تشغيل البث المباشر:', err);
          handleStreamError();
        });
    }
    return true;
  }

  function playViaYouTube(videoId) {
    // إيقاف البث المباشر إن كان يعمل
    if (streamAudio) {
      try { streamAudio.pause(); } catch (e) {}
    }

    activeMode = 'youtube';
    currentVideoId = videoId;

    if (!isYtReady || !ytPlayer || typeof ytPlayer.loadVideoById !== 'function') {
      pendingYtPlay = videoId;
      initYouTubeAPI();
      return true;
    }

    if (currentVideoId === videoId && isPlaying) {
      return true;
    }

    try {
      ytPlayer.loadVideoById(videoId, 0);
      ytPlayer.setVolume(Math.round(currentVolume * 100));
      ytPlayer.playVideo();
      isPlaying = true;
      startYtProgressTracker();
      updateMediaSessionState('playing');
      notifyStateChange(true);
    } catch (err) {
      console.warn('تعذر تحميل زفة يوتيوب في الكواليس:', err);
      if (typeof onErrorCallback === 'function') {
        onErrorCallback(videoId, err);
      }
    }
    return true;
  }

  function pause() {
    isPlaying = false;
    if (activeMode === 'stream' && streamAudio) {
      try { streamAudio.pause(); } catch (e) {}
    } else if (activeMode === 'youtube' && ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
      try { ytPlayer.pauseVideo(); } catch (e) {}
      stopYtProgressTracker();
    }
    updateMediaSessionState('paused');
    notifyStateChange(false);
  }

  function resume() {
    isPlaying = true;
    if (activeMode === 'stream' && streamAudio) {
      streamAudio.play().catch(() => {});
    } else if (activeMode === 'youtube' && ytPlayer && typeof ytPlayer.playVideo === 'function') {
      try { ytPlayer.playVideo(); } catch (e) {}
      startYtProgressTracker();
    }
    updateMediaSessionState('playing');
    notifyStateChange(true);
  }

  function stop() {
    isPlaying = false;
    if (activeMode === 'stream' && streamAudio) {
      try {
        streamAudio.pause();
        streamAudio.currentTime = 0;
      } catch (e) {}
    } else if (activeMode === 'youtube' && ytPlayer) {
      try {
        if (typeof ytPlayer.stopVideo === 'function') ytPlayer.stopVideo();
        if (typeof ytPlayer.seekTo === 'function') ytPlayer.seekTo(0, true);
      } catch (e) {}
      stopYtProgressTracker();
    }
    updateMediaSessionState('none');
    notifyStateChange(false);
    notifyTimeUpdate(0, getDuration());
  }

  function seek(timeInSeconds) {
    const target = Math.max(0, timeInSeconds);
    if (activeMode === 'stream' && streamAudio) {
      try {
        streamAudio.currentTime = target;
        notifyTimeUpdate(target, getDuration());
      } catch (e) {}
    } else if (activeMode === 'youtube' && ytPlayer && typeof ytPlayer.seekTo === 'function') {
      try {
        ytPlayer.seekTo(target, true);
        notifyTimeUpdate(target, getDuration());
      } catch (e) {}
    }
  }

  function setVolume(vol) {
    currentVolume = Math.max(0, Math.min(1, vol));
    if (streamAudio) {
      streamAudio.volume = currentVolume;
    }
    if (ytPlayer && typeof ytPlayer.setVolume === 'function') {
      try {
        ytPlayer.setVolume(Math.round(currentVolume * 100));
      } catch (e) {}
    }
  }

  function getCurrentTime() {
    if (activeMode === 'stream' && streamAudio) {
      return streamAudio.currentTime || 0;
    }
    if (activeMode === 'youtube' && ytPlayer && typeof ytPlayer.getCurrentTime === 'function') {
      try { return ytPlayer.getCurrentTime() || 0; } catch (e) {}
    }
    return 0;
  }

  function getDuration() {
    if (activeMode === 'stream' && streamAudio) {
      return (streamAudio.duration && !isNaN(streamAudio.duration)) ? streamAudio.duration : 0;
    }
    if (activeMode === 'youtube' && ytPlayer && typeof ytPlayer.getDuration === 'function') {
      try { return ytPlayer.getDuration() || 0; } catch (e) {}
    }
    return 0;
  }

  function getState() {
    return isPlaying;
  }

  function getCurrentVideoId() {
    return currentVideoId;
  }

  function getCurrentTrack() {
    return currentTrackData;
  }

  function onTimeUpdate(fn) {
    if (typeof fn === 'function') timeUpdateListeners.add(fn);
    return () => timeUpdateListeners.delete(fn);
  }

  function onStateChange(fn) {
    if (typeof fn === 'function') stateChangeListeners.add(fn);
    return () => stateChangeListeners.delete(fn);
  }

  function notifyTimeUpdate(cur, dur) {
    timeUpdateListeners.forEach(fn => {
      try { fn(cur, dur); } catch (e) {}
    });
  }

  function notifyStateChange(statePlaying) {
    stateChangeListeners.forEach(fn => {
      try { fn(statePlaying); } catch (e) {}
    });
  }

  function setErrorHandler(fn) {
    onErrorCallback = fn;
  }

  function setEndedHandler(fn) {
    onEndedCallback = fn;
  }

  // Initialize YouTube API automatically
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
    getCurrentTrack,
    extractVideoId,
    onTimeUpdate,
    onStateChange,
    setErrorHandler,
    setEndedHandler,
  };
})();

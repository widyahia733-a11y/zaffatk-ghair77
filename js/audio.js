/**
 * زفتك غير — مشغل الصوت السحابي القياسي المباشر (Direct Online Streaming Audio Engine)
 * ZaffatakGhair Native HTML5 Cloud Audio Player
 * يعتمد حصراً على عنصر HTML5 Audio وروابط البث المباشر (Direct Streaming URLs)
 * خالٍ تماماً من AudioContext أو أي مذبذبات صوتية إلكترونية.
 */

'use strict';

const AudioEngine = (() => {
  // عنصر الصوت القياسي HTML5 Audio
  let audioElement = null;
  let currentSrc = null;
  let isPlaying = false;
  let currentVolume = 0.8;
  let onErrorCallback = null;
  let onEndedCallback = null;

  function initAudioElement() {
    if (!audioElement) {
      audioElement = new Audio();
      audioElement.preload = 'auto';
      audioElement.volume = currentVolume;
      audioElement.crossOrigin = 'anonymous';

      // أحداث التشغيل القياسية
      audioElement.addEventListener('play', () => {
        isPlaying = true;
      });

      audioElement.addEventListener('pause', () => {
        isPlaying = false;
      });

      audioElement.addEventListener('ended', () => {
        isPlaying = false;
        if (typeof onEndedCallback === 'function') {
          onEndedCallback();
        }
        if (window.onAudioEnded) {
          window.onAudioEnded();
        }
      });

      // معالجة الأخطاء الذكية واللطيفة
      audioElement.addEventListener('error', (e) => {
        isPlaying = false;
        const err = audioElement.error;
        console.warn('تعذر بث الملف الصوتي المباشر:', err ? `Code ${err.code} - ${err.message}` : e);
        
        if (typeof onErrorCallback === 'function') {
          onErrorCallback(currentSrc, err);
        } else if (typeof window.showToast === 'function') {
          window.showToast('تعذر تشغيل هذا المقطع الصوتي السحابي، يرجى التأكد من اتصال الإنترنت أو المحاولة لاحقاً', 'error');
        }
      });
    }
    return audioElement;
  }

  /**
   * تشغيل رابط صوتي سحابي مباشر عبر الإنترنت
   * @param {string} src - رابط MP3 مباشر يبدأ بـ https:// وينتهي بـ .mp3
   * @param {Function} [onError] - دالة معالجة الأخطاء
   * @param {Function} [onEnded] - دالة عند انتهاء المقطع
   * @returns {boolean}
   */
  function play(src, onError, onEnded) {
    if (!src) return false;

    if (onError) onErrorCallback = onError;
    if (onEnded) onEndedCallback = onEnded;

    const audio = initAudioElement();

    // إذا كان المقطع نفسه يعمل بالفعل
    if (currentSrc === src && !audio.paused) {
      return true;
    }

    // إذا تم استئناف المقطع نفسه وهو متوقف مؤقتاً
    if (currentSrc === src && audio.paused && audio.currentTime > 0) {
      const resumePromise = audio.play();
      if (resumePromise !== undefined) {
        resumePromise
          .then(() => {
            isPlaying = true;
          })
          .catch(err => {
            console.warn('تعذر استئناف التشغيل:', err);
            isPlaying = false;
          });
      }
      return true;
    }

    // تعيين الرابط السحابي الجديد
    currentSrc = src;
    audio.src = src;
    audio.load();

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isPlaying = true;
        })
        .catch(err => {
          // خطأ سياسة التشغيل التلقائي أو انقطاع الرابط
          if (err.name !== 'AbortError') {
            console.warn('تعذر بدء تشغيل الرابط الصوتي:', err);
            isPlaying = false;
            if (typeof onErrorCallback === 'function') {
              onErrorCallback(src, err);
            } else if (typeof window.showToast === 'function') {
              window.showToast('تعذر تشغيل هذا المقطع الصوتي السحابي، يرجى التأكد من اتصال الإنترنت أو المحاولة لاحقاً', 'error');
            }
          }
        });
    }
    return true;
  }

  /**
   * إيقاف مؤقت للتشغيل
   */
  function pause() {
    const audio = initAudioElement();
    audio.pause();
    isPlaying = false;
  }

  /**
   * إيقاف تام وإعادة للبداية
   */
  function stop() {
    const audio = initAudioElement();
    audio.pause();
    try {
      audio.currentTime = 0;
    } catch (e) {
      // Ignored if not loaded yet
    }
    isPlaying = false;
  }

  /**
   * استئناف التشغيل الحالي
   */
  function resume() {
    const audio = initAudioElement();
    if (audio.src) {
      const p = audio.play();
      if (p !== undefined) {
        p.then(() => {
          isPlaying = true;
        }).catch(e => {
          console.warn('تعذر استئناف التشغيل:', e);
          isPlaying = false;
        });
      }
    }
  }

  /**
   * القفز إلى ثانية محددة في المقطع
   * @param {number} timeInSeconds
   */
  function seek(timeInSeconds) {
    const audio = initAudioElement();
    if (audio.duration && !isNaN(audio.duration)) {
      audio.currentTime = Math.max(0, Math.min(audio.duration, timeInSeconds));
    }
  }

  /**
   * تعديل مستوى الصوت (0 إلى 1)
   * @param {number} vol
   */
  function setVolume(vol) {
    currentVolume = Math.max(0, Math.min(1, vol));
    const audio = initAudioElement();
    audio.volume = currentVolume;
  }

  function getCurrentTime() {
    const audio = initAudioElement();
    return audio.currentTime || 0;
  }

  function getDuration() {
    const audio = initAudioElement();
    return audio.duration || 0;
  }

  function getState() {
    const audio = initAudioElement();
    return !audio.paused;
  }

  function getCurrentSrc() {
    return currentSrc;
  }

  function getElement() {
    return initAudioElement();
  }

  function setErrorHandler(fn) {
    onErrorCallback = fn;
  }

  function setEndedHandler(fn) {
    onEndedCallback = fn;
  }

  return {
    play,
    pause,
    stop,
    resume,
    seek,
    setVolume,
    getCurrentTime,
    getDuration,
    getState,
    getCurrentSrc,
    getElement,
    setErrorHandler,
    setEndedHandler,
  };
})();

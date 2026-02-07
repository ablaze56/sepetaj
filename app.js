(function () {
  'use strict';

  const startBtn = document.getElementById('startBtn');
  const intro = document.getElementById('intro');
  const active = document.getElementById('active');
  const errorEl = document.getElementById('error');

  let audioContext = null;
  let analyser = null;
  let stream = null;
  let rafId = null;

  const HUE_MIN = 280;
  const HUE_MAX = 340;
  const SAT = 55;
  const LIGHT = 92;
  const SMOOTH = 0.12;
  let currentLevel = 0;

  function setError(msg) {
    errorEl.textContent = msg || '';
  }

  function volumeToColor(level) {
    const t = Math.max(0, Math.min(1, level));
    const hue = HUE_MIN + t * (HUE_MAX - HUE_MIN);
    return "hsl(" + hue + ", " + SAT + "%, " + LIGHT + "%)";
  }

  function applyBackground(color) {
    document.body.style.backgroundColor = color;
    document.body.style.backgroundImage = 'none';
  }

  function tick() {
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i++) sum += data[i];
    const raw = data.length > 0 ? sum / data.length / 255 : 0;
    const smoothed = Math.sqrt(raw);
    currentLevel = currentLevel + (smoothed - currentLevel) * SMOOTH;
    applyBackground(volumeToColor(currentLevel));
    rafId = requestAnimationFrame(tick);
  }

  function startListening() {
    if (!stream || !audioContext || !analyser) return;
    if (audioContext.state === 'suspended') {
      audioContext.resume().then(function () {
        rafId = requestAnimationFrame(tick);
      });
    } else {
      rafId = requestAnimationFrame(tick);
    }
  }

  function stopListening() {
    if (rafId != null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (stream) {
      stream.getTracks().forEach(function (t) { t.stop(); });
      stream = null;
    }
    audioContext = null;
    analyser = null;
  }

  function onStart() {
    setError('');
    startBtn.disabled = true;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (mediaStream) {
        stream = mediaStream;
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.6;
        source.connect(analyser);

        intro.classList.add('hidden');
        active.classList.remove('hidden');
        startListening();
      })
      .catch(function (err) {
        startBtn.disabled = false;
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('Dostop do mikrofona je zavrnjen. Dovoli ga v nastavitvah brskalnika.');
        } else {
          setError('Mikrofon ni na voljo: ' + (err.message || 'napaka'));
        }
      });
  }

  startBtn.addEventListener('click', onStart);

  window.addEventListener('beforeunload', stopListening);
})();

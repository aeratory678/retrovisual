const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const audio = document.getElementById('audio');
const audioFile = document.getElementById('audioFile');
const startBtn = document.getElementById('startBtn');
const chaosText = document.getElementById('chaosText');
let stream;
let audioCtx, analyser, source;

// --- Audio Setup ---
function startAudioContext() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  analyser = audioCtx.createAnalyser();
  source = audioCtx.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  window._regl_analyser = analyser;
}

// --- Overlay Glitch Message ---
const overlay = document.getElementById('endOverlay');
const endMsg = document.getElementById('endMsg');
if (overlay && endMsg) {
  overlay.style.display = 'none';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '1000';
  overlay.style.background = 'rgba(10,0,20,0.85)';
  endMsg.style.fontFamily = `'Monoton', 'Orbitron', sans-serif`;
  endMsg.style.fontSize = '3em';
  endMsg.style.color = '#fff';
  endMsg.style.textShadow = '0 0 40px #0ff, 0 0 80px #f0f, 0 0 20px #fff';
  endMsg.style.letterSpacing = '2px';
  endMsg.style.animation = 'wildtext 1.5s infinite alternate, endGlitch 0.2s infinite';
}

let endGlitchInt;
function startEndGlitch() {
  if (!endMsg) return;
  endGlitchInt = setInterval(() => {
    endMsg.style.transform = `translate(${Math.random()*20-10}px,${Math.random()*20-10}px) scale(${1+Math.random()*0.2}) rotate(${Math.random()*10-5}deg)`;
    endMsg.style.color = `hsl(${Math.random()*360},100%,80%)`;
    endMsg.style.textShadow = `0 0 ${Math.random()*80}px #${Math.random()>0.5?'0ff':'f0f'}`;
    endMsg.textContent = Math.random()>0.8 ? '404. Mµ$ic Fini§hed. Add More.' : '404. Music Finished. Add More.';
  }, 120);
}
function stopEndGlitch() { clearInterval(endGlitchInt); }

if (audio && overlay) {
  audio.addEventListener('ended', () => {
    overlay.style.display = 'flex';
    startEndGlitch();
  });
  overlay.onclick = () => {
    overlay.style.display = 'none';
    stopEndGlitch();
  };
}

// --- Start Button ---
startBtn.onclick = async () => {
  if (audioFile.files[0]) {
    audio.src = URL.createObjectURL(audioFile.files[0]);
    audio.load();
    startAudioContext();
    audio.play();
  } else {
    alert('Please select an audio file!');
  }
};

// --- Responsive Canvas ---
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

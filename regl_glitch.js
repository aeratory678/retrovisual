// Minimal regl setup for glitch effect
// This file is loaded by a <script> tag in your HTML

// Load regl from CDN if not present
if (!window.createREGL) {
  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/regl/dist/regl.min.js';
  document.head.appendChild(script);
}

window.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('visualizer');
  const regl = window.createREGL ? window.createREGL({canvas}) : null;
  if (!regl) return;

  // Simple glitch shader
  const drawGlitch = regl({
    frag: `
    precision mediump float;
    uniform float time, intensity;
    varying vec2 uv;
    void main() {
      float glitch = sin(uv.y * 40.0 + time * 10.0) * 0.02 * intensity;
      float r = uv.x + glitch;
      float g = uv.x - glitch;
      float b = uv.x + glitch * 0.5;
      gl_FragColor = vec4(r, g, b, 1.0);
    }
    `,
    vert: `
    precision mediump float;
    attribute vec2 position;
    varying vec2 uv;
    void main() {
      uv = 0.5 * (position + 1.0);
      gl_Position = vec4(position, 0, 1);
    }
    `,
    attributes: {
      position: [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1]
      ]
    },
    elements: [
      [0, 1, 2],
      [2, 3, 0]
    ],
    uniforms: {
      time: regl.context('time'),
      intensity: regl.prop('intensity')
    }
  });

  // Animation loop
  function render(intensity) {
    regl.clear({color: [0,0,0,1]});
    drawGlitch({intensity});
  }

  // Hook up to your audio analyser
  let analyser = window._regl_analyser;
  function loop() {
    let intensity = 0.5;
    if (analyser) {
      let freqData = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(freqData);
      intensity = Math.min(1, freqData.reduce((a,b)=>a+b,0)/(freqData.length*255));
    }
    render(intensity);
    requestAnimationFrame(loop);
  }
  loop();
});

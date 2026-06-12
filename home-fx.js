/* ===== Home page FX: intro loader + hero particle network + magnetic button ===== */
(function () {
  'use strict';
  var reduced = !window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

  /* ============ 1. INTRO LOADER: typing then fade ============ */
  var intro = document.getElementById('intro');
  var typeEl = document.getElementById('intro-type');
  if (intro) {
    if (reduced) { intro.remove(); }
    else {
      var word = 'EnderDev';
      var i = 0;
      (function typeNext() {
        if (i <= word.length) {
          typeEl.textContent = word.slice(0, i);
          i++;
          setTimeout(typeNext, 110 + Math.random() * 80);
        } else {
          setTimeout(function () {
            intro.classList.add('out');
            setTimeout(function () { intro.remove(); }, 900);
          }, 600);
        }
      })();
      // safety: never block the page longer than 4s
      setTimeout(function () {
        if (document.getElementById('intro')) {
          intro.classList.add('out');
          setTimeout(function () { intro.remove(); }, 900);
        }
      }, 4000);
    }
  }

  /* ============ 2. HERO PARTICLE NETWORK (canvas) ============ */
  var canvas = document.getElementById('hero-net');
  if (canvas) {
    var hero = canvas.parentElement;
    var ctx = canvas.getContext('2d');
    var P = [], mouse = { x: -9999, y: -9999 };
    var DPR = Math.min(window.devicePixelRatio || 1, 2);

    function sizeCanvas() {
      var r = hero.getBoundingClientRect();
      canvas.width = r.width * DPR;
      canvas.height = r.height * DPR;
      canvas.style.width = r.width + 'px';
      canvas.style.height = r.height + 'px';
      var n = Math.floor(r.width * r.height / 18000);
      P = [];
      for (var i = 0; i < n; i++) {
        P.push({
          x: Math.random() * r.width, y: Math.random() * r.height,
          vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
          r: 1.2 + Math.random() * 1.8
        });
      }
    }
    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);

    hero.addEventListener('pointermove', function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    hero.addEventListener('pointerleave', function () { mouse.x = -9999; mouse.y = -9999; });

    function drawNet() {
      var w = canvas.width / DPR, h = canvas.height / DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < P.length; i++) {
        var p = P[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        var dmx = mouse.x - p.x, dmy = mouse.y - p.y;
        var dm = Math.sqrt(dmx * dmx + dmy * dmy);
        if (dm < 140 && dm > 0.01) { p.x += dmx / dm * .6; p.y += dmy / dm * .6; }
      }
      for (var a = 0; a < P.length; a++) {
        for (var b = a + 1; b < P.length; b++) {
          var dx = P[a].x - P[b].x, dy = P[a].y - P[b].y;
          var d2 = dx * dx + dy * dy;
          if (d2 < 120 * 120) {
            var alpha = 1 - Math.sqrt(d2) / 120;
            ctx.strokeStyle = 'rgba(113,148,196,' + (alpha * .3).toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(P[a].x, P[a].y);
            ctx.lineTo(P[b].x, P[b].y);
            ctx.stroke();
          }
        }
      }
      for (var k = 0; k < P.length; k++) {
        var q = P[k];
        var nearMouse = Math.hypot(mouse.x - q.x, mouse.y - q.y) < 140;
        ctx.fillStyle = nearMouse ? 'rgba(229,210,131,.95)' : 'rgba(113,148,196,.6)';
        ctx.beginPath();
        ctx.arc(q.x, q.y, q.r, 0, 6.2832);
        ctx.fill();
      }
      if (!reduced) requestAnimationFrame(drawNet);
    }
    drawNet();
  }

  /* ============ 3. MAGNETIC BUTTON ============ */
  document.querySelectorAll('.magnet').forEach(function (btn) {
    var inner = btn.querySelector('span');
    btn.addEventListener('pointermove', function (e) {
      var r = btn.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width / 2);
      var dy = e.clientY - (r.top + r.height / 2);
      btn.style.transform = 'translate(' + dx * .25 + 'px,' + dy * .25 + 'px)';
      if (inner) inner.style.transform = 'translate(' + dx * .12 + 'px,' + dy * .12 + 'px)';
    });
    btn.addEventListener('pointerleave', function () {
      btn.style.transform = '';
      if (inner) inner.style.transform = '';
    });
  });
})();

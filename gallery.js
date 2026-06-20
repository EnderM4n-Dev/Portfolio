/* ===== Project gallery + zoom lightbox ===== */
(function () {
  'use strict';

  /* per-card gallery: thumbs switch the main image */
  document.querySelectorAll('[data-gallery]').forEach(function (gal) {
    var main = gal.querySelector('.gal-main img');
    var thumbs = gal.querySelectorAll('.thumb');
    var sources = Array.from(thumbs).map(function (t) { return t.dataset.src; });
    var idx = 0;

    function show(i) {
      idx = (i + sources.length) % sources.length;
      main.src = sources[idx];
      thumbs.forEach(function (t, k) { t.classList.toggle('active', k === idx); });
    }
    thumbs.forEach(function (t, k) {
      t.addEventListener('click', function () { show(k); });
    });
    gal.querySelector('.prev').addEventListener('click', function () { show(idx - 1); });
    gal.querySelector('.next').addEventListener('click', function () { show(idx + 1); });

    /* clicking main image opens lightbox at current index */
    main.addEventListener('click', function () { openLightbox(sources, idx); });
    gal.querySelector('.gal-zoom-hint').addEventListener('click', function () { openLightbox(sources, idx); });
  });

  /* ----- lightbox ----- */
  var lb = document.getElementById('lightbox');
  if (!lb) return;
  var lbImg = lb.querySelector('.lb-img');
  var lbCounter = lb.querySelector('.lb-counter');
  var lbList = [], lbIdx = 0;
  var scale = 1, tx = 0, ty = 0;

  function applyTransform() {
    lbImg.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')';
    lbImg.style.cursor = scale > 1 ? 'grab' : 'zoom-in';
  }
  function resetZoom() { scale = 1; tx = 0; ty = 0; applyTransform(); }

  function openLightbox(list, i) {
    lbList = list; lbIdx = i;
    lbImg.src = list[i];
    lbCounter.textContent = (i + 1) + ' / ' + list.length;
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    resetZoom();
  }
  function closeLightbox() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    resetZoom();
  }
  function nav(dir) {
    lbIdx = (lbIdx + dir + lbList.length) % lbList.length;
    lbImg.src = lbList[lbIdx];
    lbCounter.textContent = (lbIdx + 1) + ' / ' + lbList.length;
    resetZoom();
  }

  lb.querySelector('.lb-close').addEventListener('click', closeLightbox);
  lb.querySelector('.lb-prev').addEventListener('click', function () { nav(-1); });
  lb.querySelector('.lb-next').addEventListener('click', function () { nav(1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') nav(document.documentElement.dir === 'rtl' ? 1 : -1);
    if (e.key === 'ArrowRight') nav(document.documentElement.dir === 'rtl' ? -1 : 1);
  });

  /* click-to-zoom + drag to pan + wheel zoom */
  lbImg.addEventListener('click', function (e) {
    if (scale === 1) {
      scale = 2.2;
      var r = lbImg.getBoundingClientRect();
      tx = (r.width / 2 - (e.clientX - r.left)) * (scale - 1) / scale;
      ty = (r.height / 2 - (e.clientY - r.top)) * (scale - 1) / scale;
    } else { scale = 1; tx = 0; ty = 0; }
    applyTransform();
  });
  lbImg.addEventListener('wheel', function (e) {
    e.preventDefault();
    var d = e.deltaY < 0 ? 0.15 : -0.15;
    scale = Math.max(1, Math.min(4, scale + d));
    if (scale === 1) { tx = 0; ty = 0; }
    applyTransform();
  }, { passive: false });

  var dragging = false, startX = 0, startY = 0;
  lbImg.addEventListener('pointerdown', function (e) {
    if (scale === 1) return;
    dragging = true; startX = e.clientX - tx; startY = e.clientY - ty;
    lbImg.style.cursor = 'grabbing';
    lbImg.setPointerCapture(e.pointerId);
  });
  lbImg.addEventListener('pointermove', function (e) {
    if (!dragging) return;
    tx = e.clientX - startX; ty = e.clientY - startY;
    applyTransform();
  });
  lbImg.addEventListener('pointerup', function () {
    dragging = false; if (scale > 1) lbImg.style.cursor = 'grab';
  });
})();

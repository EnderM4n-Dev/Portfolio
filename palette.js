/* ===== Palette + day/night system — shared across all pages =====
   Applies the saved palette & mode (CSS vars + background-shader colors)
   on every page, and exposes window.__applyPalette(id, mode) for the
   Tweaks panel on Home. */
(function () {
  'use strict';

  var PALETTES = {
    'navy-gold': {
      label_fa: 'نِیوی-طلایی', label_en: 'Navy-Gold',
      swatch: ['#213555', '#4F709C', '#E5D283', '#F0F0F1'],
      dark: {
        vars: {
          '--navy': '#213555', '--navy-deep': '#1a2a45', '--navy-soft': '#28406a',
          '--blue': '#4F709C', '--blue-bright': '#7194c4', '--gold': '#E5D283', '--light': '#F0F0F1',
          '--muted': 'rgba(240,240,241,0.6)', '--faint': 'rgba(240,240,241,0.08)', '--line': 'rgba(240,240,241,0.12)'
        },
        shader: ['#213555', '#4F709C', '#E5D283', '#F0F0F1']
      },
      light: {
        vars: {
          '--navy': '#213555', '--navy-deep': '#1a2a45', '--navy-soft': '#28406a',
          '--blue': '#4F709C', '--blue-bright': '#3f5d86', '--gold': '#E5D283', '--light': '#213555',
          '--ink': '#213555', '--paper': '#F0F0F1', '--accent': '#4F709C',
          '--muted': 'rgba(33,53,85,0.55)', '--faint': 'rgba(33,53,85,0.06)', '--line': 'rgba(33,53,85,0.14)'
        },
        shader: ['#EAEEF4', '#A9BBD6', '#E5D283', '#FFFFFF']
      }
    },
    'steel': {
      label_fa: 'فولادی', label_en: 'Steel',
      swatch: ['#1B2A4A', '#44587C', '#9FA9BC', '#ECF2F9'],
      dark: {
        vars: {
          '--navy': '#1B2A4A', '--navy-deep': '#141f38', '--navy-soft': '#293c61',
          '--blue': '#44587C', '--blue-bright': '#8a99b6', '--gold': '#9FA9BC', '--light': '#ECF2F9',
          '--muted': 'rgba(236,242,249,0.6)', '--faint': 'rgba(236,242,249,0.08)', '--line': 'rgba(236,242,249,0.13)'
        },
        shader: ['#1B2A4A', '#44587C', '#9FA9BC', '#ECF2F9']
      },
      light: {
        vars: {
          '--navy': '#1B2A4A', '--navy-deep': '#141f38', '--navy-soft': '#293c61',
          '--blue': '#44587C', '--blue-bright': '#3a4d70', '--gold': '#9FA9BC', '--light': '#1B2A4A',
          '--ink': '#1B2A4A', '--paper': '#EEF2F8', '--accent': '#44587C',
          '--muted': 'rgba(27,42,74,0.55)', '--faint': 'rgba(27,42,74,0.06)', '--line': 'rgba(27,42,74,0.14)'
        },
        shader: ['#E7ECF4', '#AEBACE', '#C2CCDA', '#FFFFFF']
      }
    },
    'alpine': {
      label_fa: 'آلپاین اِکو', label_en: 'Alpine Echo',
      swatch: ['#95b2f8', '#5271c0', '#506695', '#283b60'],
      dark: {
        vars: {
          '--navy': '#283b60', '--navy-deep': '#1f2c48', '--navy-soft': '#34487a',
          '--blue': '#506695', '--blue-bright': '#95b2f8', '--gold': '#b4bef1', '--light': '#edf0fb',
          '--muted': 'rgba(237,240,251,0.6)', '--faint': 'rgba(237,240,251,0.08)', '--line': 'rgba(237,240,251,0.12)'
        },
        shader: ['#283b60', '#506695', '#95b2f8', '#b4bef1']
      },
      light: {
        vars: {
          '--navy': '#283b60', '--navy-deep': '#1f2c48', '--navy-soft': '#34487a',
          '--blue': '#506695', '--blue-bright': '#455d86', '--gold': '#5271c0', '--light': '#283b60',
          '--ink': '#283b60', '--paper': '#EEF1FB', '--accent': '#506695',
          '--muted': 'rgba(40,59,96,0.55)', '--faint': 'rgba(40,59,96,0.06)', '--line': 'rgba(40,59,96,0.14)'
        },
        shader: ['#E7ECF9', '#AFC0EE', '#95b2f8', '#FFFFFF']
      }
    },
    'sapphire': {
      label_fa: 'سفایر نایت‌فال', label_en: 'Sapphire Nightfall',
      swatch: ['#0474c4', '#a8c4ec', '#5379ae', '#2e454d'],
      dark: {
        vars: {
          '--navy': '#133050', '--navy-deep': '#0e2236', '--navy-soft': '#1d4163',
          '--blue': '#5379ae', '--blue-bright': '#6fb0e2', '--gold': '#2e9fe0', '--light': '#e8eef5',
          '--muted': 'rgba(232,238,245,0.6)', '--faint': 'rgba(232,238,245,0.08)', '--line': 'rgba(232,238,245,0.12)'
        },
        shader: ['#133050', '#0474c4', '#a8c4ec', '#2e454d']
      },
      light: {
        vars: {
          '--navy': '#133050', '--navy-deep': '#0e2236', '--navy-soft': '#1d4163',
          '--blue': '#5379ae', '--blue-bright': '#3f6f9c', '--gold': '#0474c4', '--light': '#102a44',
          '--ink': '#102a44', '--paper': '#EAF1F8', '--accent': '#0474c4',
          '--muted': 'rgba(16,42,68,0.55)', '--faint': 'rgba(16,42,68,0.06)', '--line': 'rgba(16,42,68,0.14)'
        },
        shader: ['#E1ECF6', '#9FC6E9', '#0474c4', '#FFFFFF']
      }
    }
  };

  function toRGB(h) {
    return [parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255];
  }

  function apply(id, mode) {
    var pal = PALETTES[id] || PALETTES['navy-gold'];
    var variant = mode === 'day' ? pal.light : pal.dark;
    var r = document.documentElement;
    if (mode === 'day') r.setAttribute('data-theme', 'light');
    else r.removeAttribute('data-theme');
    Object.keys(variant.vars).forEach(function (k) { r.style.setProperty(k, variant.vars[k]); });
    window.__PALETTE_SHADER = variant.shader.map(toRGB);
    window.__PALETTE_ID = id;
    window.__PALETTE_MODE = mode;
    if (window.__setBgColors) window.__setBgColors(window.__PALETTE_SHADER);
  }

  var savedId = null, savedMode = null;
  try {
    savedId = localStorage.getItem('pf-palette');
    savedMode = localStorage.getItem('pf-theme');
  } catch (e) {}

  window.__PALETTES = PALETTES;
  window.__applyPalette = function (id, mode) {
    if (id == null) id = window.__PALETTE_ID || 'navy-gold';
    if (mode == null) mode = window.__PALETTE_MODE || 'night';
    try {
      localStorage.setItem('pf-palette', id);
      localStorage.setItem('pf-theme', mode);
    } catch (e) {}
    apply(id, mode);
  };

  apply(
    savedId && PALETTES[savedId] ? savedId : 'navy-gold',
    savedMode === 'day' ? 'day' : 'night'
  );
})();

(function () {
  var STORAGE_KEY = 'mspdf-theme';

  var accentMap = {
    cobalt: {
      light: '#2D63D6', dark: '#6FA0FF',
      soft: 'rgba(45,99,214,0.09)', softD: 'rgba(111,160,255,0.13)'
    }
  };

  function effectiveDark(theme) {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyAccent(theme) {
    var a = accentMap.cobalt;
    var dark = effectiveDark(theme);
    document.body.style.setProperty('--accent', dark ? a.dark : a.light);
    document.body.style.setProperty('--accent-soft', dark ? a.softD : a.soft);
  }

  function applyTheme(theme) {
    document.body.dataset.theme = theme;
    applyAccent(theme);
    document.querySelectorAll('.theme-btn').forEach(function (btn) {
      var active = btn.dataset.themeTarget === theme;
      btn.style.background = active ? 'var(--accent-soft)' : 'transparent';
      btn.style.color = active ? 'var(--accent)' : 'var(--ink-faint)';
    });
  }

  function setTheme(theme) {
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
    applyTheme(theme);
  }

  // Apply saved theme before paint to avoid flash
  var saved = 'system';
  try { saved = localStorage.getItem(STORAGE_KEY) || 'system'; } catch (e) {}
  document.body.dataset.theme = saved;

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(saved);

    document.querySelectorAll('.theme-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setTheme(btn.dataset.themeTarget);
      });
    });

    // React to OS-level preference changes when in auto mode
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
        var current;
        try { current = localStorage.getItem(STORAGE_KEY) || 'system'; } catch (e) { current = 'system'; }
        if (current === 'system') applyAccent('system');
      });
    }
  });
})();

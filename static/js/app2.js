// static/js/app2.js
// All Airports panel toggles (adapted from Episearch app2.js)

let PANEL_MODE = 'none'; // 'none' | 'airports'

function renderAllAirportsSimple() {
  // forward to the showAllAirports in app.js
  if (typeof window.showAllAirports === 'function') {
    window.showAllAirports();
  }
}

function showPanelMode(mode) {
  const panel = document.getElementById('allAirportsPanel');
  if (mode === 'airports') {
    renderAllAirportsSimple();
    panel.classList.remove('hidden');
    PANEL_MODE = 'airports';
  }
}

function toggleAllTests() {
  const panel = document.getElementById('allAirportsPanel');
  const visible = !panel.classList.contains('hidden');
  if (visible && PANEL_MODE === 'airports') {
    panel.classList.add('hidden');
    PANEL_MODE = 'none';
  } else {
    showPanelMode('airports');
  }
}

function clearAllTests() {
  const panel = document.getElementById('allAirportsPanel');
  panel.classList.add('hidden');
  PANEL_MODE = 'none';
}

window.toggleAllTests = toggleAllTests;
window.clearAllTests = clearAllTests;

window.addEventListener('DOMContentLoaded', () => {
  // wire clear button inside panel if present (id: clearAllTests)
  const clearBtn = document.getElementById('clearAllTests');
  if (clearBtn) clearBtn.addEventListener('click', clearAllTests);
});

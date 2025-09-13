// static/js/app.js
// Live IATA search frontend (debounced, dynamic)
// Uses API endpoints: /api/search?q= and /api/airport/<IATA>

(() => {
  const qInput = document.getElementById('searchInput');
  const resultsPanel = document.getElementById('resultsPanel');
  const resultsContainer = document.getElementById('resultsContainer');
  const allAirportsPanel = document.getElementById('allAirportsPanel');
  const allAirportsContainer = document.getElementById('allAirportsContainer');
  const detailPanel = document.getElementById('detailPanel');

  const detailName = document.getElementById('detailName');
  const detailIATA = document.getElementById('detailIATA');
  const detailICAO = document.getElementById('detailICAO');
  const detailCity = document.getElementById('detailCity');
  const detailState = document.getElementById('detailState');
  const detailAirlines = document.getElementById('detailAirlines');
  const detailDestinations = document.getElementById('detailDestinations');
  const detailSub = document.getElementById('detailSub');
  const flightsContainer = document.getElementById('flightsContainer');
  const mapsLink = document.getElementById('mapsLink');

  // Debounce helper
  function debounce(fn, wait = 220) {
    let t = null;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  // Render list of matched airports (cards) — live
  function renderResults(list) {
    resultsContainer.innerHTML = '';
    detailPanel.classList.add('hidden');

    if (!list || list.length === 0) {
      resultsContainer.innerHTML = `<div class="text-sm text-gray-500">No matches.</div>`;
      resultsPanel.classList.remove('hidden');
      return;
    }

    resultsPanel.classList.remove('hidden');
    list.forEach(item => {
      const el = document.createElement('div');
      el.className = 'result-card rounded-xl p-4 bg-white border border-white/40 cursor-pointer hover:scale-[1.01] transition-transform';
      el.innerHTML = `
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-orange-900">${item.name}</h3>
            <div class="text-xs text-gray-500 mt-1">${item.city}, ${item.state}</div>
          </div>
          <div class="text-right">
            <div class="text-lg font-bold text-orange-700">${item.iata || '—'}</div>
            <div class="text-xs text-gray-500 mt-1">${item.icao || ''}</div>
          </div>
        </div>
      `;
      el.addEventListener('click', () => openAirport(item.iata || item.icao || item.name));
      resultsContainer.appendChild(el);
    });
  }

  // Search API call (called by input event)
  async function performSearch(q) {
    const query = (q || '').trim();
    if (!query || query.length < 1) {
      resultsPanel.classList.add('hidden');
      return;
    }
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const json = await res.json();
      renderResults(json.results || []);
    } catch (err) {
      console.error('Search error', err);
    }
  }

  const liveSearch = debounce((e) => performSearch(e.target.value), 180);

  // Open airport details (IATA preferred)
  async function openAirport(iataOrKey) {
    if (!iataOrKey) return;
    let payload;

    // If 3 letters -> try directly
    if (iataOrKey.length === 3) {
      const r = await fetch(`/api/airport/${iataOrKey}`);
      if (r.ok) {
        payload = await r.json();
      } else {
        // fallback: search API
        const sr = await fetch(`/api/search?q=${encodeURIComponent(iataOrKey)}`);
        const srj = await sr.json();
        const first = (srj.results || [])[0];
        if (!first) { alert('Airport not found'); return; }
        const r2 = await fetch(`/api/airport/${first.iata}`);
        if (r2.ok) payload = await r2.json();
      }
    } else {
      const sr = await fetch(`/api/search?q=${encodeURIComponent(iataOrKey)}`);
      const srj = await sr.json();
      const first = (srj.results || [])[0];
      if (!first) { alert('Airport not found'); return; }
      const r2 = await fetch(`/api/airport/${first.iata}`);
      if (r2.ok) payload = await r2.json();
    }

    if (!payload) { alert('No data'); return; }

    // Fill detail panel
    detailName.textContent = payload.name || `${payload.city || ''} ${payload.iata || ''}`;
    detailIATA.textContent = payload.iata || '—';
    detailICAO.textContent = payload.icao || '—';
    detailCity.textContent = payload.city || '—';
    detailState.textContent = payload.state || '—';
    detailAirlines.textContent = payload.airlines || '—';
    detailDestinations.textContent = payload.destinations || '—';
    detailSub.textContent = `${payload.city || ''} — ${payload.name || ''}`;

    // flights
    flightsContainer.innerHTML = '';
    if (payload.flights && payload.flights.length) {
      const t = document.createElement('table');
      t.className = 'w-full text-sm';
      t.innerHTML = `<thead><tr class="text-left"><th>Flight</th><th>Airline</th><th>To</th><th>Departure (UTC)</th></tr></thead>`;
      const tbody = document.createElement('tbody');
      payload.flights.forEach(f => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${f.flight_number}</td><td>${f.airline}</td><td>${f.to_city} (${f.to_iata})</td><td>${new Date(f.departure_utc).toUTCString()}</td>`;
        tbody.appendChild(tr);
      });
      t.appendChild(tbody);
      flightsContainer.appendChild(t);
    } else {
      flightsContainer.innerHTML = '<div class="text-sm text-gray-500">No flights data.</div>';
    }

    const mapsQuery = encodeURIComponent(`${payload.name} ${payload.city}`);
    mapsLink.href = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

    detailPanel.classList.remove('hidden');
    detailPanel.scrollIntoView({behavior: 'smooth', block: 'start'});
  }

  // Show all airports (used by app2.js)
  window.showAllAirports = async function showAllAirports() {
    allAirportsContainer.innerHTML = '<div class="text-sm text-gray-500">Loading…</div>';
    allAirportsPanel.classList.remove('hidden');
    try {
      const res = await fetch('/api/airports');
      const j = await res.json();
      const arr = j.airports || [];
      allAirportsContainer.innerHTML = '';
      arr.forEach(a => {
        const el = document.createElement('div');
        el.className = 'p-3 border rounded-md cursor-pointer hover:bg-white/60';
        el.innerHTML = `<div class="flex justify-between"><div><strong>${a.name}</strong><div class="text-xs text-gray-500">${a.city}, ${a.state}</div></div><div class="text-right"><div class="text-sm font-bold">${a.iata || '—'}</div><div class="text-xs">${a.icao || ''}</div></div></div>`;
        el.addEventListener('click', () => openAirport(a.iata || a.icao || a.name));
        allAirportsContainer.appendChild(el);
      });
    } catch (err) {
      allAirportsContainer.innerHTML = '<div class="text-sm text-red-500">Failed to load.</div>';
      console.error(err);
    }
  };

  // Bind events
  qInput.addEventListener('input', liveSearch);
  qInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      qInput.value = '';
      resultsPanel.classList.add('hidden');
      detailPanel.classList.add('hidden');
    }
  });

  document.getElementById('clearBtn').addEventListener('click', () => {
    qInput.value = '';
    resultsPanel.classList.add('hidden');
    detailPanel.classList.add('hidden');
    allAirportsPanel.classList.add('hidden');
  });

  document.getElementById('allBtn').addEventListener('click', () => {
    if (typeof window.toggleAllTests === 'function') {
      // use app2.js toggle if present
      window.toggleAllTests();
    } else {
      window.showAllAirports();
    }
  });

  // On load: if query param ?q=... present, start search
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('q')) {
    qInput.value = urlParams.get('q');
    performSearch(qInput.value);
  }
})();

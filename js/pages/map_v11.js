// Definitive Kindr Map Engine - v12 (Gemini Powered)
window.KindrMap = {
    instance: null,
    isInitialized: false,
    markers: [],
    currentFilter: 'all',

    render: (container) => {
        console.log("Rendering Kindr Map v12...");
        if (!window.KindrMap.isInitialized) {
            window.KindrMap.init(container);
        }

        // Ensure visibility
        container.style.display = 'block';
        if (window.KindrMap.instance) {
            window.KindrMap.instance.invalidateSize();
            setTimeout(() => window.KindrMap.instance.invalidateSize(), 300);
        }
    },

    init: (container) => {
        if (window.KindrMap.isInitialized) return;

        console.log("Initializing Definitive Map Engine...");

        // Setup the Base Map
        const map = L.map(container, {
            zoomControl: false,
            attributionControl: false,
            tap: true
        }).setView([41.6520, -4.7286], 13); // Default to Valladolid Center

        // Base Layer - OpenStreetMap (Reliable)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        // Branded Blue Filter (Tinting via CSS)
        setTimeout(() => {
            const pane = document.querySelector('.leaflet-tile-pane');
            if (pane) pane.style.filter = "sepia(1) hue-rotate(190deg) saturate(1.2) contrast(0.9) brightness(1.05)";
        }, 100);

        window.KindrMap.instance = map;
        window.KindrMap.isInitialized = true;

        // UI Injections
        window.KindrMap.injectUI(container);

        // Load Markers
        window.KindrMap.loadMarkers();

        // Check for Geolocation
        window.KindrMap.tryAutoLocate();
    },

    injectUI: (container) => {
        // Search & Filter Overlay
        const overlay = document.createElement('div');
        overlay.className = 'map-search-container';
        overlay.innerHTML = `
            <div class="map-search-bar">
                <span class="gemini-sparkle">✨</span>
                <input type="text" id="map-search-input" class="map-search-input" placeholder="Pregunta a Gemini o busca un lugar...">
                <button id="locate-me-btn" class="locate-me-btn">📍</button>
            </div>
            <div id="search-results-list"></div>
            <div class="map-filters">
                <div class="filter-chip active" data-type="all">Todos</div>
                <div class="filter-chip" data-type="park">Parques 🌳</div>
                <div class="filter-chip" data-type="culture">Cultura 🎭</div>
                <div class="filter-chip" data-type="museum">Museos 🖼️</div>
                <div class="filter-chip" data-type="food">Comida 🍏</div>
            </div>
        `;
        container.appendChild(overlay);

        // Event Listeners
        const input = document.getElementById('map-search-input');
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') window.KindrMap.handleSearch(input.value);
        });

        document.getElementById('locate-me-btn').addEventListener('click', () => window.KindrMap.locateUser());

        // Chips
        const chips = document.querySelectorAll('.filter-chip');
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                window.KindrMap.filterMarkers(chip.dataset.type);
            });
        });
    },

    loadMarkers: () => {
        const locations = window.KindrData.getLocations();
        window.KindrMap.clearMarkers();

        locations.forEach(loc => {
            const marker = window.KindrMap.createMarker(loc);
            window.KindrMap.markers.push({ instance: marker, data: loc });
        });
    },

    createMarker: (loc) => {
        // Blue Star Glow Icon
        const starIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="star-marker-container"><div class="star-icon">⭐</div></div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 20],
            popupAnchor: [0, -20]
        });

        const popupContent = `
            <div class="popup-premium">
                ${loc.image ? `<img src="${loc.image}" class="popup-img">` : '<div class="popup-img"></div>'}
                <div class="popup-body">
                    <h3>${loc.name}</h3>
                    <div class="popup-meta">
                        <span class="popup-rating">⭐ ${loc.rating}</span>
                        <span>${loc.reviews} reviews</span>
                    </div>
                </div>
            </div>
        `;

        const marker = L.marker([loc.lat, loc.lng], { icon: starIcon }).addTo(window.KindrMap.instance);
        marker.bindPopup(popupContent);
        return marker;
    },

    clearMarkers: () => {
        window.KindrMap.markers.forEach(m => window.KindrMap.instance.removeLayer(m.instance));
        window.KindrMap.markers = [];
    },

    filterMarkers: (type) => {
        window.KindrMap.currentFilter = type;
        window.KindrMap.markers.forEach(m => {
            if (type === 'all' || m.data.type === type) {
                if (!window.KindrMap.instance.hasLayer(m.instance)) m.instance.addTo(window.KindrMap.instance);
            } else {
                window.KindrMap.instance.removeLayer(m.instance);
            }
        });
    },

    handleSearch: async (query) => {
        if (!query) return;

        const input = document.getElementById('map-search-input');
        input.disabled = true;
        input.placeholder = "IA Gemini analizando...";

        // MAGIC: Use Gemini for Intent Analysis
        try {
            const intent = await window.KindrMap.analyzeWithGemini(query);
            console.log("Gemini Intent:", intent);

            if (intent.type === 'geocoding') {
                await window.KindrMap.performGeocoding(intent.location);
            } else if (intent.type === 'category') {
                window.KindrMap.filterMarkers(intent.category);
                // Fly to best center for that category
                const filtered = window.KindrMap.markers.filter(m => m.data.type === intent.category);
                if (filtered.length > 0) {
                    const group = new L.featureGroup(filtered.map(f => f.instance));
                    window.KindrMap.instance.fitBounds(group.getBounds().pad(0.5));
                }
            } else {
                // Default to photon geocoding
                await window.KindrMap.performGeocoding(query);
            }
        } catch (e) {
            console.error("Gemini Search Failed, falling back to basic:", e);
            await window.KindrMap.performGeocoding(query);
        } finally {
            input.disabled = false;
            input.placeholder = "Busca lo que quieras...";
        }
    },

    analyzeWithGemini: async (query) => {
        if (!window.GEMINI_KEY || window.GEMINI_KEY.includes('PEGAR_AQUI')) {
            throw new Error("No API Key");
        }

        const prompt = `Analiza esta búsqueda de un usuario en una app de Castilla y León: "${query}". 
        Devuelve SOLO un JSON con este formato:
        { "type": "geocoding" | "category" | "mixed", "location": "nombre ciudad o sitio", "category": "park" | "culture" | "museum" | "food", "reasoning": "breve" }
        Si busca un sitio concreto, usa "geocoding". Si busca planes generales, usa "category".`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${window.GEMINI_KEY}`, {
            method: 'POST',
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        // Clean JSON from markdown if exists
        const cleanJson = text.replace(/```json|```/g, '').trim();
        return JSON.parse(cleanJson);
    },

    performGeocoding: async (place) => {
        const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(place)}&limit=1`);
        const data = await response.json();

        if (data.features && data.features.length > 0) {
            const coord = data.features[0].geometry.coordinates;
            window.KindrMap.instance.flyTo([coord[1], coord[0]], 15);
        }
    },

    locateUser: () => {
        window.KindrMap.instance.locate({ setView: true, maxZoom: 16 });
    },

    tryAutoLocate: () => {
        // Silent locate if allowed
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then(result => {
                if (result.state === 'granted') window.KindrMap.locateUser();
            });
        }
    }
};

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
            // CRITICAL: Multiple invalidations to ensure layout is captured
            const invalidator = setInterval(() => {
                window.KindrMap.instance.invalidateSize();
            }, 500);

            // Stop after 3 seconds of trying to fix layout
            setTimeout(() => clearInterval(invalidator), 3500);

            window.KindrMap.instance.invalidateSize();
        }
    },

    init: (container) => {
        if (window.KindrMap.isInitialized) return;

        console.log("Initializing Definitive Map Engine v12...");

        // Setup the Base Map with Canvas for maximum performance
        const map = L.map(container, {
            zoomControl: false,
            attributionControl: false,
            tap: true,
            preferCanvas: true
        }).setView([41.6520, -4.7286], 13); // Default to Valladolid Center

        // Switching to Google Maps Tiles for better performance and familiarity
        L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            maxZoom: 20
        }).addTo(map);

        // Ultimate fix para problema de celdas/cuadrículas en dispositivos móviles usando ResizeObserver
        const resizeObserver = new ResizeObserver(() => {
            map.invalidateSize();
        });
        resizeObserver.observe(container);

        // REMOVED: CSS filters which cause choppiness on mobile

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
                    <!-- External Link Magic -->
                    <button class="btn-external-maps" onclick="window.KindrMap.openExternal('${loc.name}', ${loc.lat}, ${loc.lng})">
                        🚙 Abrir en Google Maps
                    </button>
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
        // MAGIA BETA FUNCIONAL: Si no hay clave, simulamos el analizador semántico de manera robusta
        if (!window.GEMINI_KEY || window.GEMINI_KEY.includes('PEGAR_AQUI')) {
            console.log("Modo IA Simulado en ejecución porque no se proveyó clave de Gemini.");
            const queryLower = query.toLowerCase();

            // Reglas semánticas locales de la Demo
            if (queryLower.match(/parque|verde|jugar|aire|naturaleza/)) return { type: "category", category: "park" };
            if (queryLower.match(/cultura|museo|arte|historia|exposicion/)) return { type: "category", category: "culture" };
            if (queryLower.match(/comida|comer|hambre|restaurante|cafeteria|cafe/)) return { type: "category", category: "food" };

            // Fallback a geolocalización tradicional
            return { type: "geocoding", location: query };
        }

        const prompt = `Analiza esta búsqueda de un usuario en una app de Castilla y León: "${query}". 
        Devuelve SOLO un JSON con este formato:
        { "type": "geocoding" | "category" | "mixed", "location": "nombre ciudad o sitio", "category": "park" | "culture" | "museum" | "food", "reasoning": "breve" }
        Si busca un sitio concreto, usa "geocoding". Si busca planes generales, usa "category".`;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${window.GEMINI_KEY}`, {
                method: 'POST',
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });

            if (!response.ok) {
                console.error("Gemini HTTP Error:", response.status);
                // Fallback a lógico
                return { type: "geocoding", location: query };
            }

            const data = await response.json();

            if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
                const text = data.candidates[0].content.parts[0].text;
                const cleanJson = text.replace(/```json|```/g, '').trim();
                return JSON.parse(cleanJson);
            } else {
                console.warn("Gemini Response malformed.", data);
                return { type: "geocoding", location: query };
            }

        } catch (e) {
            console.error("Error connecting to Gemini API:", e);
            return { type: "geocoding", location: query };
        }
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
        if (!navigator.geolocation) {
            alert("Tu navegador no soporta geolocalización.");
            return;
        }

        const input = document.getElementById('map-search-input');
        if (input) input.placeholder = "Buscando tu ubicación...";

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                // Efecto de visualización suave hacia la ubicación
                window.KindrMap.instance.setView([lat, lng], 16);

                // Añadir un marcador de usuario en tiempo real si no existe
                if (!window.KindrMap.userMarker) {
                    const userIcon = L.divIcon({
                        className: 'user-loc-icon',
                        html: '<div style="width:20px;height:20px;background:#4CC9F0;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(0,0,0,0.5); animation: pulse 1.5s infinite;"></div>',
                        iconSize: [20, 20],
                        iconAnchor: [10, 10]
                    });
                    window.KindrMap.userMarker = L.marker([lat, lng], { icon: userIcon, zIndexOffset: 1000 }).addTo(window.KindrMap.instance);
                    window.KindrMap.userMarker.bindPopup('<div style="font-weight:bold;color:var(--primary-navy)">¡Estás aquí!</div>').openPopup();
                } else {
                    window.KindrMap.userMarker.setLatLng([lat, lng]);
                    window.KindrMap.userMarker.openPopup();
                }

                if (input) input.placeholder = "Pregunta lo que necesites...";
            },
            (error) => {
                console.warn("Geolocalización falló:", error);
                if (input) input.placeholder = "Error de GPS. Busca un lugar manual.";
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    },

    openExternal: (name, lat, lng) => {
        // Safe Google Maps Intent
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}&query_place_id=${lat},${lng}`;
        // For mobile, this typically triggers the native app. 
        // Fallback is the browser.
        window.open(url, '_blank');
    },

    tryAutoLocate: () => {
        // Silent locate if allowed
        try {
            if (navigator.permissions && navigator.permissions.query) {
                navigator.permissions.query({ name: 'geolocation' }).then(result => {
                    if (result.state === 'granted') window.KindrMap.locateUser();
                }).catch(e => console.warn('Geolocation permission query failed:', e));
            }
        } catch (e) {
            console.warn('Geolocation permissions not fully supported:', e);
        }
    }
};

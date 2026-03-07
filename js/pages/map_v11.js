// Definitive Kidoa 3D Map Engine - v2.0.0 (MapLibre GL)
window.KidoaMap = {
    instance: null,
    isInitialized: false,
    markers: [],
    currentFilter: 'all',
    userMarker: null,

    render: async (container) => {
        console.log("Rendering Kidoa 3D Map v2.0.0...");
        container.style.display = 'block';

        if (!window.KidoaMap.isInitialized) {
            await window.KidoaMap.init(container);
        } else {
            // Resize handler for MapLibre
            window.KidoaMap.instance.resize();
        }
    },

    init: async (container) => {
        if (window.KidoaMap.isInitialized && window.KidoaMap.instance) return;

        try {
            // MapLibre Initialization
            window.KidoaMap.instance = new maplibregl.Map({
                container: container,
                style: 'https://demotiles.maplibre.org/style.json', // Basic style, can be swapped for Google-like tiles
                center: [-4.7286, 41.6520], // [lng, lat]
                zoom: 15,
                pitch: 45, // 3D Inclination
                bearing: 0,
                antialias: true
            });

            // Add standard navigation controls (zoom only, we'll use custom for others)
            // window.KidoaMap.instance.addControl(new maplibregl.NavigationControl(), 'top-right');

            window.KidoaMap.instance.on('load', async () => {
                window.KidoaMap.isInitialized = true;

                // Add Google-like Raster Layer if desired or stay with vector
                window.KidoaMap.instance.addSource('google-tiles', {
                    'type': 'raster',
                    'tiles': [
                        'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}'
                    ],
                    'tileSize': 256
                });
                window.KidoaMap.instance.addLayer({
                    'id': 'google-layer',
                    'type': 'raster',
                    'source': 'google-tiles',
                    'minzoom': 0,
                    'maxzoom': 22
                });

                window.KidoaMap.injectUI(container);
                await window.KidoaMap.loadMarkers();
                window.KidoaMap.startGPSWatch();
            });

            // Double Click for Pin
            window.KidoaMap.instance.on('dblclick', (e) => {
                window.KidoaMap.showAddSiteModal(e.lngLat.lat, e.lngLat.lng);
            });

        } catch (e) {
            console.error("KidoaMap 3D Init Failed:", e);
            container.innerHTML = `<div class="p-20 center-text"><h3>Cargando Mapa 3D...</h3></div>`;
        }
    },

    injectUI: (container) => {
        // Reuse overlay structure from v1 but ensure it doesn't duplicate
        if (document.querySelector('.map-search-container')) return;

        const overlay = document.createElement('div');
        overlay.className = 'map-search-container';
        overlay.innerHTML = `
            <div class="map-search-bar" style="display:flex; align-items:center; background: white; border-radius: 25px; padding: 2px 15px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); flex:1; width: 100%;">
                <span class="gemini-sparkle" style="margin-right:8px; font-size:1.2rem;">✨</span>
                <input type="text" id="map-search-input" class="map-search-input" placeholder="Pregunta a Gemini o busca un lugar..." style="background:transparent; border:none; color:var(--text-dark); flex:1; outline:none; padding:12px 0; font-size: 0.95rem;">
            </div>
            <div class="map-filters">
                <div class="filter-chip active" data-type="all">Todos</div>
                <div class="filter-chip" data-type="park">Parques 🌳</div>
                <div class="filter-chip" data-type="school">Escuelas 🎓</div>
                <div class="filter-chip" data-type="theater">Cine/Teatro 🎭</div>
                <div class="filter-chip" data-type="kidzone">Ludotecas 🏰</div>
                <div class="filter-chip" data-type="food">Comida 🍏</div>
            </div>
        `;
        container.appendChild(overlay);

        const locateBtn = document.createElement('button');
        locateBtn.id = 'locate-me-btn';
        locateBtn.className = 'fab-btn locate-fab';
        locateBtn.innerHTML = '🎯';
        container.appendChild(locateBtn);

        // Compass Button for rotation
        const compassBtn = document.createElement('button');
        compassBtn.id = 'map-compass';
        compassBtn.className = 'fab-btn';
        compassBtn.style.bottom = '160px'; // Above locate btn
        compassBtn.style.right = '20px';
        compassBtn.innerHTML = '🧭';
        container.appendChild(compassBtn);

        compassBtn.onclick = () => {
            window.KidoaMap.instance.easeTo({ bearing: 0, pitch: 45, duration: 1000 });
        };

        const input = document.getElementById('map-search-input');
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') window.KidoaMap.handleSearch(input.value);
        });

        document.getElementById('locate-me-btn').addEventListener('click', () => {
            if (window.KidoaMap.userMarker) {
                const lngLat = window.KidoaMap.userMarker.getLngLat();
                window.KidoaMap.instance.flyTo({ center: lngLat, zoom: 18, pitch: 60, speed: 1.2 });
            }
        });

        const chips = document.querySelectorAll('.filter-chip');
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                window.KidoaMap.filterMarkers(chip.dataset.type);
            });
        });
    },

    loadMarkers: async () => {
        let coords = "41.6520, -4.7286";
        if (window.KidoaMap.userMarker) {
            const pos = window.KidoaMap.userMarker.getLngLat();
            coords = `${pos.lat}, ${pos.lng}`;
        }

        const locations = await window.KidoaData.getLocations(coords);
        window.KidoaMap.clearMarkers();

        locations.forEach(loc => {
            window.KidoaMap.createMarker(loc);
        });
    },

    createMarker: (loc) => {
        const el = document.createElement('div');
        el.className = 'kidoa-marker-3d';
        el.innerHTML = `
            <div class="kidoa-marker-pin" style="background: linear-gradient(135deg, var(--primary-blue), #4cc9f0); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                <img src="assets/logo_white.png" style="width: 25px; height: 25px; object-fit: contain;">
            </div>
        `;

        const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
            <div class="popup-premium" style="min-width: 200px;">
                <h3 style="margin:0; font-size: 1rem;">${loc.name}</h3>
                <p style="font-size: 0.8rem; color: #666;">⭐ ${loc.rating} | ${loc.type}</p>
                <button class="btn-primary" style="width:100%; padding:8px; margin-top:10px; font-size:12px;" onclick="window.KidoaMap.showAddSiteModal(${loc.lat}, ${loc.lng}, '${loc.name.replace(/'/g, "\\'")}')">Reseñar</button>
            </div>
        `);

        const marker = new maplibregl.Marker({ element: el })
            .setLngLat([loc.lng, loc.lat])
            .setPopup(popup)
            .addTo(window.KidoaMap.instance);

        window.KidoaMap.markers.push({ instance: marker, type: loc.type });
    },

    clearMarkers: () => {
        window.KidoaMap.markers.forEach(m => m.instance.remove());
        window.KidoaMap.markers = [];
    },

    filterMarkers: (type) => {
        window.KidoaMap.markers.forEach(m => {
            if (type === 'all' || m.type === type) {
                m.instance.addTo(window.KidoaMap.instance);
            } else {
                m.instance.remove();
            }
        });
    },

    handleSearch: async (query) => {
        const input = document.getElementById('map-search-input');
        input.placeholder = "✨ IA pensando...";
        const results = await window.KidoaData.searchLocations(query);
        if (results && results.length > 0) {
            window.KidoaMap.clearMarkers();
            results.forEach(loc => window.KidoaMap.createMarker(loc));
            window.KidoaMap.instance.flyTo({ center: [results[0].lng, results[0].lat], zoom: 15 });
        }
        input.placeholder = "Pregunta a Gemini...";
        input.value = "";
    },

    startGPSWatch: () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.watchPosition((pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            window.KidoaMap.updateUserIcon(lat, lng);

            // Auto-rotate map based on heading if available
            if (pos.coords.heading !== null) {
                window.KidoaMap.instance.easeTo({ bearing: pos.coords.heading, duration: 1000 });
            }
        }, null, { enableHighAccuracy: true });
    },

    updateUserIcon: (lat, lng) => {
        if (!window.KidoaMap.userMarker) {
            const el = document.createElement('div');
            el.innerHTML = `<div style="font-size: 2rem; filter: drop-shadow(0 0 10px rgba(76,201,240,0.8))">👨‍👩‍👧‍👦</div>`;
            window.KidoaMap.userMarker = new maplibregl.Marker({ element: el })
                .setLngLat([lng, lat])
                .addTo(window.KidoaMap.instance);
        } else {
            window.KidoaMap.userMarker.setLngLat([lng, lat]);
        }
    },

    showAddSiteModal: (lat, lng, name = "") => {
        // Use existing modal logic but adapted if needed (referencing window.KidoaMap.showAddSiteModal v1)
        console.log("Add Site Modal", lat, lng, name);
        // Implementing simple version for now
        alert(`Abrir reseña para: ${name || 'Nueva ubicación'}`);
    }
};

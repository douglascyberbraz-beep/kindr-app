window.KindrMap = {
    instance: null,
    isInitialized: false,

    render: (container, userLocation) => {
        const mapContainer = document.getElementById('map-container');

        if (!window.KindrMap.isInitialized) {
            window.KindrMap.init(mapContainer, userLocation);
        }

        // Show the layer (CSS handles the rest)
        mapContainer.classList.remove('map-layer-hidden');

        // Refresh size immediately and with multiple steps to ensure fluidity
        const map = window.KindrMap.instance;
        if (map) {
            map.invalidateSize();
            setTimeout(() => map.invalidateSize(), 50);
            setTimeout(() => map.invalidateSize(), 300);
        }
    },

    init: (container, userLocation) => {
        if (window.KindrMap.isInitialized) return;

        // Defensive check for Leaflet library
        if (typeof L === 'undefined') {
            console.error("Leaflet (L) no está cargado. Reintentando en 1s...");
            setTimeout(() => window.KindrMap.init(container, userLocation), 1000);
            return;
        }

        // Initialize only once
        container.innerHTML = `
            <div id="map-loading-overlay" class="map-loading-overlay">
                <div class="premium-spinner"></div>
                <span>Cargando Mapa...</span>
            </div>
            <div id="map-view" style="width: 100%; height: 100%; background: #f3f4f6; position: absolute; top: 0; left: 0; opacity: 0; transition: opacity 0.5s ease;"></div>
            <div class="search-bar-accessible">
                <input type="text" placeholder="¿Qué buscas hoy?" class="search-input">
                <button class="search-btn">🔍</button>
            </div>
            <div class="location-btn-float" onclick="window.KindrMap.requestLocation()">
                📍
            </div>
        `;

        const center = userLocation ? [userLocation.lat, userLocation.lng] : [41.6523, -4.7245];
        const map = L.map('map-view', {
            zoomControl: false,
            tap: false,
            fadeAnimation: true,
            markerZoomAnimation: true,
            preferCanvas: true
        }).setView(center, 13);

        window.KindrMap.instance = map;
        window.KindrMap.isInitialized = true;

        // Add Tile Layer (CartoDB Voyager - Simplified for maximum compatibility)
        const tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
            attribution: '&copy; CartoDB',
            subdomains: 'abcd',
            maxZoom: 19
        });

        // Safety Timeout: If tiles don't load in 3s, show map anyway
        const safetyTimeout = setTimeout(() => {
            const overlay = document.getElementById('map-loading-overlay');
            const mapView = document.getElementById('map-view');
            if (overlay) overlay.style.opacity = '0';
            if (mapView) mapView.style.opacity = '1';
            setTimeout(() => { if (overlay) overlay.remove(); }, 500);
            map.invalidateSize(); // Final force
        }, 3500);

        tiles.on('load', () => {
            console.log("Tiles cargados con éxito");
            clearTimeout(safetyTimeout);
            const overlay = document.getElementById('map-loading-overlay');
            const mapView = document.getElementById('map-view');
            if (overlay) overlay.style.opacity = '0';
            if (mapView) mapView.style.opacity = '1';
            setTimeout(() => { if (overlay) overlay.remove(); }, 500);
            map.invalidateSize();
        });

        tiles.on('tileerror', (e) => {
            console.error("Error cargando tile:", e.url);
        });

        // Trigger size refresh on move/drag to fix partial loads
        map.on('moveend', () => {
            map.invalidateSize();
        });

        tiles.addTo(map);

        // Fallback for Google if needed later...

        // Custom Icon
        const kindrIcon = L.icon({
            iconUrl: 'assets/map-marker.png',
            iconSize: [40, 40],
            iconAnchor: [20, 20],
            popupAnchor: [0, -20],
            className: 'kindr-marker'
        });

        // Add Markers from Mock Data
        const locations = window.KindrData.getLocations();
        locations.forEach(loc => {
            const marker = L.marker([loc.lat, loc.lng], { icon: kindrIcon }).addTo(map);

            const popupContent = `
                <div class="popup-card">
                    <b>${loc.name}</b><br>
                    <span>⭐ ${loc.rating} (${loc.reviews})</span><br>
                    <small>${loc.type === 'park' ? 'Parque' : 'Restaurante'}</small>
                    <div class="popup-actions" style="margin-top: 8px; display: flex; gap: 5px; justify-content: center;">
                        <button onclick="alert('Detalles de ${loc.name}')" class="btn-tiny">Ver Detalles</button>
                        <button onclick="window.KindrMap.openReview('${loc.name}')" class="btn-tiny btn-accent">✍️ Reseñar</button>
                    </div>
                </div>
            `;
            marker.bindPopup(popupContent);
        });

        // Add User Location Marker
        if (userLocation) {
            L.circleMarker([userLocation.lat, userLocation.lng], {
                radius: 10,
                fillColor: "#4CC9F0",
                color: "#fff",
                weight: 3,
                opacity: 1,
                fillOpacity: 0.9
            }).addTo(map).bindPopup("Estás aquí");
        }

        const refresh = () => { if (map) map.invalidateSize(); };
        setTimeout(refresh, 50);
        setTimeout(refresh, 300);
        setTimeout(refresh, 1000);

        // ResizeObserver: The magic fix for tiling
        const resizeObserver = new ResizeObserver(() => {
            if (window.KindrMap.instance) {
                window.KindrMap.instance.invalidateSize();
            }
        });
        resizeObserver.observe(container);

        // Medic Loop: Force size every second for the first 5 seconds
        let checks = 0;
        const medic = setInterval(() => {
            if (window.KindrMap.instance) window.KindrMap.instance.invalidateSize();
            if (++checks > 5) clearInterval(medic);
        }, 1000);

        // Initialize Review Modal (Singleton)
        if (!document.getElementById('review-modal')) {
            const modalHTML = `
                <div id="review-modal" class="modal hidden">
                    <div class="auth-container slide-up-anim">
                        <div class="auth-card">
                            <h3>Escribir Reseña</h3>
                            <p id="review-target-name" style="color:var(--primary-dark); font-weight:600; margin-bottom:15px;"></p>
                            <div class="star-rating" style="font-size: 2rem; margin-bottom: 15px;"><span>⭐⭐⭐⭐⭐</span></div>
                            <textarea id="review-text" placeholder="¿Qué te pareció?" class="auth-input" style="height:100px; text-align:left;"></textarea>
                            <button id="submit-review-btn" class="btn-primary full-width">Publicar Reseña</button>
                            <button onclick="document.getElementById('review-modal').classList.add('hidden')" class="btn-text" style="margin-top:15px; width:100%;">Cancelar</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);

            document.getElementById('submit-review-btn').addEventListener('click', () => {
                document.getElementById('review-modal').classList.add('hidden');
                window.KindrSound.play('success');
                const toast = document.createElement('div');
                toast.textContent = "¡Reseña publicada! (+10 pts)";
                toast.style.cssText = "position:fixed;top:40px;left:50%;transform:translateX(-50%);background:#84CC16;color:white;padding:12px 24px;border-radius:30px;z-index:3000;box-shadow:0 10px 20px rgba(0,0,0,0.2);font-weight:700;";
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 2500);
            });
        }
    },

    openReview: (placeName) => {
        const modal = document.getElementById('review-modal');
        if (modal) {
            document.getElementById('review-target-name').innerText = placeName;
            modal.classList.remove('hidden');
        }
    },

    requestLocation: () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    window.KindrMap.render(document.getElementById('map-container'), userLocation);
                    window.KindrMap.instance.setView([userLocation.lat, userLocation.lng], 15);
                },
                (error) => {
                    console.log("Ubicación denegada:", error);
                    alert("Para ver tu posición exacta, activa la ubicación en tu navegador.");
                }
            );
        }
    },

    blurCoordinates: (lat, lng) => {
        // Privacy blurring for non-user locations if needed
        const offset = 0.002; // Approx 200m
        return {
            lat: lat + (Math.random() - 0.5) * offset,
            lng: lng + (Math.random() - 0.5) * offset
        };
    },

    // PRE-CACHE Magic: Fetch all tiles for Castilla y León initial view
    warmUpTiles: async () => {
        console.log("Pre-cargando mapa de Castilla y León...");
        const zoomLevels = [8, 9, 10]; // Core levels for regional view
        const center = { lat: 41.6523, lng: -4.7245 };

        const deg2tile = (lat, lon, zoom) => {
            const x = Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
            const y = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
            return { x, y };
        };

        const tilesToFetch = [];
        zoomLevels.forEach(z => {
            const { x, y } = deg2tile(center.lat, center.lng, z);
            // Fetch a 3x3 grid around the center for each zoom
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    const r = window.devicePixelRatio > 1 ? '@2x' : '';
                    const s = ['a', 'b', 'c', 'd'][Math.floor(Math.random() * 4)];
                    tilesToFetch.push(`https://${s}.basemaps.cartocdn.com/rastertiles/voyager/${z}/${x + dx}/${y + dy}${r}.png`);
                }
            }
        });

        // Fetch them in background (don't await to block app start)
        tilesToFetch.forEach(url => fetch(url, { mode: 'no-cors' }).catch(() => { }));
    }
};

const mapStyle = document.createElement('style');
mapStyle.textContent = `
    .search-bar-float {
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 500px;
        z-index: 1000;
        display: flex;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        border-radius: 50px;
        background: white;
        padding: 5px;
        border: 1px solid rgba(0,0,0,0.05);
    }
    .search-input {
        border: none;
        flex: 1;
        padding: 12px 20px;
        border-radius: 50px;
        outline: none;
        font-family: inherit;
        font-size: 0.95rem;
    }
    .search-btn {
        background: var(--primary-blue);
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 2px;
    }
    .kindr-marker {
        background: none !important;
        border: none !important;
        box-shadow: none !important;
        filter: drop-shadow(0 4px 6px rgba(0,0,0,0.15));
    }
    .popup-card {
        text-align: center;
        padding: 5px;
    }
    .map-loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 1001;
        transition: opacity 0.5s ease;
    }
    .premium-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(0, 44, 119, 0.1);
        border-top: 3px solid var(--primary-blue);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 12px;
    }
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(mapStyle);

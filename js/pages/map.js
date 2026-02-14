window.KindrMap = {
    instance: null,
    isInitialized: false,

    render: (container, userLocation) => {
        if (window.KindrMap.isInitialized) {
            // Just refresh size immediately
            const map = window.KindrMap.instance;
            setTimeout(() => { map.invalidateSize(); }, 50);
            return;
        }

        // Initialize only once
        container.innerHTML = `
            <div id="map-view" style="width: 100%; height: 100%; background: #e5e7eb;"></div>
            <div class="search-bar-float">
                <input type="text" placeholder="¿Qué buscas hoy?" class="search-input">
                <button class="search-btn">🔍</button>
            </div>
        `;

        const center = userLocation ? [userLocation.lat, userLocation.lng] : [40.4168, -3.7038];
        const map = L.map('map-view', {
            zoomControl: false,
            tap: false
        }).setView(center, 13);

        window.KindrMap.instance = map;
        window.KindrMap.isInitialized = true;

        // Add Tile Layer (Google Roadmap - Clean & Reliable)
        L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            attribution: '&copy; Google Maps',
            maxZoom: 19
        }).on('tileerror', (e) => {
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        }).addTo(map);

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

        const refresh = () => { map.invalidateSize(); };
        setTimeout(refresh, 100);
        setTimeout(refresh, 800);

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
`;
document.head.appendChild(mapStyle);

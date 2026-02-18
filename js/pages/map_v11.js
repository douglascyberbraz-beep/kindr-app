// Tabula Rasa: Clean Slate Map Engine v11
window.KindrMap = {
    instance: null,
    isInitialized: false,

    render: (container) => {
        console.log("Tabula Rasa Render...");
        const mapBox = document.getElementById('map-viewport-v11');

        if (!window.KindrMap.isInitialized) {
            window.KindrMap.init(mapBox);
        }

        // Nuclear Visibility: Force display and opacity
        mapBox.style.display = 'block';
        mapBox.style.opacity = '1';
        mapBox.style.visibility = 'visible';

        if (window.KindrMap.instance) {
            window.KindrMap.instance.invalidateSize();
            setTimeout(() => window.KindrMap.instance.invalidateSize(), 500);
        }
    },

    init: (container) => {
        if (window.KindrMap.isInitialized) return;

        console.log("Initializing Clean Slate Map v11...");

        // Efficient Google Maps tiles for better mobile performance
        const map = L.map(container, {
            zoomControl: false,
            attributionControl: false,
            tap: true // Ensure touch events are handled correctly on mobile
        }).setView([41.6523, -4.7245], 13);

        const googleTiles = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        });

        googleTiles.addTo(map);

        // Robustness: Fallback if Google Tiles fail
        googleTiles.on('tileerror', () => {
            console.warn("Google Tiles failed, falling back to OSM");
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        });

        window.KindrMap.instance = map;
        window.KindrMap.isInitialized = true;

        // Force a size check
        setTimeout(() => map.invalidateSize(), 100);
    }
};

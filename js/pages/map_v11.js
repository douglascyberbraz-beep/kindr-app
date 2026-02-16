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

        // Simple OSM tiles with NO caching hacks for now to ensure raw loading
        const map = L.map(container, {
            zoomControl: false,
            attributionControl: false
        }).setView([41.6523, -4.7245], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

        window.KindrMap.instance = map;
        window.KindrMap.isInitialized = true;

        // Force a size check
        setTimeout(() => map.invalidateSize(), 100);
    }
};

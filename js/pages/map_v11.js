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

        // Emergency Switch: Use Standard OSM for reliability
        const map = L.map(container, {
            zoomControl: false,
            attributionControl: false,
            tap: true
        }).setView([40.4168, -3.7038], 6); // Default to Spain center

        // CartoDB Dark Matter (Premium "Anti Gravity" Look)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        // Add a subtle glow/shadow to the map container for depth
        container.style.boxShadow = "inset 0 0 100px rgba(0,0,0,0.9)";

        window.KindrMap.instance = map;
        window.KindrMap.isInitialized = true;

        // Force a size check
        setTimeout(() => map.invalidateSize(), 100);
    }
};

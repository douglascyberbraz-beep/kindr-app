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

        // Start Smart Preload for Castilla y León (Silent Background Download)
        setTimeout(() => window.KindrMap.preloadCylMap(map), 2000);
    },

    preloadCylMap: (map) => {
        console.log("🚀 Iniciando Smart Preload: Castilla y León Offline...");

        // Bounding Box roughly covering Castilla y León
        // North: 43.5, South: 40.0, West: -7.2, East: -1.7
        const bounds = { n: 43.5, s: 40.0, w: -7.2, e: -1.7 };

        const zooms = [7, 8]; // Regional overview levels (low cost, high value)
        // Note: Deep zooms (10+) are fetched on demand to save data/storage

        let loadedCount = 0;

        zooms.forEach(z => {
            for (let lat = bounds.s; lat <= bounds.n; lat += 0.5) {
                for (let lng = bounds.w; lng <= bounds.e; lng += 0.5) {
                    // Convert Lat/Lng/Zoom to Tile Coords
                    const n = Math.pow(2, z);
                    const x = Math.floor(n * (lng + 180) / 360);
                    const latRad = lat * Math.PI / 180;
                    const y = Math.floor(n * (1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2);

                    // Skip invalid
                    if (isNaN(x) || isNaN(y)) continue;

                    // Prefetch Image (Service Worker will cache it)
                    const img = new Image();
                    // CartoDB Dark Matter Pattern
                    img.src = `https://a.basemaps.cartocdn.com/dark_all/${z}/${x}/${y}.png`;
                    img.onload = () => {
                        loadedCount++;
                        if (loadedCount % 10 === 0) console.log(`📦 Map Cache: ${loadedCount} tiles secured.`);
                    };
                }
            }
        });

        console.log("✅ Smart Preload Strategy Activada: Bajando visión general de CyL.");
    }
};

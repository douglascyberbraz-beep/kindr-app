// Kindr App - Premium Pulse Build 2024.02.15.2
// Sound System
window.KindrSound = {
    play: (type) => {
        const sounds = {
            click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Soft wooden tap
            start: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3', // Ethereal chime
            success: 'https://assets.mixkit.co/active_storage/sfx/1918/1918-preview.mp3' // Harp success
        };
        if (sounds[type]) {
            const audio = new Audio(sounds[type]);
            audio.volume = 0.2; // Softer volume for premium feel
            audio.play().catch(e => console.log('Audio auto-play blocked:', e));
        }
    }
};

const appState = {
    currentPage: 'map',
    user: null,
    location: null
};

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {

    // Warm Initialization: Start loading map in background immediately
    const mapContainer = document.getElementById('map-container');
    if (mapContainer) {
        try {
            window.KindrMap.init(mapContainer, null);
            // Magic: Start pre-cached download for CyL tiles
            window.KindrMap.warmUpTiles();
        } catch (e) {
            console.error("No se pudo pre-inicializar el mapa:", e);
        }
    }

    // Simulate Splash Screen
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        splash.style.opacity = '0';
        window.KindrSound.play('start'); // Play magic chime on entry
        setTimeout(() => {
            splash.style.display = 'none';
            document.getElementById('bottom-nav').classList.remove('hidden');

            // Beta Readiness Notification
            if (localStorage.getItem('kindr_beta_cached')) {
                const badge = document.createElement('div');
                badge.textContent = "Beta Ready: Castilla y León (Offline)";
                badge.style.cssText = "position:fixed; top:20px; left:50%; transform:translateX(-50%); background:rgba(0,44,119,0.8); color:white; padding:6px 15px; border-radius:20px; font-size:11px; z-index:2000; font-weight:600; backdrop-filter:blur(5px);";
                document.body.appendChild(badge);
                setTimeout(() => badge.style.opacity = '0', 3000);
            }
        }, 500);
    }, 2000); // Reduced slightly for better feel

    // Check Auth
    const user = window.KindrAuth.checkAuth();
    const isGuest = localStorage.getItem('kindr_guest') === 'true';

    if (!user && !isGuest) {
        window.KindrAuth.renderAuthModal();
    } else {
        appState.user = user || { name: 'Invitado', isGuest: true };
    }

    // Initialize Navigation
    setupNavigation();

    // Default Page Load
    loadPage('map');

    // Geolocation moved to be requested only when Map is loaded or explicitly requested
    // see window.KindrMap.requestLocation()
});

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const target = e.currentTarget;
            const page = target.dataset.page;

            if (page === appState.currentPage) return;

            window.KindrSound.play('click'); // Click sound feedback

            // Remove active class from all
            navItems.forEach(nav => nav.classList.remove('active'));

            // Add to clicked
            target.classList.add('active');

            loadPage(page);
        });
    });
}

function loadPage(pageName) {
    appState.currentPage = pageName;
    const container = document.getElementById('main-content');
    const mapViewport = document.getElementById('map-viewport-v11');

    // Default hiding
    container.classList.add('hidden');
    mapViewport.style.display = 'none';
    container.innerHTML = ''; // Clear other pages content

    // Special style for nav items
    updateNavStyles(pageName);

    if (pageName === 'map') {
        window.KindrMap.render(mapViewport);
    } else {
        container.classList.remove('hidden');
        container.classList.add('page-enter'); // Add animation
        switch (pageName) {
            case 'news':
                window.KindrNews.render(container);
                break;
            case 'events':
                window.KindrEvents.render(container);
                break;
            case 'tribu':
                window.KindrTribu.render(container);
                break;
            case 'ranking':
                window.KindrRanking.render(container);
                break;
            case 'chat':
                window.KindrChat.render(container);
                break;
            case 'profile':
                window.KindrProfile.render(container, appState.user);
                break;
        }
        setTimeout(() => container.classList.remove('page-enter'), 600);
    }
}

function updateNavStyles(activePage) {
    // Optional: Add specific animation or style based on page
    console.log(`Navegando a: ${activePage}`);
}

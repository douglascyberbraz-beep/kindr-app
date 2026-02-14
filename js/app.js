// Sound System
window.KindrSound = {
    play: (type) => {
        const sounds = {
            click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Soft pop
            start: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', // Magic chime
            success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3' // Achievement
        };
        if (sounds[type]) {
            const audio = new Audio(sounds[type]);
            audio.volume = 0.3;
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

    // Simulate Splash Screen
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        splash.style.opacity = '0';
        window.KindrSound.play('start'); // Play magic chime on entry
        setTimeout(() => {
            splash.style.display = 'none';
            document.getElementById('bottom-nav').classList.remove('hidden');
            // Initial load handles showing correct container
        }, 500);
    }, 2500);

    // Check Auth
    const user = window.KindrAuth.checkAuth();
    if (!user) {
        window.KindrAuth.renderAuthModal();
    } else {
        appState.user = user;
    }

    // Initialize Navigation
    setupNavigation();

    // Default Page Load
    loadPage('map');

    // Request Geolocation
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                appState.location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                // Re-render map if it's the current page to update position
                if (appState.currentPage === 'map') {
                    window.KindrMap.render(document.getElementById('main-content'), appState.location);
                }
            },
            (error) => {
                console.log("Ubicación denegada o error:", error);
                // Default location (e.g., Madrid)
                appState.location = { lat: 40.4168, lng: -3.7038 };
            }
        );
    }
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
    const mapContainer = document.getElementById('map-container');

    // Default hiding
    container.classList.add('hidden');
    mapContainer.classList.add('hidden');
    container.innerHTML = ''; // Clear other pages content

    // Special style for nav items
    updateNavStyles(pageName);

    if (pageName === 'map') {
        mapContainer.classList.remove('hidden');
        window.KindrMap.render(mapContainer, appState.location);
    } else {
        container.classList.remove('hidden');
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
    }
}

function updateNavStyles(activePage) {
    // Optional: Add specific animation or style based on page
    console.log(`Navegando a: ${activePage}`);
}

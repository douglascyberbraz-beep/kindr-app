// Kindr App - Sensory & Branding Build 2024.02.15.1
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
    const mapContainer = document.getElementById('map-container');

    // Default hiding
    container.classList.add('hidden');
    mapContainer.classList.add('hidden');
    container.innerHTML = ''; // Clear other pages content

    // Special style for nav items
    updateNavStyles(pageName);

    if (pageName === 'map') {
        mapContainer.classList.remove('hidden');
        mapContainer.classList.add('page-enter'); // Add animation
        window.KindrMap.render(mapContainer, appState.location);
        setTimeout(() => mapContainer.classList.remove('page-enter'), 600);
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

window.KindrData = {
    getLocations: () => {
        return [
            {
                id: 1,
                name: "Parque del Retiro - Zona Infantil",
                lat: 40.4152606,
                lng: -3.6844988,
                type: "park",
                rating: 4.8,
                reviews: 120,
                image: "https://images.unsplash.com/photo-1596464716127-f9a804e0647e"
            },
            {
                id: 2,
                name: "Café Kids Friendly 'El Recreo'",
                lat: 40.4206,
                lng: -3.7040,
                type: "restaurant",
                rating: 4.5,
                reviews: 85,
                image: "https://images.unsplash.com/photo-1559339352-11d035aa65de"
            },
            {
                id: 3,
                name: "Museo de Ciencias Naturales",
                lat: 40.4409,
                lng: -3.6898,
                type: "museum",
                rating: 4.7,
                reviews: 300,
                image: "https://images.unsplash.com/photo-1534234828569-12345" // Mock
            }
        ];
    },

    getNews: () => {
        return [
            {
                id: 1,
                title: "Abierto plazo de becas comedor 2024",
                summary: "El Ministerio de Educación ha abierto el plazo para solicitar las becas de comedor para el curso 2024-2025. Consulta los requisitos aquí.",
                source: "Ministerio de Educación",
                date: "Hace 2 horas"
            },
            {
                id: 2,
                title: "Nueva zona de juegos en Madrid Río",
                summary: "Se inaugura el nuevo barco pirata en la zona de Madrid Río, con accesibilidad para todos los niños.",
                source: "Ayuntamiento de Madrid",
                date: "Hace 5 horas"
            }
        ];
    },

    getEvents: () => {
        return [
            {
                id: 1,
                title: "Taller de Pintura Creativa",
                date: "Sábado, 15 Feb - 11:00",
                location: "Centro Cultural Conde Duque",
                price: "Gratis",
                link: "#"
            },
            {
                id: 2,
                title: "Teatro de Títeres: El Bosque Encantado",
                date: "Domingo, 16 Feb - 12:30",
                location: "Teatro del Barrio",
                price: "10€",
                link: "#"
            }
        ];
    },

    getTribuPosts: () => {
        return [
            {
                id: 1,
                user: "Laura M.",
                avatar: "👩‍🦰",
                time: "Hace 20 min",
                content: "¿Alguien sabe si el parque de la calle Pez tiene columpios para bebés?",
                likes: 5,
                comments: 2
            },
            {
                id: 2,
                user: "Carlos P.",
                avatar: "🧔",
                time: "Hace 1h",
                content: "¡Acabamos de salir del Museo de Ciencias y es genial para niños de 5 años! Super recomendado el taller de dinosaurios 🦖",
                likes: 24,
                comments: 0
            },
            {
                id: 3,
                user: "Ana R.",
                avatar: "👩‍⚕️",
                time: "Hace 3h",
                content: "Buscando pediatra respetuoso por zona Chamberí. ¿Recomendaciones? 🙏",
                likes: 8,
                comments: 12
            }
        ];
    },

    getTopSites: () => {
        return [
            {
                id: 1,
                name: "El Recreo Café",
                type: "Cafetería",
                rating: 4.9,
                badge: "🥇 El Mejor",
                image: "https://images.unsplash.com/photo-1559339352-11d035aa65de"
            },
            {
                id: 2,
                name: "Parque del Retiro",
                type: "Parque",
                rating: 4.8,
                badge: "🥈 Top Aire Libre",
                image: "https://images.unsplash.com/photo-1596464716127-f9a804e0647e"
            },
            {
                id: 3,
                name: "Museo Lunar",
                type: "Museo",
                rating: 4.7,
                badge: "🥉 Top Cultural",
                image: "https://images.unsplash.com/photo-1534234828569-12345"
            },
            {
                id: 4,
                name: "Lego Store",
                type: "Tienda",
                rating: 4.6,
                badge: "⭐ Popular",
                image: ""
            },
            {
                id: 5,
                name: "Baby Spa Madrid",
                type: "Relax",
                rating: 4.5,
                badge: "💧 Relax",
                image: ""
            }
        ];
    }
};

window.KindrData = {
    getLocations: () => {
        return [
            {
                id: 1,
                name: "Campo Grande - Valladolid",
                lat: 41.6480,
                lng: -4.7290,
                type: "park",
                rating: 4.9,
                reviews: 2450,
                image: "https://images.unsplash.com/photo-1596464716127-f9a804e0647e"
            },
            {
                id: 2,
                name: "Museo de la Evolución Humana - Burgos",
                lat: 42.3392,
                lng: -3.6972,
                type: "museum",
                rating: 4.8,
                reviews: 1850,
                image: "https://images.unsplash.com/photo-1559339352-11d035aa65de"
            },
            {
                id: 3,
                name: "Parque de los Jesuitas - Salamanca",
                lat: 40.9616,
                lng: -5.6558,
                type: "park",
                rating: 4.7,
                reviews: 900,
                image: ""
            },
            {
                id: 4,
                name: "Parque de los Reyes - León",
                lat: 42.5930,
                lng: -5.5650,
                type: "park",
                rating: 4.6,
                reviews: 450,
                image: ""
            },
            {
                id: 5,
                name: "Jardines de La Granja - Segovia",
                lat: 40.8918,
                lng: -4.0027,
                type: "park",
                rating: 4.9,
                reviews: 3200,
                image: ""
            },
            {
                id: 6,
                name: "El Valle de los 6 Sentidos - Renedo",
                lat: 41.6530,
                lng: -4.6250,
                type: "park",
                rating: 4.8,
                reviews: 560,
                image: ""
            },
            {
                id: 7,
                name: "Museo de la Ciencia - Valladolid",
                lat: 41.6420,
                lng: -4.7290,
                type: "museum",
                rating: 4.7,
                reviews: 1200,
                image: ""
            },
            {
                id: 8,
                name: "Alcázar de Segovia",
                lat: 40.9525,
                lng: -4.1325,
                type: "culture",
                rating: 4.9,
                reviews: 5000,
                image: ""
            },
            {
                id: 9,
                name: "Parque de Quevedo - León",
                lat: 42.6010,
                lng: -5.5820,
                type: "park",
                rating: 4.5,
                reviews: 320,
                image: ""
            },
            {
                id: 10,
                name: "Parque de las Moreras - Valladolid",
                lat: 41.6569,
                lng: -4.7323,
                type: "park",
                rating: 4.6,
                reviews: 780,
                image: ""
            }
        ];
    },

    getNews: () => {
        return [
            {
                id: 1,
                title: "Ayudas Junta CyL: Conciliación 2024",
                summary: "La Junta de Castilla y León abre el plazo para las ayudas directas a la conciliación de la vida familiar y laboral.",
                source: "Junta de Castilla y León",
                date: "Hace 2 horas"
            },
            {
                id: 2,
                title: "Nueva ludoteca en Valladolid",
                summary: "Inaugurada la mayor ludoteca municipal en el barrio de Parquesol, con actividades gratuitas de fin de semana.",
                source: "Ayuntamiento de Valladolid",
                date: "Hace 5 horas"
            }
        ];
    },

    getEvents: () => {
        return [
            {
                id: 1,
                title: "Titirimundi 2024: Avance",
                date: "Sábado, 15 Feb - 11:00",
                location: "Plaza Mayor de Segovia",
                price: "Gratis",
                link: "#"
            },
            {
                id: 2,
                title: "Taller 'Pequeños Evolucionadores'",
                date: "Domingo, 16 Feb - 12:30",
                location: "Museo Evolución Humana, Burgos",
                price: "5€",
                link: "#"
            }
        ];
    },

    getTribuPosts: () => {
        return [
            {
                id: 1,
                user: "Marta S. (Valladolid)",
                avatar: "👩‍🦰",
                time: "Hace 20 min",
                content: "¿Vais a ir al Titirimundi este año? Busco grupo de padres para ir el sábado por la mañana. 🎭",
                likes: 8,
                comments: 3
            },
            {
                id: 2,
                user: "Jorge L. (Burgos)",
                avatar: "🧔",
                time: "Hace 1h",
                content: "¡Increíble la visita a Atapuerca con niños de 7 años! Recomiendo muchísimo el Safari Paleolítico Vivo. 🦣",
                likes: 31,
                comments: 2
            },
            {
                id: 3,
                user: "Elena G. (Salamanca)",
                avatar: "👩‍⚕️",
                time: "Hace 3h",
                content: "¿Alguien sabe si el Parque de los Jesuitas tiene zona de sombras ahora que empieza el buen tiempo? 🌳",
                likes: 12,
                comments: 15
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

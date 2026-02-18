window.KindrData = {
    getLocations: () => {
        return [
            // --- VALLADOLID ---
            { id: 1, name: "Campo Grande - Valladolid", lat: 41.6480, lng: -4.7290, type: "park", rating: 4.9, reviews: 2450, image: "https://images.unsplash.com/photo-1596464716127-f9a804e0647e" },
            { id: 7, name: "Museo de la Ciencia", lat: 41.6420, lng: -4.7290, type: "museum", rating: 4.7, reviews: 1200, image: "" },
            { id: 10, name: "Plaza Mayor de Valladolid", lat: 41.6520, lng: -4.7286, type: "culture", rating: 4.8, reviews: 5000, image: "" },

            // --- BURGOS ---
            { id: 2, name: "Catedral de Burgos", lat: 42.3408, lng: -3.7042, type: "culture", rating: 4.9, reviews: 8500, image: "https://images.unsplash.com/photo-1559339352-11d035aa65de" },
            { id: 11, name: "Museo de la Evolución Humana", lat: 42.3392, lng: -3.6972, type: "museum", rating: 4.8, reviews: 1850, image: "" },

            // --- LEÓN ---
            { id: 4, name: "Catedral de León", lat: 42.5994, lng: -5.5667, type: "culture", rating: 4.9, reviews: 7200, image: "" },
            { id: 9, name: "Barrio Húmedo", lat: 42.5975, lng: -5.5680, type: "food", rating: 4.8, reviews: 3100, image: "" },
            { id: 12, name: "Casa Botines (Gaudí)", lat: 42.6000, lng: -5.5714, type: "culture", rating: 4.7, reviews: 2900, image: "" },

            // --- SALAMANCA ---
            { id: 3, name: "Plaza Mayor de Salamanca", lat: 40.9650, lng: -5.6635, type: "culture", rating: 5.0, reviews: 9900, image: "" },
            { id: 13, name: "Universidad de Salamanca", lat: 40.9610, lng: -5.6660, type: "culture", rating: 4.9, reviews: 4500, image: "" },

            // --- SEGOVIA ---
            { id: 5, name: "Acueducto de Segovia", lat: 40.9480, lng: -4.1180, type: "culture", rating: 4.9, reviews: 12000, image: "" },
            { id: 8, name: "Alcázar de Segovia", lat: 40.9525, lng: -4.1325, type: "culture", rating: 4.9, reviews: 5000, image: "" },

            // --- ÁVILA ---
            { id: 14, name: "Murallas de Ávila", lat: 40.6565, lng: -4.6995, type: "culture", rating: 4.9, reviews: 6700, image: "" },

            // --- SORIA ---
            { id: 15, name: "Alameda de Cervantes", lat: 41.7640, lng: -2.4670, type: "park", rating: 4.8, reviews: 1200, image: "" },
            { id: 16, name: "Ermita de San Saturio", lat: 41.7560, lng: -2.4570, type: "culture", rating: 4.9, reviews: 2100, image: "" },

            // --- PALENCIA ---
            { id: 17, name: "Cristo del Otero", lat: 42.0230, lng: -4.5200, type: "culture", rating: 4.7, reviews: 1500, image: "" },
            { id: 18, name: "Calle Mayor", lat: 42.0100, lng: -4.5300, type: "walk", rating: 4.6, reviews: 900, image: "" },

            // --- ZAMORA ---
            { id: 19, name: "Catedral de Zamora", lat: 41.4980, lng: -5.7550, type: "culture", rating: 4.7, reviews: 1800, image: "" },
            { id: 20, name: "Castillo de Zamora", lat: 41.4990, lng: -5.7570, type: "culture", rating: 4.6, reviews: 1100, image: "" }
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
    },

    getContributors: () => {
        return [
            {
                id: 1,
                name: "Laura M.",
                rank: "Contribuidor del Mes",
                role: "👑",
                points: 1200,
                contributions: 45,
                special: true
            },
            {
                id: 2,
                name: "Diego R.",
                rank: "Explorador",
                role: "4",
                points: 850,
                contributions: 30,
                special: false
            },
            {
                id: 3,
                name: "Sonia T.",
                rank: "Colaboradora",
                role: "5",
                points: 620,
                contributions: 20,
                special: false
            }
        ];
    }
};

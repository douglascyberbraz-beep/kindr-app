window.KindrEvents = {
    render: (container) => {
        container.innerHTML = `
        <div class="page-header premium-header">
            <h2>Próximos Eventos</h2>
            <p>Planes en familia cerca de ti</p>
        </div>
        <style>
            .premium-header { padding: 30px 20px 10px; }
            .premium-header h2 { color: var(--primary-navy); font-weight: 800; }
            .event-card { border: 1px solid rgba(0,0,0,0.05) !important; padding: 20px !important; }
            .event-date-box { background: var(--primary-navy) !important; }
            .event-date-box .day { color: white !important; }
            .event-date-box .month { color: rgba(255,255,255,0.8); }
        </style>
        <div id="events-list" class="content-list stagger-group"></div>
    `;

        const list = document.getElementById('events-list');
        const events = window.KindrData.getEvents();

        events.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card event-card';
            card.innerHTML = `
            <div class="event-date-box">
                <span class="day">${item.date.split(' ')[1]}</span>
                <span class="month">FEB</span>
            </div>
            <div class="event-details">
                <h3>${item.title}</h3>
                <p>📍 ${item.location}</p>
                <p>💰 ${item.price}</p>
            </div>
            <button class="btn-primary" onclick="window.open('${item.link}', '_blank')">Entradas</button>
        `;
            list.appendChild(card);
        });
    }
};

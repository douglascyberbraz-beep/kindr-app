window.KindrEvents = {
    render: (container) => {
        container.innerHTML = `
        <div class="page-header">
            <h2>Próximos Eventos</h2>
            <p>Planes en familia cerca de ti</p>
        </div>
        <div id="events-list" class="content-list"></div>
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

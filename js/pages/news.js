window.KindrNews = {
    render: (container) => {
        container.innerHTML = `
        <div class="page-header premium-header">
            <h2>Noticias KINDR</h2>
            <p>Actualidad para padres modernos</p>
        </div>

        <div id="alerts-section" class="alerts-container stagger-group">
            <!-- Factor X integrated as a special news card or slim alert -->
            <div class="card alert-card-premium">
                <div class="alert-header">
                    <span class="alert-pill">FACTOR X</span>
                    <span class="alert-time">Urgente</span>
                </div>
                <h3>Becas Comedor 2024</h3>
                <p>Quedan solos 3 días para solicitar la ayuda regional. ¡No pierdas el plazo!</p>
                <button class="btn-primary full-width">Ver Requisitos</button>
            </div>
        </div>

        <div id="news-list" class="content-list stagger-group"></div>
    `;

        const list = document.getElementById('news-list');
        const news = window.KindrData.getNews();

        news.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card news-card';
            card.innerHTML = `
            <div class="card-header">
                <span class="badge">Novedad</span>
                <span class="date">${item.date}</span>
            </div>
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
            <div class="card-footer">
                <small>Fuente: ${item.source}</small>
                <button class="btn-text">Leer más</button>
            </div>
        `;
            list.appendChild(card);
        });
    }
};

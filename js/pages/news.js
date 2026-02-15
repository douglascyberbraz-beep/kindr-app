window.KindrNews = {
    render: (container) => {
        container.innerHTML = `
        <div class="page-header premium-header">
            <h2>Noticias KINDR</h2>
            <p>Actualidad para padres modernos</p>
        </div>
        <style>
            .premium-header { padding: 30px 20px 10px; }
            .premium-header h2 { color: var(--primary-navy); font-weight: 800; letter-spacing: -0.5px; }
            .news-card { border: 1px solid rgba(0,0,0,0.05) !important; box-shadow: var(--shadow-soft) !important; }
            .news-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-premium) !important; }
        </style>
        <div id="alerts-section" class="alerts-container">
            <div class="alert-premium">
                <div class="alert-icon">⚡</div>
                <div class="alert-content">
                    <h4>Factor X: Becas Comedor</h4>
                    <p>Últimos 3 días para solicitar becas 2024. ¡Comprueba si cumples!</p>
                </div>
                <button class="alert-action">Ver</button>
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

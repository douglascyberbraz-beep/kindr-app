window.KindrNews = {
    render: (container) => {
        container.innerHTML = `
        <div class="page-header">
            <h2>Noticias KINDR</h2>
            <p>Actualidad para padres modernos</p>
        </div>
        <div id="news-list" class="content-list"></div>
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

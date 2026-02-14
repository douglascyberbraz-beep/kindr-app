window.KindrRanking = {
    render: (container) => {
        container.innerHTML = `
            <div class="page-header center-text">
                <h2>🏆 Top Sitios</h2>
                <p>Los favoritos de febrero</p>
            </div>
            
            <div id="ranking-list" class="content-list" style="padding-bottom: 100px;">
                <!-- Ranking items -->
            </div>
        `;

        const list = document.getElementById('ranking-list');
        const sites = window.KindrData.getTopSites();

        sites.forEach((site, index) => {
            const card = document.createElement('div');
            card.className = `ranking-card rank-${index + 1}`;

            let medal = '';
            if (index === 0) medal = '🥇';
            if (index === 1) medal = '🥈';
            if (index === 2) medal = '🥉';
            if (index > 2) medal = `<span class="rank-num">#${index + 1}</span>`;

            card.innerHTML = `
                <div class="rank-position">${medal}</div>
                <div class="rank-info">
                    <h3>${site.name}</h3>
                    <span class="rank-badge">${site.badge}</span>
                </div>
                <div class="rank-score">
                    ⭐ ${site.rating}
                </div>
            `;

            // Add click event for details (future)
            card.addEventListener('click', () => {
                alert(`¡Has visitado ${site.name}!`);
            });

            list.appendChild(card);
        });

        // Add Styles for Ranking Page
        if (!document.getElementById('ranking-styles')) {
            const style = document.createElement('style');
            style.id = 'ranking-styles';
            style.textContent = `
                .center-text { text-align: center; margin-bottom: 20px; }
                .ranking-card {
                    display: flex;
                    align-items: center;
                    background: white;
                    padding: 15px 20px;
                    border-radius: 20px;
                    margin-bottom: 12px;
                    box-shadow: var(--shadow);
                    transition: transform 0.2s;
                    cursor: pointer;
                    border: 1px solid transparent;
                }
                .ranking-card:hover {
                    transform: scale(1.02);
                }
                .rank-1 {
                    background: linear-gradient(135deg, #FFF9C4 0%, #FFFFFF 100%);
                    border: 1px solid #FFD54F;
                }
                .rank-2 {
                    background: linear-gradient(135deg, #ECEFF1 0%, #FFFFFF 100%);
                    border: 1px solid #B0BEC5;
                }
                .rank-3 {
                    background: linear-gradient(135deg, #FFE0B2 0%, #FFFFFF 100%);
                    border: 1px solid #FFCC80;
                }
                .rank-position {
                    font-size: 2rem;
                    margin-right: 15px;
                    width: 40px;
                    text-align: center;
                }
                .rank-num {
                    font-size: 1.2rem;
                    font-weight: 800;
                    color: var(--text-muted);
                }
                .rank-info {
                    flex: 1;
                }
                .rank-info h3 {
                    margin: 0 0 5px 0;
                    font-size: 1.1rem;
                    color: var(--text-main);
                }
                .rank-badge {
                    background: rgba(0,0,0,0.05);
                    padding: 3px 8px;
                    border-radius: 8px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: var(--primary-color);
                }
                .rank-score {
                    font-weight: 700;
                    color: var(--text-main);
                }
            `;
            document.head.appendChild(style);
        }
    }
};

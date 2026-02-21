window.KindrRanking = {
    render: (container) => {
        container.innerHTML = `
            <div class="page-header center-text">
                <h2 style="color: var(--primary-navy); font-weight: 800;">🏆 Ranking KINDR</h2>
                <div class="tab-scroller">
                    <button class="tab-btn active" data-tab="sites">Top Sitios</button>
                    <button class="tab-btn" data-tab="users">Contribuidores</button>
                </div>
            </div>
            
            <div id="ranking-list" class="content-list stagger-group" style="padding-bottom: 20px;">
                <!-- Content will be injected here -->
            </div>
        `;

        const list = document.getElementById('ranking-list');

        const renderSites = () => {
            const sites = window.KindrData.getTopSites();
            list.innerHTML = '';
            sites.forEach((site, index) => {
                const card = document.createElement('div');
                card.className = `ranking-card rank-${index + 1}`;
                let medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `<span class="rank-num">#${index + 1}</span>`;
                card.innerHTML = `
                    <div class="rank-position">${medal}</div>
                    <div class="rank-info">
                        <h3>${site.name}</h3>
                        <span class="rank-badge">${site.badge}</span>
                    </div>
                    <div class="rank-score">⭐ ${site.rating}</div>
                `;
                list.appendChild(card);
            });
        };

        const renderContributors = () => {
            const users = window.KindrData.getContributors();
            let htmlStr = '';

            users.forEach(user => {
                if (user.special) {
                    htmlStr += `
                        <div class="contributor-card gold-border">
                            <div style="font-size: 1.5rem;">${user.role}</div>
                            <div style="flex:1">
                                <h4 style="color:var(--primary-navy)">${user.rank}</h4>
                                <p style="font-size:0.8rem">${user.name} (+${user.contributions} aportaciones)</p>
                            </div>
                            <div class="points-badge">${user.points} pts</div>
                        </div>
                    `;
                } else {
                    htmlStr += `
                        <div class="ranking-card">
                            <div class="rank-position">${user.role}</div>
                            <div class="rank-info"><h3>${user.name}</h3><span class="rank-badge">${user.rank}</span></div>
                            <div class="rank-score">${user.points} pts</div>
                        </div>
                    `;
                }
            });
            list.innerHTML = htmlStr;
        };

        // Initial Render
        renderSites();

        // Tab Logic
        container.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                if (tab === 'sites') renderSites();
                else renderContributors();
                window.KindrSound.play('click');
            });
        });

        /* Styles moved to main.css */
    }
};

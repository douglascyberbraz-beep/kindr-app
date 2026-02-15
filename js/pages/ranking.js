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
            list.innerHTML = `
                <div class="contributor-card gold-border">
                    <div style="font-size: 1.5rem;">👑</div>
                    <div style="flex:1">
                        <h4 style="color:var(--primary-navy)">Contribuidor del Mes</h4>
                        <p style="font-size:0.8rem">Laura M. (+45 aportaciones)</p>
                    </div>
                    <div class="points-badge">1,200 pts</div>
                </div>
                <div class="ranking-card">
                    <div class="rank-position">4</div>
                    <div class="rank-info"><h3>Diego R.</h3><span class="rank-badge">Explorador</span></div>
                    <div class="rank-score">850 pts</div>
                </div>
                <div class="ranking-card">
                    <div class="rank-position">5</div>
                    <div class="rank-info"><h3>Sonia T.</h3><span class="rank-badge">Colaboradora</span></div>
                    <div class="rank-score">620 pts</div>
                </div>
            `;
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

        if (!document.getElementById('ranking-styles')) {
            const style = document.createElement('style');
            style.id = 'ranking-styles';
            style.textContent = `
                .center-text { text-align: center; margin-bottom: 20px; }
                .tab-scroller { display: flex; justify-content: center; gap: 10px; margin-top: 15px; }
                .tab-btn { background: #f1f5f9; border: none; padding: 8px 20px; border-radius: 20px; font-weight: 600; color: var(--text-light); cursor: pointer; transition: all 0.2s; }
                .tab-btn.active { background: var(--primary-blue); color: white; box-shadow: 0 4px 10px rgba(0, 44, 119, 0.2); }
                .ranking-card { display: flex; align-items: center; background: white; padding: 15px 20px; border-radius: 20px; margin-bottom: 12px; box-shadow: var(--shadow); border: 1px solid transparent; }
                .rank-1 { background: linear-gradient(135deg, #FFF9C4 0%, #FFFFFF 100%); border: 1px solid #FFD54F; }
                .rank-2 { background: linear-gradient(135deg, #ECEFF1 0%, #FFFFFF 100%); border: 1px solid #B0BEC5; }
                .rank-3 { background: linear-gradient(135deg, #FFE0B2 0%, #FFFFFF 100%); border: 1px solid #FFCC80; }
                .rank-position { font-size: 1.5rem; margin-right: 15px; width: 40px; text-align: center; font-weight: 800; color: var(--primary-navy); }
                .rank-info { flex: 1; }
                .rank-info h3 { margin: 0 0 5px 0; font-size: 1.1rem; color: var(--primary-navy); }
                .rank-badge { background: rgba(0,0,0,0.05); padding: 3px 8px; border-radius: 8px; font-size: 0.75rem; font-weight: 600; color: var(--primary-blue); }
                .rank-score { font-weight: 700; color: var(--primary-navy); }
                .contributor-card { display: flex; align-items: center; gap: 15px; background: white; padding: 20px; border-radius: 24px; margin-bottom: 20px; box-shadow: var(--shadow-premium); border: 2px solid var(--accent-yellow); }
                .points-badge { background: var(--accent-yellow); color: var(--primary-navy); padding: 5px 12px; border-radius: 12px; font-weight: 800; font-size: 0.85rem; }
            `;
            document.head.appendChild(style);
        }
    }
};

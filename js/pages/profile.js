window.KindrProfile = {
    render: (container, user) => {
        if (!user) {
            // Fallback if accessed directly without auth (shouldn't happen due to app.js check)
            container.innerHTML = '<p>Por favor inicia sesión.</p>';
            return;
        }

        container.innerHTML = `
        <div class="profile-header" style="background: linear-gradient(135deg, var(--primary-navy), var(--primary-dark)); padding: 40px 20px;">
            <div class="avatar-large" style="font-weight: 800;">
                ${user.name.charAt(0)}
            </div>
            <h2 style="font-weight: 800; letter-spacing: -0.5px; margin-top: 10px;">${user.name}</h2>
            <span class="rank-badge" style="background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2);">🏆 ${user.rank}</span>
        </div>
        
        <div class="stats-row">
            <div class="stats-row">
                <div class="stat-item">
                    <span class="count">${user.points}</span>
                    <span class="label">Puntos</span>
                </div>
                <div class="stat-item">
                    <span class="count">12</span>
                    <span class="label">Reseñas</span>
                </div>
                <div class="stat-item">
                    <span class="count">5</span>
                    <span class="label">Logros</span>
                </div>
            </div>

            <div class="level-progress-container" style="margin: 0 20px; padding: 20px; background: white; border-radius: 20px; box-shadow: var(--shadow-soft);">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                    <span style="font-weight:700; color:var(--primary-navy);">Nivel 4: Explorador</span>
                    <span style="font-size:0.8rem; color:var(--text-light);">150 / 200 XP</span>
                </div>
                <div style="width:100%; height:12px; background:#f0f0f0; border-radius:10px; overflow:hidden;">
                    <div style="width:75%; height:100%; background:linear-gradient(90deg, var(--primary-blue), var(--primary-dark));"></div>
                </div>
                <p style="font-size:0.75rem; color:var(--text-light); margin-top:10px;">¡Aporta 5 reseñas más para subir de nivel!</p>
            </div>
        </div>

        <div class="qr-section">
            <h3>Tu Pase Familiar</h3>
            <p>Escanea para acceder a eventos</p>
            <div id="qrcode">
                 <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${user.id}" alt="QR Code">
            </div>
        </div>

        <div style="padding-bottom: 20px;">
            <button id="logout-btn" class="btn-danger">Cerrar Sesión</button>
        </div>

        <!-- Club Kindr Modal -->
        <div id="club-modal" class="modal hidden">
            <div class="auth-container slide-up-anim">
                <div class="auth-card">
                    <div style="font-size: 4rem;">👑</div>
                    <h2 style="color: var(--accent-yellow); text-shadow: 1px 1px 0 #dbaa00;">CLUB KINDR</h2>
                    <p>Canjea tus puntos por premios reales.</p>
                    <hr class="divider">
                    <div style="text-align:left; margin-top:20px;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:15px; padding:10px; background:#f9f9f9; border-radius:12px;">
                            <span>☕ café Gratis</span>
                            <button class="btn-tiny">100 pts</button>
                        </div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:15px; padding:10px; background:#f9f9f9; border-radius:12px;">
                            <span>🎟️ Entrada Zoo -50%</span>
                            <button class="btn-tiny" style="background:#ccc; cursor:not-allowed;">500 pts</button>
                        </div>
                    </div>
                    <button id="close-club-btn" class="btn-text">Cerrar</button>
                </div>
            </div>
        </div>
    `;

        document.getElementById('logout-btn').addEventListener('click', window.KindrAuth.logout);

        document.getElementById('trophy-btn').addEventListener('click', () => {
            document.getElementById('club-modal').classList.remove('hidden');
        });

        document.getElementById('close-club-btn').addEventListener('click', () => {
            document.getElementById('club-modal').classList.add('hidden');
        });
    }
};

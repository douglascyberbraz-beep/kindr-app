window.KindrProfile = {
    render: (container, user) => {
        if (!user) {
            // Fallback if accessed directly without auth (shouldn't happen due to app.js check)
            container.innerHTML = '<p>Por favor inicia sesión.</p>';
            return;
        }

        container.innerHTML = `
        <div class="profile-header">
            <div class="avatar-large">
                ${user.name.charAt(0)}
            </div>
            <h2>${user.name}</h2>
            <span class="rank-badge">🏆 ${user.rank}</span>
        </div>
        
        <div class="stats-row">
            <div class="stat-item">
                <span class="count">
                    ${user.points} 
                    <span id="trophy-btn" style="cursor:pointer; display:inline-block;">🏆</span>
                </span>
                <span class="label">Puntos KINDR</span>
            </div>
            <div class="stat-item">
                <span class="count">12</span>
                <span class="label">Reseñas</span>
            </div>
            <div class="stat-item">
                <span class="count">5</span>
                <span class="label">Eventos</span>
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

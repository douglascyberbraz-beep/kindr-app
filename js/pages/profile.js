window.KindrProfile = {
    render: (container, user) => {
        if (!user) {
            // Fallback if accessed directly without auth (shouldn't happen due to app.js check)
            container.innerHTML = '<p>Por favor inicia sesión.</p>';
            return;
        }

        container.innerHTML = `
        <div class="profile-clean-container">
            <!-- Minimal Header -->
            <div class="profile-minimal-header">
                <div class="avatar-container">
                    <div class="avatar-circle">
                        ${user.name.charAt(0)}
                    </div>
                </div>
                <div class="profile-info">
                    <h2>${user.name}</h2>
                    <span class="user-id">Miembro desde Feb 2024</span>
                </div>
                <button id="trophy-btn" class="trophy-btn-icon">👑</button>
            </div>

            <!-- Dashboard Card -->
            <div class="profile-card dashboard-card">
                <div class="stat-grid">
                    <div class="stat-pill">
                        <span class="stat-val">${user.points}</span>
                        <span class="stat-lbl">Puntos</span>
                    </div>
                    <div class="stat-pill">
                        <span class="stat-val">12</span>
                        <span class="stat-lbl">Reseñas</span>
                    </div>
                    <div class="stat-pill">
                        <span class="stat-val">5</span>
                        <span class="stat-lbl">Logros</span>
                    </div>
                </div>

                <div class="level-box">
                    <div class="level-header">
                        <span class="level-tag">Nivel 4: Explorador</span>
                        <span class="xp-count">150/200 XP</span>
                    </div>
                    <div class="progress-bar-minimal">
                        <div class="progress-fill" style="width: 75%;"></div>
                    </div>
                </div>
            </div>

            <!-- Digital Pass Card -->
            <div class="profile-card pass-card">
                <div class="pass-header">
                    <span class="pass-icon">🎫</span>
                    <div class="pass-text">
                        <h3>Pase Familiar</h3>
                        <p>ID: KNDR-4421-002</p>
                    </div>
                </div>
                <div class="qr-wrapper">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${user.id}" alt="QR">
                </div>
                <p class="qr-info">Escanea este código en establecimientos asociados para obtener descuentos.</p>
            </div>

            <div class="actions-area">
                <button id="logout-btn" class="logout-link">Cerrar Sesión</button>
            </div>
        </div>
        
        <!-- Club Kindr Modal remains same -->
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

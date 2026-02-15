window.KindrAuth = {
    checkAuth: () => {
        const user = localStorage.getItem('kindr_user');
        return user ? JSON.parse(user) : null;
    },

    login: (email, password) => {
        // Mock login logic
        if (email && password) {
            const user = {
                name: "Usuario Beta",
                email: email,
                id: 'user_' + Math.random().toString(36).substr(2, 9),
                points: 150,
                rank: "Explorador"
            };
            localStorage.setItem('kindr_user', JSON.stringify(user));
            return user;
        }
        return null;
    },

    logout: () => {
        localStorage.removeItem('kindr_user');
        localStorage.removeItem('kindr_guest');
        window.location.reload();
    },

    setGuestMode: () => {
        localStorage.setItem('kindr_guest', 'true');
        return { name: "Invitado", isGuest: true };
    },

    renderAuthModal: () => {
        const modal = document.getElementById('auth-modal');
        modal.classList.remove('hidden');
        modal.innerHTML = `
            <div class="auth-container">
                <div class="auth-card">
                    <div class="logo-small">
                         <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#0056b3"/>
                            <path d="M12 7.5C11.17 7.5 10.5 8.17 10.5 9C10.5 9.83 11.17 10.5 12 10.5C12.83 10.5 13.5 9.83 13.5 9C13.5 8.17 12.83 7.5 12 7.5Z" fill="white"/>
                        </svg>
                    </div>
                    <h2>Bienvenido a KINDR</h2>
                    <p>Únete a la comunidad de padres</p>
                    
                    <form id="login-form">
                        <input type="email" id="email" placeholder="Correo electrónico" required class="auth-input">
                        <input type="password" id="password" placeholder="Contraseña" required class="auth-input">
                        <button type="submit" class="auth-btn">Iniciar Sesión</button>
                        <button type="button" id="guest-btn" class="auth-btn secondary-btn" style="background: var(--secondary-blue); color: var(--primary-dark); margin-top: -10px;">Continuar como Invitado</button>
                        <div class="divider">o</div>
                        <button type="button" class="google-btn">Continuar con Google</button>
                        <button type="button" class="apple-btn">Continuar con Apple</button>
                    </form>
                    <p class="toggle-auth">¿No tienes cuenta? <a href="#">Regístrate</a></p>
                </div>
            </div>
        `;

        // Add CSS for modal securely (or ensure it's in main.css)

        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const user = window.KindrAuth.login(email, password);
            if (user) {
                modal.classList.add('hidden');
                location.reload();
            }
        });

        document.getElementById('guest-btn').addEventListener('click', () => {
            window.KindrAuth.setGuestMode();
            modal.classList.add('hidden');
            location.reload();
        });
    }
};

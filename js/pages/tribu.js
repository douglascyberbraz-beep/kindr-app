window.KindrTribu = {
    render: (container) => {
        container.innerHTML = `
            <div class="page-header sticky-header">
                <h2><img src="assets/logo.png" style="height:24px; vertical-align:middle; margin-right:8px;"> Tribu</h2>
                <p>Lo que dicen otros padres</p>
                <button class="btn-icon-pulse" id="new-post-btn">➕</button>
            </div>
            
            <div id="tribu-feed" class="content-list stagger-group" style="padding-bottom: 100px;">
                <!-- Posts go here -->
            </div>

            <!-- New Post Modal -->
            <div id="post-modal" class="modal hidden">
                <div class="auth-container slide-up-anim">
                    <div class="auth-card">
                        <h3>Nueva Publicación</h3>
                        <textarea id="post-content" maxlength="160" placeholder="¿Qué quieres compartir? (Max 160 carácteres)" class="post-input"></textarea>
                        <div class="char-count">0/160</div>
                        <button id="publish-btn" class="btn-primary full-width">Publicar</button>
                        <button id="close-post-btn" class="btn-text" style="margin-top:10px;">Cancelar</button>
                    </div>
                </div>
            </div>
        `;

        const feedContainer = document.getElementById('tribu-feed');
        const posts = window.KindrData.getTribuPosts();

        const renderPosts = (postList) => {
            feedContainer.innerHTML = '';
            postList.forEach(post => {
                const card = document.createElement('div');
                card.className = 'tribu-card';
                card.innerHTML = `
                    <div class="tribu-header">
                        <div class="tribu-avatar">${post.avatar}</div>
                        <div class="tribu-info">
                            <span class="tribu-user">${post.user}</span>
                            <span class="tribu-time">${post.time}</span>
                        </div>
                    </div>
                    <p class="tribu-content">${post.content}</p>
                    <div class="tribu-actions">
                        <button class="action-btn">❤️ ${post.likes}</button>
                        <button class="action-btn">💬 ${post.comments}</button>
                        <button class="action-btn">🔗</button>
                    </div>
                `;
                feedContainer.appendChild(card);
            });
        };

        renderPosts(posts);

        // Modal Logic
        const modal = document.getElementById('post-modal');
        const contentInput = document.getElementById('post-content');

        document.getElementById('new-post-btn').addEventListener('click', () => {
            modal.classList.remove('hidden');
            contentInput.focus();
        });

        document.getElementById('close-post-btn').addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        document.getElementById('publish-btn').addEventListener('click', () => {
            const text = contentInput.value.trim();
            if (text) {
                // Mock Add Post
                posts.unshift({
                    id: Date.now(),
                    user: "Tú",
                    avatar: "😎",
                    time: "Ahora",
                    content: text,
                    likes: 0,
                    comments: 0
                });
                renderPosts(posts);
                modal.classList.add('hidden');
                contentInput.value = '';
                // Sound effect or vibration could go here
            }
        });

        // Add Styles for Tribu Page specifically
        if (!document.getElementById('tribu-styles')) {
            const style = document.createElement('style');
            style.id = 'tribu-styles';
            style.textContent = `
                .sticky-header {
                    position: sticky;
                    top: 0;
                    background: var(--glass);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    z-index: 100;
                    padding: 20px;
                    border-bottom: 1px solid rgba(0,0,0,0.05);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .btn-icon-pulse {
                    width: 45px;
                    height: 45px;
                    border-radius: 16px; /* Squircle for premium look */
                    background: var(--primary-navy);
                    color: white;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                    box-shadow: 0 8px 20px rgba(0, 44, 119, 0.2);
                    transition: all 0.3s ease;
                }
                .btn-icon-pulse:active { transform: scale(0.9); }
                .tribu-card {
                    background: white;
                    padding: 24px;
                    border-radius: 24px;
                    margin-bottom: 20px;
                    box-shadow: var(--shadow-soft);
                    border: 1px solid rgba(0,0,0,0.03);
                    transition: all 0.3s ease;
                }
                .tribu-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-premium); }
                .tribu-header {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 12px;
                }
                .tribu-avatar {
                    width: 40px;
                    height: 40px;
                    background: var(--secondary-blue);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                }
                .tribu-info {
                    display: flex;
                    flex-direction: column;
                }
                .tribu-user {
                    font-weight: 700;
                    font-size: 0.95rem;
                }
                .tribu-time {
                    font-size: 0.75rem;
                    color: var(--text-muted);
                }
                .tribu-content {
                    font-size: 1rem;
                    line-height: 1.5;
                    color: var(--text-main);
                    margin-bottom: 15px;
                }
                .tribu-actions {
                    display: flex;
                    gap: 20px;
                    border-top: 1px solid #f0f0f0;
                    padding-top: 12px;
                }
                .action-btn {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    font-size: 0.9rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    transition: color 0.2s;
                }
                .action-btn:hover {
                    color: var(--accent-pink);
                }
                .post-input {
                    width: 100%;
                    height: 120px;
                    border: 1px solid #eee;
                    border-radius: 12px;
                    padding: 15px;
                    font-family: inherit;
                    resize: none;
                    margin-bottom: 10px;
                }
                .full-width { width: 100%; }
                @keyframes pulse-soft {
                    0% { box-shadow: 0 0 0 0 rgba(109, 40, 217, 0.4); }
                    70% { box-shadow: 0 0 0 10px rgba(109, 40, 217, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(109, 40, 217, 0); }
                }
            `;
            document.head.appendChild(style);
        }
    }
};

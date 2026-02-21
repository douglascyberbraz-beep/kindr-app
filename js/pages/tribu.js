window.KindrTribu = {
    // Keep state cached in memory
    postsCache: null,

    render: (container) => {
        container.innerHTML = `
            <div class="page-header sticky-header">
                <h2>🏘️ Tribu</h2>
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

        if (!window.KindrTribu.postsCache) {
            window.KindrTribu.postsCache = window.KindrData.getTribuPosts();
        }
        const posts = window.KindrTribu.postsCache;

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
        // Add Styles for Tribu Page specifically
        // Styles moved to main.css
    }
};

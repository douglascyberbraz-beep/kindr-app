window.KindrChat = {
    render: (container) => {
        container.innerHTML = `
            <div class="chat-container">
                <div class="chat-header premium-glass">
                    <div class="bot-avatar gradient-bg">🐦</div>
                    <div>
                        <h3>KINDR IA</h3>
                        <div class="status-indicator"><span class="pulse-dot"></span> Online</div>
                    </div>
                </div>
                <div id="chat-messages" class="chat-messages premium-bg">
                    <div class="message bot entry-anim">
                        <p>¡Hola! Soy tu asistente KINDR. ¿En qué puedo ayudarte hoy?</p>
                    </div>
                </div>
                <div class="chat-input-area premium-glass">
                    <input type="text" id="chat-input" placeholder="Pregunta lo que necesites..." autocomplete="off">
                    <button id="send-btn" class="send-btn premium-shadow">➤</button>
                </div>
            </div>
            <!-- Styles moved to main.css -->
        `;

        const input = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');
        const messages = document.getElementById('chat-messages');

        const sendMessage = () => {
            const text = input.value.trim();
            if (!text) return;

            // User Message
            appendMessage(text, 'user');
            input.value = '';

            // Simulate Typing
            const loadingId = appendLoading();

            // Mock Response Delay
            setTimeout(() => {
                removeLoading(loadingId);
                const response = getMockResponse(text);
                appendMessage(response, 'bot');
            }, 1500);
        };

        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        function appendMessage(text, sender) {
            const div = document.createElement('div');
            div.className = `message ${sender}`;
            div.innerHTML = `<p>${text}</p>`;
            messages.appendChild(div);
            messages.scrollTop = messages.scrollHeight;
        }

        function appendLoading() {
            const id = 'loading-' + Date.now();
            const div = document.createElement('div');
            div.id = id;
            div.className = 'message bot entry-anim';
            div.innerHTML = `<div class="typing-dots"><span></span><span></span><span></span></div>`;
            messages.appendChild(div);
            messages.scrollTop = messages.scrollHeight;
            return id;
        }

        function removeLoading(id) {
            const el = document.getElementById(id);
            if (el) el.remove();
        }

        function getMockResponse(query) {
            const lower = query.toLowerCase();
            if (lower.includes('beca')) return "El plazo de solicitud de becas para el curso 2024/2025 está abierto hasta el 30 de marzo. Puedes solicitarla en la web del Ministerio.";
            if (lower.includes('receta')) return "Te sugiero unas tortitas de avena y plátano. Son saludables y a los niños les encantan. ¿Quieres la receta completa?";
            if (lower.includes('plan') || lower.includes('hacer')) return "Para este fin de semana, el tiempo será soleado. Te recomiendo visitar el Parque del Retiro, hay un teatro de títeres a las 12:00.";
            return "¡Qué interesante! Como IA especializada en crianza, puedo buscar más información sobre eso. ¿Necesitas ayuda con algo más específico?";
        }
    }
};

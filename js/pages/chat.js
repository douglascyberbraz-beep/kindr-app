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
            <style>
                .premium-glass { background: rgba(255,255,255,0.8); backdrop-filter: blur(10px); }
                .gradient-bg { background: linear-gradient(135deg, var(--primary-navy), var(--primary-blue)); color: white; }
                .status-indicator { font-size: 0.7rem; color: #10B981; display:flex; align-items:center; gap:5px; font-weight:600; }
                .pulse-dot { width: 6px; height: 6px; background: #10B981; border-radius: 50%; animation: pulse-green 2s infinite; }
                .chat-messages.premium-bg { background: #F8FAFC; }
                .message { border-radius: 20px !important; box-shadow: 0 4px 12px rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.02); }
                .message.bot { background: white; border-bottom-left-radius: 5px !important; }
                .message.user { background: var(--primary-navy); border-bottom-right-radius: 5px !important; }
                .entry-anim { animation: messageIn 0.4s cubic-bezier(0.23, 1, 0.32, 1); }
                @keyframes pulse-green { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
                @keyframes messageIn { from { opacity: 0; transform: translateY(10px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
                .typing-dots span { width: 4px; height: 4px; background: var(--text-light); border-radius: 50%; display: inline-block; animation: typing 1s infinite; }
                .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
                .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
                @keyframes typing { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
            </style>
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

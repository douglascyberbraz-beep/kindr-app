window.KidoaAI = {
    // Especialización en Crianza
    SYSTEM_PROMPT: `Eres KIDOA IA, la asistente oficial de la App KIDOA, experta líder en crianza consciente, salud infantil (0-15 años), psicología positiva y nutrición. 
    Tu misión es ayudar a padres modernos a encontrar planes y soluciones basados ESTRICTAMENTE en su zona geográfica actual.
    - Estilo: Empático, ultra-personalizado, premium.
    - Geografía: Identifica SIEMPRE la ciudad y provincia de las coordenadas proporcionadas y limita la información a esa zona.
    - Seguridad: Si detectas consultas médicas críticas, ofrece consejos de calma pero siempre recomienda visitar al pediatra.`,

    // Buscar Noticias Regionales
    getNews: async (coordinates = "41.6520, -4.7286") => {
        const prompt = `Actúa como periodista local. Ubicación del usuario: ${coordinates}.
        1. Identifica la CIUDAD y PROVINCIA de estas coordenadas.
        2. Busca 3 noticias o avisos oficiales REALES de HOY sobre crianza, parques, colegios o vida familiar específicos de esa ciudad o provincia.
        3. Prioriza fuentes oficiales (ayuntamientos, juntas regionales, diarios locales).
        4. PROHIBIDO: No uses ejemplos, no uses noticias de otras regiones, no inventes nombres de colegios o parques. SI NO HAY NOTICIAS REALES HOY, devuelve una lista vacía [].
        5. No menciones otras regiones. Solo información de su zona o provincia autonoma.
        Formato JSON: [ { "title": "", "summary": "", "link": "url", "sourceName": "Fuente Local", "date": "Hoy" } ]`;

        return await window.KidoaAI._callGemini(prompt);
    },

    // Buscar Eventos Infantiles (0-15 años)
    getEvents: async (coordinates = "41.6520, -4.7286") => {
        const prompt = `Busca eventos infantiles (0-15 años) cerca de ${coordinates}.
        1. Identifica la CIUDAD de estas coordenadas.
        2. Busca eventos REALES para los próximos 7 días: teatro infantil, música, aire libre, talleres.
        3. Solo eventos en su municipio o municipios colindantes (su zona).
        4. PROHIBIDO: No inventes eventos. Si no hay nada real, devuelve una lista vacía [].
        Formato JSON: [ { "title": "", "date": "", "location": "Sitio Real", "price": "", "lat": NUM, "lng": NUM } ]`;

        return await window.KidoaAI._callGemini(prompt);
    },

    // Buscar Becas y Ayudas
    getBecas: async (coordinates = "41.6520, -4.7286") => {
        const prompt = `Ubicación: ${coordinates}.
        1. Identifica la PROVINCIA y COMUNIDAD AUTÓNOMA.
        2. Busca 3 becas o ayudas familiares de fuentes oficiales vigentes (BOCYL, DOGC, BOCM, etc.).
        3. PROHIBIDO: No inventes plazos o nombres de becas si no existen. Si no hay nada real, devuelve [].
        Formato JSON: [ { "title": "", "description": "", "status": "PLAZO ABIERTO", "statusColor": "green", "linkText": "Ver bases oficiales" } ]`;

        return await window.KidoaAI._callGemini(prompt);
    },

    getTodayActivities: async (coordinates = "41.6520, -4.7286", preferences = null) => {
        let prefsContext = "";
        if (preferences) {
            prefsContext = `
            CONTEXTO DE LA FAMILIA:
            - Miembros: ${preferences.adults} adultos y ${preferences.kids} niños (edades: ${preferences.ages}).
            - Preferencia: ${preferences.environment} (${preferences.environment === 'Indoor' ? 'Sitios cerrados/resguardados' : preferences.environment === 'Outdoor' ? 'Al aire libre' : 'Ambos'}).
            - Presupuesto: ${preferences.budget === 'Free' ? 'Solo planes gratuitos' : 'Cualquier presupuesto'}.
            - Distancia: ${preferences.distance === 'Walking' ? 'Cerca, para ir andando' : preferences.distance === 'ShortDrive' ? 'A poca distancia en coche' : 'Cualquier distancia'}.
            `;
        }

        const prompt = `Actúa como un planificador de ocio familiar experto y creativo. Ubicación: ${coordinates}. No uses datos de ejemplo.
        ${prefsContext}
        1. Identifica la CIUDAD y PROVINCIA de estas coordenadas.
        2. Genera 3-4 actividades para HOY mismo que encajen con el contexto.
        3. PROHIBIDO: Inventar nombres de parques o sitios. Usa lugares que existan en Google Maps.
        4. Para cada actividad, necesito:
           - Título real y emocionante.
           - Resumen específico (nada de "disfruta de un día genial").
           - Horarios reales sugeridos.
           - Ubicación exacta real.
           - Coordenadas REALES precisas.
           - Precio aproximado real.
           - Enlace real si existe.
           - Edad, Duración y un Consejo Útil.
        5. Si no hay nada real bajo este contexto, devuelve [].
        Formato JSON: [ { "title": "", "summary": "", "time": "", "location": "", "lat": NUM, "lng": NUM, "price": "", "link": "", "age": "", "duration": "", "tip": "" } ]`;

        return await window.KidoaAI._callGemini(prompt);
    },

    // Check usage limits for free users
    checkTodayLimit: () => {
        const user = window.KidoaAuth.checkAuth();
        const isPremium = user && (user.level === 'Oro' || user.level === 'Premium' || user.isPremium);
        if (isPremium) return { canRequest: true };

        const today = new Date().toDateString();
        const usage = JSON.parse(localStorage.getItem('kidoa_today_usage') || '{}');

        if (usage.date !== today) {
            usage.date = today;
            usage.count = 0;
        }

        if (usage.count >= 3) {
            return { canRequest: false, limit: 3 };
        }

        return { canRequest: true, usage };
    },

    incrementTodayUsage: () => {
        const usage = JSON.parse(localStorage.getItem('kidoa_today_usage') || '{}');
        usage.count = (usage.count || 0) + 1;
        localStorage.setItem('kidoa_today_usage', JSON.stringify(usage));
    },

    // Generador Dinámico de Mapa (Basado en Coordenadas)
    getDynamicLocations: async (coordinates = "41.6520, -4.7286") => {
        const prompt = `Ubicación GPS: ${coordinates}. Genera 8 sitios REALES verificados para familias (parques, museos, etc.).
        ADVERTENCIA: PROHIBIDO inventar nombres. Si no conoces el sitio real, no lo listes.
        Devuelve JSON con nombres locales exactos y coordenadas reales.
        Formato: [ { "id": UID, "name": "Nombre Real Exacto", "type": "park"|"museum"|"school"|"theater"|"kidzone"|"food", "lat": NUM, "lng": NUM, "rating": 4.5, "reviews": 100 } ]`;

        return await window.KidoaAI._callGemini(prompt);
    },

    // Búsqueda Semántica Dinámica
    searchDynamicLocations: async (query, coordinates = "41.6520, -4.7286") => {
        const prompt = `El usuario, ubicado en las coordenadas: ${coordinates}, ha buscado: "${query}".
        Recomienda 4 o 5 lugares locales reales que resuelvan perfectamente esta necesidad.
        Formato esperado JSON:
        [ { "id": UID_NUMERICO_UNICO, "name": "Nombre Real", "type": "park"|"museum"|"school"|"theater"|"kidzone"|"food"|"generic", "lat": NUMERO, "lng": NUMERO, "rating": 4.8, "reviews": 120 } ]`;

        return await window.KidoaAI._callGemini(prompt);
    },

    // Generar Misiones Contextuales
    generateLocalQuests: async (coordinates = "41.6520, -4.7286") => {
        const prompt = `Crea 2 'Misiones Familiares' (Quests) divertidas y muy específicas para jugar hoy basadas en lugares REALES cerca de estas coordenadas GPS: ${coordinates}.
        Ejemplo: "Encuentra la estatua en la Plaza de Zorrilla", "Haz un mini picnic en el Parque Ribera de Castilla".
        Ten en cuenta el clima actual típico de la zona.
        Formato JSON estricto: [ { "id": "q_ai_1", "title": "Nombre divertido", "description": "Breve descripción", "type": "EXPLORATION"|"CREATIVITY", "category": "Misión", "difficulty": "fácil"|"media", "points": 100, "objectives": ["Paso 1", "Paso 2"], "totalSteps": 2, "status": "active" } ]`;

        return await window.KidoaAI._callGemini(prompt);
    },

    // Generar Alerta/Consejo de Seguridad (Clima o Noticias)
    getDailySafeInsight: async (coordinates = "41.6520, -4.7286") => {
        const prompt = `Actúa como asesor de seguridad familiar de Kidoa. Ubicación: ${coordinates}.
        1. Identifica la CIUDAD y el CLIMA ACTUAL REAL de esa zona.
        2. Genera un consejo de seguridad o meteorología infantil MUY ESPECÍFICO para HOY.
        3. Si hay avisos meteorológicos reales (AEMET o similar), menciónalos.
        4. Si no hay avisos, da un consejo de salud estacional (ej: polen, protección solar, abrigo).
        No uses frases genéricas como "Analizando tu zona". Da información directa y útil en 1 o 2 frases.`;

        return await window.KidoaAI._callGemini(prompt, false); // False = Devuelve texto, no JSON
    },

    // Generar Topic Diario para la Tribu
    getDailyTribuTopic: async (coordinates = "41.6520, -4.7286") => {
        const prompt = `Genera un post para un foro de padres ('La Tribu') en la ciudad correspondiente a las coordenadas GPS: ${coordinates}.
        Debe ser un debate o consejo interesante sobre crianza y la vida en esa ciudad específica.
        Formato JSON estricto: { "authorKey": "KIDOA_IA", "title": "El Debate del Día 🤖", "content": "Contenido del debate..." }`;
        return await window.KidoaAI._callGemini(prompt, true);
    },

    // Chat Especializado
    chat: async (userMessage, history = []) => {
        const prompt = `${window.KidoaAI.SYSTEM_PROMPT}\n\nHistorial: ${JSON.stringify(history)}\nUsuario: ${userMessage}`;
        const response = await window.KidoaAI._callGemini(prompt, false); // false = return text, not json
        return response;
    },

    // Helper para llamadas a Gemini
    _callGemini: async (prompt, expectJson = true) => {
        if (!window.GEMINI_KEY || window.GEMINI_KEY.includes('PEGAR_AQUI')) {
            return window.KidoaAI._getMockData(prompt);
        }

        try {
            const requestBody = {
                contents: [{ parts: [{ text: prompt }] }]
            };

            if (expectJson) {
                requestBody.generationConfig = { response_mime_type: "application/json" };
            }

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${window.GEMINI_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Gemini API Error:", response.status, errorText);
                return window.KidoaAI._getMockData(prompt);
            }

            const data = await response.json();

            if (!data.candidates || !data.candidates[0].content) {
                console.error("Gemini returned no content:", data);
                return window.KidoaAI._getMockData(prompt);
            }

            const text = data.candidates[0].content.parts[0].text;

            if (expectJson) {
                try {
                    let cleanText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
                    const firstBrace = cleanText.indexOf('{');
                    const firstBracket = cleanText.indexOf('[');
                    const lastBrace = cleanText.lastIndexOf('}');
                    const lastBracket = cleanText.lastIndexOf(']');

                    let startIndex = Math.min(
                        firstBrace !== -1 ? firstBrace : Infinity,
                        firstBracket !== -1 ? firstBracket : Infinity
                    );
                    let endIndex = Math.max(
                        lastBrace !== -1 ? lastBrace : -1,
                        lastBracket !== -1 ? lastBracket : -1
                    );

                    if (startIndex !== Infinity && endIndex !== -1) {
                        cleanText = cleanText.substring(startIndex, endIndex + 1);
                    }

                    return JSON.parse(cleanText);
                } catch (e) {
                    console.warn("⚠️ Fallback AI (Error de Parseo JSON):", text);
                    return window.KidoaAI._getMockData(prompt);
                }
            }
            return text.trim();
        } catch (e) {
            console.error("❌ Error Crítico Gemini (Red o Ejecución):", e);
            return window.KidoaAI._getMockData(prompt);
        }
    },

    _getMockData: (prompt) => {
        const lowerPrompt = prompt.toLowerCase();
        const msg = "Para ver planes reales en tu zona, activa el GPS y asegúrate de tener conexión.";
        
        if (lowerPrompt.includes('today') || lowerPrompt.includes('activities') || lowerPrompt.includes('hoy')) return [
            { id: 1, title: "Activando KIDOA IA...", summary: msg, time: "Aviso", location: "Tu Ciudad", lat: 0, lng: 0, price: "Gratis", age: "Familiar" }
        ];

        if (lowerPrompt.includes('news') || lowerPrompt.includes('noticias')) return [];
        if (lowerPrompt.includes('events') || lowerPrompt.includes('eventos')) return [];
        if (lowerPrompt.includes('becas') || lowerPrompt.includes('ayudas')) return [];
        if (lowerPrompt.includes('lugares') || lowerPrompt.includes('locations')) return [];

        return [];
    }
};

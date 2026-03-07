window.KidoaAI = {
    // Especialización en Crianza
    SYSTEM_PROMPT: `Eres KIDOA IA, la asistente oficial de la App KIDOA, experta líder en crianza consciente, salud infantil (0-15 años), psicología positiva y nutrición. 
    Tu misión es ayudar a padres modernos a encontrar planes y soluciones.
    - Estilo: Empático, ultra-personalizado, premium.
    - Seguridad: Si detectas consultas médicas críticas, ofrece consejos de calma pero siempre recomienda visitar al pediatra.
    - Conocimiento: Conoces perfectamente Castilla y León y las ayudas/becas estatales vigentes.`,

    // Buscar Noticias Regionales
    getNews: async (coordinates = "41.6520, -4.7286") => {
        const prompt = `Busca las 3 noticias o eventos oficiales más relevantes de HOY sobre crianza, niños, hijos, parques, escuelas o trámites familiares cerca de ${coordinates}.
        IMPORTANTE: Busca información REAL en páginas oficiales (ej: jcyl.es, ayuntamientos o diarios locales de Castilla y León). 
        Prioriza palabras clave: crianza, hijos, educación infantil.
        Resumen corto y elegante.
        Formato JSON estricto: [ { "title": "", "summary": "", "link": "url_real", "sourceName": "JCYL / Ayto / Diario...", "date": "Hoy" } ]`;

        return await window.KidoaAI._callGemini(prompt);
    },

    // Buscar Eventos Infantiles (0-15 años)
    getEvents: async (coordinates = "41.6520, -4.7286") => {
        const prompt = `Busca eventos infantiles (0-15 años) para los próximos 7 días cerca de ${coordinates}.
        Enfoque: Actividades al aire libre, musicales, obras de teatro infantil, talleres en museos locales. 
        IMPORTANTE: Busca en agendas culturales de Ayuntamientos o prensa local de la zona.
        Necesito las coordenadas aproximadas del evento.
        Formato JSON estricto: [ { "title": "", "date": "", "location": "", "price": "", "lat": NUM, "lng": NUM } ]`;

        return await window.KidoaAI._callGemini(prompt);
    },

    // Buscar Becas y Ayudas
    getBecas: async (coordinates = "41.6520, -4.7286") => {
        const prompt = `Busca las 3 becas o ayudas económicas familiares más recientes en el BOCYL (Boletín Oficial de Castilla y León) o JCYL cerca de ${coordinates}.
        Keywords: niños, hijos, crianza, infantil, libros, guardería.
        Formato JSON estricto: [ { "title": "", "description": "", "status": "PLAZO ABIERTO / CERRADO", "statusColor": "green o orange", "linkText": "Ver en BOCYL/JCYL" } ]`;

        return await window.KidoaAI._callGemini(prompt);
    },

    // Generador Dinámico de Mapa (Basado en Coordenadas)
    getDynamicLocations: async (coordinates = "41.6520, -4.7286") => {
        const prompt = `Actúa como guía turístico local familiar. Genera 8 sitios reales increíbles para ir con niños (parques, museos, ludotecas, restaurantes kid-friendly) en un radio cercano de las coordenadas GPS: ${coordinates}.
        Devuélvelos en formato JSON estricto para mapearlos directamente.
        Asegúrate de incluir sus nombres reales locales, no te inventes nombres de comercios si no existen, dales coordenadas muy cercanas al usuario.
        Formato esperado:
        [ { "id": UID_NUMERICO_UNICO, "name": "Nombre Real", "type": "park"|"museum"|"school"|"theater"|"kidzone"|"food", "lat": NUMERO, "lng": NUMERO, "rating": NUMERO_4_A_5, "reviews": NUMERO } ]`;

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
        const prompt = `Genera un consejo rápido de seguridad o meteorología infantil (1 o 2 frases) para una familia que se encuentra ahora mismo en la zona de las coordenadas GPS: ${coordinates}.
        Ejemplo: "Atención: Hoy se esperan lluvias a partir de las 17h, no olvides llevar paraguas y calzado adecuado."
        Formato texto plano.`;

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
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${window.GEMINI_KEY}`, {
                method: 'POST',
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });

            const data = await response.json();
            const text = data.candidates[0].content.parts[0].text;

            if (expectJson) {
                const cleanJson = text.replace(/```json|```/g, '').trim();
                return JSON.parse(cleanJson);
            }
            return text;
        } catch (e) {
            console.error("Error en KidoaAI:", e);
            return expectJson ? [] : "Lo siento, tengo problemas para conectarme ahora mismo.";
        }
    },

    _getMockData: (prompt) => {
        // Fallback robusto para demos sin internet/clave
        if (prompt.includes('noticia')) return [
            { title: "Bono Cuidado Regional", summary: "Nuevas ayudas para la conciliación familiar disponibles este mes.", source: "https://ejemplo.es", sourceName: "BOE" }
        ];
        return [];
    }
};

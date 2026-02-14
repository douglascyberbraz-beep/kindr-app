// --------------------------------------------------------------
// CONFIGURACIÓN DE FIREBASE Y GEMINI
// --------------------------------------------------------------
// Paso 1: Pega aquí abajo tu configuración de Firebase
// (La obtienes en Project Settings -> General -> Your apps -> Web app)

const firebaseConfig = {
    apiKey: "PEGAR_AQUI_TU_API_KEY",
    authDomain: "PEGAR_AQUI_TU_PROJECT_ID.firebaseapp.com",
    projectId: "PEGAR_AQUI_TU_PROJECT_ID",
    storageBucket: "PEGAR_AQUI_TU_PROJECT_ID.firebasestorage.app",
    messagingSenderId: "PEGAR_AQUI_SENDER_ID",
    appId: "PEGAR_AQUI_APP_ID"
};

// Paso 2: Pega aquí tu API Key de Google Gemini (Para el Chat IA)
// (La obtienes en https://aistudio.google.com/app/apikey)
const GEMINI_API_KEY = "PEGAR_AQUI_TU_GEMINI_API_KEY";

// --------------------------------------------------------------
// NO TOCAR NADA DEBAJO DE ESTA LÍNEA
// --------------------------------------------------------------

// Inicializar Firebase (Versión Compat para ejecución local sin servidor)
if (window.firebase) {
    firebase.initializeApp(firebaseConfig);
    window.KindrApp = firebase.app();
    window.KindrAuthReal = firebase.auth();
    window.KindrDB = firebase.firestore();
    console.log("🔥 Firebase conectado correctamente");
} else {
    console.error("❌ Error: Librerías de Firebase no cargadas.");
}

// Exponer clave de Gemini globalmente para el chat
window.GEMINI_KEY = GEMINI_API_KEY;

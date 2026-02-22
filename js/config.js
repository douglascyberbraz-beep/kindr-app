// --------------------------------------------------------------
// CONFIGURACIÓN DE FIREBASE Y GEMINI
// --------------------------------------------------------------
// Paso 1: Pega aquí abajo tu configuración de Firebase
// (La obtienes en Project Settings -> General -> Your apps -> Web app)

const firebaseConfig = {
    apiKey: "AIzaSyDppR0-A8bEKT1sjJDst1N6uZV-EsTLSYo",
    authDomain: "kindr-8d660.firebaseapp.com",
    projectId: "kindr-8d660",
    storageBucket: "kindr-8d660.firebasestorage.app",
    messagingSenderId: "552831875210",
    appId: "1:552831875210:web:1af5583c40e0d62bbf9573",
    measurementId: "G-2F3HNE2L5P"
};

// Paso 2: Pega aquí tu API Key de Google Gemini (Para el Chat IA)
// (La obtienes en https://aistudio.google.com/app/apikey)
const GEMINI_API_KEY = "AIzaSyD4tkqbo7diSZzpzu92magJiQJmpSoL8_Y";

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

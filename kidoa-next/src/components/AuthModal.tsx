"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AuthService } from '../services/auth_service';
import { useAppContext } from '../context/AppContext';

export default function AuthModal({ onClose }: { onClose?: () => void }) {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [nickname, setNickname] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loadingAuth, setLoadingAuth] = useState(false);
    
    const { playSound } = useAppContext();

    const handleAuth = async () => {
        setErrorMsg('');
        if (!email || !pass || (!isLoginMode && !nickname)) {
            setErrorMsg("Todos los campos son obligatorios.");
            return;
        }
        
        setLoadingAuth(true);
        playSound('click');
        try {
            if (isLoginMode) {
                await AuthService.login(email, pass);
            } else {
                await AuthService.register(email, pass, nickname);
            }
            playSound('success');
            if (onClose) onClose();
        } catch (e: any) {
            setErrorMsg(e.message || "Error de autenticación");
        }
        setLoadingAuth(false);
    };

    const handleSocial = async (provider: 'google' | 'apple' | 'guest') => {
        playSound('click');
        setLoadingAuth(true);
        try {
           if (provider === 'google') await AuthService.googleLogin();
           if (provider === 'apple') await AuthService.appleLogin();
           if (provider === 'guest') await AuthService.guestLogin();
           playSound('success');
           if (onClose) onClose();
        } catch (e: any) {
           setErrorMsg(`Error al conectar con ${provider}`);
        }
        setLoadingAuth(false);
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:p-0">
            <motion.div 
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-full max-w-md bg-white/80 backdrop-blur-3xl rounded-[40px] p-8 shadow-2xl border border-white/40 overflow-hidden relative"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10">
                    <div className="text-center mb-8">
                        {/* Using public assets directory logo */}
                        <div className="flex justify-center mb-4">
                            <span className="text-6xl">✨</span>
                        </div>
                        <h2 className="text-3xl font-black text-blue-950 tracking-tight">Bienvenido a KIDOA</h2>
                        <p className="text-slate-500 font-medium">Explora, comparte y crece con tu tribu</p>
                    </div>

                    {errorMsg && (
                        <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl mb-4 text-center font-medium border border-red-100">
                            {errorMsg}
                        </div>
                    )}

                    <div className="space-y-4">
                        {!isLoginMode && (
                            <input 
                                type="text"
                                placeholder="Tu Apodo / Nickname"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                className="w-full bg-white/60 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 font-medium transition-all"
                            />
                        )}
                        <input 
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/60 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 font-medium transition-all"
                        />
                        <input 
                            type="password"
                            placeholder="Contraseña"
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                            className="w-full bg-white/60 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 font-medium transition-all"
                        />
                        
                        <button 
                            onClick={handleAuth}
                            disabled={loadingAuth}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 active:scale-95 transition-transform text-white font-bold text-lg rounded-2xl py-4 shadow-lg shadow-blue-500/30"
                        >
                            {loadingAuth ? "Sincronizando..." : isLoginMode ? "Entrar" : "Crear cuenta"}
                        </button>

                        <button 
                            onClick={() => { setIsLoginMode(!isLoginMode); setErrorMsg(''); }}
                            className="w-full text-slate-500 text-sm font-semibold hover:text-blue-600 transition-colors py-2"
                        >
                            {isLoginMode ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
                        </button>
                    </div>

                    <div className="flex items-center gap-4 my-6">
                        <div className="h-px bg-slate-200 flex-1"></div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">O continúa con</span>
                        <div className="h-px bg-slate-200 flex-1"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <button 
                            onClick={() => handleSocial('google')}
                            className="flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-2xl py-3.5 font-bold text-slate-700 active:scale-95 transition-transform shadow-sm"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                            Google
                        </button>
                        <button 
                            onClick={() => handleSocial('apple')}
                            className="flex items-center justify-center gap-2 bg-black text-white rounded-2xl py-3.5 font-bold active:scale-95 transition-transform shadow-md"
                        >
                            <svg width="18" height="18" viewBox="0 0 384 512" fill="currentColor">
                                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                            </svg>
                            Apple
                        </button>
                    </div>

                    <button 
                        onClick={() => handleSocial('guest')}
                        disabled={loadingAuth}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-600 font-bold rounded-2xl py-3.5 active:scale-95 transition-transform"
                    >
                        Explorar como invitado
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

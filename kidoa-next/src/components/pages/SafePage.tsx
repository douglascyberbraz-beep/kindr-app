"use client";
import { motion } from "framer-motion";
import { useAppContext } from "../../context/AppContext";

export default function SafePage() {
    const { playSound } = useAppContext();

    return (
        <div className="p-8 pb-32 h-full overflow-y-auto bg-amber-50/50">
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-amber-900 tracking-tight text-center">SAFE ZONE</h1>
                <p className="text-amber-700/70 mt-1 text-center font-medium">Tranquilidad en tus aventuras</p>
            </header>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[40px] p-8 shadow-xl mb-8 border border-amber-100 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-40 h-40 bg-red-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
                
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-5xl mb-6 mx-auto shadow-inner border border-red-100">
                    🛡️
                </div>
                
                <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Botón SOS Familiar</h2>
                <p className="text-center text-slate-500 text-sm mb-8 px-4">
                    Avisa instantáneamente a tu tribu de confianza si ocurre una emergencia o si un explorador se extravía.
                </p>
                
                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { playSound('error'); alert("Simulación: Alerta SOS enviada a tu Tribu."); }}
                    className="w-full py-5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-[24px] font-black text-xl shadow-[0_10px_30px_rgba(239,68,68,0.4)] flex justify-center items-center gap-3 relative overflow-hidden border-b-4 border-red-700"
                >
                    <span className="relative z-10">🚨 ACTIVAR ALERTA SOS</span>
                    <motion.div 
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-white/20 skew-x-12 translate-x-[-150%]"
                    />
                </motion.button>
            </motion.div>

            <h3 className="text-sm font-bold text-amber-800 mb-4 px-2 uppercase tracking-widest">Ayuda Cercana</h3>
            <div className="space-y-4">
                <motion.div 
                    whileHover={{ x: 5 }}
                    className="bg-white rounded-[24px] p-5 shadow-sm border border-amber-100 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => playSound('click')}
                >
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 text-2xl border border-emerald-100">
                        🏥
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-slate-800">Hospital General</h3>
                        <p className="text-xs text-slate-500 font-medium">Ubicación verificada • A 1.2km</p>
                    </div>
                    <span className="text-emerald-500 font-bold text-xs bg-emerald-50 px-3 py-1 rounded-full">ABIERTO</span>
                </motion.div>

                <motion.div 
                    whileHover={{ x: 5 }}
                    className="bg-white rounded-[24px] p-5 shadow-sm border border-amber-100 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer opacity-80"
                >
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 text-2xl border border-blue-100 text-gray-400">
                        👮
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-slate-800">Puesto de Policía</h3>
                        <p className="text-xs text-slate-500 font-medium">Punto de encuentro • A 2.5km</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

"use client";
import { useState, useEffect } from "react";
import { KidoaAI } from "../../services/ai_service";
import { useAppContext } from "../../context/AppContext";

export default function TodayPage({ lastKnownCoords }: { lastKnownCoords: string }) {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<any[]>([]);
    const { playSound } = useAppContext();

    useEffect(() => {
        async function loadAIPlanes() {
            setLoading(true);
            try {
                // Pre-defined preferences for now, could be dynamic later
                const prefs = { adults: 2, kids: 1, ages: "5", environment: "parques y aire libre", budget: "económico" };
                const res = await KidoaAI.getTodayActivities(lastKnownCoords || "41.6520, -4.7286", prefs);
                
                if (res && Array.isArray(res)) {
                    setEvents(res);
                } else if (res && res.plans) {
                    setEvents(res.plans);
                }
            } catch (e) {
                console.error("Error loading AI plans:", e);
            } finally {
                setLoading(false);
            }
        }
        loadAIPlanes();
    }, [lastKnownCoords]);

    return (
        <div className="p-8 pb-32 h-full overflow-y-auto bg-slate-50">
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">TODAY</h1>
                <p className="text-slate-500 mt-1">✨ Planes personalizados por IA para hoy</p>
            </header>
            
            <div className="space-y-6">
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-[32px] p-6 shadow-medium border border-blue-50 animate-pulse">
                            <div className="flex justify-between mb-4">
                                <div className="h-4 w-16 bg-slate-100 rounded-full"></div>
                                <div className="h-4 w-12 bg-slate-100 rounded-full"></div>
                            </div>
                            <div className="w-3/4 h-6 bg-slate-100 rounded mb-4"></div>
                            <div className="w-full h-10 bg-slate-100 rounded-2xl"></div>
                        </div>
                    ))
                ) : events.length > 0 ? (
                    events.map((ev: any, idx: number) => (
                        <div key={ev.id || idx} className="bg-white rounded-[40px] overflow-hidden shadow-xl border border-slate-100 hover:shadow-2xl transition-all active:scale-[0.98] group">
                            {/* Photo-First Header */}
                            <div className="relative h-56 bg-slate-200 overflow-hidden">
                                <img 
                                    src={ev.imageUrl || `https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=600&h=400&auto=format&fit=crop`} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    alt={ev.title}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="flex gap-2 mb-2">
                                        <span className="bg-teal-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">{ev.price || "Gratis"}</span>
                                        {ev.vibe && <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full border border-white/30">{ev.vibe}</span>}
                                    </div>
                                    <h3 className="text-2xl font-black text-white leading-tight drop-shadow-lg">{ev.title}</h3>
                                </div>
                            </div>

                            <div className="p-8">
                                <p className="text-slate-600 text-sm mb-6 leading-relaxed font-medium">{ev.summary}</p>
                                
                                {/* AI "Know Before You Go" Section */}
                                {ev.expertTip && (
                                    <div className="bg-teal-50/50 rounded-3xl p-5 mb-6 border border-teal-100/50 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-teal-200/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                                        <h4 className="text-[10px] font-black text-teal-700 uppercase tracking-widest mb-2 flex items-center gap-1.5 relative z-10">
                                            <span className="text-sm">💡</span> AI Insight
                                        </h4>
                                        <p className="text-sm text-teal-900 font-semibold leading-snug relative z-10">{ev.expertTip}</p>
                                    </div>
                                )}

                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Ubicación</span>
                                        <span className="text-sm font-bold text-slate-800 truncate max-w-[160px]">📍 {ev.location}</span>
                                    </div>
                                    <button 
                                        onClick={() => playSound('success')}
                                        className="bg-slate-900 hover:bg-teal-600 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-xl active:scale-90 text-sm flex items-center gap-2 group/btn"
                                    >
                                        Ir ahora <span className="group-hover:translate-x-1 transition-transform">🚀</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20">
                        <div className="text-4xl mb-4">🏜️</div>
                        <p className="text-slate-500 font-bold">No hemos encontrado planes específicos para hoy cerca de ti. ¡Prueba a cambiar tu ubicación!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

"use client";
import { useState, useEffect } from "react";
import { DataService } from "../../services/data_service";

export default function TribuPage() {
    const [rankings, setRankings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadRankings() {
            const data = await DataService.getRankings();
            setRankings(data);
            setLoading(false);
        }
        loadRankings();
    }, []);

    return (
        <div className="p-8 pb-32 h-full overflow-y-auto bg-slate-50">
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">LA TRIBU</h1>
                <p className="text-slate-500 mt-1">Comparte y descubre con otras familias</p>
            </header>
            
            <div className="bg-white rounded-[32px] p-6 shadow-medium mb-6 border border-blue-50">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex justify-between items-center">
                    <span>🏆 Top Exploradores</span>
                    <span className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full font-bold">Esta Semana</span>
                </h3>
                
                <div className="space-y-4">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl animate-pulse">
                                <div className="w-6 h-6 bg-slate-200 rounded"></div>
                                <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                                <div className="flex-1 h-4 bg-slate-200 rounded"></div>
                                <div className="w-12 h-6 bg-slate-200 rounded-full"></div>
                            </div>
                        ))
                    ) : rankings.length > 0 ? (
                        rankings.map((u, idx) => (
                            <div key={u.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                                <span className={`font-black text-lg w-6 ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-amber-600' : 'text-slate-300'}`}>#{idx + 1}</span>
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-xl">
                                    {u.avatar || (idx % 2 === 0 ? "🏃" : "🏕️")}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-700">{u.nickname || "Explorador"}</h4>
                                </div>
                                <span className="font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full text-xs">⭐ {u.points}</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-400 text-center py-4 text-sm font-medium">Buscando exploradores...</p>
                    )}
                </div>
            </div>

            <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 active:scale-95 transition-transform">
                💬 Abrir Chat de la Tribu
            </button>
        </div>
    );
}

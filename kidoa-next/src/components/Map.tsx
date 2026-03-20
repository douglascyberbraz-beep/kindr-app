"use client";

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useAppContext } from '../context/AppContext';
import { DataService } from '../services/data_service';
import { KidoaAI } from '../services/ai_service';

export default function KidoaMap({ lastKnownCoords }: { lastKnownCoords: string }) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const markersRef = useRef<{ instance: maplibregl.Marker, type: string, data: any }[]>([]);
    const userMarkerRef = useRef<maplibregl.Marker | null>(null);
    
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [activeFilter, setActiveFilter] = useState("all");
    
    const { playSound, user } = useAppContext();

    useEffect(() => {
        if (map.current || !mapContainer.current) return;

        const [lat, lng] = lastKnownCoords.split(',').map(Number);

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: 'https://tiles.openfreemap.org/styles/dark', // Night Mode
            center: [lng || -4.7286, lat || 41.6520],
            zoom: 17,
            pitch: 60, // 3D Navigation Mode
            bearing: -5 // Slight rotation for perspective
        });

        map.current.on('load', () => {
             if (!map.current) return;
             
             // Google Maps 2024 Style: Teal Water & Gray Roads
             try {
                map.current.setPaintProperty('water', 'fill-color', '#004d4d'); // Dark Teal
                map.current.setPaintProperty('road_network', 'line-color', '#D1D5DB'); // Gray Roads
                map.current.setPaintProperty('landuse-park', 'fill-color', '#064e3b'); // Dark Green Parks
                
                // 3D Buildings - Semi-transparent and ALWAYS ON (Navigation Style)
                if (map.current.getLayer('building')) {
                    map.current.setPaintProperty('building', 'fill-color', '#334155');
                    map.current.setPaintProperty('building', 'fill-opacity', 0.6);
                    map.current.setPaintProperty('building', 'fill-outline-color', '#475569');
                }
             } catch(e) { console.warn("Style override error:", e); }

             loadMarkers();
             updateUserIcon(lat, lng);
        });

        // Double Click to ADD REVIEW
        map.current.doubleClickZoom.disable();
        map.current.on('dblclick', (e) => {
             playSound('boop');
             // Dispatch a custom event or show a state-based modal for adding a review
             const confirmAdd = confirm(`¿Quieres añadir una reseña en esta ubicación?\nCoordenadas: ${e.lngLat.lat.toFixed(4)}, ${e.lngLat.lng.toFixed(4)}`);
             if (confirmAdd) {
                 // In a real app, this would set a state to show a "New Place" form
                 console.log("Opening Add Site Modal for:", e.lngLat);
             }
        });

        return () => {
            map.current?.remove();
        };
    }, []);

    // Watch for GPS changes to update user orb
    useEffect(() => {
        if (!map.current || !lastKnownCoords) return;
        const [lat, lng] = lastKnownCoords.split(',').map(Number);
        updateUserIcon(lat, lng);
    }, [lastKnownCoords]);

    const loadMarkers = async () => {
        try {
            const locations = await DataService.getLocations(lastKnownCoords);
            clearMarkers();
            locations.forEach(loc => createMarker(loc));
        } catch(e) { console.error("Error loading markers:", e); }
    };

    const clearMarkers = () => {
        markersRef.current.forEach(m => m.instance.remove());
        markersRef.current = [];
    };

    const createMarker = (loc: any) => {
        if (!map.current) return;
        const isHighRated = loc.rating >= 4.5;
        const el = document.createElement('div');
        // Fallback CSS classes if global css doesn't have them
        el.style.cssText = `
            width: 30px; height: 30px; border-radius: 50%;
            background: ${isHighRated ? 'linear-gradient(135deg, #FF6B6B, #FF8E8B)' : 'linear-gradient(135deg, #002C77, #4CC9F0)'};
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid white;
        `;
        el.innerHTML = `<img src="/assets/logo.png" style="width: 20px; height: 20px; object-fit: contain; filter: brightness(100) grayscale(1);">`;

        const popupHTML = `
            <div style="min-width: 220px; overflow: hidden; font-family: 'Segoe UI', Roboto, sans-serif; border-radius: 20px; background: #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                <div style="height: 100px; background: ${isHighRated ? '#f43f5e' : '#0f172a'}; overflow: hidden; position: relative;">
                    ${loc.image ? `<img src="${loc.image}" style="width: 100%; height: 100%; object-fit: cover;">` : '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:white;font-size:2rem;">🌟</div>'}
                    ${loc.vibe ? `<div style="position:absolute;top:10px;right:10px;background:rgba(255,255,255,0.9);color:#0f172a;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:900;box-shadow:0 2px 5px rgba(0,0,0,0.2);">✨ ${loc.vibe}</div>` : ''}
                </div>
                <div style="padding: 16px;">
                    <h3 style="margin: 0 0 4px 0; font-size: 1.1rem; font-weight: 900; color: #0f172a;">${loc.name}</h3>
                    <div style="font-size: 0.75rem; color: #64748b; font-weight: 600; margin-bottom: 12px; display:flex; gap:8px;">
                        <span>⭐ ${loc.rating || 4.5}</span>
                        <span>•</span>
                        <span style="color:#0d9488;">${loc.type}</span>
                    </div>
                    ${loc.expertTip ? `
                        <div style="background:#f0fdfa; border:1px solid #ccfbf1; padding:10px; border-radius:12px; margin-top:8px;">
                            <div style="font-size:10px; font-weight:900; color:#0d9488; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px;">💡 AI Tip</div>
                            <div style="font-size:11px; color:#134e4a; font-weight:600; line-height:1.4;">${loc.expertTip}</div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        const popup = new maplibregl.Popup({ offset: 20 }).setHTML(popupHTML);

        const marker = new maplibregl.Marker({ element: el })
            .setLngLat([loc.lng, loc.lat])
            .setPopup(popup)
            .addTo(map.current);

        markersRef.current.push({ instance: marker, type: loc.type, data: loc });
    };

    const filterMarkers = (type: string) => {
        playSound('boop');
        setActiveFilter(type);
        if (!map.current) return;
        markersRef.current.forEach(m => {
            if (type === 'all' || m.type === type) m.instance.addTo(map.current!);
            else m.instance.remove();
        });
    };

    const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            setIsSearching(true);
            try {
                const prompt = `Busca las coordenadas (lat, lng) para el lugar: "${searchQuery}". 
                Si es una búsqueda general (ej: "parques"), elige el punto más céntrico o relevante en Valladolid, España (o detecta la ciudad). 
                Responde SOLO un JSON: {"lat": número, "lng": número, "name": "nombre real"}`;
                
                const res = await KidoaAI.callGemini(prompt, true);
                if (res && res.lat && res.lng) {
                    playSound('success');
                    map.current?.flyTo({ 
                        center: [res.lng, res.lat], 
                        zoom: 17,
                        essential: true,
                        speed: 1.5
                    });
                } else {
                    playSound('click');
                }
            } catch(e) {
                console.error("Search error:", e);
                playSound('click');
            } finally {
                setIsSearching(false);
                setSearchQuery("");
            }
        }
    };

    const updateUserIcon = (lat: number, lng: number) => {
        if (!map.current) return;
        if (!userMarkerRef.current) {
            const el = document.createElement('div');
            el.innerHTML = `
                <div style="width: 50px; height: 50px; background: radial-gradient(circle, rgba(76, 201, 240, 0.4) 0%, transparent 70%); display: flex; justify-content: center; align-items: center; border-radius: 50%;">
                    <div style="width: 24px; height: 24px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(76, 201, 240, 0.8); border: 2px solid #002C77;">
                        <span style="font-size: 12px;">✨</span>
                    </div>
                </div>
            `;
            userMarkerRef.current = new maplibregl.Marker({ element: el })
                .setLngLat([lng, lat])
                .addTo(map.current);
        } else {
            userMarkerRef.current.setLngLat([lng, lat]);
        }
    };

    const handleLocateMe = () => {
        playSound('boop');
        const [lat, lng] = lastKnownCoords.split(',').map(Number);
        if (map.current && lat && lng) {
            map.current.flyTo({ center: [lng, lat], zoom: 18, pitch: 0 });
        }
    };

    return (
        <div className="relative w-full h-[100dvh] overflow-hidden bg-slate-100">
            <div ref={mapContainer} className="absolute inset-0 z-0" />
            
            {/* Overlay UI */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[92%] max-w-[500px] z-10 flex flex-col gap-3 pointer-events-none">
                <div className="flex items-center bg-white/95 backdrop-blur-2xl rounded-3xl px-6 py-4 shadow-2xl border border-white/50 pointer-events-auto transition-all focus-within:ring-2 focus-within:ring-teal-500/50 focus-within:scale-[1.02]">
                    <span className="mr-3 text-lg">{isSearching ? "✨" : "🔍"}</span>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        placeholder={isSearching ? "IA Pensando..." : "Explora con Gemini..."}
                        disabled={isSearching}
                        className="bg-transparent border-none outline-none flex-1 text-sm text-slate-900 font-bold placeholder-slate-400"
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide pointer-events-auto px-1 no-scrollbar drop-shadow-sm">
                    {[
                        { id: 'all', label: 'Todos', icon: '🌍' },
                        { id: 'park', label: 'Parques', icon: '🌳' },
                        { id: 'school', label: 'Escuelas', icon: '🎓' },
                        { id: 'kidzone', label: 'Ludotecas', icon: '🏰' },
                        { id: 'food', label: 'Comida', icon: '🍏' },
                    ].map(f => (
                        <button 
                            key={f.id}
                            onClick={() => filterMarkers(f.id)}
                            className={`whitespace-nowrap px-5 py-2.5 rounded-2xl text-xs font-black transition-all shadow-sm border ${activeFilter === f.id ? 'bg-teal-600 text-white border-teal-500 shadow-teal-500/30' : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'}`}
                        >
                            {f.icon} {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <button 
                onClick={handleLocateMe}
                className="absolute bottom-36 right-6 w-16 h-16 bg-white rounded-[24px] flex items-center justify-center shadow-[0_15px_30px_rgba(0,0,0,0.2)] border border-white active:scale-95 transition-all z-10 text-2xl"
            >
                <span className="drop-shadow-sm">🎯</span>
            </button>
        </div>
    );
}

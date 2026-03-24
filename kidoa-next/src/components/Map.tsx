"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useAppContext } from '../context/AppContext';
import { DataService } from '../services/data_service';
import { KidoaAI } from '../services/ai_service';
import ReviewModal from './ReviewModal';
import AuthModal from './AuthModal';

export default function KidoaMap({ 
    lastKnownCoords, 
    targetCoords,
    targetDetails
}: { 
    lastKnownCoords: string,
    targetCoords?: string | null,
    targetDetails?: any
}) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<maplibregl.Map | null>(null);
    const markersRef = useRef<{ instance: maplibregl.Marker, type: string, data: any }[]>([]);
    const userMarkerRef = useRef<maplibregl.Marker | null>(null);
    
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [activeFilter, setActiveFilter] = useState("all");
    
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);

    const { user, playSound } = useAppContext();

    const loadMarkers = useCallback(async () => {
        if (!map.current) return;
        try {
            const locations = await DataService.getLocations(lastKnownCoords);
            clearMarkers();
            locations.forEach((loc: any) => createMarker(loc));
        } catch(e) { console.error("Error loading markers:", e); }
    }, [lastKnownCoords]);

    const clearMarkers = () => {
        markersRef.current.forEach(m => m.instance.remove());
        markersRef.current = [];
    };

    const createMarker = (loc: any) => {
        if (!map.current) return;
        
        const isHighRated = loc.rating >= 4.5;
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.cssText = `
            width: 30px; height: 30px; border-radius: 50%;
            background: ${isHighRated ? 'linear-gradient(135deg, #FF6B6B, #FF8E8B)' : 'linear-gradient(135deg, #002C77, #4CC9F0)'};
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid white;
            cursor: pointer;
        `;
        el.innerHTML = `<img src="/assets/logo.png" style="width: 20px; height: 20px; object-fit: contain; filter: brightness(100) grayscale(1);">`;

        const popupContent = `
            <div style="min-width: 220px; overflow: hidden; font-family: sans-serif; border-radius: 20px; background: #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                <div style="height: 100px; background: ${isHighRated ? '#f43f5e' : '#0f172a'}; overflow: hidden; position: relative;">
                    ${loc.image || loc.imageUrl ? `<img src="${loc.image || loc.imageUrl}" style="width: 100%; height: 100%; object-fit: cover;">` : '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:white;font-size:2rem;">🌟</div>'}
                    ${loc.vibe ? `<div style="position:absolute;top:10px;right:10px;background:rgba(255,255,255,0.9);color:#0f172a;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:900;box-shadow:0 2px 5px rgba(0,0,0,0.2);">✨ ${loc.vibe}</div>` : ''}
                </div>
                <div style="padding: 16px;">
                    <h3 style="margin: 0 0 4px 0; font-size: 1.1rem; font-weight: 900; color: #0f172a;">${loc.name || loc.title}</h3>
                    <div style="font-size: 0.75rem; color: #64748b; font-weight: 600; margin-bottom: 12px; display:flex; gap:8px;">
                        <span>⭐ ${loc.rating || 4.5}</span>
                        <span>•</span>
                        <span style="color:#0d9488;">${loc.type || 'Punto de Interés'}</span>
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

        const popup = new maplibregl.Popup({ offset: 25, closeButton: false }).setHTML(popupContent);

        const marker = new maplibregl.Marker({ element: el })
            .setLngLat([loc.lng, loc.lat])
            .setPopup(popup)
            .addTo(map.current);

        el.addEventListener('click', () => {
            playSound('boop');
        });

        markersRef.current.push({ instance: marker, type: loc.type || 'all', data: loc });
    };

    const updateUserIcon = useCallback((lat: number, lng: number) => {
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
    }, [playSound]);

    useEffect(() => {
        if (!mapContainer.current || map.current) return;

        const [lat, lng] = lastKnownCoords.split(',').map(Number);

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: 'https://tiles.openfreemap.org/styles/dark', // High quality free dark style
            center: [lng || -4.7286, lat || 41.6520],
            zoom: 16,
            pitch: 60, // 3D Tilt for Navigation mode
            bearing: -5,
        });

        map.current.on('load', () => {
            if (!map.current) return;
            
            // Add 3D buildings layer
            const layers = map.current.getStyle().layers;
            if (layers) {
                let labelLayerId;
                for (let i = 0; i < layers.length; i++) {
                    if (layers[i].type === 'symbol' && (layers[i].layout as any)['text-field']) {
                        labelLayerId = layers[i].id;
                        break;
                    }
                }

                map.current.addLayer(
                    {
                        'id': '3d-buildings',
                        'source': 'openfreemap',
                        'source-layer': 'building',
                        'filter': ['==', 'extrude', 'true'],
                        'type': 'fill-extrusion',
                        'minzoom': 15,
                        'paint': {
                            'fill-extrusion-color': '#2a3a5a',
                            'fill-extrusion-height': [
                                'interpolate',
                                ['linear'],
                                ['zoom'],
                                15,
                                0,
                                15.05,
                                ['get', 'height']
                            ],
                            'fill-extrusion-base': [
                                'interpolate',
                                ['linear'],
                                ['zoom'],
                                15,
                                0,
                                15.05,
                                ['get', 'min_height']
                            ],
                            'fill-extrusion-opacity': 0.8
                        }
                    },
                    labelLayerId
                );
            }

            loadMarkers();
            updateUserIcon(lat, lng);
        });

        // Double Click to ADD REVIEW
        map.current.on('dblclick', (e) => {
            playSound('boop');
            setSelectedCoords({ lat: e.lngLat.lat, lng: e.lngLat.lng });
            
            if (!user) {
                setShowAuthModal(true);
            } else {
                setShowReviewModal(true);
            }
        });

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, []);

    // Watch for GPS changes
    useEffect(() => {
        if (!map.current || !lastKnownCoords) return;
        const [lat, lng] = lastKnownCoords.split(',').map(Number);
        updateUserIcon(lat, lng);
    }, [lastKnownCoords, updateUserIcon]);

    // Handle incoming target coords
    useEffect(() => {
        if (!map.current || !targetCoords) return;
        const [lat, lng] = targetCoords.split(',').map(Number);
        
        map.current.flyTo({
            center: [lng, lat],
            zoom: 18,
            pitch: 45,
            essential: true
        });

        if (targetDetails) {
            const popupContent = `
                <div style="min-width: 220px; overflow: hidden; font-family: sans-serif; border-radius: 20px; background: #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                    <div style="height: 100px; background: #0f172a; overflow: hidden;">
                        <img src="${targetDetails.imageUrl || 'https://images.unsplash.com/photo-1518173946687-a4c8a9833d8e?q=80&w=600&h=400&fit=crop'}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div style="padding: 16px;">
                        <h3 style="margin: 0 0 4px 0; font-size: 1.1rem; font-weight: 900; color: #0f172a;">${targetDetails.title}</h3>
                        <div style="font-size: 0.75rem; color: #64748b; font-weight: 600; margin-bottom: 12px;">${targetDetails.summary}</div>
                        <div style="background:#f0fdfa; border:1px solid #ccfbf1; padding:10px; border-radius:12px;">
                            <div style="font-size:10px; font-weight:900; color:#0d9488; text-transform:uppercase;">💡 AI Tip</div>
                            <div style="font-size:11px; color:#134e4a; font-weight:600;">${targetDetails.expertTip}</div>
                        </div>
                    </div>
                </div>
            `;
            new maplibregl.Popup({ offset: 25, closeButton: false })
                .setLngLat([lng, lat])
                .setHTML(popupContent)
                .addTo(map.current);
        }
    }, [targetCoords, targetDetails]);

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
                        essential: true
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

    const filterMarkers = (type: string) => {
        playSound('boop');
        setActiveFilter(type);
        markersRef.current.forEach(m => {
            const el = m.instance.getElement();
            if (type === 'all' || m.type === type) {
                el.style.display = 'flex';
            } else {
                el.style.display = 'none';
            }
        });
    };

    const handleLocateMe = () => {
        playSound('boop');
        const [lat, lng] = lastKnownCoords.split(',').map(Number);
        if (map.current && lat && lng) {
            map.current.flyTo({
                center: [lng, lat],
                zoom: 18,
                pitch: 0,
                bearing: 0,
                essential: true
            });
        }
    };

    const handleReviewSubmit = async (data: { title: string; rating: number; comment: string }) => {
        if (!selectedCoords || !user) return;
        
        try {
            playSound('success');
            await DataService.addReview(
                user.uid, 
                data.title, 
                data.rating, 
                data.comment, 
                selectedCoords.lat, 
                selectedCoords.lng
            );
            setShowReviewModal(false);
            loadMarkers();
        } catch (e) {
            console.error("Error adding review:", e);
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

            {showReviewModal && selectedCoords && (
                <ReviewModal 
                    isOpen={showReviewModal}
                    coords={selectedCoords}
                    onClose={() => setShowReviewModal(false)}
                    onSubmit={handleReviewSubmit}
                />
            )}

            {showAuthModal && (
                <AuthModal onClose={() => setShowAuthModal(false)} />
            )}
        </div>
    );
}

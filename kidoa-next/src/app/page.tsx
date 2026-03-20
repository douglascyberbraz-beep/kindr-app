"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "../components/BottomNav";
import SplashScreen from "../components/SplashScreen";
import AuthModal from "../components/AuthModal";
import { useAppContext } from "../context/AppContext";
import { LocationService } from "../services/location_service";
import MapPage from "../components/Map";

import TodayPage from "./../components/pages/TodayPage";
import ProfilePage from "./../components/pages/ProfilePage";
import TribuPage from "./../components/pages/TribuPage";
import SafePage from "./../components/pages/SafePage";

export default function AppMain() {
    const [currentPage, setCurrentPage] = useState("map");
    const [showSplash, setShowSplash] = useState(true);
    const [coords, setCoords] = useState("41.6520, -4.7286");
    const { user, loading } = useAppContext();

    useEffect(() => {
        const watchId = LocationService.watchPosition((newCoords) => {
            setCoords(newCoords);
        });
        return () => {};
    }, []);

    const pageVariants = {
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.02 }
    };

    if (loading) return null;

    return (
        <main className="relative h-[100dvh] w-full max-w-[600px] mx-auto bg-white overflow-hidden shadow-2xl">
            <AnimatePresence>
                {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
            </AnimatePresence>
            
            <AnimatePresence>
                {!user && !showSplash && <AuthModal />}
            </AnimatePresence>

            <div className={`h-full w-full pb-[110px] transition-all duration-700 ${showSplash ? 'blur-lg scale-95' : 'blur-0 scale-100'}`}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPage}
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.4, ease: "circOut" }}
                        className="h-full w-full"
                    >
                        {currentPage === "map" && <MapPage lastKnownCoords={coords} />}
                        {currentPage === "today" && <TodayPage lastKnownCoords={coords} />}
                        {currentPage === "tribu" && <TribuPage />}
                        {currentPage === "safe" && <SafePage />}
                        {currentPage === "profile" && <ProfilePage />}
                    </motion.div>
                </AnimatePresence>
            </div>

            <BottomNav activePage={currentPage} onNavigate={setCurrentPage} />
        </main>
    );
}



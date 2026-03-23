"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../context/SessionContext';
import '../style/WaitingRoom.css';
import Link from 'next/link';

export default function WaittingArea() {
    const router = useRouter();
    const [timer, setTimer] = useState(30);

    const storyline = [
        "LEVEL 1 SECURITY BREACH: ACCESS DENIED.",
        "The OBLIVION PROTOCOL has detected multiple failed authorization attempts.",
        "Your terminal signature has been temporarily blacklisted.",
        "SYSTEM LOCKDOWN IN PROGRESS...",
        "Wait for the security cooldown to expire before re-initializing connection."
    ];

    const { logout } = useSession();

    useEffect(() => {
        // Hijack history to trap user
        window.history.pushState(null, null, window.location.pathname);
        const preventBack = () => {
            window.history.pushState(null, null, window.location.pathname);
        };
        window.addEventListener('popstate', preventBack);

        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => {
            clearInterval(interval);
            window.removeEventListener('popstate', preventBack);
        };
    }, []);

    useEffect(() => {
        if (timer === 0) {
            logout(); // Clear session to allow access to Welcome Screen
            router.replace('/');
        }
    }, [timer, router, logout]);

    return (
        <div className="waiting-wrapper">
            <div className="noise"></div>
            <div className="scanlines"></div>

            <div className="waiting-content">
                <div className="critical-header">CRITICAL COOLDOWN</div>

                <div className="storyline-scroll">
                    {storyline.map((text, i) => (
                        <div key={i} className="story-line" style={{ animationDelay: `${i * 0.5}s` }}>
                            {text}
                        </div>
                    ))}
                </div>

                <div className="countdown-container">
                    <div className="countdown-label">RESTRICTED ACCESS DURATION</div>
                    <div className="countdown-timer">{timer}s</div>
                </div>

                <div className="waiting-footer">
                    PROCEEDING WITHOUT AUTHORIZATION IS FUTILE.
                </div>

                <button
                    className="waiting-button"
                    onClick={() => {
                        logout();
                        router.replace('/');
                    }}
                    style={{ textDecoration: "none", padding: "10px", marginTop: "50px", cursor: "pointer" }}
                >
                    RETURN TO TERMINAL
                </button>
            </div>
        </div>
    );
}

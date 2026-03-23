"use client";

import React from 'react';
import '../style/WelcomeScreen.css';
import Link from 'next/link';
import { useSession } from '../context/SessionContext';

const WelcomeScreen = () => {
    const { isAuthenticated, currentLevel, storylineComplete } = useSession();

    // Determine where the "Start" button should take the user
    const getStartTarget = () => {
        if (!isAuthenticated) return "/login";
        return storylineComplete ? `/level${currentLevel}` : "/storyline";
    };

    return (
        <div className="welcome-container">
            <div className="vignette"></div>
            <div className="grid-background"></div>

            <div className="welcome-content">
                <div className="title-wrapper">
                    <h1 className="game-title" data-text="NEURAL_ESCAPE">NEURAL_ESCAPE</h1>
                    <div className="subtitle">CYBER-DYSTOPIAN LOGIC BYPASS</div>
                </div>

                <div className="welcome-info">
                    <div className="info-box">
                        <div className="info-header">STATUS: {isAuthenticated ? "ENCRYPTED_SESSION_ACTIVE" : "SYSTEM_LOCKED"}</div>
                        <p>
                            {isAuthenticated
                                ? `WELCOME BACK, OPERATIVE. RESUME ENCRYPTION BYPASS AT SECTOR ${currentLevel}.`
                                : "CRITICAL OVERRIDE REQUIRED. ACCESS SECTOR 7G TO RETRIEVE THE CORE KEY. MINIMAL LATENCY RECOMMENDED."
                            }
                        </p>
                    </div>
                </div>

                <Link href={getStartTarget()} className="start-button">
                    <span className="button-glitch"></span>
                    <span className="button-text">
                        {isAuthenticated ? "RESUME CONNECTION" : "INITIALIZE CONNECTION"}
                    </span>
                </Link>

                <div className="footer-meta">
                    <div className="meta-line">NODE_ID: AF-99-01</div>
                    <div className="meta-line">ENCRYPTION: {isAuthenticated ? "SESSION_PINNED" : "AES-256-GHOST"}</div>
                </div>
            </div>

            <div className="decorative-elements">
                <div className="corner-decor top-left"></div>
                <div className="corner-decor top-right"></div>
                <div className="corner-decor bottom-left"></div>
                <div className="corner-decor bottom-right"></div>
            </div>
        </div>
    );
};

export default WelcomeScreen;

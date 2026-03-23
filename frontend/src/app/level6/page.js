"use client";

import React from 'react';
import { useSession } from '../../context/SessionContext';
import '../../style/Level2Storyline.css';

export default function Level6Page() {
    // This is the final victory state. No complex logic needed.
    // Just the cinematic loop.

    return (
        <div className="gameplay-wrapper level5-victory-mode">
            <div className="gameplay-overlay"></div>
            <div className="video-background-container">
                <video autoPlay className="video-background" style={{ opacity: 0.8, filter: 'brightness(0.8)' }}>
                    <source src="https://res.cloudinary.com/dgyrj3shq/video/upload/f_auto,q_auto/v1774265682/seen8_b9wnm0.mp4" type="video/mp4" />
                </video>
                <div className="video-overlay-gradient"></div>
            </div>

            <div className="victory-content">
                <h1 className="victory-title">PROTOCOL COMPLETE — OBLIVION TERMINATED</h1>
                <p className="victory-subtext">Campus systems restored. You survived the core.</p>
            </div>
        </div>
    );
}

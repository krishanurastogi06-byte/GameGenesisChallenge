"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../../context/SessionContext';
import '../../style/Level2.css';

const VOICE_LINES = [
    "System instability detected.",
    "Resources insufficient to stabilize both sectors.",
    "Choose your path.",
    "Your logic will define the outcome."
];

export default function Level2Page() {
    const router = useRouter();
    const { choosePath, completeLevel } = useSession();
    const [voiceIndex, setVoiceIndex] = useState(-1);
    const [selection, setSelection] = useState(null);
    const [isLocked, setIsLocked] = useState(false);
    const [showPathLocked, setShowPathLocked] = useState(false);

    // OBLIVION Voice Sequence
    useEffect(() => {
        if (voiceIndex < VOICE_LINES.length - 1) {
            const timer = setTimeout(() => {
                setVoiceIndex(prev => prev + 1);
            }, voiceIndex === -1 ? 1500 : 3500);
            return () => clearTimeout(timer);
        }
    }, [voiceIndex]);

    const handleSelect = (path) => {
        if (isLocked) return;
        setSelection(path);
        setIsLocked(true);

        // Selection sequence
        setTimeout(() => {
            setShowPathLocked(true);
            choosePath(path);

            // Advance to next phase (Slug-based Storyline)
            setTimeout(() => {
                router.replace(`/level2/storyline/${path}`);
            }, 2000);
        }, 1000);
    };

    return (
        <div className={`level2-wrapper ${selection ? 'has-selection' : ''}`}>
            {/* OBLIVION Voice Over Layer */}
            <div className="voice-over-overlay">
                {voiceIndex >= 0 && (
                    <div className="oblivion-voice">
                        {VOICE_LINES[voiceIndex]}
                    </div>
                )}
            </div>

            {/* Path Selection Content */}
            {showPathLocked && <div className="path-locked-msg">PATH LOCKED.</div>}

            {/* Left Side - CYBER PATH */}
            <div
                className={`split-section cyber-section ${selection === 'cyber' ? 'selected' : ''}`}
                onClick={() => handleSelect('cyber')}
                style={{ "--theme-color": "#FF8F00", "--theme-shadow": "rgba(255, 143, 0, 0.5)" }}
            >
                <div className="visual-container">
                    <div className="data-stream" style={{ left: '20%' }}></div>
                    <div className="data-stream" style={{ left: '50%', animationDelay: '-1s' }}></div>
                    <div className="data-stream" style={{ left: '80%', animationDelay: '-2s' }}></div>
                    <div className="decor-line decor-h" style={{ top: '30%' }}></div>
                    <div className="decor-line decor-h" style={{ top: '70%' }}></div>
                </div>

                <div className="path-content">
                    <h2 className="path-title">CYBER PATH</h2>
                    <p className="path-subtitle">SECURITY FIREWALL ACTIVE</p>
                    <div className="path-status">NETWORK BREACH DETECTED</div>
                    <p style={{ marginTop: '10px', fontSize: '0.7rem', color: '#FF8F00', opacity: 0.6 }}>IMMEDIATE RESPONSE REQUIRED</p>
                </div>
            </div>

            {/* Right Side - DEV PATH */}
            <div
                className={`split-section dev-section ${selection === 'dev' ? 'selected' : ''}`}
                onClick={() => handleSelect('dev')}
                style={{ "--theme-color": "#00F3FF", "--theme-shadow": "rgba(0, 243, 255, 0.5)" }}
            >
                <div className="visual-container">
                    <div className="data-stream" style={{ left: '20%', animationDelay: '-0.5s' }}></div>
                    <div className="data-stream" style={{ left: '50%', animationDelay: '-1.5s' }}></div>
                    <div className="data-stream" style={{ left: '80%', animationDelay: '-2.5s' }}></div>
                    <div className="decor-line decor-v" style={{ left: '30%' }}></div>
                    <div className="decor-line decor-v" style={{ left: '70%' }}></div>
                </div>

                <div className="path-content">
                    <h2 className="path-title">DEV PATH</h2>
                    <p className="path-subtitle">CORE DATABASE UNSTABLE</p>
                    <div className="path-status">DATA RELATIONS COLLAPSING</div>
                    <p style={{ marginTop: '10px', fontSize: '0.7rem', color: '#00F3FF', opacity: 0.6 }}>STRUCTURAL LOGIC REQUIRED</p>
                </div>
            </div>
        </div>
    );
}

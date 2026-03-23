"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../../context/SessionContext';
import '../../style/Storyline.css';
import Link from 'next/link';

const DIALOGUE_PHASES = {
    OFFICER_PRIMARY: [
        "Sab dhyaan se suno. Hum system ke andar hain. Aur yeh koi practice simulation nahi hai.",
        "Yeh Arena hai. Aur har level ke baad system aur aggressive hoga.",
        "Tum chaar log alag skills ho… Par agar synchronize nahi hue — toh yeh system tumhe crush kar dega.",
        "Introduce yourselves. Clear. Short. Sharp.",
    ],
    LEADER_RESPONSE: [
        "Patterns dekhne me expert. Logic fail hua toh system fail hoga."
    ],
    MEMBER_INTROS: [
        "Interface meri language hai. Agar kuch broken hai… mujhe dikhega.",
        "Encryption ho, firewall ho… system ka har weakness mil jayega.",
        "Execution speed. Aap bolo, main build kar doon.",
    ],
    FINAL_LINES: [
        "Good. Skills impressive hain. Par yeh individual showcase nahi hai.",
        "Level 1 sirf warm-up nahi hai. Yeh test hai — trust ka.",
        "Ek galti… aur leaderboard pe peeche.",
    ]
};

export default function StorylinePage() {
    const router = useRouter();
    const { finishStoryline } = useSession();
    const [squad, setSquad] = useState(null);
    const [sceneStep, setSceneStep] = useState(0);
    const [textIndex, setTextIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [speaker, setSpeaker] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);
    const [showClickPrompt, setShowClickPrompt] = useState(false);

    // Initial load
    useEffect(() => {
        const data = localStorage.getItem('squadData');
        if (data) {
            setSquad(JSON.parse(data));
        }

        // Start sequence
        setTimeout(() => setIsLoaded(true), 500);
        setTimeout(() => setSceneStep(1), 2500); // Officer enters
        setTimeout(() => setSceneStep(2), 4500); // Team enters
        setTimeout(() => setSceneStep(3), 6000); // Dialogue Phase 1 starts
    }, []);

    const typeText = useCallback((text) => {
        setIsTyping(true);
        setDisplayText('');
        let i = 0;
        const interval = setInterval(() => {
            // Using slice ensures we always get the full string up to the current index
            // This prevents the 'missing first letter' race condition
            setDisplayText(text.slice(0, i + 1));
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                setIsTyping(false);
                // Prompt continues on all steps for clarity
                setShowClickPrompt(true);
            }
        }, 30);
        return () => clearInterval(interval);
    }, [sceneStep]);

    // Handle steps
    useEffect(() => {
        if (sceneStep === 3) {
            setSpeaker('System Command Officer');
            typeText(DIALOGUE_PHASES.OFFICER_PRIMARY[textIndex]);
        } else if (sceneStep === 4) {
            setSpeaker(squad?.leaderName || 'Team Leader');
            typeText(DIALOGUE_PHASES.LEADER_RESPONSE[textIndex]);
        } else if (sceneStep === 5) {
            setSpeaker(squad?.member1 || 'Cyber Specialist');
            typeText(DIALOGUE_PHASES.MEMBER_INTROS[0]);
        } else if (sceneStep === 6) {
            setSpeaker(squad?.member2 || 'Systems Analyst');
            typeText(DIALOGUE_PHASES.MEMBER_INTROS[1]);
        } else if (sceneStep === 7) {
            setSpeaker(squad?.member3 || 'Field Operative');
            typeText(DIALOGUE_PHASES.MEMBER_INTROS[2]);
        } else if (sceneStep === 8) {
            setSpeaker(squad?.leaderName || 'Team Leader');
            typeText(DIALOGUE_PHASES.FINAL_LINES[textIndex]);
        } else if (sceneStep === 9) {
            // Fade to black and redirect
            setTimeout(() => {
                finishStoryline(); // Mark as viewed so RouteGuard sends us to /level1 from now on
                router.replace('/level1'); // Or next scene
            }, 2000);
        }
    }, [sceneStep, textIndex, squad, typeText, router, finishStoryline]);

    const handleNext = () => {
        if (isTyping) return;

        if (sceneStep === 3) {
            if (textIndex < DIALOGUE_PHASES.OFFICER_PRIMARY.length - 1) {
                setTextIndex(prev => prev + 1);
            } else {
                // Officer done, wait for click to switch to Leader
                setSceneStep(4);
                setTextIndex(0);
                setShowClickPrompt(false);
            }
        } else if (sceneStep === 4) {
            if (textIndex < DIALOGUE_PHASES.LEADER_RESPONSE.length - 1) {
                setTextIndex(prev => prev + 1);
            } else {
                setSceneStep(5); // Start intros
                setTextIndex(0);
            }
        } else if (sceneStep >= 5 && sceneStep <= 7) {
            setSceneStep(prev => prev + 1);
        } else if (sceneStep === 8) {
            if (textIndex < DIALOGUE_PHASES.FINAL_LINES.length - 1) {
                setTextIndex(prev => prev + 1);
            } else {
                setSceneStep(9);
            }
        }
    };

    if (!squad) return <div className="story-wrapper"></div>;

    return (
        <div className="story-wrapper" onClick={handleNext}>
            {/* Background Layer */}
            <div className={`story-background ${isLoaded ? 'visible' : ''}`}
                style={{ backgroundImage: 'url(/seenBackground/seen1.png)' }}>
                <div className="data-streams"></div>
                <div className="digital-haze"></div>
            </div>

            {/* Audio Visualizer Decoration */}
            <div className="audio-status">
                <div className="audio-bar" style={{ animationDelay: '0s' }}></div>
                <div className="audio-bar" style={{ animationDelay: '0.2s' }}></div>
                <div className="audio-bar" style={{ animationDelay: '0.4s' }}></div>
            </div>

            {/* Characters Layer */}
            <div className="scene-characters">
                {/* Officer on Left */}
                <div className={`character-base officer-pos ${sceneStep >= 1 ? 'on-screen entering' : ''} ${sceneStep === 3 ? 'highlighted' : ''}`}>
                    <img src="/characters/SystemCommandOfficer.png" alt="Officer" />
                </div>

                {/* Team on Right */}
                <div className={`team-container ${sceneStep >= 2 ? 'on-screen' : ''}`}>
                    <div className={`character-base team-member leader-unit ${sceneStep >= 2 ? 'entering' : ''} ${[4, 8].includes(sceneStep) ? 'highlighted step-forward' : ''}`}>
                        <img src={`/characters/${squad.leaderGender}-TeamLeader.png`} alt="Leader" />
                    </div>
                    <div className={`character-base team-member member-unit-01 ${sceneStep >= 2 ? 'entering' : ''} ${sceneStep === 5 ? 'highlighted' : ''}`}>
                        <img src={`/characters/${squad.member1Gender}-Member01.png`} alt="Member 1" />
                    </div>
                    <div className={`character-base team-member member-unit-02 ${sceneStep >= 2 ? 'entering' : ''} ${sceneStep === 6 ? 'highlighted' : ''}`}>
                        <img src={`/characters/${squad.member2Gender}-Member02.png`} alt="Member 2" />
                    </div>
                    <div className={`character-base team-member member-unit-03 ${sceneStep >= 2 ? 'entering' : ''} ${sceneStep === 7 ? 'highlighted' : ''}`}>
                        <img src={`/characters/${squad.member3Gender}-Member03.png`} alt="Member 3" />
                    </div>
                </div>
            </div>

            {/* Dialogue UI */}
            {sceneStep >= 3 && sceneStep < 9 && (
                <div className="dialogue-system">
                    <div className={`dialogue-box ${sceneStep === 3 ? 'left-view' : 'right-view'}`} style={{
                        left: sceneStep === 3 ? '15%' : 'auto',
                        right: sceneStep >= 4 ? '15%' : 'auto',
                        bottom: '150px'
                    }}>
                        <div className="dialogue-speaker">{speaker}</div>
                        <div className="dialogue-text">
                            {displayText}
                            {isTyping && <span className="typewriter-cursor"></span>}
                        </div>
                    </div>
                    {showClickPrompt && <div className="click-prompt">CLICK ANYWHERE TO CONTINUE</div>}
                </div>
            )}

            {/* End Glitch Flash */}
            <div className={`glitch-flash ${sceneStep === 9 ? 'active' : ''}`}></div>
        </div>
    );
}

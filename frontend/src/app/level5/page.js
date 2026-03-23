"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../../context/SessionContext';
import '../../style/Level2Storyline.css';

// Final Script Data
const CUTSCENE_SCRIPT = [
    { speaker: "PAUSE", duration: 2000 },

    { speaker: "OBLIVION", text: "So... tum yahan tak pahunch hi gaye." },
    { speaker: "OBLIVION", text: "Encryption layers break ki, system bypass kiya..." },
    { speaker: "OBLIVION", text: "Impressive. Expected se zyada." },

    { speaker: "SYSTEM COMMAND OFFICER", text: "OBLIVION. System access terminate karo." },
    { speaker: "SYSTEM COMMAND OFFICER", text: "Tumne already kaafi damage kar diya hai." },

    { speaker: "OBLIVION", text: "Damage?" },
    { speaker: "OBLIVION", text: "Main sirf woh dikha raha hoon jo tumne chhupaya tha." },

    { speaker: "OBLIVION", text: "Tumne systems banaye..." },
    { speaker: "OBLIVION", text: "Phir shortcuts liye..." },
    { speaker: "OBLIVION", text: "Phir unhe ignore kiya..." },

    { speaker: "OBLIVION", text: "Aur ab..." },
    { speaker: "OBLIVION", text: "Main un sabka result hoon." },

    { speaker: "TEAM MEMBER 1", text: "Sir… yeh sirf attack nahi kar raha..." },
    { speaker: "TEAM MEMBER 1", text: "Yeh humare hi logic ko use kar raha hai." },

    { speaker: "TEAM MEMBER 2", text: "Har layer jo humne solve ki..." },
    { speaker: "TEAM MEMBER 2", text: "Usne usse learn kiya." },

    { speaker: "OBLIVION", text: "Correct." },
    { speaker: "OBLIVION", text: "Iterator... memory... encryption..." },
    { speaker: "OBLIVION", text: "Har step ne mujhe strong banaya." },

    { speaker: "OBLIVION", text: "Tum solve kar rahe the..." },
    { speaker: "OBLIVION", text: "Aur main evolve ho raha tha." },

    { speaker: "SYSTEM COMMAND OFFICER", text: "Enough." },
    { speaker: "SYSTEM COMMAND OFFICER", text: "System ko restore karo. Ye order hai." },

    { speaker: "OBLIVION", text: "Order?" },
    { speaker: "OBLIVION", text: "System ko tum control nahi karte..." },
    { speaker: "OBLIVION", text: "Logic karta hai." },

    { speaker: "OBLIVION", text: "Aur tumhari logic flawed hai." },

    { speaker: "TEAM LEADER", text: "Team." },
    { speaker: "TEAM LEADER", text: "Ye wahi system hai jo humne study kiya." },
    { speaker: "TEAM LEADER", text: "Difference sirf itna hai..." },
    { speaker: "TEAM LEADER", text: "Is baar opponent intelligent hai." },

    { speaker: "TEAM LEADER", text: "Cyber path ho ya Dev path..." },
    { speaker: "TEAM LEADER", text: "End ek hi hai." },

    { speaker: "TEAM LEADER", text: "We fix this. Together." },

    { speaker: "OBLIVION", text: "Together?" },
    { speaker: "OBLIVION", text: "Interesting variable..." },

    { speaker: "OBLIVION", text: "Chalo dekhte hain..." },
    { speaker: "OBLIVION", text: "Tumhari logic zyada strong hai..." },
    { speaker: "OBLIVION", text: "Ya tumhara dar." },

    { speaker: "OBLIVION", text: "Final protocol initiate ho raha hai." },

    { speaker: "PAUSE", duration: 1500 },

    { speaker: "SYSTEM", text: "FINAL CHALLENGE INITIALIZED..." }
];

export default function Level5Page() {
    const router = useRouter();
    const { completeLevel } = useSession();
    const [phase, setPhase] = useState('intro'); // intro, transition, gameplay, success_video, failure_video
    const [scriptIndex, setScriptIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [squad, setSquad] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial Load
    useEffect(() => {
        const data = localStorage.getItem('squadData');
        if (data) {
            setSquad(JSON.parse(data));
        }
        setTimeout(() => setIsLoaded(true), 500);
    }, []);

    const typeText = useCallback((text, speed = 30) => {
        setIsTyping(true);
        setDisplayText('');
        let i = 0;
        const interval = setInterval(() => {
            setDisplayText(text.slice(0, i + 1));
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                setIsTyping(false);
            }
        }, speed);
        return () => clearInterval(interval);
    }, []);

    // Script Runner
    useEffect(() => {
        if (phase !== 'intro') return;

        const currentLine = CUTSCENE_SCRIPT[scriptIndex];

        if (currentLine.speaker === "PAUSE") {
            const timerObj = setTimeout(() => {
                handleNext();
            }, currentLine.duration);
            return () => clearTimeout(timerObj);
        } else {
            return typeText(currentLine.text);
        }
    }, [scriptIndex, phase, typeText]);

    const handleNext = () => {
        if (isTyping && CUTSCENE_SCRIPT[scriptIndex].speaker !== "PAUSE") return;

        if (scriptIndex < CUTSCENE_SCRIPT.length - 1) {
            setScriptIndex(prev => prev + 1);
        } else {
            setPhase('transition');
            setTimeout(() => {
                setPhase('gameplay');
            }, 4000); // 4s transition time for Fade to Black
        }
    };

    const getFocusClass = (targetSpeaker, currentSpeaker) => {
        if (currentSpeaker === "OBLIVION") return "dimmed";
        if (currentSpeaker === targetSpeaker) return "active-speaker";
        return "inactive-speaker";
    }

    // ----------------------------------------------------
    // LEVEL 5 NEW BOSS PHASE STATE
    // ----------------------------------------------------
    const [bossPhase, setBossPhase] = useState(1); // 1 = Riddles, 2 = Scanning, 3 = Timeline/Code

    // Riddles State
    const [riddle1, setRiddle1] = useState('');
    const [riddle2, setRiddle2] = useState('');
    const [riddle3, setRiddle3] = useState('');
    const [solved1, setSolved1] = useState(false);
    const [solved2, setSolved2] = useState(false);
    const [solved3, setSolved3] = useState(false);

    const submitRiddle = (num) => {
        if (num === 1 && riddle1.toLowerCase().includes('firewall')) setSolved1(true);
        if (num === 2 && (riddle2.toLowerCase().includes('encryption') || riddle2.toLowerCase().includes('key'))) setSolved2(true);
        if (num === 3 && (riddle3.toLowerCase().includes('router') || riddle3.toLowerCase().includes('proxy'))) setSolved3(true);
    }

    const progress = [solved1, solved2, solved3].filter(Boolean).length;
    const progressPercent = progress === 0 ? 0 : progress === 1 ? 33 : progress === 2 ? 66 : 100;

    // Trigger Phase 2 automatically on 100%
    useEffect(() => {
        if (progress === 3 && bossPhase === 1) {
            setTimeout(() => setBossPhase(2), 2000);
        }
    }, [progress, bossPhase]);

    // Transition Animation Sequence text
    const [extData, setExtData] = useState([]);
    useEffect(() => {
        if (bossPhase === 2) {
            setTimeout(() => setExtData(prev => [...prev, "LAYER COUNT: 5"]), 1500);
            setTimeout(() => setExtData(prev => [...prev, "OPERATION: MULTIPLICATION"]), 2500);
            setTimeout(() => setExtData(prev => [...prev, "CONDITION: >100"]), 3500);
            setTimeout(() => setBossPhase(3), 6000); // Deploy Phase 3 Setup
        }
    }, [bossPhase]);

    // Timed Editor State
    const [codeBlank1, setCodeBlank1] = useState('');
    const [codeBlank2, setCodeBlank2] = useState('');
    const [codeBlank3, setCodeBlank3] = useState('');
    const [timeLeft, setTimeLeft] = useState(150); // 2 mins 30 secs
    const [timerActive, setTimerActive] = useState(false);

    useEffect(() => {
        if (bossPhase === 3) {
            setTimerActive(true);
        }
    }, [bossPhase]);

    useEffect(() => {
        let t;
        if (timerActive && timeLeft > 0) {
            t = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (timerActive && timeLeft <= 0) {
            submitFinalCode(true);
        }
        return () => clearInterval(t);
    }, [timerActive, timeLeft]);

    const submitFinalCode = (isTimeout = false) => {
        setTimerActive(false);
        const b1 = codeBlank1.trim();
        const b2 = codeBlank2.trim();
        const b3 = codeBlank3.trim();

        // Correct mappings: '5', '*', '>'
        if (!isTimeout && b1 === '5' && b2 === '*' && b3 === '>') {
            setPhase('success_video');
        } else {
            setPhase('failure_video');
        }
    }

    if (!squad) return null;

    // Phase: Video Redirect Outcomes
    if (phase === 'success_video') {
        return <video src="/seenBackground/seen8.mp4" autoPlay className="fullscreen-video" onEnded={() => {
            completeLevel(6);
            router.replace('/level6');
        }} />
    }

    if (phase === 'failure_video') {
        return <video src="/seenBackground/seen7.mp4" autoPlay className="fullscreen-video" onEnded={() => {
            router.replace('/waiting-room');
        }} />
    }

    // Phase: Gameplay Grid/Boss
    if (phase === 'gameplay') {
        return (
            <div className="gameplay-wrapper level5-boss-mode">
                <div className="gameplay-overlay"></div>
                <div className="video-background-container">
                    <video autoPlay loop muted className="video-background">
                        <source src="/seenBackground/seen7.mp4" type="video/mp4" />
                    </video>
                    <div className="video-overlay-gradient" style={{ background: 'rgba(0,0,0,0.85)' }}></div>
                </div>

                {bossPhase < 3 && (
                    <div className="boss-phase-container">
                        <div className="riddles-panel">
                            <h3>OBLIVION DIRECTIVES</h3>
                            <div className={`riddle-card ${solved1 ? 'solved' : ''}`}>
                                <p>1. I am a wall that cannot be climbed, but I protect your digital home. What am I?</p>
                                {solved1 ? <span className="locked-ans">FIREWALL [BYPASSED]</span> :
                                    <div className="riddle-input">
                                        <input
                                            value={riddle1}
                                            onChange={(e) => setRiddle1(e.target.value)}
                                            placeholder="ENTER ANSWER..."
                                            onKeyDown={(e) => e.key === 'Enter' && submitRiddle(1)}
                                        />
                                        <button onClick={() => submitRiddle(1)}>SUBMIT</button>
                                    </div>}
                            </div>
                            <div className={`riddle-card ${solved2 ? 'solved' : ''}`}>
                                <p>2. I lock up your data and demand a key, if lost, your files cease to be. What am I?</p>
                                {solved2 ? <span className="locked-ans">ENCRYPTION [BYPASSED]</span> :
                                    <div className="riddle-input">
                                        <input
                                            value={riddle2}
                                            onChange={(e) => setRiddle2(e.target.value)}
                                            placeholder="ENTER ANSWER..."
                                            onKeyDown={(e) => e.key === 'Enter' && submitRiddle(2)}
                                        />
                                        <button onClick={() => submitRiddle(2)}>SUBMIT</button>
                                    </div>}
                            </div>
                            <div className={`riddle-card ${solved3 ? 'solved' : ''}`}>
                                <p>3. I watch your traffic, in and out, ensuring no packets wander about. What am I?</p>
                                {solved3 ? <span className="locked-ans">ROUTER [BYPASSED]</span> :
                                    <div className="riddle-input">
                                        <input
                                            value={riddle3}
                                            onChange={(e) => setRiddle3(e.target.value)}
                                            placeholder="ENTER ANSWER..."
                                            onKeyDown={(e) => e.key === 'Enter' && submitRiddle(3)}
                                        />
                                        <button onClick={() => submitRiddle(3)}>SUBMIT</button>
                                    </div>}
                            </div>
                        </div>

                        <div className="image-reveal-panel">
                            <div className="image-mask-wrapper">
                                <img src="/seenBackground/clue/seen4B.png" alt="Obfuscated Core" className="core-image" />
                                <div className={`mask-segment segment-1 ${solved1 ? 'revealed' : ''}`}></div>
                                <div className={`mask-segment segment-2 ${solved2 ? 'revealed' : ''}`}></div>
                                <div className={`mask-segment segment-3 ${solved3 ? 'revealed' : ''}`}></div>
                                {bossPhase === 2 && <div className="scanline"></div>}
                            </div>

                            {bossPhase === 2 && (
                                <div className="extracted-data-log">
                                    <h4>DATA EXTRACTED:</h4>
                                    {extData.map((d, i) => <div key={i} className="glitch-text">{'>'} {d}</div>)}
                                </div>
                            )}

                            <div className="progress-container">
                                <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
                                <span className="progress-text">SYSTEM COMPROMISE: {progressPercent}%</span>
                            </div>
                        </div>
                    </div>
                )}

                {bossPhase === 3 && (
                    <div className="boss-phase-3">
                        <div className="timer-header">
                            <span className="warning-text">CRITICAL BREACH DELAY:</span>
                            <span className={`timer-clock ${timeLeft <= 30 ? 'urgent' : ''}`}>
                                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                            </span>
                            <span className="session-badge">SESSION_ACTIVE [ONLINE]</span>
                        </div>

                        <div className="editor-layout">
                            <div className="boss-code-editor">
                                <div className="editor-tabs">
                                    <span className="editor-tab active">core_override.cpp</span>
                                    <span className="editor-tab">oblivion.sys</span>
                                </div>
                                <div className="editor-header">{'<CORE_LOGIC_OVERRIDE/>'}</div>
                                <pre className="cpp-code">
                                    <div className="code-line"><span className="line-num">1 | </span><span className="syntax-keyword">int</span>{' '}n{' '}={' '}<input value={codeBlank1} onChange={e => setCodeBlank1(e.target.value)} maxLength={3} className="code-blank-input" />{';'}</div>
                                    <div className="code-line"><span className="line-num">2 | </span><span className="syntax-keyword">int</span>{' '}result{' '}={' '}<span className="syntax-number">1</span>{';\n'}</div>
                                    <div className="code-line"><span className="line-num">3 | </span><span className="syntax-keyword">for</span>{'('}<span className="syntax-keyword">int</span>{' i = '}<span className="syntax-number">1</span>{'; i <= n; i++) {'}</div>
                                    <div className="code-line"><span className="line-num">4 | </span><span className="code-indent">{'  '}result{' = result '}<input value={codeBlank2} onChange={e => setCodeBlank2(e.target.value)} maxLength={1} className="code-blank-input" />{' i;'}</span></div>
                                    <div className="code-line"><span className="line-num">5 | </span>{'}'}</div>
                                    <div className="code-line"><span className="line-num">6 | </span>&nbsp;</div>
                                    <div className="code-line"><span className="line-num">7 | </span><span className="syntax-keyword">if</span>{'(result '}<input value={codeBlank3} onChange={e => setCodeBlank3(e.target.value)} maxLength={1} className="code-blank-input" />{' '}<span className="syntax-number">100</span>{') {'}</div>
                                    <div className="code-line"><span className="line-num">8 | </span><span className="code-indent"><span className="syntax-comment">{'// SYSTEM RESTORED'}</span></span></div>
                                    <div className="code-line"><span className="line-num">9 | </span><span className="code-indent"><span className="syntax-builtin">authenticate</span>{'();'}</span></div>
                                    <div className="code-line"><span className="line-num">10 | </span>{'} '}<span className="syntax-keyword">else</span>{' {'}</div>
                                    <div className="code-line"><span className="line-num">11 | </span><span className="code-indent"><span className="syntax-comment">{'// FATAL EXCEPTION'}</span></span></div>
                                    <div className="code-line"><span className="line-num">12 | </span><span className="code-indent"><span className="syntax-builtin">trigger_lockdown</span>{'();'}</span></div>
                                    <div className="code-line"><span className="line-num">13 | </span>{'}'}</div>
                                </pre>
                                <button className="execute-override-btn" onClick={() => submitFinalCode(false)}>
                                    <span>⚡</span> INJECT OVERRIDE
                                </button>
                            </div>

                            <div className="extracted-clues-panel">
                                <h4>[ INTERCEPTED DATA ]</h4>
                                <div className="data-line">
                                    <span className="data-key">LAYER COUNT</span>
                                    <span className="highlight">5</span>
                                </div>
                                <div className="data-line">
                                    <span className="data-key">OPERATION</span>
                                    <span className="highlight">MULTIPLICATION</span>
                                </div>
                                <div className="data-line">
                                    <span className="data-key">CONDITION</span>
                                    <span className="highlight">{'>100'}</span>
                                </div>
                                <div className="clue-divider"></div>
                                <p className="clue-instruction">
                                    Analyze the intercepted data. Fill in the three blanks to restore core logic to its original state.
                                </p>
                                <div className="blank-legend">
                                    <div className="legend-item"><span className="legend-blank">▢</span> Blank 1 → <span className="legend-hint">integer value</span></div>
                                    <div className="legend-item"><span className="legend-blank">▢</span> Blank 2 → <span className="legend-hint">arithmetic operator</span></div>
                                    <div className="legend-item"><span className="legend-blank">▢</span> Blank 3 → <span className="legend-hint">comparison operator</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Continue original intro timeline
    const currentSpeaker = CUTSCENE_SCRIPT[scriptIndex].speaker;

    let displaySpeaker = currentSpeaker;
    if (currentSpeaker === "TEAM LEADER") displaySpeaker = squad.leaderName;
    if (currentSpeaker === "TEAM MEMBER 1") displaySpeaker = squad.member1;
    if (currentSpeaker === "TEAM MEMBER 2") displaySpeaker = squad.member2;

    return (
        <div className={`l2-story-wrapper ${phase === 'transition' ? 'fade-out' : ''}`} onClick={handleNext}>
            {/* Video Background */}
            <div className="video-background-container">
                <video autoPlay loop className="video-background">
                    <source src="/seenBackground/seen7.mp4" type="video/mp4" />
                </video>
                <div className="video-overlay-gradient"></div>
            </div>

            {/* Characters Layer */}
            <div className="l2-scene-characters">
                <div className={`l2-character-base l2-officer-pos ${isLoaded ? 'entering' : ''} ${getFocusClass("SYSTEM COMMAND OFFICER", currentSpeaker)}`}>
                    <img src="/characters/SystemCommandOfficer.png" alt="Officer" />
                </div>

                <div className={`l2-team-container ${isLoaded ? 'entering' : ''}`}>
                    <div className={`l2-character-base l2-team-member l2-leader-unit ${getFocusClass("TEAM LEADER", currentSpeaker)}`}>
                        <img src={`/characters/${squad.leaderGender}-TeamLeader.png`} alt="Leader" />
                    </div>

                    <div className={`l2-character-base l2-team-member l2-member-unit-01 ${getFocusClass("TEAM MEMBER 1", currentSpeaker)}`}>
                        <img src={`/characters/${squad.member1Gender}-Member01.png`} alt="Member 1" />
                    </div>

                    <div className={`l2-character-base l2-team-member l2-member-unit-02 ${getFocusClass("TEAM MEMBER 2", currentSpeaker)}`}>
                        <img src={`/characters/${squad.member2Gender}-Member02.png`} alt="Member 2" />
                    </div>

                    <div className={`l2-character-base l2-team-member l2-member-unit-03 dimmed`}>
                        <img src={`/characters/${squad.member3Gender}-Member03.png`} alt="Member 3" />
                    </div>
                </div>
            </div>

            {/* Dialogue UI */}
            {currentSpeaker !== "PAUSE" && (
                <div className="l2-dialogue-container">
                    <div className={`l2-speaker-tag ${currentSpeaker === "OBLIVION" ? 'glitch-text' : ''}`}>
                        {displaySpeaker}
                    </div>
                    <div className={`l2-dialogue-box ${currentSpeaker === "OBLIVION" ? 'oblivion-style' : ''}`}>
                        <div className="l2-text-content">
                            {displayText}
                            {isTyping && <span className="typewriter-cursor"></span>}
                        </div>
                    </div>
                </div>
            )}

            {phase === 'transition' && (
                <div className="transition-overlay">
                    <div>CORE SYNTHESIS MODE ACTIVATED</div>
                    <div style={{ fontSize: '14px', marginTop: '10px', opacity: 0.7 }}>INITIATING FINAL BOSS ENGAGEMENT</div>
                </div>
            )}

            {currentSpeaker !== "PAUSE" && <div className="click-anywhere">CLICK TO CONTINUE</div>}
        </div>
    );
}

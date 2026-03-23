"use client";

import React, { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../../../../context/SessionContext';
import { level2Storyline } from '../../../data/level2Storyline';
import '../../../../style/Level2Storyline.css';

export default function Level2StorylinePage({ params }) {
    const { slug } = use(params);
    const router = useRouter();
    const { completeLevel } = useSession();
    const content = level2Storyline[slug];

    const [squad, setSquad] = useState(null);
    const [step, setStep] = useState(0); // 0: Intro, 1: Officer, 2: Team, 3: Objectives
    const [dialogueIndex, setDialogueIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [logs, setLogs] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial load & Squad Data
    useEffect(() => {
        const data = localStorage.getItem('squadData');
        if (data) {
            setSquad(JSON.parse(data));
        }
        setTimeout(() => setIsLoaded(true), 500);
    }, []);

    // Validation
    useEffect(() => {
        if (!content) {
            router.replace('/level2');
        }
    }, [content, router]);

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

    // Initial sequence
    useEffect(() => {
        if (!content) return;

        // Show intro system messages
        const timers = content.introSystem.map((text, idx) => {
            return setTimeout(() => {
                setLogs(prev => [...prev, text]);
            }, 500 + (idx * 1500));
        });

        // Start officer dialogue after system messages
        const officerTimer = setTimeout(() => {
            setStep(1);
        }, 1000 + (content.introSystem.length * 1500));

        return () => {
            timers.forEach(t => clearTimeout(t));
            clearTimeout(officerTimer);
        };
    }, [content]);

    // Handle steps
    useEffect(() => {
        if (!content) return;

        if (step === 1) {
            typeText(content.officerDialogue[dialogueIndex]);
        } else if (step === 2) {
            typeText(content.teamDialogue[dialogueIndex].text);
        } else if (step === 3) {
            typeText(content.objective[dialogueIndex], 20);
        }
    }, [step, dialogueIndex, content, typeText]);

    const handleNext = () => {
        if (isTyping || !content) return;

        if (step === 1) {
            if (dialogueIndex < content.officerDialogue.length - 1) {
                setDialogueIndex(prev => prev + 1);
            } else {
                setStep(2);
                setDialogueIndex(0);
            }
        } else if (step === 2) {
            if (dialogueIndex < content.teamDialogue.length - 1) {
                setDialogueIndex(prev => prev + 1);
            } else {
                setStep(3);
                setDialogueIndex(0);
            }
        } else if (step === 3) {
            if (dialogueIndex < content.objective.length - 1) {
                setDialogueIndex(prev => prev + 1);
            } else {
                completeLevel(3);
                router.replace(`/level3/${slug}`);
                alert(`STORY_COMPLETE: INITIALIZING LEVEL 3`);
            }
        }
    };

    if (!content || !squad) return null;

    const getSpeakerName = () => {
        if (step === 1) return "SYSTEM COMMAND OFFICER";
        if (step === 3) return "MISSION OBJECTIVE";

        const rawSpeaker = content.teamDialogue[dialogueIndex].speaker;
        if (rawSpeaker === "Cyber Specialist") return squad.member1;
        if (rawSpeaker === "Systems Analyst") return squad.member2;
        if (rawSpeaker === "Team Leader") return squad.leaderName;
        if (rawSpeaker === "Field Operative") return squad.member3;
        return rawSpeaker;
    };

    const currentSpeaker = getSpeakerName();

    return (
        <div className="l2-story-wrapper" onClick={handleNext}>
            <div className="l2-story-background"
                style={{ backgroundImage: `url(/seenBackground/seen${slug === 'cyber' ? '4A' : '4B'}.png)` }}>
            </div>

            {/* System Logs */}
            <div className="system-log-container">
                {logs.map((log, i) => (
                    <div key={i} className="system-log-line active">{log}</div>
                ))}
            </div>

            {/* Path Label */}
            <div className="narrative-title">
                <div className="path-label">{content.title}</div>
            </div>

            {/* Characters Layer */}
            <div className="l2-scene-characters">
                {/* Officer on Left */}
                <div className={`l2-character-base l2-officer-pos ${isLoaded ? 'entering' : ''} ${step === 1 ? 'highlighted' : ''}`}>
                    <img src="/characters/SystemCommandOfficer.png" alt="Officer" />
                </div>

                {/* Team on Right */}
                <div className={`l2-team-container ${isLoaded ? 'entering' : ''}`}>
                    <div className={`l2-character-base l2-team-member l2-leader-unit ${isLoaded ? 'entering' : ''} ${currentSpeaker === squad.leaderName ? 'highlighted step-forward' : ''}`}>
                        <img src={`/characters/${squad.leaderGender}-TeamLeader.png`} alt="Leader" />
                    </div>
                    <div className={`l2-character-base l2-team-member l2-member-unit-01 ${isLoaded ? 'entering' : ''} ${currentSpeaker === squad.member1 ? 'highlighted' : ''}`}>
                        <img src={`/characters/${squad.member1Gender}-Member01.png`} alt="Member 1" />
                    </div>
                    <div className={`l2-character-base l2-team-member l2-member-unit-02 ${isLoaded ? 'entering' : ''} ${currentSpeaker === squad.member2 ? 'highlighted' : ''}`}>
                        <img src={`/characters/${squad.member2Gender}-Member02.png`} alt="Member 2" />
                    </div>
                    <div className={`l2-character-base l2-team-member l2-member-unit-03 ${isLoaded ? 'entering' : ''} ${currentSpeaker === squad.member3 ? 'highlighted' : ''}`}>
                        <img src={`/characters/${squad.member3Gender}-Member03.png`} alt="Member 3" />
                    </div>
                </div>
            </div>

            {/* Dialogue UI */}
            {step > 0 && (
                <div className="l2-dialogue-container">
                    <div className={`l2-speaker-tag ${step === 1 ? 'highlight' : 'secondary'}`}>
                        {currentSpeaker}
                    </div>
                    <div className="l2-dialogue-box">
                        <div className="l2-text-content">
                            {displayText}
                            {isTyping && <span className="typewriter-cursor"></span>}
                        </div>
                    </div>
                </div>
            )}

            <div className="click-anywhere">CLICK ANYWHERE TO CONTINUE</div>
        </div>
    );
}

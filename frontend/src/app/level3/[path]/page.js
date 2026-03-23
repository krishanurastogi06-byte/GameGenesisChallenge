"use client";

import React, { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../../../context/SessionContext';
import { levelsData } from '../../data/levels';
import '../../../style/LevelGameplay.css';

export default function Level3Page({ params }) {
    const { path } = use(params);
    const router = useRouter();
    const { completeLevel, currentLevel } = useSession();
    const content = levelsData?.level3?.[path];

    const [storyText, setStoryText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const [feedback, setFeedback] = useState({ show: false, success: false, msg: '' });
    const [attempts, setAttempts] = useState(0);
    const [showProblem, setShowProblem] = useState(false);

    // Officer & Flash State
    const [showOfficer, setShowOfficer] = useState(false);
    const [officerMessage, setOfficerMessage] = useState('');
    const [errorFlash, setErrorFlash] = useState(false);

    // Constants from Level 1 Style
    const MAX_ATTEMPTS = 2;

    // Security Verification
    useEffect(() => {
        if (!content || currentLevel !== 3) {
            router.replace('/level2');
        }
    }, [content, currentLevel, router]);

    useEffect(() => {
        setSelectedOption('');
    }, [path]);

    const typeWriter = useCallback((text, targetSetter, speed = 30) => {
        setIsTyping(true);
        targetSetter('');
        let i = 0;
        const interval = setInterval(() => {
            targetSetter(text.slice(0, i + 1));
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                setIsTyping(false);
            }
        }, speed);
        return () => clearInterval(interval);
    }, []);

    // Initial Sequence 
    useEffect(() => {
        if (!content) return;
        setTimeout(() => {
            typeWriter(content.context, setStoryText);
        }, 1000);
        setTimeout(() => setShowProblem(true), 4000);
    }, [content, typeWriter]);

    const handleVerify = () => {
        if (!selectedOption || isTyping) return;

        setShowOfficer(true);

        if (selectedOption === content.answer) {
            typeWriter(content.successMessage, setOfficerMessage);
            setFeedback({ show: true, success: true, msg: '' });
            setTimeout(() => {
                completeLevel(4);
                router.replace(`/level4/${path}`);
            }, 4000);
        } else {
            const nextAttempts = attempts + 1;
            setAttempts(nextAttempts);

            if (nextAttempts >= MAX_ATTEMPTS) {
                const msg = 'CRITICAL SYSTEM FAILURE. SECURITY BREACH DETECTED. INITIATING LOCKDOWN PROTOCOL...';
                typeWriter(msg, setOfficerMessage);
                setFeedback({ show: true, success: false, msg: '' });
                setErrorFlash(true);
                setTimeout(() => {
                    router.replace('/waiting-room');
                }, 4000);
            } else {
                const msg = `INCORRECT. Attempt ${nextAttempts}/${MAX_ATTEMPTS}. ${content.failureHint}`;
                typeWriter(msg, setOfficerMessage);
                setFeedback({ show: true, success: false, msg: '' });
                setErrorFlash(true);
                setTimeout(() => {
                    setShowOfficer(false);
                    setFeedback({ show: false, success: false, msg: '' });
                    setErrorFlash(false);
                }, 3000);
            }
        }
    };

    const highlightSyntax = (text) => {
        if (!text) return "";
        let h = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        
        h = h.replace(/(\/\/.*)/g, '<span class="token-comment">$1</span>');
        h = h.replace(/(".*?")/g, '<span class="token-string">$1</span>');
        h = h.replace(/('.*?')/g, '<span class="token-string">$1</span>');
        h = h.replace(/(#include)/g, '<span class="token-directive">$1</span>');
        h = h.replace(/(&lt;\w+&gt;)/g, '<span class="token-string">$1</span>');
        h = h.replace(/\b(using|namespace|int|char|return|if|else|for|while|void)\b/g, '<span class="token-keyword">$1</span>');
        h = h.replace(/\b(std|cout|cin|endl|vector|string)\b/g, '<span class="token-builtin">$1</span>');
        h = h.replace(/\b(\d+)\b/g, '<span class="token-number">$1</span>');
        
        return h;
    };

    const renderCodeWithBlanks = (code, selectedOption) => {
        if (!code) return "";

        return code.split("___").map((part, index) => (
            <React.Fragment key={index}>
                <span dangerouslySetInnerHTML={{ __html: highlightSyntax(part) }} />
                {index < code.split("___").length - 1 && (
                    <span className="code-blank">
                        {selectedOption || "___"}
                    </span>
                )}
            </React.Fragment>
        ));
    };

    if (!content) return null;

    return (
        <div className={`gameplay-wrapper ${path}-theme`}>
            <div className="gameplay-overlay"></div>

            {/* Zone 1: Story Panel */}
            <div className="story-panel">
                <div className="system-alert-header">
                    <div className="alert-pulse"></div>
                    {content.title}
                </div>
                <div className="story-text">
                    {storyText}
                    {isTyping && <span className="typing-cursor"></span>}
                </div>
            </div>

            {/* Zone 2: Main Area */}
            <div className={`main-problem-area ${showProblem ? 'visible' : 'hidden'}`} style={{ opacity: showProblem ? 1 : 0 }}>
                <div className="problem-container">
                    <div className="problem-text">
                        <h3>[MISSION PARAMETERS]</h3>
                        <p>{content.problem}</p>
                    </div>

                    <div className="task-list">
                        <ul>
                            {content.tasks.map((task, i) => (
                                <li key={i}>{task}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="input-field-container">
                    {content.code && (
                        <div className="code-display-box">
                            <pre className="code-snippet">
                                {renderCodeWithBlanks(content.code, selectedOption)}
                            </pre>
                        </div>
                    )}

                    <div className="selection-status-box">
                        <span className="status-label">SELECTED:</span>
                        <span className="status-value">{selectedOption || "AWAITING_INPUT"}</span>
                    </div>

                    <div className="options-grid">
                        {content.options.map((opt, i) => (
                            <button
                                key={i}
                                className={`option-btn ${selectedOption === opt ? 'selected' : ''}`}
                                onClick={() => setSelectedOption(opt)}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>

                    <button
                        className={`verify-btn ${!selectedOption ? 'disabled' : ''}`}
                        onClick={handleVerify}
                        disabled={!selectedOption}
                    >
                        EXECUTE PROTOCOL
                    </button>
                </div>
            </div>

            {/* Zone 3: Guidance */}
            <div className="clue-panel visible" style={{ opacity: 0.8 }}>
                <div className="clue-header">INTEL_LOGS</div>
                <div className="clue-hint-overlay">
                    {content.clues.map((clue, i) => (
                        <div key={i} style={{ marginBottom: '5px' }}>{"> " + clue}</div>
                    ))}
                </div>
            </div>

            {/* Feedback UI */}
            <div className={`feedback-msg success ${feedback.show && feedback.success ? 'show' : ''}`}>
                {feedback.msg}
            </div>
            <div className={`feedback-msg error ${feedback.show && !feedback.success ? 'show' : ''}`}>
                {feedback.msg}
            </div>

            {/* Visual Flashes */}
            <div className={`error-flash ${errorFlash ? 'active' : ''}`}></div>

            {/* Officer Feedback Dialogue */}
            {showOfficer && (
                <div className="officer-feedback-overlay">
                    <div className="officer-container">
                        <img src="/characters/SystemCommandOfficer.png" alt="Officer" className="officer-image" />
                    </div>
                    <div className="feedback-dialogue-box">
                        <div className="dialogue-header">SYSTEM COMMAND OFFICER</div>
                        <div className="dialogue-text">{officerMessage}</div>
                    </div>
                </div>
            )}

            {/* Ambient Sound Hint Visual */}
            <div className="audio-status" style={{ bottom: '20px', right: '20px' }}>
                <div className="audio-bar"></div>
                <div className="audio-bar" style={{ height: '8px', animationDelay: '0.3s' }}></div>
                <div className="audio-bar" style={{ animationDelay: '0.6s' }}></div>
            </div>
        </div>
    );
}

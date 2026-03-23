"use client";

import React, { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../../../context/SessionContext';
import { levelsData } from '../../data/levels';
import '../../../style/LevelGameplay.css';

export default function Level4Page({ params }) {
    const { path } = use(params);
    const router = useRouter();
    const { completeLevel, currentLevel } = useSession();
    const content = levelsData?.level4?.[path];

    const [storyText, setStoryText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [feedback, setFeedback] = useState({ show: false, success: false, msg: '' });
    const [attempts, setAttempts] = useState(0);
    const [showProblem, setShowProblem] = useState(false);

    // Code Editor State
    const [language, setLanguage] = useState('cpp');
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [isCompiling, setIsCompiling] = useState(false);

    // Officer & Flash State
    const [showOfficer, setShowOfficer] = useState(false);
    const [officerMessage, setOfficerMessage] = useState('');
    const [errorFlash, setErrorFlash] = useState(false);

    const MAX_ATTEMPTS = 5;

    // Security Verification
    useEffect(() => {
        if (!content || currentLevel !== 4) {
             router.replace('/level3/' + path);
        }
    }, [content, currentLevel, router, path]);

    // Initialize Code Template
    useEffect(() => {
        if (content && content.templates) {
            setCode(content.templates[language]);
            setOutput('');
        }
    }, [language, content]);

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

    const executeCode = async () => {
        if (!code.trim() || isCompiling) return;
        
        setIsCompiling(true);
        setOutput("Compiling...");
        
        // Map UI languages to Judge0 language IDs
        const languageMap = {
            'cpp': 54,
            'python': 71,
            'javascript': 93,
            'c': 50
        };

        const languageId = languageMap[language] || 54;

        try {
            const response = await fetch("https://ce.judge0.com/submissions?base64_encoded=false&wait=true", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    source_code: code,
                    language_id: languageId,
                    stdin: ""
                })
            });

            if (!response.ok) {
                throw new Error("Execution API unreachable or blocked.");
            }

            const result = await response.json();
            
            let finalOutput = "";
            if (result.stdout !== null && result.stdout !== undefined) finalOutput += result.stdout;
            if (result.stderr !== null && result.stderr !== undefined) finalOutput += "\n" + result.stderr;
            if (result.compile_output !== null && result.compile_output !== undefined) finalOutput += "\n" + result.compile_output;
            
            finalOutput = finalOutput.trim();
            setOutput(finalOutput || "Executed without output.");
            
            validateOutput(finalOutput);

        } catch (error) {
            setOutput("Error interfacing with compiler runtime: " + error.message);
        } finally {
            setIsCompiling(false);
        }
    };

    const validateOutput = (runtimeOutput) => {
        setShowOfficer(true);

        // Strip whitespaces to ensure clean comparison
        if (runtimeOutput === content.expectedOutput) {
            typeWriter(content.successMessage, setOfficerMessage);
            setFeedback({ show: true, success: true, msg: '' });
            setTimeout(() => {
                completeLevel(5);
                alert("OBLIVION PROTOCOL COMPLETED — SYSTEM RESTORED");
                router.push('/');
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
            <div className={`main-problem-area ${showProblem ? 'visible' : 'hidden'}`} style={{ opacity: showProblem ? 1 : 0, alignItems: 'flex-start', marginLeft: '50px' }}>
                <div className="left-column" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '220px' }}>
                    <div className="problem-container" style={{ margin: '0', width: '380px' }}>
                        <div className="problem-text">
                            <h3>[MISSION PARAMETERS]</h3>
                            <p>{content.problem}</p>
                        </div>
                    </div>
                </div>

                <div className="code-editor-section" style={{ margin: '40px 0 0 30px', width: '650px', zIndex: 10 }}>
                    <div className="editor-top-bar">
                        <span className="editor-title">{"<TERMINAL.exe/>"}</span>
                        <select 
                            className="language-selector" 
                            value={language} 
                            onChange={(e) => setLanguage(e.target.value)}
                        >
                            <option value="cpp">C++ (GCC 9.2)</option>
                            <option value="python">Python (3.8)</option>
                            <option value="javascript">JavaScript (Node.js)</option>
                            <option value="c">C (GCC 9.2)</option>
                        </select>
                    </div>
                    
                    <textarea 
                        className="code-editor"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        spellCheck={false}
                    />

                    <div className="editor-controls">
                        <button 
                            className={`verify-btn run-code-btn ${isCompiling ? 'disabled' : ''}`}
                            onClick={executeCode}
                            disabled={isCompiling}
                        >
                            {isCompiling ? 'COMPILING...' : 'RUN PIPELINE'}
                        </button>
                    </div>
                    
                    <div className="output-console">
                        <div className="console-header">[ STDOUT / STDERR ]</div>
                        <pre className="console-output">{output}</pre>
                    </div>
                </div>
            </div>

            {/* Zone 3: Guidance & Evidence */}
            <div className="clue-panel visible" style={{ opacity: 0.8 }}>
                <div className="clue-header">INTEL_LOGS</div>

                <div className="clue-hint-overlay">
                    {content.clues.map((clue, i) => (
                        <div key={i} style={{ marginBottom: '5px' }}>{clue}</div>
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

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "../../context/SessionContext";
import "../../style/Level1.css";

const STORY_STEPS = [
    {
        alert: "DIAGNOSTIC: ITERATOR TRACE",
        narrative:
            "This level is about understanding C++ iterators. A vector stores integer keys. An iterator is moved to a specific element. Your task is to correctly print the memory location of that selected element.",
        taunt:
            "Iterators point directly to memory. If you truly understand them, you know how to extract the address."
    }
];

// Only show code till cout <<
const CODE_PREFIX = `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> keys = {101, 203, 305, 407};

    vector<int>::iterator it;
    it = keys.begin() + 2;

    cout << `;

const CODE_SUFFIX = ` << endl;

    return 0;
}`;

export default function Level1Page() {
    const router = useRouter();
    const { completeLevel } = useSession();

    const [storyText, setStoryText] = useState("");
    const [tauntText, setTauntText] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const [userCode, setUserCode] = useState("");
    const [compilerOutput, setCompilerOutput] = useState("");

    const [showOfficer, setShowOfficer] = useState(false);
    const [officerMessage, setOfficerMessage] = useState("");
    const [errorFlash, setErrorFlash] = useState(false);

    const CORRECT_EXPRESSION = "&(*it)";
    const SIMULATED_OUTPUT = "0x0042CC";

    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const typeWriter = useCallback((text, setter, speed = 25) => {
        setIsTyping(true);
        setter("");
        let i = 0;

        const interval = setInterval(() => {
            setter(text.slice(0, i + 1));
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                setIsTyping(false);
            }
        }, speed);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setTimeout(() => {
            typeWriter(STORY_STEPS[0].narrative, setStoryText);
        }, 1200);

        setTimeout(() => {
            typeWriter(STORY_STEPS[0].taunt, setTauntText, 40);
        }, 4000);
    }, [typeWriter]);

    const handleCompile = () => {
        if (!userCode.trim() || isTyping) return;

        setShowOfficer(true);

        const sanitized = userCode.replace(/\s/g, "");
        const normalized = CORRECT_EXPRESSION.replace(/\s/g, "");

        if (sanitized === normalized) {
            setCompilerOutput(SIMULATED_OUTPUT);

            const msg = `Compilation Successful. Memory Address Resolved: ${SIMULATED_OUTPUT}`;

            typeWriter(msg, setOfficerMessage);

            setTimeout(() => {
                completeLevel(2);
                router.replace("/level2");
            }, 4000);
        } else {
            const msg = "Compilation Error: Invalid memory access expression.";
            typeWriter(msg, setOfficerMessage);
            setErrorFlash(true);

            setTimeout(() => {
                setShowOfficer(false);
                setErrorFlash(false);
            }, 3000);
        }
    };

    return (
        <div className="level-wrapper">
            <div
                className="level-background"
                style={{ backgroundImage: "url(/seenBackground/seen2.png)" }}
            ></div>

            {/* Story Panel */}
            <div className="story-panel">
                <div className="system-alert-header">
                    {STORY_STEPS[0].alert}
                </div>
                <div className="story-text">{storyText}</div>
                {tauntText && <div className="oblivion-taunt">{tauntText}</div>}
            </div>

            {/* Code Console */}
            <div className="main-problem-area visible">
                <div className="code-console">
                    <pre className="code-snippet">
                        <span className="keyword">#include</span>
                        <span className="string">&lt;iostream&gt;</span>{"\n"}
                        <span className="keyword">#include</span>
                        <span className="string">&lt;vector&gt;</span>{"\n"}

                        <span className="keyword">using</span>
                        <span className="keyword">namespace</span> std;{"\n\n"}

                        <span className="keyword">int</span> main() {"{"} {"\n"}
                        {"    "}
                        vector&lt;<span className="type">int</span>&gt; keys = {"{"}
                        <span className="number">101</span>,
                        <span className="number">203</span>,
                        <span className="number">305</span>,
                        <span className="number">407</span>
                        {"}"};{"\n\n"}

                        {"    "}vector&lt;<span className="type">int</span>&gt;::iterator it;{"\n"}
                        {"    "}it = keys.begin() + <span className="number">2</span>;{"\n\n"}

                        {"    "}cout {"<<"} {""}
                        <input
                            ref={inputRef}
                            type="text"
                            value={userCode}
                            onChange={(e) => setUserCode(e.target.value)}
                            className="code-input"
                            placeholder="write the print memory location"
                        />
                        {""} {"<<"} endl;{"\n\n"}

                        {"    "}return <span className="number">0</span>;{"\n"}
                        {"}"}
                    </pre>
                </div>

                <button
                    className={`verify-btn ${!userCode ? "disabled" : ""}`}
                    onClick={handleCompile}
                    disabled={!userCode}
                >
                    COMPILE
                </button>

                {compilerOutput && (
                    <div className="compiler-output">
                        Output: {compilerOutput}
                    </div>
                )}

                <div className="hint-box">
                    <div className="hint-header">
                        SYSTEM_HINT.exe
                    </div>
                    <div className="hint-content">
                        • Iterator begin() returns first element.<br />
                        • begin() + 2 moves to index 2.<br />
                        • *it gives value.<br />
                        • Address nikalne ke liye operator use karo.
                    </div>
                </div>
            </div>

            {/* Error Flash */}
            <div className={`error-flash ${errorFlash ? "active" : ""}`}></div>

            {/* Officer Dialogue */}
            {showOfficer && (
                <div className="officer-feedback-overlay">
                    <div className="officer-container">
                        <img
                            src="/characters/SystemCommandOfficer.png"
                            alt="Officer"
                            className="officer-image"
                        />
                    </div>
                    <div className="feedback-dialogue-box">
                        <div className="dialogue-header">
                            SYSTEM COMMAND OFFICER
                        </div>
                        <div className="dialogue-text">
                            {officerMessage}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
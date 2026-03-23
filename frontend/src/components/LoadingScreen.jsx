"use client";

import React, { useState, useEffect } from 'react';
import '../style/LoadingScreen.css';

const LoadingScreen = () => {
    const [binaryData, setBinaryData] = useState("");
    const [systemLogs, setSystemLogs] = useState([]);
    const [phase, setPhase] = useState(0); // 0: Flickering, 1: Assembling, 2: Loading, 3: Final

    const [memAlloc, setMemAlloc] = useState(0);
    const [progress, setProgress] = useState(0);

    // Loading progress generator
    useEffect(() => {
        const duration = 5000; // 5 seconds
        const intervalTime = 50;
        const increment = 100 / (duration / intervalTime);

        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return Math.min(prev + increment + (Math.random() * 2 - 1), 100);
            });
        }, intervalTime);

        setMemAlloc(Math.floor(Math.random() * 100));
        const binaryInterval = setInterval(() => {
            let b = "";
            for (let i = 0; i < 400; i++) {
                b += Math.random() > 0.5 ? "1" : "0";
            }
            setBinaryData(b);
        }, 100);

        return () => {
            clearInterval(timer);
            clearInterval(binaryInterval);
        };
    }, []);

    // System log generator
    useEffect(() => {
        const logs = [
            "INITIALIZING NEURAL LINK...",
            "BYPASSING SECURITY OVERRIDE...",
            "CRITICAL: MEMORY LEAK DETECTED AT 0x4F92",
            "WARNING: SYSTEM INTEGRITY 84%",
            "ACCESSING CORE METRICS...",
            "DECRYPTING ENCRYPTED PARTITION...",
            "ERROR: DATA CORRUPTION IN SECTOR 7",
            "REBOOTING SUBSYSTEMS...",
            "SYNCING BIOMETRIC DATA...",
            "ESTABLISHING SECURE CONNECTION...",
        ];

        let currentLogIndex = 0;
        const interval = setInterval(() => {
            setSystemLogs(prev => [...prev.slice(-5), logs[currentLogIndex]]);
            currentLogIndex = (currentLogIndex + 1) % logs.length;
        }, 800);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loading-container">
            <div className="noise-overlay"></div>
            <div className="scanlines"></div>

            <div className="glitch-bar glitch-bar-1"></div>
            <div className="glitch-bar glitch-bar-2"></div>
            <div className="glitch-bar glitch-bar-3"></div>

            <div className="hud-container">
                <div className="aberration-wrapper aberration">
                    <div className="corner top-left"></div>
                    <div className="corner top-right"></div>
                    <div className="corner bottom-left"></div>
                    <div className="corner bottom-right"></div>

                    <div className="system-status">
                        <div className="status-line corruption-flicker">SYS_REBOOT: STATUS_OK</div>
                        <div className="status-line">USER_AUTH: ANONYMOUS</div>
                        <div className="status-line corrupted">NETWORK_UP: [!] INTERFERENCE DETECTED</div>
                    </div>

                    <div className="data-stream">
                        {systemLogs.map((log, i) => (
                            <div key={i} className="status-line">
                                {`> ${log}`}
                            </div>
                        ))}
                        <div className="binary-code mt-4">
                            {binaryData}
                        </div>
                    </div>

                    <div className="central-hud">
                        <div className="loader-bar">
                            <div
                                className="loader-fill"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <div className="absolute text-[18px] bottom-2 opacity-90 font-bold tracking-[0.2em] neon-text">
                            {Math.floor(progress)}%
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-4 right-4 text-[10px] opacity-30 text-right">
                SECURE_NODE: AF-99-01<br />
                MEM_ALLOC: {memAlloc}%
            </div>
        </div>
    );
};

export default LoadingScreen;

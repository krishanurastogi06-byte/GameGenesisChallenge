"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SessionContext = createContext();

export function SessionProvider({ children }) {
    const router = useRouter();
    const [hasFinishedLoading, setHasFinishedLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authToken, setAuthToken] = useState(null);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [storylineComplete, setStorylineComplete] = useState(false);
    const [branchPath, setBranchPath] = useState(null); // 'cyber' or 'dev'
    const [sessionActive, setSessionActive] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Load state from localStorage on mount
    useEffect(() => {
        const savedSession = localStorage.getItem('oblivion_session');
        const savedToken = localStorage.getItem('oblivion_token');

        if (savedToken) {
            setAuthToken(savedToken);
        }

        if (savedSession) {
            try {
                const data = JSON.parse(savedSession);
                setIsAuthenticated(data.isAuthenticated);
                const savedLevel = data.currentLevel || 1;
                setCurrentLevel(savedLevel);
                setStorylineComplete(data.storylineComplete || false);
                setBranchPath(data.branchPath || null);
                setSessionActive(data.sessionActive);
            } catch (e) {
                console.error("Failed to parse session data", e);
            }
        }
        setIsLoading(false);
    }, []);

    // Save state to localStorage on change
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem('oblivion_session', JSON.stringify({
                isAuthenticated,
                currentLevel,
                storylineComplete,
                branchPath,
                sessionActive
            }));
            if (authToken) {
                localStorage.setItem('oblivion_token', authToken);
            } else {
                localStorage.removeItem('oblivion_token');
            }
        }
    }, [isAuthenticated, currentLevel, storylineComplete, branchPath, sessionActive, hasFinishedLoading, isLoading]);

    const finishLoading = () => {
        setHasFinishedLoading(true);
    };

    const login = () => {
        setIsAuthenticated(true);
        setSessionActive(true);
        setCurrentLevel(1);
        setStorylineComplete(false);
        setBranchPath(null);
    };

    const setToken = (token) => {
        setAuthToken(token);
        if (token) setIsAuthenticated(true);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setSessionActive(false);
        setCurrentLevel(1);
        setStorylineComplete(false);
        setBranchPath(null);
        setAuthToken(null);
        localStorage.removeItem('oblivion_token');
        localStorage.removeItem('oblivion_session');
    };

    const completeLevel = (nextLevel) => {
        setCurrentLevel(nextLevel);
    };

    const finishStoryline = () => {
        setStorylineComplete(true);
    };

    const choosePath = (path) => {
        setBranchPath(path);
    };

    // Global polling to enforce server-side termination (runs regardless of route)
    useEffect(() => {
        if (!authToken) return;
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

        let stopped = false;
        const checkStatus = async () => {
            try {
                const res = await fetch(`${apiBase}/api/game/status`, {
                    method: 'GET',
                    headers: { 'x-auth-token': authToken }
                });

                if (res.status === 403) {
                    // Immediately stop session and redirect to login
                    setIsAuthenticated(false);
                    setSessionActive(false);
                    setAuthToken(null);
                    localStorage.removeItem('oblivion_token');
                    localStorage.removeItem('oblivion_session');
                    if (!stopped) {
                        stopped = true;
                        router.replace('/login');
                    }
                    return;
                }

                if (!res.ok) return;
                const data = await res.json();
                if (data.isTerminated) {
                    // Immediately stop session and redirect to login
                    setIsAuthenticated(false);
                    setSessionActive(false);
                    setAuthToken(null);
                    localStorage.removeItem('oblivion_token');
                    localStorage.removeItem('oblivion_session');
                    if (!stopped) {
                        stopped = true;
                        router.replace('/login');
                    }
                }
            } catch (e) {
                // ignore network errors
            }
        };

        // Initial immediate check, then poll every 2 seconds
        checkStatus();
        const id = setInterval(checkStatus, 2000);
        return () => clearInterval(id);
    }, [authToken, router]);

    return (
        <SessionContext.Provider value={{
            hasFinishedLoading,
            isAuthenticated,
            currentLevel,
            storylineComplete,
            branchPath,
            sessionActive,
            isLoading,
            authToken,
            setToken,
            finishLoading,
            login,
            logout,
            completeLevel,
            finishStoryline,
            choosePath
        }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
}

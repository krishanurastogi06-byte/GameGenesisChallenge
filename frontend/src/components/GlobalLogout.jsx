"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../context/SessionContext';

export default function GlobalLogout() {
    const router = useRouter();
    const { logout, hasFinishedLoading, isAuthenticated, sessionActive } = useSession();

    // Only show the logout option after the initial loader has cleared
    if (!hasFinishedLoading) return null;

    // Optional: Hide on roots where it might look like clutter if not active
    // But the user asked for "on all the screen"

    const handleLogout = () => {
        if (confirm("CRITICAL: DISCONNECT SESSION AND WIPE PERSISTENT DATA?")) {
            // Attempt to call unified terminate endpoint for this team, then clear session
            (async () => {
                try {
                    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                    const token = localStorage.getItem('oblivion_token');
                    if (token) {
                        // Fetch team status to learn teamId
                        const statusRes = await fetch(`${apiBase}/api/game/status`, {
                            method: 'GET',
                            headers: { 'x-auth-token': token }
                        });
                        if (statusRes.ok) {
                            const data = await statusRes.json();
                            if (data.teamId) {
                                await fetch(`${apiBase}/api/teams/${data.teamId}/terminate`, {
                                    method: 'POST',
                                    headers: { 'x-auth-token': token }
                                });
                            }
                        }
                    }
                } catch (e) {
                    // ignore network/errors; still clear local session
                } finally {
                    logout();
                    router.replace('/login');
                }
            })();
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        }}>
            {/* Status Indicator */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                fontFamily: 'monospace',
                fontSize: '0.6rem',
                color: isAuthenticated ? '#00f3ff' : '#666',
                textTransform: 'uppercase',
                letterSpacing: '1px'
            }}>
                <span>SESSION_ACTIVE</span>
                <span style={{ fontSize: '0.8rem', fontWeight: '900' }}>
                    {isAuthenticated ? '[ONLINE]' : '[TERMINAL_ENTRY]'}
                </span>
            </div>

            <button
                onClick={handleLogout}
                style={{
                    background: 'rgba(255, 0, 0, 0.1)',
                    border: '1px solid rgba(255, 60, 60, 0.4)',
                    color: '#ff4d4d',
                    padding: '8px 15px',
                    fontSize: '0.7rem',
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 0 10px rgba(255, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 0, 0, 0.3)';
                    e.currentTarget.style.border = '1px solid #ff4d4d';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 0, 0, 0.1)';
                    e.currentTarget.style.border = '1px solid rgba(255, 60, 60, 0.4)';
                    e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.05)';
                }}
            >
                <span style={{ fontSize: '1rem' }}>⏻</span>
                TERMINATE
            </button>
        </div>
    );
}

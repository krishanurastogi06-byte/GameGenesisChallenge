"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "../context/SessionContext";

export default function RouteGuard({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { hasFinishedLoading, isAuthenticated, currentLevel, storylineComplete, isLoading, authToken } = useSession();

    useEffect(() => {
        if (isLoading) return;

        const currentPath = pathname;

        // Immediately validate server-side session & termination state on every route change
        (async () => {
            try {
                if (isAuthenticated && authToken) {
                    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                    const statusRes = await fetch(`${apiBase}/api/game/status`, {
                        method: 'GET',
                        headers: { 'x-auth-token': authToken }
                    });
                    if (statusRes.ok) {
                        const statusData = await statusRes.json();
                        if (statusData.isTerminated) {
                            // Clear local session and force immediate redirect to login
                            localStorage.removeItem('oblivion_session');
                            localStorage.removeItem('oblivion_token');
                            // navigate to login page immediately
                            window.location.href = '/login';
                            return;
                        }
                    }
                }
            } catch (e) {
                // ignore; we'll fall back to client-side guards
            }
        })();

        // 1. LOADING GATE (Non-Negotiable Rule 1)
        // If they haven't finished loading, they can only be on the root (which hosts the loader)
        if (!hasFinishedLoading) {
            if (currentPath !== "/") {
                router.replace("/");
            }
            return;
        }

        // 2. AUTHENTICATION GATE (Non-Negotiable Rules 2 & 3)
        if (!isAuthenticated) {
            // Unauthenticated users can only see Welcome (/) or Login (/login)
            const allowedUnauth = ["/", "/login", "/enrollment"];
            if (!allowedUnauth.includes(currentPath)) {
                router.replace("/login");
            }
        } else {
            // Authenticated users are FORBIDDEN from Welcome (Rule 2) and Login (Rule 3)
            const blockedForAuth = ["/", "/login", "/enrollment", "/waiting-room"];

            // 3. STORYLINE GATE (Non-Negotiable Rule 4)
            if (!storylineComplete) {
                // If story is not done, they MUST be on /storyline
                if (currentPath !== "/storyline") {
                    router.replace("/storyline");
                }
            } else {
                // If story IS done, they are FORBIDDEN from Storyline (Rule 4)
                if (currentPath === "/storyline") {
                    router.replace(`/level${currentLevel}`);
                    return;
                }

                // 4. GAMEPLAY GATE (Non-Negotiable Rules 5 & 6)
                // They MUST be on exactly level${currentLevel} OR a sub-route of it
                const targetLevelPath = `/level${currentLevel}`;
                const isCorrectLevelBase = currentPath.startsWith(targetLevelPath);

                if (currentPath.startsWith("/level") && !isCorrectLevelBase) {
                    router.replace(targetLevelPath);
                } else if (blockedForAuth.includes(currentPath)) {
                    router.replace(targetLevelPath);
                }
            }
        }

        // 5. NAVIGATION LOCKDOWN (Rules 3, 5, 6 - Neutralize Back/Forward)
        const handleNavigationProtection = () => {
            // Force history to stay on the current valid path
            window.history.pushState(null, null, window.location.pathname);
        };

        // Notify backend about current route for accurate admin tracking
        (async () => {
            try {
                if (isAuthenticated && authToken) {
                    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
                    await fetch(`${apiBase}/api/game/route`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-auth-token': authToken
                        },
                        body: JSON.stringify({ route: currentPath })
                    });

                    // If the team was terminated by admin, backend will have isTerminated flag set.
                    // Fetch a quick team status to check termination and force redirect if needed.
                    const statusRes = await fetch(`${apiBase}/api/game/status`, {
                        method: 'GET',
                        headers: { 'x-auth-token': authToken }
                    });
                    if (statusRes.ok) {
                        const statusData = await statusRes.json();
                        if (statusData.isTerminated) {
                            // clear session and redirect to login/register
                            localStorage.removeItem('oblivion_session');
                            localStorage.removeItem('oblivion_token');
                            window.location.href = '/login';
                        }
                    }
                }
            } catch (e) {
                // silently ignore route update errors
            }
        })();

        // Poll server-side team status every 2 seconds to enforce immediate termination redirect
        let pollId = null;
        if (isAuthenticated && authToken) {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const pollStatus = async () => {
                try {
                    const r = await fetch(`${apiBase}/api/game/status`, {
                        method: 'GET',
                        headers: { 'x-auth-token': authToken }
                    });
                    if (r.ok) {
                        const data = await r.json();
                        if (data.isTerminated) {
                            localStorage.removeItem('oblivion_session');
                            localStorage.removeItem('oblivion_token');
                            window.location.href = '/login';
                        }
                    }
                } catch (e) {
                    // ignore
                }
            };
            pollId = setInterval(pollStatus, 2000);
        }

        window.addEventListener("popstate", handleNavigationProtection);
        return () => {
            window.removeEventListener("popstate", handleNavigationProtection);
            if (pollId) clearInterval(pollId);
        };
    }, [pathname, hasFinishedLoading, isAuthenticated, currentLevel, storylineComplete, isLoading, router]);

    if (isLoading) {
        return <div style={{ background: '#000', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00f3ff' }}>INITIALIZING_SESSION...</div>;
    }

    return children;
}

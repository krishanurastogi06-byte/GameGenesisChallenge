"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../../context/SessionContext';

export default function Level3RootPage() {
    const router = useRouter();
    const { branchPath } = useSession();

    useEffect(() => {
        if (branchPath) {
            router.replace(`/level3/${branchPath}`);
        } else {
            // Fallback if branch isn't set for some reason
            router.replace('/level2');
        }
    }, [branchPath, router]);

    return (
        <div style={{ background: '#000', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00f3ff', fontFamily: 'monospace' }}>
            INITIALIZING MISSION BRANCH...
        </div>
    );
}

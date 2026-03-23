"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '../../context/SessionContext';

export default function Level4RootPage() {
    const router = useRouter();
    const { branchPath } = useSession();

    useEffect(() => {
        if (branchPath) {
            router.replace(`/level4/${branchPath}`);
        } else {
            // Fallback to previous level if state is lost
            router.replace('/level3');
        }
    }, [branchPath, router]);

    return (
        <div style={{ background: '#000', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00f3ff', fontFamily: 'monospace' }}>
            INITIALIZING CORE LAYER...
        </div>
    );
}

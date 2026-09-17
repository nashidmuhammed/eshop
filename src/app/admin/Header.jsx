'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";
import Loader from "@/components/Loader";

const Header = () => {
    const router = useRouter();
    const { refreshUserData } = useUser();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const initWorkspace = async () => {
            if (isMounted) setLoading(true);
            const { targetOrgId, orgs } = await refreshUserData();

            if (isMounted) {
                // If user has no organization at all, redirect to create one
                if (!targetOrgId && Array.isArray(orgs) && orgs.length === 0) {
                    router.push('/admin/welcome');
                }
                setLoading(false);
            }
        };

        initWorkspace();

        return () => {
            isMounted = false;
        };
    }, [router, refreshUserData]);

    if (loading) {
        return (
            <div
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(9, 10, 15, 0.85)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    transition: 'opacity 0.3s ease-in-out',
                }}
            >
                <Loader lite />
                <p
                    style={{
                        marginTop: '1.25rem',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                        letterSpacing: '0.05em',
                        color: '#1BA098',
                        fontFamily: 'system-ui, sans-serif',
                    }}
                >
                    Setting up workspace...
                </p>
            </div>
        );
    }

    return null;
};

export default Header;
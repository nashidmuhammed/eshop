'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

const Header = () => {
    const router = useRouter();
    const { organization, organizationsList, loading } = useUser();

    useEffect(() => {
        if (!loading && !organization && Array.isArray(organizationsList) && organizationsList.length === 0) {
            router.push('/admin/welcome');
        }
    }, [loading, organization, organizationsList, router]);

    return null;
};

export default Header;
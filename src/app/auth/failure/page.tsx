'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

export default function Page() {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            // Redirect to the home page after successful authentication
            router.replace('/auth');
        }, 5000); // Redirect after 2 seconds
    }, []);

    return (
        <div className="flex items-center justify-center h-screen text-2xl font-bold">
            Authentication Failed..! Redirecting...
        </div>
    )
}
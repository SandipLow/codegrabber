'use client';

import { account, databases } from '@/lib/appwrite';
import useAuth from '@/stores/use-auth';
import { Permission, Role } from 'appwrite';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

export default function Page() {
    const router = useRouter();
    const { fetchUser } = useAuth();

    useEffect(() => {
        const completeOAuth = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const userId = params.get('userId');
                const secret = params.get('secret');

                if (!userId || !secret) {
                    console.error('Invalid OAuth callback parameters');
                    router.replace('/auth/failure');
                    return;
                }

                await account.createSession(userId, secret);
                const sessionUser = await account.get();

                await databases.upsertDocument(
                    'main',
                    'users',
                    userId,
                    {
                        username: sessionUser.name || '',
                        email: sessionUser.email,
                        profilePicture: sessionUser.prefs?.profilePicture || '',
                        bio: sessionUser.prefs?.bio || '',
                    },
                    [
                        Permission.read(Role.any()),
                        Permission.update(Role.user(userId)),
                        Permission.delete(Role.user(userId)),
                        Permission.write(Role.user(userId)),
                    ]
                );

                await fetchUser(); // now hydrate store with full user
                router.replace('/'); // redirect to home or dashboard

            } catch (err) {
                console.error('OAuth callback error:', err);
                router.replace('/auth/failure');
            }
        };

        completeOAuth();
    }, []);

    return (
        <div className="flex items-center justify-center h-screen text-2xl font-bold">
            Authentication Successful..! Redirecting...
        </div>
    )
}

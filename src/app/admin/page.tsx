'use client';

import useAuth from '@/stores/use-auth';
import { motion } from 'framer-motion';
import { User, Edit, Save, Mail, LogOut, Image } from 'lucide-react';
import React, { useState } from 'react'

export default function Page() {
    const { user, error, logout, updateUser } = useAuth();
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [bio, setBio] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        try {
            await updateUser({ username, profilePicture, bio });
            setEditMode(false);
        } catch (err) {
            setFormError(err instanceof Error ? err.message : 'Update failed');
        }
    };

    const toggleEditMode = () => {
        if (!user) return;
        setEditMode(!editMode);
        setUsername(user.username);
        setProfilePicture(user.profilePicture || '');
        setBio(user.bio || '');
        setFormError(null);
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-3xl font-bebas-neue text-gray-900 dark:text-gray-200 mb-6">Please log in to access your account settings</h1>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.href = '/auth'}
                    className="p-2 bg-blue-600 dark:bg-blue-400 text-white dark:text-gray-900 rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                >
                    Log In
                </motion.button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h1 className="text-3xl font-bebas-neue text-gray-900 dark:text-gray-200 mb-6 text-center">
                Account Settings
            </h1>
            {error && (
                <p className="text-red-500 dark:text-red-400 text-center mb-4" aria-live="assertive">
                    {error}
                </p>
            )}
            <div className="flex flex-col items-center mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={user.profilePicture || '/Assets/placeholder-user.jpg'}
                    alt={`${user.username}'s profile`}
                    className="w-24 h-24 rounded-full object-cover mb-4"
                />
                {editMode ? (
                    <form onSubmit={handleUpdate} className="w-full space-y-4">
                        <div>
                            <label htmlFor="username" className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                                <User className="w-4 h-4 mr-1" /> Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="profilePicture" className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                                <Image className="w-4 h-4 mr-1" /> Profile Picture URL
                            </label>
                            <input
                                id="profilePicture"
                                type="url"
                                value={profilePicture}
                                onChange={(e) => setProfilePicture(e.target.value)}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                            />
                        </div>
                        <div>
                            <label htmlFor="bio" className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                                <Edit className="w-4 h-4 mr-1" /> Bio
                            </label>
                            <textarea
                                id="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                                rows={4}
                            />
                        </div>
                        {formError && (
                            <p className="text-red-500 dark:text-red-400 text-center" aria-live="assertive">
                                {formError}
                            </p>
                        )}
                        <div className="flex space-x-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                className="flex-1 p-2 bg-blue-600 dark:bg-blue-400 text-white dark:text-gray-900 rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 flex items-center justify-center"
                                aria-label="Save changes"
                            >
                                <Save className="w-4 h-4 mr-2" /> Save
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={toggleEditMode}
                                className="flex-1 p-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
                                aria-label="Cancel"
                            >
                                Cancel
                            </motion.button>
                        </div>
                    </form>
                ) : (
                    <div className="w-full space-y-4 text-center">
                        <p className="text-lg font-roboto-flex text-gray-900 dark:text-gray-200">
                            <User className="w-4 h-4 inline mr-1" /> {user.username}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            <Mail className="w-4 h-4 inline mr-1" /> {user.email}
                        </p>
                        {user.bio && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 font-roboto-flex">
                                <Edit className="w-4 h-4 inline mr-1" /> {user.bio}
                            </p>
                        )}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleEditMode}
                            className="p-2 bg-blue-600 dark:bg-blue-400 text-white dark:text-gray-900 rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 flex items-center justify-center mx-auto"
                            aria-label="Edit profile"
                        >
                            <Edit className="w-4 h-4 mr-2" /> Edit Profile
                        </motion.button>
                    </div>
                )}
            </div>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="w-full p-2 bg-red-600 dark:bg-red-400 text-white dark:text-gray-900 rounded-md hover:bg-red-700 dark:hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-400 flex items-center justify-center"
                aria-label="Log out"
            >
                <LogOut className="w-4 h-4 mr-2" /> Log Out
            </motion.button>
        </div>
    )
}

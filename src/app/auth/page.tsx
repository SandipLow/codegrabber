'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, User, Mail, Image, Edit, LogOut, Save } from 'lucide-react';
import useAuth from '@/stores/use-auth';

export default function AuthPage() {
    const { user, loading, error, signIn, signUp, logout, updateUser } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [bio, setBio] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        try {
            await signIn(email, password);
            setEmail('');
            setPassword('');
        } catch (err) {
            setFormError(err instanceof Error ? err.message : 'Sign-in failed');
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        try {
            await signUp(email, password, username, profilePicture, bio);
            setEmail('');
            setPassword('');
            setUsername('');
            setProfilePicture('');
            setBio('');
            setIsSignUp(false);
        } catch (err) {
            setFormError(err instanceof Error ? err.message : 'Sign-up failed');
        }
    };

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

    return (
        <main className="bg-gray-100 dark:bg-gray-900 py-16 px-4 my-12 sm:px-6 md:px-8 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-6 sm:p-8"
            >
                {loading ? (
                    <div className="space-y-4" aria-live="polite">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto animate-pulse"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                    </div>
                ) : user ? (
                    <>
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
                    </>
                ) : (
                    <>
                        <h1 className="text-3xl font-bebas-neue text-gray-900 dark:text-gray-200 mb-6 text-center">
                            {isSignUp ? 'Sign Up' : 'Sign In'}
                        </h1>
                        {error && (
                            <p className="text-red-500 dark:text-red-400 text-center mb-4" aria-live="assertive">
                                {error}
                            </p>
                        )}
                        <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
                            {isSignUp && (
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
                            )}
                            <div>
                                <label htmlFor="email" className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    <Mail className="w-4 h-4 mr-1" /> Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    <LogIn className="w-4 h-4 mr-1" /> Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                                    required
                                />
                            </div>
                            {isSignUp && (
                                <>
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
                                </>
                            )}
                            {formError && (
                                <p className="text-red-500 dark:text-red-400 text-center" aria-live="assertive">
                                    {formError}
                                </p>
                            )}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                className="w-full p-2 bg-blue-600 dark:bg-blue-400 text-white dark:text-gray-900 rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 flex items-center justify-center"
                                aria-label={isSignUp ? 'Sign up' : 'Sign in'}
                            >
                                {isSignUp ? (
                                    <>
                                        <UserPlus className="w-4 h-4 mr-2" /> Sign Up
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="w-4 h-4 mr-2" /> Sign In
                                    </>
                                )}
                            </motion.button>
                        </form>
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                            {isSignUp ? 'Already have an account?' : 'No account?'}{' '}
                            <button
                                onClick={() => {
                                    setIsSignUp(!isSignUp);
                                    setFormError(null);
                                }
                                }
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                                aria-label={isSignUp ? 'Switch to sign in' : 'Switch to sign up'}
                            >
                                {isSignUp ? 'Sign In' : 'Sign Up'}
                            </button>
                        </p>
                    </>
                )}
            </motion.div>
        </main>
    );
}
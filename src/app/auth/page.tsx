'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, User, Mail, Image, Edit, LogOut, Save } from 'lucide-react';
import useAuth from '@/stores/use-auth';

export default function AuthPage() {
    const { user, loading, error, signIn, signUp, logout, updateUser, googleSignIn } = useAuth();
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
                            {' or '}
                            <button
                                onClick={googleSignIn}
                                className="block mt-2 bg-blue-600 dark:bg-blue-400 hover:bg-blue-700 dark:hover:bg-blue-300 text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                                aria-label="Sign in with Google"
                            >
                                <img src="data:image/png;base64,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" className='h-12 p-2 rounded-full inline-block' /> 
                                Sign in with Google
                            </button>
                        </p>
                    </>
                )}
            </motion.div>
        </main>
    );
}
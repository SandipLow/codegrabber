'use client';

import useAuth from '@/stores/use-auth';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, Loader2, Sun, Moon } from 'lucide-react';
import useTheme from '@/stores/use-theme';

export default function Navbar() {
    const router = useRouter();
    const { user, fetchUser } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const {theme, toggleTheme} = useTheme();

    // Fetch user data on component mount
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    // set theme
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }, []);

    const handleSearch = async (value: string) => {
        setIsSearching(true);
        await router.push(`/blogs?q=${encodeURIComponent(value)}`);
        setIsSearching(false);
    };

    return (
        <nav className="w-full fixed top-0 left-0 bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-md z-50 shadow-lg">
            <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 md:px-8">
                {/* Left side: Logo */}
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="w-10 h-10 relative"
                >
                    <Image
                        src="/manifest/code_grabber.svg"
                        alt="Code Grabber Logo"
                        layout="fill"
                        objectFit="contain"
                        objectPosition="center"
                        loading="eager"
                    />
                </motion.div>

                {/* Hamburger Menu for Mobile */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="md:hidden text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                    aria-expanded={isMenuOpen}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.button>

                {/* Links and Search */}
                <motion.div
                    className="hidden md:flex md:flex-row items-center md:space-x-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Links */}
                    <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 font-roboto-flex text-blue-600 dark:text-blue-400">
                        <motion.li whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                            <Link
                                href="/"
                                className="block px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                            >
                                Home
                            </Link>
                        </motion.li>
                        <motion.li whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                            <Link
                                href="/blogs"
                                className="block px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                            >
                                Blogs
                            </Link>
                        </motion.li>
                        <motion.li whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                            <Link
                                href={user ? '/admin' : '/auth'}
                                className="block px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                            >
                                {user ? 'Admin' : 'Log in'}
                            </Link>
                        </motion.li>
                    </ul>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-64 mt-2 md:mt-0">
                        <input
                            type="text"
                            placeholder="Search blogs here..."
                            className="w-full px-4 py-2 pl-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 transition-all duration-300"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch((e.target as HTMLInputElement).value);
                                }
                            }}
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" size={18} />
                        {isSearching && (
                            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin text-blue-600 dark:text-blue-400" size={18} />
                        )}
                    </div>

                    {/* Theme Toggle */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleTheme}
                        className="p-2 mt-2 md:mt-0 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </motion.button>
                </motion.div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden flex flex-col items-center absolute top-16 left-0 w-full bg-white dark:bg-gray-900 p-4"
                        >
                            {/* Links */}
                            <ul className="flex flex-col space-y-2 font-roboto-flex text-blue-600 dark:text-blue-400 w-full">
                                <motion.li whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                                    <Link
                                        href="/"
                                        className="block px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Home
                                    </Link>
                                </motion.li>
                                <motion.li whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                                    <Link
                                        href="/blogs"
                                        className="block px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Blogs
                                    </Link>
                                </motion.li>
                                <motion.li whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                                    <Link
                                        href={user ? '/admin' : '/auth'}
                                        className="block px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {user ? 'Admin' : 'Log in'}
                                    </Link>
                                </motion.li>
                            </ul>

                            {/* Search Bar */}
                            <div className="relative w-full mt-2">
                                <input
                                    type="text"
                                    placeholder="Search blogs here..."
                                    className="w-full px-4 py-2 pl-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 transition-all duration-300"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearch((e.target as HTMLInputElement).value);
                                            setIsMenuOpen(false);
                                        }
                                    }}
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" size={18} />
                                {isSearching && (
                                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin text-blue-600 dark:text-blue-400" size={18} />
                                )}
                            </div>

                            {/* Theme Toggle */}
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleTheme}
                                className="p-2 mt-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                            >
                                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}
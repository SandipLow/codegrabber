'use client';

import { motion } from "framer-motion";
import { Variants } from "framer-motion/dom";
import { Twitter, Github, Linkedin, MessageCircle } from "lucide-react";

export default function Footer() {
    // Animation variants
    const footerVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.3 },
        },
    };

    const footerChildVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return <footer className="bg-gray-100 dark:bg-gray-950 text-gray-200 dark:text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            {/* Divider with Title */}
            <motion.div
                className="flex flex-col sm:flex-row justify-between items-center mb-10"
                initial="hidden"
                whileInView="visible"
                variants={footerVariants}
                viewport={{ once: true }}
            >
                <div className="bg-gradient-to-r from-transparent via-gray-700 dark:via-gray-600 to-transparent h-px flex-grow mb-4 sm:mb-0 sm:mr-6"></div>
                <motion.div className="text-center" variants={footerChildVariants}>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bebas-neue text-blue-600 dark:text-blue-400 font-bold">
                        Code Grabber
                    </h1>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 font-roboto-flex">
                        © 2021-2025
                    </p>
                </motion.div>
                <div className="bg-gradient-to-r from-transparent via-gray-700 dark:via-gray-600 to-transparent h-px flex-grow mt-4 sm:mt-0 sm:ml-6"></div>
            </motion.div>

            {/* Slogan */}
            <motion.p
                className="text-center text-gray-800 dark:text-gray-400 mb-10 font-roboto-flex text-base sm:text-lg"
                variants={footerChildVariants}
            >
                Code snippets for the coders, from the coders. Share code snippets and blogs.
            </motion.p>

            {/* Links Section */}
            <motion.nav
                className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10 justify-items-center"
                variants={footerChildVariants}
            >
                <motion.a
                    href="/privacy"
                    className="text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-400 hover:text-white dark:hover:text-gray-900 font-roboto-flex px-4 py-2 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 w-full sm:w-auto text-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Privacy Policy"
                >
                    Privacy Policy
                </motion.a>
                <motion.a
                    href="/terms"
                    className="text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-400 hover:text-white dark:hover:text-gray-900 font-roboto-flex px-4 py-2 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 w-full sm:w-auto text-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Terms of Service"
                >
                    Terms of Service
                </motion.a>
                <motion.a
                    href="/contact"
                    className="text-blue-600 dark:text-blue-400 hover:bg-blue-600 dark:hover:bg-blue-400 hover:text-white dark:hover:text-gray-900 font-roboto-flex px-4 py-2 rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 w-full sm:w-auto text-center"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Contact"
                >
                    Contact
                </motion.a>
            </motion.nav>

            {/* Social Media Icons */}
            <motion.div
                className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6"
                variants={footerChildVariants}
            >
                <motion.a
                    href="https://twitter.com/codegrabber"
                    aria-label="Twitter"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Twitter className="w-6 h-6" />
                </motion.a>
                <motion.a
                    href="https://github.com/codegrabber"
                    aria-label="GitHub"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Github className="w-6 h-6" />
                </motion.a>
                <motion.a
                    href="https://linkedin.com/company/codegrabber"
                    aria-label="LinkedIn"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Linkedin className="w-6 h-6" />
                </motion.a>
                <motion.a
                    href="https://discord.gg/codegrabber"
                    aria-label="Discord"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <MessageCircle className="w-6 h-6" />
                </motion.a>
            </motion.div>
        </div>
    </footer>;
}
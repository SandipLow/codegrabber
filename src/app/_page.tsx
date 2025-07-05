'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Upload, FileText, ArrowRight } from 'lucide-react';

const Page = () => {
    // Animation variants
    const heroVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.2 },
        },
    };
    
    const heroChildVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };
    
    const featureVariants: Variants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, ease: 'easeOut' },
        },
    };
    
    return (
        <>
            {/* Hero Section */}
            <section id="Home" className="bg-gray-100 dark:bg-gray-900 min-h-screen relative">
                <div className="w-full h-screen relative">
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-800/50 to-gray-800/30 z-10" />
    
                    {/* Background Image */}
                    <Image
                        src="/Assets/code_bg_01.bmp"
                        alt="Coding background with abstract tech patterns"
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover"
                        onError={() => console.error('Failed to load hero image')}
                    />
    
                    {/* Content */}
                    <motion.div
                        className="w-full absolute top-1/3 bottom-8 z-20 flex flex-col items-center px-4 sm:px-6 md:px-8"
                        initial="hidden"
                        animate="visible"
                        variants={heroVariants}
                    >
                        <motion.h1
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center font-bebas-neue text-gray-100"
                            variants={heroChildVariants}
                        >
                            <span className="p-2">Welcome to</span>
                            <span className="bg-blue-600 dark:bg-blue-400 text-white dark:text-gray-900 px-4 py-2 rounded-md shadow-lg mx-1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                                Code
                            </span>
                            <span className="text-blue-600 dark:text-blue-400 px-4 py-2 rounded-md shadow-lg mx-1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                                Grabber
                            </span>
                        </motion.h1>
                        <motion.div
                            className="mt-6 flex justify-center max-w-lg px-4"
                            variants={heroChildVariants}
                        >
                            <p className="bg-blue-600/30 dark:bg-blue-400/30 text-gray-100 p-4 rounded-md shadow-md text-base sm:text-lg">
                                Code snippets for the coders, from the coders. Share code snippets, blogs, and much more.
                            </p>
                        </motion.div>
                        <motion.div variants={heroChildVariants}>
                            <Link
                                href="/blogs"
                                className="mt-6 px-6 py-3 bg-blue-600 dark:bg-blue-400 text-gray-900 rounded-full shadow-lg hover:bg-blue-700 dark:hover:bg-blue-500 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 flex items-center space-x-2"
                                aria-label="Explore blogs"
                            >
                                <span>Explore Blogs</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
    
            {/* Features Section */}
            <section className="bg-gray-100 dark:bg-gray-900 py-16">
                <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 md:px-8">
                    <motion.h1
                        className="font-bebas-neue text-3xl sm:text-4xl md:text-5xl text-blue-600 dark:text-blue-400 mb-6"
                        initial="hidden"
                        whileInView="visible"
                        variants={heroVariants}
                        viewport={{ once: true }}
                    >
                        Core Features
                    </motion.h1>
                    <hr className="border-blue-600 dark:border-blue-400 w-24 mx-auto mb-8" />
    
                    {/* Feature 1 */}
                    <motion.div
                        className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center mb-12 sm:mb-16"
                        initial="hidden"
                        whileInView="visible"
                        variants={featureVariants}
                        viewport={{ once: true }}
                    >
                        <motion.div
                            className="rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                        >
                            <Image
                                src="/Assets/upload.webp"
                                alt="Upload assets with online asset manager"
                                width={400}
                                height={500}
                                className="object-cover w-full aspect-[4/3]"
                                sizes="(max-width: 768px) 100vw, 400px"
                            />
                        </motion.div>
                        <div className="text-left">
                            <h2 className="font-roboto-flex font-bold text-xl sm:text-2xl md:text-3xl text-gray-900 dark:text-gray-200 mb-4 flex items-center space-x-2">
                                <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                <span>Built-in Online Asset Manager</span>
                            </h2>
                            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
                                Manage assets and images for your blog with our built-in asset manager. Get free storage up to 1GB, making it easier to keep your blog organized.
                            </p>
                        </div>
                    </motion.div>
    
                    {/* Feature 2 */}
                    <motion.div
                        className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center"
                        initial="hidden"
                        whileInView="visible"
                        variants={featureVariants}
                        viewport={{ once: true }}
                    >
                        <div className="text-left order-2 md:order-1">
                            <h2 className="font-roboto-flex font-bold text-xl sm:text-2xl md:text-3xl text-gray-900 dark:text-gray-200 mb-4 flex items-center space-x-2">
                                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                <span>Markdown Support for Writing Blogs</span>
                            </h2>
                            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
                                Write blogs in markdown and get them converted to HTML on the fly. No need to worry about learning HTML, just focus on your content.
                            </p>
                        </div>
                        <motion.div
                            className="rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 order-1 md:order-2 hover:shadow-xl transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                        >
                            <Image
                                src="/Assets/markdown_support.png"
                                alt="Markdown support for blog writing"
                                width={500}
                                height={400}
                                className="object-cover w-full aspect-[4/3]"
                                sizes="(max-width: 768px) 100vw, 500px"
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </>
    );
}


export default Page;
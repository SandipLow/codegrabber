'use client';

import { databases } from "@/lib/appwrite";
import { Models, Query } from "appwrite";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, Share2, X, Facebook, MessageCircle, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";

export default function BlogsPage() {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<BlogPostData[]>([]);
    const [error, setError] = useState<unknown>(null);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [shareOpen, setShareOpen] = useState<string | null>(null);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastBlogRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(
                entries => {
                    if (entries[0].isIntersecting && hasMore) {
                        setTimeout(() => {
                            setPage(prev => prev + 1);
                        }, 300);
                    }
                },
                { threshold: 0.1 }
            );
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const res = await databases.listDocuments<Models.Document>(
                    "main",
                    "blogposts",
                    [
                        Query.orderDesc("$createdAt"),
                        Query.limit(10),
                        Query.offset(page * 10),
                    ]
                );

                const normalized = res.documents.map(doc => ({
                    id: doc.$id,
                    createdAt: new Date(doc.$createdAt),
                    updatedAt: new Date(doc.$updatedAt),
                    title: doc.title,
                    description: doc.description,
                    content: doc.content,
                    tags: doc.tags,
                    coverImage: doc.coverImage,
                    slug: doc.slug,
                    author: doc.user,
                } as BlogPostData));

                setBlogs(prev => {
                    const set = new Set(prev.map(post => post.id));
                    const newPosts = normalized.filter(post => !set.has(post.id));
                    return [...prev, ...newPosts];
                });
                setHasMore(res.documents.length === 10);
            } catch (err) {
                console.error("Error fetching blogs:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [page]);

    const handleShare = async (post: BlogPostData) => {
        const shareUrl = `${window.location.origin}/blog/${post.slug}`;
        const shareText = `${post.title} - Check out this blog post!`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    text: shareText,
                    url: shareUrl,
                });
            } catch (err) {
                console.error("Error using Web Share API:", err);
            }
        } else {
            setShareOpen(post.id);
        }
    };

    const shareLinks = (post: BlogPostData) => {
        const shareUrl = encodeURIComponent(`${window.location.origin}/blogs/${post.slug}`);
        const shareText = encodeURIComponent(`${post.title} - Check out this blog post!`);
        return [
            { name: "WhatsApp", icon: MessageCircle, url: `https://wa.me/?text=${shareText}%20${shareUrl}` },
            { name: "Telegram", icon: MessageCircle, url: `https://t.me/share/url?url=${shareUrl}&text=${shareText}` },
            { name: "Facebook", icon: Facebook, url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` },
            { name: "Twitter", icon: Twitter, url: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}` },
            { name: "LinkedIn", icon: Linkedin, url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}` },
        ];
    };

    return (
        <div className="max-w-4xl mx-auto py-16 px-6 sm:px-8">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-extrabold tracking-tight mt-12 text-gray-900 dark:text-white mb-12"
            >
                Blog Posts
            </motion.h1>
            {error ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-red-500 dark:text-red-400"
                    aria-live="assertive"
                >
                    Failed to load posts. Please try again later.
                </motion.div>
            ) : null}
            <div className="space-y-8">
                <AnimatePresence>
                    {blogs.map((post, i) => (
                        <motion.article
                            key={post.id}
                            ref={i === blogs.length - 1 ? lastBlogRef : null}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="relative p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <Link href={`/blogs/${post.slug}`} className="block">
                                {post.coverImage && (
                                    <motion.img
                                        src={post.coverImage}
                                        alt={`${post.title} cover`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                        className="w-full h-48 sm:h-64 object-cover rounded-md mb-4"
                                    />
                                )}
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">{post.title}</h2>
                                <p className="text-gray-600 dark:text-gray-400 line-clamp-3">{post.description}</p>
                                <div className="mt-4 flex items-center space-x-4">
                                    <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <User className="w-4 h-4 mr-1" /> {post.author?.username || "Unknown Author"}
                                    </span>
                                    <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <Calendar className="w-4 h-4 mr-1" /> {post.createdAt.toLocaleDateString()}
                                    </span>
                                    <div className="flex space-x-2">
                                        {post.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 rounded-full px-2 py-1"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </Link>
                            <button
                                onClick={() => handleShare(post)}
                                className="absolute top-4 right-4 p-2 bg-white rounded-full text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                                aria-label={`Share ${post.title}`}
                            >
                                <Share2 className="w-5 h-5" />
                            </button>
                            {shareOpen === post.id && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="absolute top-12 right-4 p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10"
                                >
                                    <button
                                        onClick={() => setShareOpen(null)}
                                        className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                                        aria-label="Close share menu"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <div className="flex flex-col space-y-2">
                                        {shareLinks(post).map(link => (
                                            <Link
                                                key={link.name}
                                                href={link.url}
                                                className="flex items-center space-x-2 p-1 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                                            >
                                                <link.icon className="w-4 h-4" />
                                                <span>{link.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </motion.article>
                    ))}
                </AnimatePresence>
                {loading && (
                    <div className="space-y-8" aria-live="polite">
                        {[...Array(3)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md bg-white dark:bg-gray-800 animate-pulse"
                            >
                                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                            </motion.div>
                        ))}
                    </div>
                )}
                {!hasMore && !loading && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-gray-500 dark:text-gray-400"
                    >
                        No more posts to show.
                    </motion.p>
                )}
            </div>
        </div>
    );
}
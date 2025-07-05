'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, User, Share2, X, Facebook, MessageCircle, Twitter, Linkedin, Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula, materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import useTheme from '@/stores/use-theme';

type BlogPostProps = {
  post: BlogPostData;
};

export default function BlogPageClient({ post }: BlogPostProps) {
    const { theme } = useTheme();
    const [shareOpen, setShareOpen] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}/blog/${post.slug}`;
        const shareText = `${post.title} - Check out this blog post!`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    text: shareText,
                    url: shareUrl,
                });
            } catch {
                setShareOpen(true);
            }
        } else {
            setShareOpen(true);
        }
    };

    const handleCopy = (code: string, id: string) => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(id);
            setTimeout(() => setCopied(null), 2000);
        });
    };

    const shareLinks = () => {
        const shareUrl = encodeURIComponent(`${window.location.origin}/blog/${post.slug}`);
        const shareText = encodeURIComponent(`${post.title} - Check out this blog post!`);
        return [
            { name: 'WhatsApp', icon: MessageCircle, url: `https://wa.me/?text=${shareText}%20${shareUrl}` },
            { name: 'Telegram', icon: MessageCircle, url: `https://t.me/share/url?url=${shareUrl}&text=${shareText}` },
            { name: 'Facebook', icon: Facebook, url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` },
            { name: 'Twitter', icon: Twitter, url: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}` },
            { name: 'LinkedIn', icon: Linkedin, url: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}` },
        ];
    };

    return (
        <main className="py-16 px-4 sm:px-6 md:px-8">
            <div className="max-w-6xl mx-auto mt-12">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6"
                >
                    <Link
                        href="/blogs"
                        className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                        aria-label="Back to blogs"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Blogs
                    </Link>
                </motion.div>
                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-6 sm:p-8"
                >
                    {post.coverImage && (
                        <motion.img
                            src={post.coverImage}
                            alt={`${post.title} cover`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-md mb-6"
                        />
                    )}
                    <h1 className="text-3xl sm:text-4xl font-bebas-neue text-gray-900 dark:text-gray-200 mb-4">
                        {post.title}
                    </h1>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-6">
                        <Link href={"/profile/"+post.author?.id} className="flex items-center text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                            <User className="w-4 h-4 mr-1" /> {post.author?.username || 'Unknown Author'}
                        </Link>
                        <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4 mr-1" /> {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
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
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({ ...props }) => (
                                <h1 className="text-2xl font-bebas-neue mt-6 mb-4" {...props} />
                            ),
                            h2: ({ ...props }) => (
                                <h2 className="text-xl font-bebas-neue mt-5 mb-3" {...props} />
                            ),
                            p: ({ ...props }) => (
                                <p className="text-base font-roboto-flex mb-4" {...props} />
                            ),
                            ul: ({ ...props }) => (
                                <ul className="list-disc list-inside mb-4" {...props} />
                            ),
                            ol: ({ ...props }) => (
                                <ol className="list-decimal list-inside mb-4" {...props} />
                            ),
                            code: ({ className, children, ...props }) => {
                                const match = /language-(\w+)/.exec(className || '');
                                return match ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="relative my-4"
                                    >
                                        <SyntaxHighlighter
                                            style={theme === 'dark' ? dracula : materialLight}
                                            language={match[1]}
                                            PreTag="pre"
                                            customStyle={{
                                                margin: 0,
                                                borderRadius: '0.375rem',
                                            }}
                                            className="text-sm"
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleCopy(String(children), post.id)}
                                            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                                            aria-label="Copy code"
                                        >
                                            {copied === post.id ? (
                                                <span className="text-xs text-green-500 dark:text-green-400">Copied!</span>
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </motion.button>
                                    </motion.div>
                                ) : (
                                    <code
                                        className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded px-1 py-0.5"
                                        {...props}
                                    >
                                        {children}
                                    </code>
                                );
                            },
                            table: ({ ...props }) => (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-x-auto my-4"
                                >
                                    <table
                                        className="w-full border-collapse border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                                        role="table"
                                        {...props}
                                    />
                                </motion.div>
                            ),
                            thead: ({ ...props }) => (
                                <thead className="bg-gray-100 dark:bg-gray-700" {...props} />
                            ),
                            tbody: ({ ...props }) => <tbody {...props} />,
                            tr: ({ ...props }) => (
                                <tr
                                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    {...props}
                                />
                            ),
                            th: ({ ...props }) => (
                                <th
                                    className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-gray-900 dark:text-gray-200 font-medium"
                                    {...props}
                                />
                            ),
                            td: ({ ...props }) => (
                                <td
                                    className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-gray-200"
                                    {...props}
                                />
                            ),
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleShare}
                        className="mt-6 p-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                        aria-label={`Share ${post.title}`}
                    >
                        <Share2 className="w-6 h-6" />
                    </motion.button>
                    <AnimatePresence>
                        {shareOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="fixed bottom-4 right-4 p-6 sm:bottom-8 sm:right-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50"
                            >
                                <button
                                    onClick={() => setShareOpen(false)}
                                    className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                                    aria-label="Close share menu"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="flex flex-col space-y-2">
                                    {shareLinks().map(link => (
                                        <a
                                            key={link.name}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center space-x-2 p-1 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                        >
                                            <link.icon className="w-4 h-4" />
                                            <span>{link.name}</span>
                                        </a>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.article>
            </div>
        </main>
    );
}
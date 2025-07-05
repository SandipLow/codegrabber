'use client';

import React, { useEffect, useState } from 'react';
import { ID, databases } from '@/lib/appwrite';
import { useRouter, useSearchParams } from 'next/navigation';
import { Pen, FileText, Tag, Image, Save } from 'lucide-react';
import Editor from 'react-simple-code-editor';
import { Highlight, themes } from 'prism-react-renderer';
import 'prismjs';
import 'prismjs/components/prism-markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import useAuth from '@/stores/use-auth';
import useTheme from '@/stores/use-theme';
import { motion } from 'framer-motion';
import TagInput from '@/components/tag-input';
import { Permission, Query, Role } from 'appwrite';

type BlogPostData = {
    title: string;
    description: string;
    content: string;
    tags: string[];
    coverImage: string;
    slug: string;
    createdAt?: string;
    updatedAt?: string;
    authorId?: string;
};

const DATABASE_ID = 'main';
const COLLECTION_ID = 'blogposts';

export default function CreateBlogPage() {
    const { user } = useAuth();
    const { theme } = useTheme();
    const editSlug = useSearchParams().get('edit');
    const [postId, setPostId] = useState<string | null>(null);
    const [blogPost, setBlogPost] = useState<Partial<BlogPostData>>({
        title: '',
        description: '',
        content: '',
        tags: [],
        coverImage: '',
        slug: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    
    useEffect(() => {
        if (!editSlug) return;

        const fetchPost = async () => {
            setLoading(true);
            try {
                const response = await databases.listDocuments(
                    DATABASE_ID, 
                    COLLECTION_ID, [
                        Query.equal('slug', editSlug),
                    ]
                );

                if (response.documents.length === 0) {
                    setError('No blog post found with this slug.');
                    return;
                }

                const post = response.documents[0];
                setBlogPost({
                    title: post.title,
                    description: post.description,
                    content: post.content,
                    tags: post.tags || [],
                    coverImage: post.coverImage || '',
                    slug: post.slug,
                });
                setPostId(post.$id);
            } catch (err: unknown) {
                console.error(err);
                setError(err instanceof Error ? err.message : 'Failed to fetch blog post.');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();

    }, [editSlug]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const { title, description, content, slug, tags } = blogPost;

        if (!title || !description || !content || !slug) {
            setError('Please fill out all required fields.');
            return;
        }

        if (!user) {
            setError('You must be logged in to create a post.');
            return;
        }

        setLoading(true);

        try {
            const postId = ID.unique();
            await databases.createDocument(DATABASE_ID, COLLECTION_ID, postId, {
                ...blogPost,
                tags: tags || [],
                user: user.id,
            }, [
                Permission.read(Role.any()),
                Permission.update(Role.user(user.id)),
                Permission.delete(Role.user(user.id)),
                Permission.write(Role.user(user.id)),
            ]);

            setPostId(postId);
        } catch (err: unknown) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Failed to create blog post.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async () => {
        setError(null);

        const { title, description, content, slug, tags } = blogPost;
        
        if (!postId) {
            setError('No post ID found for editing.');
            return;
        }

        if (!title || !description || !content || !slug) {
            setError('Please fill out all required fields.');
            return;
        }

        if (!user) {
            setError('You must be logged in to create a post.');
            return;
        }

        setLoading(true);
        try {
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                postId,
                {
                    ...blogPost,
                    tags: tags || [],
                },
            );
        } catch (err: unknown) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Failed to update blog post.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="px-4 sm:px-6 md:px-8">
            <div className="mx-auto">
                <h1 className="text-3xl font-bebas-neue text-gray-900 dark:text-gray-200 mb-8 text-center">
                    Create New Blog Post
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <p
                            className="text-red-600 dark:text-red-400 text-center font-roboto-flex"
                            aria-live="assertive"
                        >
                            {error}
                        </p>
                    )}

                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-6">
                        <div className="flex flex-col md:flex-row md:space-x-6">
                            {/* Markdown Editor */}
                            <div className="flex-1 mb-6 md:mb-0 md:w-1/2">
                                <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 font-roboto-flex">
                                    <FileText className="w-4 h-4 mr-2" /> Content *
                                </label>
                                <Editor
                                    value={blogPost.content || ''}
                                    onValueChange={(content) => setBlogPost({ ...blogPost, content })}
                                    highlight={(code) => (
                                        <Highlight
                                            code={code}
                                            language="markdown"
                                            theme={theme === 'dark' ? themes.gruvboxMaterialDark : themes.gruvboxMaterialLight}
                                        >
                                            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                                                <pre className={className} style={{ ...style, backgroundColor: 'transparent', padding: 0 }}>
                                                    {tokens.map((line, i) => (
                                                        <div key={i} {...getLineProps({ line })} style={{ whiteSpace: 'pre-wrap' }}>
                                                            {line.map((token, key) => (
                                                                <span key={key} {...getTokenProps({ token })} />
                                                            ))}
                                                        </div>
                                                    ))}
                                                </pre>
                                            )}
                                        </Highlight>
                                    )}
                                    padding={16}
                                    className="w-full min-h-[50vh] border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 font-mono text-sm overflow-hidden"
                                    textareaClassName="outline-none w-full h-full"
                                    style={{ lineHeight: '1.5', whiteSpace: 'pre-wrap' }}
                                    aria-label="Markdown content editor"
                                    aria-describedby="content-description"
                                />
                                <p id="content-description" className="sr-only">
                                    Enter markdown content for the blog post
                                </p>
                            </div>
                            {/* Live Preview */}
                            <div className="flex-1 md:w-1/2">
                                <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 font-roboto-flex">
                                    <FileText className="w-4 h-4 mr-2" /> Preview
                                </label>
                                <div className="w-full min-h-[50vh] border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 p-4 overflow-auto">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            h1: ({ ...props }) => (
                                                <h1 className="text-2xl font-bebas-neue text-gray-900 dark:text-gray-200 mt-6 mb-4" {...props} />
                                            ),
                                            h2: ({ ...props }) => (
                                                <h2 className="text-xl font-bebas-neue text-gray-900 dark:text-gray-200 mt-5 mb-3" {...props} />
                                            ),
                                            p: ({ ...props }) => (
                                                <p className="text-base font-roboto-flex text-gray-900 dark:text-gray-200 mb-4" {...props} />
                                            ),
                                            ul: ({ ...props }) => (
                                                <ul className="list-disc list-inside text-gray-900 dark:text-gray-200 mb-4" {...props} />
                                            ),
                                            ol: ({ ...props }) => (
                                                <ol className="list-decimal list-inside text-gray-900 dark:text-gray-200 mb-4" {...props} />
                                            ),
                                            code: ({ className, children, ...props }) => {
                                                const match = /language-(\w+)/.exec(className || '');
                                                return match ? (
                                                    <SyntaxHighlighter
                                                        style={theme === 'dark' ? dracula : materialLight}
                                                        language={match[1]}
                                                        PreTag="pre"
                                                        customStyle={{
                                                            margin: 0,
                                                            borderRadius: '0.375rem',
                                                            fontSize: '0.875rem',
                                                        }}
                                                    >
                                                        {String(children).replace(/\n$/, '')}
                                                    </SyntaxHighlighter>
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
                                        {blogPost.content}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-6 space-y-4">
                        <div>
                            <label htmlFor="title" className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 font-roboto-flex">
                                <Pen className="w-4 h-4 mr-2" /> Title *
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={blogPost.title}
                                onChange={(e) => setBlogPost({ ...blogPost, title: e.target.value })}
                                required
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                                aria-label="Blog post title"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 font-roboto-flex">
                                <FileText className="w-4 h-4 mr-2" /> Description *
                            </label>
                            <textarea
                                id="description"
                                value={blogPost.description}
                                onChange={(e) => setBlogPost({ ...blogPost, description: e.target.value })}
                                required
                                rows={3}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                                aria-label="Blog post description"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="tags"
                                className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 font-roboto-flex"
                            >
                                <Tag className="w-4 h-4 mr-2" /> Tags (comma separated)
                            </label>
                            <TagInput
                                tags={blogPost.tags || []}
                                onChange={(tags) => setBlogPost({ ...blogPost, tags })}
                                placeholder="Add tags (e.g. javascript, react)"
                            />
                        </div>

                        <div>
                            <label htmlFor="coverImage" className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 font-roboto-flex">
                                <Image className="w-4 h-4 mr-2" /> Cover Image URL
                            </label>
                            <input
                                id="coverImage"
                                type="url"
                                value={blogPost.coverImage || ''}
                                onChange={(e) => setBlogPost({ ...blogPost, coverImage: e.target.value })}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                                aria-label="Blog post cover image URL"
                            />
                        </div>

                        <div>
                            <label htmlFor="slug" className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 font-roboto-flex">
                                <Pen className="w-4 h-4 mr-2" /> Slug *
                            </label>
                            <input
                                id="slug"
                                type="text"
                                value={blogPost.slug}
                                onChange={(e) => setBlogPost({ ...blogPost, slug: e.target.value })}
                                required
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                                aria-label="Blog post slug"
                            />
                        </div>
                        
                        {
                            postId ? (
                                <>
                                    <button
                                        type="button"
                                        className="w-full p-2 bg-green-600 dark:bg-green-400 text-white dark:text-gray-900 rounded-md hover:bg-green-700 dark:hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-600 dark:focus:ring-green-400 flex items-center justify-center"
                                        onClick={() => router.push(`/blogs/${blogPost.slug}`)}
                                        aria-label="View created blog post"
                                    >
                                        <FileText className="w-4 h-4 mr-2" /> View Post
                                    </button>
                                    <button
                                        type="button"
                                        className="w-full p-2 bg-blue-600 dark:bg-blue-400 text-white dark:text-gray-900 rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 flex items-center justify-center mt-2"
                                        onClick={handleEdit}
                                        aria-label="Go to manage blogs"
                                    >
                                        <Pen className="w-4 h-4 mr-2" /> Edit blog post
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full p-2 bg-blue-600 dark:bg-blue-400 text-white dark:text-gray-900 rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    aria-label="Create blog post"
                                >
                                    <Save className="w-4 h-4 mr-2" /> {loading ? 'Creating...' : 'Create Post'}
                                </button>
                            )
                        }
                    </div>
                </form>
            </div>
        </div>
    );
}
'use client';

import React, { useEffect, useState } from 'react';
import { ID, databases } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';
import { Pen, FileText, Tag, Image, Save, Loader2 } from 'lucide-react';
import useAuth from '@/stores/use-auth';
import TagInput from '@/components/tag-input';
import { Permission, Query, Role } from 'appwrite';
import Markdown from '@/components/markdown';
import CodeEditor from '@/components/code-editor';

const DATABASE_ID = 'main';
const COLLECTION_ID = 'blogposts';

export default function CreateBlogPage() {
    const { user } = useAuth();
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
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const editSlug = params.get('edit') || undefined;

        if (!editSlug) return;

        const fetchPost = async () => {
            setLoading(true);
            try {
                const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
                    Query.equal('slug', editSlug),
                ]);

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
    }, []);

    const showSuccess = (message: string) => {
        setSuccess(message);
        setTimeout(() => setSuccess(null), 3000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

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
            await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                postId,
                {
                    ...blogPost,
                    tags: tags || [],
                    user: user.id,
                },
                [
                    Permission.read(Role.any()),
                    Permission.update(Role.user(user.id)),
                    Permission.delete(Role.user(user.id)),
                    Permission.write(Role.user(user.id)),
                ]
            );

            setPostId(postId);
            showSuccess('Blog post created successfully!');
        } catch (err: unknown) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Failed to create blog post.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async () => {
        setError(null);
        setSuccess(null);

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
            setError('You must be logged in to edit a post.');
            return;
        }

        setLoading(true);
        try {
            await databases.updateDocument(DATABASE_ID, COLLECTION_ID, postId, {
                ...blogPost,
                tags: tags || [],
            });

            showSuccess('Blog post updated successfully!');
        } catch (err: unknown) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Failed to update blog post.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="px-4 sm:px-6 md:px-8">
            <div className="mx-auto">
                <h1 className="text-3xl font-bebas-neue text-gray-900 dark:text-gray-200 mb-8 text-center">
                    {postId ? 'Edit Blog Post' : 'Create New Blog Post'}
                </h1>

                <div className="space-y-6">
                    {/* Feedback */}
                    {error && (
                        <div className="text-red-600 dark:text-red-400 text-center font-roboto-flex">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="text-green-600 dark:text-green-400 text-center font-roboto-flex">
                            {success}
                        </div>
                    )}

                    {/* Markdown Editor + Preview */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 md:p-6 overflow-hidden">
                        <div className="flex flex-col md:flex-row md:space-x-6">
                            {/* Editor */}
                            <div className="flex-1 mb-6 md:mb-0 min-w-0">
                                <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 font-roboto-flex">
                                    <FileText className="w-4 h-4 mr-2" /> Content *
                                </label>
                                <CodeEditor
                                    value={blogPost.content || ''}
                                    onChange={(content) => setBlogPost({ ...blogPost, content })}
                                    language="markdown"
                                    className="w-full min-h-[50vh] border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 font-mono text-sm overflow-hidden"
                                    placeholder="Write your blog post content in markdown format..."
                                />
                            </div>

                            {/* Preview */}
                            <div className="flex-1 min-w-0">
                                <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 font-roboto-flex">
                                    <FileText className="w-4 h-4 mr-2" /> Preview
                                </label>
                                <div className="w-full min-h-[50vh] border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 p-4 overflow-auto">
                                    <Markdown content={blogPost.content || ''} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metadata Fields */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-6 space-y-4">
                        {/* Title */}
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
                                disabled={loading}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700"
                            />
                        </div>

                        {/* Description */}
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
                                disabled={loading}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700"
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 font-roboto-flex">
                                <Tag className="w-4 h-4 mr-2" /> Tags
                            </label>
                            <TagInput
                                tags={blogPost.tags || []}
                                onChange={(tags) => setBlogPost({ ...blogPost, tags })}
                                placeholder="Add tags"
                            />
                        </div>

                        {/* Cover Image */}
                        <div>
                            <label htmlFor="coverImage" className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 font-roboto-flex">
                                <Image className="w-4 h-4 mr-2" /> Cover Image URL
                            </label>
                            <input
                                id="coverImage"
                                type="url"
                                value={blogPost.coverImage || ''}
                                onChange={(e) => setBlogPost({ ...blogPost, coverImage: e.target.value })}
                                disabled={loading}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700"
                            />
                        </div>

                        {/* Slug */}
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
                                disabled={loading}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700"
                            />
                        </div>

                        {/* Submit / Edit Buttons */}
                        {postId ? (
                            <>
                                <button
                                    type="button"
                                    className="w-full p-2 bg-blue-600 dark:bg-blue-400 text-white dark:text-gray-900 rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 flex items-center justify-center mt-4"
                                    onClick={handleEdit}
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Pen className="w-4 h-4 mr-2" />}
                                    {loading ? 'Updating...' : 'Update Post'}
                                </button>
                                <button
                                    type="button"
                                    className="w-full p-2 bg-green-600 dark:bg-green-400 text-white dark:text-gray-900 rounded-md hover:bg-green-700 dark:hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-600 dark:focus:ring-green-400 flex items-center justify-center mt-2"
                                    onClick={() => router.push(`/blogs/${blogPost.slug}`)}
                                >
                                    <FileText className="w-4 h-4 mr-2" /> View Post
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full p-2 bg-blue-600 dark:bg-blue-400 text-white dark:text-gray-900 rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 flex items-center justify-center mt-4"
                            >
                                {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                {loading ? 'Creating...' : 'Create Post'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

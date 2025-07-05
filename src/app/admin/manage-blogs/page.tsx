'use client';

import { useState, useEffect } from 'react';
import { databases } from '@/lib/appwrite';
import Link from 'next/link';
import { Edit, Trash } from 'lucide-react';
import useAuth from '@/stores/use-auth';
import { Query } from 'appwrite';

type BlogPost = {
    $id: string;
    $createdAt: string;
    $updatedAt?: string;
    title: string;
    slug: string;
    description: string;
    content: string;
    tags: string[];
    coverImage: string;
    authorId: string;
};

const DATABASE_ID = 'main';
const COLLECTION_ID = 'blogposts';

export default function ManageBlogs() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) {
            setError('You must be logged in to manage blog posts.');
            setLoading(false);
            return;
        }

        const fetchPosts = async () => {
            try {
                setLoading(true);
                const response = await databases.listDocuments(
                    DATABASE_ID, 
                    COLLECTION_ID,
                    [
                        Query.equal('user', user.id),
                    ]
                );
                setPosts(response.documents as unknown as BlogPost[]);
            } catch (err: unknown) {
                console.error(err);
                setError(err instanceof Error ? err.message : 'Failed to fetch blog posts.');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [user]);

    const handleDelete = async (postId: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            setLoading(true);
            await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, postId);
            setPosts(posts.filter(post => post.$id !== postId));
        } catch (err: unknown) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Failed to delete blog post.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <p className="text-gray-900 dark:text-gray-200 font-roboto-flex">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <p className="text-red-600 dark:text-red-400 font-roboto-flex" aria-live="assertive">
                    {error}
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className="text-3xl font-bebas-neue text-gray-900 dark:text-gray-200 mb-8 text-center">
                Manage Blog Posts
            </h1>
            {posts.length === 0 ? (
                <p className="text-gray-900 dark:text-gray-200 text-center font-roboto-flex">
                    No blog posts found. <Link href="/admin/create-blog" className="text-blue-600 dark:text-blue-400 hover:underline">Create one</Link>.
                </p>
            ) : (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-x-auto">
                    <table className="w-full border-collapse" role="grid">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-gray-900 dark:text-gray-200 font-medium font-roboto-flex">
                                    Title
                                </th>
                                <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-gray-900 dark:text-gray-200 font-medium font-roboto-flex">
                                    Slug
                                </th>
                                <th className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-gray-900 dark:text-gray-200 font-medium font-roboto-flex">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map(post => (
                                <tr
                                    key={post.$id}
                                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                    <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-gray-200 font-roboto-flex">
                                        <Link
                                            href={`/blogs/${post.slug}`}
                                            className="text-blue-600 dark:text-blue-400 hover:underline"
                                            aria-label={`Edit blog post: ${post.title}`}
                                        >
                                            {post.title}
                                        </Link>
                                    </td>
                                    <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-gray-200 font-roboto-flex">
                                        {post.slug}
                                    </td>
                                    <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-gray-200 font-roboto-flex">
                                        <div className="flex space-x-2">
                                            <Link
                                                href={`/admin/create-blog?edit=${post.slug}`}
                                                className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                                                aria-label={`Edit blog post: ${post.title}`}
                                            >
                                                <Edit className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(post.$id)}
                                                className="p-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-400"
                                                aria-label={`Delete blog post: ${post.title}`}
                                            >
                                                <Trash className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
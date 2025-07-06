import Link from 'next/link';
import { User, FileText } from 'lucide-react';
import { databases } from '@/lib/appwrite';
import { notFound } from 'next/navigation';
import { Query } from 'appwrite';
import { Metadata } from 'next';


const DATABASE_ID = 'main';
const COLLECTION_ID = 'blogposts';


export async function generateMetadata({ params }: { params: Promise<{ userId: string }> }): Promise<Metadata> {
    const { userId } = await params;

    try {
        // Fetch user data
        const userResponse = await databases.getDocument(
            DATABASE_ID,
            'users',
            userId
        );

        if (!userResponse) {
            return {};
        }

        return {
            title: `${userResponse.username} | CodeGrabber`,
            description: userResponse.bio || 'No bio available.',
            openGraph: {
                title: `${userResponse.username} | CodeGrabber`,
                description: userResponse.bio || 'No bio available.',
                images: [userResponse.profilePicture || '/default-profile.png'],
            },
            twitter: {
                card: 'summary_large_image',
                title: `${userResponse.username} | CodeGrabber`,
                description: userResponse.bio || 'No bio available.',
                images: [userResponse.profilePicture || '/default-profile.png'],
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {};
    }
}


export default async function ProfilePage({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    let user: Partial<UserData> | null = null;
    let posts: BlogPostData[] = [];

    // Server-side data fetching
    try {
        // Fetch user data
        const userResponse = await databases.getDocument(
            DATABASE_ID,
            'users',
            userId
        )

        user = {
            id: userResponse.$id,
            createdAt: userResponse.$createdAt,

            username: userResponse.username,
            bio: userResponse.bio || '',
            profilePicture: userResponse.profilePicture || '',

        } as UserData;

        // Fetch blog posts by user
        const postsResponse = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [
                Query.equal('user', userId)
            ],
        )

        posts = postsResponse.documents.map((post) => ({
            id: post.$id,
            title: post.title,
            slug: post.slug,
            description: post.description,
            content: post.content,
            tags: post.tags || [],
            coverImage: post.coverImage || '',
            createdAt: new Date(post.$createdAt),
            updatedAt: new Date(post.$updatedAt),
            authorId: post.user
        }) as BlogPostData);
    } catch (error) {
        console.error(error);
        notFound();
    }

    return (
        <ClientProfile user={user} posts={posts} />
    );
}

function ClientProfile({ user, posts }: { user: Partial<UserData>; posts: BlogPostData[] }) {

    return (
        <main className="flex-grow py-16 mt-4 px-4 sm:px-6 md:px-8">
            <div className="max-w-6xl mx-auto">
                {/* User Details */}
                <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-6 mb-8">
                    <h1 className="text-3xl font-bebas-neue text-gray-900 dark:text-gray-200 mb-4 flex items-center">
                        {user.profilePicture ? (
                            <img
                                src={user.profilePicture}
                                alt={`${user.username}'s profile picture`}
                                className="w-10 h-10 rounded-full mr-4"
                            />
                        ) : (
                            <User className="w-10 h-10 text-gray-500 dark:text-gray-400 mr-2" />
                        )}
                        {user.username?? 'Unknown User'}
                    </h1>
                    {user.bio ? (
                        <p className="text-base font-roboto-flex text-gray-900 dark:text-gray-200">
                            {user.bio}
                        </p>
                    ) : (
                        <p className="text-base font-roboto-flex text-gray-600 dark:text-gray-400 italic">
                            No bio available.
                        </p>
                    )}
                </section>

                {/* Blog Posts */}
                <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bebas-neue text-gray-900 dark:text-gray-200 mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Blog Posts
                    </h2>
                    {posts.length === 0 ? (
                        <p className="text-gray-900 dark:text-gray-200 font-roboto-flex">
                            No blog posts by this author.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
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
                                            Created At
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {posts.map(post => (
                                        <tr
                                            key={post.id}
                                            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                        >
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-gray-200 font-roboto-flex">
                                                <Link
                                                    href={`/blog/${post.slug}`}
                                                    className="text-blue-600 dark:text-blue-400 hover:underline"
                                                    aria-label={`View blog post: ${post.title}`}
                                                >
                                                    {post.title}
                                                </Link>
                                            </td>
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-gray-200 font-roboto-flex">
                                                {post.slug}
                                            </td>
                                            <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-gray-200 font-roboto-flex">
                                                {new Date(post.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { notFound } from 'next/navigation';
import BlogPageClient from './_page';


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const decodedSlug = decodeURIComponent((await params).slug);

    try {
        const res = await databases.listDocuments('main', 'blogposts', [
            Query.equal('slug', decodedSlug),
        ]);

        if (res.documents.length === 0) {
            return {};
        }

        const doc = res.documents[0];

        return {
            title: doc.title + " | CodeGrabber",
            description: doc.description,
            keywords: doc.tags.join(', '),
            author: doc.user?.username,
            openGraph: {
                title: doc.title,
                description: doc.description,
                images: [doc.coverImage],
            },
            twitter: {
                card: 'summary_large_image',
                title: doc.title,
                description: doc.description,
                images: [doc.coverImage],
            },
            whatsapp: {
                title: doc.title,
                description: doc.description,
                image: doc.coverImage,
            },
            telegram: {
                title: doc.title,
                description: doc.description,
                image: doc.coverImage,
            }
        };
    } catch (err) {
        console.error('Error generating metadata:', err);
        return {};
    }
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
    const decodedSlug = decodeURIComponent((await params).slug);

    try {
        const res = await databases.listDocuments('main', 'blogposts', [
            Query.equal('slug', decodedSlug),
        ]);

        if (res.documents.length === 0) {
            return notFound();
        }

        const doc = res.documents[0];

        const post: BlogPostData = {
            id: doc.$id,
            createdAt: new Date(doc.$createdAt),
            updatedAt: new Date(doc.$updatedAt),
            title: doc.title,
            description: doc.description,
            content: doc.content,
            tags: doc.tags,
            coverImage: doc.coverImage,
            slug: doc.slug,
        };

        if (doc.user) {
            post.author = {
                id: doc.user.$id,
                username: doc.user.username,
                profilePicture: doc.user.profilePicture,
                bio: doc.user.bio,
            };
        }

        return <BlogPageClient post={post} />;
    } catch (err) {
        console.error('SSR error fetching blog post:', err);
        return notFound();
    }
}

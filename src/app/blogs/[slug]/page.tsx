import { databases } from '@/lib/appwrite';
import { Query } from 'appwrite';
import { notFound } from 'next/navigation';
import BlogPageClient from './_page';

export default async function BlogPage({ params }: { params: { slug: string } }) {
    const decodedSlug = decodeURIComponent(params.slug);

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
            author: {
                id: doc.user.$id,
                createdAt: doc.user.$createdAt,
                
                username: doc.user.username,
                bio: doc.user.bio || '',
                profilePicture: doc.user.profilePicture || '',
            },
        };

        return <BlogPageClient post={post} />;
    } catch (err) {
        console.error('SSR error fetching blog post:', err);
        return notFound();
    }
}

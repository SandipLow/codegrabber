declare global {
    type BlogPostData = {
        id: string;
        createdAt: Date;
        updatedAt: Date;

        author?: Partial<UserData>;
        title: string;
        description: string;
        content: string;
        tags: string[];
        coverImage: string;
        slug: string;
    }

    type UserData = {
        id: string;
        createdAt: string;
        updatedAt: string;
        
        username: string;
        email: string;
        profilePicture?: string;
        bio?: string;
    }
}

export {};
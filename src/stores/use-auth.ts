import { create } from 'zustand';
import { account, databases, ID } from '@/lib/appwrite';
import { Permission, Role, type Models } from 'appwrite';


type UserData = {
    id: string;
    createdAt: string;
    updatedAt: string;
    username: string;
    email: string;
    profilePicture?: string;
    bio?: string;
};

type AuthStore = {
    user: UserData | null;
    loading: boolean;
    error: string | null;
    fetchUser: () => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: UserData | null) => void;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, username: string, profilePicture? : string, bio?: string) => Promise<void>;
    updateUser: (updates: Partial<UserData>) => Promise<void>;
};

import { persist } from 'zustand/middleware';

const useAuth = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            loading: false,
            error: null,

            fetchUser: async () => {
                set({ loading: true, error: null });
                try {
                    const sessionUser = await account.get();
                    const user = {
                        id: sessionUser.$id,
                        createdAt: sessionUser.$createdAt,
                        updatedAt: sessionUser.$updatedAt,
                        username: sessionUser.name || '',
                        email: sessionUser.email || '',
                        profilePicture: sessionUser.prefs?.profilePicture || '',
                        bio: sessionUser.prefs?.bio || '',
                    }

                    set({ user, loading: false });
                } catch (err: unknown) {
                    console.error('Fetch user error:', err);
                    set({ user: null, error: err instanceof Error ? err.message : 'Error fetching user', loading: false });
                }
            },

            logout: async () => {
                try {
                    await account.deleteSession('current');
                    set({ user: null });
                } catch (err: unknown) {
                    console.error('Logout error:', err);
                }
            },

            setUser: (user) => set({ user }),

            signIn: async (email: string, password: string) => {
                set({ loading: true, error: null });
                try {
                    // Create session
                    await account.createEmailPasswordSession(email, password);

                    // Fetch user data
                    await useAuth.getState().fetchUser();

                } catch (err: unknown) {
                    console.error('SignIn error:', err);
                    set({ error: err instanceof Error ? err.message : 'SignIn failed', loading: false });
                } finally {
                    set({ loading: false });
                }
            },

            signUp: async (email, password, username, profilePicture='', bio='') => {
                set({ loading: true, error: null });
                try {
                    await account.create(
                        ID.unique(),
                        email,
                        password,
                        username
                    );

                    // Create session
                    await account.createEmailPasswordSession(email, password);
                    
                    const { $id: uid } = await account.get()
                    
                    const promises = [
                        // create user prefs
                        account.updatePrefs({
                            profilePicture,
                            bio,
                        }),

                        // store user data in database
                        databases.createDocument(
                            "main",
                            "users",
                            uid,
                            {
                                username,
                                email,
                                profilePicture,
                                bio,
                            },
                            [
                                Permission.read(Role.any()),
                                Permission.update(Role.user(uid)),
                                Permission.delete(Role.user(uid)),
                                Permission.write(Role.user(uid)),
                            ]
                        ),

                        // Fetch user data
                        useAuth.getState().fetchUser()
                    ];

                    await Promise.all(promises);

                } catch (err: unknown) {
                    console.error('Signup error:', err);
                    set({ error: err instanceof Error ? err.message : 'Signup failed' });
                } finally {
                    set({ loading: false });
                }
            },

            updateUser: async (updates: Partial<UserData>) => {
                set({ loading: true, error: null });
                try {
                    const currentUser = useAuth.getState().user;
                    if (!currentUser) throw new Error('No user logged in');

                    // Update account preferences
                    await account.updatePrefs({
                        profilePicture: updates.profilePicture || currentUser.profilePicture,
                        bio: updates.bio || currentUser.bio,
                    });

                    const updatedUser: Models.Document = await databases.upsertDocument(
                        "main",
                        "users",
                        currentUser.id,
                        {
                            username: updates.username || currentUser.username,
                            email: updates.email || currentUser.email,
                            profilePicture: updates.profilePicture || currentUser.profilePicture,
                            bio: updates.bio || currentUser.bio,
                        },
                        [
                            Permission.read(Role.user(currentUser.id)),
                            Permission.update(Role.user(currentUser.id)),
                            Permission.delete(Role.user(currentUser.id)),
                            Permission.write(Role.user(currentUser.id)),
                        ]
                    );

                    const user: UserData = {
                        id: updatedUser.$id,
                        createdAt: updatedUser.$createdAt,
                        updatedAt: updatedUser.$updatedAt,
                        username: updatedUser.username || currentUser.username,
                        email: updatedUser.email || currentUser.email,
                        profilePicture: updatedUser.profilePicture || currentUser.profilePicture,
                        bio: updatedUser.bio || currentUser.bio,
                    };

                    set({ user, loading: false });
                } catch (err: unknown) {
                    console.error('Update user error:', err);
                    set({ error: err instanceof Error ? err.message : 'Update failed', loading: false });
                }
            },
        }),
        {
            name: 'auth-store',
            partialize: (state) => ({
                user: state.user,
            })
        }
    )
);

export default useAuth;

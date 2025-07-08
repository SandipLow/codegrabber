import { create } from 'zustand';
import { account, databases, storage } from '@/lib/appwrite';
import { ID, Models, Permission, Query } from 'appwrite';

interface Asset extends Models.Document {
    name: string;
    userId: string;
}

interface AssetStore {
    assets: Asset[];
    loading: boolean;
    error: string | null;
    fetchAssets: () => Promise<void>;
    uploadAsset: (file: File) => Promise<void>;
    deleteAsset: (assetId: string) => Promise<void>;
    getAssetUrl: (assetId: string) => string;
}

const useAssetStore = create<AssetStore>((set) => ({
    assets: [],
    loading: false,
    error: null,

    fetchAssets: async () => {
        try {
            set({ loading: true, error: null });
            // Get authenticated user
            const user = await account.get();
            if (!user) {
                set({ error: 'Please log in to view your assets.', loading: false });
                return;
            }
            // Fetch assets for the authenticated user
            const response = await databases.listDocuments<Asset>(
                'main',
                'assets',
                [Query.equal('userId', user.$id)]
            );
            set({ assets: response.documents, loading: false });
        } catch (err) {
            console.error('Error fetching assets:', err);
            set({ error: 'Failed to fetch assets. Please try again.', loading: false });
        }
    },

    uploadAsset: async (file: File) => {
        try {
            set({ loading: true, error: null });
            // Get authenticated user
            const user = await account.get();
            if (!user) {
                set({ error: 'Please log in to upload assets.', loading: false });
                return;
            }
            // Upload file to storage
            const fileResponse = await storage.createFile(
                'user_assets', 
                ID.unique(), 
                file, 
                [
                    Permission.read(`any`),
                    Permission.write(`user:${user.$id}`),
                    Permission.delete(`user:${user.$id}`),
                    Permission.update(`user:${user.$id}`),
                ]
            );
            console.log('File uploaded:', fileResponse);
            // Create document in assets collection
            await databases.createDocument(
                'main',
                'assets',
                fileResponse.$id,
                {
                    name: file.name,
                    userId: user.$id
                },
                [
                    Permission.read(`user:${user.$id}`),
                    Permission.delete(`user:${user.$id}`),
                    Permission.update(`user:${user.$id}`),
                ]
            );
            // Refresh assets
            const response = await databases.listDocuments<Asset>(
                'main',
                'assets',
                [Query.equal('userId', user.$id)]
            );
            set({ assets: response.documents, loading: false });
        } catch (err) {
            console.error('Error uploading asset:', err);
            set({ error: 'Failed to upload asset. Please try again.', loading: false });
        }
    },

    deleteAsset: async (assetId: string) => {
        try {
            set({ loading: true, error: null });
            // Get authenticated user
            const user = await account.get();
            if (!user) {
                set({ error: 'Please log in to delete assets.', loading: false });
                return;
            }
            // Get asset document to verify ownership
            const asset = await databases.getDocument('main', 'assets', assetId);
            if (asset.userId !== user.$id) {
                set({ error: 'You do not have permission to delete this asset.', loading: false });
                return;
            }
            // Delete file from storage
            await storage.deleteFile('user_assets', assetId);
            // Delete document
            await databases.deleteDocument('main', 'assets', assetId);
            // Update state
            set((state) => ({
                assets: state.assets.filter((a) => a.$id !== assetId),
                loading: false,
            }));
        } catch (err) {
            console.error('Error deleting asset:', err);
            set({ error: 'Failed to delete asset. Please try again.', loading: false });
        }
    },

    getAssetUrl: (assetId: string) => {
        return storage.getFileView('user_assets', assetId);
    },
}));

export default useAssetStore;
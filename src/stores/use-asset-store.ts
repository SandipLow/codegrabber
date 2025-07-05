// stores/useAssetStore.ts
import { create } from 'zustand';
import { storage, ID } from '@/lib/appwrite';
import type { Models } from 'appwrite';

type Asset = Models.File;

type AssetStore = {
  assets: Asset[];
  loading: boolean;
  error: string | null;
  uploadAsset: (file: File) => Promise<void>;
  fetchAssets: () => Promise<void>;
  deleteAsset: (fileId: string) => Promise<void>;
  getAssetUrl: (fileId: string) => string;
};

const BUCKET_ID = 'user_assets';

const useAssetStore = create<AssetStore>((set, get) => ({
  assets: [],
  loading: false,
  error: null,

  uploadAsset: async (file) => {
    set({ loading: true, error: null });
    try {
      await storage.createFile(BUCKET_ID, ID.unique(), file);
      await get().fetchAssets();
    } catch (err: unknown) {
      console.error('Upload error:', err);
      set({ error: err instanceof Error ? err.message : 'Upload failed' });
    } finally {
      set({ loading: false });
    }
  },

  fetchAssets: async () => {
    set({ loading: true, error: null });
    try {
      const response = await storage.listFiles(BUCKET_ID);
      set({ assets: response.files });
    } catch (err: unknown) {
      console.error('Fetch error:', err);
      set({ error: err instanceof Error ? err.message : 'Failed to fetch assets' });
    } finally {
      set({ loading: false });
    }
  },

  deleteAsset: async (fileId) => {
    set({ loading: true, error: null });
    try {
      await storage.deleteFile(BUCKET_ID, fileId);
      set({ assets: get().assets.filter((a) => a.$id !== fileId) });
    } catch (err: unknown) {
      console.error('Delete error:', err);
      set({ error: err instanceof Error ? err.message : 'Delete failed' });
    } finally {
      set({ loading: false });
    }
  },

  getAssetUrl: (fileId) => {
    return storage.getFilePreview(BUCKET_ID, fileId);
  },
}));

export default useAssetStore;

'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, Copy, Code, X } from 'lucide-react';
import useAssetStore from '@/stores/use-asset-store';

export default function Page() {
    const { assets, loading, error, uploadAsset, fetchAssets, deleteAsset, getAssetUrl } = useAssetStore();
    const fileRef = useRef<HTMLInputElement>(null);
    const [copied, setCopied] = useState<string | null>(null);
    const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

    useEffect(() => {
        fetchAssets();
    }, [fetchAssets]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedAssetId(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleUpload = () => {
        const file = fileRef.current?.files?.[0];
        if (file) {
            uploadAsset(file);
            if (fileRef.current) fileRef.current.value = ''; // Clear input
        }
    };

    const handleCopyUrl = (assetId: string) => {
        const url = getAssetUrl(assetId);
        navigator.clipboard.writeText(url).then(() => {
            setCopied(`url-${assetId}`);
            setTimeout(() => setCopied(null), 2000);
        });
    };

    const handleCopyMarkdown = (assetId: string, name: string) => {
        const markdown = `![${name}](${getAssetUrl(assetId)})`;
        navigator.clipboard.writeText(markdown).then(() => {
            setCopied(`markdown-${assetId}`);
            setTimeout(() => setCopied(null), 2000);
        });
    };

    const selectedAsset = assets.find((asset) => asset.$id === selectedAssetId);

    return (
        <div className="px-4 sm:px-6 md:px-8">
            <div className="max-w-6xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl font-bebas-neue text-gray-900 dark:text-gray-200 mb-8"
                >
                    Asset Manager
                </motion.h2>

                {error && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-600 dark:text-red-400 text-center mb-6 font-roboto-flex"
                        aria-live="assertive"
                    >
                        {error}
                    </motion.p>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-8">
                    <label htmlFor="file-upload" className="flex-1">
                        <span className="block text-sm text-gray-600 dark:text-gray-400 mb-1 font-roboto-flex">
                            Select File
                        </span>
                        <input
                            id="file-upload"
                            ref={fileRef}
                            type="file"
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                            aria-label="Select file to upload"
                        />
                    </label>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleUpload}
                        disabled={loading}
                        className={`mt-4 sm:mt-0 p-2 bg-blue-600 dark:bg-blue-400 text-white dark:text-gray-900 rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        aria-label="Upload file"
                    >
                        <Upload className="w-4 h-4 mr-2" /> Upload
                    </motion.button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? (
                        <div className="space-y-6" aria-live="polite">
                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
                                ></div>
                            ))}
                        </div>
                    ) : assets.length === 0 ? (
                        <p className="text-center text-gray-600 dark:text-gray-400 font-roboto-flex col-span-full">
                            No assets found. Upload an asset to get started!
                        </p>
                    ) : (
                        assets.map((asset, index) => (
                            <motion.div
                                key={asset.$id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                            >
                                <img
                                    src={getAssetUrl(asset.$id)}
                                    alt={asset.name}
                                    className="w-full h-32 object-cover rounded-t-lg cursor-pointer hover:opacity-80 transition-opacity duration-200"
                                    onError={(e) => (e.currentTarget.src = '/Assets/placeholder-asset.jpg')}
                                    onClick={() => setSelectedAssetId(asset.$id)}
                                    aria-label={`View ${asset.name} in full screen`}
                                />
                                <div className="p-4">
                                    <p className="text-sm text-gray-900 dark:text-gray-200 font-roboto-flex truncate">
                                        {asset.name}
                                    </p>
                                    <div className="flex justify-between mt-2 space-x-2">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleCopyUrl(asset.$id)}
                                            className="flex-1 p-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 flex items-center justify-center"
                                            aria-label={`Copy URL for ${asset.name}`}
                                        >
                                            {copied === `url-${asset.$id}` ? (
                                                <span className="text-xs text-green-500 dark:text-green-400">Copied!</span>
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleCopyMarkdown(asset.$id, asset.name)}
                                            className="flex-1 p-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 flex items-center justify-center"
                                            aria-label={`Copy Markdown for ${asset.name}`}
                                        >
                                            {copied === `markdown-${asset.$id}` ? (
                                                <span className="text-xs text-green-500 dark:text-green-400">Copied!</span>
                                            ) : (
                                                <Code className="w-4 h-4" />
                                            )}
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => deleteAsset(asset.$id)}
                                            className="flex-1 p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-400 flex items-center justify-center"
                                            aria-label={`Delete ${asset.name}`}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            <AnimatePresence>
                {selectedAsset && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50"
                        onClick={() => setSelectedAssetId(null)}
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Preview ${selectedAsset.name}`}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-[90vw] sm:max-w-3xl relative"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                        >
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setSelectedAssetId(null)}
                                className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-600 dark:focus:ring-red-400"
                                aria-label={`Close preview for ${selectedAsset.name}`}
                            >
                                <X className="w-6 h-6" />
                            </motion.button>
                            <img
                                src={getAssetUrl(selectedAsset.$id)}
                                alt={selectedAsset.name}
                                className="w-full max-h-[80vh] object-contain rounded-md mb-4"
                                onError={(e) => (e.currentTarget.src = '/Assets/placeholder-asset.jpg')}
                            />
                            <p className="text-sm text-gray-900 dark:text-gray-200 font-roboto-flex truncate text-center mb-4">
                                {selectedAsset.name}
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleCopyUrl(selectedAsset.$id)}
                                    className="p-2 bg-blue-600 dark:bg-blue-400 text-white dark:text-gray-900 rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 flex items-center justify-center"
                                    aria-label={`Copy URL for ${selectedAsset.name}`}
                                >
                                    {copied === `url-${selectedAsset.$id}` ? (
                                        <span className="text-sm">Copied!</span>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4 mr-2" /> Copy URL
                                        </>
                                    )}
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleCopyMarkdown(selectedAsset.$id, selectedAsset.name)}
                                    className="p-2 bg-blue-600 dark:bg-blue-400 text-white dark:text-gray-900 rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 flex items-center justify-center"
                                    aria-label={`Copy Markdown for ${selectedAsset.name}`}
                                >
                                    {copied === `markdown-${selectedAsset.$id}` ? (
                                        <span className="text-sm">Copied!</span>
                                    ) : (
                                        <>
                                            <Code className="w-4 h-4 mr-2" /> Copy Markdown
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
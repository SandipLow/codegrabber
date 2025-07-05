'use client';

import React from 'react';
import Link from 'next/link';
import { Image, NotebookText, NotebookPen } from 'lucide-react';

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col md:flex-row min-h-screen mt-16">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-white dark:bg-gray-800 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
                <nav role="navigation" className="space-y-2">
                    <h2 className="text-lg font-bebas-neue text-gray-900 dark:text-gray-200 mb-4">
                        Admin Panel
                    </h2>
                    {[
                        {
                            href: '/admin/create-blog',
                            label: 'Create Blog',
                            icon: <NotebookPen className="w-5 h-5 mr-2" />,
                        },
                        {
                            href: '/admin/manage-blogs',
                            label: 'Manage Blogs',
                            icon: <NotebookText className="w-5 h-5 mr-2" />,
                        },
                        {
                            href: '/admin/asset-manager',
                            label: 'Manage Assets',
                            icon: <Image className="w-5 h-5 mr-2" />,
                        },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center p-2 text-gray-900 dark:text-gray-200 hover:bg-blue-600 dark:hover:bg-blue-400 hover:text-white dark:hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 transition-colors font-roboto-flex"
                            aria-label={`Navigate to ${item.label}`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8 overflow-auto">
                {children}
            </main>
        </div>
    );
}

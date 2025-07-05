import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import * as themes from 'react-syntax-highlighter/dist/esm/styles/prism';
import useTheme from '@/stores/use-theme';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Copy } from 'lucide-react';

export default function Markdown({ content }: { content: string }) {
    const { theme } = useTheme();


    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                h1: ({ ...props }) => (
                    <h1 className="text-2xl font-bebas-neue mt-6 mb-4" {...props} />
                ),
                h2: ({ ...props }) => (
                    <h2 className="text-xl font-bebas-neue mt-5 mb-3" {...props} />
                ),
                p: ({ ...props }) => (
                    <p className="text-base font-roboto-flex mb-4" {...props} />
                ),
                ul: ({ ...props }) => (
                    <ul className="list-disc list-inside mb-4" {...props} />
                ),
                ol: ({ ...props }) => (
                    <ol className="list-decimal list-inside mb-4" {...props} />
                ),
                img: ({ ...props }) => (
                    <span className='flex justify-center'>
                        <img
                            {...props}
                            className="w-full max-w-lg rounded-md mb-4"
                        />
                    </span>
                ),
                hr: ({ ...props }) => (
                    <hr className="my-6 border-gray-200 dark:border-gray-700" {...props} />
                ),
                code: ({ className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="relative my-4"
                        >
                            <SyntaxHighlighter
                                style={theme === 'dark' ? themes.okaidia : themes.coldarkCold}
                                language={match[1]}
                                PreTag="pre"
                                customStyle={{
                                    margin: 0,
                                    borderRadius: '0.375rem',
                                }}
                                className="text-sm"
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                            <CopyButton
                                handleCopy={() => {
                                    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
                                }}
                            />
                        </motion.div>
                    ) : (
                        <code
                            className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded px-1 py-0.5"
                            {...props}
                        >
                            {children}
                        </code>
                    );
                },
                table: ({ ...props }) => (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-x-auto my-4"
                    >
                        <table
                            className="w-full border-collapse border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                            role="table"
                            {...props}
                        />
                    </motion.div>
                ),
                thead: ({ ...props }) => (
                    <thead className="bg-gray-100 dark:bg-gray-700" {...props} />
                ),
                tbody: ({ ...props }) => <tbody {...props} />,
                tr: ({ ...props }) => (
                    <tr
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        {...props}
                    />
                ),
                th: ({ ...props }) => (
                    <th
                        className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left text-gray-900 dark:text-gray-200 font-medium"
                        {...props}
                    />
                ),
                td: ({ ...props }) => (
                    <td
                        className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-900 dark:text-gray-200"
                        {...props}
                    />
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    )
}


function CopyButton({ handleCopy }: { handleCopy: () => void }) {

    const [copied, setCopied] = useState(false);

    const handleClick = () => {
        handleCopy();
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };


    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClick}
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
            aria-label="Copy code"
        >
            {copied ? (
                <span className="text-green-500 text-sm">Copied!</span>
            ) : (
                <Copy className="w-4 h-4" />
            )}   
        </motion.button>
    )
}
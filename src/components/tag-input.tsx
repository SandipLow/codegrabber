'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

type TagInputProps = {
    tags: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
};

export default function TagInput({ tags, onChange, placeholder = 'Add a tag...' }: TagInputProps) {
    const [input, setInput] = useState('');

    const addTag = (tag: string) => {
        const cleaned = tag.trim();
        if (cleaned && !tags.includes(cleaned)) {
            onChange([...tags, cleaned]);
        }
    };

    const removeTag = (index: number) => {
        const newTags = tags.filter((_, i) => i !== index);
        onChange(newTags);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
            e.preventDefault();
            addTag(input);
            setInput('');
        }

        // Remove last tag on Backspace when input is empty
        if (e.key === 'Backspace' && input === '' && tags.length > 0) {
            onChange(tags.slice(0, tags.length - 1));
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-2 p-2 border rounded border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
            {tags.map((tag, i) => (
                <span
                    key={i}
                    className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-100"
                >
                    {tag}
                    <button type="button" onClick={() => removeTag(i)} className="focus:outline-none hover:text-red-500 cursor-pointer">
                        <X className="w-3 h-3" />
                    </button>
                </span>
            ))}

            <input
                type="text"
                className="flex-1 min-w-[100px] bg-transparent border-none focus:outline-none text-gray-800 dark:text-gray-100"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                aria-label="Tag input"
            />
        </div>
    );
}

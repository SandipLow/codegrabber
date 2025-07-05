import React from 'react'
import Editor from 'react-simple-code-editor';
import { Highlight, themes } from 'prism-react-renderer';
import 'prismjs';
import 'prismjs/components/prism-markdown';
import useTheme from '@/stores/use-theme';

export default function CodeEditor({
    value,
    onChange,
    language,
    className = '',
    placeholder = 'Start typing...',
}: {
    value: string;
    onChange: (value: string) => void;
    language: string;
    className?: string;
    placeholder?: string;
}) {
    const { theme } = useTheme();

    return (
        <Editor
            value={value}
            onValueChange={onChange}
            highlight={(code) => (
                <Highlight
                    code={code}
                    language={language}
                    theme={theme === 'dark' ? themes.gruvboxMaterialDark : themes.gruvboxMaterialLight}
                >
                    {({ className, style, tokens, getLineProps, getTokenProps }) => (
                        <pre className={className} style={{ ...style, backgroundColor: 'transparent', padding: 0 }}>
                            {tokens.map((line, i) => (
                                <div key={i} {...getLineProps({ line })} style={{ whiteSpace: 'pre-wrap' }}>
                                    {line.map((token, key) => (
                                        <span key={key} {...getTokenProps({ token })} />
                                    ))}
                                </div>
                            ))}
                        </pre>
                    )}
                </Highlight>
            )}
            padding={16}
            className={className}
            textareaClassName="outline-none w-full h-full"
            style={{ lineHeight: '1.5', whiteSpace: 'pre-wrap' }}
            placeholder={placeholder}
        />
    )
}

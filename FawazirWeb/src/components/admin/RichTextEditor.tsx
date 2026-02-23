'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Markdown } from 'tiptap-markdown'
import {
    Bold, Italic, List, ListOrdered, Heading1, Heading2,
    Link as LinkIcon, Quote, Code, Undo, Redo
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
    content: string
    onChange: (markdown: string) => void
    placeholder?: string
    className?: string
}

export function RichTextEditor({ content, onChange, placeholder = 'ابدأ الكتابة هنا...', className }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Markdown,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-orange-600 underline cursor-pointer',
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content: content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            // @ts-ignore - tiptap-markdown adds it to storage
            const markdown = editor.storage.markdown?.getMarkdown() || ''
            onChange(markdown)
        },
        editorProps: {
            attributes: {
                class: 'prose prose-orange max-w-none focus:outline-none min-h-[200px] p-6 text-right',
                dir: 'rtl'
            },
        },
    })

    if (!editor) return null

    const buttons = [
        {
            icon: Heading1,
            label: 'عنوان رئيسي',
            action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            active: editor.isActive('heading', { level: 1 })
        },
        {
            icon: Heading2,
            label: 'عنوان فرعي',
            action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            active: editor.isActive('heading', { level: 2 })
        },
        {
            icon: Bold,
            label: 'عريض',
            action: () => editor.chain().focus().toggleBold().run(),
            active: editor.isActive('bold')
        },
        {
            icon: Italic,
            label: 'مائل',
            action: () => editor.chain().focus().toggleItalic().run(),
            active: editor.isActive('italic')
        },
        {
            icon: List,
            label: 'قائمة',
            action: () => editor.chain().focus().toggleBulletList().run(),
            active: editor.isActive('bulletList')
        },
        {
            icon: ListOrdered,
            label: 'قائمة مرقمة',
            action: () => editor.chain().focus().toggleOrderedList().run(),
            active: editor.isActive('orderedList')
        },
        {
            icon: Quote,
            label: 'اقتباس',
            action: () => editor.chain().focus().toggleBlockquote().run(),
            active: editor.isActive('blockquote')
        },
        {
            icon: Code,
            label: 'كود',
            action: () => editor.chain().focus().toggleCode().run(),
            active: editor.isActive('code')
        },
        {
            icon: LinkIcon,
            label: 'رابط',
            action: () => {
                const url = window.prompt('URL')
                if (url) editor.chain().focus().setLink({ href: url }).run()
            },
            active: editor.isActive('link')
        },
    ]

    return (
        <div className={cn("bg-white border border-gray-100 rounded-3xl overflow-hidden focus-within:ring-2 focus-within:ring-orange-500 transition-all", className)}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 bg-white border-b border-gray-100 rtl">
                {buttons.map((btn, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={btn.action}
                        className={cn(
                            "p-2 rounded-lg transition-all border border-transparent",
                            btn.active
                                ? "bg-orange-50 text-orange-600 border-orange-100"
                                : "text-gray-500 hover:bg-gray-50 hover:text-orange-600"
                        )}
                        title={btn.label}
                    >
                        <btn.icon className="w-4 h-4" />
                    </button>
                ))}

                <div className="w-px h-4 bg-gray-200 mx-1" />

                <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="p-2 text-gray-400 hover:text-orange-600 disabled:opacity-30"
                >
                    <Undo className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="p-2 text-gray-400 hover:text-orange-600 disabled:opacity-30"
                >
                    <Redo className="w-4 h-4" />
                </button>
            </div>

            {/* Editor Area */}
            <EditorContent editor={editor} className="bg-gray-50 h-full" />

            <style jsx global>{`
                .ProseMirror {
                    outline: none !important;
                    height: 100%;
                }
                .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: right;
                    color: #adb5bd;
                    pointer-events: none;
                    height: 0;
                }
                .prose h1 { font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem; }
                .prose h2 { font-size: 1.25rem; font-weight: 800; margin-bottom: 0.5rem; }
                .prose p { margin-bottom: 0.75rem; line-height: 1.7; }
                .prose blockquote { 
                    border-right: 4px solid #f97316; 
                    padding-right: 1.5rem; 
                    margin-right: 0; 
                    font-style: italic; 
                    color: #4b5563;
                }
                .prose ul { list-style-type: disc; padding-right: 1.5rem; }
                .prose ol { list-style-type: decimal; padding-right: 1.5rem; }
            `}</style>
        </div>
    )
}

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Send, Bot, Crown, Stars, BrainCircuit, MessageSquareText } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Image from 'next/image'


// Sultana Chat Component (Floating Button + Chat Interface)
export function SultanaChatButton() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
        { role: 'assistant', content: 'أهلاً بك يا بطل في عالم فوازير 2026! أنا سلطانة ذكاء فوازير 2026 الخارق. اطلب علمك أو اسأل عن خفايا التحدي، وسأجيبك بفيض من الحكمة.' }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    // ... existing state ...
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Reset height
            const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
            textareaRef.current.style.height = `${Math.max(newHeight, 24)}px`; // Ensure min height
        }
    }, [input, isOpen]);

    // Listen for external open signals
    useEffect(() => {
        const handleOpenChat = () => setIsOpen(true)
        window.addEventListener('openSultanaChat', handleOpenChat)
        return () => window.removeEventListener('openSultanaChat', handleOpenChat)
    }, [])

    // ... existing effects ...

    // ... existing effects ...

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return

        const userMessage = input.trim()
        setInput('')
        setMessages(prev => [...prev, { role: 'user', content: userMessage }])
        setIsLoading(true)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages.map(m => ({
                        role: m.role,
                        parts: [{ text: m.content }]
                    }))
                })
            })

            if (!response.ok) throw new Error('Failed to fetch')

            const data = await response.json()
            setMessages(prev => [...prev, { role: 'assistant', content: data.text }])
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'عذراً يا رفيقي، يبدو أن خيوط السحر قد تشابكت. حاول مرة أخرى لاحقاً.' }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {/* Floating Button - Magical Orb */}
            <motion.div
                className="fixed bottom-24 left-4 md:bottom-8 md:left-8 z-[100] flex items-center justify-center pointer-events-none"
                initial={false}
                animate={isOpen ? "open" : "closed"}
            >
                <AnimatePresence>
                    {!isOpen && (
                        <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsOpen(true)}
                            className="pointer-events-auto relative w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center group"
                        >
                            {/* Outer Glow Ring */}
                            <div className="absolute inset-0 rounded-2xl bg-amber-500/10 blur-xl animate-pulse group-hover:bg-amber-500/30 transition-colors"></div>

                            {/* Main Button Body */}
                            <div className="absolute inset-0 rounded-2xl bg-gray-900 border-2 border-amber-500/20 flex items-center justify-center shadow-2xl group-hover:border-amber-500/50 transition-all overflow-hidden backdrop-blur-md">
                                <Sparkles className="w-5 h-5 md:w-8 md:h-8 text-amber-500" />
                            </div>

                            {/* Tooltip - Desktop Only */}
                            <span className="hidden md:block absolute left-full ml-4 bg-gray-950 border border-white/10 text-white px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all shadow-2xl pointer-events-none">
                                اسأل سلطانة
                            </span>
                        </motion.button>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Chat Interface Window - Majestic Redesign */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className="fixed inset-0 md:inset-auto md:bottom-24 md:left-8 z-[9998] w-full md:w-[400px] h-full md:h-[600px] bg-gray-950/95 backdrop-blur-2xl md:rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border-white/5 flex flex-col overflow-hidden"
                        dir="rtl"
                    >
                        {/* Majestic Header */}
                        <div className="relative p-6 bg-gradient-to-b from-amber-600/20 to-transparent border-b border-white/5 shrink-0 overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>

                            <div className="relative flex items-center justify-between z-10">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-700 to-amber-900 p-[2px] shadow-lg shadow-amber-900/20">
                                            <div className="w-full h-full rounded-2xl bg-gray-950 flex items-center justify-center">
                                                <BrainCircuit className="w-8 h-8 text-amber-500" />
                                            </div>
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-gray-950 animate-pulse"></div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-black text-2xl text-white tracking-tight">سلطانة AI</h3>
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                            <div className="flex gap-1">
                                                <div className="w-1 h-1 rounded-full bg-amber-500/40"></div>
                                                <div className="w-1 h-1 rounded-full bg-amber-500/40"></div>
                                                <div className="w-1 h-1 rounded-full bg-amber-500/40"></div>
                                            </div>
                                            <p className="text-xs text-amber-200/60 font-medium tracking-widest uppercase">
                                                مرافقتك الذكية
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-2xl transition-all active:scale-90"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Messages Area - Glassy list */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-amber-900/50 scrollbar-track-transparent">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: msg.role === 'user' ? -20 : 20, y: 10 }}
                                    animate={{ opacity: 1, x: 0, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`relative max-w-[92%] p-4 rounded-3xl text-sm md:text-base leading-relaxed shadow-xl ${msg.role === 'user'
                                        ? 'bg-amber-600 text-white rounded-br-none shadow-amber-900/20'
                                        : 'bg-gray-900/80 border border-amber-500/20 text-gray-100 rounded-bl-none shadow-black/40 backdrop-blur-sm'
                                        }`}>

                                        {msg.role === 'assistant' && (
                                            <div className="absolute -top-3 right-5 px-3 py-1 bg-gray-950 border border-amber-500/30 rounded-full text-[10px] font-black text-amber-500 uppercase tracking-tighter">
                                                سلطانة
                                            </div>
                                        )}

                                        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-p:mb-4 last:prose-p:mb-0 prose-strong:text-amber-400 prose-headings:text-amber-500 prose-ul:my-2 prose-li:my-1 text-right">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-gray-900/50 border border-amber-500/10 p-5 rounded-3xl rounded-bl-none flex items-center gap-3">
                                        <div className="relative flex gap-1.5">
                                            <motion.span
                                                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                                                transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                                                className="w-2 h-2 bg-amber-500 rounded-full"
                                            ></motion.span>
                                            <motion.span
                                                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                                                transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                                                className="w-2 h-2 bg-amber-500 rounded-full"
                                            ></motion.span>
                                            <motion.span
                                                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                                                transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                                                className="w-2 h-2 bg-amber-500 rounded-full"
                                            ></motion.span>
                                        </div>
                                        <span className="text-xs text-amber-500/60 font-bold italic tracking-wider">سلطانة تتأمل...</span>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Majestic Input Area */}
                        <div className="p-6 bg-gradient-to-t from-gray-900 to-transparent border-t border-white/5 shrink-0">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                                className="group relative flex items-center gap-3 bg-gray-950/80 border border-amber-500/10 rounded-[2rem] p-2 px-4 focus-within:border-amber-500/40 transition-all shadow-2xl"
                            >
                                <textarea
                                    ref={textareaRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    placeholder="اسأل سلطانة شيئاً..."
                                    className="w-full bg-transparent border-none outline-none text-base text-gray-100 placeholder-gray-500 resize-none py-1 px-2 custom-scrollbar transition-all duration-200 ease-in-out"
                                    rows={1}
                                    disabled={isLoading}
                                    style={{ minHeight: '24px', maxHeight: '120px', overflowY: 'auto' }}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="p-4 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl shadow-lg shadow-amber-900/40 disabled:opacity-30 disabled:grayscale transition-all active:scale-90 shrink-0"
                                >
                                    <Send className="w-5 h-5 rtl:-rotate-90" />
                                </button>
                            </form>
                            <div className="mt-4 text-center">
                                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">
                                    <Stars className="w-3 h-3 text-amber-900" />
                                    <span>ذكاء فوازير • 2026</span>
                                    <Stars className="w-3 h-3 text-amber-900" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}


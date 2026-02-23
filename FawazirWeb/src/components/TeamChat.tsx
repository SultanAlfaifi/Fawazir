'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Users, MessageSquare, ShieldCheck, HeartPulse } from 'lucide-react'
import { getMessages, sendMessage } from '@/actions/days'

interface Message {
    id: string
    text: string
    senderId: string
    sender: {
        displayName: string | null
        character: string | null
    }
    createdAt: Date
}

export function TeamChat({ teamId, currentUserId, teammateName }: { teamId: string, currentUserId: string, teammateName: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const [hasUnread, setHasUnread] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [mounted, setMounted] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const prevMessagesCount = useRef(0)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const fetchMessages = useCallback(async (isAutoPoll = false) => {
        try {
            const data = await getMessages(teamId)
            const newMessages = data as any[]

            // If we are closed and message count increased, mark as unread
            if (!isOpen && isAutoPoll && newMessages.length > prevMessagesCount.current) {
                // Check if the last message isn't from me
                const lastMsg = newMessages[newMessages.length - 1]
                if (lastMsg && lastMsg.senderId !== currentUserId) {
                    setHasUnread(true)
                }
            }

            prevMessagesCount.current = newMessages.length
            setMessages(newMessages)
        } catch (error) {
            console.error('Failed to fetch messages:', error)
        }
    }, [teamId, isOpen, currentUserId])

    // Background Polling
    useEffect(() => {
        fetchMessages()
        const interval = setInterval(() => fetchMessages(true), 4000)
        return () => clearInterval(interval)
    }, [fetchMessages])

    // Handle opening chat
    useEffect(() => {
        if (isOpen) {
            setHasUnread(false)
            scrollToBottom()
        }
    }, [isOpen, messages.length])

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const newHeight = Math.min(textareaRef.current.scrollHeight, 120);
            textareaRef.current.style.height = `${Math.max(newHeight, 24)}px`;
        }
    }, [input, isOpen]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return

        const text = input.trim()
        setInput('')
        setIsLoading(true)

        try {
            await sendMessage(teamId, text)
            await fetchMessages()
        } catch (error) {
            console.error('Failed to send message:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const chatWindow = (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 100, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 100, scale: 0.9 }}
                    className="fixed inset-0 md:inset-auto md:bottom-24 md:left-8 z-[10000] w-full md:w-[400px] h-full md:h-[650px] bg-[#0A0A0F] md:rounded-[3rem] shadow-[0_50px_150px_-30px_rgba(0,0,0,0.9)] border border-white/10 flex flex-col overflow-hidden"
                    dir="rtl"
                >
                    {/* Header */}
                    <div className="relative p-8 bg-gradient-to-b from-indigo-600/20 to-transparent border-b border-white/5 shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-600/30">
                                    <Users className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="font-black text-2xl text-white tracking-tight">غرفة العمليات</h3>
                                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em] mt-1">تواصل مباشر: {teammateName}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-2xl transition-all border border-white/5"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-black/20">
                        {messages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-20">
                                <HeartPulse className="w-16 h-16 text-indigo-500 animate-pulse" />
                                <p className="text-sm font-black text-white uppercase tracking-widest">بدء الاتصال المشفر...</p>
                            </div>
                        ) : (
                            messages.map((msg, idx) => {
                                const isMe = msg.senderId === currentUserId
                                return (
                                    <motion.div
                                        key={msg.id || idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[85%] p-5 rounded-[1.75rem] text-sm leading-relaxed ${isMe
                                            ? 'bg-indigo-600 text-white rounded-br-none shadow-xl shadow-indigo-900/20'
                                            : 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-none'
                                            }`}>
                                            {!isMe && (
                                                <span className="block text-[10px] font-black text-indigo-400 mb-1.5 uppercase tracking-wide">
                                                    {msg.sender.displayName || 'لاعب'}
                                                </span>
                                            )}
                                            <p className="font-medium text-base tracking-tight">{msg.text}</p>
                                            <span className={`block text-[9px] mt-2 opacity-50 ${isMe ? 'text-left' : 'text-right'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </motion.div>
                                )
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-8 bg-[#0A0A0F] border-t border-white/5">
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                            className="flex items-end gap-3"
                        >
                            <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-[1.5rem] p-3 focus-within:border-indigo-500/50 transition-all shadow-inner">
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
                                    placeholder="أرسل تعليماتك..."
                                    className="w-full bg-transparent border-none outline-none text-sm text-gray-100 placeholder-gray-500 resize-none py-1 px-2 custom-scrollbar"
                                    rows={1}
                                    disabled={isLoading}
                                    style={{ minHeight: '32px', maxHeight: '120px' }}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="p-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.25rem] shadow-2xl shadow-indigo-600/40 disabled:opacity-30 transition-all active:scale-90"
                            >
                                <Send className="w-6 h-6 rtl:-rotate-90" />
                            </button>
                        </form>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )

    return (
        <div className="w-full">
            {/* Button to open chat */}
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(true)}
                className="w-full flex items-center justify-between px-8 py-5 bg-indigo-600 text-white rounded-[1.75rem] font-black shadow-2xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all group overflow-hidden relative"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <div className="flex items-center gap-4 relative z-10">
                    <div className="relative">
                        <MessageSquare className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                        {hasUnread && (
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 border-2 border-indigo-600 rounded-full animate-bounce shadow-sm" />
                        )}
                    </div>
                    <span className="text-lg">فتح راديو الفريق</span>
                </div>
                <div className="flex items-center gap-3">
                    {hasUnread && (
                        <span className="text-[9px] font-black bg-amber-400 text-indigo-950 px-2 py-0.5 rounded-full animate-pulse uppercase tracking-tighter">
                            New Input
                        </span>
                    )}
                    <Users className="w-6 h-6 opacity-40 relative z-10" />
                </div>
            </motion.button>

            {/* Use Portal to render chat window at body level, bypassing stacking context constraints */}
            {mounted && typeof document !== 'undefined' && createPortal(chatWindow, document.body)}
        </div>
    )
}

"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ChatContextType {
    isOpen: boolean;
    activeConversationId: string | null;
    openChat: (participantId?: string) => void;
    closeChat: () => void;
    setActiveConversation: (id: string | null) => void;
    targetUserId: string | null; // <--- Added this
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [targetUserId, setTargetUserId] = useState<string | null>(null);

    const openChat = (userId?: string) => {
        setIsOpen(true);
        if (userId) {
            setTargetUserId(userId);
        }
    };

    const closeChat = () => {
        setIsOpen(false);
        setActiveConversationId(null);
        setTargetUserId(null);
    };

    const setActiveConversation = (id: string | null) => {
        setActiveConversationId(id);
    };

    return (
        <ChatContext.Provider value={{ isOpen, activeConversationId, openChat, closeChat, setActiveConversation, targetUserId }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
}

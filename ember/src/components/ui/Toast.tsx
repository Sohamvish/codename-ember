"use client";

import { AnimatePresence, motion } from "framer-motion";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle, AlertCircle } from "lucide-react";

// Types
type ToastType = "success" | "error" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Hook
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

// Provider
export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string, type: ToastType = "info") => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto dismiss
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    };

    const dismissToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Render Portal for Toasts */}
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </ToastContext.Provider>
    );
}

// Container Component
function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
    // Only run on client
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return createPortal(
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        className="pointer-events-auto"
                    >
                        <ToastItem toast={toast} onDismiss={() => onDismiss(toast.id)} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>,
        document.body
    );
}

// Individual Toast Component
function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
    return (
        <div className={`
            min-w-[300px] p-4 rounded-xl border backdrop-blur-md shadow-lg flex items-center justify-between gap-3
            ${toast.type === "success" ? "bg-green-950/40 border-green-500/20 text-green-200" : ""}
            ${toast.type === "error" ? "bg-red-950/40 border-red-500/20 text-red-200" : ""}
            ${toast.type === "info" ? "bg-stone-900/60 border-stone-700/50 text-stone-200" : ""}
        `}>
            <div className="flex items-center gap-3">
                {toast.type === "success" && <CheckCircle size={18} className="text-green-500" />}
                {toast.type === "error" && <AlertCircle size={18} className="text-red-500" />}
                {toast.type === "info" && <AlertCircle size={18} className="text-stone-400" />}
                <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
                onClick={onDismiss}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close"
            >
                <X size={14} />
            </button>
        </div>
    );
}

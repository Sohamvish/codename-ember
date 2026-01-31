import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export function GlassCard({ children, className, onClick }: GlassCardProps) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "glass-panel rounded-2xl p-6 transition-all duration-300",
                "hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:border-ember/30",
                onClick && "cursor-pointer active:scale-98",
                className
            )}
        >
            {children}
        </div>
    );
}

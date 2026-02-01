"use client";

import { useTheme } from "@/context/ThemeContext";
import { useEffect } from "react";

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();

    useEffect(() => {
        // Apply theme to html element
        console.log("🎨 Applying theme:", theme);
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(theme);
        console.log("✅ HTML classes:", document.documentElement.className);
    }, [theme]);

    return <>{children}</>;
}

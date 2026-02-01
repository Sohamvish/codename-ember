import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: 'class',
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                ember: "#f59e0b",
                "ember-glow": "#fbbf24",
                midnight: "#1c1917",
                "midnight-light": "#292524",
                soothe: "#fef3c7",
            },
            animation: {
                flicker: "flicker 3s infinite",
                rise: "rise 2s ease-out forwards",
            },
            keyframes: {
                flicker: {
                    "0%, 100%": { opacity: "1", transform: "scale(1)" },
                    "50%": { opacity: "0.8", transform: "scale(0.98)" },
                    "70%": { opacity: "0.9", transform: "scale(1.02)" },
                },
                rise: {
                    "0%": { transform: "translateY(20px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
            },
        },
    },
    plugins: [],
};
export default config;

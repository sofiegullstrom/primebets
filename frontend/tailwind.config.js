/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"SF Pro Display"', '"SF Pro Text"', '"SF Pro"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
            },
            colors: {
                pb: {
                    dark: '#0F1720',      // Primary Layout Background
                    card: '#162230',      // Card Surface
                    overlay: '#0C131C',   // Overlay/Dim
                    text: {
                        main: '#E6ECF2',  // Primary Text
                        sec: '#9AA7B5',   // Secondary Text
                        muted: '#7C8A98', // Muted Metadata
                    },
                    accent: {
                        main: '#2FAE8F',  // Primary Accent
                        dark: '#248E75',  // Accent Dark
                        glow: '#43C4A2',  // Accent Glow
                        gold: '#C9A86A',  // Gold Accent
                    }
                }
            }
        },
    },
    plugins: [],
}

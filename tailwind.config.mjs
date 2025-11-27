/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				'piano-black': '#0a0a0a',
				'piano-dark': '#1a1a1a',
				'piano-white': '#fafafa',
				'gold-accent': '#d4af37',
				'gold-hover': '#b5952f',
				'dusty-rose': '#eadad6',
			},
			fontFamily: {
				serif: ['"Playfair Display"', 'serif'],
				sans: ['"Inter"', 'sans-serif'],
			},
            animation: {
                'fade-in': 'fadeIn 1s ease-in-out',
                'slide-up': 'slideUp 0.8s ease-out',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            }
		},
	},
	plugins: [],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Orbitron', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        neon: {
          pink: '#FF00E5',
          cyan: '#00FFFF',
          green: '#39FF14',
          blue: '#007FFF',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'text-glow': {
          '0%, 100%': { textShadow: '0 0 5px hsl(var(--primary)), 0 0 10px hsl(var(--primary)), 0 0 15px hsl(var(--primary))' },
          '50%': { textShadow: '0 0 10px hsl(var(--primary)), 0 0 20px hsl(var(--primary)), 0 0 30px hsl(var(--primary))' },
        },
        'border-glow': {
          '0%, 100%': { boxShadow: '0 0 5px 0px hsl(var(--primary)), 0 0 10px 0px hsl(var(--primary)) inset' },
          '50%': { boxShadow: '0 0 10px 2px hsl(var(--primary)), 0 0 15px 2px hsl(var(--primary)) inset' },
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'text-glow': 'text-glow 2s ease-in-out infinite',
        'border-glow': 'border-glow 3s ease-in-out infinite alternate',
      },
      boxShadow: {
        'neon-sm': '0 0 5px theme(colors.neon.pink), 0 0 10px theme(colors.neon.cyan)',
        'neon-md': '0 0 10px theme(colors.neon.pink), 0 0 20px theme(colors.neon.cyan)',
        'neon-lg': '0 0 15px theme(colors.neon.pink), 0 0 30px theme(colors.neon.cyan), 0 0 5px theme(colors.neon.green) inset',
      }
    },
  },
  plugins: [require('tailwindcss-animate')],
};
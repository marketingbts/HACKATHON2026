import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT:  'var(--color-brand-primary-default)',
          300:      'var(--color-brand-primary-300)',
          350:      'var(--color-brand-primary-350)',
          400:      'var(--color-brand-primary-400)',
          500:      'var(--color-brand-primary-500)',
          600:      'var(--color-brand-primary-600)',
          700:      'var(--color-brand-primary-700)',
          800:      'var(--color-brand-primary-800)',
          900:      'var(--color-brand-primary-900)',
        },
        surface: {
          white:            'var(--color-surface-white)',
          background:       'var(--color-surface-background)',
          muted:            'var(--color-surface-muted)',
          subtle:           'var(--color-surface-subtle)',
          light:            'var(--color-surface-light)',
          input:            'var(--color-surface-input)',
          elevated:         'var(--color-surface-elevated)',
          'primary-subtle': 'var(--color-surface-primary-subtle)',
          'primary-light':  'var(--color-surface-primary-light)',
          'primary-wash':   'var(--color-surface-primary-wash)',
          'primary-faded':  'var(--color-surface-primary-faded)',
          'primary-muted':  'var(--color-surface-primary-muted)',
          'primary-ghost':  'var(--color-surface-primary-ghost)',
          'ai-badge':       'var(--color-surface-ai-badge-bg)',
        },
        'neutral-ui': {
          label:           'var(--color-neutral-ui-label)',
          placeholder:     'var(--color-neutral-ui-placeholder)',
          muted:           'var(--color-neutral-ui-muted)',
          dark:            'var(--color-neutral-ui-dark)',
          'step-inactive': 'var(--color-neutral-ui-step-inactive)',
        },
        neutral: {
          300: 'var(--color-neutral-300)',
          400: 'var(--color-neutral-400)',
          500: 'var(--color-neutral-500)',
          550: 'var(--color-neutral-550)',
          600: 'var(--color-neutral-600)',
          700: 'var(--color-neutral-700)',
          900: 'var(--color-neutral-900)',
          950: 'var(--color-neutral-950)',
        },
        border: {
          input:            'var(--color-border-input)',
          subtle:           'var(--color-border-subtle)',
          default:          'var(--color-border-default)',
          light:            'var(--color-border-light)',
          muted:            'var(--color-border-muted)',
          primary:          'var(--color-border-primary)',
          'primary-subtle': 'var(--color-border-primary-subtle)',
        },
        semantic: {
          'success-surface': 'var(--color-semantic-success-surface)',
          'success-alt':     'var(--color-semantic-success-alt)',
          'success-dark':    'var(--color-semantic-success-dark)',
          'info-surface':    'var(--color-semantic-info-surface)',
        },
        social: {
          instagram: 'var(--color-social-instagram)',
        },
        utility: {
          black:           'var(--color-utility-black)',
          'overlay-light':    'var(--color-utility-overlay-light)',
          'overlay-white-80': 'var(--color-utility-overlay-white-80)',
        },
      },
      borderRadius: {
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        pill: 'var(--radius-pill)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
        '3xs': ['0.5625rem', { lineHeight: '1rem' }],
      },
      letterSpacing: {
        wider:        '0.0625rem',
        'brand-logo': '-0.028125rem',
      },
      height: {
        input:        '2.9375rem',
        select:       '3rem',
        'card-image': '12rem',
      },
      size: {
        step:    '2.5rem',
        'icon-lg': '3.5rem',
      },
      spacing: {
        '4.25': '1.0625rem',
        '8.5':  '2.125rem',
        '4.5':  '1.125rem',
      },
      width: {
        'quick-action': '19rem',
      },
      minHeight: {
        textarea: '6.25rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}

export default config

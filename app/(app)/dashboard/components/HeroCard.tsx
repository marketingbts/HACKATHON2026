'use client'

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import InstagramIcon from '@mui/icons-material/Instagram'
import FacebookIcon from '@mui/icons-material/Facebook'

import { cn } from '@/lib/utils'

type SocialNetworkKey = 'instagram' | 'facebook' | 'tiktok'

type HeroCardProps = {
  brandName: string
  brandLogoUrl?: string
  socialNetworks: SocialNetworkKey[]
  onStartNow: () => void
  onContinue: () => void
  className?: string
}

/** Real TikTok logo SVG — MUI has no official icon */
function TikTokSVG({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.87a8.18 8.18 0 0 0 4.78 1.52V6.93a4.85 4.85 0 0 1-1.01-.24z" />
    </svg>
  )
}

const SOCIAL_ICONS: Record<SocialNetworkKey, { icon: React.ReactNode; label: string }> = {
  instagram: {
    icon: <InstagramIcon sx={{ fontSize: 18 }} />,
    label: 'Instagram',
  },
  facebook: {
    icon: <FacebookIcon sx={{ fontSize: 18 }} />,
    label: 'Facebook',
  },
  tiktok: {
    icon: <TikTokSVG size={18} />,
    label: 'TikTok',
  },
}

/** Decorative blob — right half of the hero card */
function BlobDecoration() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-[0.07]"
      viewBox="0 0 480 417"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      <circle cx="360" cy="100" r="260" stroke="white" strokeWidth="60" fill="none" />
      <circle cx="420" cy="320" r="140" stroke="white" strokeWidth="40" fill="none" />
      <circle cx="200" cy="380" r="100" stroke="white" strokeWidth="30" fill="none" />
    </svg>
  )
}

export function HeroCard({
  brandName,
  brandLogoUrl,
  socialNetworks,
  onStartNow,
  onContinue,
  className,
}: HeroCardProps) {
  const initials = brandName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

  return (
    <section
      className={cn(
        'relative flex overflow-hidden rounded-lg',
        'bg-gradient-to-br from-[#4648d4] to-[#4338ca]',
        // Mobile: column | Tablet: still column, card more compact | Desktop: row
        'flex-col lg:flex-row',
        'p-6 sm:p-8 lg:p-10',
        'gap-6 lg:gap-0',
        'min-h-[340px] sm:min-h-[380px] lg:h-[417px]',
        className,
      )}
    >
      {/* ── Background decoration ── */}
      <BlobDecoration />

      {/* ── Left content ── */}
      <div className="relative z-10 flex flex-col gap-5 w-full lg:max-w-[504px] lg:justify-center">

        {/* AI Badge */}
        <div
          className="inline-flex w-fit items-center gap-2 rounded-pill px-[17px] py-[5px]"
          style={{
            background: 'rgba(217,217,255,0.3)',
            border: '1px solid rgba(255,255,255,0.3)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <AutoAwesomeIcon
            className="text-white"
            sx={{ fontSize: 13 }}
            aria-hidden
          />
          <span className="text-xs font-semibold tracking-widest uppercase text-white">
            IA ACTIVA
          </span>
        </div>

        {/* Heading */}
        <h1
          className={cn(
            'font-black text-white leading-tight m-0',
            'text-[28px] sm:text-[32px] lg:text-[48px]',
          )}
        >
          ¿Qué contenido{'\n'}creamos hoy?
        </h1>

        {/* Body */}
        <p className="text-[14px] sm:text-[15px] font-normal leading-relaxed text-white/80 m-0">
          Impulsá tu presencia digital con contenido creado a medida para tu marca. La IA trabaja por vos.
        </p>

        {/* CTA Buttons — matching Button.tsx visual weights */}
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 w-full sm:w-auto">
          {/* Primary white button */}
          <button
            type="button"
            onClick={onStartNow}
            className={cn(
              'inline-flex items-center justify-center gap-2',
              'w-full sm:w-auto',
              'rounded-md px-5 py-3',
              'bg-white font-bold text-base leading-7 text-brand',
              'transition-all duration-150',
              'hover:brightness-95 active:brightness-90',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand',
            )}
          >
            <span>Comenzar ahora</span>
            <span aria-hidden className="h-4 w-4 shrink-0 flex items-center">
              <ArrowForwardIcon sx={{ fontSize: 16 }} />
            </span>
          </button>

          {/* Ghost / outline white button */}
          <button
            type="button"
            onClick={onContinue}
            className={cn(
              'inline-flex items-center justify-center gap-2',
              'w-full sm:w-auto',
              'rounded-md px-5 py-3',
              'bg-transparent border border-white/50 font-bold text-base leading-7 text-white',
              'transition-all duration-150',
              'hover:bg-white/10 hover:border-white',
              'active:bg-white/20',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand',
            )}
          >
            <span>Continuar</span>
            <span aria-hidden className="h-4 w-4 shrink-0 flex items-center">
              <ArrowForwardIcon sx={{ fontSize: 16 }} />
            </span>
          </button>
        </div>
      </div>

      {/* ── Brand Info Card ── */}
      <div
        className={cn(
          'relative z-10',
          // Mobile/Tablet: full width below
          'w-full rounded-md p-5 sm:p-[25px] flex flex-col gap-4',
          // Desktop: absolute position right side
          'lg:absolute lg:right-10 lg:top-1/2 lg:-translate-y-1/2',
          'lg:w-[300px] xl:w-[320px]',
        )}
        style={{
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Brand row */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full shrink-0 flex items-center justify-center overflow-hidden bg-white/20">
            {brandLogoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={brandLogoUrl} alt={brandName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-white">{initials}</span>
            )}
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-semibold uppercase tracking-widest text-white/60">
              TU MARCA
            </span>
            <span className="text-[14px] font-semibold text-white leading-snug">{brandName}</span>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-white/20 m-0" />

        {/* Social networks */}
        <div className="flex flex-col gap-2">
          <span className="text-[9px] font-semibold uppercase tracking-widest text-white/60">
            REDES SOCIALES
          </span>
          <div className="flex items-center gap-2">
            {socialNetworks.map((key) => {
              const normalizedKey = key.toLowerCase() as SocialNetworkKey
              const entry = SOCIAL_ICONS[normalizedKey]
              if (!entry) return null
              const { icon, label } = entry
              return (
                <button
                  key={key}
                  type="button"
                  aria-label={label}
                  title={label}
                  className={cn(
                    'flex items-center justify-center w-9 h-9 rounded-full text-white',
                    'transition-all duration-150',
                    'hover:scale-110 hover:bg-white/25',
                  )}
                  style={{ background: 'rgba(255,255,255,0.12)' }}
                >
                  {icon}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

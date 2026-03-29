'use client'

import InstagramIcon from '@mui/icons-material/Instagram'
import FacebookIcon from '@mui/icons-material/Facebook'
import { cn } from '@/lib/utils'

type SocialNetwork = 'Instagram' | 'Facebook' | 'TikTok'

type SocialBadgeProps = {
  network: SocialNetwork
  className?: string
}

/** Official TikTok "d" logo as inline SVG (MUI has no real TikTok icon) */
function TikTokIcon({ size = 16 }: { size?: number }) {
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

const SOCIAL_CONFIG: Record<
  SocialNetwork,
  {
    icon: React.ReactNode
    label: string
    textColor: string
    bgColor: string   // inline style for rgba bg
  }
> = {
  Instagram: {
    icon: <InstagramIcon sx={{ fontSize: 14 }} />,
    label: 'Instagram',
    textColor: 'text-[#ca38a5]',
    bgColor: 'rgba(202,56,165,0.10)',
  },
  Facebook: {
    icon: <FacebookIcon sx={{ fontSize: 14 }} />,
    label: 'Facebook',
    textColor: 'text-[#1877f2]',
    bgColor: 'rgba(24,119,242,0.10)',
  },
  TikTok: {
    icon: <TikTokIcon size={14} />,
    label: 'TikTok',
    textColor: 'text-[#010101]',
    bgColor: 'rgba(1,1,1,0.07)',
  },
}

export function SocialBadge({ network, className }: SocialBadgeProps) {
  const { icon, label, textColor, bgColor } = SOCIAL_CONFIG[network]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5',
        'text-xs font-medium',
        'rounded-pill px-2.5 py-1',
        textColor,
        className,
      )}
      style={{ background: bgColor }}
    >
      <span aria-hidden="true" className="flex items-center">{icon}</span>
      <span>{label}</span>
    </span>
  )
}

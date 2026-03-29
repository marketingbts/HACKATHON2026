import React from 'react'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Button } from './Button'

interface HeroCardProps {
  brandName?: string
  brandLogoUrl?: string
  socialNetworks?: React.ReactNode[]
  onStart?: () => void
  onContinue?: () => void
  className?: string
}

export function HeroCard({
  brandName = 'MATE.INC',
  brandLogoUrl,
  socialNetworks = [],
  onStart,
  onContinue,
  className,
}: HeroCardProps) {
  return (
    <div
      className={`rounded-[24px] bg-brand p-[48px] overflow-hidden flex flex-col md:flex-row relative justify-between gap-[24px] ${className || ''}`}
    >
      {/* Absolute SVG Decoration on the right */}
      <svg
        className="absolute right-0 top-0 h-full w-1/2 opacity-10 pointer-events-none"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="300" cy="200" r="150" fill="currentColor" />
        <path d="M200 0 L400 400 L0 400 Z" fill="currentColor" opacity="0.5" />
      </svg>

      {/* Left Content */}
      <div className="flex flex-col gap-[24px] max-w-[504px] z-10">
        <div className="inline-flex items-center gap-[4px] px-[17px] py-[5px] rounded-full border border-white/20 bg-white/20 backdrop-blur-[2px] w-fit">
          <span className="text-white text-[12px] leading-none">✦</span>
          <span className="text-[12px] font-bold text-white uppercase tracking-[1.2px]">
            IA Activa
          </span>
        </div>

        <h1 className="text-[48px] font-black leading-none text-surface-background m-0">
          ¿Qué contenido
          <br />
          creamos hoy?
        </h1>

        <p className="text-[18px] font-normal text-surface-primary-faded leading-[1.625] m-0">
          Explora diferentes alternativas generadas
          <br />
          por nuestra IA adaptadas a tu marca.
        </p>

        <div className="flex flex-row gap-[16px] pt-[16px]">
          <Button
            onClick={onStart}
            className="bg-surface-background text-brand font-bold text-[16px] rounded-[8px] px-[16px] py-[12px] shadow-[0_10px_15px_-3px_rgba(160,54,31,0.2)] hover:bg-surface-white border-0"
            iconRight={<ArrowForwardIcon fontSize="inherit" />}
          >
            Comenzar ahora
          </Button>
          <Button
            onClick={onContinue}
            className="bg-transparent text-surface-background border border-border-subtle font-bold text-[16px] rounded-[8px] px-[16px] py-[12px] hover:bg-white/10"
            iconRight={<ArrowForwardIcon fontSize="inherit" />}
          >
            Continuar
          </Button>
        </div>
      </div>

      {/* Right Content - Brand Info Card */}
      <div className="w-full md:w-[320px] bg-white/10 backdrop-blur-[12px] border border-white/20 rounded-[16px] p-[25px] flex flex-col gap-[24px] z-10 relative">
        <div className="flex flex-row items-center gap-[16px]">
          <div className="w-[48px] h-[48px] rounded-full bg-surface-background flex flex-shrink-0 items-center justify-center overflow-hidden">
            {brandLogoUrl ? (
              <img src={brandLogoUrl} alt={brandName} className="w-[40px] h-[40px] rounded-full object-cover" />
            ) : (
              <div className="w-[40px] h-[40px] rounded-full bg-brand-200" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-bold text-white/60 uppercase tracking-[-0.6px]">
              Tu Marca
            </span>
            <span className="text-[16px] font-bold text-surface-background">
              {brandName}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-[8px]">
          <span className="text-[10px] text-white/60 font-bold uppercase tracking-[1px]">
            Redes Sociales
          </span>
          <div className="flex flex-row gap-[8px]">
            {socialNetworks.length > 0 ? (
              socialNetworks.map((social, idx) => (
                <div key={idx} className="w-[32px] h-[34px] bg-white/20 rounded-[8px] flex items-center justify-center text-surface-background">
                  {social}
                </div>
              ))
            ) : (
              // Default mocked social icons
              <>
                <div className="w-[32px] h-[34px] bg-white/20 rounded-[8px] flex items-center justify-center text-surface-background text-[12px] font-bold">
                  IG
                </div>
                <div className="w-[32px] h-[34px] bg-white/20 rounded-[8px] flex items-center justify-center text-surface-background text-[12px] font-bold">
                  FB
                </div>
                <div className="w-[32px] h-[34px] bg-white/20 rounded-[8px] flex items-center justify-center text-surface-background text-[12px] font-bold">
                  in
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

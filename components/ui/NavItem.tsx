import Link from 'next/link'
import { cn } from '@/lib/utils'

type NavItemProps = {
  href: string
  label: string
  icon: React.ReactNode
  active?: boolean
}

export function NavItem({ href, label, icon, active = false }: NavItemProps) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center gap-3 w-[207px] py-3 no-underline',
        'text-sm transition-colors duration-150',
        active
          ? 'pl-4 pr-[18px] bg-surface-primary-subtle border-r-2 border-brand-600 font-bold text-brand-700'
          : 'px-4 font-normal text-neutral-600 hover:bg-surface-primary-subtle hover:text-brand-700',
      )}
    >
      <span className="w-[18px] h-5 shrink-0 flex items-center justify-center">
        {icon}
      </span>
      {label}
    </Link>
  )
}

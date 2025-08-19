
import type { NavItemProps } from '@/types'

export default function NavItem({ label, href, active }: NavItemProps) {
  return (
    <a
      href={href}
      className={`pb-1 transition-colors ${active
        ? 'text-secondary border-b-2 border-secondary'
        : 'text-text border-b-2 border-transparent hover:text-secondary'
        }`}
    >
      {label}
    </a>
  )
}

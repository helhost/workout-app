export type NavItem = {
  label: string
  href: string
};

export interface BannerProps {
  name: string
  navigation: NavItem[]
  className?: string
};

export type NavItemProps = {
  label: string
  href: string
  active?: boolean
}

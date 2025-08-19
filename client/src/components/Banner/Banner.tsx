import { useEffect, useState } from 'react';
import type { BannerProps } from '@/types';
import NavItem from './NavItem';
import ThemeSwitch from './ThemeSwitch';

export default function Banner({
  name,
  navigation,
  className,
  children,
}: BannerProps & { children?: React.ReactNode }) {
  const [path, setPath] = useState("");

  useEffect(() => {
    setPath(window.location.pathname);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 w-full h-14 sm:h-20 bg-primary ${className ?? ''}`}>
        <div className="h-full flex items-center justify-between px-4 md:px-6 lg:px-8">
          <div className="text-xl md:text-2xl font-bold text-text">
            {name}
          </div>
          <nav className="flex items-center gap-6">
            {navigation.map((item) => (
              <NavItem key={item.href} {...item} active={path === item.href} />
            ))}
            <ThemeSwitch />
          </nav>
        </div>
      </header>

      <div className="pt-14 sm:pt-20">
        {children}
      </div>
    </>
  );
}

"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname();
  
  return (
    <nav className="fixed w-full top-0 z-50">
      <div className="glass-effect bg-[var(--nav-bg)] border-b border-[var(--card-border)] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="LC Logo" width={40} height={40} />
              <span className="text-xl font-medium text-[var(--foreground)] ml-2">LC App</span>
            </Link>
            
            <div className="flex space-x-8">
              <Link 
                href="/" 
                className={`${
                  pathname === '/' 
                    ? 'text-[var(--blue-accent)]' 
                    : 'text-[var(--foreground)] hover:text-[var(--blue-accent)]'
                } transition-colors`}
              >
                Home
              </Link>
              <Link 
                href="/mail" 
                className={`${
                  pathname === '/mail' 
                    ? 'text-[var(--blue-accent)]' 
                    : 'text-[var(--foreground)] hover:text-[var(--blue-accent)]'
                } transition-colors`}
              >
                Mail
              </Link>
              <Link 
                href="/tools" 
                className={`${
                  pathname === '/tools' 
                    ? 'text-[var(--blue-accent)]' 
                    : 'text-[var(--foreground)] hover:text-[var(--blue-accent)]'
                } transition-colors`}
              >
                Tools
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 
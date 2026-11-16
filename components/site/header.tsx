'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Menu, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useSectionNav } from '@/hooks/use-section-nav'
import { cn } from '@/lib/utils'

const navLinks = [
  { id: 'inicio', label: 'Home' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'masters', label: 'Masters' },
  { id: 'metodo', label: 'Método' },
  { id: 'resultados', label: 'Resultados' },
]

interface HeaderProps {
  variant?: 'transparent' | 'solid'
}

export function Header({ variant = 'transparent' }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { scrollY } = useScroll()
  const { goToSection } = useSectionNav()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 24)
  })

  const isSolid = variant === 'solid' || isScrolled

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        isSolid
          ? 'border-b border-ccd-border bg-white/95' // sem backdrop-blur: era refeito a cada frame de scroll
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo-masters.png" alt="Masters CCD" width={52} height={52} priority />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={goToSection(link.id)}
              className={cn(
                'text-sm font-medium transition-colors',
                link.id === 'masters'
                  ? 'text-gradient-gold font-bold'
                  : isSolid
                    ? 'text-ccd-ink/70 hover:text-ccd-ink'
                    : 'text-white/80 hover:text-white',
              )}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button
            variant="ghost"
            nativeButton={false}
            className="rounded-xl bg-gradient-to-r from-ccd-gold to-ccd-gold-light font-semibold text-ccd-navy hover:opacity-90"
            render={<a href="#masters" onClick={goToSection('masters')} />}
          >
            Encontrar um Master
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className={cn(
            'flex size-9 items-center justify-center rounded-lg md:hidden',
            isSolid ? 'text-ccd-ink' : 'text-white',
          )}
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-ccd-border bg-white md:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(event) => {
                    goToSection(link.id)(event)
                    setIsMenuOpen(false)
                  }}
                  className={cn(
                    'rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-ccd-mist',
                    link.id === 'masters' ? 'text-gradient-gold font-bold' : 'text-ccd-ink/80',
                  )}
                >
                  {link.label}
                </a>
              ))}
              <Button
                variant="ghost"
                nativeButton={false}
                className="mt-2 w-full rounded-xl bg-gradient-to-r from-ccd-gold to-ccd-gold-light font-semibold text-ccd-navy hover:opacity-90"
                render={
                  <a
                    href="#masters"
                    onClick={(event) => {
                      goToSection('masters')(event)
                      setIsMenuOpen(false)
                    }}
                  />
                }
              >
                Encontrar um Master
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

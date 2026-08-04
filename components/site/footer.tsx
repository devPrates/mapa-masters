'use client'

import Link from 'next/link'

import { useSectionNav } from '@/hooks/use-section-nav'

const navLinks = [
  { id: 'sobre', label: 'Sobre' },
  { id: 'metodo', label: 'Método' },
  { id: 'masters', label: 'Masters' },
  { id: 'resultados', label: 'Resultados' },
  { id: 'faq', label: 'FAQ' },
]

const socialLinks = [
  { href: 'https://www.instagram.com/andersonmaisse', label: 'Instagram' },
  { href: 'https://www.youtube.com/@andersonmaisse', label: 'YouTube' },
  { href: 'https://www.linkedin.com/in/andersonmaisse', label: 'LinkedIn' },
]

export function Footer() {
  const { goToSection } = useSectionNav()

  return (
    <footer className="bg-ccd-navy-darker pt-16 pb-8 text-white/70">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-ccd-teal to-ccd-teal-light text-sm font-bold text-white">
                CCD
              </span>
              <span className="text-gradient-gold text-sm font-bold">Masters</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-white/60">
              Comunidade Contadores Digitais — a rede nacional de contadores parceiros formada
              pelo método CCD.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/10 px-4 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-white/30 hover:text-white"
                >
                  {social.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Navegação</p>
            <ul className="mt-4 space-y-2 text-sm">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={goToSection(link.id)}
                    className="text-white/60 hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Contato</p>
            <ul className="mt-4 space-y-2 text-sm text-white/60">
              <li>
                <a href="tel:+5567999595407" className="hover:text-white">
                  +55 67 99959-5407
                </a>
              </li>
              <li>
                <a href="mailto:contato@andersonmaisse.com" className="hover:text-white">
                  contato@andersonmaisse.com
                </a>
              </li>
              <li>
                <Link
                  href="https://andersonmaisse.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  Criado por Anderson Maisse
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row">
          <span>
            © {new Date().getFullYear()} CCD — Comunidade Contadores Digitais. Todos os direitos
            reservados.
          </span>
        </div>
      </div>
    </footer>
  )
}

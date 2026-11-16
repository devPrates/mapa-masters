'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Globe, Mail, Phone } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useSectionNav } from '@/hooks/use-section-nav'

// Mesma ordem do menu do topo, + FAQ (a seção continua na página).
const navLinks = [
  { id: 'inicio', label: 'Home' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'masters', label: 'Masters' },
  { id: 'metodo', label: 'Método' },
  { id: 'resultados', label: 'Resultados' },
  { id: 'faq', label: 'FAQ' },
]

const socialLinks = [
  { href: 'https://www.instagram.com/andersonmaisse', label: 'Instagram' },
  { href: 'https://www.youtube.com/@andersonmaisse', label: 'YouTube' },
  { href: 'https://www.linkedin.com/in/andersonmaisse', label: 'LinkedIn' },
]

const contatos = [
  { href: 'tel:+5567999595407', label: '+55 67 99959-5407', icone: Phone, externo: false },
  { href: 'mailto:contato@andersonmaisse.com', label: 'contato@andersonmaisse.com', icone: Mail, externo: false },
  { href: 'https://andersonmaisse.com', label: 'andersonmaisse.com', icone: Globe, externo: true },
]

/*
 * Rodapé na linguagem do site: navy profundo, grid sutil, brilhos em gradiente
 * e marca d'água "CCD MASTER" ao fundo. Estático (sem animação).
 */
export function Footer() {
  const { goToSection } = useSectionNav()

  return (
    <footer className="relative overflow-hidden bg-ccd-navy-darker text-white/70">
      {/* Fundo: grid sutil + brilhos teal/dourado (gradiente, sem blur) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(8,146,165,0.18),transparent_40%),radial-gradient(circle_at_90%_30%,rgba(201,145,13,0.12),transparent_40%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]"
      />

      <div className="relative mx-auto max-w-6xl px-4 md:px-8">
        {/* Chamada principal */}
        <div className="flex flex-col items-start justify-between gap-6 border-b border-white/10 py-14 md:flex-row md:items-center">
          <div>
            <p className="font-mono text-[11px] tracking-[0.3em] text-ccd-teal-light/80 uppercase">
              Rede nacional de contadores
            </p>
            <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
              Encontre o <span className="text-gradient-gold">CCD Master</span> da sua região
            </h2>
          </div>
          <Button
            variant="ghost"
            size="lg"
            nativeButton={false}
            className="h-11 shrink-0 rounded-xl bg-linear-to-r from-ccd-gold to-ccd-gold-light px-6 font-semibold text-ccd-navy hover:opacity-90"
            render={<a href="#masters" onClick={goToSection('masters')} />}
          >
            Ver Masters no mapa
            <ArrowRight className="size-4" />
          </Button>
        </div>

        {/* Colunas */}
        <div className="grid gap-10 py-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image src="/logo-masters.png" alt="Masters CCD" width={48} height={48} />
              <span className="text-sm leading-tight font-semibold text-white">
                Masters CCD
                <span className="block text-xs font-normal text-white/50">
                  Comunidade Contadores Digitais
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/55">
              A rede nacional de contadores parceiros formada pelo método CCD, criado por
              Anderson Maisse, levando contabilidade consultiva e estratégica a todo o Brasil.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-ccd-teal/50 hover:text-white"
                >
                  {social.label}
                  <ArrowUpRight className="size-3 text-white/40 transition-colors group-hover:text-ccd-teal-light" />
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-3">
            <p className="font-mono text-[11px] tracking-[0.25em] text-white/40 uppercase">Navegação</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm md:grid-cols-1">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={goToSection(link.id)}
                    className="text-white/60 transition-colors hover:text-ccd-gold-light"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="font-mono text-[11px] tracking-[0.25em] text-white/40 uppercase">Contato</p>
            <ul className="mt-4 space-y-3 text-sm">
              {contatos.map((contato) => (
                <li key={contato.href}>
                  <a
                    href={contato.href}
                    {...(contato.externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group flex items-center gap-3 text-white/60 transition-colors hover:text-white"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-colors group-hover:border-ccd-teal/50">
                      <contato.icone className="size-3.5 text-ccd-teal-light" />
                    </span>
                    {contato.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Marca d'água */}
      <p
        aria-hidden
        className="pointer-events-none relative -mb-[0.22em] text-center text-[18vw] leading-none font-bold tracking-tight text-white/[0.035] select-none md:text-[13vw]"
      >
        CCD MASTER
      </p>

      {/* Crédito discreto */}
      <div className="relative border-t border-white/10 py-6 text-center text-sm text-white/45">
        Developed by{' '}
        <Link
          href="https://devprates.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-ccd-gold-light transition-colors hover:text-ccd-gold"
        >
          devPrates
        </Link>{' '}
        © 2026
      </div>
    </footer>
  )
}

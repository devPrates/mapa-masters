'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Volume2 } from 'lucide-react'

import { cn } from '@/lib/utils'

interface YouTubeAutoplayProps {
  /** ID ou link do vídeo no YouTube. Vazio/inválido = "Vídeo em breve". */
  videoId: string
  title: string
  className?: string
}

/*
 * Player do YouTube leve e com autoplay:
 * - Até entrar na tela: só a thumbnail (nada do YouTube é carregado).
 * - Ao entrar (~40% visível): carrega o iframe tocando MUDO — navegadores só
 *   permitem autoplay sem som. O botão "Ativar som" liga o áudio.
 * - Ao sair da tela: pausa. Ao voltar: continua.
 * Controle via postMessage (enablejsapi=1), sem carregar a API JS do YouTube.
 */
// Aceita o ID puro ou qualquer link do YouTube:
// youtu.be/ID, youtube.com/watch?v=ID, /embed/ID, /shorts/ID
function toYouTubeId(input: string): string {
  const value = input.trim()
  const match = value.match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([\w-]{11})/,
  )
  if (match) return match[1]
  return /^[\w-]{11}$/.test(value) ? value : ''
}

export function YouTubeAutoplay({ videoId: videoInput, title, className }: YouTubeAutoplayProps) {
  const videoId = toYouTubeId(videoInput)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [startMuted, setStartMuted] = useState(true)
  const [muted, setMuted] = useState(true)

  const command = (func: string, args: unknown[] = []) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func, args }),
      '*',
    )
  }

  useEffect(() => {
    const el = wrapperRef.current
    if (!el || !videoId) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoaded(true)
          command('playVideo')
        } else {
          command('pauseVideo')
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [videoId])

  // Clique na thumbnail = gesto do usuário → pode começar já com som.
  const playWithSound = () => {
    setStartMuted(false)
    setMuted(false)
    setLoaded(true)
  }

  const unmute = () => {
    command('unMute')
    command('setVolume', [100])
    command('playVideo')
    setMuted(false)
  }

  const params = new URLSearchParams({
    autoplay: '1',
    mute: startMuted ? '1' : '0',
    playsinline: '1',
    rel: '0',
    modestbranding: '1',
    enablejsapi: '1',
    loop: '1',
    playlist: videoId, // necessário para o loop funcionar
  })

  return (
    <div
      ref={wrapperRef}
      className={cn(
        'relative aspect-video w-full overflow-hidden rounded-3xl bg-ccd-navy-darker',
        className,
      )}
    >
      {!videoId ? (
        <div className="flex size-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_30%_20%,rgba(8,146,165,0.35),transparent_55%),radial-gradient(circle_at_80%_90%,rgba(201,145,13,0.25),transparent_50%)] text-white">
          <span className="flex size-16 items-center justify-center rounded-full border border-white/20 bg-white/10">
            <Play className="ml-1 size-7" />
          </span>
          <span className="font-mono text-xs tracking-[0.3em] text-white/60 uppercase">
            Vídeo em breve
          </span>
        </div>
      ) : loaded ? (
        <>
          <iframe
            ref={iframeRef}
            src={`https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
          {muted && (
            <button
              type="button"
              onClick={unmute}
              className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-ccd-navy/85 px-4 py-2 text-sm font-semibold text-white shadow-lg ring-1 ring-white/15 transition hover:bg-ccd-teal"
            >
              <Volume2 className="size-4" />
              Ativar som
            </button>
          )}
        </>
      ) : (
        <button
          type="button"
          onClick={playWithSound}
          aria-label={`Assistir: ${title}`}
          className="group absolute inset-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
            alt=""
            loading="lazy"
            className="size-full object-cover"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-ccd-navy-darker/30 transition group-hover:bg-ccd-navy-darker/15">
            <span className="flex size-16 items-center justify-center rounded-full bg-linear-to-br from-ccd-teal to-ccd-teal-light text-white shadow-xl transition group-hover:scale-105">
              <Play className="ml-1 size-7" />
            </span>
          </span>
        </button>
      )}
    </div>
  )
}

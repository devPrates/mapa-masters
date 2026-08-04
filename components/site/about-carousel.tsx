'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

const images = [
  { src: '/carousel-01.webp', alt: 'Anderson Maisse — foto 1' },
  { src: '/carousel-02.jpeg', alt: 'Anderson Maisse — foto 2' },
  { src: '/carousel-03.webp', alt: 'Anderson Maisse — foto 3' },
  { src: '/carousel-04.jpeg', alt: 'Anderson Maisse — foto 4' },
]

const AUTOPLAY_INTERVAL_MS = 4000

export function AboutCarousel() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % images.length)
    }, AUTOPLAY_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative aspect-square">
      <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-gradient-to-br from-ccd-navy to-ccd-teal">
        {images.map((image, i) => (
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 768px) 480px, 100vw"
            priority={i === 0}
            className={`object-cover transition-opacity duration-1000 ease-in-out ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        <div className="absolute inset-x-6 bottom-6 flex justify-end gap-2">
          {images.map((image, i) => (
            <span
              key={image.src}
              className={`size-1.5 rounded-full transition-colors ${
                i === index ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="absolute -bottom-6 left-6 rounded-2xl bg-white/90 px-4 py-3 shadow-lg backdrop-blur-md">
        <p className="font-semibold text-ccd-ink">Anderson Maisse</p>
        <p className="text-xs text-ccd-ink/60">Fundador · Mentor · Palestrante</p>
      </div>
    </div>
  )
}

import { About } from '@/components/site/about'
import { Faq } from '@/components/site/faq'
import { Footer } from '@/components/site/footer'
import { Header } from '@/components/site/header'
import { Hero } from '@/components/site/hero'
import { HowItWorks } from '@/components/site/how-it-works'
import { MastersIntro } from '@/components/site/masters-intro'
import { MastersSection } from '@/components/site/masters-section'
import { Preloader } from '@/components/site/preloader'
import { ProgramaStats } from '@/components/site/programa-stats'
import { ScrollTriggerRefresher } from '@/components/site/scroll-trigger-refresher'
import { ScrollToStoredSection } from '@/components/site/scroll-to-stored-section'
import { Testimonials } from '@/components/site/testimonials'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Preloader />
      <ScrollToStoredSection />
      <ScrollTriggerRefresher />
      <Header />
      <main className="w-full">
        <Hero />
        <MastersIntro />
        <About />
        <HowItWorks />
        <MastersSection />
        <ProgramaStats />
        <Testimonials />
        <Faq />
      </main>
      <Footer />
    </div>
  )
}

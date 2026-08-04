import Link from 'next/link'

import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Reveal } from '@/components/ui/reveal'

const faqs = [
  {
    pergunta: 'O que é contabilidade digital?',
    resposta:
      'Contabilidade digital é o modelo de negócio que utiliza tecnologia e automação para transformar escritórios contábeis em negócios lucrativos e escaláveis, focando em vendas, gestão eficiente e crescimento acelerado.',
  },
  {
    pergunta: 'Quem é Anderson Maisse?',
    resposta:
      'Anderson Maisse é contador, mentor, palestrante e criador do CCD (Comunidade Contabilidade Digital). Com mais de 15 anos de experiência, já ajudou mais de 3.000 contadores a transformarem seus escritórios em negócios lucrativos e escaláveis.',
  },
  {
    pergunta: 'O que é o CCD?',
    resposta:
      'CCD (Comunidade Contabilidade Digital) é o método comprovado criado por Anderson Maisse que traz mais clientes, multiplica o faturamento e tira o contador do operacional, com resultados em 4 semanas.',
  },
  {
    pergunta: 'Anderson Maisse faz palestras?',
    resposta:
      'Sim! Anderson Maisse realiza palestras corporativas presenciais e online sobre Vendas, Gestão, Tecnologia e Crescimento Acelerado para escritórios contábeis. Já palestrou em eventos como ABSCON, CRCs e SESCONs pelo Brasil.',
  },
  {
    pergunta: 'Quais cursos Anderson Maisse oferece?',
    resposta:
      'Anderson Maisse oferece diversos cursos e programas: CCD (Comunidade Contabilidade Digital), Contabilidade Digital 360, Vendas pelo YouTube, Guia de Precificação, Guia de Processos, Manual Rápido da Contabilidade Digital, além de mentorias em grupo e VIP.',
  },
]

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-24 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <Reveal className="text-center">
          <div className="flex justify-center">
            <Badge variant="teal">Perguntas frequentes</Badge>
          </div>
          <h2 className="mt-4 text-3xl font-bold text-ccd-ink md:text-4xl">
            Tire suas dúvidas sobre a CCD
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <Accordion defaultValue={[0]}>
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.pergunta} value={index}>
                <AccordionTrigger>{faq.pergunta}</AccordionTrigger>
                <AccordionPanel>{faq.resposta}</AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>

        <p className="mt-8 text-center text-sm text-ccd-ink/60">
          Ainda tem dúvidas? Conheça o método completo em{' '}
          <Link
            href="https://andersonmaisse.com/ccdlesp/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-ccd-teal"
          >
            andersonmaisse.com/ccdlesp
          </Link>
        </p>
      </div>
    </section>
  )
}

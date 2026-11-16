// Contrato entre o preloader (components/site/preloader.tsx), a hero e o
// script inline do app/layout.tsx.
//
// <html data-js>         → JS rodando (sem JS o overlay nunca aparece)
// <html data-preloaded>  → o preloader já rodou neste carregamento de página
//
// Regra: o preloader roda em TODO carregamento completo da home (abrir, F5).
// Navegações internas (home → Master → home) não recarregam o documento: o
// <html> continua com data-preloaded e o preloader não aparece.
// Se o carregamento começou em outra página (ex.: /masters/x), o script já
// marca data-preloaded — ir para a home depois é navegação, não abertura.

export const PRELOADER_EVENT = 'ccd:preloader-done'

// Roda no <head> antes da primeira pintura (só em carregamento completo).
// Mantido como string pura porque vai em dangerouslySetInnerHTML.
export const PRELOADER_INLINE_SCRIPT = `(function(){var d=document.documentElement;d.setAttribute('data-js','');if(location.pathname!=='/')d.setAttribute('data-preloaded','')})();`

export function isPreloaderDone(): boolean {
  return document.documentElement.hasAttribute('data-preloaded')
}

/**
 * Chama `cb` quando a hero pode fazer a entrada.
 * `viaPreloader` = true quando a hero está recebendo o "CCD Master" do preloader.
 * Retorna a função de limpeza do listener.
 */
export function whenPreloaderDone(cb: (viaPreloader: boolean) => void): () => void {
  if (isPreloaderDone()) {
    cb(false)
    return () => {}
  }
  const handler = () => cb(true)
  window.addEventListener(PRELOADER_EVENT, handler, { once: true })
  return () => window.removeEventListener(PRELOADER_EVENT, handler)
}

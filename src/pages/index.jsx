// FASE 3 — añadir SSR con Vike + React Helmet aquí
// Esta página será la landing principal que redirige o renderiza según el idioma

import Home from './home';

// FASE 3: Descomentar para usar con Vike
// export { Page }
// 
// FASE 3: Configurar metadata directamente en +config.js
// export const config = {
//   prerender: true,
//   renderMode: 'SSR'
// }

// FASE 3: Usar React Helmet para meta tags
// import { Helmet } from 'react-helmet-async'
// import { generateMetaTags } from '../config/seo.config'

export default function Page() {
  // FASE 3: const metaTags = generateMetaTags('home', 'es')
  
  return (
    <>
      {/* FASE 3: Inyectar meta tags con Helmet */}
      {/*
      <Helmet>
        <title>{metaTags.title}</title>
        <meta name="description" content={metaTags.description} />
        <meta name="keywords" content={metaTags.keywords} />
        <meta property="og:title" content={metaTags['og:title']} />
        <meta property="og:description" content={metaTags['og:description']} />
        <meta property="og:image" content={metaTags['og:image']} />
        <link rel="canonical" href={metaTags.canonical} />
      </Helmet>
      */}
      
      <Home />
    </>
  );
}

// FASE 3: Exportar config para Vike
// export const documentProps = {
//   title: 'Oryon Labs | Automatización IA para PyMEs',
//   description: 'Automatizamos la captación de leads...'
// }

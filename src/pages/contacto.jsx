// FASE 3 — añadir SSR con Vike + React Helmet aquí

import Contact from '../components/sections/Contact';

// FASE 3: Configurar SSR con Vike
// export const config = {
//   prerender: true,
//   renderMode: 'SSR'
// }

// FASE 3: Generar meta tags con React Helmet
// import { Helmet } from 'react-helmet-async'
// import { generateMetaTags } from '../config/seo.config'

export default function ContactoPage() {
  // FASE 3: const metaTags = generateMetaTags('contacto', 'es')
  
  return (
    <>
      {/* FASE 3: Meta tags con Helmet */}
      {/*
      <Helmet>
        <title>{metaTags.title}</title>
        <meta name="description" content={metaTags.description} />
        <meta property="og:title" content={metaTags['og:title']} />
        <meta property="og:description" content={metaTags['og:description']} />
      </Helmet>
      */}
      
      <Contact />
    </>
  );
}

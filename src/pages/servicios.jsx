// FASE 3 — añadir SSR con Vike + React Helmet aquí

import Services from '../components/sections/Services';

// FASE 3: Configurar SSR con Vike
// export const config = {
//   prerender: true,
//   renderMode: 'SSR'
// }

// FASE 3: Generar meta tags con React Helmet
// import { Helmet } from 'react-helmet-async'
// import { generateMetaTags } from '../config/seo.config'

export default function ServiciosPage() {
  // FASE 3: const metaTags = generateMetaTags('servicios', 'es')
  
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
      
      <Services />
    </>
  );
}

import Hero from '../components/sections/Hero';
import WhyOryonLabs from '../components/sections/WhyOryonLabs';
import Services from '../components/sections/Services';
import Process from '../components/sections/Process';
import Pricing from '../components/sections/Pricing';
import Testimonials from '../components/sections/Testimonials';
import FAQ from '../components/sections/FAQ';
import Contact from '../components/sections/Contact';

// FASE 3: Estructura preparada para Vike SSR
// El orden de secciones está optimizado para conversión:
// Hero → Credibilidad → Servicios → Proceso → Precios → Testimonios → FAQ → Contacto

export default function Home() {
  return (
    <>
      {/* Hero: Hook inicial + Trust bar logos */}
      <Hero />

      {/* Why Oryon Labs: Pain vs solución */}
      <WhyOryonLabs />

      {/* Services: Qué ofrecemos */}
      <Services />
      
      {/* Process: Cómo trabajamos */}
      <Process />
      
      {/* Pricing: Cuánto cuesta */}
      <Pricing />
      
      {/* Testimonials: Prueba social */}
      <Testimonials />
      
      {/* FAQ: Eliminar objeciones */}
      <FAQ />
      
      {/* Contact: Conversión final */}
      <Contact />
    </>
  );
}

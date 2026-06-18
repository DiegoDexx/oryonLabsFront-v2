import { useLocation } from 'react-router-dom';
import { HelmetSEO, seoData } from '../seo';
import Hero from '../components/sections/Hero';
import WhyOryonLabs from '../components/sections/WhyOryonLabs';
import Services from '../components/sections/Services';
import Process from '../components/sections/Process';
import Pricing from '../components/sections/Pricing';
import Testimonials from '../components/sections/Testimonials';
import FAQ from '../components/sections/FAQ';
import Contact from '../components/sections/Contact';

export default function Home() {
  const location = useLocation();
  const lang = location.pathname.split('/')[1] === 'en' ? 'en' : 'es';
  const seo = seoData[lang].home;

  return (
    <>
      <HelmetSEO {...seo} />
      <Hero />
      <WhyOryonLabs />
      <Services />
      <Process />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Contact />
    </>
  );
}

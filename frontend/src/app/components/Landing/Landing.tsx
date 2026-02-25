import { Hero } from './sections/Hero/Hero';
import { HowItWorks } from './sections/HowItWorks/HowItWorks';
import { Features } from './sections/Features/Features';
import { Footer } from './sections/Footer/Footer';

export function Landing() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <Footer />
    </>
  );
}

import { Hero } from './sections/Hero/Hero';
import { HowItWorks } from './sections/HowItWorks/HowItWorks';
import { Features } from './sections/Features/Features';
import { Footer } from './sections/Footer/Footer';
import { FoodDecor } from '@/app/components/ui/FoodDecor/FoodDecor';

export function Landing() {
  return (
    <>
      <FoodDecor>
        <Hero />
      </FoodDecor>
      <HowItWorks />
      <Features />
      <Footer />
    </>
  );
}

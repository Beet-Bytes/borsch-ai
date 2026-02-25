import type { IconName } from '@/app/components/ui/Icon/icons';

export interface Feature {
  icon: IconName;
  title: string;
  description: string;
}

export interface Stat {
  value: string;
  label: string;
}

export const features: Feature[] = [
  {
    icon: 'flame',
    title: 'Cook from what you have',
    description:
      'Enter your ingredients and get instant recipe suggestions. No more staring at the fridge.',
  },
  {
    icon: 'ai',
    title: 'AI recipe assistant',
    description:
      'Personalized recipes powered by AI — tailored to your taste, dietary needs, and skill level.',
  },
  {
    icon: 'statistic',
    title: 'Reduce food waste',
    description:
      'Smart tracking helps you use what you buy. Less waste, more savings, better habits.',
  },
  {
    icon: 'shop-cart',
    title: 'Auto shopping lists',
    description: 'Plan your meals for the week and get a ready-to-go shopping list in one tap.',
  },
];

export interface Step {
  number: string;
  icon: IconName;
  title: string;
  description: string;
}

export const steps: Step[] = [
  {
    number: '01',
    icon: 'make-photo',
    title: 'Scan your fridge',
    description:
      'Take a photo or list what you have. AI-Borsch identifies your ingredients in seconds.',
  },
  {
    number: '02',
    icon: 'ai',
    title: 'Get AI recipes',
    description:
      'Our AI generates personalized recipes based on exactly what you have, your taste, and dietary needs.',
  },
  {
    number: '03',
    icon: 'flame',
    title: 'Cook & track',
    description:
      'Follow step-by-step instructions, track calories, and build better eating habits over time.',
  },
];

export const stats: Stat[] = [
  { value: '2k+', label: 'Recipes' },
  { value: '40%', label: 'Less Waste' },
  { value: '5 min', label: 'Avg Cook Time' },
];

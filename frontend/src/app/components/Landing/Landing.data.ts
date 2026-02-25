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

export const stats: Stat[] = [
  { value: '2k+', label: 'Recipes' },
  { value: '40%', label: 'Less Waste' },
  { value: '5 min', label: 'Avg Cook Time' },
];

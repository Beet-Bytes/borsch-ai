import type { ReactNode, ComponentType, CSSProperties } from 'react';
import {
  Apple,
  Beef,
  Carrot,
  Cherry,
  Cookie,
  Croissant,
  Egg,
  Fish,
  Grape,
  Salad,
  Sandwich,
  Soup,
  Wheat,
  Citrus,
} from 'lucide-react';
import styles from './FoodDecor.module.css';

interface IconConfig {
  id: string;
  side: 'left' | 'right';
  top: string;
  offset: string;
  size: number;
  rotation?: number;
  opacity?: number;
  component: ComponentType<{ size: number }>;
}

export interface FoodDecorProps {
  children: ReactNode;
  className?: string;
}

const ICONS: IconConfig[] = [
  // LEFT SIDE – outer ring (big, near edge)
  {
    id: 'carrot-left-outer-top',
    side: 'left',
    top: '4%',
    offset: '2%',
    size: 52,
    rotation: -18,
    opacity: 0.32,
    component: (props) => <Carrot {...props} />,
  },
  {
    id: 'salad-left-outer-upper',
    side: 'left',
    top: '18%',
    offset: '2.5%',
    size: 54,
    rotation: -10,
    opacity: 0.3,
    component: (props) => <Salad {...props} />,
  },
  {
    id: 'egg-left-outer-mid',
    side: 'left',
    top: '36%',
    offset: '3%',
    size: 50,
    rotation: -6,
    opacity: 0.3,
    component: (props) => <Egg {...props} />,
  },
  {
    id: 'cherry-left-outer-lower',
    side: 'left',
    top: '56%',
    offset: '2%',
    size: 48,
    rotation: -22,
    opacity: 0.32,
    component: (props) => <Cherry {...props} />,
  },
  {
    id: 'soup-left-outer-bottom',
    side: 'left',
    top: '78%',
    offset: '3%',
    size: 50,
    rotation: -8,
    opacity: 0.3,
    component: (props) => <Soup {...props} />,
  },

  // LEFT SIDE – mid ring (medium, closer to center)
  {
    id: 'croissant-left-mid-upper',
    side: 'left',
    top: '10%',
    offset: '10%',
    size: 40,
    rotation: 18,
    opacity: 0.26,
    component: (props) => <Croissant {...props} />,
  },
  {
    id: 'grape-left-mid',
    side: 'left',
    top: '28%',
    offset: '13%',
    size: 36,
    rotation: -14,
    opacity: 0.26,
    component: (props) => <Grape {...props} />,
  },
  {
    id: 'carrot-left-mid',
    side: 'left',
    top: '46%',
    offset: '15%',
    size: 34,
    rotation: -10,
    opacity: 0.24,
    component: (props) => <Carrot {...props} />,
  },
  {
    id: 'salad-left-mid-lower',
    side: 'left',
    top: '64%',
    offset: '13%',
    size: 36,
    rotation: -6,
    opacity: 0.24,
    component: (props) => <Salad {...props} />,
  },
  {
    id: 'egg-left-mid-bottom',
    side: 'left',
    top: '84%',
    offset: '11%',
    size: 34,
    rotation: -12,
    opacity: 0.26,
    component: (props) => <Egg {...props} />,
  },

  // LEFT SIDE – inner ring (small, near hero center)
  {
    id: 'cherry-left-inner-top',
    side: 'left',
    top: '14%',
    offset: '20%',
    size: 26,
    rotation: -18,
    opacity: 0.22,
    component: (props) => <Cherry {...props} />,
  },
  {
    id: 'croissant-left-inner',
    side: 'left',
    top: '36%',
    offset: '22%',
    size: 24,
    rotation: 16,
    opacity: 0.2,
    component: (props) => <Croissant {...props} />,
  },
  {
    id: 'soup-left-inner',
    side: 'left',
    top: '58%',
    offset: '24%',
    size: 22,
    rotation: -10,
    opacity: 0.2,
    component: (props) => <Soup {...props} />,
  },
  {
    id: 'grape-left-inner-bottom',
    side: 'left',
    top: '78%',
    offset: '21%',
    size: 20,
    rotation: -14,
    opacity: 0.22,
    component: (props) => <Grape {...props} />,
  },

  // RIGHT SIDE – outer ring (big, near edge)
  {
    id: 'apple-right-outer-top',
    side: 'right',
    top: '6%',
    offset: '2%',
    size: 52,
    rotation: 18,
    opacity: 0.32,
    component: (props) => <Apple {...props} />,
  },
  {
    id: 'wheat-right-outer-upper',
    side: 'right',
    top: '20%',
    offset: '2.5%',
    size: 56,
    rotation: -18,
    opacity: 0.32,
    component: (props) => <Wheat {...props} />,
  },
  {
    id: 'cookie-right-outer-mid',
    side: 'right',
    top: '40%',
    offset: '3%',
    size: 52,
    rotation: 12,
    opacity: 0.3,
    component: (props) => <Cookie {...props} />,
  },
  {
    id: 'fish-right-outer-lower',
    side: 'right',
    top: '60%',
    offset: '2%',
    size: 48,
    rotation: -16,
    opacity: 0.3,
    component: (props) => <Fish {...props} />,
  },
  {
    id: 'beef-right-outer-bottom',
    side: 'right',
    top: '80%',
    offset: '3%',
    size: 50,
    rotation: 10,
    opacity: 0.3,
    component: (props) => <Beef {...props} />,
  },

  // RIGHT SIDE – mid ring (medium, closer to center)
  {
    id: 'citrus-right-mid-upper',
    side: 'right',
    top: '12%',
    offset: '10%',
    size: 38,
    rotation: 22,
    opacity: 0.26,
    component: (props) => <Citrus {...props} />,
  },
  {
    id: 'fish-right-mid',
    side: 'right',
    top: '30%',
    offset: '13%',
    size: 36,
    rotation: -14,
    opacity: 0.26,
    component: (props) => <Fish {...props} />,
  },
  {
    id: 'sandwich-right-mid',
    side: 'right',
    top: '50%',
    offset: '15%',
    size: 34,
    rotation: 10,
    opacity: 0.24,
    component: (props) => <Sandwich {...props} />,
  },
  {
    id: 'cookie-right-mid-lower',
    side: 'right',
    top: '70%',
    offset: '13%',
    size: 36,
    rotation: 8,
    opacity: 0.24,
    component: (props) => <Cookie {...props} />,
  },
  {
    id: 'apple-right-mid-bottom',
    side: 'right',
    top: '88%',
    offset: '11%',
    size: 34,
    rotation: 16,
    opacity: 0.24,
    component: (props) => <Apple {...props} />,
  },

  // RIGHT SIDE – inner ring (small, near hero center)
  {
    id: 'wheat-right-inner-top',
    side: 'right',
    top: '16%',
    offset: '20%',
    size: 26,
    rotation: -20,
    opacity: 0.22,
    component: (props) => <Wheat {...props} />,
  },
  {
    id: 'citrus-right-inner',
    side: 'right',
    top: '38%',
    offset: '22%',
    size: 24,
    rotation: 18,
    opacity: 0.22,
    component: (props) => <Citrus {...props} />,
  },
  {
    id: 'sandwich-right-inner',
    side: 'right',
    top: '60%',
    offset: '24%',
    size: 22,
    rotation: 10,
    opacity: 0.2,
    component: (props) => <Sandwich {...props} />,
  },
  {
    id: 'grape-right-inner-bottom',
    side: 'right',
    top: '80%',
    offset: '21%',
    size: 20,
    rotation: -16,
    opacity: 0.22,
    component: (props) => <Grape {...props} />,
  },
];

export const FoodDecor = ({ children, className }: FoodDecorProps) => {
  const rootClassName = [styles.root, className ?? ''].filter(Boolean).join(' ');

  return (
    <div className={rootClassName}>
      {children}
      {ICONS.map((icon) => {
        const IconComponent = icon.component;

        const style: CSSProperties = {
          top: icon.top,
          [icon.side === 'left' ? 'left' : 'right']: icon.offset,
          transform: icon.rotation ? `rotate(${icon.rotation}deg)` : undefined,
          opacity: icon.opacity ?? 0.25,
        };

        return (
          <span key={icon.id} className={styles.icon} style={style}>
            <IconComponent size={icon.size} />
          </span>
        );
      })}
    </div>
  );
};

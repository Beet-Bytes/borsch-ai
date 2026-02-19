import type { SVGProps } from 'react';
import { icons, type IconName } from './icons';

type IconSize = 'sm' | 'md' | 'lg';

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: IconSize;
}

const sizeMap: Record<IconSize, number> = {
  sm: 16,
  md: 24,
  lg: 32,
};

export const Icon = ({ name, size = 'md', ...props }: IconProps) => {
  const SvgIcon = icons[name];
  const px = sizeMap[size];

  return <SvgIcon width={px} height={px} {...props} />;
};

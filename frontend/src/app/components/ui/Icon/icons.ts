import AiIcon from '@/app/assets/icons/ai.svg';
import ArrowRightIcon from '@/app/assets/icons/arrow-right.svg';
import ChevronDownIcon from '@/app/assets/icons/chevron-down.svg';
import ChevronUpIcon from '@/app/assets/icons/chevron-up.svg';
import ErrorIcon from '@/app/assets/icons/error.svg';
import FavIcon from '@/app/assets/icons/fav.svg';
import FlagIcon from '@/app/assets/icons/flag.svg';
import FlameIcon from '@/app/assets/icons/flame.svg';
import GoodMarkIcon from '@/app/assets/icons/good_mark.svg';
import HeartIcon from '@/app/assets/icons/heart.svg';
import HomeIcon from '@/app/assets/icons/home.svg';
import ImgUploadIcon from '@/app/assets/icons/img_upload.svg';
import InfoIcon from '@/app/assets/icons/info.svg';
import MakePhotoIcon from '@/app/assets/icons/make_photo.svg';
import MoonIcon from '@/app/assets/icons/moon.svg';
import NotifIcon from '@/app/assets/icons/notif.svg';
import PlusIcon from '@/app/assets/icons/plus.svg';
import ProfileIcon from '@/app/assets/icons/profile.svg';
import Profile2Icon from '@/app/assets/icons/profile_2.svg';
import PulseIcon from '@/app/assets/icons/pulse.svg';
import SaveIcon from '@/app/assets/icons/save.svg';
import SearchIcon from '@/app/assets/icons/search.svg';
import SendIcon from '@/app/assets/icons/send.svg';
import ShopCartIcon from '@/app/assets/icons/shop_cart.svg';
import StatisticIcon from '@/app/assets/icons/statistic.svg';
import SunIcon from '@/app/assets/icons/sun.svg';
import WarningIcon from '@/app/assets/icons/warning.svg';
import XIcon from '@/app/assets/icons/x.svg';
import CheckIcon from '@/app/assets/icons/check.svg';
import LogoIcon from '@/app/assets/icons/Logo32X32.svg';

export const icons = {
  ai: AiIcon,
  'arrow-right': ArrowRightIcon,
  'chevron-down': ChevronDownIcon,
  'chevron-up': ChevronUpIcon,
  error: ErrorIcon,
  fav: FavIcon,
  flag: FlagIcon,
  flame: FlameIcon,
  'good-mark': GoodMarkIcon,
  heart: HeartIcon,
  home: HomeIcon,
  'img-upload': ImgUploadIcon,
  info: InfoIcon,
  'make-photo': MakePhotoIcon,
  moon: MoonIcon,
  notif: NotifIcon,
  plus: PlusIcon,
  profile: ProfileIcon,
  'profile-2': Profile2Icon,
  pulse: PulseIcon,
  save: SaveIcon,
  search: SearchIcon,
  send: SendIcon,
  'shop-cart': ShopCartIcon,
  statistic: StatisticIcon,
  sun: SunIcon,
  warning: WarningIcon,
  x: XIcon,
  check: CheckIcon,
  logo: LogoIcon,
} as const;

export type IconName = keyof typeof icons;

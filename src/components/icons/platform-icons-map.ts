/**
 * Platform Icons Map - Maps platform IDs to their icon components
 */

import type { SocialPlatform } from '@/types/connections'
import {
  YouTubeIcon,
  InstagramIcon,
  TikTokIcon,
  XIcon,
  LinkedInIcon,
  PinterestIcon,
  FacebookIcon,
  BlueskyIcon,
  ThreadsIcon,
} from './PlatformIcons'

interface IconProps {
  className?: string
}

export const platformIcons: Record<SocialPlatform, React.ComponentType<IconProps>> = {
  youtube: YouTubeIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  twitter: XIcon,
  linkedin: LinkedInIcon,
  pinterest: PinterestIcon,
  facebook: FacebookIcon,
  bluesky: BlueskyIcon,
  threads: ThreadsIcon,
}

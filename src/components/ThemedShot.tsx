import type { Locale } from '../data/i18n';

interface ThemedShotProps {
  /** Base filename without `-{zh|en}-{dark|light}.png`, e.g. `readme-hero` or `readme-feat-mesh` */
  name: string;
  locale: Locale;
  alt: string;
  eager?: boolean;
  className?: string;
}

/**
 * Renders a bilingual, light/dark-aware product screenshot that responds immediately
 * to the website's Tailwind `dark` class toggle as well as locale switches.
 */
export function ThemedShot({
  name,
  locale,
  alt,
  eager = false,
  className = '',
}: ThemedShotProps) {
  const lang = locale === 'zh' ? 'zh' : 'en';
  const lightSrc = `/shots/${name}-${lang}-light.png`;
  const darkSrc = `/shots/${name}-${lang}-dark.png`;
  const loading = eager ? 'eager' : 'lazy';
  const fetchPriority = eager ? 'high' : 'auto';

  return (
    <>
      <img
        src={lightSrc}
        alt={alt}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        className={`block dark:hidden w-full h-auto select-none ${className}`}
      />
      <img
        src={darkSrc}
        alt={alt}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        className={`hidden dark:block w-full h-auto select-none ${className}`}
      />
    </>
  );
}

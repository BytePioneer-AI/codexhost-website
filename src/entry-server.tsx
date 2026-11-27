import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './App';
import type { Locale } from './data/i18n';

export function render(pathname: string, locale: Locale): string {
  return renderToString(
    <StrictMode>
      <App initialPathname={pathname} initialLocale={locale} />
    </StrictMode>,
  );
}

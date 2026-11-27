import { Sun, Moon } from 'lucide-react';
import { COPY, type Locale } from '../data/i18n';
import { GITHUB_DOCS_URL, GITHUB_REPO_URL } from '../data/releases';
import { CodexHostLogo, GitHubIcon } from './Icons';

interface NavbarProps {
  locale: Locale;
  onToggleLocale: () => void;
  dark: boolean;
  onSetDark: (value: boolean) => void;
  starsLabel: string;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function Navbar({
  locale,
  onToggleLocale,
  dark,
  onSetDark,
  starsLabel,
  currentPath,
  onNavigate,
}: NavbarProps) {
  const t = COPY[locale].nav;
  const isDownload = currentPath.startsWith('/download');

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    if (isDownload) {
      e.preventDefault();
      onNavigate(`/${hash}`);
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-14 bg-canvas/85 backdrop-blur-md border-b border-hairline">
      <div className="max-w-[1160px] mx-auto h-full px-5 sm:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-7">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/');
            }}
            className="flex items-center gap-2 text-ink font-semibold text-[15px] tracking-[-0.02em] shrink-0"
          >
            <CodexHostLogo lightClassName="w-[21px] h-[24px]" darkClassName="w-6 h-6" />
            <span>CodexHost</span>
          </a>

          <nav className="hidden md:flex items-center gap-6 text-[13.5px] text-ink-secondary">
            <a
              href="/#collab"
              onClick={(e) => handleAnchor(e, '#collab')}
              className="hover:text-ink transition-colors"
            >
              {t.collab}
            </a>
            <a
              href="/#multi-host"
              onClick={(e) => handleAnchor(e, '#multi-host')}
              className="hover:text-ink transition-colors"
            >
              {t.multiHost}
            </a>
            <a
              href="/#ecosystem"
              onClick={(e) => handleAnchor(e, '#ecosystem')}
              className="hover:text-ink transition-colors"
            >
              {t.ecosystem}
            </a>
            <a
              href={GITHUB_DOCS_URL}
              target="_blank"
              rel="noreferrer"
              className="hover:text-ink transition-colors"
            >
              {t.docs}
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <button
            type="button"
            onClick={onToggleLocale}
            className="text-[13px] text-ink-secondary hover:text-ink transition-colors px-1.5 py-1"
            aria-label={locale === 'zh' ? 'Switch to English' : '切换为中文'}
          >
            {t.switchLang}
          </button>

          <button
            type="button"
            onClick={() => onSetDark(!dark)}
            aria-label={dark ? 'Light mode' : 'Dark mode'}
            className="sm:hidden w-8 h-8 rounded-lg border border-hairline bg-surface-muted flex items-center justify-center text-ink-secondary hover:text-ink transition-colors"
          >
            {dark ? <Sun className="w-3.5 h-3.5" strokeWidth={1.75} /> : <Moon className="w-3.5 h-3.5" strokeWidth={1.75} />}
          </button>

          <div
            className="hidden sm:flex items-center rounded-full border border-hairline bg-surface-muted p-0.5"
            role="group"
            aria-label="Theme"
          >
            <button
              type="button"
              onClick={() => onSetDark(false)}
              aria-label="Light mode"
              aria-pressed={!dark}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                !dark ? 'bg-surface-card text-ink shadow-subtle' : 'text-ink-muted hover:text-ink'
              }`}
            >
              <Sun className="w-3.5 h-3.5" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={() => onSetDark(true)}
              aria-label="Dark mode"
              aria-pressed={dark}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                dark ? 'bg-surface-card text-ink shadow-subtle' : 'text-ink-muted hover:text-ink'
              }`}
            >
              <Moon className="w-3.5 h-3.5" strokeWidth={1.75} />
            </button>
          </div>

          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-medium text-ink hover:opacity-75 transition-opacity px-1"
            aria-label="GitHub repository"
          >
            <GitHubIcon className="w-4 h-4" />
            <span className="tabular-nums">{starsLabel}</span>
          </a>

          <a
            href="/download"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/download');
            }}
            className={`inline-flex items-center justify-center h-8 px-3.5 rounded-lg text-[13px] font-medium transition-colors ${
              isDownload
                ? 'bg-surface-muted text-ink border border-hairline-strong'
                : 'bg-cta text-cta-ink hover:bg-cta-hover'
            }`}
          >
            {t.download}
          </a>
        </div>
      </div>
    </header>
  );
}

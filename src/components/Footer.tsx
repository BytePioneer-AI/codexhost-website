import { buildRoutePath, COPY, type Locale } from '../data/i18n';
import { GITHUB_DOCS_URL, GITHUB_RELEASES_URL, GITHUB_REPO_URL } from '../data/releases';
import { CodexHostLogo } from './Icons';

interface FooterProps {
  locale: Locale;
  onNavigate: (path: string) => void;
}

export function Footer({ locale, onNavigate }: FooterProps) {
  const t = COPY[locale].footer;
  const downloadHref = buildRoutePath('download', locale);
  return (
    <footer className="border-t border-hairline bg-canvas">
      <div className="max-w-[1120px] mx-auto px-5 sm:px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[13px] text-ink-muted">
        <div className="flex items-center gap-2.5">
          <CodexHostLogo lightClassName="w-4 h-[18px] opacity-85" darkClassName="w-[18px] h-[18px]" />
          <span className="font-medium text-ink">CodexHost</span>
          <span aria-hidden="true">·</span>
          <span>{t.license}</span>
        </div>

        <div className="flex flex-wrap items-center gap-5">
          <a
            href={downloadHref}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(downloadHref);
            }}
            className="hover:text-ink transition-colors"
          >
            {t.download}
          </a>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink transition-colors"
          >
            GitHub
          </a>
          <a
            href={GITHUB_RELEASES_URL}
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink transition-colors"
          >
            {t.changelog}
          </a>
          <a
            href={GITHUB_DOCS_URL}
            target="_blank"
            rel="noreferrer"
            className="hover:text-ink transition-colors"
          >
            {t.docs}
          </a>
        </div>
      </div>
    </footer>
  );
}

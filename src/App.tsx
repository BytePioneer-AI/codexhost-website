import { useCallback, useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { DownloadPage } from './pages/DownloadPage';
import {
  buildRoutePath,
  PAGE_TITLES,
  parseRoute,
  type Locale,
  type PageKey,
} from './data/i18n';
import {
  buildFallbackRelease,
  detectVisitorOs,
  fetchLiveRelease,
  type ArchKey,
  type OsKey,
  type ReleaseInfo,
} from './data/releases';

interface AppProps {
  initialPathname?: string;
  initialLocale?: Locale;
}

export function App({ initialPathname, initialLocale }: AppProps = {}) {
  const initialRoute = parseRoute(
    initialPathname ?? (typeof window !== 'undefined' ? window.location.pathname : '/'),
  );

  const [page, setPage] = useState<PageKey>(initialRoute.page);
  const [locale, setLocale] = useState<Locale>(
    initialLocale ?? (initialRoute.pathLocale ?? 'zh'),
  );
  const [dark, setDark] = useState<boolean>(false);
  const [release, setRelease] = useState<ReleaseInfo>(() => buildFallbackRelease());
  const [visitorOs, setVisitorOs] = useState<{ os: OsKey; arch: ArchKey }>({
    os: 'macos',
    arch: 'arm64',
  });

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
    setVisitorOs(detectVisitorOs());

    const params = new URLSearchParams(window.location.search);
    const queryLang = params.get('lang');
    if (queryLang === 'en' || queryLang === 'zh') {
      setLocale(queryLang);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
    document.title = PAGE_TITLES[locale][page];
    try {
      localStorage.setItem('codexhost-lang', locale);
    } catch {
      // ignore
    }
  }, [locale, page]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => {
      try {
        if (!localStorage.getItem('codexhost-theme')) {
          setDark(e.matches);
        }
      } catch {
        setDark(e.matches);
      }
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const handleSetDark = useCallback((value: boolean) => {
    setDark(value);
    try {
      localStorage.setItem('codexhost-theme', value ? 'dark' : 'light');
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    let active = true;
    fetchLiveRelease().then((live) => {
      if (active) setRelease(live);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handlePop = () => {
      const next = parseRoute(window.location.pathname);
      setPage(next.page);
      setLocale(next.pathLocale ?? 'zh');
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const navigate = useCallback(
    (target: string) => {
      const [rawPath, hash] = target.split('#');
      const parsed = parseRoute(rawPath || '/');
      const nextLocale = parsed.pathLocale ?? locale;
      const nextPath = buildRoutePath(parsed.page, nextLocale);
      const fullUrl = hash ? `${nextPath}#${hash}` : nextPath;

      window.history.pushState({}, '', fullUrl);
      setPage(parsed.page);
      if (nextLocale !== locale) {
        setLocale(nextLocale);
      }

      if (hash) {
        window.requestAnimationFrame(() => {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    },
    [locale],
  );

  const handleToggleLocale = useCallback(() => {
    const nextLocale: Locale = locale === 'zh' ? 'en' : 'zh';
    const nextPath = buildRoutePath(page, nextLocale);
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    window.history.pushState({}, '', `${nextPath}${hash}`);
    setLocale(nextLocale);
  }, [locale, page]);

  const currentPath = buildRoutePath(page, locale);

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      <Navbar
        locale={locale}
        onToggleLocale={handleToggleLocale}
        dark={dark}
        onSetDark={handleSetDark}
        starsLabel={release.starsLabel}
        currentPath={currentPath}
        currentPage={page}
        onNavigate={navigate}
      />

      <div className="flex-1">
        {page === 'download' ? (
          <DownloadPage locale={locale} release={release} initialOs={visitorOs} />
        ) : (
          <HomePage
            locale={locale}
            release={release}
            visitorOs={visitorOs}
            onNavigate={navigate}
          />
        )}
      </div>

      <Footer locale={locale} onNavigate={navigate} />
    </div>
  );
}

export default App;

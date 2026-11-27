import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { DownloadPage } from './pages/DownloadPage';
import { detectInitialLocale, type Locale } from './data/i18n';
import {
  buildFallbackRelease,
  detectVisitorOs,
  fetchLiveRelease,
  type ReleaseInfo,
} from './data/releases';

function normalizePath(pathname: string): string {
  if (pathname.startsWith('/download')) return '/download';
  return '/';
}

export function App() {
  const [path, setPath] = useState<string>(() =>
    normalizePath(typeof window !== 'undefined' ? window.location.pathname : '/'),
  );
  const [locale, setLocale] = useState<Locale>(() => detectInitialLocale());
  const [dark, setDark] = useState<boolean>(() =>
    typeof document !== 'undefined'
      ? document.documentElement.classList.contains('dark')
      : false,
  );
  const [release, setRelease] = useState<ReleaseInfo>(() => buildFallbackRelease());
  const visitorOs = useMemo(() => detectVisitorOs(), []);

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
    try {
      localStorage.setItem('codexhost-lang', locale);
    } catch {
      // ignore
    }
  }, [locale]);

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
      setPath(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const navigate = useCallback((target: string) => {
    const [rawPath, hash] = target.split('#');
    const nextPath = normalizePath(rawPath || '/');
    const fullUrl = hash ? `${nextPath}#${hash}` : nextPath;

    window.history.pushState({}, '', fullUrl);
    setPath(nextPath);

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
  }, []);

  const handleToggleLocale = useCallback(() => {
    setLocale((prev) => (prev === 'zh' ? 'en' : 'zh'));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink">
      <Navbar
        locale={locale}
        onToggleLocale={handleToggleLocale}
        dark={dark}
        onSetDark={handleSetDark}
        starsLabel={release.starsLabel}
        currentPath={path}
        onNavigate={navigate}
      />

      <div className="flex-1">
        {path === '/download' ? (
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

import { useEffect, useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  MessageSquare,
  X,
} from 'lucide-react';
import { buildRoutePath, COPY, type Locale } from '../data/i18n';
import { FLAGSHIP_AGENTS } from '../data/agents';
import { GITHUB_REPO_URL, type OsKey, type ArchKey, type ReleaseInfo } from '../data/releases';
import { CodexHostLogo, GitHubIcon, OsIcon } from '../components/Icons';
import { HeroShowcase } from '../components/HeroShowcase';
import { ThreeClientSyncStage } from '../components/ThreeClientSyncStage';
import { DelegationFlowStage } from '../components/DelegationFlowStage';
import { MultiHostStage } from '../components/MultiHostStage';
import { EcosystemShowcase } from '../components/EcosystemShowcase';

interface HomePageProps {
  locale: Locale;
  release: ReleaseInfo;
  visitorOs: { os: OsKey; arch: ArchKey };
  onNavigate: (path: string) => void;
}

export function HomePage({ locale, release, visitorOs, onNavigate }: HomePageProps) {
  const t = COPY[locale];
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [qrOpen, setQrOpen] = useState(false);

  useEffect(() => {
    if (!qrOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setQrOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [qrOpen]);

  const primaryAssetKey = `${visitorOs.os}-${visitorOs.arch}`;
  const primaryAsset =
    release.assets[primaryAssetKey] || release.assets['macos-arm64'];
  const primaryDownloadLabel = t.hero.downloadOs[visitorOs.os];
  const downloadHref = buildRoutePath('download', locale);

  return (
    <main className="pt-14">
      {/* SECTION 1: HERO (Kettu-calibrated luminous whitespace & immediate first-fold window) */}
      <section className="pt-12 sm:pt-16 pb-20 sm:pb-28 px-5 sm:px-6 bg-canvas">
        <div className="max-w-[1160px] mx-auto text-center">
          {/* Release pill */}
          <a
            href={release.releaseUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-surface-muted border border-hairline px-2 py-1 pr-3 text-[12.5px] text-ink-secondary hover:border-hairline-strong hover:text-ink transition-colors"
          >
            <span className="px-2 py-0.5 rounded-full bg-surface-card border border-hairline font-mono text-[12px] font-medium text-ink">
              {release.tag}
            </span>
            <span className="truncate max-w-[230px] sm:max-w-none">{t.hero.releaseNote}</span>
            <ChevronRight className="w-3.5 h-3.5 text-ink-muted shrink-0" />
          </a>

          {/* H1 — pure solid ink, zero gradient, clean natural mobile line break */}
          <h1 className="mt-6 text-[32px] sm:text-[54px] lg:text-[60px] font-semibold tracking-[-0.035em] leading-[1.1] text-ink max-w-[920px] mx-auto [text-wrap:balance]">
            {locale === 'zh' ? (
              <>
                <span className="whitespace-nowrap">在 Codex 里，</span>
                <span className="whitespace-nowrap">调度所有编程 Agent</span>
              </>
            ) : (
              t.hero.title
            )}
          </h1>

          {/* Subtitle — single crisp line on desktop */}
          <p className="mt-5 text-[16px] sm:text-[17.5px] leading-[1.58] text-ink-secondary max-w-[700px] mx-auto [text-wrap:balance]">
            {t.hero.subtitle}
          </p>

          {/* CTA Buttons — Kettu pure black primary button, ZERO size/chip pills inside */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a
              href={primaryAsset.url}
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg bg-cta text-cta-ink hover:bg-cta-hover text-[14.5px] font-medium transition-colors"
            >
              <OsIcon os={visitorOs.os} className="w-4 h-4" />
              <span>{primaryDownloadLabel}</span>
            </a>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg bg-surface-card border border-hairline-strong hover:border-ink/35 text-ink text-[14.5px] font-medium transition-colors"
            >
              <GitHubIcon className="w-4 h-4" />
              <span>{t.hero.githubCta}</span>
            </a>
          </div>

          {/* Micro platform line */}
          <p className="mt-3.5 text-[12.5px] text-ink-muted flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1">
            <span>macOS</span>
            <span aria-hidden="true">·</span>
            <a
              href={downloadHref}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(downloadHref);
              }}
              className="underline underline-offset-4 hover:text-ink transition-colors"
            >
              {t.hero.metaWinLinux}
            </a>
            <span aria-hidden="true">·</span>
            <a
              href={`${downloadHref}#mobile`}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(`${downloadHref}#mobile`);
              }}
              className="underline underline-offset-4 hover:text-ink transition-colors"
            >
              {t.hero.metaMobile}
            </a>
            <span aria-hidden="true">·</span>
            <span>{t.hero.metaOpen}</span>
          </p>

          {/* Compact 18px real Agent icon row (ZERO pill wall, single clean row on mobile) */}
          <div
            className="mt-5 flex items-center justify-center gap-x-3 sm:gap-x-3.5"
            aria-label="Supported coding agents"
          >
            {FLAGSHIP_AGENTS.map((agent, idx) => (
              <img
                key={agent.id}
                src={agent.icon}
                alt={agent.name}
                title={agent.name}
                width={18}
                height={18}
                className={`w-[18px] h-[18px] rounded-[4px] object-contain opacity-85 hover:opacity-100 transition-opacity ${
                  idx >= 9 ? 'hidden sm:block' : ''
                } ${agent.invertInDark ? 'dark:invert' : ''}`}
              />
            ))}
            <span className="text-[12px] font-mono text-ink-muted sm:hidden">+9</span>
            <span className="text-[12px] font-mono text-ink-muted hidden sm:inline">
              {t.hero.moreAgents}
            </span>
          </div>

          {/* 4-Tab real desktop application showcase */}
          <div className="mt-9 sm:mt-11">
            <HeroShowcase locale={locale} />
          </div>
        </div>
      </section>

      {/* SECTION 2: ONE HOST, LIVE 3-CLIENT SYNC ANIMATION */}
      <section id="dual-mode" className="py-24 sm:py-32 px-5 sm:px-6 border-t border-hairline bg-canvas-subtle scroll-mt-14">
        <div className="max-w-[1120px] mx-auto space-y-12">
          <div className="max-w-[700px] mx-auto text-center space-y-3">
            <p className="text-[12.5px] font-medium text-ink-muted">{t.dualForm.eyebrow}</p>
            <h2 className="text-[30px] sm:text-[38px] font-semibold tracking-[-0.028em] leading-[1.14] text-ink [text-wrap:balance]">
              {t.dualForm.title}
            </h2>
            <p className="text-[15.5px] leading-[1.6] text-ink-secondary [text-wrap:balance]">{t.dualForm.lead}</p>
          </div>

          <ThreeClientSyncStage locale={locale} />
        </div>
      </section>

      {/* SECTION 3: MULTI-AGENT DELEGATION & HANDOFF (Live 1 -> 3 -> 1 Flow) */}
      <section id="collab" className="py-24 sm:py-32 px-5 sm:px-6 border-t border-hairline bg-canvas scroll-mt-14">
        <div className="max-w-[1120px] mx-auto space-y-12">
          <div className="max-w-[700px] mx-auto text-center space-y-3">
            <p className="text-[12.5px] font-medium text-ink-muted">{t.collab.eyebrow}</p>
            <h2 className="text-[30px] sm:text-[38px] font-semibold tracking-[-0.028em] leading-[1.14] text-ink [text-wrap:balance]">
              {t.collab.title}
            </h2>
            <p className="text-[15.5px] leading-[1.6] text-ink-secondary [text-wrap:balance]">
              {t.collab.lead}
            </p>
          </div>

          <DelegationFlowStage locale={locale} />
        </div>
      </section>

      {/* SECTION 4: MULTI-HOST & MOBILE (Live Topology -> Peer Hub -> Phone) */}
      <section id="multi-host" className="py-24 sm:py-32 px-5 sm:px-6 border-t border-hairline bg-canvas-subtle scroll-mt-14">
        <div className="max-w-[1120px] mx-auto space-y-12">
          <div className="max-w-[700px] mx-auto text-center space-y-3">
            <p className="text-[12.5px] font-medium text-ink-muted">{t.multiHost.eyebrow}</p>
            <h2 className="text-[30px] sm:text-[38px] font-semibold tracking-[-0.028em] leading-[1.14] text-ink [text-wrap:balance]">
              {t.multiHost.title}
            </h2>
            <p className="text-[15.5px] leading-[1.6] text-ink-secondary [text-wrap:balance]">
              {t.multiHost.lead}
            </p>
          </div>

          <MultiHostStage locale={locale} onNavigate={onNavigate} />
        </div>
      </section>

      {/* SECTION 5: NATIVE PROTOCOLS, CREDENTIALS & UNIFIED EXTENSIONS */}
      <section id="ecosystem" className="py-24 sm:py-32 px-5 sm:px-6 border-t border-hairline bg-canvas scroll-mt-14">
        <div className="max-w-[1120px] mx-auto space-y-12">
          <div className="max-w-[700px] mx-auto text-center space-y-3">
            <p className="text-[12.5px] font-medium text-ink-muted">{t.native.eyebrow}</p>
            <h2 className="text-[30px] sm:text-[38px] font-semibold tracking-[-0.028em] leading-[1.14] text-ink [text-wrap:balance]">
              {t.native.title}
            </h2>
            <p className="text-[15.5px] leading-[1.6] text-ink-secondary [text-wrap:balance]">
              {t.native.lead}
            </p>
          </div>

          <EcosystemShowcase locale={locale} />
        </div>
      </section>

      {/* SECTION 6: CONCISE 4-ITEM FAQ + MINIMAL CLOSING CTA */}
      <section className="py-20 sm:py-24 px-5 sm:px-6 border-t border-hairline bg-canvas-subtle">
        <div className="max-w-[760px] mx-auto space-y-8">
          <div className="text-center space-y-2">
            <p className="text-[12.5px] font-medium text-ink-muted">{t.faq.eyebrow}</p>
            <h2 className="text-[26px] sm:text-[32px] font-semibold tracking-[-0.025em] leading-[1.18] text-ink">
              {t.faq.title}
            </h2>
          </div>

          <div className="divide-y divide-hairline border-t border-b border-hairline">
            {t.faq.items.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={item.q} className="py-4">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 text-left py-1 cursor-pointer"
                  >
                    <span className="text-[15px] font-medium text-ink">{item.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-ink-muted shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="pt-2.5 pb-1 pr-6 text-[14px] leading-[1.65] text-ink-secondary">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MINIMAL CLOSING CTA */}
      <section className="py-20 sm:py-24 px-5 sm:px-6 border-t border-hairline bg-canvas">
        <div className="max-w-[560px] mx-auto text-center space-y-5">
          <div className="flex justify-center">
            <div className="w-11 h-11 rounded-xl border border-hairline bg-surface-muted dark:border-transparent dark:bg-transparent flex items-center justify-center">
              <CodexHostLogo lightClassName="w-[22px] h-[24px]" darkClassName="w-11 h-11" />
            </div>
          </div>

          <div className="space-y-2.5">
            <h2 className="text-[28px] sm:text-[36px] font-semibold tracking-[-0.03em] leading-[1.14] text-ink [text-wrap:balance]">
              {t.bottomCta.title}
            </h2>
            <p className="text-[15px] text-ink-secondary">{t.bottomCta.subtitle}</p>
          </div>

          <div className="pt-1 flex flex-wrap items-center justify-center gap-3">
            <a
              href={primaryAsset.url}
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg bg-cta text-cta-ink hover:bg-cta-hover text-[14px] font-medium transition-colors"
            >
              <OsIcon os={visitorOs.os} className="w-4 h-4" />
              <span>{primaryDownloadLabel}</span>
            </a>
            <a
              href={downloadHref}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(downloadHref);
              }}
              className="inline-flex items-center justify-center h-11 px-5 rounded-lg bg-surface-card border border-hairline-strong hover:border-ink/35 text-ink text-[14px] font-medium transition-colors"
            >
              {t.bottomCta.otherPlatforms}
            </a>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-5 text-[13px] text-ink-secondary">
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-ink transition-colors"
            >
              <GitHubIcon className="w-3.5 h-3.5" />
              <span>{t.community.githubLink}</span>
            </a>
            <span className="text-ink-muted" aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setQrOpen(true)}
              className="inline-flex items-center gap-1.5 hover:text-ink transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{t.community.wechatTitle}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Minimal QR Modal */}
      {qrOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] flex items-center justify-center p-5"
          role="dialog"
          aria-modal="true"
          aria-label={t.community.wechatModalTitle}
          onClick={() => setQrOpen(false)}
        >
          <div
            className="w-full max-w-[340px] rounded-[14px] bg-surface-card border border-hairline p-6 text-center space-y-4 shadow-hero-window"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-[15.5px] font-semibold text-ink">
                {t.community.wechatModalTitle}
              </h3>
              <button
                type="button"
                onClick={() => setQrOpen(false)}
                aria-label={t.community.close}
                className="w-7 h-7 rounded-md flex items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="rounded-xl border border-hairline bg-white p-3 inline-block">
              <img
                src="/wechat-contact-qrcode.jpg"
                alt={t.community.wechatTitle}
                width={220}
                height={220}
                className="w-[220px] h-[220px] object-contain"
              />
            </div>
            <p className="text-[13px] leading-[1.55] text-ink-secondary">
              {t.community.wechatModalDesc}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

import { useEffect, useRef, useState } from 'react';
import {
  ChevronRight,
  Download,
  Info,
  Copy,
  Check,
  ArrowUpRight,
  Smartphone,
  Terminal,
} from 'lucide-react';
import { COPY, type Locale } from '../data/i18n';
import {
  GITHUB_RELEASES_URL,
  type ArchKey,
  type OsKey,
  type ReleaseInfo,
} from '../data/releases';
import { OsIcon } from '../components/Icons';

interface DownloadPageProps {
  locale: Locale;
  release: ReleaseInfo;
  initialOs: { os: OsKey; arch: ArchKey };
}

function CopyableCommand({
  command,
  copyLabel,
  copiedLabel,
}: {
  command: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore clipboard errors in restricted contexts
    }
  };

  return (
    <div className="mt-2.5 rounded-lg bg-[#f5f5f4] dark:bg-[#191919] px-2.5 py-2 flex items-center justify-between gap-2">
      <code className="font-mono text-[12px] leading-[1.5] text-ink whitespace-nowrap overflow-x-auto select-all min-w-0">
        {command}
      </code>
      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-md border border-hairline-strong bg-surface-card text-[12px] font-medium text-ink hover:border-ink/40 transition-colors cursor-pointer"
      >
        {copied ? (
          <>
            <Check className="w-3 h-3" />
            <span>{copiedLabel}</span>
          </>
        ) : (
          <>
            <Copy className="w-3 h-3" />
            <span>{copyLabel}</span>
          </>
        )}
      </button>
    </div>
  );
}

export function DownloadPage({ locale, release, initialOs }: DownloadPageProps) {
  const t = COPY[locale].downloadPage;
  const userPickedOsRef = useRef(false);
  const [selectedOs, setSelectedOs] = useState<OsKey>(initialOs.os);
  const [archByOs, setArchByOs] = useState<Record<OsKey, ArchKey>>({
    macos: initialOs.os === 'macos' ? initialOs.arch : 'arm64',
    windows: initialOs.os === 'windows' ? initialOs.arch : 'x64',
    linux: initialOs.os === 'linux' ? initialOs.arch : 'x64',
  });

  useEffect(() => {
    if (userPickedOsRef.current) return;
    setSelectedOs(initialOs.os);
    setArchByOs((prev) => ({
      ...prev,
      [initialOs.os]: initialOs.arch,
    }));
  }, [initialOs.os, initialOs.arch]);

  const currentArch = archByOs[selectedOs];
  const assetKey = `${selectedOs}-${currentArch}` as keyof typeof t.archLabels;
  const currentAsset = release.assets[assetKey] || release.assets['macos-arm64'];
  const altArch: ArchKey = currentArch === 'arm64' ? 'x64' : 'arm64';
  const altLabel = t.switchArch[selectedOs][currentArch];

  const handleToggleArch = () => {
    setArchByOs((prev) => ({
      ...prev,
      [selectedOs]: altArch,
    }));
  };

  const desktopRows: Array<{ key: keyof typeof t.archLabels; label: string }> = [
    { key: 'macos-arm64', label: `macOS · ${t.archLabels['macos-arm64']}` },
    { key: 'macos-x64', label: `macOS · ${t.archLabels['macos-x64']}` },
    { key: 'windows-x64', label: `Windows · ${t.archLabels['windows-x64']}` },
    { key: 'windows-arm64', label: `Windows · ${t.archLabels['windows-arm64']}` },
    { key: 'linux-x64', label: `Linux · ${t.archLabels['linux-x64']}` },
    { key: 'linux-arm64', label: `Linux · ${t.archLabels['linux-arm64']}` },
  ];

  const androidAsset = release.assets.android;
  const steps = t.steps[selectedOs];

  return (
    <main className="pt-14 bg-canvas">
      {/* Top Hero + OS Switcher + Main Split Card (Kettu download benchmark) */}
      <section className="pt-14 sm:pt-20 pb-20 px-5 sm:px-6">
        <div className="max-w-[1120px] mx-auto">
          <div className="text-center">
            <a
              href={release.releaseUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-surface-muted border border-hairline px-2 py-1 pr-3 text-[12.5px] text-ink-secondary hover:border-hairline-strong hover:text-ink transition-colors"
            >
              <span className="px-2 py-0.5 rounded-full bg-surface-card border border-hairline font-mono text-[12px] font-medium text-ink">
                {release.tag}
              </span>
              <span>{t.pillSuffix}</span>
              <ChevronRight className="w-3.5 h-3.5 text-ink-muted" />
            </a>

            <h1 className="mt-5 text-[38px] sm:text-[54px] font-semibold tracking-[-0.035em] leading-[1.08] text-ink">
              {t.title}
            </h1>

            <p className="mt-4 text-[16px] sm:text-[17px] text-ink-secondary max-w-[540px] mx-auto">
              {t.subtitle}
            </p>

            {/* Segmented OS Switcher */}
            <div className="mt-8 inline-flex items-center p-1 rounded-[10px] bg-surface-muted border border-hairline">
              {(['macos', 'windows', 'linux'] as const).map((os) => {
                const active = selectedOs === os;
                const osTitle = os === 'macos' ? 'macOS' : os === 'windows' ? 'Windows' : 'Linux';
                return (
                  <button
                    key={os}
                    type="button"
                    onClick={() => {
                      userPickedOsRef.current = true;
                      setSelectedOs(os);
                    }}
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-[7px] text-[13.5px] font-medium transition-all ${
                      active
                        ? 'bg-surface-card text-ink shadow-subtle'
                        : 'text-ink-secondary hover:text-ink'
                    }`}
                  >
                    <OsIcon os={os} className="w-3.5 h-3.5" />
                    <span>{osTitle}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Kettu-style split download card (single-layer showcase-frame) */}
          <div className="mt-7 showcase-frame grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-hairline overflow-hidden">
            {/* Left: Primary download action */}
            <div className="lg:col-span-5 p-6 sm:p-9 flex flex-col justify-between gap-7">
              <div className="space-y-5">
                <OsIcon os={selectedOs} className="w-6 h-6 text-ink" />

                <div className="space-y-1.5">
                  <h2 className="text-[24px] font-semibold tracking-[-0.02em] text-ink">
                    {t.osNames[selectedOs]}
                  </h2>
                  <p className="text-[13px] text-ink-secondary font-mono flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span>{t.archLabels[assetKey]}</span>
                    <span aria-hidden="true">·</span>
                    <span>{release.tag}</span>
                    <span aria-hidden="true">·</span>
                    <span className="whitespace-nowrap">{currentAsset.size}</span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <a
                    href={currentAsset.url}
                    className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg bg-cta text-cta-ink hover:bg-cta-hover text-[14px] font-medium transition-colors"
                  >
                    <Download className="w-4 h-4" strokeWidth={1.8} />
                    <span>{t.downloadBtn[selectedOs]}</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleToggleArch}
                    className="inline-flex items-center justify-center h-11 px-4 rounded-lg bg-surface-card border border-hairline-strong hover:border-ink/35 text-ink text-[13.5px] font-medium transition-colors"
                  >
                    {altLabel}
                  </button>
                </div>

                <div className="text-[12.5px] text-ink-muted space-y-1">
                  <div className="font-mono break-all">{currentAsset.filename}</div>
                  <a
                    href={release.releaseUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-sans underline underline-offset-4 hover:text-ink inline-flex items-center gap-0.5 whitespace-nowrap"
                  >
                    <span>{t.fromGithub}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Gentle chip/arch tip */}
              <div className="rounded-lg bg-surface-muted px-3.5 py-2.5 flex items-start gap-2.5 text-[12.5px] leading-[1.55] text-ink-secondary">
                <Info className="w-4 h-4 mt-0.5 shrink-0 text-ink-muted" strokeWidth={1.7} />
                <span>{t.tips[selectedOs]}</span>
              </div>
            </div>

            {/* Right: 3-step install guide (wider column so quarantine command sits on 1 crisp line) */}
            <div className="lg:col-span-7 p-6 sm:p-7 space-y-5">
              <h3 className="text-[15.5px] font-semibold text-ink">{t.stepsHeading}</h3>

              <ol className="divide-y divide-hairline">
                {steps.map((step, index) => {
                  const dynamicCommand =
                    'command' in step && step.command
                      ? step.command.replace(/0\.\d+\.\d+/, release.version)
                      : undefined;
                  return (
                    <li
                      key={step.title}
                      className="py-4 first:pt-0 last:pb-0 flex items-start gap-3.5"
                    >
                      <span className="w-6 h-6 rounded-full border border-hairline-strong bg-surface-muted text-[12px] font-mono font-medium text-ink flex items-center justify-center shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[14px] font-semibold text-ink">{step.title}</div>
                        <p className="mt-1 text-[13px] leading-[1.55] text-ink-secondary">
                          {step.desc}
                        </p>
                        {dynamicCommand && (
                          <CopyableCommand
                            command={dynamicCommand}
                            copyLabel={t.copy}
                            copiedLabel={t.copied}
                          />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* All platforms direct download table */}
      <section className="py-16 px-5 sm:px-6 border-t border-hairline">
        <div className="max-w-[1120px] mx-auto space-y-5">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-[22px] sm:text-[26px] font-semibold tracking-[-0.02em] text-ink">
              {t.allTitle}
            </h2>
            <a
              href={GITHUB_RELEASES_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[13.5px] text-ink-secondary hover:text-ink transition-colors"
            >
              <span>
                {release.tag} · {t.allChangelog}
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="rounded-[12px] border border-hairline overflow-x-auto bg-surface-card">
            <table className="w-full text-left border-collapse text-[13.5px]">
              <thead>
                <tr className="border-b border-hairline bg-canvas-subtle text-[12px] text-ink-muted">
                  <th className="py-3 px-4 font-medium">{t.tablePlatform}</th>
                  <th className="py-3 px-4 font-medium">{t.tableFile}</th>
                  <th className="py-3 px-4 font-medium">{t.tableSize}</th>
                  <th className="py-3 px-4 font-medium text-right">{t.tableAction}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline">
                {desktopRows.map((row) => {
                  const asset = release.assets[row.key];
                  return (
                    <tr key={row.key} className="hover:bg-canvas-subtle/70 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-ink whitespace-nowrap">
                        {row.label}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[12.5px] text-ink-secondary whitespace-nowrap">
                        {asset.filename}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[12.5px] text-ink-muted whitespace-nowrap">
                        {asset.size}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <a
                          href={asset.url}
                          className="inline-flex items-center gap-1 font-medium text-ink underline underline-offset-4 hover:opacity-70 transition-opacity"
                        >
                          <span>{t.downloadAction}</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Mobile section (#mobile) */}
      <section id="mobile" className="py-16 px-5 sm:px-6 border-t border-hairline bg-canvas-subtle scroll-mt-14">
        <div className="max-w-[1120px] mx-auto space-y-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-ink-muted">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Android & iOS</span>
            </div>
            <h2 className="text-[22px] sm:text-[26px] font-semibold tracking-[-0.02em] text-ink">
              {t.mobileTitle}
            </h2>
            <p className="text-[14.5px] text-ink-secondary">{t.mobileSubtitle}</p>
          </div>

          <div className="rounded-[14px] border border-hairline bg-surface-card grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-hairline">
            <div className="p-6 sm:p-7 flex flex-col justify-between gap-5">
              <div className="space-y-2">
                <h3 className="text-[17px] font-semibold text-ink">{t.androidTitle}</h3>
                <p className="text-[14px] leading-[1.6] text-ink-secondary">{t.androidDesc}</p>
                <p className="text-[12px] font-mono text-ink-muted pt-1">
                  {androidAsset.filename} · {androidAsset.size}
                </p>
              </div>
              <div>
                <a
                  href={androidAsset.url}
                  className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-cta text-cta-ink hover:bg-cta-hover text-[13.5px] font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.androidBtn}</span>
                </a>
              </div>
            </div>

            <div className="p-6 sm:p-7 space-y-3.5">
              <h3 className="text-[17px] font-semibold text-ink">{t.iosTitle}</h3>
              <ol className="space-y-2.5 text-[13.5px] text-ink-secondary">
                {t.iosSteps.map((step, i) => (
                  <li key={step} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full border border-hairline-strong bg-surface-muted font-mono text-[12px] text-ink flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-[1.55]">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Developer CLI section */}
      <section id="cli" className="py-16 pb-24 px-5 sm:px-6 border-t border-hairline bg-canvas scroll-mt-14">
        <div className="max-w-[1120px] mx-auto space-y-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-ink-muted">
              <Terminal className="w-3.5 h-3.5" />
              <span>CLI & Package Managers</span>
            </div>
            <h2 className="text-[22px] sm:text-[26px] font-semibold tracking-[-0.02em] text-ink">
              {t.cliTitle}
            </h2>
            <p className="text-[14.5px] text-ink-secondary">{t.cliSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-[12px] border border-hairline bg-surface-card p-5">
              <div className="text-[13.5px] font-semibold text-ink">{t.cliMacosLabel}</div>
              <CopyableCommand
                command="curl -fsSL https://chost.dev/install.sh | bash"
                copyLabel={t.copy}
                copiedLabel={t.copied}
              />
            </div>

            <div className="rounded-[12px] border border-hairline bg-surface-card p-5">
              <div className="text-[13.5px] font-semibold text-ink">{t.cliWingetLabel}</div>
              <CopyableCommand
                command="winget install --id BytePioneer-AI.CodexHost --exact"
                copyLabel={t.copy}
                copiedLabel={t.copied}
              />
            </div>

            <div className="rounded-[12px] border border-hairline bg-surface-card p-5 md:col-span-2">
              <div className="text-[13.5px] font-semibold text-ink">{t.cliNpmLabel}</div>
              <CopyableCommand
                command="npm install -g @codexhost/cli"
                copyLabel={t.copy}
                copiedLabel={t.copied}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

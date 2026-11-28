export type OsKey = 'macos' | 'windows' | 'linux';
export type ArchKey = 'arm64' | 'x64';

export const REPO_OWNER = 'BytePioneer-AI';
export const REPO_NAME = 'codex-host';
export const GITHUB_REPO_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}`;
export const GITHUB_RELEASES_URL = `${GITHUB_REPO_URL}/releases`;
export const GITHUB_DOCS_URL = `${GITHUB_REPO_URL}/tree/main/docs`;

/** Optional mirror/CDN prefix for release binaries. Keep empty to serve from GitHub Releases. */
export const CDN_BASE_URL: string = '';

export const FALLBACK_VERSION = '0.28.2';
export const FALLBACK_STARS = '3.5k';

export interface DownloadAsset {
  id: string;
  os: OsKey | 'android';
  arch: ArchKey | 'universal';
  filename: string;
  size: string;
  url: string;
}

export interface ReleaseInfo {
  version: string;
  tag: string;
  publishedAt: string;
  releaseUrl: string;
  starsLabel: string;
  assets: Record<string, DownloadAsset>;
}

function buildAssetUrl(tag: string, filename: string): string {
  if (CDN_BASE_URL) {
    return `${CDN_BASE_URL.replace(/\/$/, '')}/${tag}/${filename}`;
  }
  return `${GITHUB_REPO_URL}/releases/download/${tag}/${filename}`;
}

export function buildFallbackRelease(version = FALLBACK_VERSION, starsLabel = FALLBACK_STARS): ReleaseInfo {
  const cleanVer = version.replace(/^v/, '');
  const tag = `v${cleanVer}`;
  const files: Array<{
    id: string;
    os: OsKey | 'android';
    arch: ArchKey | 'universal';
    filename: string;
    size: string;
  }> = [
    {
      id: 'macos-arm64',
      os: 'macos',
      arch: 'arm64',
      filename: `codexhost-${cleanVer}-macos-arm64.dmg`,
      size: '64.4 MB',
    },
    {
      id: 'macos-x64',
      os: 'macos',
      arch: 'x64',
      filename: `codexhost-${cleanVer}-macos-x64.dmg`,
      size: '66.8 MB',
    },
    {
      id: 'windows-x64',
      os: 'windows',
      arch: 'x64',
      filename: `codexhost-${cleanVer}-windows-x64.exe`,
      size: '39.1 MB',
    },
    {
      id: 'windows-arm64',
      os: 'windows',
      arch: 'arm64',
      filename: `codexhost-${cleanVer}-windows-arm64.exe`,
      size: '36.2 MB',
    },
    {
      id: 'linux-x64',
      os: 'linux',
      arch: 'x64',
      filename: `codexhost-${cleanVer}-linux-x64.tar.gz`,
      size: '65.9 MB',
    },
    {
      id: 'linux-arm64',
      os: 'linux',
      arch: 'arm64',
      filename: `codexhost-${cleanVer}-linux-arm64.tar.gz`,
      size: '65.6 MB',
    },
    {
      id: 'android',
      os: 'android',
      arch: 'universal',
      filename: `codexhost-${cleanVer}-android.apk`,
      size: '7.4 MB',
    },
  ];

  const assets: Record<string, DownloadAsset> = {};
  for (const item of files) {
    assets[item.id] = {
      ...item,
      url: buildAssetUrl(tag, item.filename),
    };
  }

  return {
    version: cleanVer,
    tag,
    publishedAt: '',
    releaseUrl: `${GITHUB_RELEASES_URL}/tag/${tag}`,
    starsLabel,
    assets,
  };
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '';
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatStars(count: number): string {
  if (!Number.isFinite(count) || count <= 0) return FALLBACK_STARS;
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return String(count);
}

export async function fetchLiveRelease(): Promise<ReleaseInfo> {
  const fallback = buildFallbackRelease();
  try {
    const [relRes, repoRes] = await Promise.allSettled([
      fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`, {
        headers: { Accept: 'application/vnd.github+json' },
      }),
      fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`, {
        headers: { Accept: 'application/vnd.github+json' },
      }),
    ]);

    let starsLabel = fallback.starsLabel;
    if (repoRes.status === 'fulfilled' && repoRes.value.ok) {
      const repoJson = (await repoRes.value.json()) as { stargazers_count?: number };
      if (typeof repoJson.stargazers_count === 'number') {
        starsLabel = formatStars(repoJson.stargazers_count);
      }
    }

    if (relRes.status === 'fulfilled' && relRes.value.ok) {
      const relJson = (await relRes.value.json()) as {
        tag_name?: string;
        html_url?: string;
        published_at?: string;
        assets?: Array<{ name: string; size: number; browser_download_url: string }>;
      };
      if (relJson.tag_name) {
        const next = buildFallbackRelease(relJson.tag_name, starsLabel);
        next.releaseUrl = relJson.html_url || next.releaseUrl;
        next.publishedAt = relJson.published_at || '';

        if (Array.isArray(relJson.assets)) {
          const matchers: Array<[string, RegExp]> = [
            ['macos-arm64', /macos-arm64\.dmg$/i],
            ['macos-x64', /macos-x64\.dmg$/i],
            ['windows-x64', /windows-x64\.exe$/i],
            ['windows-arm64', /windows-arm64\.exe$/i],
            ['linux-x64', /linux-x64\.tar\.gz$/i],
            ['linux-arm64', /linux-arm64\.tar\.gz$/i],
            ['android', /android\.apk$/i],
          ];
          for (const [id, regex] of matchers) {
            const matched = relJson.assets.find((a) => regex.test(a.name));
            if (matched && next.assets[id]) {
              next.assets[id] = {
                ...next.assets[id],
                filename: matched.name,
                size: formatBytes(matched.size) || next.assets[id].size,
                url: CDN_BASE_URL
                  ? buildAssetUrl(next.tag, matched.name)
                  : matched.browser_download_url,
              };
            }
          }
        }
        return next;
      }
    }

    return { ...fallback, starsLabel };
  } catch {
    return fallback;
  }
}

export function detectVisitorOs(): { os: OsKey; arch: ArchKey } {
  if (typeof navigator === 'undefined') {
    return { os: 'macos', arch: 'arm64' };
  }
  const ua = navigator.userAgent.toLowerCase();
  const platform = ((navigator as Navigator & { userAgentData?: { platform?: string } })
    .userAgentData?.platform ||
    navigator.platform ||
    '').toLowerCase();

  if (platform.includes('win') || ua.includes('windows')) {
    const isArm = ua.includes('arm64') || ua.includes('aarch64');
    return { os: 'windows', arch: isArm ? 'arm64' : 'x64' };
  }
  if (platform.includes('linux') && !ua.includes('android')) {
    const isArm = ua.includes('arm64') || ua.includes('aarch64');
    return { os: 'linux', arch: isArm ? 'arm64' : 'x64' };
  }
  return { os: 'macos', arch: 'arm64' };
}

import type { Locale } from '../data/i18n';
import { ThemedShot } from './ThemedShot';

interface EcosystemShowcaseProps {
  locale: Locale;
}

export function EcosystemShowcase({ locale }: EcosystemShowcaseProps) {
  const zh = locale === 'zh';

  const tiles = [
    {
      shot: 'readme-feat-hash-menu',
      title: zh ? '# 唤起本机全部原生 Agent' : 'Summon native agents with #',
      desc: zh
        ? '基于各家原生 SDK / RPC 接入，完整保留 Plan Mode、运行中插话、后台终端与子会话委派。'
        : 'Driven over native SDKs & RPC—preserving Plan Mode, mid-run steering, background terminals, and subagents.',
      alt: zh
        ? '输入框键入 # 唤起本机全部可用编程 Agent 并发委派实景'
        : 'Typing # in the composer to summon all locally detected coding agents',
    },
    {
      shot: 'readme-feat-usage',
      title: zh ? '复用本机账号与多 Agent 统一用量' : 'Local credentials & unified usage',
      desc: zh
        ? '直连本机订阅与凭据，零第三方代理；跨 Codex、Grok、Claude Code、OpenCode 统计费用、Token 与缓存命中率。'
        : 'Reuses your local logins with zero proxy—tracking spend, tokens, and cache hit rate across every agent.',
      alt: zh
        ? '多 Agent 统一用量与费用看板实景'
        : 'Unified multi-agent usage and cost dashboard screenshot',
    },
    {
      shot: 'readme-feat-plugins',
      title: zh ? '跨客户端插件市场与 Skill 库' : 'Cross-client plugin marketplace',
      desc: zh
        ? '主题外观、MCP 统一中心、侧栏委派树、上下文洞察一键安装，同时覆盖 Codex Desktop 与 CH Web。'
        : 'Install themes, MCP Sync Hub, Sidebar Thread Tree, and Context Insights once across Desktop and Web.',
      alt: zh
        ? 'CodexHost 跨客户端插件中心市场实景'
        : 'CodexHost Plugin Center Marketplace for Codex Desktop and CH Web',
    },
    {
      shot: 'readme-feat-diff',
      title: zh ? '原生 Git Diff 审查工作台' : 'Native Git Diff review',
      desc: zh
        ? '边看多 Agent 结论边审代码，未暂存改动、变更文件树与逐行红绿对比同屏呈现，支持一键暂存与还原。'
        : 'Review unstaged changes, file trees, and line-by-line hunks side by side with multi-agent replies.',
      alt: zh
        ? '原生 Git Diff 审查与多 Agent 对话同屏实景'
        : 'Native Git Diff review side by side with multi-agent conversation',
    },
  ];

  return (
    <div className="max-w-[1040px] mx-auto grid grid-cols-1 md:grid-cols-2 border-t border-l border-hairline">
      {tiles.map((tile) => (
        <div
          key={tile.shot}
          className="p-6 sm:p-7 border-r border-b border-hairline flex flex-col justify-between gap-5"
        >
          <div className="rounded-xl overflow-hidden border border-hairline bg-surface-card shadow-subtle">
            <ThemedShot name={tile.shot} locale={locale} alt={tile.alt} />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-[17px] font-semibold tracking-[-0.015em] text-ink">
              {tile.title}
            </h3>
            <p className="text-[14px] leading-[1.6] text-ink-secondary">{tile.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

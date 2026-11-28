import { useState } from 'react';
import { COPY, type Locale } from '../data/i18n';
import { ThemedShot } from './ThemedShot';

type ShowcaseTabId = 'delegation' | 'handoff' | 'multihost' | 'native';

interface HeroShowcaseProps {
  locale: Locale;
}

const TAB_SHOTS: Record<
  ShowcaseTabId,
  {
    shot: string;
    altZh: string;
    altEn: string;
    captionZh: string;
    captionEn: string;
  }
> = {
  delegation: {
    shot: 'readme-hero',
    altZh: 'CodexHost 桌面工作台与手机端实景：侧栏委派树与多 Agent 并行协作',
    altEn: 'CodexHost desktop workbench and mobile companion with live multi-agent delegation',
    captionZh: '原生工作台与手机端实时同步：侧栏委派树清晰呈现 Codex、Claude Code、Grok 并行子会话。',
    captionEn: 'Desktop & mobile live-synced: inspect parallel Codex, Claude Code, and Grok child sessions in one sidebar tree.',
  },
  handoff: {
    shot: 'readme-feat-handoff',
    altZh: '跨 Agent 上下文无损交接弹窗实景：从 Codex 一键交接至 Grok 继续执行',
    altEn: 'Cross-Agent Context Handoff modal transferring full conversation context from Codex to Grok',
    captionZh: '跨 Agent 无损交接（Handoff）：任意轮次一键整理上下文，无缝切换到另一款 Agent 与模型继续推进。',
    captionEn: 'Lossless Cross-Agent Handoff: carry full conversation context cleanly to another agent and model on any turn.',
  },
  multihost: {
    shot: 'readme-feat-mesh',
    altZh: 'CodexHost 4 节点双向互通连接拓扑实景：本机、Linux GPU Server、Windows Test Rig 与 Mac Studio',
    altEn: 'CodexHost 4-node bidirectional mesh topology linking Local, Linux GPU Server, Windows Test Rig, and Mac Studio',
    captionZh: '原生多机双向互通拓扑：Mac、Linux 与 Windows 组成网状协作网络，不同机器上的 Agent 直接跨机互相派活。',
    captionEn: 'Live multi-machine mesh topology: link Mac, Linux, and Windows so agents delegate directly across machines.',
  },
  native: {
    shot: 'readme-feat-diff',
    altZh: '原生 Git Diff 审查工作台实景：多 Agent 对话与未暂存改动同屏对照',
    altEn: 'Native Git Diff review workbench side-by-side with active multi-agent conversation',
    captionZh: '原生 Git Diff 审查：边看多 Agent 汇报边审代码，变更文件树与逐行红绿对比同屏完成。',
    captionEn: 'Native Git Diff review: inspect changed files and line-by-line hunks side by side with multi-agent replies.',
  },
};

export function HeroShowcase({ locale }: HeroShowcaseProps) {
  const [activeTab, setActiveTab] = useState<ShowcaseTabId>('delegation');
  const tabs = COPY[locale].hero.tabs;
  const zh = locale === 'zh';
  const current = TAB_SHOTS[activeTab];

  return (
    <div className="w-full max-w-[1160px] mx-auto">
      {/* Compact segmented tab selector */}
      <div className="flex justify-center mb-5">
        <div
          className="grid grid-cols-2 sm:inline-flex items-center gap-1 p-1 rounded-[10px] bg-surface-muted border border-hairline w-full sm:w-auto max-w-[360px] sm:max-w-none"
          role="tablist"
          aria-label={zh ? '工作台场景切换' : 'Workspace showcase tabs'}
        >
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-[7px] text-[12.5px] font-medium transition-all text-center whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-surface-card text-ink shadow-subtle'
                    : 'text-ink-secondary hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Real product screenshot frame (light/dark + locale aware) */}
      <div className="showcase-frame showcase-frame-hero overflow-hidden bg-surface-card">
        <ThemedShot
          key={`${activeTab}-${locale}`}
          name={current.shot}
          locale={locale}
          alt={zh ? current.altZh : current.altEn}
          eager={activeTab === 'delegation'}
          className="block w-full h-auto"
        />
      </div>

      <p className="mt-3.5 text-[13px] text-ink-muted text-center max-w-[780px] mx-auto">
        {zh ? current.captionZh : current.captionEn}
      </p>
    </div>
  );
}

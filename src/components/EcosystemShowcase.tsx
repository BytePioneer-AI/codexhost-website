import { useState } from 'react';
import { ArrowRight, Check, Clock, Puzzle, Terminal } from 'lucide-react';
import type { Locale } from '../data/i18n';

interface EcosystemShowcaseProps {
  locale: Locale;
}

type ProtocolTab = 'plan' | 'steer' | 'term';

export function EcosystemShowcase({ locale }: EcosystemShowcaseProps) {
  const zh = locale === 'zh';
  const [protoTab, setProtoTab] = useState<ProtocolTab>('plan');

  const protoContent: Record<
    ProtocolTab,
    { label: string; badge: string; line: string }
  > = {
    plan: {
      label: 'Plan Mode',
      badge: 'Claude Code',
      line: zh
        ? '已生成 3 步执行计划，等待确认后落盘改动'
        : '3-step plan ready, awaiting confirmation',
    },
    steer: {
      label: zh ? '运行中插话' : 'Mid-run steer',
      badge: 'Live',
      line: zh
        ? '已即时跳过慢速 E2E，优先回归核心路由单测'
        : 'Skipped slow E2E mid-run; prioritizing core unit tests',
    },
    term: {
      label: zh ? '后台终端' : 'Bg terminal',
      badge: 'bg-term #2',
      line: 'vite dev --port 5173 · ready in 214ms',
    },
  };

  return (
    <div className="max-w-[960px] mx-auto grid grid-cols-1 md:grid-cols-2 border-t border-l border-hairline">
      {/* Tile 1: Native Protocols */}
      <div className="p-7 sm:p-8 border-r border-b border-hairline flex flex-col justify-between gap-7">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {(['plan', 'steer', 'term'] as const).map((key) => {
              const active = protoTab === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setProtoTab(key)}
                  className={`px-2.5 py-1 rounded-md text-[12px] font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-cta text-cta-ink'
                      : 'bg-surface-muted text-ink-secondary hover:text-ink'
                  }`}
                >
                  {protoContent[key].label}
                </button>
              );
            })}
          </div>

          <div className="rounded-xl bg-surface-muted px-3.5 py-3 space-y-1.5">
            <div className="flex items-center justify-between text-[12px] font-mono text-ink-muted">
              <span className="inline-flex items-center gap-1.5 text-ink font-medium">
                <Terminal className="w-3.5 h-3.5 text-ink-muted" strokeWidth={1.7} />
                <span>{protoContent[protoTab].badge}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" aria-hidden="true" />
                <span>native</span>
              </span>
            </div>
            <div className="text-[12.5px] text-ink-secondary font-mono truncate">
              {protoContent[protoTab].line}
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-[17px] font-semibold tracking-[-0.015em] text-ink">
            {zh ? '原生协议深接' : 'Deep native protocols'}
          </h3>
          <p className="text-[14px] leading-[1.6] text-ink-secondary">
            {zh
              ? '保留 Plan Mode、运行中插话、后台终端与原生历史导入。'
              : 'Plan Mode, mid-run steer, background terminals, and native history intact.'}
          </p>
        </div>
      </div>

      {/* Tile 2: Local Account Import & Unified Usage */}
      <div className="p-7 sm:p-8 border-r border-b border-hairline flex flex-col justify-between gap-7">
        <div className="rounded-xl bg-surface-muted px-4 py-3.5 space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[12px]">
              <span className="inline-flex items-center gap-1.5 text-ink font-medium">
                <img src="/icons/codex.svg" alt="Codex" width={14} height={14} className="w-3.5 h-3.5" />
                <span>Codex Pro</span>
                <ArrowRight className="w-3 h-3 text-ink-muted" />
                <img src="/icons/pi.svg" alt="Pi" width={14} height={14} className="w-3.5 h-3.5 dark:invert" />
                <span>Pi</span>
              </span>
              <span className="font-mono text-ink-muted">{zh ? '已导入' : 'Imported'}</span>
            </div>
            <div className="h-1.5 rounded-full bg-black/[0.08] dark:bg-white/[0.10] overflow-hidden">
              <div className="h-full w-[45%] rounded-full bg-ink/80" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[12px]">
              <span className="inline-flex items-center gap-1.5 text-ink font-medium">
                <img src="/icons/grok.png" alt="Grok" width={14} height={14} className="w-3.5 h-3.5 rounded-[3px]" />
                <span>Grok</span>
                <ArrowRight className="w-3 h-3 text-ink-muted" />
                <img src="/icons/pi.svg" alt="Pi" width={14} height={14} className="w-3.5 h-3.5 dark:invert" />
                <span>Pi</span>
              </span>
              <span className="font-mono text-ink-muted">CH 99.2% · $0.11</span>
            </div>
            <div className="h-1.5 rounded-full bg-black/[0.08] dark:bg-white/[0.10] overflow-hidden">
              <div className="h-full w-[86%] rounded-full bg-[#16a34a]" />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-[17px] font-semibold tracking-[-0.015em] text-ink">
            {zh ? '复用本机账号与全局用量' : 'Local accounts & unified usage'}
          </h3>
          <p className="text-[14px] leading-[1.6] text-ink-secondary">
            {zh
              ? '直连本机订阅与 API，凭据一键导入 Pi，跨 Agent 统一统计。'
              : 'Reuse local subscriptions, import into Pi in one click, and track unified spend.'}
          </p>
        </div>
      </div>

      {/* Tile 3: Unified Desktop / Web Extensions & Skills */}
      <div className="p-7 sm:p-8 border-r border-b border-hairline flex flex-col justify-between gap-7">
        <div className="rounded-xl bg-surface-muted px-4 py-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-[12px] text-ink-muted">
            <span className="inline-flex items-center gap-1.5 text-ink font-medium">
              <Puzzle className="w-3.5 h-3.5 text-ink-muted" strokeWidth={1.7} />
              <span>Desktop ↔ Web</span>
            </span>
            <span className="font-mono">{zh ? '共享后端' : 'Shared backend'}</span>
          </div>
          <div className="divide-y divide-hairline text-[12.5px]">
            <div className="py-1.5 flex items-center justify-between">
              <span className="text-ink font-medium">Usage Monitor</span>
              <span className="font-mono text-[12px] text-ink-muted">
                {zh ? '双端挂件' : 'Widget'}
              </span>
            </div>
            <div className="pt-1.5 flex items-center justify-between">
              <span className="text-ink font-medium">PR Queue</span>
              <span className="font-mono text-[12px] text-ink-muted">
                {zh ? '独立页面' : 'Page'}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-[17px] font-semibold tracking-[-0.015em] text-ink">
            {zh ? '双端统一扩展与 Skill 库' : 'Unified extensions & skills'}
          </h3>
          <p className="text-[14px] leading-[1.6] text-ink-secondary">
            {zh
              ? '扩展一次安装桌面与 Web 同步生效，自动发现全局与项目 Skill。'
              : 'Install once for Desktop and Web, with auto-discovered global and repo skills.'}
          </p>
        </div>
      </div>

      {/* Tile 4: Scheduled Automations */}
      <div className="p-7 sm:p-8 border-r border-b border-hairline flex flex-col justify-between gap-7">
        <div className="rounded-xl bg-surface-muted px-4 py-3.5 divide-y divide-hairline text-[12.5px]">
          <div className="pb-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Clock className="w-3.5 h-3.5 text-ink-muted shrink-0" strokeWidth={1.7} />
              <span className="font-mono text-[12px] text-ink-muted shrink-0">09:00</span>
              <span className="text-ink font-medium truncate">
                {zh ? '每日代码巡检' : 'Daily repo audit'}
              </span>
            </div>
            <span className="inline-flex items-center gap-1 font-mono text-[12px] text-[#15803d] dark:text-[#34d399] shrink-0">
              <Check className="w-3.5 h-3.5" strokeWidth={2} />
              <span>Codex</span>
            </span>
          </div>

          <div className="pt-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Clock className="w-3.5 h-3.5 text-ink-muted shrink-0" strokeWidth={1.7} />
              <span className="font-mono text-[12px] text-ink-muted shrink-0">
                {zh ? '周五 18:00' : 'Fri 18:00'}
              </span>
              <span className="text-ink font-medium truncate">
                {zh ? '自动汇总周报' : 'Weekly PR digest'}
              </span>
            </div>
            <span className="font-mono text-[12px] text-ink-muted shrink-0">Claude Code</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-[17px] font-semibold tracking-[-0.015em] text-ink">
            {zh ? '定时任务（Schedules）' : 'Scheduled automations'}
          </h3>
          <p className="text-[14px] leading-[1.6] text-ink-secondary">
            {zh
              ? '按周期让任意 Agent 自动巡检、审计或汇总，无人值守交付。'
              : 'Run any agent on a cron schedule for audits and summaries, unattended.'}
          </p>
        </div>
      </div>
    </div>
  );
}

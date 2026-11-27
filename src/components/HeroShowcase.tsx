import { useState } from 'react';
import {
  Search,
  SquarePen,
  Folder,
  GitBranch,
  GitPullRequest,
  Terminal,
  Laptop,
  Server,
  ArrowRight,
  ArrowLeft,
  Clock,
  Check,
  Send,
  Bell,
  PanelLeft,
  PanelRight,
  ChevronDown,
  ChevronUp,
  AtSign,
  Plus,
  Mic,
  Shield,
  MoreHorizontal,
  Share,
  Copy,
  Maximize2,
  X,
  HelpCircle,
  Hash,
  Puzzle,
  Sparkles,
} from 'lucide-react';
import { COPY, type Locale } from '../data/i18n';
import { CodexHostLogo } from './Icons';

type ShowcaseTabId = 'delegation' | 'handoff' | 'multihost' | 'native';

interface HeroShowcaseProps {
  locale: Locale;
}

function StatusDot({ state }: { state: 'running' | 'waiting' | 'done' }) {
  const color =
    state === 'running'
      ? 'bg-[#16a34a]'
      : state === 'waiting'
        ? 'bg-[#ea580c]'
        : 'bg-[#2563eb]';
  return (
    <span
      className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${color}`}
      aria-hidden="true"
    />
  );
}

function AgentGlyph({
  src,
  alt,
  invertDark = false,
  size = 14,
}: {
  src: string;
  alt: string;
  invertDark?: boolean;
  size?: number;
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`shrink-0 rounded-[3px] object-contain ${invertDark ? 'dark:invert' : ''}`}
    />
  );
}

const HASH_MENU_AGENTS = [
  { name: 'Codex', icon: '/icons/codex.svg', invertDark: false },
  { name: 'Claude Code', icon: '/icons/claude-code.svg', invertDark: false },
  { name: 'Pi', icon: '/icons/pi.svg', invertDark: true },
  { name: 'Grok', icon: '/icons/grok.png', invertDark: false },
  { name: 'Antigravity CLI', icon: '/icons/antigravity.svg', invertDark: false },
];

export function HeroShowcase({ locale }: HeroShowcaseProps) {
  const [activeTab, setActiveTab] = useState<ShowcaseTabId>('delegation');
  const [selectedChild, setSelectedChild] = useState<'claude' | 'pi' | 'grok'>('claude');
  const [selectedHost, setSelectedHost] = useState<'linux' | 'local' | 'win'>('linux');
  const [showHashMenu, setShowHashMenu] = useState(false);
  const [showHandoffSource, setShowHandoffSource] = useState(false);

  const tabs = COPY[locale].hero.tabs;
  const zh = locale === 'zh';

  const childInspector = {
    claude: {
      icon: '/icons/claude-code.svg',
      invertDark: false,
      tabLabel: zh ? '补齐路由断线单测' : 'Add retry tests',
      agentName: 'Claude Code',
      branch: 'wt/peer-tests',
      taskText: zh
        ? '在隔离 Worktree 为多机断线重连与心跳超时补齐边界单测，校验 backoff 上限后汇报结果。'
        : 'Add edge-case tests for peer reconnect & heartbeat timeout in an isolated worktree.',
      elapsed: zh ? '用时 18秒' : '18s',
      summary: zh
        ? '已覆盖抖动退避、过期 Token 剔除与在途事件排队 3 组场景，正在执行最后 2 项回归。'
        : 'Covered jittered backoff, stale peer token eviction, and inflight queuing.',
      codeLabel: 'vitest · peer-router.test.ts',
      code: `✓ reconnects with jitter      18ms\n✓ drops stale peer token      12ms\n✓ queues inflight events      24ms\n● running case 7/8...`,
      state: 'running' as const,
      footerLeft: zh ? '完成后自动回传主会话' : 'Auto-reports to parent',
    },
    pi: {
      icon: '/icons/pi.svg',
      invertDark: true,
      tabLabel: zh ? '排查 Windows 管道' : 'Fix Win named pipe',
      agentName: 'Pi',
      branch: 'wt/win-pipe',
      taskText: zh
        ? '定位 Windows 命名管道 EPIPE 断连后未重置退避计时器的根因并补充回归测试。'
        : 'Fix Windows named-pipe backoff timer reset after EPIPE and verify regressions.',
      elapsed: zh ? '用时 42秒' : '42s',
      summary: zh
        ? '补丁已写入 crates/shim/src/pipe.rs，4 项回归全部通过，结果已自动汇总回父会话。'
        : 'Patch written to crates/shim/src/pipe.rs. All 4 regression tests passed and reported.',
      codeLabel: 'cargo test · codexhost-shim',
      code: `✓ resets backoff after epipe   9ms\n✓ reuses single daemon lock   11ms\n✓ hides background console     4ms\n✓ 4/4 passed · reported back`,
      state: 'done' as const,
      footerLeft: zh ? '已自动回报主会话' : 'Reported back to parent',
    },
    grok: {
      icon: '/icons/grok.png',
      invertDark: false,
      tabLabel: zh ? '核对模块边界约束' : 'Audit boundaries',
      agentName: 'Grok',
      branch: 'wt/boundary-audit',
      taskText: zh
        ? '核对跨包依赖方向，确认 shared-contracts 与 renderer-extension 保持浏览器安全。'
        : 'Verify cross-package dependency rules and browser safety for shared-contracts.',
      elapsed: zh ? '用时 14秒' : '14s',
      summary: zh
        ? '全部边界规则检查通过，未发现跨层私有导入，等待主会话确认后归档分支。'
        : 'All boundary checks passed with zero forbidden imports. Waiting for review.',
      codeLabel: 'check-boundaries.mjs',
      code: `✓ 0 forbidden cross-pkg imports\n✓ shared-contracts browser-safe\n✓ renderer-extension Node-free\n● waiting for review`,
      state: 'waiting' as const,
      footerLeft: zh ? '等待主会话确认' : 'Waiting for coordinator',
    },
  }[selectedChild];

  const hostData = {
    linux: {
      hostBadge: 'gpu-dev-01',
      path: 'ssh://gpu-dev-01/srv/worker',
      title: zh ? '排查容器内存泄漏' : 'Diagnose worker memory leak',
      agent: 'Claude Code',
      agentIcon: '/icons/claude-code.svg',
      invertDark: false,
      userMsg: zh
        ? '抓取 gpu-dev-01 上 worker-01 的堆快照，确认 RSS 持续上涨的原因并验证修复后的稳定性。'
        : 'Capture heap snapshots for worker-01 on gpu-dev-01, find the RSS leak, and verify stability.',
      elapsed: zh ? '用时 24秒' : '24s',
      summary: zh
        ? '已抓取远端容器 3 份堆快照，确认增长集中在 StreamBuffer 未释放的关闭监听。补丁应用后已完成 10 分钟稳定采样，RSS 回落至 184MB。'
        : 'Captured 3 heap snapshots and isolated an unreleased close listener in StreamBuffer. Verified 10m soak test—RSS dropped back to 184MB.',
      outputLabel: zh ? '远端采样 · gpu-dev-01 (SSH)' : 'Remote soak · gpu-dev-01 (SSH)',
      outputCode: `worker-01  rss=184MB (peak 612MB → 184MB)\nlisteners  close_hooks=1  leaked=0\nstatus     healthy · 10m soak verified`,
      phoneTitle: zh ? 'Linux 开发机' : 'Linux Dev Box',
      phoneAlert: zh
        ? 'StreamBuffer 泄漏已验证修复，RSS 稳定在 184MB，是否滚动重启？'
        : 'StreamBuffer leak verified fixed (RSS 184MB). Rolling restart now?',
      phoneReply: zh ? '保留堆快照，直接滚动重启。' : 'Keep heap dump, restart now.',
    },
    local: {
      hostBadge: 'MacBook Pro',
      path: 'local://MacBook-Pro/codex-host',
      title: zh ? '多机目录同步与重连策略' : 'Multi-host sync & reconnect',
      agent: 'Codex',
      agentIcon: '/icons/codex.svg',
      invertDark: false,
      userMsg: zh
        ? '检查本机守护进程与 2 台远端主机的 Peer Hub 状态，确认断线重连后不会丢会话。'
        : 'Check local daemon and Peer Hub state across both remote hosts to verify lossless reconnect.',
      elapsed: zh ? '用时 8秒' : '8s',
      summary: zh
        ? '本机 Host 常驻 127.0.0.1:4400，已聚合 3 台主机目录。关闭窗口或切换手机端，正在运行的会话状态实时同步且不中断。'
        : 'Local Host is live on 127.0.0.1:4400 aggregating 3 hosts. Closing the window or switching to mobile keeps every session live.',
      outputLabel: 'codexhost status',
      outputCode: `daemon     running · 127.0.0.1:4400\npeers      gpu-dev-01 (SSH) · win-studio (Peer)\nthreads    5 active · live 3-client sync`,
      phoneTitle: zh ? '本机 Mac' : 'Local Mac',
      phoneAlert: zh
        ? '3 台主机目录已实时同步，随时可从手机切换查看。'
        : '3 host directories synced live—switch anytime from mobile.',
      phoneReply: zh ? '切到 gpu-dev-01 看压测' : 'Switch to gpu-dev-01',
    },
    win: {
      hostBadge: 'win-studio',
      path: 'peer://win-studio/C:/src/codex-host',
      title: zh ? 'Windows 后台与安装器检查' : 'Windows daemon & installer check',
      agent: 'Pi',
      agentIcon: '/icons/pi.svg',
      invertDark: true,
      userMsg: zh
        ? '在 win-studio 上跑一遍命名管道与无控制台后台拉起回归测试，结果直接回报给我。'
        : 'Run named-pipe and headless daemon regression tests on win-studio and report back.',
      elapsed: zh ? '用时 15秒' : '15s',
      summary: zh
        ? '已在 Windows 11 远端主机完成两项专属回归检查，后台监管进程无弹窗残留，产物可直接从本机侧栏触发打包。'
        : 'Verified both Windows 11 regressions remotely with zero console popups—ready to package from your Mac.',
      outputLabel: zh ? '远端测试 · win-studio (Windows 11)' : 'Remote test · win-studio (Win 11)',
      outputCode: `cargo test -p codexhost-shim named_pipe\n✓ pipe reconnects after epipe   11ms\n✓ daemon hides console window    4ms`,
      phoneTitle: zh ? 'Windows 主机' : 'Windows Rig',
      phoneAlert: zh ? 'Windows 专属回归全部通过，安装包就绪。' : 'Windows regressions passed. Build ready.',
      phoneReply: zh ? '保存校验和并通知我' : 'Save checksum and notify me',
    },
  }[selectedHost];

  const activeThreadTitle =
    activeTab === 'delegation'
      ? zh
        ? '重构多机路由同步'
        : 'Refactor peer router'
      : activeTab === 'handoff'
        ? zh
          ? '支付回调幂等改造'
          : 'Webhook idempotency'
        : activeTab === 'multihost'
          ? hostData.title
          : zh
            ? '权限模型重构计划'
            : 'Auth model plan';

  const composerContext =
    activeTab === 'multihost'
      ? { repo: hostData.hostBadge, loc: selectedHost === 'local' ? (zh ? '本地' : 'Local') : 'Peer Hub', branch: 'main' }
      : activeTab === 'handoff'
        ? { repo: 'billing-api', loc: zh ? '本地' : 'Local', branch: 'feat/idempotency' }
        : { repo: 'codex-host', loc: zh ? '本地' : 'Local', branch: 'main' };

  const composerAgent =
    activeTab === 'multihost'
      ? { icon: hostData.agentIcon, invertDark: hostData.invertDark, model: hostData.agent === 'Claude Code' ? 'Opus Auto' : 'gpt-5.4 High', usage: 'CH 96% · $0.06' }
      : activeTab === 'native'
        ? { icon: '/icons/claude-code.svg', invertDark: false, model: 'Opus 4.6 · Plan', usage: 'CH 99.2% · $0.11' }
        : { icon: '/icons/codex.svg', invertDark: false, model: 'gpt-5.4 High', usage: 'CH 94% · $0.08' };

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
                onClick={() => {
                  setActiveTab(tab.id);
                  setShowHashMenu(false);
                }}
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

      {/* Authentic Full-Proportion CodexHost / Codex Desktop Window (~640px tall on desktop) */}
      <div className="showcase-frame showcase-frame-hero overflow-hidden text-left">
        <div className="grid grid-cols-1 md:grid-cols-[232px_1fr] lg:grid-cols-[232px_1fr_320px] md:h-[640px]">
          {/* LEFT SIDEBAR: Authentic Codex Desktop + CodexHost Chrome */}
          <aside className="hidden md:flex flex-col justify-between border-r border-hairline bg-[#f9f9f8] dark:bg-[#111111] text-[12.5px] select-none overflow-hidden">
            <div className="flex flex-col min-h-0">
              {/* Integrated macOS Traffic Lights + Sidebar Nav Arrows */}
              <div className="h-11 px-3.5 flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] border border-black/10" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e] border border-black/10" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28c840] border border-black/10" />
                </div>
                <div className="flex items-center gap-2 text-ink-muted ml-1">
                  <PanelLeft className="w-3.5 h-3.5" strokeWidth={1.6} />
                  <ArrowLeft className="w-3.5 h-3.5 opacity-60" strokeWidth={1.6} />
                  <ArrowRight className="w-3.5 h-3.5 opacity-40" strokeWidth={1.6} />
                </div>
              </div>

              {/* Brand Dropdown + Search / Bell */}
              <div className="px-3.5 pb-2 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[14px] font-semibold text-ink tracking-[-0.015em]">
                  <span>Codex</span>
                  <ChevronDown className="w-3.5 h-3.5 text-ink-muted" />
                </span>
                <div className="flex items-center gap-2.5 text-ink-muted">
                  <Search className="w-3.5 h-3.5" strokeWidth={1.6} />
                  <Bell className="w-3.5 h-3.5" strokeWidth={1.6} />
                </div>
              </div>

              {/* Core Navigation */}
              <div className="px-2 space-y-0.5 text-ink-secondary">
                <div className="px-2 py-1.5 rounded-md flex items-center justify-between hover:bg-black/[0.03] dark:hover:bg-white/[0.04]">
                  <span className="inline-flex items-center gap-2">
                    <SquarePen className="w-3.5 h-3.5 text-ink-muted" strokeWidth={1.6} />
                    <span>{zh ? '新对话' : 'New thread'}</span>
                  </span>
                  <Plus className="w-3.5 h-3.5 text-ink-muted" strokeWidth={1.6} />
                </div>
                <div className="px-2 py-1.5 rounded-md flex items-center gap-2">
                  <GitPullRequest className="w-3.5 h-3.5 text-ink-muted" strokeWidth={1.6} />
                  <span>Pull Request</span>
                </div>
                <div className="px-2 py-1.5 rounded-md flex items-center justify-between">
                  <span className="inline-flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-ink-muted" strokeWidth={1.6} />
                    <span>{zh ? '定时任务' : 'Schedules'}</span>
                  </span>
                  <span className="font-mono text-[12px] text-ink-muted">3</span>
                </div>
                <div className="px-2 py-1.5 rounded-md flex items-center justify-between">
                  <span className="inline-flex items-center gap-2">
                    <AtSign className="w-3.5 h-3.5 text-ink-muted" strokeWidth={1.6} />
                    <span>{zh ? '插件' : 'Extensions'}</span>
                  </span>
                  <span className="font-mono text-[12px] text-ink-muted">6</span>
                </div>
              </div>

              {/* Projects & Remote Hosts */}
              <div className="mt-4 px-2 space-y-1 overflow-y-auto">
                <div className="px-2 pb-0.5 text-[12px] font-medium text-ink-muted">
                  {zh ? '项目' : 'Projects'}
                </div>

                {/* Remote Host Group (Real CodexHost SSH/Peer Hub style) */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('multihost');
                    setSelectedHost('linux');
                  }}
                  className={`w-full text-left px-2 py-1 rounded-md flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                    activeTab === 'multihost' && selectedHost === 'linux'
                      ? 'bg-[#ececea] dark:bg-[#1e1e1e] text-ink font-medium'
                      : 'text-ink-secondary hover:bg-black/[0.03] dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5 min-w-0">
                    <Server className="w-3.5 h-3.5 text-ink-muted shrink-0" strokeWidth={1.6} />
                    <span className="truncate">{zh ? '远程-VPS' : 'Remote-VPS'}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 shrink-0 font-mono text-[12px] text-ink-muted">
                    <span>gpu-01</span>
                    <StatusDot state="running" />
                  </span>
                </button>
                <div className="pl-3 space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('multihost');
                      setSelectedHost('linux');
                    }}
                    className={`w-full text-left px-2 py-1 rounded-md flex items-center justify-between gap-1.5 transition-colors cursor-pointer ${
                      activeTab === 'multihost' && selectedHost === 'linux'
                        ? 'text-ink font-medium'
                        : 'text-ink-secondary hover:text-ink'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5 min-w-0">
                      <AgentGlyph src="/icons/claude-code.svg" alt="Claude Code" />
                      <span className="truncate">{zh ? '排查容器内存泄漏' : 'Worker memory leak'}</span>
                    </span>
                    <span className="font-mono text-[12px] text-ink-muted shrink-0">⌘1</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('multihost');
                      setSelectedHost('win');
                    }}
                    className={`w-full text-left px-2 py-1 rounded-md flex items-center justify-between gap-1.5 transition-colors cursor-pointer ${
                      activeTab === 'multihost' && selectedHost === 'win'
                        ? 'bg-[#ececea] dark:bg-[#1e1e1e] text-ink font-medium'
                        : 'text-ink-secondary hover:text-ink'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5 min-w-0">
                      <AgentGlyph src="/icons/pi.svg" alt="Pi" invertDark />
                      <span className="truncate">{zh ? 'Windows 后台检查' : 'Win daemon check'}</span>
                    </span>
                    <span className="font-mono text-[12px] text-ink-muted shrink-0">⌘2</span>
                  </button>
                </div>

                {/* Local Project: codex-host */}
                <div className="pt-2">
                  <div className="px-2 py-1 rounded-md flex items-center justify-between font-medium text-ink">
                    <span className="inline-flex items-center gap-1.5">
                      <Folder className="w-3.5 h-3.5 text-ink-muted" strokeWidth={1.6} />
                      <span>codex-host</span>
                    </span>
                    <span className="font-mono text-[12px] text-ink-muted">{zh ? '本机' : 'local'}</span>
                  </div>

                  {/* Active Parent Thread */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('delegation')}
                    className={`w-full text-left px-2 py-1.5 rounded-md flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      activeTab === 'delegation'
                        ? 'bg-[#ececea] dark:bg-[#1e1e1e] text-ink font-medium'
                        : 'text-ink-secondary hover:bg-black/[0.03] dark:hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5 min-w-0">
                      <AgentGlyph src="/icons/codex.svg" alt="Codex" />
                      <span className="truncate">{zh ? '重构多机路由同步' : 'Refactor peer router'}</span>
                    </span>
                    <StatusDot state="running" />
                  </button>

                  {/* Indented Child Delegation Tree */}
                  <div className="ml-3 pl-2.5 border-l border-hairline-strong space-y-0.5 py-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('delegation');
                        setSelectedChild('claude');
                      }}
                      className={`w-full text-left px-2 py-1 rounded-md flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                        activeTab === 'delegation' && selectedChild === 'claude'
                          ? 'bg-[#f1f1ef] dark:bg-[#191919] text-ink font-medium'
                          : 'text-ink-secondary hover:text-ink'
                      }`}
                    >
                      <span className="inline-flex items-center gap-1.5 min-w-0">
                        <AgentGlyph src="/icons/claude-code.svg" alt="Claude Code" />
                        <span className="truncate">{zh ? '补齐路由断线单测' : 'Add retry tests'}</span>
                      </span>
                      <StatusDot state="running" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('delegation');
                        setSelectedChild('pi');
                      }}
                      className={`w-full text-left px-2 py-1 rounded-md flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                        activeTab === 'delegation' && selectedChild === 'pi'
                          ? 'bg-[#f1f1ef] dark:bg-[#191919] text-ink font-medium'
                          : 'text-ink-secondary hover:text-ink'
                      }`}
                    >
                      <span className="inline-flex items-center gap-1.5 min-w-0">
                        <AgentGlyph src="/icons/pi.svg" alt="Pi" invertDark />
                        <span className="truncate">{zh ? '排查 Windows 管道' : 'Fix Win named pipe'}</span>
                      </span>
                      <StatusDot state="done" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('delegation');
                        setSelectedChild('grok');
                      }}
                      className={`w-full text-left px-2 py-1 rounded-md flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                        activeTab === 'delegation' && selectedChild === 'grok'
                          ? 'bg-[#f1f1ef] dark:bg-[#191919] text-ink font-medium'
                          : 'text-ink-secondary hover:text-ink'
                      }`}
                    >
                      <span className="inline-flex items-center gap-1.5 min-w-0">
                        <AgentGlyph src="/icons/grok.png" alt="Grok" />
                        <span className="truncate">{zh ? '核对模块边界约束' : 'Audit boundaries'}</span>
                      </span>
                      <StatusDot state="waiting" />
                    </button>
                  </div>
                </div>

                {/* Secondary Projects */}
                <div className="pt-1.5 space-y-0.5 text-ink-secondary">
                  <button
                    type="button"
                    onClick={() => setActiveTab('handoff')}
                    className={`w-full text-left px-2 py-1 rounded-md flex items-center justify-between gap-2 cursor-pointer ${
                      activeTab === 'handoff'
                        ? 'bg-[#ececea] dark:bg-[#1e1e1e] text-ink font-medium'
                        : 'hover:text-ink'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5 truncate">
                      <Folder className="w-3.5 h-3.5 text-ink-muted shrink-0" strokeWidth={1.6} />
                      <span className="truncate">billing-api</span>
                    </span>
                    <span className="font-mono text-[12px] text-ink-muted">{zh ? '交接' : 'handoff'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('native')}
                    className={`w-full text-left px-2 py-1 rounded-md flex items-center justify-between gap-2 cursor-pointer ${
                      activeTab === 'native'
                        ? 'bg-[#ececea] dark:bg-[#1e1e1e] text-ink font-medium'
                        : 'hover:text-ink'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5 truncate">
                      <Folder className="w-3.5 h-3.5 text-ink-muted shrink-0" strokeWidth={1.6} />
                      <span className="truncate">console-web</span>
                    </span>
                    <span className="font-mono text-[12px] text-ink-muted">Plan</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar Bottom Bar (matches real Codex Desktop footer) */}
            <div className="h-11 px-3 border-t border-hairline flex items-center justify-between text-[12px] text-ink-muted shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-full bg-cta text-cta-ink font-mono text-[12px] flex items-center justify-center shrink-0">
                  H
                </span>
                <span className="truncate text-ink-secondary">
                  {zh ? 'Host 本地常驻' : 'Host active'}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Mic className="w-3.5 h-3.5" strokeWidth={1.6} />
                <HelpCircle className="w-3.5 h-3.5" strokeWidth={1.6} />
              </div>
            </div>
          </aside>

          {/* CENTER MAIN WORKSPACE PANE */}
          <div className="flex flex-col justify-between bg-surface-card lg:border-r border-hairline min-w-0 h-full overflow-hidden">
            {/* Authentic CodexHost Main Header */}
            <div className="h-11 px-4 border-b border-hairline flex items-center justify-between gap-3 text-[12.5px] shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <Folder className="w-3.5 h-3.5 text-ink-muted shrink-0" strokeWidth={1.6} />
                <span className="font-medium text-ink truncate">{activeThreadTitle}</span>
              </div>

              <div className="flex items-center gap-3 text-ink-muted shrink-0">
                <MoreHorizontal className="w-4 h-4 hidden sm:block" strokeWidth={1.6} />
                <span className="inline-flex items-center gap-1.5 font-medium text-ink">
                  <CodexHostLogo lightClassName="w-[15px] h-4" darkClassName="w-[18px] h-[18px]" alt="" />
                  <span>CodexHost</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[12px]">
                  <Share className="w-3.5 h-3.5" strokeWidth={1.6} />
                  <span>{zh ? '分享' : 'Share'}</span>
                </span>
                <PanelRight className="w-3.5 h-3.5 hidden lg:block" strokeWidth={1.6} />
              </div>
            </div>

            {/* Spacious Conversation Body */}
            <div className="flex-1 p-5 sm:px-6 sm:py-5 overflow-hidden flex flex-col justify-between">
              {/* TAB 1: Multi-Agent Delegation */}
              {activeTab === 'delegation' && (
                <div className="space-y-4 text-[13px] leading-[1.62]">
                  {/* Right-aligned soft user bubble with inline Agent chips */}
                  <div className="flex justify-end">
                    <div className="max-w-[90%] rounded-[18px] bg-[#edf3ff] dark:bg-[#1c2330] px-4 py-2.5 text-ink">
                      {zh ? (
                        <>
                          重构多机路由同步，让{' '}
                          <span className="inline-flex items-center gap-1 align-middle font-medium text-[#1d4ed8] dark:text-[#93c5fd] whitespace-nowrap">
                            <AgentGlyph src="/icons/claude-code.svg" alt="Claude Code" size={13} />
                            Claude Code
                          </span>{' '}
                          补齐断线单测，让{' '}
                          <span className="inline-flex items-center gap-1 align-middle font-medium text-[#1d4ed8] dark:text-[#93c5fd] whitespace-nowrap">
                            <AgentGlyph src="/icons/pi.svg" alt="Pi" invertDark size={13} />
                            Pi
                          </span>{' '}
                          排查 Windows 命名管道重连问题。
                        </>
                      ) : (
                        <>
                          Refactor peer router sync. Have{' '}
                          <span className="inline-flex items-center gap-1 align-middle font-medium text-[#1d4ed8] dark:text-[#93c5fd] whitespace-nowrap">
                            <AgentGlyph src="/icons/claude-code.svg" alt="Claude Code" size={13} />
                            Claude Code
                          </span>{' '}
                          add retry tests and{' '}
                          <span className="inline-flex items-center gap-1 align-middle font-medium text-[#1d4ed8] dark:text-[#93c5fd] whitespace-nowrap">
                            <AgentGlyph src="/icons/pi.svg" alt="Pi" invertDark size={13} />
                            Pi
                          </span>{' '}
                          fix the Windows named-pipe reconnect issue.
                        </>
                      )}
                    </div>
                  </div>

                  {/* Authentic CodexHost Step Disclosure Row */}
                  <div className="space-y-2 text-[12.5px] text-ink-muted">
                    <div className="flex items-center gap-2 pb-1.5 border-b border-hairline">
                      <span>{zh ? '用时 46秒' : 'Worked for 46s'}</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 shrink-0" strokeWidth={1.6} />
                      <span>{zh ? '运行了命令 subagent · 并行派发 3 个隔离 Worktree' : 'Ran subagent · dispatched 3 isolated worktrees'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-ink-secondary">
                      <span className="inline-flex items-center gap-1">
                        <AgentGlyph src="/icons/claude-code.svg" alt="Claude Code" size={13} />
                        <AgentGlyph src="/icons/pi.svg" alt="Pi" invertDark size={13} />
                        <AgentGlyph src="/icons/grok.png" alt="Grok" size={13} />
                      </span>
                      <span className="truncate">
                        {zh
                          ? '补齐路由断线单测、排查 Windows 管道 和另外 1 个子智能体'
                          : 'Retry tests, Windows named pipe, and 1 other subagent'}
                      </span>
                    </div>
                  </div>

                  {/* Coordinator Reply & Clickable Child Task List */}
                  <div className="space-y-3">
                    <p className="text-ink">
                      {zh
                        ? '已拉起 3 个独立原生子会话并在各自 Git Worktree 并行推进，点击任意行可在右侧实时查看执行过程：'
                        : 'Launched 3 native child sessions in isolated Git worktrees. Click any row to inspect live in the split panel:'}
                    </p>

                    <div className="border-t border-b border-hairline divide-y divide-hairline text-[12.5px]">
                      <button
                        type="button"
                        onClick={() => setSelectedChild('claude')}
                        className={`w-full py-2.5 px-2 flex items-center justify-between gap-2 text-left transition-colors cursor-pointer ${
                          selectedChild === 'claude' ? 'bg-surface-muted/75' : 'hover:bg-surface-muted/40'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <AgentGlyph src="/icons/claude-code.svg" alt="Claude Code" />
                          <span className="font-medium text-ink">Claude Code</span>
                          <span className="text-ink-muted font-mono truncate">wt/peer-tests</span>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-ink-secondary shrink-0">
                          <StatusDot state="running" />
                          <span>{zh ? '运行中 · 6/8' : 'Running · 6/8'}</span>
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedChild('pi')}
                        className={`w-full py-2.5 px-2 flex items-center justify-between gap-2 text-left transition-colors cursor-pointer ${
                          selectedChild === 'pi' ? 'bg-surface-muted/75' : 'hover:bg-surface-muted/40'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <AgentGlyph src="/icons/pi.svg" alt="Pi" invertDark />
                          <span className="font-medium text-ink">Pi</span>
                          <span className="text-ink-muted font-mono truncate">wt/win-pipe</span>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-ink-secondary shrink-0">
                          <StatusDot state="done" />
                          <span>{zh ? '已自动回报' : 'Reported back'}</span>
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedChild('grok')}
                        className={`w-full py-2.5 px-2 flex items-center justify-between gap-2 text-left transition-colors cursor-pointer ${
                          selectedChild === 'grok' ? 'bg-surface-muted/75' : 'hover:bg-surface-muted/40'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <AgentGlyph src="/icons/grok.png" alt="Grok" />
                          <span className="font-medium text-ink">Grok</span>
                          <span className="text-ink-muted font-mono truncate">wt/boundary-audit</span>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-ink-secondary shrink-0">
                          <StatusDot state="waiting" />
                          <span>{zh ? '待确认' : 'Review'}</span>
                        </span>
                      </button>
                    </div>

                    <div className="pl-3 border-l-2 border-hairline-strong py-0.5 text-[12.5px] space-y-1">
                      <div className="flex items-center justify-between text-[12px] text-ink-muted">
                        <span className="inline-flex items-center gap-1.5 font-medium text-ink">
                          <AgentGlyph src="/icons/pi.svg" alt="Pi" invertDark size={13} />
                          <span>{zh ? '来自 #pi 的自动汇报' : 'Auto-report from #pi'}</span>
                        </span>
                        <span className="font-mono">00:42</span>
                      </div>
                      <p className="text-ink-secondary leading-[1.55]">
                        {zh
                          ? '已修复 crates/shim/src/pipe.rs 断连退避问题，4 项回归全部通过。'
                          : 'Fixed reconnect backoff in crates/shim/src/pipe.rs; all 4 regressions pass.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Cross-Agent Context Handoff */}
              {activeTab === 'handoff' && (
                <div className="space-y-4 text-[13px] leading-[1.62]">
                  <div className="pl-3.5 border-l-2 border-hairline-strong py-1 text-[12.5px] text-ink-secondary space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 font-medium text-ink">
                        <AgentGlyph src="/icons/claude-code.svg" alt="Claude Code" size={13} />
                        <span>{zh ? '前 6 轮上下文摘要（Claude Code）' : 'Prior 6 turns summary (Claude Code)'}</span>
                      </span>
                      <span className="font-mono text-[12px] text-ink-muted">src/webhooks/</span>
                    </div>
                    <p>
                      {zh
                        ? '已确认重复回调源于重试与队列并发竞态；约定采用 event_id 唯一索引 + 乐观锁，保留原有错误码结构。'
                        : 'Root cause confirmed as retry/consumer race. Agreed on unique event_id index + optimistic lock while preserving error codes.'}
                    </p>
                  </div>

                  {/* Interactive Handoff Divider */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-hairline-strong" />
                      <div className="inline-flex flex-wrap items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-surface-muted text-[12px] text-ink">
                        <AgentGlyph src="/icons/claude-code.svg" alt="Claude Code" size={13} />
                        <span className="font-medium">Claude Code</span>
                        <ArrowRight className="w-3 h-3 text-ink-muted" />
                        <AgentGlyph src="/icons/codex.svg" alt="Codex" size={13} />
                        <span className="font-medium">Codex</span>
                        <span className="text-ink-muted">·</span>
                        <button
                          type="button"
                          onClick={() => setShowHandoffSource((v) => !v)}
                          className="inline-flex items-center gap-0.5 underline underline-offset-2 font-medium cursor-pointer"
                        >
                          <span>{zh ? '查看源会话' : 'View source'}</span>
                          {showHandoffSource ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>
                      <div className="h-px flex-1 bg-hairline-strong" />
                    </div>

                    {showHandoffSource && (
                      <div className="rounded-lg border border-hairline bg-surface-muted/70 px-3 py-2 font-mono text-[12px] text-ink-secondary space-y-1">
                        <div>{zh ? 'Turn 2 · 锁定并发竞态根因与重试窗口' : 'Turn 2 · Isolated concurrent retry race'}</div>
                        <div>{zh ? 'Turn 5 · 确认迁移表结构与 3 个核心文件索引' : 'Turn 5 · Locked schema migration + 3 files'}</div>
                      </div>
                    )}
                  </div>

                  {/* Turn 7 User Bubble */}
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-[18px] bg-[#edf3ff] dark:bg-[#1c2330] px-4 py-2.5 text-ink">
                      {zh
                        ? '按敲定的唯一约束方案直接落地改动，并跑通并发竞态单测。'
                        : 'Implement the agreed uniqueness constraint and run the concurrency suite.'}
                    </div>
                  </div>

                  {/* Codex Turn 7 Execution */}
                  <div className="space-y-3">
                    <div className="text-[12.5px] text-ink-muted pb-1.5 border-b border-hairline flex items-center gap-2">
                      <span>{zh ? '用时 21秒' : 'Worked for 21s'}</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                    <p className="text-ink">
                      {zh
                        ? '已承接前 6 轮约束结论，无需复制前情，直接完成迁移脚本、逻辑改动与并发回归：'
                        : 'Carried forward all 6-turn decisions directly—zero copy-pasting. Completed migration, code update, and concurrency suite:'}
                    </p>
                    <div className="border-t border-b border-hairline divide-y divide-hairline font-mono text-[12px] text-ink-secondary">
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-ink">migrations/042_webhook_event_unique.sql</span>
                        <span>{zh ? '已生成' : 'created'}</span>
                      </div>
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-ink">src/webhooks/idempotency.ts</span>
                        <span>{zh ? '已更新' : 'updated'}</span>
                      </div>
                      <div className="py-2 flex items-center justify-between">
                        <span className="text-ink">tests/webhooks/concurrent-retry.test.ts</span>
                        <span className="inline-flex items-center gap-1.5 text-ink">
                          <StatusDot state="done" />
                          <span>12/12 passed</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Multi-Host & Mobile */}
              {activeTab === 'multihost' && (
                <div className="space-y-4 text-[13px] leading-[1.62]">
                  {/* Host Pills Switcher */}
                  <div className="flex flex-wrap items-center gap-2 text-[12px]">
                    {(
                      [
                        { id: 'linux', label: zh ? 'Linux 开发机 · gpu-dev-01' : 'Linux · gpu-dev-01', tag: 'SSH' },
                        { id: 'local', label: zh ? '本机 Mac' : 'Local Mac', tag: 'local' },
                        { id: 'win', label: zh ? 'Windows 主机' : 'Windows Rig', tag: 'Peer' },
                      ] as const
                    ).map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setSelectedHost(h.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[12px] transition-colors cursor-pointer ${
                          selectedHost === h.id
                            ? 'border-hairline-strong bg-surface-muted text-ink font-medium'
                            : 'border-hairline text-ink-secondary hover:text-ink'
                        }`}
                      >
                        <StatusDot state="running" />
                        <span>{h.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="max-w-[90%] rounded-[18px] bg-[#edf3ff] dark:bg-[#1c2330] px-4 py-2.5 text-ink">
                      {hostData.userMsg}
                    </div>
                  </div>

                  {/* Execution disclosure */}
                  <div className="space-y-1.5 text-[12.5px] text-ink-muted">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5" strokeWidth={1.6} />
                      <span>{zh ? `在 ${hostData.hostBadge} 上运行了命令` : `Ran command on ${hostData.hostBadge}`}</span>
                    </div>
                    <div className="pb-1.5 border-b border-hairline">{hostData.elapsed}</div>
                  </div>

                  <p className="text-ink">{hostData.summary}</p>

                  <div className="rounded-lg bg-surface-muted overflow-hidden border border-hairline">
                    <div className="px-3.5 py-2 border-b border-hairline text-[12px] font-mono text-ink-muted flex items-center justify-between">
                      <span>{hostData.outputLabel}</span>
                      <span className="inline-flex items-center gap-1.5">
                        <StatusDot state="running" />
                        <span>live</span>
                      </span>
                    </div>
                    <pre className="px-3.5 py-3 font-mono text-[12px] leading-[1.65] text-ink-secondary overflow-x-auto">
                      <code>{hostData.outputCode}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* TAB 4: Native Capabilities & Extensions */}
              {activeTab === 'native' && (
                <div className="space-y-4 text-[13px] leading-[1.62]">
                  <div className="flex items-center justify-between pb-2.5 border-b border-hairline text-[12.5px]">
                    <span className="inline-flex items-center gap-2 font-medium text-ink">
                      <AgentGlyph src="/icons/claude-code.svg" alt="Claude Code" size={15} />
                      <span>Claude Code</span>
                      <span className="px-2 py-0.5 rounded bg-surface-muted font-mono text-[12px] text-ink-secondary">
                        Plan Mode
                      </span>
                    </span>
                    <span className="font-mono text-[12px] text-ink-muted">
                      {zh ? '原生协议 · 支持运行中插话' : 'Native · Mid-run steer'}
                    </span>
                  </div>

                  <div className="rounded-lg border border-hairline bg-canvas-subtle p-4 space-y-2.5">
                    <div className="font-medium text-ink">
                      {zh ? '执行计划（等待确认后落盘）' : 'Execution plan (awaits confirmation)'}
                    </div>
                    <ul className="space-y-1.5 text-ink-secondary text-[12.5px]">
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 mt-1 text-ink shrink-0" />
                        <span>
                          {zh
                            ? '拆分插件加载契约与宿主机配置，保持 shared-contracts 浏览器安全'
                            : 'Split plugin loader contract from host config; keep shared-contracts browser-safe'}
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 mt-1 text-ink shrink-0" />
                        <span>
                          {zh
                            ? '直接导入本机原生历史会话索引，断点无缝续聊'
                            : 'Import local native session history directly for seamless resume'}
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Mid-run Steer Bubble */}
                  <div className="flex justify-end">
                    <div className="max-w-[88%] rounded-[18px] bg-[#edf3ff] dark:bg-[#1c2330] px-4 py-2.5 text-ink">
                      {zh
                        ? '插话：先跳过慢速 E2E，优先跑通协议层单测并保持后台 dev 服务常驻。'
                        : 'Steer: skip slow E2E for now, run protocol-core tests first and keep dev server running.'}
                    </div>
                  </div>

                  <div className="text-[12.5px] text-ink-secondary flex items-center gap-2">
                    <AgentGlyph src="/icons/claude-code.svg" alt="Claude Code" size={14} />
                    <span>
                      {zh
                        ? '已即时调整执行顺序，后台终端保持绑定至当前会话：'
                        : 'Adjusted execution order mid-run; background terminal stays attached:'}
                    </span>
                  </div>

                  <div className="rounded-lg bg-surface-muted px-3.5 py-2.5 font-mono text-[12px] space-y-1 border border-hairline">
                    <div className="flex items-center justify-between text-ink-muted">
                      <span className="inline-flex items-center gap-1.5 text-ink">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>bg-term #2 · vite dev --port 5173</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <StatusDot state="running" />
                        <span>running</span>
                      </span>
                    </div>
                    <div className="text-ink-secondary">
                      VITE v6.0 ready in 214 ms → http://127.0.0.1:5173/
                    </div>
                  </div>
                </div>
              )}

              {/* REAL FLOATING CODEXHOST COMPOSER (Authentic signature bottom dock!) */}
              <div className="relative pt-4 shrink-0">
                {/* Interactive # Delegation Popover (matches real composer-hash-delegation-menu.png) */}
                {showHashMenu && (
                  <div className="absolute left-0 bottom-[106px] z-20 w-[260px] rounded-[14px] border border-hairline-strong bg-surface-card shadow-[0_14px_36px_-12px_rgba(0,0,0,0.18)] p-1.5 text-[12.5px]">
                    <div className="px-2.5 py-1.5 flex items-center justify-between text-[12px] text-ink-muted">
                      <span>{zh ? '委派给 Agent' : 'Delegate to Agent'}</span>
                      <span className="font-mono">codexhost</span>
                    </div>
                    {HASH_MENU_AGENTS.map((ag, idx) => (
                      <button
                        key={ag.name}
                        type="button"
                        onClick={() => setShowHashMenu(false)}
                        className={`w-full px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-left cursor-pointer ${
                          idx === 1 ? 'bg-surface-muted text-ink font-medium' : 'text-ink-secondary hover:bg-surface-muted/60 hover:text-ink'
                        }`}
                      >
                        <AgentGlyph src={ag.icon} alt={ag.name} invertDark={ag.invertDark} size={15} />
                        <span>{ag.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Context metadata row above composer */}
                <div className="flex items-center gap-3 px-2 pb-1.5 text-[12px] text-ink-muted">
                  <span className="inline-flex items-center gap-1">
                    <Folder className="w-3.5 h-3.5" strokeWidth={1.6} />
                    <span>{composerContext.repo}</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Laptop className="w-3.5 h-3.5" strokeWidth={1.6} />
                    <span>{composerContext.loc}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono">
                    <GitBranch className="w-3 h-3" strokeWidth={1.6} />
                    <span>{composerContext.branch}</span>
                  </span>
                </div>

                {/* Rounded-2xl Floating Composer Dock */}
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="rounded-[18px] ring-1 ring-inset ring-hairline-strong bg-surface-card px-3 pt-2.5 pb-2.5 space-y-2.5"
                >
                  <div className="text-[13px] text-ink-muted">
                    {zh ? '随心输入，或点 # 委派其他 Agent...' : 'Ask anything, or click # to delegate...'}
                  </div>

                  <div className="flex items-center justify-between gap-2 text-[12px]">
                    <div className="flex items-center gap-1.5 text-ink-secondary min-w-0">
                      <span className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-surface-muted shrink-0">
                        <Plus className="w-4 h-4" strokeWidth={1.7} />
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowHashMenu((v) => !v)}
                        title={zh ? '预览 # 委派菜单' : 'Preview # delegation menu'}
                        className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                          showHashMenu
                            ? 'bg-cta text-cta-ink'
                            : 'bg-surface-muted text-ink hover:opacity-80'
                        }`}
                      >
                        <Hash className="w-3.5 h-3.5" strokeWidth={1.9} />
                      </button>
                      <span className="hidden sm:inline-flex items-center gap-1 text-ink-secondary whitespace-nowrap shrink-0">
                        <Shield className="w-3.5 h-3.5 text-ink-muted shrink-0" strokeWidth={1.6} />
                        <span>{activeTab === 'native' ? 'Plan Mode' : 'Bypass permissions'}</span>
                        <ChevronDown className="w-3 h-3 text-ink-muted shrink-0" />
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-ink-muted shrink-0">
                      <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-full bg-surface-muted font-mono text-[12px] text-ink-secondary whitespace-nowrap">
                        {composerAgent.usage}
                      </span>
                      <span className="hidden sm:inline font-mono text-[12px] text-ink-secondary whitespace-nowrap">
                        {composerAgent.model}
                      </span>
                      <span className="w-6 h-6 rounded-md bg-surface-muted flex items-center justify-center shrink-0">
                        <AgentGlyph
                          src={composerAgent.icon}
                          alt="Active Agent"
                          invertDark={composerAgent.invertDark}
                          size={14}
                        />
                      </span>
                      <Mic className="w-3.5 h-3.5 hidden sm:block shrink-0" strokeWidth={1.6} />
                      <span className="w-6 h-6 rounded-full bg-cta text-cta-ink flex items-center justify-center shrink-0">
                        <ArrowRight className="w-3.5 h-3.5 -rotate-90" strokeWidth={2} />
                      </span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* RIGHT SPLIT INSPECTOR PANE (Authentic highlight-subagent.png / highlight-account-import.png split!) */}
          <div className="hidden lg:flex flex-col justify-between bg-[#fcfcfc] dark:bg-[#121212] text-[12.5px] h-full overflow-hidden">
            {/* Tab 1 Right: Live Subagent Split Pane */}
            {activeTab === 'delegation' && (
              <>
                <div className="flex flex-col min-h-0">
                  <div className="h-11 px-3 border-b border-hairline flex items-center justify-between gap-2 shrink-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-muted text-ink font-medium text-[12px] min-w-0">
                        <AgentGlyph
                          src={childInspector.icon}
                          alt={childInspector.agentName}
                          invertDark={childInspector.invertDark}
                          size={13}
                        />
                        <span className="truncate">{childInspector.tabLabel}</span>
                        <X className="w-3 h-3 text-ink-muted shrink-0 ml-1" />
                      </span>
                      <Plus className="w-3.5 h-3.5 text-ink-muted shrink-0" />
                    </div>
                    <Maximize2 className="w-3.5 h-3.5 text-ink-muted shrink-0" strokeWidth={1.6} />
                  </div>

                  <div className="p-4 space-y-4 overflow-hidden">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between font-mono text-[12px] text-ink-muted">
                        <span>[subagent / {childInspector.agentName}]</span>
                        <span>{childInspector.branch}</span>
                      </div>
                      <p className="text-[12.5px] text-ink leading-[1.58]">{childInspector.taskText}</p>
                    </div>

                    <div className="text-[12px] text-ink-muted pb-2 border-b border-hairline">
                      {childInspector.elapsed}
                    </div>

                    <p className="text-[13px] text-ink leading-[1.6]">{childInspector.summary}</p>

                    <div className="rounded-lg border border-hairline bg-surface-muted/70 overflow-hidden">
                      <div className="px-3 py-2 border-b border-hairline flex items-center justify-between font-mono text-[12px] text-ink-muted">
                        <span>&lt;/&gt; {childInspector.codeLabel}</span>
                        <Copy className="w-3.5 h-3.5" strokeWidth={1.6} />
                      </div>
                      <pre className="p-3 font-mono text-[12px] leading-[1.65] text-ink-secondary overflow-x-auto">
                        <code>{childInspector.code}</code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="h-11 px-4 border-t border-hairline flex items-center justify-between text-[12px] text-ink-muted shrink-0">
                  <span className="inline-flex items-center gap-1.5">
                    <StatusDot state={childInspector.state} />
                    <span>{childInspector.footerLeft}</span>
                  </span>
                  <span className="font-mono">worktree</span>
                </div>
              </>
            )}

            {/* Tab 2 Right: Intact Source Context Outline */}
            {activeTab === 'handoff' && (
              <>
                <div className="flex flex-col min-h-0">
                  <div className="h-11 px-3.5 border-b border-hairline flex items-center justify-between gap-2 shrink-0">
                    <span className="inline-flex items-center gap-1.5 font-medium text-ink text-[12.5px]">
                      <AgentGlyph src="/icons/claude-code.svg" alt="Claude Code" size={13} />
                      <span>{zh ? '源会话上下文包' : 'Source context bundle'}</span>
                    </span>
                    <span className="font-mono text-[12px] text-ink-muted">6 turns</span>
                  </div>

                  <div className="p-4 space-y-4">
                    <div className="space-y-1.5">
                      <div className="text-[12px] font-medium text-ink-muted">
                        {zh ? '已继承的设计约束' : 'Carried constraints'}
                      </div>
                      <ul className="space-y-2 text-[12.5px] text-ink-secondary">
                        <li className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 mt-0.5 text-ink shrink-0" />
                          <span>{zh ? 'event_id 唯一索引防并发重入' : 'Unique event_id index against races'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 mt-0.5 text-ink shrink-0" />
                          <span>{zh ? '状态机乐观锁替代热路径同步锁' : 'Optimistic state lock on hot path'}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 mt-0.5 text-ink shrink-0" />
                          <span>{zh ? '对外错误码与 HTTP 状态保持兼容' : 'Backward-compatible error codes'}</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-hairline space-y-2">
                      <div className="text-[12px] font-medium text-ink-muted">
                        {zh ? '关联文件索引 (3)' : 'Referenced files (3)'}
                      </div>
                      <div className="divide-y divide-hairline border-t border-b border-hairline font-mono text-[12px] text-ink-secondary">
                        <div className="py-2 truncate">src/webhooks/handler.ts</div>
                        <div className="py-2 truncate">src/webhooks/idempotency.ts</div>
                        <div className="py-2 truncate">db/schema/webhook_events.sql</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-11 px-4 border-t border-hairline flex items-center justify-between text-[12px] text-ink-muted shrink-0">
                  <span>{zh ? '原会话只读保留' : 'Source thread intact'}</span>
                  <span className="font-mono">Handoff v2</span>
                </div>
              </>
            )}

            {/* Tab 3 Right: Dedicated Mobile Relay Companion */}
            {activeTab === 'multihost' && (
              <>
                <div className="flex flex-col min-h-0">
                  <div className="h-11 px-4 border-b border-hairline flex items-center justify-between shrink-0">
                    <span className="font-medium text-ink text-[12.5px]">CodexHost Mobile</span>
                    <span className="inline-flex items-center gap-1.5 font-mono text-[12px] text-ink-muted">
                      <StatusDot state="running" />
                      <span>Relay</span>
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-center">
                    <div className="rounded-[22px] border border-hairline-strong bg-surface-card p-3.5 space-y-3 shadow-[0_12px_30px_-14px_rgba(0,0,0,0.12)]">
                      <div className="flex items-center justify-between text-[12px] font-mono text-ink-muted pb-2 border-b border-hairline">
                        <span>9:41</span>
                        <span className="w-9 h-1 rounded-full bg-hairline-strong" />
                        <span>5G</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-ink">{hostData.phoneTitle}</span>
                        <StatusDot state="running" />
                      </div>
                      <div className="rounded-xl bg-surface-muted p-3 text-[12.5px] text-ink-secondary leading-[1.55]">
                        {hostData.phoneAlert}
                      </div>
                      <div className="rounded-xl bg-cta text-cta-ink px-3 py-2 text-[12.5px] font-medium leading-[1.45]">
                        {hostData.phoneReply}
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-surface-muted px-3 py-2 text-[12px] text-ink-muted">
                        <span>{zh ? '回复该主机...' : 'Reply...'}</span>
                        <Send className="w-3.5 h-3.5 text-ink" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-11 px-4 border-t border-hairline flex items-center justify-between text-[12px] font-mono text-ink-muted shrink-0">
                  <span>Android APK · iOS PWA</span>
                  <span>E2E</span>
                </div>
              </>
            )}

            {/* Tab 4 Right: Account Reuse & Live Usage (modeled on real highlight-account-import.png & highlight-usage.png) */}
            {activeTab === 'native' && (
              <>
                <div className="flex flex-col min-h-0">
                  <div className="h-11 px-4 border-b border-hairline flex items-center justify-between shrink-0">
                    <span className="font-medium text-ink text-[12.5px]">
                      {zh ? '账号复用与实时用量' : 'Accounts & Live Usage'}
                    </span>
                    <span className="font-mono text-[12px] text-ink-muted">CH 99.2%</span>
                  </div>

                  <div className="p-4 space-y-5">
                    <div className="space-y-2.5">
                      <div className="text-[12px] font-medium text-ink-muted">
                        {zh ? '本机账号一键导入 Pi' : '1-Click Import to Pi'}
                      </div>
                      <div className="border-t border-b border-hairline divide-y divide-hairline text-[12.5px]">
                        <div className="py-2.5 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 font-medium text-ink">
                              <AgentGlyph src="/icons/codex.svg" alt="Codex" />
                              <span>Codex Pro</span>
                              <ArrowRight className="w-3 h-3 text-ink-muted" />
                              <AgentGlyph src="/icons/pi.svg" alt="Pi" invertDark />
                              <span>Pi</span>
                            </span>
                            <span className="font-mono text-[12px] text-ink-secondary">45%</span>
                          </div>
                          <div className="h-1 rounded-full bg-surface-muted overflow-hidden">
                            <div className="h-full w-[45%] rounded-full bg-ink/70" />
                          </div>
                        </div>

                        <div className="py-2.5 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 font-medium text-ink">
                              <AgentGlyph src="/icons/grok.png" alt="Grok" />
                              <span>Grok</span>
                              <ArrowRight className="w-3 h-3 text-ink-muted" />
                              <AgentGlyph src="/icons/pi.svg" alt="Pi" invertDark />
                              <span>Pi</span>
                            </span>
                            <span className="font-mono text-[12px] text-ink-secondary">100%</span>
                          </div>
                          <div className="h-1 rounded-full bg-surface-muted overflow-hidden">
                            <div className="h-full w-full rounded-full bg-ink/70" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[12px] font-medium text-ink-muted">
                        {zh ? '当前会话用量' : 'Session usage'}
                      </div>
                      <div className="border-t border-b border-hairline divide-y divide-hairline font-mono text-[12px]">
                        <div className="py-2 flex items-center justify-between">
                          <span className="text-ink-muted">{zh ? '上下文' : 'Context'}</span>
                          <span className="text-ink">40.9% / 272k</span>
                        </div>
                        <div className="py-2 flex items-center justify-between">
                          <span className="text-ink-muted">{zh ? '缓存命中率' : 'Cache hit'}</span>
                          <span className="text-ink">CH 99.2%</span>
                        </div>
                        <div className="py-2 flex items-center justify-between">
                          <span className="text-ink-muted">{zh ? '费用估算' : 'Est. cost'}</span>
                          <span className="text-ink">$0.11</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-[12px] text-ink-secondary">
                      <div className="flex items-center gap-1.5 font-medium text-ink">
                        <Puzzle className="w-3.5 h-3.5 text-ink-muted" />
                        <span>{zh ? '双端统一扩展 & Skills' : 'Unified Extensions & Skills'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-ink-muted">
                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                        <span>code-review · release-prep · audit</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-11 px-4 border-t border-hairline flex items-center justify-between text-[12px] text-ink-muted shrink-0">
                  <span>{zh ? '桌面端 / Web 共享后端' : 'Desktop & Web shared'}</span>
                  <span className="font-mono">LGPL-3.0</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

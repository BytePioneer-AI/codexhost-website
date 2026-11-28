export type Locale = 'zh' | 'en';
export type PageKey = 'home' | 'download';

export function parseRoute(pathname: string): { page: PageKey; pathLocale: Locale | null } {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/en') return { page: 'home', pathLocale: 'en' };
  if (clean.startsWith('/en/download')) return { page: 'download', pathLocale: 'en' };
  if (clean.startsWith('/download')) return { page: 'download', pathLocale: null };
  return { page: 'home', pathLocale: null };
}

export function buildRoutePath(page: PageKey, locale: Locale): string {
  if (locale === 'en') {
    return page === 'download' ? '/en/download' : '/en';
  }
  return page === 'download' ? '/download' : '/';
}

export const PAGE_TITLES: Record<Locale, Record<PageKey, string>> = {
  zh: {
    home: 'CodexHost — 在 Codex 里，调度所有编程 Agent',
    download: '下载 CodexHost — macOS · Windows · Linux · Android',
  },
  en: {
    home: 'CodexHost — Orchestrate Every Coding Agent, Right Inside Codex',
    download: 'Download CodexHost — macOS · Windows · Linux · Android',
  },
};

export function detectInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'zh';
  const params = new URLSearchParams(window.location.search);
  const queryLang = params.get('lang');
  if (queryLang === 'en' || queryLang === 'zh') return queryLang;
  try {
    const saved = localStorage.getItem('codexhost-lang');
    if (saved === 'en' || saved === 'zh') return saved;
  } catch {
    // ignore storage failures
  }
  const navLang = (navigator.language || 'zh-CN').toLowerCase();
  return navLang.startsWith('zh') ? 'zh' : 'en';
}

export const COPY = {
  zh: {
    nav: {
      collab: '协作',
      multiHost: '多机',
      ecosystem: '生态',
      docs: '文档',
      download: '下载',
      switchLang: 'English',
    },
    hero: {
      releaseNote: '多机 Peer Hub 与跨 Agent 上下文交接',
      title: '在 Codex 里，调度所有编程 Agent',
      subtitle:
        '把 19+ 编程 Agent 聚进同一工作台：互相派活、无损交接，跨电脑和手机随时掌控。',
      downloadOs: {
        macos: '下载 macOS 版',
        windows: '下载 Windows 版',
        linux: '下载 Linux 版',
      },
      githubCta: '在 GitHub 上查看',
      metaWinLinux: 'Windows 和 Linux',
      metaMobile: '手机端',
      metaOpen: '开源免费',
      moreAgents: '+6',
      tabs: [
        { id: 'delegation', label: '多 Agent 委派' },
        { id: 'handoff', label: '上下文交接' },
        { id: 'multihost', label: '多机与手机' },
        { id: 'native', label: '原生能力与扩展' },
      ] as const,
    },
    dualForm: {
      eyebrow: '三端实时同步',
      title: '一个后台，三端实时同步',
      lead: '独立桌面端、官方 Codex Desktop 与 Web / 手机共用同一后台，本机与远程会话实时一致。',
      items: [],
    },
    collab: {
      eyebrow: '多 Agent 协作',
      title: '它们不只并排，还能互相派活和接力',
      lead: '主会话并行派发独立子任务，跑完自动回流结果，也支持无损交接上下文。',
      bullets: [],
    },
    multiHost: {
      eyebrow: '多机互联与跨节点委派',
      title: '多机双向互通，跨节点互相派活',
      lead: 'Mac、Linux 与 Windows 一键双向互联，不同机器上的 Agent 直接跨机委派并自动回流，手机随时审批与接力。',
      peerTitle: '',
      peerDesc: '',
      cards: [],
    },
    native: {
      eyebrow: '原生能力与扩展',
      title: '用你已有的，按你习惯扩展',
      lead: '保留各家原生协议，复用本机账号，扩展一次安装双端生效。',
      items: [],
    },
    faq: {
      eyebrow: '常见问题',
      title: '你可能想确认的 4 件事',
      items: [
        {
          q: '没装官方 Codex Desktop 或用 Linux 能用吗？',
          a: '可以。自带轻量独立桌面端与 Web 端，macOS / Windows / Linux 开箱即用；装了官方客户端也可随时切换增强模式。',
        },
        {
          q: '收费吗？代码和账号会经过第三方服务器吗？',
          a: 'LGPL-3.0 开源免费，无需注册账号；代码与凭据全部留在本机直连官方服务，不经过第三方代理。',
        },
        {
          q: 'macOS 首次打开提示「应用无法验证」怎么办？',
          a: '推荐在下载页复制 macOS 一键安装命令，可免弹窗直接装好；如手动下载 .dmg，在终端执行 xattr -dr com.apple.quarantine /Applications/codexhost.app 后重开即可。',
        },
        {
          q: '它和普通多模型聊天壳有什么区别？',
          a: '它直连各家编程 Agent 原生运行时，完整保留文件编辑、Worktree 隔离、Plan Mode、后台终端与子会话委派。',
        },
      ],
    },
    community: {
      githubTitle: '开源透明',
      githubDesc: 'LGPL-3.0 开源协议。',
      githubLink: 'GitHub 仓库',
      wechatTitle: '微信交流群',
      wechatDesc: '扫码添加微信，备注「CodexHost」拉你进群。',
      wechatZoom: '点击查看大图',
      wechatModalTitle: '加入 CodexHost 微信交流群',
      wechatModalDesc: '打开微信扫一扫添加好友，备注「CodexHost」即可拉群。',
      close: '关闭',
    },
    bottomCta: {
      title: '交给 Agent 跑，做完自然叫你',
      subtitle: 'LGPL-3.0 开源免费 · 本地优先 · macOS / Windows / Linux / 手机端',
      otherPlatforms: '全平台与手机端',
      meta: '',
      notifBadge: '',
      notifTitle: '',
      notifBody: '',
      notifAction: '',
    },
    footer: {
      license: 'LGPL-3.0 开源协议',
      download: '下载',
      changelog: '更新日志',
      docs: '文档',
    },
    downloadPage: {
      pillSuffix: '更新说明',
      title: '下载 CodexHost',
      subtitle: '开源免费，不用注册账号，一切都在本机运行。',
      osNames: {
        macos: 'CodexHost macOS 版',
        windows: 'CodexHost Windows 版',
        linux: 'CodexHost Linux 版',
      },
      archLabels: {
        'macos-arm64': 'Apple 芯片 (M1–M4)',
        'macos-x64': 'Intel 芯片',
        'windows-x64': '64 位 (x64)',
        'windows-arm64': 'ARM64',
        'linux-x64': '64 位 (x64)',
        'linux-arm64': 'ARM64',
      },
      switchArch: {
        macos: { arm64: 'Intel 芯片', x64: 'Apple 芯片' },
        windows: { x64: 'ARM64', arm64: '64 位 (x64)' },
        linux: { x64: 'ARM64', arm64: '64 位 (x64)' },
      },
      downloadBtn: {
        macos: '下载 macOS 版',
        windows: '下载 Windows 版',
        linux: '下载 Linux 版',
      },
      fromGithub: '从 GitHub 下载',
      tips: {
        macos: '不确定是哪种芯片？点苹果菜单里的「关于本机」，看「芯片」或「处理器」。',
        windows: '绝大多数 Windows 电脑选择 64 位 (x64)；搭载高通骁龙的设备选 ARM64。',
        linux: '主流桌面与 x86 服务器选 64 位 (x64)；树莓派或 ARM 云主机选 ARM64。',
      },
      stepsHeading: '三步装好',
      copy: '复制',
      copied: '已复制',
      steps: {
        macos: [
          {
            title: '推荐：一键安装（免验证弹窗）',
            desc: '在「终端」粘贴并回车，自动安装到「应用程序」且无需管理员密码：',
            command: 'curl -fsSL https://chost.dev/install.sh | bash',
          },
          {
            title: '或手动下载 .dmg 安装',
            desc: '双击 .dmg 拖入「应用程序」；若提示无法验证，在终端执行：',
            command: 'xattr -dr com.apple.quarantine /Applications/codexhost.app',
          },
          {
            title: '开箱即用，自动识别本机 Agent',
            desc: '打开即发现本机已登录的 Codex、Claude Code、Pi 等工具；更新后想保留通知等权限，可在「设置 → 更新」一键开启。',
          },
        ],
        windows: [
          {
            title: '运行安装程序',
            desc: '双击下载的 .exe 文件完成安装，支持 Windows 10 / 11。',
          },
          {
            title: '如遇 SmartScreen 提示',
            desc: '点击「更多信息」→「仍要运行」即可继续安装。',
          },
          {
            title: '自动识别本机 Agent',
            desc: '启动后自动检测本机与 WSL 中已安装的编程 Agent，开箱即用。',
          },
        ],
        linux: [
          {
            title: '解压安装包',
            desc: '解压下载的 .tar.gz 压缩包至常用目录：',
            command: 'tar -xzf codexhost-0.27.0-linux-x64.tar.gz',
          },
          {
            title: '启动桌面或独立 Web 模式',
            desc: '直接运行解压目录内的 codexhost，或在无图形界面服务器以 Web 模式常驻。',
          },
          {
            title: '自动识别本机 Agent',
            desc: '自动读取当前 PATH 下已安装的 CLI Agent 与本机凭据，无需额外配置。',
          },
        ],
      },
      allTitle: '全部平台直链',
      allChangelog: '查看更新内容',
      tablePlatform: '平台与架构',
      tableFile: '文件名',
      tableSize: '大小',
      tableAction: '下载',
      downloadAction: '下载',
      mobileTitle: '手机端',
      mobileSubtitle: '外出或离开工位时，扫码直连本机或经自建 Relay 实时查看进度并回复。',
      androidTitle: 'Android 原生客户端',
      androidDesc: '直接安装官方构建 APK，支持后台推送通知、扫码配对与多主机切换。',
      androidBtn: '下载 Android APK',
      iosTitle: 'iOS Safari 添加主屏（PWA）',
      iosSteps: [
        '在 iPhone Safari 中打开 CodexHost 局域网或 Relay 地址。',
        '点击浏览器底部的「分享」按钮。',
        '选择「添加到主屏幕」，像原生应用一样全屏使用。',
      ],
      cliTitle: '开发者命令行',
      cliSubtitle: '习惯用终端安装与升级的用户，可直接通过命令行获取。',
      cliMacosLabel: 'macOS 一键安装',
      cliNpmLabel: 'npm 全局安装 CLI',
      cliWingetLabel: 'Windows winget 安装',
    },
  },
  en: {
    nav: {
      collab: 'Workflow',
      multiHost: 'Multi-Host',
      ecosystem: 'Ecosystem',
      docs: 'Docs',
      download: 'Download',
      switchLang: '中文',
    },
    hero: {
      releaseNote: 'Peer Hub multi-machine & cross-agent handoff',
      title: 'Orchestrate every coding agent, right inside Codex.',
      subtitle:
        'Unify 19+ coding agents in one workspace—delegate in parallel, hand off context cleanly, and stay in reach from any device.',
      downloadOs: {
        macos: 'Download for macOS',
        windows: 'Download for Windows',
        linux: 'Download for Linux',
      },
      githubCta: 'View on GitHub',
      metaWinLinux: 'Windows & Linux',
      metaMobile: 'Mobile',
      metaOpen: 'Open Source & Free',
      moreAgents: '+6',
      tabs: [
        { id: 'delegation', label: 'Delegation' },
        { id: 'handoff', label: 'Handoff' },
        { id: 'multihost', label: 'Multi-Host & Mobile' },
        { id: 'native', label: 'Native & Extensions' },
      ] as const,
    },
    dualForm: {
      eyebrow: 'Live 3-client sync',
      title: 'One Host. Three clients, live in sync.',
      lead: 'Standalone Desktop, official Codex Desktop, and Web / mobile share one Host—every local and remote session stays in sync.',
      items: [],
    },
    collab: {
      eyebrow: 'Multi-Agent Collaboration',
      title: 'Not just side by side—they delegate and relay.',
      lead: 'Dispatch parallel child sessions, receive results automatically, or hand off context without losing a turn.',
      bullets: [],
    },
    multiHost: {
      eyebrow: 'Multi-Machine Mesh & Mobile',
      title: 'Bidirectional mesh. Cross-node delegation.',
      lead: 'Link Macs, Linux servers, and Windows rigs with one click so agents delegate directly across machines—and steer from your phone anywhere.',
      peerTitle: '',
      peerDesc: '',
      cards: [],
    },
    native: {
      eyebrow: 'Native & Extensible',
      title: 'Keep your tools. Extend your way.',
      lead: 'Native protocols, local credentials, and cross-surface extensions.',
      items: [],
    },
    faq: {
      eyebrow: 'FAQ',
      title: '4 quick answers',
      items: [
        {
          q: 'Can I use it on Linux or without Codex Desktop installed?',
          a: 'Yes. CodexHost includes a lightweight standalone Desktop and Web UI for macOS, Windows, and Linux.',
        },
        {
          q: 'Is it free? Does my code or key pass through your servers?',
          a: 'LGPL-3.0 open source and free, no account needed. Agents connect directly from your machine—zero third-party proxy.',
        },
        {
          q: 'macOS says the app cannot be verified on first launch?',
          a: 'Use the macOS one-line install command on the Download page to avoid Gatekeeper prompts; if you installed the .dmg manually, run xattr -dr com.apple.quarantine /Applications/codexhost.app in Terminal and reopen.',
        },
        {
          q: 'How is this different from a multi-model chat wrapper?',
          a: 'CodexHost drives real coding agent runtimes over native protocols—keeping worktrees, Plan Mode, background terminals, and subagents intact.',
        },
      ],
    },
    community: {
      githubTitle: 'Open source',
      githubDesc: 'LGPL-3.0 open source.',
      githubLink: 'GitHub',
      wechatTitle: 'WeChat Group',
      wechatDesc: 'Scan to add on WeChat with note “CodexHost”.',
      wechatZoom: 'Click to enlarge',
      wechatModalTitle: 'Join CodexHost WeChat Group',
      wechatModalDesc: 'Scan with WeChat and include “CodexHost” in your friend request note.',
      close: 'Close',
    },
    bottomCta: {
      title: 'Every coding agent, one workspace.',
      subtitle: 'LGPL-3.0 Open Source · Local-first · macOS / Windows / Linux / Mobile',
      otherPlatforms: 'All platforms',
      meta: '',
      notifBadge: '',
      notifTitle: '',
      notifBody: '',
      notifAction: '',
    },
    footer: {
      license: 'LGPL-3.0 Open Source',
      download: 'Download',
      changelog: 'Changelog',
      docs: 'Docs',
    },
    downloadPage: {
      pillSuffix: 'Release notes',
      title: 'Download CodexHost',
      subtitle: 'Open source, free, no account required. Everything runs on your own machine.',
      osNames: {
        macos: 'CodexHost for macOS',
        windows: 'CodexHost for Windows',
        linux: 'CodexHost for Linux',
      },
      archLabels: {
        'macos-arm64': 'Apple Silicon (M1–M4)',
        'macos-x64': 'Intel',
        'windows-x64': '64-bit (x64)',
        'windows-arm64': 'ARM64',
        'linux-x64': '64-bit (x64)',
        'linux-arm64': 'ARM64',
      },
      switchArch: {
        macos: { arm64: 'Intel', x64: 'Apple Silicon' },
        windows: { x64: 'ARM64', arm64: '64-bit (x64)' },
        linux: { x64: 'ARM64', arm64: '64-bit (x64)' },
      },
      downloadBtn: {
        macos: 'Download for macOS',
        windows: 'Download for Windows',
        linux: 'Download for Linux',
      },
      fromGithub: 'Download from GitHub',
      tips: {
        macos: 'Not sure which chip? Open the Apple menu → About This Mac and check Chip or Processor.',
        windows: 'Choose 64-bit (x64) for most Windows PCs, or ARM64 for Snapdragon devices.',
        linux: 'Choose 64-bit (x64) for standard workstations/servers, or ARM64 for ARM hosts.',
      },
      stepsHeading: 'Up and running in 3 steps',
      copy: 'Copy',
      copied: 'Copied',
      steps: {
        macos: [
          {
            title: 'Recommended: One-line install (no Gatekeeper prompt)',
            desc: 'Paste into Terminal to install into Applications without a password:',
            command: 'curl -fsSL https://chost.dev/install.sh | bash',
          },
          {
            title: 'Or install the .dmg manually',
            desc: 'Drag codexhost.app into Applications; if macOS blocks it, run:',
            command: 'xattr -dr com.apple.quarantine /Applications/codexhost.app',
          },
          {
            title: 'Ready out of the box',
            desc: 'Auto-detects Codex, Claude Code, Pi, and other local agents. Want to keep macOS permissions across updates? Enable it in Settings → Updates.',
          },
        ],
        windows: [
          {
            title: 'Run the installer',
            desc: 'Double-click the downloaded .exe to install on Windows 10 or 11.',
          },
          {
            title: 'If SmartScreen appears',
            desc: 'Click “More info” and choose “Run anyway” to finish setup.',
          },
          {
            title: 'Auto-detects your local agents',
            desc: 'Automatically finds installed agents on Windows and inside WSL.',
          },
        ],
        linux: [
          {
            title: 'Extract the archive',
            desc: 'Unpack the .tar.gz bundle to your preferred directory:',
            command: 'tar -xzf codexhost-0.27.0-linux-x64.tar.gz',
          },
          {
            title: 'Launch Desktop or Web daemon',
            desc: 'Run codexhost directly on desktop Linux or start it in Web mode on headless servers.',
          },
          {
            title: 'Auto-detects your local agents',
            desc: 'Picks up installed CLI agents and local credentials from your environment.',
          },
        ],
      },
      allTitle: 'All direct downloads',
      allChangelog: 'Release notes',
      tablePlatform: 'Platform & Architecture',
      tableFile: 'Filename',
      tableSize: 'Size',
      tableAction: 'Download',
      downloadAction: 'Download',
      mobileTitle: 'Mobile',
      mobileSubtitle: 'Pair via QR code on LAN or connect through a self-hosted Relay when away.',
      androidTitle: 'Native Android APK',
      androidDesc: 'Install the official APK for push notifications, QR pairing, and multi-host switching.',
      androidBtn: 'Download Android APK',
      iosTitle: 'iOS Safari Home Screen (PWA)',
      iosSteps: [
        'Open your CodexHost LAN or Relay URL in Safari on iPhone.',
        'Tap the Share button at the bottom of Safari.',
        'Select “Add to Home Screen” for a full-screen app experience.',
      ],
      cliTitle: 'Command Line',
      cliSubtitle: 'Prefer the terminal? Install or upgrade straight from your shell.',
      cliMacosLabel: 'macOS one-line install',
      cliNpmLabel: 'Install CLI via npm',
      cliWingetLabel: 'Install on Windows via winget',
    },
  },
} as const;

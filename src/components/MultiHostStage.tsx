import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { ChevronRight, Laptop, Monitor, Send, Server } from 'lucide-react';
import type { Locale } from '../data/i18n';

interface MultiHostStageProps {
  locale: Locale;
  onNavigate: (path: string) => void;
}

interface MachineSpec {
  id: string;
  name: string;
  metaZh: string;
  metaEn: string;
  tag: string;
  msgZh: string;
  msgEn: string;
  replyZh: string;
  replyEn: string;
  sentZh: string;
  sentEn: string;
}

const MACHINES: readonly MachineSpec[] = [
  {
    id: 'mac',
    name: 'MacBook Pro',
    metaZh: '本机 · 2 活跃会话',
    metaEn: 'Local · 2 sessions',
    tag: 'local',
    msgZh: '计费单测 12/12 通过，等待确认合入。',
    msgEn: '12/12 billing tests green, ready to merge.',
    replyZh: '直接合入 main',
    replyEn: 'Merge into main',
    sentZh: '已下发至 MacBook Pro',
    sentEn: 'Sent to MacBook Pro',
  },
  {
    id: 'linux',
    name: 'ubuntu-dev',
    metaZh: 'Linux · 远端预览',
    metaEn: 'Linux · Remote preview',
    tag: 'SSH',
    msgZh: '压测完成：P99 延迟从 410ms 降至 148ms。',
    msgEn: 'Bench done: P99 dropped 410ms → 148ms.',
    replyZh: '切到 Claude 跑回归',
    replyEn: 'Run regression via Claude',
    sentZh: '已下发至 ubuntu-dev',
    sentEn: 'Sent to ubuntu-dev',
  },
  {
    id: 'win',
    name: 'home-pc',
    metaZh: 'Windows · 跨机就绪',
    metaEn: 'Windows · Ready',
    tag: 'Peer',
    msgZh: 'Windows 管道回归全部通过，可触发打包。',
    msgEn: 'Windows pipe checks green, ready to package.',
    replyZh: '开始构建安装包',
    replyEn: 'Start installer build',
    sentZh: '已下发至 home-pc',
    sentEn: 'Sent to home-pc',
  },
];

const COMET_TAIL = 64;
const LEG_MS = 780;

function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function MultiHostStage({ locale, onNavigate }: MultiHostStageProps) {
  const zh = locale === 'zh';
  const uid = useId().replace(/:/g, '');

  const [activeIdx, setActiveIdx] = useState<number>(1);
  const [replySent, setReplySent] = useState(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const machineDotRefs = useRef<Array<HTMLSpanElement | null>>([null, null, null]);
  const hubLeftDotRef = useRef<HTMLSpanElement | null>(null);
  const hubRightDotRef = useRef<HTMLSpanElement | null>(null);
  const hubPillRef = useRef<HTMLDivElement | null>(null);
  const phoneDotRef = useRef<HTMLSpanElement | null>(null);
  const phoneCardRef = useRef<HTMLDivElement | null>(null);

  const leftBaseRefs = useRef<Array<SVGPathElement | null>>([null, null, null]);
  const leftCometRefs = useRef<Array<SVGPathElement | null>>([null, null, null]);
  const leftHeadRefs = useRef<Array<SVGCircleElement | null>>([null, null, null]);
  const leftGradRefs = useRef<Array<SVGLinearGradientElement | null>>([null, null, null]);
  const leftLensRef = useRef<number[]>([0, 0, 0]);

  const rightBaseRef = useRef<SVGPathElement | null>(null);
  const rightCometRef = useRef<SVGPathElement | null>(null);
  const rightHeadRef = useRef<SVGCircleElement | null>(null);
  const rightGradRef = useRef<SVGLinearGradientElement | null>(null);
  const rightLenRef = useRef<number>(0);

  const activeIdxRef = useRef(activeIdx);
  activeIdxRef.current = activeIdx;

  const waveRef = useRef({
    active: false,
    machineIdx: 1,
    dir: 'toPhone' as 'toPhone' | 'toHost',
    start: 0,
    hubPulsed: false,
    endPulsed: false,
  });
  const nextAutoRef = useRef<number>(0);
  const timersRef = useRef<number[]>([]);

  const fireWave = useCallback((machineIdx: number, dir: 'toPhone' | 'toHost') => {
    const now = performance.now();
    waveRef.current = {
      active: true,
      machineIdx,
      dir,
      start: now,
      hubPulsed: false,
      endPulsed: false,
    };
    nextAutoRef.current = now + 3200;
  }, []);

  const layoutWires = useCallback(() => {
    const stage = stageRef.current;
    const svg = svgRef.current;
    const hubL = hubLeftDotRef.current;
    const hubR = hubRightDotRef.current;
    const phoneD = phoneDotRef.current;
    if (!stage || !svg || !hubL || !hubR || !phoneD) return;

    const fr = stage.getBoundingClientRect();
    if (!fr.width || !fr.height) return;
    svg.setAttribute('viewBox', `0 0 ${fr.width} ${fr.height}`);

    const rel = (el: Element) => {
      const r = el.getBoundingClientRect();
      return {
        x: r.left - fr.left + r.width / 2,
        y: r.top - fr.top + r.height / 2,
        l: r.left - fr.left,
        r: r.right - fr.left,
        t: r.top - fr.top,
        b: r.bottom - fr.top,
      };
    };

    const vertical = window.getComputedStyle(stage).flexDirection === 'column';
    const curve = (a: { x: number; y: number }, b: { x: number; y: number }) => {
      if (!vertical) {
        const dx = (b.x - a.x) * 0.54;
        return `M${a.x} ${a.y} C${a.x + dx} ${a.y} ${b.x - dx} ${b.y} ${b.x} ${b.y}`;
      }
      const dy = (b.y - a.y) * 0.54;
      return `M${a.x} ${a.y} C${a.x} ${a.y + dy} ${b.x} ${b.y - dy} ${b.x} ${b.y}`;
    };

    const hl = rel(hubL);
    const hr = rel(hubR);
    const ph = rel(phoneD);
    const hubInPt = vertical ? { x: hl.x, y: hl.t } : { x: hl.l, y: hl.y };
    const hubOutPt = vertical ? { x: hr.x, y: hr.b } : { x: hr.r, y: hr.y };
    const phoneInPt = vertical ? { x: ph.x, y: ph.t } : { x: ph.l, y: ph.y };

    for (let i = 0; i < 3; i += 1) {
      const mDot = machineDotRefs.current[i];
      const base = leftBaseRefs.current[i];
      const comet = leftCometRefs.current[i];
      if (!mDot || !base || !comet) continue;
      const mp = rel(mDot);
      const startPt = vertical ? { x: mp.x, y: mp.b } : { x: mp.r, y: mp.y };
      const d = curve(startPt, hubInPt);
      base.setAttribute('d', d);
      comet.setAttribute('d', d);
      leftLensRef.current[i] = base.getTotalLength() || 0;
    }

    if (rightBaseRef.current && rightCometRef.current) {
      const dR = curve(hubOutPt, phoneInPt);
      rightBaseRef.current.setAttribute('d', dR);
      rightCometRef.current.setAttribute('d', dR);
      rightLenRef.current = rightBaseRef.current.getTotalLength() || 0;
    }
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    layoutWires();
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(layoutWires);
      ro.observe(stage);
    }
    if (document.fonts?.ready) {
      void document.fonts.ready.then(layoutWires);
    }

    const pulseClass = (el: HTMLElement | null, cls: string, ms: number) => {
      if (!el) return;
      el.classList.add(cls);
      const id = window.setTimeout(() => el.classList.remove(cls), ms);
      timersRef.current.push(id);
    };

    const drawComet = (
      base: SVGPathElement | null,
      comet: SVGPathElement | null,
      head: SVGCircleElement | null,
      grad: SVGLinearGradientElement | null,
      len: number,
      progress: number,
      reverse: boolean,
    ) => {
      if (!base || !comet || !head || !grad) return;
      if (!len || progress <= 0 || progress >= 1) {
        comet.style.opacity = '0';
        head.style.opacity = '0';
        return;
      }
      const eased = easeInOut(progress);
      const headDist = reverse ? (1 - eased) * len : eased * len;
      const tailDist = reverse
        ? Math.min(len, headDist + COMET_TAIL)
        : Math.max(0, headDist - COMET_TAIL);
      const segLen = Math.abs(headDist - tailDist);
      if (segLen < 1) {
        comet.style.opacity = '0';
        head.style.opacity = '0';
        return;
      }
      const startDist = Math.min(headDist, tailDist);
      const headPt = base.getPointAtLength(headDist);
      const tailPt = base.getPointAtLength(tailDist);

      comet.style.strokeDasharray = `${segLen} ${len + COMET_TAIL}`;
      comet.style.strokeDashoffset = String(-startDist);
      grad.setAttribute('x1', String(tailPt.x));
      grad.setAttribute('y1', String(tailPt.y));
      grad.setAttribute('x2', String(headPt.x));
      grad.setAttribute('y2', String(headPt.y));

      const fade = Math.min(progress < 0.1 ? progress / 0.1 : 1, progress > 0.88 ? (1 - progress) / 0.12 : 1);
      comet.style.opacity = fade.toFixed(3);
      head.style.opacity = fade.toFixed(3);
      head.setAttribute('cx', String(headPt.x));
      head.setAttribute('cy', String(headPt.y));
    };

    const clearAll = () => {
      for (let i = 0; i < 3; i += 1) {
        if (leftCometRefs.current[i]) leftCometRefs.current[i]!.style.opacity = '0';
        if (leftHeadRefs.current[i]) leftHeadRefs.current[i]!.style.opacity = '0';
      }
      if (rightCometRef.current) rightCometRef.current.style.opacity = '0';
      if (rightHeadRef.current) rightHeadRef.current.style.opacity = '0';
    };

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let rafId = 0;

    if (!reduceMotion.matches) {
      // Launch an initial live wave immediately on mount
      const t0 = performance.now() - 320;
      waveRef.current = {
        active: true,
        machineIdx: 1,
        dir: 'toPhone',
        start: t0,
        hubPulsed: false,
        endPulsed: false,
      };
      nextAutoRef.current = performance.now() + 3000;
    }

    const tick = (now: number) => {
      if (reduceMotion.matches) {
        clearAll();
        return;
      }

      const w = waveRef.current;
      if (!w.active && now >= nextAutoRef.current) {
        const nextIdx = (activeIdxRef.current + 1) % 3;
        setActiveIdx(nextIdx);
        setReplySent(false);
        fireWave(nextIdx, 'toPhone');
      }

      clearAll();
      if (w.active) {
        const elapsed = now - w.start;
        const total = LEG_MS * 2 + 120;
        if (elapsed >= total) {
          w.active = false;
        } else if (w.dir === 'toPhone') {
          const p1 = elapsed / LEG_MS;
          const p2 = (elapsed - LEG_MS + 60) / LEG_MS;
          if (p1 > 0 && p1 < 1) {
            drawComet(
              leftBaseRefs.current[w.machineIdx],
              leftCometRefs.current[w.machineIdx],
              leftHeadRefs.current[w.machineIdx],
              leftGradRefs.current[w.machineIdx],
              leftLensRef.current[w.machineIdx],
              p1,
              false,
            );
          }
          if (p1 >= 0.92 && !w.hubPulsed) {
            w.hubPulsed = true;
            pulseClass(hubPillRef.current, 'is-pulse', 420);
          }
          if (p2 > 0 && p2 < 1) {
            drawComet(
              rightBaseRef.current,
              rightCometRef.current,
              rightHeadRef.current,
              rightGradRef.current,
              rightLenRef.current,
              p2,
              false,
            );
          }
          if (p2 >= 0.92 && !w.endPulsed) {
            w.endPulsed = true;
            pulseClass(phoneCardRef.current, 'is-flash', 420);
          }
        } else {
          // Reverse: Phone -> Peer Hub -> Active Machine
          const p1 = elapsed / LEG_MS;
          const p2 = (elapsed - LEG_MS + 60) / LEG_MS;
          if (p1 > 0 && p1 < 1) {
            drawComet(
              rightBaseRef.current,
              rightCometRef.current,
              rightHeadRef.current,
              rightGradRef.current,
              rightLenRef.current,
              p1,
              true,
            );
          }
          if (p1 >= 0.92 && !w.hubPulsed) {
            w.hubPulsed = true;
            pulseClass(hubPillRef.current, 'is-pulse', 420);
          }
          if (p2 > 0 && p2 < 1) {
            drawComet(
              leftBaseRefs.current[w.machineIdx],
              leftCometRefs.current[w.machineIdx],
              leftHeadRefs.current[w.machineIdx],
              leftGradRefs.current[w.machineIdx],
              leftLensRef.current[w.machineIdx],
              p2,
              true,
            );
          }
        }
      }

      rafId = window.requestAnimationFrame(tick);
    };

    if (!reduceMotion.matches) {
      rafId = window.requestAnimationFrame(tick);
    }

    return () => {
      window.cancelAnimationFrame(rafId);
      ro?.disconnect();
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };
  }, [fireWave, layoutWires]);

  const activeMachine = MACHINES[activeIdx];

  const handleSelectMachine = (idx: number) => {
    setActiveIdx(idx);
    setReplySent(false);
    fireWave(idx, 'toPhone');
  };

  const handlePhoneReply = () => {
    setReplySent(true);
    fireWave(activeIdx, 'toHost');
    const id = window.setTimeout(() => setReplySent(false), 1800);
    timersRef.current.push(id);
  };

  return (
    <div className="mh-stage max-w-[960px] mx-auto">
      <div
        ref={stageRef}
        className="mh-diagram"
        aria-label={zh ? '多台开发机经 Peer Hub 连到手机的实时拓扑' : 'Multi-host to mobile live topology'}
      >
        <svg ref={svgRef} className="mh-wires" aria-hidden="true">
          <defs>
            {MACHINES.map((m, idx) => (
              <linearGradient
                key={m.id}
                id={`mh-l-${uid}-${idx}`}
                ref={(el) => {
                  leftGradRefs.current[idx] = el;
                }}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" style={{ stopColor: 'var(--mh-accent)', stopOpacity: 0 }} />
                <stop offset="100%" style={{ stopColor: 'var(--mh-accent)', stopOpacity: 1 }} />
              </linearGradient>
            ))}
            <linearGradient
              id={`mh-r-${uid}`}
              ref={rightGradRef}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" style={{ stopColor: 'var(--mh-accent)', stopOpacity: 0 }} />
              <stop offset="100%" style={{ stopColor: 'var(--mh-accent)', stopOpacity: 1 }} />
            </linearGradient>
          </defs>

          {MACHINES.map((m, idx) => (
            <g key={m.id}>
              <path
                ref={(el) => {
                  leftBaseRefs.current[idx] = el;
                }}
                className={`mh-wire-base ${activeIdx === idx ? 'is-active' : ''}`}
              />
              <path
                ref={(el) => {
                  leftCometRefs.current[idx] = el;
                }}
                className="mh-wire-comet"
                stroke={`url(#mh-l-${uid}-${idx})`}
              />
              <circle
                ref={(el) => {
                  leftHeadRefs.current[idx] = el;
                }}
                className="mh-wire-head"
                r="2.7"
              />
            </g>
          ))}

          <g>
            <path ref={rightBaseRef} className="mh-wire-base is-active" />
            <path
              ref={rightCometRef}
              className="mh-wire-comet"
              stroke={`url(#mh-r-${uid})`}
            />
            <circle ref={rightHeadRef} className="mh-wire-head" r="2.7" />
          </g>
        </svg>

        {/* Left: 3 Machines */}
        <div className="mh-col mh-col--hosts">
          <span className="mh-eyebrow">{zh ? '多台开发机' : 'Machines'}</span>
          {MACHINES.map((m, idx) => {
            const Icon = idx === 0 ? Laptop : idx === 1 ? Server : Monitor;
            const isActive = activeIdx === idx;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => handleSelectMachine(idx)}
                onMouseEnter={() => handleSelectMachine(idx)}
                className={`mh-host ${isActive ? 'is-active' : ''}`}
              >
                <span className="mh-host-icon">
                  <Icon className="w-4 h-4" strokeWidth={1.65} />
                </span>
                <span className="mh-host-main">
                  <span className="mh-host-top">
                    <span className="mh-host-name">{m.name}</span>
                    <span className="mh-host-tag">{m.tag}</span>
                  </span>
                  <span className="mh-host-meta">{zh ? m.metaZh : m.metaEn}</span>
                </span>
                <span
                  ref={(el) => {
                    machineDotRefs.current[idx] = el;
                  }}
                  className={`mh-dot ${isActive ? 'is-lit' : ''}`}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>

        {/* Center: Peer Hub / Relay Bridge */}
        <div className="mh-col mh-col--hub">
          <div ref={hubPillRef} className="mh-hub-pill">
            <span ref={hubLeftDotRef} className="mh-dot is-lit" aria-hidden="true" />
            <span className="mh-hub-label">Peer Hub</span>
            <span className="mh-hub-sep" aria-hidden="true" />
            <span className="mh-hub-sub">Relay</span>
            <span ref={hubRightDotRef} className="mh-dot is-lit" aria-hidden="true" />
          </div>
        </div>

        {/* Right: Minimal Phone Preview */}
        <div className="mh-col mh-col--phone">
          <span className="mh-eyebrow">{zh ? '手机端随时接管' : 'Mobile'}</span>
          <div className="mh-phone-wrap">
            <span ref={phoneDotRef} className="mh-dot is-lit" aria-hidden="true" />
            <div ref={phoneCardRef} className="mh-phone">
              <div className="mh-phone-bar">
                <span className="font-mono">9:41</span>
                <span className="mh-phone-host">
                  <span className="mh-online-dot" aria-hidden="true" />
                  <span>{activeMachine.name}</span>
                </span>
              </div>

              <div className="mh-phone-msg">
                {zh ? activeMachine.msgZh : activeMachine.msgEn}
              </div>

              <button
                type="button"
                onClick={handlePhoneReply}
                className="mh-phone-reply"
              >
                <span className="truncate">
                  {replySent
                    ? zh
                      ? activeMachine.sentZh
                      : activeMachine.sentEn
                    : zh
                      ? activeMachine.replyZh
                      : activeMachine.replyEn}
                </span>
                <Send className="w-3.5 h-3.5 shrink-0" strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ultra-concise single-row micro-strip with clean links */}
      <div className="mt-10 pt-6 border-t border-hairline flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[13px] text-ink-muted">
        <span>{zh ? '跨机派活 · 远端文件预览' : 'Cross-host dispatch · Remote preview'}</span>
        <a
          href="/download#mobile"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/download#mobile');
          }}
          className="inline-flex items-center gap-0.5 text-ink hover:opacity-70 transition-opacity font-medium"
        >
          <span>{zh ? 'Android APK / iOS PWA' : 'Android APK / iOS PWA'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </a>
        <a
          href="/download#cli"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/download#cli');
          }}
          className="inline-flex items-center gap-0.5 text-ink hover:opacity-70 transition-opacity font-medium"
        >
          <span>{zh ? 'CLI · MCP · HTTP 调度' : 'CLI · MCP · HTTP'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

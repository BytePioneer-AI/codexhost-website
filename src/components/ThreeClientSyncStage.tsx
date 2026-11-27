import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Globe } from 'lucide-react';
import type { Locale } from '../data/i18n';
import { CodexHostLogo } from './Icons';

interface ThreeClientSyncStageProps {
  locale: Locale;
}

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function ThreeClientSyncStage({ locale }: ThreeClientSyncStageProps) {
  const zh = locale === 'zh';
  const uid = useId().replace(/:/g, '');
  const gridRef = useRef<HTMLDivElement | null>(null);
  const bandRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([null, null, null]);
  const trackRefs = useRef<Array<SVGPathElement | null>>([null, null, null]);
  const hoverRefs = useRef<Array<SVGPathElement | null>>([null, null, null]);
  const glowRefs = useRef<Array<SVGPathElement | null>>([null, null, null]);
  const coreRefs = useRef<Array<SVGPathElement | null>>([null, null, null]);
  const gradRefs = useRef<Array<SVGLinearGradientElement | null>>([null, null, null]);
  const portRefs = useRef<Array<SVGCircleElement | null>>([null, null, null]);
  const ripRefs = useRef<Array<SVGCircleElement | null>>([null, null, null]);
  const lensRef = useRef<number[]>([90, 68, 90]);

  const [hovered, setHovered] = useState<number>(-1);
  const [hubPulsing, setHubPulsing] = useState(false);
  const [syncedCards, setSyncedCards] = useState<[boolean, boolean, boolean]>([false, false, false]);

  const waveRef = useRef({
    active: false,
    mode: 'broadcast' as 'broadcast' | 'relay',
    src: -1,
    start: 0,
    dur: 1500,
    pulsed: false,
    hit: [false, false, false] as [boolean, boolean, boolean],
  });
  const nextAutoRef = useRef<number>(0);
  const cycleRef = useRef<number>(0);
  const timersRef = useRef<number[]>([]);

  const scheduleTimer = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
  }, []);

  const triggerHubPulse = useCallback(() => {
    setHubPulsing(true);
    scheduleTimer(() => setHubPulsing(false), 380);
  }, [scheduleTimer]);

  const triggerCardFlash = useCallback(
    (idx: number) => {
      setSyncedCards((prev) => {
        const next: [boolean, boolean, boolean] = [...prev];
        next[idx] = true;
        return next;
      });
      scheduleTimer(() => {
        setSyncedCards((prev) => {
          const next: [boolean, boolean, boolean] = [...prev];
          next[idx] = false;
          return next;
        });
      }, 420);
    },
    [scheduleTimer],
  );

  const startRelay = useCallback((src: number) => {
    const now = performance.now();
    waveRef.current = {
      active: true,
      mode: 'relay',
      src,
      start: now,
      dur: 1650,
      pulsed: false,
      hit: [false, false, false],
    };
    nextAutoRef.current = now + 2600;
  }, []);

  const layoutBeams = useCallback(() => {
    const band = bandRef.current;
    const grid = gridRef.current;
    if (!band || !grid) return;
    const W = band.offsetWidth;
    const H = band.offsetHeight;
    if (!W || !H) return;
    const gr = grid.getBoundingClientRect();
    const cx = W / 2;
    const hubOff = [-26, 0, 26];

    for (let i = 0; i < 3; i += 1) {
      const card = cardRefs.current[i];
      const track = trackRefs.current[i];
      if (!card || !track) continue;
      const r = card.getBoundingClientRect();
      const xCard = r.left - gr.left + r.width / 2;
      const xHub = cx + hubOff[i];
      const d =
        i === 1
          ? `M ${xHub} ${H} L ${xCard + 0.05} 0`
          : `M ${xHub} ${H} C ${xHub} ${H * 0.48}, ${xCard} ${H * 0.52}, ${xCard} 0`;

      track.setAttribute('d', d);
      hoverRefs.current[i]?.setAttribute('d', d);
      glowRefs.current[i]?.setAttribute('d', d);
      coreRefs.current[i]?.setAttribute('d', d);
      lensRef.current[i] = track.getTotalLength() || 72;

      const pt = portRefs.current[i];
      const rp = ripRefs.current[i];
      if (pt) {
        pt.setAttribute('cx', String(xCard));
        pt.setAttribute('cy', '0');
      }
      if (rp) {
        rp.setAttribute('cx', String(xCard));
        rp.setAttribute('cy', '0');
      }
    }
  }, []);

  useEffect(() => {
    layoutBeams();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(layoutBeams) : null;
    if (ro && gridRef.current) ro.observe(gridRef.current);
    if (ro && bandRef.current) ro.observe(bandRef.current);
    window.addEventListener('resize', layoutBeams);

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let rafId = 0;
    nextAutoRef.current = performance.now() + 700;

    const setBeam = (i: number, tailF: number, headF: number, op: number) => {
      const g = glowRefs.current[i];
      const c = coreRefs.current[i];
      const gr = gradRefs.current[i];
      const tr = trackRefs.current[i];
      const L = lensRef.current[i];
      if (!g || !c || !gr || !tr) return;
      if (op <= 0.01 || Math.abs(headF - tailF) < 0.01) {
        g.style.opacity = '0';
        c.style.opacity = '0';
        return;
      }
      const p1 = tr.getPointAtLength(Math.max(0, Math.min(1, tailF)) * L);
      const p2 = tr.getPointAtLength(Math.max(0, Math.min(1, headF)) * L);
      gr.setAttribute('x1', String(p1.x));
      gr.setAttribute('y1', String(p1.y));
      gr.setAttribute('x2', String(p2.x));
      gr.setAttribute('y2', String(p2.y));
      const a = Math.min(tailF, headF) * L;
      const b = Math.max(tailF, headF) * L;
      const dash = `${Math.max(1, b - a)} ${L + 40}`;
      g.setAttribute('stroke-dasharray', dash);
      g.setAttribute('stroke-dashoffset', String(-a));
      g.style.opacity = String(op * 0.58);
      c.setAttribute('stroke-dasharray', dash);
      c.setAttribute('stroke-dashoffset', String(-a));
      c.style.opacity = String(op);
    };

    const setRip = (i: number, p: number) => {
      const rp = ripRefs.current[i];
      if (!rp) return;
      if (p <= 0 || p >= 1) {
        rp.style.opacity = '0';
        return;
      }
      rp.setAttribute('r', String(3.2 + p * 9));
      rp.style.opacity = String((1 - p) * 0.72);
    };

    const tick = () => {
      if (reduced) return;
      const now = performance.now();
      const w = waveRef.current;

      if (!w.active && now >= nextAutoRef.current) {
        if (cycleRef.current % 2 === 0) {
          waveRef.current = {
            active: true,
            mode: 'broadcast',
            src: -1,
            start: now,
            dur: 1450,
            pulsed: false,
            hit: [false, false, false],
          };
          nextAutoRef.current = now + 2400;
        } else {
          startRelay(Math.floor(cycleRef.current / 2) % 3);
        }
        cycleRef.current += 1;
      }

      const activeWave = waveRef.current;
      if (activeWave.active) {
        const p = (now - activeWave.start) / activeWave.dur;
        if (p >= 1) {
          activeWave.active = false;
          for (let k = 0; k < 3; k += 1) {
            setBeam(k, 0, 0, 0);
            setRip(k, 0);
          }
        } else if (activeWave.mode === 'broadcast') {
          if (!activeWave.pulsed) {
            activeWave.pulsed = true;
            triggerHubPulse();
          }
          const pb = easeInOutCubic(Math.min(1, p / 0.78));
          const fadeB = p < 0.08 ? p / 0.08 : p > 0.74 ? Math.max(0, (0.86 - p) / 0.12) : 1;
          for (let b = 0; b < 3; b += 1) {
            if (p <= 0.86) {
              setBeam(b, Math.max(0, pb - 0.38), pb, fadeB);
            } else {
              setBeam(b, 0, 0, 0);
            }
            if (p >= 0.72 && !activeWave.hit[b]) {
              activeWave.hit[b] = true;
              triggerCardFlash(b);
            }
            if (p >= 0.68) {
              setRip(b, Math.min(1, (p - 0.68) / 0.32));
            }
          }
        } else {
          if (p <= 0.44) {
            const pin = easeInOutCubic(Math.min(1, p / 0.41));
            const hd = 1 - pin;
            const tl = Math.min(1, hd + 0.36);
            setBeam(
              activeWave.src,
              tl,
              hd,
              p < 0.06 ? p / 0.06 : p > 0.39 ? (0.44 - p) / 0.05 : 1,
            );
            for (let o = 0; o < 3; o += 1) {
              if (o !== activeWave.src) setBeam(o, 0, 0, 0);
            }
          }
          if (p >= 0.39 && !activeWave.pulsed) {
            activeWave.pulsed = true;
            triggerHubPulse();
          }
          if (p >= 0.44) {
            const poutR = (p - 0.44) / 0.44;
            const pout = easeInOutCubic(Math.min(1, Math.max(0, poutR)));
            const fOut =
              poutR < 0.08 ? poutR / 0.08 : poutR > 0.85 ? Math.max(0, (1 - poutR) / 0.15) : 1;
            setBeam(activeWave.src, 0, 0, 0);
            for (let j = 0; j < 3; j += 1) {
              if (j === activeWave.src) continue;
              if (poutR <= 1) {
                setBeam(j, Math.max(0, pout - 0.36), pout, fOut);
              } else {
                setBeam(j, 0, 0, 0);
              }
              if (poutR >= 0.85 && !activeWave.hit[j]) {
                activeWave.hit[j] = true;
                triggerCardFlash(j);
              }
              if (poutR >= 0.8) {
                setRip(j, Math.min(1, (poutR - 0.8) / 0.4));
              }
            }
          }
        }
      }

      rafId = window.requestAnimationFrame(tick);
    };

    if (!reduced) {
      rafId = window.requestAnimationFrame(tick);
    }

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      ro?.disconnect();
      window.removeEventListener('resize', layoutBeams);
      timersRef.current.forEach((id) => window.clearTimeout(id));
      timersRef.current = [];
    };
  }, [layoutBeams, startRelay, triggerCardFlash, triggerHubPulse]);

  const clients = [
    {
      title: zh ? 'CodexHost 桌面端' : 'CodexHost Desktop',
      tag: zh ? '轻量' : 'Lightweight',
      desc: zh ? '独立低内存窗口，跨平台开箱即用' : 'Low-memory native window on any OS',
      icon: <CodexHostLogo lightClassName="w-5 h-[22px]" darkClassName="w-6 h-6" />,
    },
    {
      title: 'Codex Desktop',
      tag: zh ? '官方' : 'Official',
      desc: zh ? '保留官方界面，原生接入 18+ Agent' : 'Official desktop UI with 18+ agents',
      icon: (
        <img
          src="/codex-desktop-logo.png"
          alt="Codex Desktop"
          width={22}
          height={22}
          className="w-[22px] h-[22px] object-contain"
        />
      ),
    },
    {
      title: zh ? 'Web 与手机端' : 'Web & Mobile',
      tag: zh ? '随时随地' : 'Anywhere',
      desc: zh ? '浏览器、Android 与 iOS 实时接管' : 'Browser, Android & iOS live takeover',
      icon: <Globe className="w-[18px] h-[18px] text-[#1e6b61] dark:text-[#30b09e]" strokeWidth={1.8} />,
    },
  ];

  const facts = zh
    ? ['关窗后台照常运行', '本机与远程会话实时一致', '随时跨设备无缝接管']
    : ['Runs with window closed', 'Local & remote always synced', 'Switch devices mid-task'];

  return (
    <div className="max-w-[920px] mx-auto">
      {/* Three Peer Client Cards */}
      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {clients.map((client, idx) => {
          const isSynced = syncedCards[idx];
          const isHovered = hovered === idx;
          return (
            <button
              key={client.title}
              ref={(el) => {
                cardRefs.current[idx] = el;
              }}
              type="button"
              onMouseEnter={() => {
                setHovered(idx);
                startRelay(idx);
              }}
              onMouseLeave={() => setHovered(-1)}
              onClick={() => startRelay(idx)}
              className={`group text-left rounded-[14px] border p-5 transition-all duration-200 cursor-pointer ${
                isSynced || isHovered
                  ? 'border-[#1e6b61]/45 dark:border-[#30b09e]/50 bg-[#f6fbfa] dark:bg-[#141d1c] -translate-y-0.5 shadow-[0_10px_28px_-16px_rgba(30,107,97,0.28)]'
                  : 'border-hairline bg-surface-card hover:border-hairline-strong'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3.5">
                <span className="w-9 h-9 rounded-[10px] border border-hairline bg-canvas-subtle flex items-center justify-center shrink-0">
                  {client.icon}
                </span>
                <span className="font-mono text-[12px] text-ink-muted">{client.tag}</span>
              </div>
              <div className="text-[15.5px] font-semibold text-ink tracking-[-0.015em]">
                {client.title}
              </div>
              <p className="mt-1 text-[13px] leading-[1.55] text-ink-secondary">{client.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Converging Hairline Bezier Sync Beam Stage (Desktop md+) */}
      <div ref={bandRef} className="hidden md:block relative w-full h-[76px] pointer-events-none" aria-hidden="true">
        <svg className="absolute inset-0 w-full h-full overflow-visible">
          <defs>
            {[0, 1, 2].map((i) => (
              <linearGradient
                key={i}
                id={`${uid}-bg-${i}`}
                ref={(el) => {
                  gradRefs.current[i] = el;
                }}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="var(--sync-accent, #1e6b61)" stopOpacity="0" />
                <stop offset="48%" stopColor="var(--sync-accent, #1e6b61)" stopOpacity="0.92" />
                <stop offset="82%" stopColor="var(--sync-bright, #2a9284)" stopOpacity="1" />
                <stop offset="100%" stopColor="var(--sync-bright, #2a9284)" stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>

          {[0, 1, 2].map((i) => {
            const st = hovered === -1 ? 'idle' : hovered === i ? 'active' : 'peer';
            const hoverStroke =
              st === 'active'
                ? 'stroke-[#1e6b61]/60 dark:stroke-[#5ce0cb]/70'
                : st === 'peer'
                  ? 'stroke-[#1e6b61]/25 dark:stroke-[#30b09e]/30'
                  : 'stroke-transparent';
            const portStyle =
              st === 'active'
                ? 'fill-[#1e6b61] stroke-[#1e6b61] dark:fill-[#30b09e] dark:stroke-[#30b09e]'
                : st === 'peer'
                  ? 'fill-surface-card stroke-[#1e6b61] dark:stroke-[#30b09e]'
                  : 'fill-surface-card stroke-black/20 dark:stroke-white/20';

            return (
              <g key={i}>
                <path
                  ref={(el) => {
                    trackRefs.current[i] = el;
                  }}
                  fill="none"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  className="stroke-black/[0.10] dark:stroke-white/[0.11]"
                />
                <path
                  ref={(el) => {
                    hoverRefs.current[i] = el;
                  }}
                  fill="none"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  className={`transition-colors duration-200 ${hoverStroke}`}
                />
                <path
                  ref={(el) => {
                    glowRefs.current[i] = el;
                  }}
                  fill="none"
                  stroke={`url(#${uid}-bg-${i})`}
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  style={{ opacity: 0, filter: 'blur(2.4px)' }}
                />
                <path
                  ref={(el) => {
                    coreRefs.current[i] = el;
                  }}
                  fill="none"
                  stroke={`url(#${uid}-bg-${i})`}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  style={{ opacity: 0 }}
                />
                <circle
                  ref={(el) => {
                    ripRefs.current[i] = el;
                  }}
                  r="3.5"
                  fill="none"
                  strokeWidth="1.25"
                  className="stroke-[#1e6b61] dark:stroke-[#30b09e]"
                  style={{ opacity: 0 }}
                />
                <circle
                  ref={(el) => {
                    portRefs.current[i] = el;
                  }}
                  r="3.2"
                  strokeWidth="1.25"
                  className={`transition-colors duration-150 ${portStyle}`}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Mobile simple connector */}
      <div className="flex md:hidden justify-center py-3" aria-hidden="true">
        <div className="w-px h-6 bg-hairline-strong" />
      </div>

      {/* Central Host Hub Pill */}
      <div className="flex justify-center">
        <div
          className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full border bg-surface-card transition-all duration-200 ${
            hubPulsing
              ? 'border-[#1e6b61]/55 dark:border-[#30b09e]/60 shadow-[0_0_0_5px_rgba(30,107,97,0.10)] dark:shadow-[0_0_0_5px_rgba(48,176,158,0.14)]'
              : 'border-hairline-strong shadow-subtle'
          }`}
        >
          <span className="w-3.5 h-3.5 rounded-full bg-[#1e6b61]/15 dark:bg-[#30b09e]/20 flex items-center justify-center shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1e6b61] dark:bg-[#30b09e]" />
          </span>
          <span className="text-[13px] font-semibold text-ink tracking-[-0.01em]">Host</span>
          <span className="w-px h-3 bg-hairline-strong" aria-hidden="true" />
          <span className="text-[12.5px] text-ink-secondary">
            {zh ? '三端与远程会话实时同步' : 'Live sync across clients & remotes'}
          </span>
        </div>
      </div>

      {/* Concise 3-Fact Micro Strip */}
      <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12.5px] text-ink-muted">
        {facts.map((fact) => (
          <span key={fact} className="inline-flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-ink-muted/60" aria-hidden="true" />
            <span>{fact}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

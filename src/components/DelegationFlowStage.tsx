import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { Locale } from '../data/i18n';

interface DelegationFlowStageProps {
  locale: Locale;
}

const RING_RADIUS = 16.5;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const COMET_TAIL_LENGTH = 72;
const TRAVEL_SECONDS = 0.92;
const RESET_AT_SECONDS = 8.45;
const CYCLE_SECONDS = 9.35;
const INITIAL_ELAPSED_SECONDS = 2.45;
const REDUCED_MOTION_SNAPSHOT_SECONDS = 7.2;

const LANE_SCHEDULES = [
  { d: 0.24, run: 2.2 }, // Lane 0 (Claude Code): finishes 2nd
  { d: 0.38, run: 3.0 }, // Lane 1 (Codex): finishes 4th
  { d: 0.5, run: 2.55 }, // Lane 2 (Antigravity): finishes 3rd
  { d: 0.62, run: 1.35 }, // Lane 3 (Pi): finishes 1st
].map((entry) => ({
  ...entry,
  arr: entry.d + TRAVEL_SECONDS,
  fin: entry.d + TRAVEL_SECONDS + entry.run,
  back: entry.d + TRAVEL_SECONDS + entry.run + TRAVEL_SECONDS,
}));

const FEED_ORDER = [3, 0, 2, 1] as const;

interface LaneSpec {
  id: string;
  name: string;
  model: string;
  icon: string;
  invertDark?: boolean;
  dotColor: string;
  taskZh: string;
  taskEn: string;
  duration: string;
}

const LANES: readonly LaneSpec[] = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    model: 'Opus 5.5',
    icon: '/icons/claude-code.svg',
    dotColor: 'var(--dlg-dot-claude)',
    taskZh: '补全单测',
    taskEn: 'Add unit tests',
    duration: '2m 24s',
  },
  {
    id: 'codex',
    name: 'Codex',
    model: 'GPT-6.2-Sol',
    icon: '/icons/codex.svg',
    dotColor: 'var(--dlg-dot-codex)',
    taskZh: '审查变更',
    taskEn: 'Review changes',
    duration: '3m 06s',
  },
  {
    id: 'antigravity',
    name: 'Antigravity',
    model: 'Gemini 4 Neon',
    icon: '/icons/antigravity.svg',
    dotColor: 'var(--dlg-dot-agy)',
    taskZh: '写前端与文档',
    taskEn: 'Frontend & docs',
    duration: '2m 42s',
  },
  {
    id: 'pi',
    name: 'Pi',
    model: 'GPT-6.2-Astra · Fast',
    icon: '/icons/pi.svg',
    invertDark: true,
    dotColor: 'var(--dlg-dot-pi)',
    taskZh: '查新文档',
    taskEn: 'Check latest docs',
    duration: '1m 48s',
  },
];

function cubicEase(progress: number): number {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

export function DelegationFlowStage({ locale }: DelegationFlowStageProps) {
  const zh = locale === 'zh';
  const uid = useId().replace(/:/g, '');

  const diagramRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const originDotRef = useRef<HTMLSpanElement | null>(null);
  const cvDotRef = useRef<HTMLSpanElement | null>(null);
  const cvPulseRefs = useRef<Array<HTMLElement | null>>([null, null, null, null]);

  const laneRootRefs = useRef<Array<HTMLDivElement | null>>([null, null, null, null]);
  const laneInDotRefs = useRef<Array<HTMLSpanElement | null>>([null, null, null, null]);
  const laneOutDotRefs = useRef<Array<HTMLSpanElement | null>>([null, null, null, null]);
  const lanePrgRefs = useRef<Array<SVGCircleElement | null>>([null, null, null, null]);
  const laneStateRefs = useRef<Array<HTMLSpanElement | null>>([null, null, null, null]);

  const feedRootRefs = useRef<Array<HTMLDivElement | null>>([null, null, null, null]);
  const feedMetaRefs = useRef<Array<HTMLSpanElement | null>>([null, null, null, null]);

  const outBaseRefs = useRef<Array<SVGPathElement | null>>([null, null, null, null]);
  const outCometRefs = useRef<Array<SVGPathElement | null>>([null, null, null, null]);
  const outHaloRefs = useRef<Array<SVGCircleElement | null>>([null, null, null, null]);
  const outHeadRefs = useRef<Array<SVGCircleElement | null>>([null, null, null, null]);
  const outGradRefs = useRef<Array<SVGLinearGradientElement | null>>([null, null, null, null]);
  const outLenRefs = useRef<number[]>([0, 0, 0, 0]);

  const retBaseRefs = useRef<Array<SVGPathElement | null>>([null, null, null, null]);
  const retCometRefs = useRef<Array<SVGPathElement | null>>([null, null, null, null]);
  const retHaloRefs = useRef<Array<SVGCircleElement | null>>([null, null, null, null]);
  const retHeadRefs = useRef<Array<SVGCircleElement | null>>([null, null, null, null]);
  const retGradRefs = useRef<Array<SVGLinearGradientElement | null>>([null, null, null, null]);
  const retLenRefs = useRef<number[]>([0, 0, 0, 0]);

  const [hoveredLane, setHoveredLane] = useState<number | null>(null);
  const [actionFlash, setActionFlash] = useState<Record<string, boolean>>({});
  const flashTimersRef = useRef<number[]>([]);

  const labelsRef = useRef({
    waiting: zh ? '待派发' : 'Queued',
    dispatching: zh ? '派发中' : 'Dispatching',
    running: zh ? '并行处理中' : 'Running',
    returning: zh ? '回流中' : 'Returning',
    returned: zh ? '已回流' : 'Returned',
    feedPending: zh ? '等待回流' : 'Waiting',
    feedRunning: zh ? '执行中…' : 'Running…',
  });

  labelsRef.current = {
    waiting: zh ? '待派发' : 'Queued',
    dispatching: zh ? '派发中' : 'Dispatching',
    running: zh ? '并行处理中' : 'Running',
    returning: zh ? '回流中' : 'Returning',
    returned: zh ? '已回流' : 'Returned',
    feedPending: zh ? '等待回流' : 'Waiting',
    feedRunning: zh ? '执行中…' : 'Running…',
  };

  const triggerAction = useCallback((laneIndex: number, kind: 'read' | 'ask') => {
    const key = `${laneIndex}-${kind}`;
    setHoveredLane(laneIndex);
    setActionFlash((prev) => ({ ...prev, [key]: true }));
    const id = window.setTimeout(() => {
      setActionFlash((prev) => ({ ...prev, [key]: false }));
      setHoveredLane((cur) => (cur === laneIndex ? null : cur));
    }, 1100);
    flashTimersRef.current.push(id);
  }, []);

  const layoutWires = useCallback(() => {
    const diagram = diagramRef.current;
    const svg = svgRef.current;
    const originDot = originDotRef.current;
    const cvDot = cvDotRef.current;
    if (!diagram || !svg || !originDot || !cvDot) return;

    const frameRect = diagram.getBoundingClientRect();
    if (!frameRect.width || !frameRect.height) return;
    svg.setAttribute('viewBox', `0 0 ${frameRect.width} ${frameRect.height}`);

    const relativeBox = (el: Element) => {
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left - frameRect.left + rect.width / 2,
        y: rect.top - frameRect.top + rect.height / 2,
        l: rect.left - frameRect.left,
        r: rect.right - frameRect.left,
        t: rect.top - frameRect.top,
        b: rect.bottom - frameRect.top,
      };
    };

    const vertical = window.getComputedStyle(diagram).flexDirection === 'column';
    const curve = (a: { x: number; y: number }, b: { x: number; y: number }): string => {
      if (!vertical) {
        const dx = (b.x - a.x) * 0.54;
        return `M${a.x} ${a.y} C${a.x + dx} ${a.y} ${b.x - dx} ${b.y} ${b.x} ${b.y}`;
      }
      const dy = (b.y - a.y) * 0.54;
      return `M${a.x} ${a.y} C${a.x} ${a.y + dy} ${b.x} ${b.y - dy} ${b.x} ${b.y}`;
    };

    const orig = relativeBox(originDot);
    const cv = relativeBox(cvDot);
    const startPt = vertical ? { x: orig.x, y: orig.b } : { x: orig.r, y: orig.y };
    const endPt = vertical ? { x: cv.x, y: cv.t } : { x: cv.l, y: cv.y };

    for (let i = 0; i < LANE_SCHEDULES.length; i += 1) {
      const inDot = laneInDotRefs.current[i];
      const outDot = laneOutDotRefs.current[i];
      const outBase = outBaseRefs.current[i];
      const outComet = outCometRefs.current[i];
      const retBase = retBaseRefs.current[i];
      const retComet = retCometRefs.current[i];
      if (!inDot || !outDot || !outBase || !outComet || !retBase || !retComet) continue;

      const inPt = relativeBox(inDot);
      const outPt = relativeBox(outDot);
      const aIn = vertical ? { x: inPt.x, y: inPt.t } : { x: inPt.l, y: inPt.y };
      const aOut = vertical ? { x: outPt.x, y: outPt.b } : { x: outPt.r, y: outPt.y };

      const dOut = curve(startPt, aIn);
      outBase.setAttribute('d', dOut);
      outComet.setAttribute('d', dOut);
      outLenRefs.current[i] = outBase.getTotalLength() || 0;

      const dRet = curve(aOut, endPt);
      retBase.setAttribute('d', dRet);
      retComet.setAttribute('d', dRet);
      retLenRefs.current[i] = retBase.getTotalLength() || 0;
    }
  }, []);

  useEffect(() => {
    const diagram = diagramRef.current;
    if (!diagram) return;

    layoutWires();
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(layoutWires);
      ro.observe(diagram);
    }
    if (document.fonts?.ready) {
      void document.fonts.ready.then(layoutWires);
    }

    const renderComet = (
      base: SVGPathElement | null,
      comet: SVGPathElement | null,
      halo: SVGCircleElement | null,
      head: SVGCircleElement | null,
      grad: SVGLinearGradientElement | null,
      len: number,
      progress: number,
    ) => {
      if (!base || !comet || !halo || !head || !grad) return;
      if (!len || progress <= 0 || progress >= 1) {
        comet.style.opacity = '0';
        head.style.opacity = '0';
        halo.style.opacity = '0';
        return;
      }
      const headDist = cubicEase(progress) * len;
      const tailLen = Math.min(COMET_TAIL_LENGTH, headDist);
      if (tailLen < 0.8) {
        comet.style.opacity = '0';
        head.style.opacity = '0';
        halo.style.opacity = '0';
        return;
      }
      const tailPt = base.getPointAtLength(headDist - tailLen);
      const headPt = base.getPointAtLength(headDist);
      comet.style.strokeDasharray = `${tailLen} ${len + COMET_TAIL_LENGTH}`;
      comet.style.strokeDashoffset = String(-(headDist - tailLen));
      grad.setAttribute('x1', String(tailPt.x));
      grad.setAttribute('y1', String(tailPt.y));
      grad.setAttribute('x2', String(headPt.x));
      grad.setAttribute('y2', String(headPt.y));

      const fadeIn = progress < 0.08 ? progress / 0.08 : 1;
      const fadeOut = progress > 0.9 ? (1 - progress) / 0.1 : 1;
      const alpha = Math.min(fadeIn, fadeOut);
      comet.style.opacity = alpha.toFixed(3);
      head.style.opacity = alpha.toFixed(3);
      halo.style.opacity = (0.18 * alpha).toFixed(3);
      head.setAttribute('cx', String(headPt.x));
      head.setAttribute('cy', String(headPt.y));
      halo.setAttribute('cx', String(headPt.x));
      halo.setAttribute('cy', String(headPt.y));
    };

    const renderFrame = (seconds: number) => {
      const live = seconds < RESET_AT_SECONDS;
      const lbl = labelsRef.current;
      let dispatching = false;
      let anyReturned = false;

      for (let i = 0; i < LANE_SCHEDULES.length; i += 1) {
        const s = LANE_SCHEDULES[i];
        const laneRoot = laneRootRefs.current[i];
        const inDot = laneInDotRefs.current[i];
        const outDot = laneOutDotRefs.current[i];
        const prg = lanePrgRefs.current[i];
        const stateEl = laneStateRefs.current[i];
        const feedRoot = feedRootRefs.current[i];
        const feedMeta = feedMetaRefs.current[i];
        const outBase = outBaseRefs.current[i];
        const retBase = retBaseRefs.current[i];

        renderComet(
          outBase,
          outCometRefs.current[i],
          outHaloRefs.current[i],
          outHeadRefs.current[i],
          outGradRefs.current[i],
          outLenRefs.current[i],
          (seconds - s.d) / TRAVEL_SECONDS,
        );
        renderComet(
          retBase,
          retCometRefs.current[i],
          retHaloRefs.current[i],
          retHeadRefs.current[i],
          retGradRefs.current[i],
          retLenRefs.current[i],
          (seconds - s.fin) / TRAVEL_SECONDS,
        );

        if (seconds >= s.d && seconds < s.d + 0.35) dispatching = true;

        outBase?.classList.toggle('is-lit', live && seconds >= s.arr);
        retBase?.classList.toggle('is-lit', live && seconds >= s.back);

        let status: 'idle' | 'run' | 'done' = 'idle';
        let progress = 0;
        let statusText = lbl.waiting;

        if (live && seconds >= s.d && seconds < s.arr) {
          statusText = lbl.dispatching;
        } else if (live && seconds >= s.arr) {
          if (seconds < s.fin) {
            status = 'run';
            progress = (seconds - s.arr) / s.run;
            statusText = lbl.running;
          } else {
            status = 'done';
            progress = 1;
            statusText = seconds >= s.back ? lbl.returned : lbl.returning;
          }
        }

        laneRoot?.classList.toggle('is-idle', status === 'idle');
        laneRoot?.classList.toggle('is-run', status === 'run');
        laneRoot?.classList.toggle('is-done', status === 'done');
        inDot?.classList.toggle('is-lit', live && seconds >= s.arr);
        outDot?.classList.toggle('is-lit', live && seconds >= s.fin);
        if (prg) {
          prg.style.strokeDashoffset = (RING_CIRCUMFERENCE * (1 - progress)).toFixed(2);
        }
        if (stateEl && stateEl.textContent !== statusText) {
          stateEl.textContent = statusText;
        }

        const returned = live && seconds >= s.back;
        const inFlight = live && seconds >= s.arr && !returned;
        if (returned) anyReturned = true;

        feedRoot?.classList.toggle('is-returned', returned);
        feedRoot?.classList.toggle('is-running', inFlight);
        const nextMeta = returned
          ? LANES[i].duration
          : inFlight
            ? lbl.feedRunning
            : lbl.feedPending;
        if (feedMeta && feedMeta.textContent !== nextMeta) {
          feedMeta.textContent = nextMeta;
        }

        const pulseEl = cvPulseRefs.current[i];
        if (pulseEl) {
          if (seconds >= s.back && seconds < s.back + 0.85) {
            const pu = (seconds - s.back) / 0.85;
            pulseEl.style.opacity = ((1 - pu) * 0.62).toFixed(3);
            pulseEl.style.transform = `scale(${(1 + pu * 2.5).toFixed(2)})`;
          } else {
            pulseEl.style.opacity = '0';
          }
        }
      }

      originDotRef.current?.classList.toggle('is-pulse', dispatching);
      cvDotRef.current?.classList.toggle('is-lit', anyReturned);
    };

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let elapsed = INITIAL_ELAPSED_SECONDS;
    let lastTimestamp = 0;
    let rafId = 0;

    const tick = (timestamp: number) => {
      elapsed += lastTimestamp ? Math.min(0.1, (timestamp - lastTimestamp) / 1000) : 0;
      lastTimestamp = timestamp;
      if (elapsed >= CYCLE_SECONDS) elapsed = 0;
      renderFrame(elapsed);
      rafId = window.requestAnimationFrame(tick);
    };

    const startLoop = () => {
      window.cancelAnimationFrame(rafId);
      lastTimestamp = 0;
      if (reduceMotionQuery.matches) {
        renderFrame(REDUCED_MOTION_SNAPSHOT_SECONDS);
      } else {
        renderFrame(elapsed);
        rafId = window.requestAnimationFrame(tick);
      }
    };

    startLoop();
    reduceMotionQuery.addEventListener('change', startLoop);

    return () => {
      window.cancelAnimationFrame(rafId);
      ro?.disconnect();
      reduceMotionQuery.removeEventListener('change', startLoop);
      flashTimersRef.current.forEach((id) => window.clearTimeout(id));
      flashTimersRef.current = [];
    };
  }, [layoutWires]);

  const hasHover = hoveredLane !== null;

  return (
    <div className="dlg-stage max-w-[960px] mx-auto">
      <div
        ref={diagramRef}
        className={`dlg-diagram ${hasHover ? 'has-hover' : ''}`}
        aria-label={zh ? '多 Agent 委派与回流实时动画' : 'Multi-Agent delegation and return flow'}
      >
        <svg ref={svgRef} className="dlg-wires" aria-hidden="true">
          <defs>
            {LANES.map((_, idx) => (
              <linearGradient
                key={`out-${idx}`}
                id={`dlg-out-${uid}-${idx}`}
                ref={(el) => {
                  outGradRefs.current[idx] = el;
                }}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" style={{ stopColor: 'var(--dlg-accent)', stopOpacity: 0 }} />
                <stop offset="100%" style={{ stopColor: 'var(--dlg-accent)', stopOpacity: 1 }} />
              </linearGradient>
            ))}
            {LANES.map((_, idx) => (
              <linearGradient
                key={`ret-${idx}`}
                id={`dlg-ret-${uid}-${idx}`}
                ref={(el) => {
                  retGradRefs.current[idx] = el;
                }}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" style={{ stopColor: 'var(--dlg-accent)', stopOpacity: 0 }} />
                <stop offset="100%" style={{ stopColor: 'var(--dlg-accent)', stopOpacity: 1 }} />
              </linearGradient>
            ))}
          </defs>

          {LANES.map((_, idx) => (
            <g
              key={`out-g-${idx}`}
              data-lane={idx}
              className={hoveredLane === idx ? 'is-hover' : ''}
            >
              <path
                ref={(el) => {
                  outBaseRefs.current[idx] = el;
                }}
                className="dlg-wire-base"
              />
              <path
                ref={(el) => {
                  outCometRefs.current[idx] = el;
                }}
                className="dlg-wire-comet"
                stroke={`url(#dlg-out-${uid}-${idx})`}
              />
              <circle
                ref={(el) => {
                  outHaloRefs.current[idx] = el;
                }}
                className="dlg-wire-halo"
                r="8"
              />
              <circle
                ref={(el) => {
                  outHeadRefs.current[idx] = el;
                }}
                className="dlg-wire-head"
                r="2.7"
              />
            </g>
          ))}

          {LANES.map((_, idx) => (
            <g
              key={`ret-g-${idx}`}
              data-lane={idx}
              className={hoveredLane === idx ? 'is-hover' : ''}
            >
              <path
                ref={(el) => {
                  retBaseRefs.current[idx] = el;
                }}
                className="dlg-wire-base"
              />
              <path
                ref={(el) => {
                  retCometRefs.current[idx] = el;
                }}
                className="dlg-wire-comet"
                stroke={`url(#dlg-ret-${uid}-${idx})`}
              />
              <circle
                ref={(el) => {
                  retHaloRefs.current[idx] = el;
                }}
                className="dlg-wire-halo"
                r="8"
              />
              <circle
                ref={(el) => {
                  retHeadRefs.current[idx] = el;
                }}
                className="dlg-wire-head"
                r="2.7"
              />
            </g>
          ))}
        </svg>

        {/* Left: Origin Anchor */}
        <div className="dlg-col dlg-col--origin">
          <span className="dlg-eyebrow">{zh ? '发起' : 'Dispatch'}</span>
          <div className="dlg-origin-node">
            <div className="dlg-origin-body">
              <div className="dlg-origin-title-row">
                <svg
                  className="dlg-origin-icon"
                  viewBox="0 0 22 22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.55"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2.5" y="2.5" width="17" height="17" rx="4.5" />
                  <circle cx="11" cy="11" r="2.2" fill="var(--dlg-accent)" stroke="none" />
                </svg>
                <span className="dlg-node-title">{zh ? '主会话' : 'Main session'}</span>
              </div>
              <div className="dlg-node-sub">
                {zh ? '# 派发或自主委派' : '# mention or auto-delegate'}
              </div>
            </div>
            <span ref={originDotRef} className="dlg-origin-dot" aria-hidden="true" />
          </div>
        </div>

        {/* Center: 4 Parallel Agent Lanes */}
        <div className="dlg-col dlg-col--lanes">
          <span className="dlg-eyebrow">
            {zh ? '独立会话 · 并行执行' : 'Independent sessions · Parallel'}
          </span>

          {LANES.map((lane, idx) => (
            <div
              key={lane.id}
              ref={(el) => {
                laneRootRefs.current[idx] = el;
              }}
              data-lane={idx}
              onMouseEnter={() => setHoveredLane(idx)}
              onMouseLeave={() => setHoveredLane(null)}
              className={`dlg-lane ${hoveredLane === idx ? 'is-hover' : ''}`}
            >
              <span
                ref={(el) => {
                  laneInDotRefs.current[idx] = el;
                }}
                className="dlg-lane-pt"
                aria-hidden="true"
              />

              <div className="dlg-ring">
                <svg className="dlg-ring-svg" viewBox="0 0 36 36" aria-hidden="true">
                  <circle className="dlg-ring-trk" cx="18" cy="18" r={RING_RADIUS} />
                  <circle
                    ref={(el) => {
                      lanePrgRefs.current[idx] = el;
                    }}
                    className="dlg-ring-prg"
                    cx="18"
                    cy="18"
                    r={RING_RADIUS}
                  />
                </svg>
                <span className="dlg-ring-mark" aria-hidden="true">
                  <img
                    src={lane.icon}
                    alt={lane.name}
                    width={16}
                    height={16}
                    className={lane.invertDark ? 'dark:invert' : ''}
                  />
                </span>
              </div>

              <div className="dlg-lane-main">
                <div className="dlg-lane-top">
                  <span className="dlg-lane-who">
                    <span className="dlg-dot" style={{ background: lane.dotColor }} />
                    <span className="dlg-lane-name">{lane.name}</span>
                  </span>
                  <span className="dlg-lane-model">{lane.model}</span>
                </div>
                <div className="dlg-lane-bottom">
                  <span className="dlg-lane-task">{zh ? lane.taskZh : lane.taskEn}</span>
                  <span
                    ref={(el) => {
                      laneStateRefs.current[idx] = el;
                    }}
                    className="dlg-lane-state"
                  >
                    {zh ? '待派发' : 'Queued'}
                  </span>
                </div>
              </div>

              <span
                ref={(el) => {
                  laneOutDotRefs.current[idx] = el;
                }}
                className="dlg-lane-pt"
                aria-hidden="true"
              />
            </div>
          ))}
        </div>

        {/* Right: Convergence Anchor + Live Async Return Feed */}
        <div className="dlg-col dlg-col--return">
          <span className="dlg-eyebrow">{zh ? '回流' : 'Return'}</span>
          <div className="dlg-return-wrap">
            <span ref={cvDotRef} className="dlg-cv-dot" aria-hidden="true">
              {LANES.map((_, idx) => (
                <i
                  key={`pulse-${idx}`}
                  ref={(el) => {
                    cvPulseRefs.current[idx] = el;
                  }}
                  className="dlg-cv-pulse"
                />
              ))}
            </span>

            <div className="dlg-return-panel">
              <div className="dlg-cv-head">
                <div className="dlg-node-title">{zh ? '回到主会话' : 'Back to main'}</div>
                <div className="dlg-cv-sub">
                  {zh ? '通知 · 查看 · 追问' : 'Notify · Inspect · Follow up'}
                </div>
              </div>

              <div className="dlg-feed">
                {FEED_ORDER.map((laneIdx) => {
                  const lane = LANES[laneIdx];
                  const readFlashed = actionFlash[`${laneIdx}-read`];
                  const askFlashed = actionFlash[`${laneIdx}-ask`];
                  return (
                    <div
                      key={lane.id}
                      ref={(el) => {
                        feedRootRefs.current[laneIdx] = el;
                      }}
                      data-lane={laneIdx}
                      onMouseEnter={() => setHoveredLane(laneIdx)}
                      onMouseLeave={() => setHoveredLane(null)}
                      className={`dlg-res ${hoveredLane === laneIdx ? 'is-hover' : ''}`}
                    >
                      <div className="dlg-res-top">
                        <span className="dlg-res-title">
                          <span className="dlg-res-indicator" aria-hidden="true">
                            <span className="dlg-res-pending-dot" />
                            <svg className="dlg-res-chk" viewBox="0 0 14 14">
                              <path d="m3 7.3 2.6 2.6L11 4.4" />
                            </svg>
                          </span>
                          <span>{zh ? lane.taskZh : lane.taskEn}</span>
                        </span>
                        <span
                          ref={(el) => {
                            feedMetaRefs.current[laneIdx] = el;
                          }}
                          className="dlg-res-meta"
                        >
                          {zh ? '等待回流' : 'Waiting'}
                        </span>
                      </div>

                      <div className="dlg-res-bottom">
                        <span className="dlg-res-agent">{lane.name}</span>
                        <span className="dlg-res-actions">
                          <button
                            type="button"
                            onClick={() => triggerAction(laneIdx, 'read')}
                            className="dlg-act"
                          >
                            {readFlashed
                              ? zh
                                ? '已展开'
                                : 'Opened'
                              : zh
                                ? '读结果'
                                : 'Read'}
                          </button>
                          <button
                            type="button"
                            onClick={() => triggerAction(laneIdx, 'ask')}
                            className="dlg-act"
                          >
                            {askFlashed
                              ? zh
                                ? '已带入'
                                : 'Drafted'
                              : zh
                                ? '追问'
                                : 'Follow up'}
                          </button>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ultra-concise 3-fact micro-strip below the animation */}
      <div className="mt-10 pt-6 border-t border-hairline flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[13px] text-ink-muted">
        <span>{zh ? '# 派发隔离 Worktree 并行跑' : '# parallel worktree dispatch'}</span>
        <span>{zh ? '跨 Agent 无损交接上下文' : 'Lossless cross-agent handoff'}</span>
        <span>{zh ? '委派树收进侧栏随时追问' : 'Sidebar tree · follow up anytime'}</span>
      </div>
    </div>
  );
}

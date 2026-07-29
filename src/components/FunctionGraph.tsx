import React, { useMemo, useRef, useEffect, useState } from "react";
import { parse, evaluate } from "mathjs";

export interface FunctionGraphProps {
  equation: string;
  width?: number;
  height?: number;
  showGrid?: boolean;
  showTicks?: boolean;
  xMin?: number;
  xMax?: number;
}

// ---------------------------------------------------------------------------
// Formula normalisation: "y=2x-3" → "2*x-3", "x^2" → "x^2", etc.
// ---------------------------------------------------------------------------
function normaliseFormula(equation: string): string {
  let expr = equation.trim();

  // Strip leading "y=" or "f(x)="
  expr = expr.replace(/^[yfY]\s*=\s*/i, "").replace(/^f\s*\(\s*x\s*\)\s*=\s*/i, "");

  // Insert implicit multiplication: "2x" → "2*x", "3(x+1)" → "3*(x+1)", etc.
  expr = expr.replace(/(\d)([a-zA-Z(])/g, "$1*$2");
  expr = expr.replace(/([a-zA-Z)])(\d)/g, "$1*$2");
  expr = expr.replace(/\)\s*\(/g, ")*(");

  return expr;
}

// Evaluate formula for a given x; returns NaN on error or non-finite result.
function evalAt(compiled: ReturnType<typeof parse>["compile"], x: number): number {
  try {
    const y = compiled.evaluate({ x });
    if (typeof y !== "number" || !isFinite(y)) return NaN;
    return y;
  } catch {
    return NaN;
  }
}

// ---------------------------------------------------------------------------
// Axis / grid helpers
// ---------------------------------------------------------------------------
function niceStep(range: number, targetDivisions: number): number {
  const raw = range / targetDivisions;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const candidates = [1, 2, 5, 10].map((c) => c * mag);
  return candidates.find((c) => c >= raw) ?? candidates[candidates.length - 1];
}

function tickValues(min: number, max: number, step: number): number[] {
  const result: number[] = [];
  const start = Math.ceil(min / step) * step;
  for (let v = start; v <= max + 1e-9; v += step) {
    result.push(parseFloat(v.toFixed(10)));
  }
  return result;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
const SAMPLES = 600;
const PADDING = { top: 24, right: 24, bottom: 24, left: 32 };

export default function FunctionGraph({
  equation,
  width: propWidth,
  height: propHeight = 340,
  showGrid = true,
  showTicks = true,
  xMin = -10,
  xMax = 10,
}: FunctionGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(propWidth ?? 0);

  useEffect(() => {
    if (propWidth) {
      setContainerWidth(propWidth);
      return;
    }
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    setContainerWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, [propWidth]);

  const svgWidth = containerWidth || 500;
  const svgHeight = propHeight;
  const innerW = svgWidth - PADDING.left - PADDING.right;
  const innerH = svgHeight - PADDING.top - PADDING.bottom;

  // ------------------------------------------------------------------
  // Compile & sample
  // ------------------------------------------------------------------
  const { segments, yMin, yMax, error } = useMemo(() => {
    if (innerW <= 0 || innerH <= 0) return { segments: [], yMin: -10, yMax: 10, error: "" };

    let compiled: ReturnType<typeof parse>["compile"] | null = null;
    try {
      compiled = parse(normaliseFormula(equation)).compile();
    } catch {
      return { segments: [], yMin: -10, yMax: 10, error: `Neatpažinta formulė: ${equation}` };
    }

    const dx = (xMax - xMin) / SAMPLES;
    const points: { x: number; y: number }[] = [];

    for (let i = 0; i <= SAMPLES; i++) {
      const x = xMin + i * dx;
      const y = evalAt(compiled, x);
      if (!isNaN(y)) points.push({ x, y });
    }

    if (points.length === 0) {
      return { segments: [], yMin: -10, yMax: 10, error: "" };
    }

    const ys = points.map((p) => p.y);
    const rawYMin = Math.min(...ys);
    const rawYMax = Math.max(...ys);
    const margin = (rawYMax - rawYMin) * 0.1 || 1;
    const yMin = rawYMin - margin;
    const yMax = rawYMax + margin;

    // Split into continuous segments (break on NaN gaps or huge jumps)
    const maxJump = (yMax - yMin) * 5;
    const segments: { x: number; y: number }[][] = [];
    let current: { x: number; y: number }[] = [];

    for (let i = 0; i <= SAMPLES; i++) {
      const x = xMin + i * dx;
      const y = evalAt(compiled, x);

      if (isNaN(y)) {
        if (current.length > 1) segments.push(current);
        current = [];
        continue;
      }

      if (current.length > 0) {
        const prev = current[current.length - 1];
        if (Math.abs(y - prev.y) > maxJump) {
          if (current.length > 1) segments.push(current);
          current = [{ x, y }];
          continue;
        }
      }

      current.push({ x, y });
    }
    if (current.length > 1) segments.push(current);

    return { segments, yMin, yMax, error: "" };
  }, [equation, xMin, xMax, innerW, innerH]);

  // ------------------------------------------------------------------
  // Coordinate → SVG transforms
  // ------------------------------------------------------------------
  const toSvgX = (x: number) => ((x - xMin) / (xMax - xMin)) * innerW;
  const toSvgY = (y: number) => innerH - ((y - yMin) / (yMax - yMin)) * innerH;

  // Clamp SVG y so paths don't escape the viewport
  const clampY = (y: number) => Math.max(-10, Math.min(innerH + 10, y));

  const pathD = (pts: { x: number; y: number }[]) =>
    pts
      .map((p, i) => {
        const sx = toSvgX(p.x);
        const sy = clampY(toSvgY(p.y));
        return `${i === 0 ? "M" : "L"}${sx.toFixed(2)},${sy.toFixed(2)}`;
      })
      .join(" ");

  // ------------------------------------------------------------------
  // Grid / ticks
  // ------------------------------------------------------------------
  const xStep = niceStep(xMax - xMin, 10);
  const yStep = niceStep(yMax - yMin, 8);
  const xTicks = tickValues(xMin, xMax, xStep);
  const yTicks = tickValues(yMin, yMax, yStep);

  // Axis positions in SVG coords (clamped to visible area)
  const axisY = Math.max(0, Math.min(innerH, toSvgY(0)));
  const axisX = Math.max(0, Math.min(innerW, toSvgX(0)));

  const formatTick = (v: number) => {
    if (Math.abs(v) < 1e-9) return "0";
    return parseFloat(v.toPrecision(4)).toString();
  };

  return (
    <div ref={containerRef} style={{ width: propWidth ? `${propWidth}px` : "100%" }}>
      {error && (
        <div className="text-red-500 text-sm mb-1 font-mono">{error}</div>
      )}
      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        style={{ display: "block", overflow: "visible" }}
      >
        <defs>
          <clipPath id="graph-clip">
            <rect x={0} y={0} width={innerW} height={innerH} />
          </clipPath>
          <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#374151" />
          </marker>
        </defs>

        <g transform={`translate(${PADDING.left},${PADDING.top})`}>
          {/* --- Grid --- */}
          {showGrid && (
            <g stroke="#e5e7eb" strokeWidth={1}>
              {xTicks.map((x) => (
                <line key={`gx-${x}`} x1={toSvgX(x)} y1={0} x2={toSvgX(x)} y2={innerH} />
              ))}
              {yTicks.map((y) => (
                <line key={`gy-${y}`} x1={0} y1={toSvgY(y)} x2={innerW} y2={toSvgY(y)} />
              ))}
            </g>
          )}

          {/* --- Axes --- */}
          <g stroke="#374151" strokeWidth={1.5}>
            {/* X axis */}
            <line x1={-8} y1={axisY} x2={innerW + 8} y2={axisY} markerEnd="url(#arrowhead)" />
            {/* Y axis */}
            <line x1={axisX} y1={innerH + 8} x2={axisX} y2={-8} markerEnd="url(#arrowhead)" />
          </g>

          {/* Axis labels */}
          <text x={innerW + 14} y={axisY + 4} fontSize={12} fill="#374151" fontStyle="italic">x</text>
          <text x={axisX + 5} y={-12} fontSize={12} fill="#374151" fontStyle="italic">y</text>

          {/* --- Ticks & labels --- */}
          {showTicks && (
            <g fontSize={10} fill="#6b7280" textAnchor="middle">
              {xTicks.map((x) => {
                if (Math.abs(x) < xStep * 0.01) return null;
                const sx = toSvgX(x);
                return (
                  <g key={`tx-${x}`}>
                    <line x1={sx} y1={axisY - 4} x2={sx} y2={axisY + 4} stroke="#6b7280" strokeWidth={1} />
                    <text x={sx} y={axisY + 15}>{formatTick(x)}</text>
                  </g>
                );
              })}
              {yTicks.map((y) => {
                if (Math.abs(y) < yStep * 0.01) return null;
                const sy = toSvgY(y);
                return (
                  <g key={`ty-${y}`}>
                    <line x1={axisX - 4} y1={sy} x2={axisX + 4} y2={sy} stroke="#6b7280" strokeWidth={1} />
                    <text x={axisX - 7} y={sy + 4} textAnchor="end">{formatTick(y)}</text>
                  </g>
                );
              })}
              {/* Origin label */}
              <text x={axisX - 7} y={axisY + 15} textAnchor="end">0</text>
            </g>
          )}

          {/* --- Function curve --- */}
          <g clipPath="url(#graph-clip)">
            {segments.map((seg, i) => (
              <path
                key={i}
                d={pathD(seg)}
                fill="none"
                stroke="#2563eb"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}

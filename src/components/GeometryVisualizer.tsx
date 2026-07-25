import React, { useMemo } from "react";
import type { DiagramConfig } from "../lib/types";

// ---------------------------------------------------------------------------
// 2-D vector helpers (all operate in math-space, Y-up coordinates)
// ---------------------------------------------------------------------------
type Pt = { x: number; y: number };

const pt = {
  sub: (a: Pt, b: Pt): Pt => ({ x: a.x - b.x, y: a.y - b.y }),
  add: (a: Pt, b: Pt): Pt => ({ x: a.x + b.x, y: a.y + b.y }),
  mul: (a: Pt, s: number): Pt => ({ x: a.x * s, y: a.y * s }),
  norm: (a: Pt): Pt => {
    const m = Math.hypot(a.x, a.y);
    return m > 1e-9 ? { x: a.x / m, y: a.y / m } : { x: 1, y: 0 };
  },
  mid: (a: Pt, b: Pt): Pt => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }),
  dot: (a: Pt, b: Pt): number => a.x * b.x + a.y * b.y,
  cross: (a: Pt, b: Pt): number => a.x * b.y - a.y * b.x,
};

function centroidOf(pts: Pt[]): Pt {
  return {
    x: pts.reduce((s, p) => s + p.x, 0) / pts.length,
    y: pts.reduce((s, p) => s + p.y, 0) / pts.length,
  };
}

// ---------------------------------------------------------------------------
// Shape specification
// ---------------------------------------------------------------------------
interface Edge {
  from: number;
  to: number;
  label?: string;
}

interface AngleMarker {
  vertex: number;  // index into vertices
  isRight: boolean;
  label?: string;  // shown only when !isRight
}

interface ExtraLine {
  a: Pt;
  b: Pt;
  dashed: boolean;
  label?: string;
}

interface CircleShape {
  center: Pt;
  radius: number;
  radiusLabel?: string;
}

interface ShapeSpec {
  vertices: Pt[];
  edges: Edge[];
  angleMarkers?: AngleMarker[];
  extraLines?: ExtraLine[];
  circle?: CircleShape;
}

// ---------------------------------------------------------------------------
// Shape builders — all coordinates in real units (cm / same scale as params)
// ---------------------------------------------------------------------------
type P = Record<string, number>;
type L = Record<string, string>;

function buildTriangle(p: P, l: L): ShapeSpec {
  // Vertices: B, C, A with B at origin, C on positive x-axis
  // Sides: a = BC (opposite A), b = CA (opposite B), c = AB (opposite C)
  const a = Math.max(p.a ?? 5, 0.1);
  const b = Math.max(p.b ?? 4, 0.1);
  const c = Math.max(p.c ?? 6, 0.1);
  // Triangle inequality guard
  if (a + b <= c || a + c <= b || b + c <= a) return buildTriangle({ a: 5, b: 4, c: 6 }, l);
  const cosB = (a * a + c * c - b * b) / (2 * a * c);
  const sinB = Math.sqrt(Math.max(0, 1 - cosB * cosB));
  const B: Pt = { x: 0, y: 0 };
  const C: Pt = { x: a, y: 0 };
  const A: Pt = { x: c * cosB, y: c * sinB };
  return {
    vertices: [A, B, C],  // A=0, B=1, C=2
    edges: [
      { from: 1, to: 2, label: l.a },  // BC = side a
      { from: 2, to: 0, label: l.b },  // CA = side b
      { from: 0, to: 1, label: l.c },  // AB = side c
    ],
  };
}

function buildRightTriangle(p: P, l: L): ShapeSpec {
  // Right angle at C = origin; B along x-axis; A along y-axis
  const a = Math.max(p.a ?? 4, 0.1);  // leg CB
  const b = Math.max(p.b ?? 3, 0.1);  // leg CA
  const C: Pt = { x: 0, y: 0 };
  const B: Pt = { x: a, y: 0 };
  const A: Pt = { x: 0, y: b };
  return {
    vertices: [A, B, C],  // A=0, B=1, C=2
    edges: [
      { from: 2, to: 1, label: l.a },  // CB = leg a
      { from: 2, to: 0, label: l.b },  // CA = leg b
      { from: 0, to: 1, label: l.c },  // AB = hypotenuse
    ],
    angleMarkers: [{ vertex: 2, isRight: true }],
  };
}

function buildRectangle(p: P, l: L): ShapeSpec {
  const w = Math.max(p.w ?? p.a ?? 5, 0.1);
  const h = Math.max(p.h ?? p.b ?? 3, 0.1);
  // A=bottom-left, B=bottom-right, C=top-right, D=top-left
  const A: Pt = { x: 0, y: 0 };
  const B: Pt = { x: w, y: 0 };
  const C: Pt = { x: w, y: h };
  const D: Pt = { x: 0, y: h };
  return {
    vertices: [A, B, C, D],
    edges: [
      { from: 0, to: 1, label: l.w ?? l.a },  // bottom
      { from: 1, to: 2, label: l.h ?? l.b },  // right
      { from: 2, to: 3 },                      // top (no duplicate label)
      { from: 3, to: 0 },                      // left (no duplicate label)
    ],
    angleMarkers: [
      { vertex: 0, isRight: true },
      { vertex: 1, isRight: true },
      { vertex: 2, isRight: true },
      { vertex: 3, isRight: true },
    ],
  };
}

function buildSquare(p: P, l: L): ShapeSpec {
  const s = Math.max(p.s ?? p.a ?? 4, 0.1);
  return buildRectangle({ w: s, h: s }, { "w": l.s ?? l.a, "h": undefined as any });
}

function buildParallelogram(p: P, l: L): ShapeSpec {
  const a = Math.max(p.a ?? 5, 0.1);
  const b = Math.max(p.b ?? 3, 0.1);
  const angleDeg = p.angle ?? 60;
  const angle = (angleDeg * Math.PI) / 180;
  // A=bottom-left, B=bottom-right, C=top-right, D=top-left
  const A: Pt = { x: 0, y: 0 };
  const B: Pt = { x: a, y: 0 };
  const C: Pt = { x: a + b * Math.cos(angle), y: b * Math.sin(angle) };
  const D: Pt = { x: b * Math.cos(angle), y: b * Math.sin(angle) };
  return {
    vertices: [A, B, C, D],
    edges: [
      { from: 0, to: 1, label: l.a },  // base
      { from: 1, to: 2, label: l.b },  // right side
      { from: 2, to: 3 },              // top (no duplicate)
      { from: 3, to: 0 },              // left side (no duplicate)
    ],
    angleMarkers: l.angle ? [{ vertex: 0, isRight: false, label: l.angle }] : [],
  };
}

function buildTrapezoid(p: P, l: L): ShapeSpec {
  const a = Math.max(p.a ?? 3, 0.1);  // top
  const b = Math.max(p.b ?? 6, 0.1);  // bottom
  const h = Math.max(p.h ?? 4, 0.1);  // height
  // Isosceles: centre both bases
  const offset = (b - a) / 2;
  const D: Pt = { x: 0, y: 0 };          // bottom-left
  const C: Pt = { x: b, y: 0 };          // bottom-right
  const B: Pt = { x: b - offset, y: h }; // top-right
  const A: Pt = { x: offset, y: h };     // top-left
  // Dashed height line from top-mid to bottom-mid
  const topMid: Pt = { x: (A.x + B.x) / 2, y: h };
  const botMid: Pt = { x: b / 2, y: 0 };
  return {
    vertices: [A, B, C, D],
    edges: [
      { from: 0, to: 1, label: l.a },  // top
      { from: 1, to: 2, label: l.c },  // right leg
      { from: 2, to: 3, label: l.b },  // bottom
      { from: 3, to: 0, label: l.d },  // left leg
    ],
    extraLines: l.h ? [{ a: topMid, b: botMid, dashed: true, label: l.h }] : [],
  };
}

function buildCircle(p: P, l: L): ShapeSpec {
  const r = Math.max(p.r ?? 3, 0.1);
  return {
    // Bounding-box sentinel vertices (not drawn)
    vertices: [
      { x: -r, y: -r },
      { x:  r, y: -r },
      { x:  r, y:  r },
      { x: -r, y:  r },
    ],
    edges: [],
    circle: { center: { x: 0, y: 0 }, radius: r, radiusLabel: l.r },
  };
}

function buildSpec(config: DiagramConfig): ShapeSpec | null {
  const p = config.parameters ?? {};
  const l = config.labels ?? {};
  try {
    switch (config.type) {
      case "triangle":       return buildTriangle(p, l);
      case "right_triangle": return buildRightTriangle(p, l);
      case "rectangle":      return buildRectangle(p, l);
      case "square":         return buildSquare(p, l);
      case "parallelogram":  return buildParallelogram(p, l);
      case "trapezoid":      return buildTrapezoid(p, l);
      case "circle":         return buildCircle(p, l);
      default:               return null;
    }
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// SVG viewport transform: math-space (Y-up) → SVG-space (Y-down)
// ---------------------------------------------------------------------------
const VIEW_W = 280;
const VIEW_H = 210;
const PADDING = 32;      // canvas padding for labels
const LABEL_DIST = 15;   // px from edge midpoint to label centre
const SQ_SIZE = 9;       // right-angle square side
const ARC_R = 18;        // angle arc radius
const STROKE = "#334155"; // slate-700
const LABEL_COLOR = "#1e293b"; // slate-800

function makeTransform(vertices: Pt[]) {
  const xs = vertices.map((v) => v.x);
  const ys = vertices.map((v) => v.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const shapeW = maxX - minX || 1;
  const shapeH = maxY - minY || 1;
  const availW = VIEW_W - 2 * PADDING;
  const availH = VIEW_H - 2 * PADDING;
  const scale = Math.min(availW / shapeW, availH / shapeH);
  // Centre the shape in the available area
  const startX = PADDING + (availW - shapeW * scale) / 2;
  const startY = PADDING + (availH - shapeH * scale) / 2;

  const toSVG = (p: Pt): Pt => ({
    x: startX + (p.x - minX) * scale,
    // Flip Y: maxY of shape → startY (top), minY → startY + shapeH*scale (bottom)
    y: startY + (maxY - p.y) * scale,
  });

  return { toSVG, scale };
}

// ---------------------------------------------------------------------------
// SVG element builders
// ---------------------------------------------------------------------------

function ptStr(p: Pt) {
  return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
}

function labelPos(svgMid: Pt, svgCentroid: Pt): Pt {
  const dir = pt.norm(pt.sub(svgMid, svgCentroid));
  return pt.add(svgMid, pt.mul(dir, LABEL_DIST));
}

function rightAnglePath(V: Pt, P: Pt, Q: Pt): string {
  const d1 = pt.mul(pt.norm(pt.sub(P, V)), SQ_SIZE);
  const d2 = pt.mul(pt.norm(pt.sub(Q, V)), SQ_SIZE);
  const p1 = pt.add(V, d1);
  const p2 = pt.add(pt.add(V, d1), d2);
  const p3 = pt.add(V, d2);
  return `M ${ptStr(p1)} L ${ptStr(p2)} L ${ptStr(p3)}`;
}

function anglePath(V: Pt, adjA: Pt, adjB: Pt): string {
  // Arc from direction V→adjA to V→adjB around vertex V
  const d1 = pt.norm(pt.sub(adjA, V));
  const d2 = pt.norm(pt.sub(adjB, V));
  const start = pt.add(V, pt.mul(d1, ARC_R));
  const end   = pt.add(V, pt.mul(d2, ARC_R));
  const cross = pt.cross(d1, d2);
  const sweep = cross < 0 ? 1 : 0; // CW in SVG = sweep=1 if cross<0 in math coords
  return `M ${ptStr(start)} A ${ARC_R} ${ARC_R} 0 0 ${sweep} ${ptStr(end)}`;
}

function angleLabelPos(V: Pt, adjA: Pt, adjB: Pt): Pt {
  const d1 = pt.norm(pt.sub(adjA, V));
  const d2 = pt.norm(pt.sub(adjB, V));
  const bis = pt.norm(pt.add(d1, d2));
  return pt.add(V, pt.mul(bis, ARC_R + 12));
}

// Find vertices adjacent to a given vertex index via edge list
function adjacentVerts(vi: number, edges: Edge[]): number[] {
  const adj: number[] = [];
  for (const e of edges) {
    if (e.from === vi) adj.push(e.to);
    else if (e.to === vi) adj.push(e.from);
  }
  return adj;
}

// ---------------------------------------------------------------------------
// Parallel lines + transversal renderer
// ---------------------------------------------------------------------------

// Bisector direction (SVG-space) for each of the 4 angle sectors at an intersection.
// The transversal runs from lower-left to upper-right at `angle` degrees from horizontal.
// In SVG Y-down coords the "up" transversal direction is (cosα, -sinα).
// Sectors, clockwise from upper-left:
//   1 = upper-left (between ←  and ↗)
//   2 = upper-right (between ↗ and →)
//   3 = lower-right (between → and ↙)
//   4 = lower-left  (between ↙ and ←)
function sectorBisector(pos: 1 | 2 | 3 | 4, cosr: number, sinr: number): Pt {
  switch (pos) {
    case 1: return pt.norm({ x: cosr - 1, y: -sinr });
    case 2: return pt.norm({ x: cosr + 1, y: -sinr });
    case 3: return pt.norm({ x: 1 - cosr, y:  sinr });
    case 4: return pt.norm({ x: -cosr - 1, y: sinr });
  }
}

// Small angle-arc indicator in the chosen sector
function sectorArcPath(
  inter: Pt,
  pos: 1 | 2 | 3 | 4,
  cosr: number,
  sinr: number,
  r: number
): string {
  // Bounding ray directions for each sector
  const rays: Record<number, [Pt, Pt]> = {
    1: [{ x: -1, y: 0 }, { x: cosr, y: -sinr }],   // ← to ↗
    2: [{ x: cosr, y: -sinr }, { x: 1, y: 0 }],     // ↗ to →
    3: [{ x: 1, y: 0 }, { x: -cosr, y: sinr }],     // → to ↙
    4: [{ x: -cosr, y: sinr }, { x: -1, y: 0 }],    // ↙ to ←
  };
  const [d1, d2] = rays[pos];
  const s = pt.add(inter, pt.mul(d1, r));
  const e = pt.add(inter, pt.mul(d2, r));
  // Determine sweep: cross product d1 × d2 in 2-D
  // positive cross → CCW in math → CW in SVG → sweep=1
  const cross = d1.x * d2.y - d1.y * d2.x;
  const sweep = cross > 0 ? 1 : 0;
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 0 ${sweep} ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
}

function ParallelLinesDiagram({ config }: { config: DiagramConfig }) {
  const angle = Math.max(15, Math.min(80, config.parameters?.angle ?? 55));
  const labels = config.labels ?? {};

  const W = VIEW_W;
  const H = VIEW_H;

  const lineY1 = H * 0.30;   // top parallel line
  const lineY2 = H * 0.70;   // bottom parallel line
  const deltaY  = lineY2 - lineY1;

  const rad  = (angle * Math.PI) / 180;
  const cosr = Math.cos(rad);
  const sinr = Math.sin(rad);

  // Horizontal offset between the two intersections
  const deltaX = deltaY * cosr / sinr;   // = deltaY · cot(α)

  // Centre the transversal horizontally
  const tx = W / 2 + deltaX / 2;  // top intersection x
  const bx = W / 2 - deltaX / 2;  // bottom intersection x

  const topInt: Pt = { x: tx, y: lineY1 };
  const botInt: Pt = { x: bx, y: lineY2 };

  // Extend transversal beyond the parallel lines
  const ext = 28;
  const transStart: Pt = { x: tx + cosr * ext,  y: lineY1 - sinr * ext };
  const transEnd:   Pt = { x: bx - cosr * ext,  y: lineY2 + sinr * ext };

  const lx1 = 14;
  const lx2 = W - 14;

  // ── Parallel-line tick marks — compact "//" double-slash at 1/4 of line ───
  function parallelMark(cx: number, cy: number, key: string) {
    const dx = 2.5, dy = 4, sep = 4.5;
    return (
      <g key={key}>
        <line x1={cx - sep/2 - dx} y1={cy + dy} x2={cx - sep/2 + dx} y2={cy - dy}
              stroke={STROKE} strokeWidth={1.3} strokeLinecap="round" />
        <line x1={cx + sep/2 - dx} y1={cy + dy} x2={cx + sep/2 + dx} y2={cy - dy}
              stroke={STROKE} strokeWidth={1.3} strokeLinecap="round" />
      </g>
    );
  }

  // ── Label + arc at a given sector position ───────────────────────────────
  const LDIST = 22;
  const ARC_LBL = 13;

  function sectorLabel(inter: Pt, pos: 1 | 2 | 3 | 4, text: string, key: string) {
    if (!text) return null;
    const bis = sectorBisector(pos, cosr, sinr);
    const lp  = pt.add(inter, pt.mul(bis, LDIST));
    return (
      <React.Fragment key={key}>
        <path
          d={sectorArcPath(inter, pos, cosr, sinr, ARC_LBL)}
          fill="none"
          stroke={STROKE}
          strokeWidth={1.1}
          opacity={0.7}
        />
        <text
          x={lp.x} y={lp.y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={11}
          fontWeight="700"
          fill={LABEL_COLOR}
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          stroke="white"
          strokeWidth={3}
          paintOrder="stroke"
        >
          {text}
        </text>
      </React.Fragment>
    );
  }

  return (
    <div className="flex justify-center my-4">
      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-3 inline-block">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width={W}
          height={H}
          style={{ maxWidth: "100%" }}
          aria-label="Lygiagrečios tiesės su kirstine"
        >
          {/* Parallel lines */}
          <line x1={lx1} y1={lineY1} x2={lx2} y2={lineY1} stroke={STROKE} strokeWidth={1.75} />
          <line x1={lx1} y1={lineY2} x2={lx2} y2={lineY2} stroke={STROKE} strokeWidth={1.75} />

          {/* Parallel marks at ~1/4 of each line (away from transversal) */}
          {[lineY1, lineY2].map((y, li) =>
            parallelMark(lx1 + (lx2 - lx1) * 0.22, y, `mark-${li}`)
          )}

          {/* Transversal */}
          <line
            x1={transStart.x} y1={transStart.y}
            x2={transEnd.x}   y2={transEnd.y}
            stroke={STROKE} strokeWidth={1.75}
          />

          {/* Angle labels — top intersection (t1–t4) */}
          {labels.t1 && sectorLabel(topInt, 1, labels.t1, "t1")}
          {labels.t2 && sectorLabel(topInt, 2, labels.t2, "t2")}
          {labels.t3 && sectorLabel(topInt, 3, labels.t3, "t3")}
          {labels.t4 && sectorLabel(topInt, 4, labels.t4, "t4")}

          {/* Angle labels — bottom intersection (b1–b4) */}
          {labels.b1 && sectorLabel(botInt, 1, labels.b1, "b1")}
          {labels.b2 && sectorLabel(botInt, 2, labels.b2, "b2")}
          {labels.b3 && sectorLabel(botInt, 3, labels.b3, "b3")}
          {labels.b4 && sectorLabel(botInt, 4, labels.b4, "b4")}
        </svg>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main exported component — dispatches to specialised renderers
// ---------------------------------------------------------------------------
interface Props {
  config: DiagramConfig;
}

export function GeometryVisualizer({ config }: Props) {
  // Dispatch to specialised renderer for non-polygon types
  if (config.type === "parallel_lines") {
    return <ParallelLinesDiagram config={config} />;
  }

  const spec = useMemo(() => buildSpec(config), [config]);

  if (!spec) return null;

  const { vertices, edges, angleMarkers = [], extraLines = [], circle } = spec;

  const { toSVG, scale } = makeTransform(vertices);
  const svgVerts = vertices.map(toSVG);
  const ctr = centroidOf(svgVerts);

  // ----- Polygon / lines -----
  const edgeEls = edges.map((e, i) => {
    const A = svgVerts[e.from];
    const B = svgVerts[e.to];
    return (
      <line
        key={`edge-${i}`}
        x1={A.x} y1={A.y}
        x2={B.x} y2={B.y}
        stroke={STROKE}
        strokeWidth={1.75}
        strokeLinecap="round"
      />
    );
  });

  // ----- Edge labels -----
  const labelEls = edges
    .filter((e) => e.label)
    .map((e, i) => {
      const A = svgVerts[e.from];
      const B = svgVerts[e.to];
      const mid = pt.mid(A, B);
      const lp = labelPos(mid, ctr);
      return (
        <text
          key={`lbl-${i}`}
          x={lp.x} y={lp.y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={11}
          fontWeight="600"
          fill={LABEL_COLOR}
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          stroke="white"
          strokeWidth={3}
          paintOrder="stroke"
        >
          {e.label}
        </text>
      );
    });

  // ----- Angle markers -----
  const angleEls = angleMarkers.flatMap((am, i) => {
    const adj = adjacentVerts(am.vertex, edges);
    if (adj.length < 2) return [];
    const V = svgVerts[am.vertex];
    const P = svgVerts[adj[0]];
    const Q = svgVerts[adj[1]];

    if (am.isRight) {
      return [
        <path
          key={`ra-${i}`}
          d={rightAnglePath(V, P, Q)}
          fill="none"
          stroke={STROKE}
          strokeWidth={1.25}
        />,
      ];
    }

    const els: React.ReactNode[] = [
      <path
        key={`arc-${i}`}
        d={anglePath(V, P, Q)}
        fill="none"
        stroke={STROKE}
        strokeWidth={1.25}
      />,
    ];
    if (am.label) {
      const lp = angleLabelPos(V, P, Q);
      els.push(
        <text
          key={`arc-lbl-${i}`}
          x={lp.x} y={lp.y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={10}
          fontWeight="600"
          fill={LABEL_COLOR}
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          stroke="white"
          strokeWidth={3}
          paintOrder="stroke"
        >
          {am.label}
        </text>
      );
    }
    return els;
  });

  // ----- Extra lines (dashed height indicators, etc.) -----
  const extraEls = (extraLines ?? []).flatMap((line, i) => {
    const A = toSVG(line.a);
    const B = toSVG(line.b);
    const els: React.ReactNode[] = [
      <line
        key={`xl-${i}`}
        x1={A.x} y1={A.y}
        x2={B.x} y2={B.y}
        stroke={STROKE}
        strokeWidth={1.25}
        strokeDasharray={line.dashed ? "4 3" : undefined}
        opacity={0.6}
      />,
      // Perpendicular tick marks at each end
      ...([A, B] as Pt[]).map((end, j) => {
        const dir = pt.norm(pt.sub(B, A));
        const perp = { x: -dir.y, y: dir.x };
        const t1 = pt.add(end, pt.mul(perp, 4));
        const t2 = pt.sub(end, pt.mul(perp, 4));
        return (
          <line
            key={`xt-${i}-${j}`}
            x1={t1.x} y1={t1.y}
            x2={t2.x} y2={t2.y}
            stroke={STROKE}
            strokeWidth={1.25}
            opacity={0.6}
          />
        );
      }),
    ];
    if (line.label) {
      const mid = pt.mid(A, B);
      const lp = labelPos(mid, ctr);
      els.push(
        <text
          key={`xl-lbl-${i}`}
          x={lp.x} y={lp.y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={11}
          fontWeight="600"
          fill={LABEL_COLOR}
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          stroke="white"
          strokeWidth={3}
          paintOrder="stroke"
        >
          {line.label}
        </text>
      );
    }
    return els;
  });

  // ----- Circle -----
  let circleEls: React.ReactNode[] = [];
  if (circle) {
    const cSVG = toSVG(circle.center);
    const r = circle.radius * scale;
    // Radius line (to the right)
    const rEnd = toSVG({ x: circle.center.x + circle.radius, y: circle.center.y });
    circleEls = [
      <circle
        key="circle"
        cx={cSVG.x} cy={cSVG.y}
        r={r}
        fill="none"
        stroke={STROKE}
        strokeWidth={1.75}
      />,
      // Small centre dot
      <circle key="cdot" cx={cSVG.x} cy={cSVG.y} r={2.5} fill={STROKE} />,
      // Radius line
      <line
        key="radius"
        x1={cSVG.x} y1={cSVG.y}
        x2={rEnd.x} y2={rEnd.y}
        stroke={STROKE}
        strokeWidth={1.25}
      />,
    ];
    if (circle.radiusLabel) {
      const mid = pt.mid(cSVG, rEnd);
      circleEls.push(
        <text
          key="rlbl"
          x={mid.x} y={mid.y - 8}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={11}
          fontWeight="600"
          fill={LABEL_COLOR}
          fontFamily="ui-sans-serif, system-ui, sans-serif"
          stroke="white"
          strokeWidth={3}
          paintOrder="stroke"
        >
          {circle.radiusLabel}
        </text>
      );
    }
  }

  // ----- Vertex labels (vA, vB, vC, vD) from config.labels -----
  const VERTEX_KEYS = ["vA", "vB", "vC", "vD"];
  const vertexLabelEls = circle
    ? []  // no vertex labels for circles
    : svgVerts
        .map((v, i) => {
          const text = config.labels?.[VERTEX_KEYS[i]];
          if (!text) return null;
          const dir = pt.norm(pt.sub(v, ctr));
          const lp = pt.add(v, pt.mul(dir, 15));
          return (
            <text
              key={`vlbl-${i}`}
              x={lp.x} y={lp.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={12}
              fontWeight="700"
              fontStyle="italic"
              fill={LABEL_COLOR}
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              stroke="white"
              strokeWidth={3.5}
              paintOrder="stroke"
            >
              {text}
            </text>
          );
        })
        .filter(Boolean);

  return (
    <div className="flex justify-center my-4">
      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-3 inline-block">
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          width={VIEW_W}
          height={VIEW_H}
          style={{ maxWidth: "100%" }}
          aria-label="Geometrinis brėžinys"
        >
          {edgeEls}
          {circleEls}
          {extraEls}
          {angleEls}
          {labelEls}
          {/* Vertex labels on top of everything */}
          {vertexLabelEls}
        </svg>
      </div>
    </div>
  );
}

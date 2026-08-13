export type Point = { x: number; y: number };

export type ArcOptions = {
  cx?: number;
  cy?: number;
  radius?: number;
  startDeg?: number;
  endDeg?: number;
};

const DEFAULTS: Required<ArcOptions> = {
  cx: 0,
  cy: 450,
  radius: 380,
  startDeg: -68,
  endDeg: 68,
};

const toRad = (deg: number) => (deg * Math.PI) / 180;

/**
 * Round coordinates before they reach the DOM. Server and client can format
 * the same float with different precision, which React reports as a hydration
 * mismatch on SVG attributes.
 */
const r3 = (n: number) => Math.round(n * 1000) / 1000;

/** Evenly distributes `count` points along a circular arc. */
export function arcPoints(count: number, opts: ArcOptions = {}): Point[] {
  const { cx, cy, radius, startDeg, endDeg } = { ...DEFAULTS, ...opts };
  const span = endDeg - startDeg;
  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const rad = toRad(startDeg + t * span);
    return { x: r3(cx + radius * Math.cos(rad)), y: r3(cy + radius * Math.sin(rad)) };
  });
}

export type HWaveOptions = {
  width?: number;
  height?: number;
  amplitude?: number;
  leftPad?: number;
  rightPad?: number;
  waves?: number;
};

/** Horizontal serpentine waypoints — the left-to-right journey arrow. */
export function hWavePoints(count: number, opts: HWaveOptions = {}): Point[] {
  const {
    width = 1200,
    height = 300,
    amplitude = 78,
    leftPad = 60,
    rightPad = 90,
    waves = 1.6,
  } = opts;
  const usable = width - leftPad - rightPad;
  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0.5 : i / (count - 1);
    return {
      x: r3(leftPad + t * usable),
      y: r3(height / 2 - Math.sin(t * Math.PI * waves) * amplitude),
    };
  });
}

export type SerpentineOptions = {
  spacing?: number;
  amplitude?: number;
  midY?: number;
  leftPad?: number;
};

/**
 * An open, left-to-right flowing curve — one waypoint per item, running off
 * past the edge of any viewport rather than being folded to fit inside one.
 *
 * This replaced a fixed arc that had to hold every checkpoint inside a single
 * screen. That constraint is what pushed markers off-screen: the more items,
 * the wider the arc had to spread, and past a certain viewport ratio the ends
 * simply left the frame. Here the path is allowed to be longer than the
 * screen and the view travels along it instead, so item count and viewport
 * size stop fighting each other.
 *
 * The vertical offset sums two sine waves whose periods don't divide evenly
 * into each other, so the curve reads as organic rather than as a repeating
 * mechanical ripple.
 */
export function serpentinePoints(count: number, opts: SerpentineOptions = {}): Point[] {
  const { spacing = 200, amplitude = 92, midY = 175, leftPad = 90 } = opts;
  return Array.from({ length: count }, (_, i) => ({
    x: r3(leftPad + i * spacing),
    y: r3(midY - (Math.sin(i * 0.72) * 0.76 + Math.sin(i * 1.31) * 0.24) * amplitude),
  }));
}

/**
 * Smooth path that passes exactly THROUGH every point (Catmull-Rom spline
 * expressed as cubic beziers).
 *
 * The previous implementation emitted `Q <point> <midpoint>`, which makes
 * each waypoint a quadratic CONTROL point — the curve leans toward it but
 * never reaches it. Only the first and last points were genuinely on the
 * line, so checkpoint dots drawn at the waypoints sat visibly off the
 * curve. A Catmull-Rom spline interpolates its points, so a dot at any
 * waypoint is exactly on the stroke.
 */
export function smoothPath(points: Point[], tension = 6) {
  if (points.length < 2) return "";
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? points[i + 1];

    const c1 = {
      x: r3(p1.x + (p2.x - p0.x) / tension),
      y: r3(p1.y + (p2.y - p0.y) / tension),
    };
    const c2 = {
      x: r3(p2.x - (p3.x - p1.x) / tension),
      y: r3(p2.y - (p3.y - p1.y) / tension),
    };
    d += ` C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

/** SVG path `d` for the arc itself — used as the track and the gradient band. */
export function arcPath(opts: ArcOptions = {}) {
  const { cx, cy, radius, startDeg, endDeg } = { ...DEFAULTS, ...opts };
  const at = (deg: number) => ({
    x: r3(cx + radius * Math.cos(toRad(deg))),
    y: r3(cy + radius * Math.sin(toRad(deg))),
  });
  const start = at(startDeg);
  const end = at(endDeg);
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

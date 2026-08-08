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

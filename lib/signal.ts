/**
 * Geometry helpers for the biosignal motif.
 * Everything is parameterised so the same generator drives the hero wave,
 * the vitals scroll monitor, and the dormant oscilloscope panel.
 */

/**
 * Build an ECG-style (PQRST) path string across `width` with `beats` heartbeats.
 * `up` is negative Y in SVG space.
 */
export function buildEcgPath(width: number, height: number, beats: number): string {
  const mid = height / 2;
  const bw = width / beats;

  let d = `M0 ${mid.toFixed(2)}`;

  for (let i = 0; i < beats; i++) {
    const x0 = i * bw;
    const at = (f: number) => (x0 + f * bw).toFixed(2);

    // isoelectric baseline
    d += ` L${at(0.12)} ${mid}`;
    // P wave (small rounded bump)
    d += ` Q${at(0.18)} ${(mid - height * 0.14).toFixed(2)} ${at(0.24)} ${mid}`;
    // PR segment
    d += ` L${at(0.32)} ${mid}`;
    // Q dip
    d += ` L${at(0.35)} ${(mid + height * 0.1).toFixed(2)}`;
    // R spike
    d += ` L${at(0.39)} ${(mid - height * 0.44).toFixed(2)}`;
    // S dip
    d += ` L${at(0.43)} ${(mid + height * 0.26).toFixed(2)}`;
    // back to baseline
    d += ` L${at(0.48)} ${mid}`;
    // ST segment
    d += ` L${at(0.62)} ${mid}`;
    // T wave (broad rounded bump)
    d += ` Q${at(0.72)} ${(mid - height * 0.2).toFixed(2)} ${at(0.82)} ${mid}`;
    // rest to next beat
    d += ` L${at(1)} ${mid}`;
  }

  return d;
}

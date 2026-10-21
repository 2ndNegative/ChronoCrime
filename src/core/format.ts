const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];

/** Short number display: 1.23K, 4.56M, then scientific. Infinity is the easter egg's business. */
export function formatNumber(n: number): string {
  if (!Number.isFinite(n)) return '∞';
  const abs = Math.abs(n);
  if (abs < 1000) return abs < 10 && abs % 1 !== 0 ? n.toFixed(2) : Math.floor(n).toString();
  const tier = Math.floor(Math.log10(abs) / 3);
  const suffix = SUFFIXES[tier];
  if (suffix === undefined) return n.toExponential(2);
  return (n / Math.pow(1000, tier)).toFixed(2) + suffix;
}

export function formatMoney(n: number): string {
  return '$' + formatNumber(n);
}

/** Pretty-print large counts like followers: 1200 -> "1.2k", 1_200_000 -> "1.2m" */
export default function formatCount(
    input: number | string | null | undefined,
    opts: { decimals?: number } = {}
  ): string {
    const decimals = opts.decimals ?? 1;
  
    const n = typeof input === "string" ? Number(input) : input ?? 0;
    if (!isFinite(n)) return "0";
  
    const sign = n < 0 ? "-" : "";
    const abs = Math.abs(n);
  
    const fmt = (v: number, suffix: string) =>
      sign + (v % 1 === 0 ? v.toString() : v.toFixed(decimals).replace(/\.0+$/, "")) + suffix;
  
    if (abs >= 1_000_000_000) return fmt(abs / 1_000_000_000, "b");
    if (abs >= 1_000_000) return fmt(abs / 1_000_000, "m");
    if (abs >= 1_000) return fmt(abs / 1_000, "k");
    return sign + String(abs);
  }
  
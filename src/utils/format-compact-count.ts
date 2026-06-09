const COMPACT_FROM = 1000

export function formatCompactCount(value: number, locale: string): string {
	if (!Number.isFinite(value)) return '0'
	const n = Math.trunc(Math.max(0, value))
	if (n < COMPACT_FROM) return String(n)
	return new Intl.NumberFormat(locale, {
		notation: 'compact',
		compactDisplay: 'short',
		maximumFractionDigits: 1,
	}).format(n)
}

type SupportedLocale = 'uk' | 'en'

function resolveLocale(locale?: string): SupportedLocale {
	if (locale?.toLowerCase().startsWith('uk')) return 'uk'

	if (typeof document !== 'undefined') {
		const documentLang = document.documentElement.lang
		if (documentLang?.toLowerCase().startsWith('uk')) return 'uk'
	}

	if (typeof navigator !== 'undefined') {
		const browserLocale = navigator.language
		if (browserLocale?.toLowerCase().startsWith('uk')) return 'uk'
	}

	return 'en'
}

export function formatDate(
	date: Date | string | number,
	locale?: string,
): string {
	const parsedDate =
		typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
	const currentLocale = resolveLocale(locale)
	const diffInSeconds = Math.round((parsedDate.getTime() - Date.now()) / 1000)
	const absSeconds = Math.abs(diffInSeconds)

	const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
		['year', 60 * 60 * 24 * 365],
		['month', 60 * 60 * 24 * 30],
		['week', 60 * 60 * 24 * 7],
		['day', 60 * 60 * 24],
		['hour', 60 * 60],
		['minute', 60],
		['second', 1],
	]

	const formatter = new Intl.RelativeTimeFormat(currentLocale, {
		numeric: 'always',
		style: 'long',
	})

	for (const [unit, secondsInUnit] of units) {
		if (absSeconds >= secondsInUnit || unit === 'second') {
			const value = Math.round(diffInSeconds / secondsInUnit)
			return formatter.format(value, unit)
		}
	}

	return formatter.format(0, 'second')
}

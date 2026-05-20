const MAX_CHAPTER_HOURS = 60
const MAX_CHAPTER_MINUTES = 59
const MAX_CHAPTER_SECONDS = 59

function clampNumericPart(raw: string, max: number): string {
	const digits = raw.replace(/\D/g, '')
	if (!digits) return ''
	const capped = digits.slice(0, 2)
	const n = Number.parseInt(capped, 10)
	if (!Number.isFinite(n)) return capped
	if (n > max) return String(max)
	return capped
}

/** Max lengths while typing: mm:ss or h:mm:ss (minutes/seconds 00–59, hours 00–60). */
export function sanitizeChapterTimecodeInput(value: string): string {
	let v = value.replace(/[^\d:]/g, '')
	v = v.replace(/:+/g, ':')
	v = v.replace(/^:/, '')
	const parts = v.split(':')
	if (parts.length === 1) {
		return clampNumericPart(parts[0], MAX_CHAPTER_MINUTES)
	}
	if (parts.length === 2) {
		return `${clampNumericPart(parts[0], MAX_CHAPTER_MINUTES)}:${clampNumericPart(parts[1], MAX_CHAPTER_SECONDS)}`
	}
	return `${clampNumericPart(parts[0], MAX_CHAPTER_HOURS)}:${clampNumericPart(parts[1], MAX_CHAPTER_MINUTES)}:${clampNumericPart(parts[2], MAX_CHAPTER_SECONDS)}`
}

const TC_SHAPE = /^(\d{1,2}:\d{2}:\d{2}|\d{1,2}:\d{2})$/

export function isValidChapterTimecode(trimmed: string): boolean {
	if (!TC_SHAPE.test(trimmed)) return false
	const parts = trimmed.split(':').map((p) => Number.parseInt(p, 10))
	if (parts.some((n) => !Number.isFinite(n))) return false
	if (parts.length === 2) {
		const [m, s] = parts
		return (
			m >= 0 &&
			m <= MAX_CHAPTER_MINUTES &&
			s >= 0 &&
			s <= MAX_CHAPTER_SECONDS
		)
	}
	const [h, m, s] = parts
	return (
		h >= 0 &&
		h <= MAX_CHAPTER_HOURS &&
		m >= 0 &&
		m <= MAX_CHAPTER_MINUTES &&
		s >= 0 &&
		s <= MAX_CHAPTER_SECONDS
	)
}

/** Convert stored chapter timecode to seconds (same rules as upload validation). */
export function chapterTimecodeToSeconds(timecode: string): number {
	const tc = timecode.trim()
	if (!isValidChapterTimecode(tc)) return 0
	const parts = tc.split(':').map((p) => Number.parseInt(p, 10))
	if (parts.length === 2) {
		const [m, s] = parts
		return m * 60 + s
	}
	const [h, m, s] = parts
	return h * 3600 + m * 60 + s
}

/** Display seconds as a scrub timestamp (e.g. `0:30`, `28:08`, `1:05:03`). */
export function formatSecondsAsChapterTimecode(totalSeconds: number): string {
	if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return '0:00'
	const total = Math.floor(totalSeconds)
	const h = Math.floor(total / 3600)
	const m = Math.floor((total % 3600) / 60)
	const s = total % 60
	if (h > 0) {
		return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
	}
	return `${m}:${String(s).padStart(2, '0')}`
}

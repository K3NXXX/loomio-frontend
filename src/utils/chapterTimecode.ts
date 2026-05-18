/** Max lengths while typing: mm:ss or h:mm:ss (e.g. 999:59:59). */
export function sanitizeChapterTimecodeInput(value: string): string {
	let v = value.replace(/[^\d:]/g, '')
	v = v.replace(/:+/g, ':')
	v = v.replace(/^:/, '')
	const parts = v.split(':')
	if (parts.length === 1) {
		return parts[0].slice(0, 3)
	}
	if (parts.length === 2) {
		return `${parts[0].slice(0, 3)}:${parts[1].slice(0, 2)}`
	}
	return `${parts[0].slice(0, 3)}:${parts[1].slice(0, 2)}:${parts[2].slice(0, 2)}`
}

const TC_SHAPE = /^(\d{1,3}:\d{2}:\d{2}|\d{1,3}:\d{2})$/

export function isValidChapterTimecode(trimmed: string): boolean {
	if (!TC_SHAPE.test(trimmed)) return false
	const parts = trimmed.split(':').map((p) => Number.parseInt(p, 10))
	if (parts.some((n) => !Number.isFinite(n))) return false
	if (parts.length === 2) {
		const [m, s] = parts
		return m >= 0 && m <= 999 && s >= 0 && s <= 59
	}
	const [h, m, s] = parts
	return h >= 0 && h <= 999 && m >= 0 && m <= 59 && s >= 0 && s <= 59
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

/** Separator between reason code and optional moderator note in VIDEO_RESTRICTED notification `message` */
export const RESTRICTED_NOTIFICATION_NOTE_SEPARATOR = '\n---\n'

/** Mirrors Prisma `ReportReason` — used to detect localized reason payloads in notifications */
export const REPORT_REASON_CODES = new Set([
	'HATE_SPEECH',
	'HARASSMENT',
	'SPAM',
	'SEXUAL_CONTENT',
	'VIOLENCE',
	'OTHER',
])

/** Legacy EN sentence from older backend: `Your video was restricted for hate speech` */
const LEGACY_ENGLISH_RESTRICTED_PREFIX = /^your video was restricted for\s+/i

const LEGACY_ENGLISH_PHRASE_TO_CODE: Record<string, string> = {
		'hate speech': 'HATE_SPEECH',
		harassment: 'HARASSMENT',
		spam: 'SPAM',
		'sexual content': 'SEXUAL_CONTENT',
		violence: 'VIOLENCE',
		other: 'OTHER',
	}

export function stripRestrictedNotificationModeratorNoteForParsing(
	raw: string,
): string {
	const idx = raw.indexOf(RESTRICTED_NOTIFICATION_NOTE_SEPARATOR)
	if (idx === -1) return raw.trim()
	return raw.slice(0, idx).trim()
}

/** Optional moderator-facing note appended after `RESTRICTED_NOTIFICATION_NOTE_SEPARATOR` */
export function extractModeratorNoteFromRestrictedNotification(
	message: string | null | undefined,
): string | null {
	const s = (message ?? '').trim()
	const idx = s.indexOf(RESTRICTED_NOTIFICATION_NOTE_SEPARATOR)
	if (idx === -1) return null
	const note = s.slice(idx + RESTRICTED_NOTIFICATION_NOTE_SEPARATOR.length).trim()
	return note || null
}

export function isReportReasonCode(value: string | null | undefined): boolean {
	if (value == null) return false
	return REPORT_REASON_CODES.has(value.trim())
}

/**
 * Returns canonical reason code for DB storage, or null if unknown.
 * Handles: `VIOLENCE`, legacy English full sentence, lowercase enum from buggy clients.
 */
export function parseReportReasonFromNotificationMessage(
	message: string | null | undefined,
): string | null {
	const raw = (message ?? '').trim()
	if (!raw) return null

	const codePayload = stripRestrictedNotificationModeratorNoteForParsing(raw)
	if (!codePayload) return null

	if (isReportReasonCode(codePayload)) return codePayload

	const upper = codePayload.toUpperCase()
	if (isReportReasonCode(upper)) return upper

	const legacy = codePayload.replace(LEGACY_ENGLISH_RESTRICTED_PREFIX, '').trim()
	if (legacy && legacy !== codePayload) {
		const phrase = legacy.toLowerCase()
		const mapped = LEGACY_ENGLISH_PHRASE_TO_CODE[phrase]
		if (mapped && isReportReasonCode(mapped)) return mapped
		const guessed = phrase.toUpperCase().replace(/\s+/g, '_')
		if (isReportReasonCode(guessed)) return guessed
	}

	return null
}

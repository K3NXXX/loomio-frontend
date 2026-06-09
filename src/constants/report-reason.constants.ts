export const RESTRICTED_NOTIFICATION_NOTE_SEPARATOR = '\n---\n'

export const REPORT_REASON_CODES = new Set([
	'HATE_SPEECH',
	'HARASSMENT',
	'SPAM',
	'SEXUAL_CONTENT',
	'VIOLENCE',
	'OTHER',
])

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

export function extractModeratorNoteFromRestrictedNotification(
	message: string | null | undefined,
): string | null {
	const s = (message ?? '').trim()
	const idx = s.indexOf(RESTRICTED_NOTIFICATION_NOTE_SEPARATOR)
	if (idx === -1) return null
	const note = s
		.slice(idx + RESTRICTED_NOTIFICATION_NOTE_SEPARATOR.length)
		.trim()
	return note || null
}

export function isReportReasonCode(value: string | null | undefined): boolean {
	if (value == null) return false
	return REPORT_REASON_CODES.has(value.trim())
}

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

	const legacy = codePayload
		.replace(LEGACY_ENGLISH_RESTRICTED_PREFIX, '')
		.trim()
	if (legacy && legacy !== codePayload) {
		const phrase = legacy.toLowerCase()
		const mapped = LEGACY_ENGLISH_PHRASE_TO_CODE[phrase]
		if (mapped && isReportReasonCode(mapped)) return mapped
		const guessed = phrase.toUpperCase().replace(/\s+/g, '_')
		if (isReportReasonCode(guessed)) return guessed
	}

	return null
}

import axios from 'axios'

/**
 * Maps backend English messages to next-intl keys under the `toast` namespace.
 * Values are relative keys (no `toast.` prefix) when `t` is from `useTranslations('toast')`.
 */
const TOAST_API_MESSAGE_KEY: Record<string, string> = {
	'The password reset link is invalid or has expired. Please request a new one':
		'passwordResetLinkExpired',
	'Channel username already taken': 'channelUsernameTaken',
	'Username is already taken': 'usernameTaken',
}

export const PASSWORD_RESET_LINK_EXPIRED_MESSAGE =
	'The password reset link is invalid or has expired. Please request a new one'

export function extractApiErrorMessage(error: unknown): string | undefined {
	if (!axios.isAxiosError(error)) return undefined
	const data = error.response?.data as { message?: string | string[] } | undefined
	const m = data?.message
	if (Array.isArray(m) && m[0]) return m[0]
	if (typeof m === 'string' && m.trim()) return m
	return undefined
}

function normalizeToastKey(key: string): string {
	return key.startsWith('toast.') ? key.slice('toast.'.length) : key
}

export function getToastApiMessage(
	rawMessage: string | undefined,
	t: (key: string) => string,
	fallbackKey = 'genericError',
): string {
	if (!rawMessage?.trim()) return t(normalizeToastKey(fallbackKey))
	const mapped = TOAST_API_MESSAGE_KEY[rawMessage.trim()]
	return mapped ? t(mapped) : rawMessage
}

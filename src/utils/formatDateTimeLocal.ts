import { format } from 'date-fns'

export function formatDateTimeLocal(date?: string | Date | null): string {
	if (!date) return ''
	const d = typeof date === 'string' ? new Date(date) : date
	return format(d, "yyyy-MM-dd'T'HH:mm")
}

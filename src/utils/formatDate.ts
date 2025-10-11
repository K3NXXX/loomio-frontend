import { formatDistanceToNow } from 'date-fns'

export function formatDate(date: Date | string | number): string {
	const parsedDate =
		typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
	return formatDistanceToNow(parsedDate, { addSuffix: true })
}

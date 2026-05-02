import { cn } from '@/lib/utils'

export function reportReasonBadgeClass(reason: string) {
	return cn(
		'px-3 py-1 rounded-full text-[12px] font-medium border',
		reason === 'HATE_SPEECH' &&
			'border-red-400/55 text-red-600 dark:text-red-400 bg-red-500/[0.06]',
		reason === 'SPAM' &&
			'border-blue-400/55 text-blue-600 dark:text-blue-400 bg-blue-500/[0.06]',
		reason !== 'HATE_SPEECH' &&
			reason !== 'SPAM' &&
			'border-border/60 bg-muted/30 text-foreground',
	)
}

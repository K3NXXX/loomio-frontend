import { cn } from '@/lib/utils'

/** Shared DialogContent wrapper for moderation report modals (video, comment, re-review). */
export const moderationReportModalContentClass = cn(
	'!max-w-[1000px] w-[92vw] sm:w-[90vw] min-h-[85vh] max-h-[92vh] p-0 overflow-hidden',
	'flex flex-col',
	'rounded-2xl border border-border/60',
	'shadow-[0_24px_64px_-16px_rgba(0,0,0,0.28)] dark:shadow-[0_24px_72px_-12px_rgba(0,0,0,0.65)]',
	'ring-1 ring-border/50',
	'bg-gradient-to-br from-card via-background to-muted/25',
)

export const moderationReportModalFooterClass = cn(
	'relative shrink-0 px-6 md:px-8 py-4 md:py-5',
	'flex flex-wrap items-center justify-end gap-3',
	'border-t border-border/50 bg-muted/15 dark:bg-muted/10 backdrop-blur-xl',
	'shadow-[0_-12px_40px_-20px_rgba(0,0,0,0.12)] dark:shadow-[0_-12px_40px_-20px_rgba(0,0,0,0.35)]',
)

export const moderationReportModalFooterGlowClass =
	'pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent'

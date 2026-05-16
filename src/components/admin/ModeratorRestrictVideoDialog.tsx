'use client'

import { REPORT_REASON_CODES } from '@/constants/report-reason.constants'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { useRestrictVideo } from '@/hooks/report/useRestrictVideo'
import { cn } from '@/lib/utils'
import { ReportReason } from '@/types/report.types'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

const REPORT_REASON_ORDER: ReportReason[] = [
	ReportReason.HATE_SPEECH,
	ReportReason.HARASSMENT,
	ReportReason.SPAM,
	ReportReason.SEXUAL_CONTENT,
	ReportReason.VIOLENCE,
	ReportReason.OTHER,
]

interface ModeratorRestrictVideoDialogProps {
	reportId: string
	defaultReason: string
	open: boolean
	onOpenChange: (open: boolean) => void
	onRestricted: () => void
}

export function ModeratorRestrictVideoDialog({
	reportId,
	defaultReason,
	open,
	onOpenChange,
	onRestricted,
}: ModeratorRestrictVideoDialogProps) {
	const t = useTranslations('moderation.modals.restrictVideoForm')
	const tReason = useTranslations('moderation.enums.reason')
	const { restrictVideo, isPending } = useRestrictVideo(reportId)

	const [reason, setReason] = useState<string>(ReportReason.OTHER)
	const [note, setNote] = useState('')

	useEffect(() => {
		if (!open) return
		const dr = defaultReason?.trim()
		setReason(dr && REPORT_REASON_CODES.has(dr) ? dr : ReportReason.OTHER)
		setNote('')
	}, [open, defaultReason])

	const handleSubmit = () => {
		restrictVideo(
			{
				reason,
				moderatorNote: note.trim() || undefined,
			},
			{
				onSuccess: () => {
					onOpenChange(false)
					onRestricted()
				},
			},
		)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='sm:max-w-lg gap-4 border-border bg-card text-card-foreground'>
				<DialogHeader>
					<DialogTitle>{t('title')}</DialogTitle>
					<DialogDescription>{t('description')}</DialogDescription>
				</DialogHeader>

				<div className='space-y-2'>
					<Label className='text-sm font-medium'>{t('reasonLabel')}</Label>
					<RadioGroup
						value={reason}
						onValueChange={setReason}
						className='gap-2.5 rounded-xl border border-border/40 bg-muted/15 p-3'
					>
						{REPORT_REASON_ORDER.map((r) => (
							<div key={r} className='flex items-center gap-3'>
								<RadioGroupItem value={r} id={`restrict-reason-${r}`} />
								<Label
									htmlFor={`restrict-reason-${r}`}
									className={cn(
										'cursor-pointer font-normal leading-snug flex-1',
										reason === r && 'text-foreground font-medium',
									)}
								>
									{tReason(r)}
								</Label>
							</div>
						))}
					</RadioGroup>
				</div>

				<div className='space-y-2'>
					<Label htmlFor='moderator-restrict-note' className='text-sm font-medium'>
						{t('noteLabel')}
					</Label>
					<Textarea
						id='moderator-restrict-note'
						value={note}
						onChange={(e) => setNote(e.target.value)}
						placeholder={t('notePlaceholder')}
						maxLength={2000}
						rows={4}
						className='resize-y min-h-[100px] bg-background border-border text-foreground placeholder:text-muted-foreground'
					/>
				</div>

				<DialogFooter className='gap-2 sm:gap-2'>
					<Button
						type='button'
						variant='outline'
						disabled={isPending}
						onClick={() => onOpenChange(false)}
					>
						{t('cancel')}
					</Button>
					<Button
						type='button'
						variant='destructive'
						disabled={isPending || !reason}
						onClick={handleSubmit}
					>
						{t('submit')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

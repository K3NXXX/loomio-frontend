'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'

import { useReportComment } from '@/hooks/report/useReportComment'
import { cn } from '@/lib/utils'
import {
	reportSchema,
	type TReportSchema,
} from '@/schemas/report/report.schema'

import { ReportReason } from '@/types/report.types'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { getValidationMessage } from '@/utils/validationMessage'

interface IWatchReportCommentModalProps {
	open: boolean
	onOpenChange: (value: boolean) => void
	commentId: string
}

export function WatchReportCommentModal({
	open,
	onOpenChange,
	commentId,
}: IWatchReportCommentModalProps) {
	const t = useTranslations()
	const { reportComment, isPending } = useReportComment()

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors },
	} = useForm<TReportSchema>({
		resolver: zodResolver(reportSchema),
		defaultValues: {
			reason: undefined,
			message: '',
		},
	})

	const reason = watch('reason')

	const reportReasonLabels = {
		[ReportReason.HATE_SPEECH]: t('report.reasons.hateSpeech'),
		[ReportReason.HARASSMENT]: t('report.reasons.harassmentOrBullying'),
		[ReportReason.SPAM]: t('report.reasons.spamOrMisleading'),
		[ReportReason.SEXUAL_CONTENT]: t('report.reasons.sexualContent'),
		[ReportReason.VIOLENCE]: t('report.reasons.violenceOrDangerousContent'),
		[ReportReason.OTHER]: t('report.reasons.other'),
	}

	const onSubmit = (data: TReportSchema) => {
		reportComment({
			commentId,
			reason: data.reason!,
			message: data.reason === ReportReason.OTHER ? data.message : undefined,
		})

		onOpenChange(false)
		reset()
	}

	useEffect(() => {
		if (!open) reset()
	}, [open])

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				onClick={(e) => e.stopPropagation()}
				onOpenAutoFocus={(e) => e.preventDefault()}
				className='w-[500px] rounded-2xl border border-border/40 bg-background/95 backdrop-blur p-6 shadow-xl'
			>
				<DialogHeader>
					<DialogTitle className='text-xl font-semibold text-center'>
						{t('watchComments.reportTitle')}
					</DialogTitle>
					<DialogDescription className='text-center text-muted-foreground'>
						{t('watchComments.reportDescription')}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)}>
					<div className='flex flex-col gap-3 mt-4'>
						{Object.values(ReportReason).map((value) => (
							<button
								type='button'
								key={value}
								onClick={() => setValue('reason', value)}
								className={cn(
									'text-left px-3 py-2 rounded-xl border transition-all cursor-pointer',
									reason === value
										? 'border-primary bg-primary/10 text-primary'
										: 'border-border text-foreground hover:bg-muted/40',
								)}
							>
								{reportReasonLabels[value]}
							</button>
						))}

						{errors.reason && (
							<p className='text-red-500 text-sm'>
								{getValidationMessage(String(errors.reason.message), t)}
							</p>
						)}

						{reason === ReportReason.OTHER && (
							<div className='flex flex-col gap-1'>
								<textarea
									{...register('message')}
									placeholder={t('watchComments.reportReasonPlaceholder')}
									className='w-full bg-muted border border-border rounded-lg p-3 resize-none text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none'
									rows={3}
								/>
								{errors.message && (
									<p className='text-red-500 text-sm'>
										{getValidationMessage(String(errors.message.message), t)}
									</p>
								)}
							</div>
						)}
					</div>

					<div className='flex justify-end gap-3 mt-6'>
						<Button
							type='button'
							variant='outline'
							onClick={() => onOpenChange(false)}
						>
							{t('common.cancel')}
						</Button>

						<Button type='submit' disabled={isPending}>
							{t('common.sendReport')}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}

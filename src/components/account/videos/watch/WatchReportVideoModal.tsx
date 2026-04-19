'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'

import { useReportVideo } from '@/hooks/report/useReportVideo'
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

interface IWatchReportVideoModalProps {
	open: boolean
	onOpenChange: (value: boolean) => void
	videoId: string
}

export function WatchReportVideoModal({
	open,
	onOpenChange,
	videoId,
}: IWatchReportVideoModalProps) {
	const t = useTranslations()
	const { reportVideo, isPending } = useReportVideo()

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
		reportVideo({
			videoId,
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
				onOpenAutoFocus={(e) => e.preventDefault()}
				className='w-[500px] rounded-2xl border border-border/40 bg-background/95 backdrop-blur p-6 shadow-xl'
			>
				<DialogHeader>
					<DialogTitle className='text-xl font-semibold text-center'>
						{t('watchVideo.reportTitle')}
					</DialogTitle>
					<DialogDescription className='text-center text-muted-foreground'>
						{t('watchVideo.reportDescription')}
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
									placeholder={t('watchVideo.reportReasonPlaceholder')}
									className='w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 resize-none text-neutral-100 focus:border-primary focus:outline-none'
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
							className='bg-neutral-800 text-neutral-200 border-neutral-700 hover:bg-neutral-700'
							onClick={() => onOpenChange(false)}
						>
							{t('common.cancel')}
						</Button>

						<Button
							type='submit'
							disabled={isPending}
							className='bg-primary text-white hover:brightness-90'
						>
							{t('common.sendReport')}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}

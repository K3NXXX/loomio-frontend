'use client'

import { ModeratorRestrictVideoDialog } from '@/components/admin/ModeratorRestrictVideoDialog'
import {
	moderationReportModalFooterClass,
	moderationReportModalFooterGlowClass,
} from '@/components/admin/moderation-report/moderationModalShell'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { useConfirmReviewVideo } from '@/hooks/report/useConfirmReviewVideo'
import type { IGetUserData } from '@/types/auth.types'
import type { IReportItem } from '@/types/report.types'
import { useTranslations } from 'next-intl'

interface IReportFooterProps {
	userData?: IGetUserData
	report: IReportItem
	onOpenChange: (v: boolean) => void
}

export function ReportFooter({
	report,
	userData,
	onOpenChange,
}: IReportFooterProps) {
	const t = useTranslations('moderation.modals')
	const { confirmReview } = useConfirmReviewVideo()

	const [approveDialog, setApproveDialog] = useState(false)
	const [restrictDialogOpen, setRestrictDialogOpen] = useState(false)

	const canModerate =
		report.assignedToId !== null && report.assignedToId === userData?.id

	const handleApprove = () => {
		confirmReview(report.id, {
			onSuccess: () => {
				setApproveDialog(false)
				onOpenChange(false)
			},
		})
	}

	return (
		<>
			<div className={moderationReportModalFooterClass}>
				<div className={moderationReportModalFooterGlowClass} aria-hidden />
				{report.status !== 'RESOLVED' && (
					<>
						<Button
							variant='outline'
							className='h-10 rounded-xl shadow-sm'
							disabled={!canModerate}
							onClick={() => setApproveDialog(true)}
						>
							{t('videoReview.approve')}
						</Button>

						<Button
							variant='destructive'
							className='h-10 rounded-xl shadow-sm'
							disabled={!canModerate}
							onClick={() => setRestrictDialogOpen(true)}
						>
							{t('videoReview.restrictVideo')}
						</Button>
					</>
				)}
			</div>

			<ModeratorRestrictVideoDialog
				reportId={report.id}
				defaultReason={report.reason}
				open={restrictDialogOpen}
				onOpenChange={setRestrictDialogOpen}
				onRestricted={() => onOpenChange(false)}
			/>

			<AlertDialog open={approveDialog} onOpenChange={setApproveDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{t('videoReview.approveTitle')}</AlertDialogTitle>
						<AlertDialogDescription>
							{t('videoReview.approveDescription')}
						</AlertDialogDescription>
					</AlertDialogHeader>

					<AlertDialogFooter>
						<AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
						<AlertDialogAction onClick={handleApprove}>
							{t('confirm')}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}

'use client'

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

import { useRestrictVideo } from '@/hooks/report/useRestrictVideo'

import { useConfirmReviewVideo } from '@/hooks/report/useConfirmReviewVideo'
import type { IGetUserData } from '@/types/auth.types'
import type { IReportItem } from '@/types/report.types'

interface IReportFooterProps {
	userData: IGetUserData
	report: IReportItem
	onOpenChange: () => void
}

export function ReportFooter({
	report,
	userData,
	onOpenChange,
}: IReportFooterProps) {
	const { restrictVideo, isPending: restricting } = useRestrictVideo(report.id)
	const { confirmReview } = useConfirmReviewVideo()

	const [approveDialog, setApproveDialog] = useState(false)
	const [restrictDialog, setRestrictDialog] = useState(false)

	const canModerate =
		report.assignedToId !== null && report.assignedToId === userData?.id

	const handleApprove = () => {
		confirmReview(report.id, {
			onSuccess: () => {
				setApproveDialog(false)
				onOpenChange()
			},
		})
	}

	const handleRestrict = () => {
		restrictVideo(undefined, {
			onSuccess: () => {
				setRestrictDialog(false)
				onOpenChange()
			},
		})
	}

	return (
		<>
			<div className='px-8 py-5 border-t border-border/20 bg-muted/10 flex items-center justify-end gap-3'>
				{report.status !== 'RESOLVED' && (
					<>
						<Button
							variant='outline'
							disabled={!canModerate}
							onClick={() => setApproveDialog(true)}
						>
							Approve
						</Button>

						<Button
							variant='destructive'
							disabled={!canModerate || restricting}
							onClick={() => setRestrictDialog(true)}
						>
							Restrict Video
						</Button>
					</>
				)}
			</div>

			<AlertDialog open={approveDialog} onOpenChange={setApproveDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Approve Report?</AlertDialogTitle>
						<AlertDialogDescription>
							By confirming this action, the report will be marked as resolved.
							The video will keep its current visibility, files and status.
						</AlertDialogDescription>
					</AlertDialogHeader>

					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleApprove}>
							Confirm
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog open={restrictDialog} onOpenChange={setRestrictDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Restrict Video?</AlertDialogTitle>
						<AlertDialogDescription>
							The video will become RESTRICTED and the report will be marked as
							resolved.
						</AlertDialogDescription>
					</AlertDialogHeader>

					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleRestrict}>
							Restrict Video
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}

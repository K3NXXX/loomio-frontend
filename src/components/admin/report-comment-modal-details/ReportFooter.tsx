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

import { useApproveReport } from '@/hooks/report/useApproveReport'
import { useDeleteCommentReport } from '@/hooks/report/useDeleteCommentReport'

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
	const { approveReport, isPending: approving } = useApproveReport(report.id)
	const { deleteCommentReport, isPending: deleting } = useDeleteCommentReport(
		report.id,
	)

	const [approveDialogOpen, setApproveDialogOpen] = useState(false)
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

	const canModerate =
		report.assignedToId !== null && report.assignedToId === userData?.id

	const confirmApprove = () => {
		if (!report.comment) return

		approveReport(undefined, {
			onSuccess: () => {
				setApproveDialogOpen(false)
				onOpenChange()
			},
		})
	}

	const confirmDelete = () => {
		if (!report.comment) return

		deleteCommentReport(undefined, {
			onSuccess: () => {
				setDeleteDialogOpen(false)
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
							disabled={!canModerate || approving || !report.comment}
							onClick={() => setApproveDialogOpen(true)}
						>
							Approve
						</Button>

						<Button
							variant='destructive'
							disabled={!canModerate || deleting || !report.comment}
							onClick={() => setDeleteDialogOpen(true)}
						>
							Delete Comment
						</Button>
					</>
				)}
			</div>

			<AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Approve Report?</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to approve this report? This will mark the
							report as resolved.
						</AlertDialogDescription>
					</AlertDialogHeader>

					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={confirmApprove}>
							Yes, Approve
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Comment?</AlertDialogTitle>
						<AlertDialogDescription>
							This action is permanent. The comment will be removed and the
							report will be marked as resolved.
						</AlertDialogDescription>
					</AlertDialogHeader>

					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={confirmDelete}>
							Yes, Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}

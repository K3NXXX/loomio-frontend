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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useGetMe } from '@/hooks/auth/useGetMe'
import { useDeleteComment } from '@/hooks/comment/useDeleteComment'
import type { IVideoComment } from '@/types/comment.types'
import { useTranslations } from 'next-intl'
import { Dispatch, SetStateAction, useState } from 'react'
import { MdDelete, MdEdit } from 'react-icons/md'
import { TbDotsVertical, TbMessageReportFilled } from 'react-icons/tb'
import { WatchReportCommentModal } from './WatchReportCommentModal'

interface IWatchCommentOptions {
	videoId: string
	comment: IVideoComment
	setIsCommentEditing: Dispatch<SetStateAction<boolean>>
}

export function WatchCommentOptions({
	comment,
	setIsCommentEditing,
	videoId,
}: IWatchCommentOptions) {
	const t = useTranslations()
	const { userData } = useGetMe()
	const { deleteComment } = useDeleteComment(videoId)

	const [isConfirmOpen, setIsConfirmOpen] = useState(false)
	const [isReportOpen, setIsReportOpen] = useState(false)

	const handleDelete = () => {
		setIsConfirmOpen(false)

		setTimeout(() => {
			deleteComment(comment.id)
		}, 50)
	}

	const canEdit = userData?.id === comment.user.id
	const canReport = Boolean(userData && userData.id !== comment.user.id)

	if (!canEdit && !canReport) {
		return null
	}

	return (
		<>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<div className='p-1 rounded-md cursor-pointer transition-colors hover:text-primary'>
						<TbDotsVertical className='w-5 h-5' />
					</div>
				</DropdownMenuTrigger>

				<DropdownMenuContent side='right'>
					{canEdit && (
						<>
							<DropdownMenuItem
								onClick={() => setIsCommentEditing(true)}
								className='flex items-center gap-2 cursor-pointer'
							>
								<MdEdit className='w-4 h-4' />
								{t('watchComments.edit')}
							</DropdownMenuItem>

							<DropdownMenuItem
								onClick={() => setIsConfirmOpen(true)}
								className='flex items-center gap-2 cursor-pointer'
							>
								<MdDelete className='w-4 h-4' />
								{t('watchComments.delete')}
							</DropdownMenuItem>
						</>
					)}
					{canReport && (
						<DropdownMenuItem
							onClick={() => setIsReportOpen(true)}
							className='flex items-center gap-2 cursor-pointer'
						>
							<TbMessageReportFilled className='w-4 h-4' />
							{t('watchMoreMenu.report')}
						</DropdownMenuItem>
					)}
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
				<AlertDialogContent className='bg-neutral-900 border border-neutral-700 rounded-xl'>
					<AlertDialogHeader>
						<AlertDialogTitle className='text-neutral-100'>
							{t('watchComments.deleteCommentTitle')}
						</AlertDialogTitle>
						<AlertDialogDescription className='text-neutral-400'>
							{t('watchComments.deleteCommentDescription')}
						</AlertDialogDescription>
					</AlertDialogHeader>

					<AlertDialogFooter>
						<AlertDialogCancel
							onClick={() => setIsConfirmOpen(false)}
							className='bg-neutral-700 text-neutral-200 hover:bg-neutral-600'
						>
							{t('watchComments.cancel')}
						</AlertDialogCancel>

						<AlertDialogAction
							onClick={() => handleDelete()}
							className='bg-primary text-white'
						>
							{t('watchComments.delete')}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			<WatchReportCommentModal
				open={isReportOpen}
				onOpenChange={setIsReportOpen}
				commentId={comment.id}
			/>
		</>
	)
}

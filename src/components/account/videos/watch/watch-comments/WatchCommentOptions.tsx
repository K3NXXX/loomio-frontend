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
import { Dispatch, SetStateAction, useState } from 'react'
import { MdDelete, MdEdit } from 'react-icons/md'
import { TbDotsVertical, TbMessageReportFilled } from 'react-icons/tb'

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
	const { userData } = useGetMe()
	const { deleteComment } = useDeleteComment(videoId)

	const [isConfirmOpen, setIsConfirmOpen] = useState(false)

	const handleDelete = () => {
		setIsConfirmOpen(false)

		setTimeout(() => {
			deleteComment(comment.id)
		}, 50)
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
					{userData?.id === comment.user.id && (
						<>
							<DropdownMenuItem
								onClick={() => setIsCommentEditing(true)}
								className='flex items-center gap-2 text-neutral-400 hover:text-primary transition-colors'
							>
								<MdEdit className='w-4 h-4' />
								Edit
							</DropdownMenuItem>

							<DropdownMenuItem
								onClick={() => setIsConfirmOpen(true)}
								className='flex items-center gap-2 text-neutral-400 hover:text-primary transition-colors'
							>
								<MdDelete className='w-4 h-4' />
								Delete
							</DropdownMenuItem>
						</>
					)}

					<DropdownMenuItem className='flex items-center gap-2 text-neutral-400 hover:text-primary transition-colors'>
						<TbMessageReportFilled className='w-4 h-4' />
						Report
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
				<AlertDialogContent className='bg-neutral-900 border border-neutral-700 rounded-xl'>
					<AlertDialogHeader>
						<AlertDialogTitle className='text-neutral-100'>
							Delete comment?
						</AlertDialogTitle>
						<AlertDialogDescription className='text-neutral-400'>
							This action cannot be undone. The comment will be permanently
							deleted.
						</AlertDialogDescription>
					</AlertDialogHeader>

					<AlertDialogFooter>
						<AlertDialogCancel
							onClick={() => setIsConfirmOpen(false)}
							className='bg-neutral-700 text-neutral-200 hover:bg-neutral-600'
						>
							Cancel
						</AlertDialogCancel>

						<AlertDialogAction
							onClick={() => handleDelete()}
							className='bg-primary text-white'
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}

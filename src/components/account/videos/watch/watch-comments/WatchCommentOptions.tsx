import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useGetMe } from '@/hooks/auth/useGetMe'
import { useDeleteComment } from '@/hooks/comment/useDeleteComment'
import type { IVideoComment } from '@/types/comment.types'
import type { Dispatch, SetStateAction } from 'react'
import { MdDelete, MdEdit } from 'react-icons/md'
import { TbDotsVertical, TbMessageReportFilled } from 'react-icons/tb'

interface IWatchCommentOptions {
	comment: IVideoComment
	setIsCommentEditing: Dispatch<SetStateAction<boolean>>
}

export function WatchCommentOptions({
	comment,
	setIsCommentEditing,
}: IWatchCommentOptions) {
	const { userData } = useGetMe()
	const { deleteComment } = useDeleteComment()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div className='p-1 rounded-md cursor-pointer transition-colors hover:text-primary'>
					<TbDotsVertical className='w-5 h-5' />
				</div>
			</DropdownMenuTrigger>

			<DropdownMenuContent side='right'>
				{userData?.id === comment.user.id && (
					<div>
						<DropdownMenuItem
							onClick={() => setIsCommentEditing(true)}
							className='flex items-center gap-2 text-neutral-400 hover:text-primary transition-colors'
						>
							<MdEdit className='w-4 h-4' />
							Edit
						</DropdownMenuItem>

						<DropdownMenuItem
							onClick={() => deleteComment(comment.id)}
							className='flex items-center gap-2 text-neutral-400 hover:text-primary transition-colors'
						>
							<MdDelete className='w-4 h-4' />
							Delete
						</DropdownMenuItem>
					</div>
				)}
				<DropdownMenuItem className='flex items-center gap-2 text-neutral-400 hover:text-primary transition-colors'>
					<TbMessageReportFilled className='w-4 h-4' />
					Report
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

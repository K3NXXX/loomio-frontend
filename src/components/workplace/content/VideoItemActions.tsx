import { Button } from '@/components/ui/button'
import { useDeleteVideo } from '@/hooks/videos/useDeleteVideo'
import { FaEllipsisV } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'

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
import { useState } from 'react'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../../ui/dropdown-menu'

interface IVideoItemActionsProps {
	videoId: string
}

export function VideoItemActions({ videoId }: IVideoItemActionsProps) {
	const { deleteVideo } = useDeleteVideo()
	const [isConfirmOpen, setIsConfirmOpen] = useState(false)

	const handleDelete = () => {
		setIsConfirmOpen(false)

		setTimeout(() => {
			deleteVideo(videoId)
		}, 50)
	}
	return (
		<>
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button size='icon' variant='ghost' className='rounded-full'>
						<FaEllipsisV className='h-4 w-4 opacity-70' />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent side='bottom' align='end'>
					<div>
						<DropdownMenuItem
							onClick={() => setIsConfirmOpen(true)}
							className='flex items-center gap-2 text-neutral-400 hover:text-primary transition-colors'
						>
							<MdDelete className='w-4 h-4' />
							Delete
						</DropdownMenuItem>
					</div>
				</DropdownMenuContent>
			</DropdownMenu>
			<AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
				<AlertDialogContent className='bg-neutral-900 border border-neutral-700 rounded-xl'>
					<AlertDialogHeader>
						<AlertDialogTitle className='text-neutral-100'>
							Delete video?
						</AlertDialogTitle>
						<AlertDialogDescription className='text-neutral-400'>
							This action cannot be undone. The video will be permanently
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

import { Button } from '@/components/ui/button'
import { useDeleteVideo } from '@/hooks/videos/useDeleteVideo'
import { FaEllipsisV } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
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
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size='icon' variant='ghost' className='rounded-full'>
					<FaEllipsisV className='h-4 w-4 opacity-70' />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent side='bottom' align='end'>
				<div>
					<DropdownMenuItem
						onClick={() => deleteVideo(videoId)}
						className='flex items-center gap-2 text-neutral-400 hover:text-primary transition-colors'
					>
						<MdDelete className='w-4 h-4' />
						Delete
					</DropdownMenuItem>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

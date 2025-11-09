'use client'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PAGES } from '@/constants/pages.constants'
import { useDeletePlaylist } from '@/hooks/playlists/useDeletePlaylist'
import type { IPlaylist } from '@/types/playlist.types'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { MdDelete, MdEdit } from 'react-icons/md'
import { TbDotsVertical } from 'react-icons/tb'
import { EditPlaylistModal } from './EditPlaylistModal'

interface IPlaylistActionsDropdownProps {
	playlistId: string
	initialData: IPlaylist
	isPlaylistPage?: boolean
}

export function PlaylistActionsDropdown({
	playlistId,
	initialData,
	isPlaylistPage,
}: IPlaylistActionsDropdownProps) {
	const [isEditPlaylistFormOpened, setIsEditPlaylistFormOpened] =
		useState(false)

	const { deletePlaylist } = useDeletePlaylist()
	const router = useRouter()

	const handleDeletePlaylist = () => {
		deletePlaylist(playlistId)
		if (isPlaylistPage) {
			router.replace(PAGES.PLAYLISTS)
		}
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div
					onClickCapture={(e) => e.stopPropagation()}
					className='p-1 rounded-md cursor-pointer transition-colors hover:text-primary'
				>
					<TbDotsVertical className='w-5 h-5' />
				</div>
			</DropdownMenuTrigger>

			<DropdownMenuContent side='right' className='min-w-[120px]'>
				<DropdownMenuItem
					onClick={(e) => {
						e.stopPropagation()
						setIsEditPlaylistFormOpened(true)
					}}
					className='flex items-center gap-2 text-neutral-400 hover:text-primary transition-colors'
				>
					<MdEdit className='w-4 h-4' />
					Edit
				</DropdownMenuItem>

				<DropdownMenuItem
					onClick={(e) => {
						e.stopPropagation()
						handleDeletePlaylist()
					}}
					className='flex items-center gap-2 text-neutral-400 hover:text-primary transition-colors'
				>
					<MdDelete className='w-4 h-4' />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>

			{isEditPlaylistFormOpened && (
				<EditPlaylistModal
					open={isEditPlaylistFormOpened}
					onOpenChange={setIsEditPlaylistFormOpened}
					initialData={initialData}
				/>
			)}
		</DropdownMenu>
	)
}

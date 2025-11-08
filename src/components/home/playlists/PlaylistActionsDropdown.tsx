'use client'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDeletePlaylist } from '@/hooks/playlists/useDeletePlaylist'
import type { IPlaylist } from '@/types/playlist.types'
import { useState } from 'react'
import { MdDelete, MdEdit } from 'react-icons/md'
import { TbDotsVertical } from 'react-icons/tb'
import { EditPlaylistModal } from './EditPlaylistModal'

interface IPlaylistActionsDropdownProps {
	playlistId: string
	initialData: IPlaylist
}

export function PlaylistActionsDropdown({
	playlistId,
	initialData,
}: IPlaylistActionsDropdownProps) {
	const [isEditPlaylistFormOpened, setIsEditPlaylistFormOpened] =
		useState(false)

	const { deletePlaylist } = useDeletePlaylist()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div className='p-1 rounded-md cursor-pointer transition-colors hover:text-primary'>
					<TbDotsVertical className='w-5 h-5' />
				</div>
			</DropdownMenuTrigger>

			<DropdownMenuContent side='right' className='min-w-[120px]'>
				<DropdownMenuItem
					onClick={() => setIsEditPlaylistFormOpened(true)}
					className='flex items-center gap-2 text-neutral-400 hover:text-primary transition-colors'
				>
					<MdEdit className='w-4 h-4' />
					Edit
				</DropdownMenuItem>

				<DropdownMenuItem
					onClick={() => deletePlaylist(playlistId)}
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

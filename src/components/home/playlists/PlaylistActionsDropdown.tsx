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
import { useTranslations } from 'next-intl'
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
	const t = useTranslations()
	const [isEditPlaylistFormOpened, setIsEditPlaylistFormOpened] =
		useState(false)
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const { deletePlaylist } = useDeletePlaylist()
	const router = useRouter()

	const handleDeletePlaylist = () => {
		setIsDropdownOpen(false)
		deletePlaylist(playlistId)
		if (isPlaylistPage) router.replace(PAGES.PLAYLISTS)
	}

	const handleOpenEditModal = () => {
		setIsDropdownOpen(false)
		setIsEditPlaylistFormOpened(true)
	}

	return (
		<>
			<DropdownMenu
				modal={false}
				open={isDropdownOpen}
				onOpenChange={setIsDropdownOpen}
			>
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
							handleOpenEditModal()
						}}
						onSelect={(e) => {
							e.preventDefault()
						}}
						className='flex items-center gap-2 text-neutral-400 hover:text-primary transition-colors cursor-pointer'
					>
						<MdEdit className='w-4 h-4' />
						{t('playlists.edit')}
					</DropdownMenuItem>

					<DropdownMenuItem
						onClick={(e) => {
							e.stopPropagation()
							handleDeletePlaylist()
						}}
						onSelect={(e) => {
							e.preventDefault()
						}}
						className='flex items-center gap-2 text-neutral-400 hover:text-primary transition-colors cursor-pointer'
					>
						<MdDelete className='w-4 h-4 ' />
						{t('playlists.delete')}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<EditPlaylistModal
				open={isEditPlaylistFormOpened}
				onOpenChange={setIsEditPlaylistFormOpened}
				initialData={initialData}
			/>
		</>
	)
}

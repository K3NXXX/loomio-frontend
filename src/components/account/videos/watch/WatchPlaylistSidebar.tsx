'use client'

import { formatDate } from '@/utils/formatDate'
import { useGetPublicPlaylist } from '@/hooks/playlists/useGetPublicPlaylist'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ChevronDown, ChevronUp, ListVideo, Play } from 'lucide-react'
import { useState } from 'react'

interface Props {
	videoId: string
	playlistId: string
}

export function WatchPlaylistSidebar({ videoId, playlistId }: Props) {
	const t = useTranslations()
	const { playlist } = useGetPublicPlaylist(playlistId)
	const [isCollapsed, setIsCollapsed] = useState(false)

	if (!playlist) return null

	const videos = [...playlist.videos].reverse()
	const activeIndex = videos.findIndex((v) => v.id === videoId)

	return (
		<div className='flex flex-col gap-1'>
			{/* хедер */}
			<div
				onClick={() => setIsCollapsed((prev) => !prev)}
				className='flex items-center gap-2 px-1 py-1.5 cursor-pointer group'
			>
				<div className='flex items-center gap-2 flex-1 min-w-0'>
					<ListVideo className='w-4 h-4 text-muted-foreground shrink-0' />
					<p className='font-semibold text-sm line-clamp-1'>{playlist.name}</p>
				</div>
				<div className='flex items-center gap-2 shrink-0'>
					<span className='text-xs text-muted-foreground'>
						{activeIndex + 1}/{videos.length}
					</span>
					{isCollapsed ? (
						<ChevronDown className='w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors' />
					) : (
						<ChevronUp className='w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors' />
					)}
				</div>
			</div>

			{!isCollapsed && (
				<>
					{videos.map((vid, index) => {
						const isActive = vid.id === videoId
						return (
							<Link
								key={vid.id}
								href={`/watch?v=${vid.id}&playlist=${playlistId}`}
								className={`flex gap-3 rounded-lg p-2 transition-colors group ${
									isActive
										? 'bg-primary/10 border border-primary/20'
										: 'hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 border border-transparent'
								}`}
							>
								<div className='relative min-w-[120px] max-w-[120px] aspect-video rounded-md overflow-hidden bg-black shrink-0'>
									<img
										src={vid.thumbnailFile}
										alt={vid.title}
										className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
									/>
									{isActive ? (
										<div className='absolute inset-0 bg-black/40 flex items-center justify-center'>
											<Play className='w-4 h-4 text-white fill-white' />
										</div>
									) : (
										<span className='absolute bottom-1 left-1 text-white text-xs bg-black/60 px-1.5 py-0.5 rounded font-medium'>
											{index + 1}
										</span>
									)}
								</div>
								<div className='flex flex-col justify-center overflow-hidden'>
									<p
										className={`font-semibold text-sm line-clamp-2 leading-snug transition-colors ${
											isActive ? 'text-primary' : 'group-hover:text-primary'
										}`}
									>
										{vid.title}
									</p>
									<p className='text-xs text-muted-foreground mt-1'>
										{formatDate(vid.createdAt)}
									</p>
								</div>
							</Link>
						)
					})}
					<div className='border-t border-border/40 mt-2' />
				</>
			)}
		</div>
	)
}

'use client'

import { WatchVideoMoreMenu } from '@/components/account/videos/watch/WatchVideoMoreMenu'
import { SearchVideoSkeletonList } from '@/components/skeletons/search/SearchVideoSkeletonList'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PAGES } from '@/constants/pages.constants'
import { useGetSearchData } from '@/hooks/search/useGetSearchData'
import { formatDate } from '@/utils/formatDate'
import { getInitials } from '@/utils/get-initials'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'

interface SearchProps {
	query: string
}

export function Search({ query }: SearchProps) {
	const { videos, channels, isLoading, isError } = useGetSearchData(query)
	const t = useTranslations()


	if (!query.trim())
		return (
			<p className='text-center mt-10 text-muted-foreground'>
				Type something...
			</p>
		)

	if (isLoading) return <SearchVideoSkeletonList />

	if (isError)
		return (
			<p className='text-center mt-10 text-destructive'>
				Error loading results.
			</p>
		)

	return (
		<div className='max-w-6xl mx-auto px-4 py-6'>
			<div className='space-y-10'>
				{channels.length > 0 && (
					<section>
						<div className='space-y-4'>
							{channels.map((c) => (
								<Link
									key={c.id}
									href={PAGES.CHANNEL(c.username)}
									className='flex items-center justify-between gap-6 p-5 rounded-2xl border border-border/40 bg-muted/10 hover:bg-muted/20 hover:shadow-md transition-all'
								>
									<div className='flex items-center gap-5'>
										<Avatar className='h-[96px] w-[96px] transition-transform duration-300 group-hover:scale-105 shadow-sm'>
											{c?.avatarUrl ? (
												<AvatarImage src={c.avatarUrl} alt='user avatar' />
											) : (
												<AvatarFallback className='text-lg font-semibold'>
													{getInitials(c?.username)}
												</AvatarFallback>
											)}
										</Avatar>

										<div className='flex flex-col'>
											<p className='font-semibold text-2xl leading-tight truncate'>
												{c.name}
											</p>
											<div className='flex items-center gap-1 mb-1'>
												<p className='text-sm font-semibold text-white'>
													@{c.username}
												</p>
												<span>•</span>
												<p className='text-sm text-white font-semibold'>
													{c._count?.followers?.toLocaleString() ?? 0}{' '}
													subscribers
												</p>
											</div>

											{c.description && (
												<p className='text-sm text-muted-foreground line-clamp-2 leading-snug mb-1'>
													{c.description}
												</p>
											)}
										</div>
									</div>
								</Link>
							))}
						</div>
					</section>
				)}
				{videos.length > 0 && (
					<section>
						<div className='space-y-5'>
							{videos.map((v) => (
								<div
									key={v.id}
									className='flex gap-5 rounded-xl p-3 items-start hover:bg-muted/20 transition-colors'
								>
									<Link href={PAGES.WATCH(v.id)} className='flex gap-5 flex-1'>
										<div className='relative flex-shrink-0'>
											<Image
												src={v.thumbnailFile}
												alt={v.title}
												unoptimized
												width={480}
												height={270}
												className='object-cover rounded-xl border border-border/40 w-[480px] h-[270px]'
											/>
										</div>

										<div className='flex flex-1 justify-between gap-3 items-start'>
											<div className='flex flex-col justify-between'>
												<h3 className='font-semibold text-lg line-clamp-2'>
													{v.title}
												</h3>

												<div className='flex items-center gap-2 mt-2'>
													<Image
														src={v.channel?.avatarUrl || '/default-avatar.png'}
														alt={v.channel?.name}
														width={28}
														height={28}
														unoptimized
														className='rounded-full object-cover border border-border/30'
													/>
													<p className='text-sm text-muted-foreground'>
														{v.channel?.name}
													</p>
												</div>

												<div className='text-sm text-muted-foreground mt-3 flex items-center gap-2'>
													<span>
														{t('videoItem.viewsCount', {
															count: v?._count.views,
														})}
													</span>
													<span>•</span>
													<span>{formatDate(v.createdAt)}</span>
												</div>
											</div>
										</div>
									</Link>

									<div onClick={(e) => e.stopPropagation()}>
										<WatchVideoMoreMenu
											videoId={v.id}
											videoAuthorId={v.channel.userId}
										/>
									</div>
								</div>
							))}
						</div>
					</section>
				)}

				{!videos.length && !channels.length && (
					<p className='text-center text-muted-foreground'>No results found.</p>
				)}
			</div>
		</div>
	)
}

'use client'

import { FollowingsSkeleton } from '@/components/skeletons/followings/FollowingsSkeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { PAGES } from '@/constants/pages.constants'
import { useGetFollowedChannels } from '@/hooks/user/useGetFollowedChannels'
import { cn } from '@/lib/utils'
import { getInitials } from '@/utils/get-initials'
import type { IFollowedChannel } from '@/types/channel.types'
import { motion } from 'framer-motion'
import { ChevronRight, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useMemo, useState } from 'react'

function matchesChannelQuery(
	channel: {
		name: string
		username: string
		description: string | null
	},
	q: string,
) {
	if (!q) return true
	const name = channel.name.toLowerCase()
	const user = channel.username.toLowerCase()
	const desc = (channel.description ?? '').toLowerCase()
	return name.includes(q) || user.includes(q) || desc.includes(q)
}

function FollowingChannelRow({
	channel,
	index,
}: {
	channel: IFollowedChannel
	index: number
}) {
	const t = useTranslations()

	return (
		<motion.li
			initial={{ opacity: 0, x: -8 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{
				duration: 0.22,
				delay: Math.min(index * 0.035, 0.28),
			}}
		>
			<Link
				href={PAGES.CHANNEL(channel.username)}
				className={cn(
					'group flex items-stretch gap-4 rounded-2xl border border-border bg-card p-4 pr-3',
					'shadow-sm transition-all duration-200',
					'hover:border-primary/30 hover:bg-muted/40 hover:shadow-md',
					'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
				)}
			>
				<Avatar className='size-16 shrink-0 border border-border shadow-sm sm:size-[4.5rem]'>
					<AvatarImage src={channel.avatarUrl ?? undefined} alt='' />
					<AvatarFallback className='text-base font-semibold'>
						{getInitials(channel.username)}
					</AvatarFallback>
				</Avatar>

				<div className='flex min-w-0 flex-1 flex-col justify-center gap-1'>
					<div className='flex items-start justify-between gap-3'>
						<div className='min-w-0'>
							<h2 className='truncate text-base font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-lg'>
								{channel.name}
							</h2>
							<p className='truncate text-sm text-muted-foreground'>
								@{channel.username}
							</p>
						</div>
						<ChevronRight
							className='mt-1 size-5 shrink-0 text-muted-foreground/60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary/80'
							aria-hidden
						/>
					</div>

					<p className='text-xs text-muted-foreground sm:text-[0.8125rem]'>
						<span className='tabular-nums'>
							{t('channelPage.followersCount', {
								count: channel._count?.followers ?? 0,
							})}
						</span>
						<span className='mx-2 text-border'>·</span>
						<span className='tabular-nums'>
							{t('channelPage.videosCount', {
								count: channel._count?.videos ?? 0,
							})}
						</span>
					</p>

					{channel.description ? (
						<p className='line-clamp-2 pt-1 text-sm leading-relaxed text-muted-foreground'>
							{channel.description}
						</p>
					) : null}
				</div>
			</Link>
		</motion.li>
	)
}

export function Followings() {
	const t = useTranslations()
	const { followedChannels, isLoading } = useGetFollowedChannels()
	const [search, setSearch] = useState('')

	const filteredChannels = useMemo(() => {
		if (!followedChannels?.length) return []
		const q = search.trim().toLowerCase()
		return followedChannels.filter((ch) => matchesChannelQuery(ch, q))
	}, [followedChannels, search])

	const total = followedChannels?.length ?? 0
	const hasList = total > 0
	const trimmedSearch = search.trim()
	const isFilteredEmpty = hasList && trimmedSearch !== '' && filteredChannels.length === 0

	return (
		<div className='px-4 py-10'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className='mx-auto max-w-3xl'
			>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.4 }}
					className='relative mb-8 overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md'
				>
					<div className='absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-primary via-primary/55 to-transparent' />

					<div className='flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between'>
						<div>
							<h1 className='text-3xl font-bold tracking-tight'>
								{t('followings.title')}
							</h1>
							<p className='mt-1 max-w-xl text-muted-foreground'>
								{t('followings.description')}
							</p>
						</div>
						{hasList && !isLoading && (
							<div className='relative w-full shrink-0 md:max-w-sm'>
								<Search
									className='pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground'
									aria-hidden
								/>
								<Input
									type='search'
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									placeholder={t('followings.searchPlaceholder')}
									className='h-11 rounded-xl border-border bg-background/80 pl-9'
									autoComplete='off'
									aria-label={t('followings.searchPlaceholder')}
								/>
							</div>
						)}
					</div>
				</motion.div>

				{isLoading ? (
					<FollowingsSkeleton />
				) : !hasList ? (
					<p className='mt-10 text-center text-muted-foreground'>
						{t('followings.emptyState')}
					</p>
				) : (
					<>
						<p className='mb-4 text-sm text-muted-foreground'>
							{trimmedSearch === ''
								? t('followings.channelsCount', { count: total })
								: t('followings.showingFiltered', {
										filtered: filteredChannels.length,
										total,
									})}
						</p>

						{isFilteredEmpty ? (
							<div
								className='rounded-xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center text-muted-foreground'
								role='status'
							>
								{t('followings.noResults')}
							</div>
						) : (
							<ul className='flex flex-col gap-3'>
								{filteredChannels.map((channel, index) => (
									<FollowingChannelRow
										key={channel.id}
										channel={channel}
										index={index}
									/>
								))}
							</ul>
						)}
					</>
				)}
			</motion.div>
		</div>
	)
}

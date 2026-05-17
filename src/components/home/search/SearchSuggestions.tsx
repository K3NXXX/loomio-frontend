'use client'

import { useGetSearchSuggestions } from '@/hooks/search/useSearchSuggestions'
import type { ISearchSuggestion } from '@/types/search.types'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { Hash, UserRound, Video } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface SearchSuggestionsProps {
	query: string
	onSelect: (label: string) => void
}

function suggestionSearchQuery(s: ISearchSuggestion): string {
	if (s.type === 'tag') return `#${s.label}`
	return s.label
}

function SuggestionTypeIcon({ type }: { type: ISearchSuggestion['type'] }) {
	const wrap =
		'flex size-11 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/50 text-muted-foreground shadow-sm'

	if (type === 'channel') {
		return (
			<div
				className={cn(
					wrap,
					'group-hover:border-primary/35 group-hover:bg-primary/8 group-hover:text-primary',
				)}
			>
				<UserRound className='size-[18px]' aria-hidden />
			</div>
		)
	}
	if (type === 'tag') {
		return (
			<div
				className={cn(
					wrap,
					'group-hover:border-primary/35 group-hover:bg-primary/8 group-hover:text-primary',
				)}
			>
				<Hash className='size-[18px]' aria-hidden />
			</div>
		)
	}
	return (
		<div
			className={cn(
				wrap,
				'group-hover:border-primary/35 group-hover:bg-primary/8 group-hover:text-primary',
			)}
		>
			<Video className='size-[18px]' aria-hidden />
		</div>
	)
}

function SuggestionThumb({ s }: { s: ISearchSuggestion }) {
	const border = 'border border-border/60 shadow-sm'

	if (s.type === 'video') {
		const src = s.imageUrl?.trim()
		if (src) {
			return (
				<img
					src={src}
					alt=''
					decoding='async'
					className={cn(
						border,
						'h-11 w-[4.85rem] shrink-0 rounded-lg object-cover bg-muted',
					)}
				/>
			)
		}
		return <SuggestionTypeIcon type='video' />
	}

	if (s.type === 'channel') {
		const src = s.imageUrl?.trim() || '/default-avatar.png'
		return (
			<img
				src={src}
				alt=''
				decoding='async'
				className={cn(
					border,
					'size-11 shrink-0 rounded-full object-cover bg-muted',
				)}
			/>
		)
	}

	return <SuggestionTypeIcon type='tag' />
}

export function SearchSuggestions({ query, onSelect }: SearchSuggestionsProps) {
	const t = useTranslations('header.searchSuggestions')
	const { searchSuggestions, isLoading } = useGetSearchSuggestions(query)

	if (!query.trim()) return null

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0, y: -8, scale: 0.98 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				exit={{ opacity: 0, y: -8, scale: 0.98 }}
				transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
				className={cn(
					'absolute top-full left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl',
					'border border-border/80 bg-popover/95 text-popover-foreground shadow-xl shadow-black/10',
					'backdrop-blur-xl dark:shadow-black/40',
					'ring-1 ring-black/[0.03] dark:ring-white/[0.06]',
				)}
			>
				{isLoading ? (
					<div className='space-y-0 p-2'>
						{Array.from({ length: 4 }).map((_, i) => (
							<div
								key={i}
								className='flex items-center gap-3 rounded-xl px-2 py-2.5'
							>
								<div className='size-11 shrink-0 animate-pulse rounded-lg bg-muted/80' />
								<div className='flex flex-1 flex-col gap-2 pr-2'>
									<div
										className='h-3.5 animate-pulse rounded-md bg-muted/80'
										style={{ width: `${72 + i * 8}%` }}
									/>
									<div className='h-2.5 w-16 animate-pulse rounded-md bg-muted/60' />
								</div>
							</div>
						))}
					</div>
				) : searchSuggestions?.length ? (
					<ul className='max-h-[min(320px,50vh)] overflow-y-auto p-1.5 [scrollbar-gutter:stable]'>
						{searchSuggestions.map((s) => (
							<li key={`${s.type}-${s.id}`}>
								<button
									type='button'
									onClick={() => onSelect(suggestionSearchQuery(s))}
									className={cn(
										'group flex w-full cursor-pointer items-center gap-3 rounded-xl px-2 py-2.5 text-left',
										'transition-colors duration-150',
										'hover:bg-primary/10 focus-visible:bg-primary/10',
										'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
									)}
								>
									<SuggestionThumb s={s} />
									<div className='min-w-0 flex-1'>
										<p className='truncate text-sm font-medium text-foreground group-hover:text-primary'>
											{s.type === 'tag' ? `#${s.label}` : s.label}
										</p>
										<p className='mt-0.5 text-[11px] font-medium text-muted-foreground'>
											{s.type === 'channel'
												? t('kindChannel')
												: s.type === 'tag'
													? t('kindTag')
													: t('kindVideo')}
										</p>
									</div>
								</button>
							</li>
						))}
					</ul>
				) : (
					<div className='flex flex-col items-center justify-center gap-1 px-4 py-8 text-center'>
						<div className='flex size-10 items-center justify-center rounded-full bg-muted/60 text-muted-foreground'>
							<Hash className='size-4 opacity-50' />
						</div>
						<p className='text-sm text-muted-foreground'>{t('empty')}</p>
					</div>
				)}
			</motion.div>
		</AnimatePresence>
	)
}

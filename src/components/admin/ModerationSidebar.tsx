'use client'

import type { ComponentType } from 'react'

import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { PAGES } from '@/constants/pages.constants'
import type { IGetUserData } from '@/types/auth.types'
import { getInitials } from '@/utils/get-initials'
import { truncateName } from '@/utils/truncateName'

import { FaFlag } from 'react-icons/fa'
import {
	MdDashboard,
	MdHistory,
	MdOutlineRateReview,
	MdOutlineVideoLibrary,
} from 'react-icons/md'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

export function ModerationSidebar({ user }: { user: IGetUserData }) {
	const pathname = usePathname()
	const t = useTranslations('moderation.sidebar')
	const tCommon = useTranslations('moderation.common')

	const dashboardItem = [
		{
			label: t('dashboard'),
			icon: MdDashboard,
			href: PAGES.MODERATION_DASHBOARD,
		},
	]

	const reportItems = [
		{
			label: t('reportsVideos'),
			icon: MdOutlineVideoLibrary,
			href: PAGES.MODERATION_VIDEO_REPORTS,
		},
		{
			label: t('reportsComments'),
			icon: FaFlag,
			href: PAGES.MODERATION_COMMENT_REPORTS,
		},
		{
			label: t('reportsReviews'),
			icon: MdOutlineRateReview,
			href: PAGES.MODERATION_VIDEO_REVIEWS,
		},
	]

	const historyItems = [
		{
			label: t('videoHistory'),
			icon: MdHistory,
			href: PAGES.MODERATION_VIDEO_HISTORY,
		},
		{
			label: t('commentHistory'),
			icon: MdHistory,
			href: PAGES.MODERATION_COMMENT_HISTORY,
		},
	]

	const renderItem = ({
		label,
		icon: Icon,
		href,
	}: {
		label: string
		icon: ComponentType<{ className?: string }>
		href: string
	}) => {
		const active = pathname === href || pathname.startsWith(href + '/')

		return (
			<Link
				key={href}
				href={href}
				className={cn(
					'group relative flex items-center gap-3 rounded-xl px-4 py-3 text-[14px] md:text-[15px] font-medium transition-all duration-200',
					'hover:bg-muted/50 hover:text-primary hover:shadow-sm',
					active
						? 'bg-primary/10 text-primary shadow-inner ring-1 ring-primary/25'
						: 'text-muted-foreground',
				)}
			>
				<span
					className={cn(
						'absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-r-md transition-all duration-300',
						active ? 'bg-primary' : 'bg-transparent group-hover:bg-primary/50',
					)}
				/>

				<Icon
					className={cn(
						'size-[18px] shrink-0 transition-transform duration-200',
						active ? 'scale-110 text-primary' : 'opacity-85 group-hover:opacity-100',
					)}
				/>

				<span className='truncate'>{label}</span>
			</Link>
		)
	}

	return (
		<aside
			className='
				w-[260px] md:w-64 shrink-0 border-r border-border/45
				bg-card/45 backdrop-blur-xl
				flex flex-col dark:shadow-[inset_-1px_0_0_0_rgba(255,255,255,0.06)]
			'
		>
			<div className='flex flex-col items-center px-4 pt-7 pb-5 border-b border-border/35'>
				<div className='relative'>
					<div className='absolute inset-0 rounded-full bg-primary/20 blur-xl scale-110 opacity-60' aria-hidden />
					<Avatar className='relative size-[92px] md:size-24 ring-2 ring-primary/35 shadow-xl'>
						<AvatarImage src={user.avatarUrl || undefined} alt={tCommon('avatarAlt')} />
						<AvatarFallback className='text-lg font-semibold bg-muted'>
							{getInitials(user.username)}
						</AvatarFallback>
					</Avatar>
				</div>

				<div className='mt-4 text-center'>
					<h2 className='font-bold text-base md:text-lg leading-tight'>
						@{truncateName(user.username, 17)}
					</h2>
					<p className='text-muted-foreground text-xs md:text-sm mt-1 font-medium'>
						{t('panelTitle')}
					</p>
				</div>
			</div>

			<nav className='flex-1 overflow-y-auto mt-2 px-3 pb-8 space-y-6'>
				<div>{dashboardItem.map(renderItem)}</div>

				<div>
					<p className='px-4 pb-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground/55 font-semibold'>
						{t('reportsSection')}
					</p>
					<div className='space-y-1'>{reportItems.map(renderItem)}</div>
				</div>

				<div>
					<p className='px-4 pb-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground/55 font-semibold'>
						{t('historySection')}
					</p>
					<div className='space-y-1'>{historyItems.map(renderItem)}</div>
				</div>
			</nav>
		</aside>
	)
}

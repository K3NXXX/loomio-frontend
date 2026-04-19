'use client'

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
		icon: any
		href: string
	}) => {
		const active = pathname === href || pathname.startsWith(href + '/')

		return (
			<Link
				key={href}
				href={href}
				className={cn(
					'group relative flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium transition-all',
					'hover:bg-muted/40 hover:text-primary',
					active
						? 'bg-muted/70 text-primary shadow-inner'
						: 'text-muted-foreground',
				)}
			>
				<span
					className={cn(
						'absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-md transition-all duration-300',
						active ? 'bg-primary' : 'bg-transparent group-hover:bg-primary/60',
					)}
				/>

				<Icon
					className={cn(
						'size-[18px] shrink-0 transition-transform',
						active ? 'scale-110 text-primary' : 'opacity-90',
					)}
				/>

				<span className='truncate'>{label}</span>
			</Link>
		)
	}

	return (
		<aside
			className='
				w-64 shrink-0 border-r border-neutral-800
				bg-[#101010]/95 backdrop-blur-xl
				flex flex-col
			'
		>
			{/* USER HEADER */}
			<div className='flex flex-col items-center px-4 pt-6 pb-4'>
				<Avatar className='size-24 ring-1 ring-border'>
					<AvatarImage src={user.avatarUrl || undefined} alt='avatar' />
					<AvatarFallback className='text-lg font-semibold'>
						{getInitials(user.username)}
					</AvatarFallback>
				</Avatar>

				<div className='mt-3 text-center'>
					<h2 className='font-bold text-lg leading-tight'>
						@{truncateName(user.username, 17)}
					</h2>
					<p className='text-muted-foreground text-sm'>Moderation Panel</p>
				</div>
			</div>

			{/* NAVIGATION */}
			<nav className='mt-4 px-3 space-y-5'>
				{/* Dashboard */}
				<div>{dashboardItem.map(renderItem)}</div>

				{/* Reports Section */}
				<div>
					<p className='px-4 pb-1 text-xs uppercase tracking-wider text-muted-foreground/60'>
						Reports
					</p>
					{reportItems.map(renderItem)}
				</div>

				{/* History Section */}
				<div>
					<p className='px-4 pb-1 text-xs uppercase tracking-wider text-muted-foreground/60'>
						History
					</p>
					{historyItems.map(renderItem)}
				</div>
			</nav>
		</aside>
	)
}

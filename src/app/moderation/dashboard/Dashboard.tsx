'use client'

import { ModerationPageShell } from '@/components/admin/ModerationPageShell'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useReportStats } from '@/hooks/report/useReportStats'
import { BarChart2, CheckCircle, Clock, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { ReactNode } from 'react'

export function Dashboard() {
	const { data: stats, isLoading } = useReportStats()
	const t = useTranslations('moderation.dashboard')
	const tCommon = useTranslations('moderation.common')
	const tReason = useTranslations('moderation.enums.reason')

	return (
		<ModerationPageShell title={t('title')} subtitle={t('subtitle')}>
			<div className='flex flex-col gap-10 md:gap-12'>
				<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5'>
					<StatCard
						icon={<BarChart2 size={18} />}
						title={t('totalReports')}
						value={stats?.total}
						loading={isLoading}
						loadingText={tCommon('loadingEllipsis')}
					/>
					<StatCard
						icon={<Clock size={18} />}
						title={t('pending')}
						value={stats?.pending}
						loading={isLoading}
						loadingText={tCommon('loadingEllipsis')}
					/>
					<StatCard
						icon={<Users size={18} />}
						title={t('inProgress')}
						value={stats?.inProgress}
						loading={isLoading}
						loadingText={tCommon('loadingEllipsis')}
					/>
					<StatCard
						icon={<CheckCircle size={18} />}
						title={t('resolved')}
						value={stats?.resolved}
						loading={isLoading}
						loadingText={tCommon('loadingEllipsis')}
					/>
				</div>

				<div className='rounded-2xl border border-border/45 bg-card/20 backdrop-blur-md p-5 md:p-7 shadow-lg ring-1 ring-white/[0.04]'>
					<SectionTitle>{t('reportsTypeBreakdown')}</SectionTitle>

					<div className='grid grid-cols-2 md:max-w-md gap-4'>
						<TypeCard title={t('videoReports')} value={stats?.videoReports} />
						<TypeCard title={t('commentReports')} value={stats?.commentReports} />
					</div>
				</div>

				<div className='flex flex-col gap-3'>
					<SectionTitle>{t('moderatorsWorkload')}</SectionTitle>

					<ListPanel>
						{isLoading && <EntityFallback text={t('loading')} />}
						{!isLoading && !stats?.moderatorsWorking?.length && (
							<EntityFallback text={t('noActiveModerators')} />
						)}

						{stats?.moderatorsWorking?.map((m) => (
							<ModeratorItem
								key={m.user.id}
								name={m.user.username}
								avatar={m.user.avatarUrl}
								count={m.count}
								t={t}
								avatarAlt={tCommon('avatarAlt')}
							/>
						))}
					</ListPanel>
				</div>

				<div className='flex flex-col gap-3'>
					<SectionTitle>{t('activeReviewQueue')}</SectionTitle>

					<ListPanel>
						{isLoading && <EntityFallback text={t('loadingQueue')} />}
						{!isLoading && !stats?.activeAssignments?.length && (
							<EntityFallback text={t('noActiveReports')} />
						)}

						{stats?.activeAssignments?.map((r) => (
							<ListItem
								key={r.id}
								label={tReason(r.reason)}
								value={r.assignedTo?.username ?? '—'}
								sub={r.videoId ? t('videoReport') : t('commentReport')}
							/>
						))}
					</ListPanel>
				</div>
			</div>
		</ModerationPageShell>
	)
}

const ModeratorItem = ({ name, avatar, count, t, avatarAlt }: any) => (
	<div className='p-4 flex items-center justify-between transition-colors hover:bg-muted/15 border-b border-border/25 last:border-b-0'>
		<div className='flex items-center gap-3'>
			<Avatar className='size-8'>
				<AvatarImage src={avatar ?? undefined} alt={avatarAlt} />
				<AvatarFallback>{name?.[0]}</AvatarFallback>
			</Avatar>

			<div className='flex flex-col'>
				<p className='font-medium text-sm'>@{name}</p>
			</div>
		</div>

		<p className='text-sm font-semibold opacity-90'>
			{t('reportsCount', { count })}
		</p>
	</div>
)

const StatCard = ({
	icon,
	title,
	value,
	loading,
	loadingText,
}: {
	icon: ReactNode
	title: string
	value?: number
	loading?: boolean
	loadingText: string
}) => (
	<div className='group rounded-2xl border border-border/45 bg-gradient-to-br from-card/80 via-card/50 to-card/30 backdrop-blur-md p-4 md:p-5 shadow-md ring-1 ring-white/[0.04] transition-all hover:border-primary/25 hover:shadow-lg'>
		<div className='flex items-center gap-3 text-muted-foreground text-[13px]'>
			<span className='flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner'>
				{icon}
			</span>
			<span className='font-medium text-foreground/85'>{title}</span>
		</div>
		<p className='mt-3 text-[26px] font-semibold tracking-tight tabular-nums'>
			{loading ? loadingText : (value ?? 0)}
		</p>
	</div>
)

const TypeCard = ({ title, value }: any) => (
	<div className='rounded-xl border border-border/40 bg-muted/15 hover:bg-muted/25 hover:border-primary/20 transition-all p-4 shadow-sm'>
		<p className='text-sm text-muted-foreground'>{title}</p>
		<p className='text-xl font-semibold mt-1'>{value ?? 0}</p>
	</div>
)

const ListPanel = ({ children }: any) => (
	<div className='rounded-2xl border border-border/45 divide-y divide-border/35 overflow-hidden shadow-lg bg-card/35 backdrop-blur-md ring-1 ring-white/[0.04]'>
		{children}
	</div>
)

const ListItem = ({ label, value, sub }: any) => (
	<div className='p-4 flex items-center justify-between gap-4 transition-colors hover:bg-muted/15'>
		<div>
			<p className='font-medium text-sm'>{label}</p>
			{sub && <p className='text-[11px] text-muted-foreground'>{sub}</p>}
		</div>
		<p className='text-sm font-semibold opacity-90 shrink-0'>
			{value === '—' ? value : `@${value}`}
		</p>
	</div>
)

const SectionTitle = ({ children }: any) => (
	<h2 className='font-semibold text-lg mb-4 tracking-tight text-foreground'>
		{children}
	</h2>
)

const EntityFallback = ({ text }: any) => (
	<p className='text-muted-foreground text-sm p-4 text-center'>{text}</p>
)

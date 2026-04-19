'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useReportStats } from '@/hooks/report/useReportStats'
import { BarChart2, CheckCircle, Clock, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function Dashboard() {
	const { data: stats, isLoading } = useReportStats()
	const t = useTranslations('moderation.dashboard')

	return (
		<div className='p-10 flex flex-col gap-12'>
			{/* HEADER */}
			<div>
				<h1 className='text-[26px] font-semibold tracking-tight'>
					{t('title')}
				</h1>
				<p className='text-muted-foreground text-sm mt-1'>{t('subtitle')}</p>
			</div>

			{/* TOP STAT BLOCK */}
			<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5'>
				<StatCard
					icon={<BarChart2 size={18} />}
					title={t('totalReports')}
					value={stats?.total}
					loading={isLoading}
				/>
				<StatCard
					icon={<Clock size={18} />}
					title={t('pending')}
					value={stats?.pending}
					loading={isLoading}
				/>
				<StatCard
					icon={<Users size={18} />}
					title={t('inProgress')}
					value={stats?.inProgress}
					loading={isLoading}
				/>
				<StatCard
					icon={<CheckCircle size={18} />}
					title={t('resolved')}
					value={stats?.resolved}
					loading={isLoading}
				/>
			</div>

			{/* REPORT TYPE BREAKDOWN */}
			<div>
				<SectionTitle>{t('reportsTypeBreakdown')}</SectionTitle>

				<div className='grid grid-cols-2 md:w-[400px] gap-4'>
					<TypeCard title={t('videoReports')} value={stats?.videoReports} />
					<TypeCard title={t('commentReports')} value={stats?.commentReports} />
				</div>
			</div>

			{/* MODERATORS LOAD */}
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
							label={r.reason.replace(/_/g, ' ')}
							value={r.assignedTo?.username ?? '—'}
							sub={r.videoId ? t('videoReport') : t('commentReport')}
						/>
					))}
				</ListPanel>
			</div>
		</div>
	)
}

const ModeratorItem = ({ name, avatar, count, t }: any) => (
	<div className='p-4 flex items-center justify-between hover:bg-muted/10 transition'>
		<div className='flex items-center gap-3'>
			<Avatar className='size-8'>
				<AvatarImage src={avatar ?? ''} />
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

const StatCard = ({ icon, title, value, loading }: any) => (
	<div className='rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm p-4 shadow-sm hover:shadow-md transition flex flex-col gap-2'>
		<div className='flex items-center gap-2 text-muted-foreground text-[13px]'>
			{icon}
			{title}
		</div>
		<p className='text-[23px] font-semibold'>
			{loading ? '...' : (value ?? 0)}
		</p>
	</div>
)

const TypeCard = ({ title, value }: any) => (
	<div className='rounded-xl border border-border/40 p-4 bg-muted/10 hover:bg-muted/20 transition shadow-sm'>
		<p className='text-sm text-muted-foreground'>{title}</p>
		<p className='text-xl font-semibold mt-1'>{value ?? 0}</p>
	</div>
)

const ListPanel = ({ children }: any) => (
	<div className='rounded-xl border border-border/40 divide-y overflow-hidden shadow-sm bg-card/50 backdrop-blur-md'>
		{children}
	</div>
)

const ListItem = ({ label, value, sub }: any) => (
	<div className='p-4 flex items-center justify-between hover:bg-muted/10 transition'>
		<div>
			<p className='font-medium text-sm'>{label}</p>
			{sub && <p className='text-[11px] text-muted-foreground'>{sub}</p>}
		</div>
		<p className='text-sm font-semibold opacity-90'>@{value}</p>
	</div>
)

const SectionTitle = ({ children }: any) => (
	<h2 className='font-semibold text-[17px] mb-3'>{children}</h2>
)

const EntityFallback = ({ text }: any) => (
	<p className='text-muted-foreground text-sm p-4 text-center'>{text}</p>
)

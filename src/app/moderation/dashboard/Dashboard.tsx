'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useReportStats } from '@/hooks/report/useReportStats'
import { BarChart2, CheckCircle, Clock, Users } from 'lucide-react'

export function Dashboard() {
	const { data: stats, isLoading } = useReportStats()

	return (
		<div className='p-10 flex flex-col gap-12'>
			{/* HEADER */}
			<div>
				<h1 className='text-[26px] font-semibold tracking-tight'>
					Moderation dashboard
				</h1>
				<p className='text-muted-foreground text-sm mt-1'>
					Track report flow, workload and moderation queue in real-time.
				</p>
			</div>

			{/* TOP STAT BLOCK */}
			<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5'>
				<StatCard
					icon={<BarChart2 size={18} />}
					title='Total reports'
					value={stats?.total}
					loading={isLoading}
				/>
				<StatCard
					icon={<Clock size={18} />}
					title='Pending'
					value={stats?.pending}
					loading={isLoading}
				/>
				<StatCard
					icon={<Users size={18} />}
					title='In progress'
					value={stats?.inProgress}
					loading={isLoading}
				/>
				<StatCard
					icon={<CheckCircle size={18} />}
					title='Resolved'
					value={stats?.resolved}
					loading={isLoading}
				/>
			</div>

			{/* REPORT TYPE BREAKDOWN */}
			<div>
				<SectionTitle>Reports type breakdown</SectionTitle>

				<div className='grid grid-cols-2 md:w-[400px] gap-4'>
					<TypeCard title='Video reports' value={stats?.videoReports} />
					<TypeCard title='Comment reports' value={stats?.commentReports} />
				</div>
			</div>

			{/* MODERATORS LOAD */}
			<div className='flex flex-col gap-3'>
				<SectionTitle>Moderators workload</SectionTitle>

				<ListPanel>
					{isLoading && <EntityFallback text='Loading...' />}
					{!isLoading && !stats?.moderatorsWorking?.length && (
						<EntityFallback text='No active moderators' />
					)}

					{stats?.moderatorsWorking?.map((m) => (
						<ModeratorItem
							key={m.user.id}
							name={m.user.username}
							avatar={m.user.avatarUrl}
							count={m.count}
						/>
					))}
				</ListPanel>
			</div>

			<div className='flex flex-col gap-3'>
				<SectionTitle>Active review queue</SectionTitle>

				<ListPanel>
					{isLoading && <EntityFallback text='Loading queue...' />}
					{!isLoading && !stats?.activeAssignments?.length && (
						<EntityFallback text='No active reports' />
					)}

					{stats?.activeAssignments?.map((r) => (
						<ListItem
							key={r.id}
							label={r.reason.replace(/_/g, ' ')}
							value={r.assignedTo?.username ?? '—'}
							sub={r.videoId ? 'Video report' : 'Comment report'}
						/>
					))}
				</ListPanel>
			</div>
		</div>
	)
}


const ModeratorItem = ({ name, avatar, count, id }: any) => (
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

		<p className='text-sm font-semibold opacity-90'>{count} reports</p>
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

import { formatDate } from '@/utils/formatDate'

const recommendedVideos = [
	{
		id: '1',
		title: 'The Rise and Betrayal of Slipknot',
		thumbnail: 'https://i.ytimg.com/vi/6fVE8kSM43I/hqdefault.jpg', // Slipknot documentary thumbnail
		duration: '44:49',
		views: 165000,
		createdAt: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000), // 6 months ago
		channel: 'Rock Chronicles',
	},

	{
		id: '2',
		title: 'Quick Drum Improvisation',
		thumbnail: 'https://i.ytimg.com/vi/HQmmM_qwG4k/hqdefault.jpg', // drum solo image
		duration: '0:58',
		views: 104,
		createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000), // 9 hours ago
		channel: 'Kuba Bernat',
	},
	{
		id: '3',
		title: 'Quick Drum Improvisation',
		thumbnail: 'https://i.ytimg.com/vi/HQmmM_qwG4k/hqdefault.jpg', // drum solo image
		duration: '0:58',
		views: 104,
		createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000), // 9 hours ago
		channel: 'Kuba Bernat',
	},
	{
		id: '4',
		title: 'Quick Drum Improvisation',
		thumbnail: 'https://i.ytimg.com/vi/HQmmM_qwG4k/hqdefault.jpg', // drum solo image
		duration: '0:58',
		views: 104,
		createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000), // 9 hours ago
		channel: 'Kuba Bernat',
	},
]

export function WatchRecommendedVideos() {
	return (
		<div className='w-[25%] flex-shrink-0'>
			<div className='flex flex-col gap-4'>
				{recommendedVideos.map((vid) => (
					<a
						href={`/watch?v=${vid.id}`}
						key={vid.id}
						className='flex gap-3 group hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50 rounded-lg p-2 transition-colors'
					>
						<div className='relative min-w-[168px] max-w-[168px] aspect-video rounded-md overflow-hidden bg-black'>
							<img
								src={vid.thumbnail}
								alt={vid.title}
								className='w-full h-full object-cover'
							/>
							<span className='absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded'>
								{vid.duration}
							</span>
						</div>
						<div className='flex flex-col overflow-hidden'>
							<p className='font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors'>
								{vid.title}
							</p>
							<p className='text-xs text-neutral-500 dark:text-neutral-400 mt-1 truncate'>
								{vid.channel}
							</p>
							<p className='text-xs text-neutral-500 dark:text-neutral-400'>
								{vid.views.toLocaleString()} views • {formatDate(vid.createdAt)}
							</p>
						</div>
					</a>
				))}
			</div>
		</div>
	)
}

'use client'

import { UploadVideoModal } from '@/components/account/videos/upload/UploadVideoModal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getInitials } from '@/utils/get-initials'
import { useChannelStore } from '@/zustand/store/channelStore'
import { useVideoStore } from '@/zustand/store/videoStore'

export function Dashboard() {
	const { channel } = useChannelStore()

	const { openUploadingVideo, setOpenUploadingVideo, setUploadChannelId } =
		useVideoStore()

	const handleUploadVideo = () => {
		if (!channel) return
		setUploadChannelId(channel.id)
		setOpenUploadingVideo(true)
	}

	if (!channel) {
		return (
			<div className='p-10 text-muted-foreground text-center'>
				Loading channel data...
			</div>
		)
	}

	return (
		<div className='p-10 flex flex-col items-start'>
			<h1 className='text-[25px] font-bold mb-8 tracking-tight text-left w-full'>
				Channel management panel
			</h1>

			<div className='flex flex-col md:flex-row gap-10 w-full'>
				<div className='w-[420px] h-[320px] rounded-2xl border border-border/40 transition-all flex flex-col items-center justify-center text-center p-6 hover:shadow-md'>
					<h2 className='text-xl font-semibold mb-2'>Add videos</h2>
					<p className='text-muted-foreground text-sm mb-6 max-w-[260px]'>
						Start growing your channel by uploading your first video. You can
						track its performance here once it’s published.
					</p>
					<Button
						onClick={() => handleUploadVideo()}
						className='rounded-full px-6 py-2 text-sm font-semibold shadow-sm hover:shadow-md transition-all'
					>
						Upload Video
					</Button>
				</div>

				<div className='flex-1 min-w-[280px] max-w-[400px] rounded-2xl border border-border/40 bg-background/60 p-6 shadow-sm hover:shadow-md transition-all'>
					<div className='flex items-center gap-4 mb-6'>
						<Avatar className='size-14 ring-1 ring-border'>
							<AvatarImage
								src={channel.avatarUrl || undefined}
								alt={channel.name}
							/>
							<AvatarFallback>{getInitials(channel.name)}</AvatarFallback>
						</Avatar>
						<div>
							<h2 className='text-lg font-semibold leading-tight'>
								{channel.name}
							</h2>
							<p className='text-sm text-muted-foreground'>
								@{channel.username}
							</p>
						</div>
					</div>

					<div className='flex flex-col gap-3'>
						<div className='flex items-center justify-between px-5 py-3 rounded-lg border border-border/40 bg-muted/10'>
							<p className='text-sm text-muted-foreground tracking-wide'>
								Videos
							</p>
							<p className='text-xl font-semibold text-foreground'>
								{channel._count?.videos ?? 0}
							</p>
						</div>
						<div className='flex items-center justify-between px-5 py-3 rounded-lg border border-border/40 bg-muted/10'>
							<p className='text-sm text-muted-foreground tracking-wide'>
								Followers
							</p>
							<p className='text-xl font-semibold text-foreground'>
								{channel._count?.followers ?? 0}
							</p>
						</div>
					</div>
				</div>
			</div>
			{openUploadingVideo && (
				<UploadVideoModal
					open={openUploadingVideo}
					onOpenChange={(open) => {
						if (!open) setUploadChannelId(null)
						setOpenUploadingVideo(open)
					}}
				/>
			)}
		</div>
	)
}

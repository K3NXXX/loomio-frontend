'use client'

import { UploadVideoModal } from '@/components/account/videos/upload/UploadVideoModal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useGetChannelViews } from '@/hooks/channel/useGetChannelViews'
import { getInitials } from '@/utils/get-initials'
import { useChannelStore } from '@/zustand/store/channelStore'
import { useVideoStore } from '@/zustand/store/videoStore'
import { useTranslations } from 'next-intl'

export function Dashboard() {
	const t = useTranslations('workplaceDashboard')
	const tUpload = useTranslations('uploadVideoModal')
	const { channel } = useChannelStore()

	const { totalViews } = useGetChannelViews(channel?.username)

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
				{t('loadingChannel')}
			</div>
		)
	}

	return (
		<div className='p-4 min-[500px]:p-6 min-[980px]:p-10 flex flex-col items-start'>
			<h1 className='text-lg min-[400px]:text-xl min-[500px]:text-2xl min-[980px]:text-[25px] font-bold mb-4 min-[500px]:mb-5 min-[980px]:mb-8 tracking-tight text-left w-full'>
				{t('title')}
			</h1>

			<div className='flex flex-col min-[980px]:flex-row gap-5 min-[980px]:gap-10 w-full items-stretch'>
				<div className='w-full min-[980px]:w-[420px] min-[980px]:h-[320px] rounded-2xl border border-border/40 transition-all flex flex-col items-center justify-center text-center p-5 min-[500px]:p-6 hover:shadow-md'>
					<h2 className='text-lg min-[500px]:text-xl font-semibold mb-2'>
						{t('addVideosTitle')}
					</h2>
					<p className='text-muted-foreground text-xs min-[500px]:text-sm mb-4 min-[980px]:mb-6 max-w-[260px]'>
						{t('addVideosDescription')}
					</p>
					<Button
						onClick={() => handleUploadVideo()}
						className='rounded-full px-6 py-2 text-sm font-semibold shadow-sm hover:shadow-md transition-all'
					>
						{tUpload('title')}
					</Button>
				</div>

				<div className='w-full min-[980px]:flex-1 min-[980px]:min-w-[280px] min-[980px]:max-w-[420px] rounded-2xl border border-border/40 bg-background/60 p-4 min-[500px]:p-6 shadow-sm hover:shadow-md transition-all'>
					<div className='flex items-center gap-3 min-[500px]:gap-4 mb-4 min-[980px]:mb-6'>
						<Avatar className='size-10 min-[500px]:size-14 ring-1 ring-border shrink-0'>
							<AvatarImage
								src={channel.avatarUrl || undefined}
								alt={channel.name}
							/>
							<AvatarFallback>{getInitials(channel.username)}</AvatarFallback>
						</Avatar>
						<div>
							<h2 className='text-base min-[500px]:text-lg font-semibold leading-tight'>
								{channel.name}
							</h2>
							<p className='text-xs min-[500px]:text-sm text-muted-foreground'>
								@{channel.username}
							</p>
						</div>
					</div>

					<div className='flex flex-col gap-2 min-[500px]:gap-3'>
						<div className='flex items-center justify-between px-3 min-[500px]:px-5 py-2.5 min-[500px]:py-3 rounded-lg border border-border/40 bg-muted/10'>
							<p className='text-xs min-[500px]:text-sm text-muted-foreground tracking-wide'>
								{t('statVideos')}
							</p>
							<p className='text-lg min-[500px]:text-xl font-semibold text-foreground'>
								{channel._count?.videos ?? 0}
							</p>
						</div>
						<div className='flex items-center justify-between px-3 min-[500px]:px-5 py-2.5 min-[500px]:py-3 rounded-lg border border-border/40 bg-muted/10'>
							<p className='text-xs min-[500px]:text-sm text-muted-foreground tracking-wide'>
								{t('statFollowers')}
							</p>
							<p className='text-lg min-[500px]:text-xl font-semibold text-foreground'>
								{channel._count?.followers ?? 0}
							</p>
						</div>
						<div className='flex items-center justify-between px-3 min-[500px]:px-5 py-2.5 min-[500px]:py-3 rounded-lg border border-border/40 bg-muted/10'>
							<p className='text-xs min-[500px]:text-sm text-muted-foreground tracking-wide'>
								{t('statTotalViews')}
							</p>
							<p className='text-lg min-[500px]:text-xl font-semibold text-foreground'>
								{totalViews}
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

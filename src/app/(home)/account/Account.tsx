'use client'

import { UploadVideoModal } from '@/components/account/videos/upload/UploadVideoModal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { PAGES } from '@/constants/pages.constants'
import { useGetMe } from '@/hooks/auth/useGetMe'
import { getInitials } from '@/utils/get-initials'
import { useVideoStore } from '@/zustand/store/videoStore'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

type Video = {
	title: string
	thumbnail: string
	createdAt: string
}

export default function Account() {
	const { userData } = useGetMe()
	const { openUploadingVideo, setOpenUploadingVideo } = useVideoStore()
	const [videos, setVideos] = useState<Video[]>([
		{
			title: 'My first video',
			thumbnail: 'https://picsum.photos/seed/11/600/400',
			createdAt: '2024-05-01',
		},
		{
			title: 'Vacation Vlog',
			thumbnail: 'https://picsum.photos/seed/12/600/400',
			createdAt: '2024-06-10',
		},
	])

	return (
		<div className='min-h-screen px-4 py-10'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className='max-w-6xl mx-auto'
			>
				<div className='flex flex-col md:flex-row md:items-center gap-6 mb-10'>
					<div className='relative w-28 h-28 rounded-full overflow-hidden ring-4 ring-primary/30 shadow-lg'>
						<Avatar className='w-full h-full'>
							<AvatarImage src={userData?.avatarUrl} />
							<AvatarFallback className='text-[25px]'>
								{getInitials(userData?.name)}
							</AvatarFallback>
						</Avatar>
					</div>
					<div>
						<h1 className='text-3xl font-bold tracking-tight'>My Account</h1>
						<p className='text-muted-foreground'>{userData?.email}</p>
						<div className='flex gap-3 mt-3'>
							<Button
								onClick={() => setOpenUploadingVideo(true)}
								className='rounded-full px-5'
							>
								Add video
							</Button>
							<Link href={PAGES.EDIT_ACCOUNT}>
								<Button variant='outline' className='rounded-full px-5'>
									Edit profile
								</Button>
							</Link>
						</div>
					</div>
				</div>

				<h2 className='text-xl font-semibold mt-6 mb-4'>My videos</h2>
				{videos.length === 0 ? (
					<p className='text-muted-foreground'>
						You haven’t uploaded any videos yet.
					</p>
				) : (
					<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
						{videos.map((video, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.3, delay: i * 0.1 }}
								className='group rounded-xl overflow-hidden border hover:shadow-xl hover:-translate-y-1 transition-all bg-card'
							>
								<div className='relative w-full h-48 overflow-hidden'>
									<Image
										src={video.thumbnail}
										alt='Video thumbnail'
										fill
										className='object-cover transition-transform duration-300 group-hover:scale-110'
										unoptimized
									/>
									<div className='absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity'></div>
								</div>
								<div className='p-4 flex flex-col justify-between h-36'>
									<div>
										<h3 className='font-semibold line-clamp-2'>
											{video.title}
										</h3>
										<p className='text-xs text-muted-foreground mt-1'>
											Uploaded on {video.createdAt}
										</p>
									</div>
									<div className='flex justify-end gap-2 mt-3'>
										<Button
											size='sm'
											variant='outline'
											className='rounded-full'
										>
											Edit
										</Button>
										<Button
											size='sm'
											variant='destructive'
											className='rounded-full'
										>
											Delete
										</Button>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				)}
			</motion.div>
			{openUploadingVideo && (
				<UploadVideoModal
					open={openUploadingVideo}
					onOpenChange={setOpenUploadingVideo}
				/>
			)}
		</div>
	)
}

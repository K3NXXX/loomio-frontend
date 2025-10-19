'use client'

import { UploadVideoModal } from '@/components/account/videos/upload/UploadVideoModal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { PAGES } from '@/constants/pages.constants'
import { useGetMe } from '@/hooks/auth/useGetMe'
import { getInitials } from '@/utils/get-initials'
import { useVideoStore } from '@/zustand/store/videoStore'
import { motion } from 'framer-motion'
import Link from 'next/link'

type Video = {
	title: string
	thumbnail: string
	createdAt: string
}

export default function Account() {
	const { userData } = useGetMe()
	const { openUploadingVideo, setOpenUploadingVideo } = useVideoStore()

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
							<Link href={PAGES.CHANNELS}>
								<Button className='rounded-full px-5'>Your channels</Button>
							</Link>
							<Link href={PAGES.EDIT_ACCOUNT}>
								<Button variant='outline' className='rounded-full px-5'>
									Edit profile
								</Button>
							</Link>
						</div>
					</div>
				</div>
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

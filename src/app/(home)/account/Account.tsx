'use client'

import { UploadVideoModal } from '@/components/account/videos/upload/UploadVideoModal'
import { Button } from '@/components/ui/button'
import { PAGES } from '@/constants/pages.constants'
import { useGetMe } from '@/hooks/auth/useGetMe'
import { useVideoStore } from '@/zustand/store/videoStore'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { AvatarUploader } from './edit-account/AvatarUploader'
import EditAccount from './edit-account/EditAccount'
import { useState } from 'react'
import { UserChannelsModal } from '@/components/account/channels/channel/UserChannelsModal'
import { useUpdateAvatar } from '@/hooks/user/useUpdateAvatar'
import { useDeleteAvatar } from '@/hooks/user/useDeleteAvatar'
import { FcGoogle } from 'react-icons/fc'
import { AuthProviderCard } from './edit-account/AuthProviderCard'

type Video = {
	title: string
	thumbnail: string
	createdAt: string
}

export default function Account() {
	const { userData } = useGetMe()
	const { openUploadingVideo, setOpenUploadingVideo } = useVideoStore()
	const [isChannelsOpen, setIsChannelsOpen] = useState(false)

	const { updateAvatar, isUploadAvatarLoading } = useUpdateAvatar()
	const { deleteAvatar } = useDeleteAvatar()

	return (
		<>hello</>
		// <div className='px-4 py-10'>
		// 	<motion.div
		// 		initial={{ opacity: 0, y: 20 }}
		// 		animate={{ opacity: 1, y: 0 }}
		// 		transition={{ duration: 0.4 }}
		// 		className='max-w-6xl mx-auto'
		// 	>
		// 		<div className='relative rounded-2xl overflow-hidden p-[1px] bg-gradient-to-br from-white/10 via-white/5 to-transparent'>
		// 			<div className='relative rounded-2xl bg-[#0e0e0e]/90 backdrop-blur-xl p-6 transition-all duration-300 hover:bg-[#121212]'>
		// 				<div className='absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-primary via-primary/60 to-transparent blur-[2px]' />

		// 				<div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.12),transparent_70%)] opacity-0 hover:opacity-100 transition-opacity duration-500' />

		// 				<div className='flex flex-col md:flex-row md:items-center gap-6 py-3 relative z-10'>
		// 					<AvatarUploader
		// 						value={userData?.avatarUrl}
		// 						fallbackName={userData?.name}
		// 						isLoading={isUploadAvatarLoading}
		// 						onChange={(file) => {
		// 							if (file) updateAvatar(file)
		// 							else deleteAvatar()
		// 						}}
		// 					/>
		// 					<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6 w-full'>
		// 						<div>
		// 							<h1 className='text-3xl font-semibold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent'>
		// 								My Account
		// 							</h1>

		// 							<p className='text-muted-foreground mt-1'>
		// 								{userData?.email}
		// 							</p>

		// 							<p className='text-sm mt-1 text-white/60'>
		// 								@{userData?.username}
		// 							</p>
		// 						</div>

		// 						<div className='flex flex-wrap gap-3'>
		// 							<Button
		// 								onClick={() => setIsChannelsOpen(true)}
		// 								className='rounded-full px-5 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20'
		// 							>
		// 								Your channels
		// 							</Button>

		// 							<Link href={PAGES.PLAYLISTS}>
		// 								<Button
		// 									variant='outline'
		// 									className='rounded-full px-5 border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur'
		// 								>
		// 									Playlists
		// 								</Button>
		// 							</Link>
		// 						</div>
		// 					</div>
		// 				</div>
		// 			</div>
		// 		</div>
		// 		<EditAccount />
		// 		<AuthProviderCard
		// 			provider='google'
		// 			description='You signed in using Google'
		// 			icon={<FcGoogle className='w-6 h-6' />}
		// 			isConnected={userData?.authProviders?.includes('google')}
		// 		/>
		// 	</motion.div>

		// 	{openUploadingVideo && (
		// 		<UploadVideoModal
		// 			open={openUploadingVideo}
		// 			onOpenChange={setOpenUploadingVideo}
		// 		/>
		// 	)}

		// 	<UserChannelsModal
		// 		open={isChannelsOpen}
		// 		onOpenChange={setIsChannelsOpen}
		// 	/>
		// </div>
	)
}

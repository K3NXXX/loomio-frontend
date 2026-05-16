'use client'

import { UserChannelsModal } from '@/components/account/channels/channel/UserChannelsModal'
import { UploadVideoModal } from '@/components/account/videos/upload/UploadVideoModal'
import { Button } from '@/components/ui/button'
import { PAGES } from '@/constants/pages.constants'
import { useGetMe } from '@/hooks/auth/useGetMe'
import { useDeleteAvatar } from '@/hooks/user/useDeleteAvatar'
import { useUpdateAvatar } from '@/hooks/user/useUpdateAvatar'
import { useVideoStore } from '@/zustand/store/videoStore'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { AuthProviderCard } from './edit-account/AuthProviderCard'
import { AvatarUploader } from './edit-account/AvatarUploader'
import EditAccount from './edit-account/EditAccount'
import { PremiumCard } from './PremiumCard'

export default function Account() {
	const t = useTranslations()
	const { userData } = useGetMe()

	const { openUploadingVideo, setOpenUploadingVideo } = useVideoStore()
	const [isChannelsOpen, setIsChannelsOpen] = useState(false)

	const { updateAvatar, isUploadAvatarLoading } = useUpdateAvatar()
	const { deleteAvatar } = useDeleteAvatar()

	return (
		<div className='py-10'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className='max-w-6xl mx-auto'
			>
				<div className='relative rounded-2xl overflow-hidden p-[1px] bg-gradient-to-br from-primary/20 via-border to-transparent dark:from-white/10 dark:via-white/5 dark:to-transparent'>
					<div className='relative rounded-2xl border border-border bg-card text-card-foreground backdrop-blur-xl p-6 transition-all duration-300 hover:bg-muted/30 dark:border-transparent dark:bg-[#0e0e0e]/90 dark:hover:bg-[#121212]'>
						<div className='absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-primary via-primary/60 to-transparent blur-[2px]' />

						<div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.08),transparent_70%)] opacity-0 hover:opacity-100 transition-opacity duration-500 dark:bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.12),transparent_70%)]' />

						<div className='flex flex-col md:flex-row md:items-center gap-6 py-3 relative z-10 max-[770px]:items-center max-[770px]:text-center'>
							<AvatarUploader
								value={userData?.avatarUrl}
								fallbackName={userData?.username}
								isLoading={isUploadAvatarLoading}
								onChange={(file) => {
									if (file) updateAvatar(file)
									else deleteAvatar()
								}}
							/>
							<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6 w-full max-[770px]:items-center'>
								<div className='max-[770px]:flex max-[770px]:flex-col max-[770px]:items-center'>
									<h1 className='text-3xl font-semibold tracking-tight text-foreground dark:bg-gradient-to-r dark:from-white dark:to-white/70 dark:bg-clip-text dark:text-transparent'>
										{t('accountPage.title')}
									</h1>

									<p className='text-muted-foreground mt-1'>
										{userData?.email}
									</p>

									<p className='text-sm mt-1 text-muted-foreground'>
										@{userData?.username}
									</p>
								</div>

								<div className='flex flex-wrap gap-3 max-[770px]:justify-center'>
									<Button
										onClick={() => setIsChannelsOpen(true)}
										className='rounded-full px-5 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20'
									>
										{t('accountPage.yourChannels')}
									</Button>

									<Link href={PAGES.PLAYLISTS}>
										<Button
											variant='outline'
											className='rounded-full px-5 border-border bg-muted/60 hover:bg-muted dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10'
										>
											{t('accountPage.playlists')}
										</Button>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
				<EditAccount />
			{userData?.authProviders && userData.authProviders.length > 0 && (
				<>
					<div>
						<h1 className='text-xl min-[400px]:text-2xl min-[600px]:text-3xl font-bold tracking-tight text-center text-foreground'>
							{t('accountPage.authProviders.title')}
						</h1>

						<p className='text-sm min-[400px]:text-base text-muted-foreground mt-1 text-center pb-5'>
							{t('accountPage.authProviders.subtitle')}
						</p>
					</div>
					<AuthProviderCard
						provider='google'
						description={t('accountPage.googleAuthDescription')}
						icon={<FcGoogle className='w-6 h-6' />}
						isConnected={userData.authProviders.includes('google')}
					/>
				</>
			)}
				<div className='mt-10 '>
					<h1 className='text-xl min-[400px]:text-2xl min-[600px]:text-3xl font-bold tracking-tight text-center text-foreground'>
						{t('premium.premiumSectionTitle')}
					</h1>
					<p className='text-sm min-[400px]:text-base text-muted-foreground mt-1 text-center pb-8'>
						{t('premium.premiumSectionSubtitle')}
					</p>

					<PremiumCard isPremium={userData?.isPremium} />
				</div>
			</motion.div>

			<UploadVideoModal
				open={openUploadingVideo}
				onOpenChange={setOpenUploadingVideo}
			/>

			<UserChannelsModal
				open={isChannelsOpen}
				onOpenChange={setIsChannelsOpen}
			/>
		</div>
	)
}

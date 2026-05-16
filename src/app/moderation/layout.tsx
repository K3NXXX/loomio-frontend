'use client'

import loader from '@/assets/animations/loader.json'
import { HomeUIConfiguratorMenu } from '@/components/home/HomeUIConfiguratorMenu'
import { ModerationHeader } from '@/components/admin/ModerationHeader'
import { ModerationSidebar } from '@/components/admin/ModerationSidebar'
import { Button } from '@/components/ui/button'
import { useGetMe } from '@/hooks/auth/useGetMe'
import { cn } from '@/lib/utils'
import { useGlobalStore } from '@/zustand/store/globalStore'
import Lottie from 'lottie-react'
import { useTranslations } from 'next-intl'
import { IoMdSettings } from 'react-icons/io'

export default function ModerationLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const { userData, isLoading } = useGetMe()
	const { toggleThemeMenuOpened, homeSidebarDockSide } = useGlobalStore()
	const tLayout = useTranslations('moderation.layout')

	if (isLoading || !userData) {
		return (
			<div className='w-full h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-background via-muted/20 to-background text-foreground'>
				<Lottie animationData={loader} loop className='w-20 h-20' />
				<p className='text-sm text-muted-foreground'>
					{tLayout('loadingHint')}
				</p>
			</div>
		)
	}

	return (
		<div className='relative min-h-screen flex flex-col bg-gradient-to-br from-background via-muted/25 to-background text-foreground'>
			<div
				className='pointer-events-none fixed inset-0 opacity-[0.14] bg-[radial-gradient(ellipse_100%_70%_at_50%_-25%,var(--primary),transparent_58%)]'
				aria-hidden
			/>
			<ModerationHeader user={userData} />

			<div className='relative flex flex-1 min-h-0'>
				<ModerationSidebar user={userData} />

				<main className='relative flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8'>
					{children}
				</main>
			</div>

			<Button
				type='button'
				onClick={toggleThemeMenuOpened}
				title={tLayout('settingsTooltip')}
				aria-label={tLayout('settingsTooltip')}
				className={cn(
					'fixed bottom-5 md:bottom-8 z-50 size-12 rounded-xl shadow-lg shadow-black/25 border border-border/50 bg-card/90 backdrop-blur-md hover:bg-card hover:scale-[1.03] transition-all p-0',
					homeSidebarDockSide === 'right' ? 'left-5 md:left-8' : 'right-5 md:right-8',
				)}
			>
				<IoMdSettings className='size-[26px] text-primary' />
			</Button>

			<HomeUIConfiguratorMenu />
		</div>
	)
}

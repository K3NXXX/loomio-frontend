'use client'
import { type ReactNode, useEffect } from 'react'

import Cookies from 'js-cookie'

import loader from '@/assets/animations/loader.json'
import { STICKY_HEADER_COOKIE_KEY } from '@/lib/header-sticky-preference'
import { cn } from '@/lib/utils'
import { HomeHeader } from '@/components/home/home-header/HomeHeader'
import { HomeSidebarCollapsed } from '@/components/home/home-sidebar/HomeSidebarCollapsed'
import { HomeSidebarMenu } from '@/components/home/home-sidebar/HomeSidebarMenu'
import { HomeUIConfiguratorMenu } from '@/components/home/HomeUIConfiguratorMenu'
import { AuthRequiredModal } from '@/components/auth/AuthRequiredModal'
import { Button } from '@/components/ui/button'
import { useGetMe } from '@/hooks/auth/useGetMe'
import { useNotificationSocket } from '@/hooks/notification/useNotificationSocket'
import { useGlobalStore } from '@/zustand/store/globalStore'
import Lottie from 'lottie-react'
import { IoMdSettings } from 'react-icons/io'

export function ClientHomeLayout({ children }: { children: ReactNode }) {
	const {
		toggleThemeMenuOpened,
		isSidebarCollapsed,
		setHeaderSticky,
		homeSidebarDockSide,
	} = useGlobalStore()
	const { userData, isLoading } = useGetMe()
	useNotificationSocket(userData?.id)

	useEffect(() => {
		const v = Cookies.get(STICKY_HEADER_COOKIE_KEY)
		if (v === 'false') setHeaderSticky(false)
		else if (v === 'true') setHeaderSticky(true)
	}, [setHeaderSticky])

	if (isLoading) {
		return (
			<div className='w-full h-screen flex items-center justify-center text-foreground'>
				<Lottie animationData={loader} loop className='absolute w-20 h-20' />
			</div>
		)
	}

	return (
		<div className='relative w-full min-h-screen flex flex-col bg-gradient-to-br from-background via-muted/35 to-background text-foreground'>
			<HomeHeader />
			<div
				className={cn(
					'flex flex-1',
					homeSidebarDockSide === 'right' && 'flex-row-reverse',
				)}
			>
				<div className='w-[80px] max-[1024px]:hidden'>
					{isSidebarCollapsed ? <HomeSidebarCollapsed /> : <HomeSidebarMenu />}
				</div>

				<main className='flex-1 overflow-y-auto px-5 py-10'>{children}</main>
			</div>

			<Button
				onClick={toggleThemeMenuOpened}
				className={cn(
					'w-[45px] h-[45px] p-0 fixed bottom-6 rounded-lg',
					homeSidebarDockSide === 'right' ? 'left-6' : 'right-6',
				)}
			>
				<IoMdSettings size={100} className='size-[25px]' />
			</Button>

			<HomeUIConfiguratorMenu />
			<AuthRequiredModal />
		</div>
	)
}

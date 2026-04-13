'use client'
import { type ReactNode } from 'react'

import loader from '@/assets/animations/loader.json'
import { HomeHeader } from '@/components/home/home-header/HomeHeader'
import { HomeSidebarCollapsed } from '@/components/home/home-sidebar/HomeSidebarCollapsed'
import { HomeSidebarMenu } from '@/components/home/home-sidebar/HomeSidebarMenu'
import { HomeUIConfiguratorMenu } from '@/components/home/HomeUIConfiguratorMenu'
import { Button } from '@/components/ui/button'
import { useGetMe } from '@/hooks/auth/useGetMe'
import { useNotificationSocket } from '@/hooks/notification/useNotificationSocket'
import { useGlobalStore } from '@/zustand/store/globalStore'
import Lottie from 'lottie-react'
import { IoMdSettings } from 'react-icons/io'

export function ClientHomeLayout({ children }: { children: ReactNode }) {
	const { toggleThemeMenuOpened, isSidebarCollapsed } = useGlobalStore()
	const { userData } = useGetMe()
	useNotificationSocket(userData?.id)

	if (!userData) {
		return (
			<div className='w-full h-screen flex items-center justify-center text-white'>
				<Lottie animationData={loader} loop className='absolute w-20 h-20' />
			</div>
		)
	}

	return (
		<div className='relative w-full min-h-screen flex flex-col bg-gradient-to-br from-black via-neutral-800 to-black'>
			<HomeHeader />
			<div className='flex flex-1'>
				<div className='w-[80px] max-[1024px]:hidden'>
					{isSidebarCollapsed ? <HomeSidebarCollapsed /> : <HomeSidebarMenu />}
				</div>

				<main className='flex-1 overflow-y-auto px-10 py-10'>{children}</main>
			</div>

			<Button
				onClick={toggleThemeMenuOpened}
				className='w-[45px] h-[45px] p-0 fixed right-6 bottom-6 rounded-lg'
			>
				<IoMdSettings size={100} className='size-[25px]' />
			</Button>

			<HomeUIConfiguratorMenu />
		</div>
	)
}

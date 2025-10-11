'use client'
import type { ReactNode } from 'react'

import { HomeHeader } from '@/components/home/home-header/HomeHeader'
import { HomeSidebarCollapsed } from '@/components/home/home-sidebar/HomeSidebarCollapsed'
import { HomeSidebarMenu } from '@/components/home/home-sidebar/HomeSidebarMenu'
import { HomeUIConfiguratorMenu } from '@/components/home/HomeUIConfiguratorMenu'
import { Button } from '@/components/ui/button'
import { useGlobalStore } from '@/zustand/store/globalStore'
import { IoMdSettings } from 'react-icons/io'

export function ClientHomeLayout({ children }: { children: ReactNode }) {
	const { toggleThemeMenuOpened, isSidebarCollapsed } = useGlobalStore()

	return (
		<div
			style={{ background: '#111111' }}
			className='w-full min-h-screen flex flex-col'
		>
			<HomeHeader />
			<div className='flex flex-1'>
				{isSidebarCollapsed ? <HomeSidebarCollapsed /> : <HomeSidebarMenu />}

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

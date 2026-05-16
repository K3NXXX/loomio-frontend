'use client'

import { HomeUIConfiguratorMenu } from '@/components/home/HomeUIConfiguratorMenu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useGlobalStore } from '@/zustand/store/globalStore'
import { useTranslations } from 'next-intl'
import { IoMdSettings } from 'react-icons/io'

export function AuthThemeConfiguratorFab() {
	const { toggleThemeMenuOpened, homeSidebarDockSide } = useGlobalStore()
	const t = useTranslations('moderation.layout')

	return (
		<>
			<Button
				type='button'
				onClick={toggleThemeMenuOpened}
				title={t('settingsTooltip')}
				aria-label={t('settingsTooltip')}
				className={cn(
					'fixed bottom-5 md:bottom-8 z-50 size-12 rounded-xl shadow-lg shadow-black/15 dark:shadow-black/25 border border-border/50 bg-card/90 backdrop-blur-md hover:bg-card hover:scale-[1.03] transition-all p-0',
					homeSidebarDockSide === 'right' ? 'left-5 md:left-8' : 'right-5 md:right-8',
				)}
			>
				<IoMdSettings className='size-[26px] text-primary' />
			</Button>
			<HomeUIConfiguratorMenu />
		</>
	)
}

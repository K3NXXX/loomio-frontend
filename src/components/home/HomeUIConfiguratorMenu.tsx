'use client'

import { useEffect, useState } from 'react'

import Cookies from 'js-cookie'

import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { useChangeColorTheme } from '@/hooks/user/useChangeColorTheme'
import { UIConfiguratorColors } from '@/lists/ui.configurator.colors.list'
import { useGlobalStore } from '@/zustand/store/globalStore'

import type { THEME_COLORS } from '@/types/colors.types'

export function HomeUIConfiguratorMenu() {
	const [activeColor, setActiveColor] = useState<THEME_COLORS>(
		UIConfiguratorColors[0].color,
	)
	const { isThemesMenuOpened, toggleThemeMenuOpened } = useGlobalStore()
	const { changeColorTheme } = useChangeColorTheme()

	const handleClickColor = (color: THEME_COLORS) => {
		setActiveColor(color)
		changeColorTheme(color)

		const root = document.documentElement
		Array.from(root.classList)
			.filter((cls) => cls.startsWith('theme-'))
			.forEach((cls) => root.classList.remove(cls))

		root.classList.add(`theme-${color.toLowerCase()}`)
	}

	useEffect(() => {
		const themeFromCookie = Cookies.get('theme') as THEME_COLORS | undefined
		if (
			themeFromCookie &&
			UIConfiguratorColors.some((c) => c.color === themeFromCookie)
		) {
			setActiveColor(themeFromCookie)
			changeColorTheme(themeFromCookie)
		}
	}, [changeColorTheme])

	return (
		<Sheet open={isThemesMenuOpened} onOpenChange={toggleThemeMenuOpened}>
			<SheetContent className='w-[320px] sm:w-[400px] flex flex-col gap-6 overflow-y-auto'>
				<SheetHeader className='flex flex-col border-b'>
					<SheetTitle className='text-xl'>Loomio Configurator</SheetTitle>
					<p className='font-medium'>See our dashboard options</p>
				</SheetHeader>
				<div className='px-5 flex flex-col gap-5'>
					<div>
						<p className='text-sm font-medium text-muted-foreground mb-2'>
							Theme colors
						</p>
						<div className='flex flex-wrap gap-3 items-center'>
							{UIConfiguratorColors.map((item, index) => (
								<button
									key={index}
									onClick={() => handleClickColor(item.color)}
									aria-pressed={activeColor === item.color}
									className={`w-7 h-7 rounded-full border transition-all duration-200 ease-in-out
  									${activeColor === item.color ? 'border-3 border-white' : ' hover:scale-120'}
									cursor-pointer
									`}
									style={{ backgroundColor: item.colorCss }}
								/>
							))}
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	)
}

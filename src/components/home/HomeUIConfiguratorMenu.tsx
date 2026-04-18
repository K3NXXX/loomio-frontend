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
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

export function HomeUIConfiguratorMenu() {
	const [activeColor, setActiveColor] = useState<THEME_COLORS>(
		UIConfiguratorColors[0].color,
	)
	const { isThemesMenuOpened, toggleThemeMenuOpened } = useGlobalStore()
const { changeColorTheme } = useChangeColorTheme()
	const [activeLocale, setActiveLocale] = useState<'uk' | 'en'>('uk')
	const t = useTranslations()

	const router = useRouter()

	const handleClickColor = (color: THEME_COLORS) => {
		setActiveColor(color)
		changeColorTheme(color)

		const root = document.documentElement
		Array.from(root.classList)
			.filter((cls) => cls.startsWith('theme-'))
			.forEach((cls) => root.classList.remove(cls))

		root.classList.add(`theme-${color.toLowerCase()}`)
	}

	const handleChangeLanguage = (locale: 'uk' | 'en') => {
		setActiveLocale(locale)
		Cookies.set('locale', locale, { expires: 30 })
		router.refresh()
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

	useEffect(() => {
		const localeFromCookie = Cookies.get('locale') as 'uk' | 'en' | undefined
		if (localeFromCookie) {
			setActiveLocale(localeFromCookie)
		}
	}, [])

	return (
		<Sheet open={isThemesMenuOpened} onOpenChange={toggleThemeMenuOpened}>
			<SheetContent className='w-[320px] sm:w-[400px] flex flex-col gap-6 overflow-y-auto'>
				<SheetHeader className='flex flex-col border-b'>
					<SheetTitle className='text-xl'>{t('uiConfigurator.title')}</SheetTitle>
					<p className='font-medium'>{t('uiConfigurator.subtitle')}</p>
				</SheetHeader>
				<div className='px-5 flex flex-col gap-5'>
					<div>
						<p className='text-sm font-medium text-muted-foreground mb-2'>
							{t('uiConfigurator.themeColors')}
						</p>
						<div className='flex flex-wrap gap-3 items-center mb-5'>
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
						<div>
							<p className='text-sm font-medium text-muted-foreground mb-2 '>
								{t('uiConfigurator.language')}
							</p>

							<div className='flex rounded-xl bg-muted p-1 w-fit'>
								<button
									onClick={() => handleChangeLanguage('uk')}
									className={`
										px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
										${
											activeLocale === 'uk'
												? 'bg-primary text-white shadow'
												: 'text-muted-foreground hover:text-foreground'
										}
									`}
								>
									UA
								</button>

								<button
									onClick={() => handleChangeLanguage('en')}
									className={`
									px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
									${
										activeLocale === 'en'
											? 'bg-primary text-white shadow'
											: 'text-muted-foreground hover:text-foreground'
									}
								`}
								>
									EN
								</button>
							</div>
						</div>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	)
}

'use client'

import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { UIConfiguratorColors } from '@/lists/ui.configurator.colors.list'
import {
	blueTheme,
	greenTheme,
	orangeTheme,
	redTheme,
	violetTheme,
	whiteTheme,
	yellowTheme,
} from '@/themes/themes'
import { applyTheme } from '@/utils/themeUtils'
import { useGlobalStore } from '@/zustand/store/globalStore'
import { useEffect, useState } from 'react'

export function DashboardThemesMenu() {
	const { isThemesMenuOpened, toggleThemeMenuOpened } = useGlobalStore()
	const [activeColor, setActiveColor] = useState(0)
	const themesList = [
		redTheme,
		orangeTheme,
		greenTheme,
		blueTheme,
		yellowTheme,
		violetTheme,
		whiteTheme,
	]

	const handleClickColor = (index: number) => {
		setActiveColor(index)
		applyTheme(themesList[index])
		localStorage.setItem('colorTheme', String(index))
	}

	useEffect(() => {
		const savedThemeIndex = localStorage.getItem('colorTheme')
		if (savedThemeIndex !== null) {
			const index = parseInt(savedThemeIndex)
			setActiveColor(index)
			applyTheme(themesList[index])
		}
	}, [])

	return (
		<Sheet open={isThemesMenuOpened} onOpenChange={toggleThemeMenuOpened}>
			<SheetContent className='w-[320px] sm:w-[400px] flex flex-col gap-6 overflow-y-auto'>
				<SheetHeader className='flex flex-col border-b'>
					<SheetTitle className='text-xl'>Dashboard Configurator</SheetTitle>
					<p className='font-medium'>See our dashboard options</p>
				</SheetHeader>
				<div className='px-5'>
					<div>
						<p className='text-sm font-medium text-muted-foreground mb-2'>
							Theme colors
						</p>
						<div className='flex flex-wrap gap-3 items-center'>
							{UIConfiguratorColors.map((item, index) => (
								<button
									key={index}
									onClick={() => handleClickColor(index)}
									aria-pressed={activeColor === index}
									className={`w-7 h-7 rounded-full border transition-all duration-200 ease-in-out
  									${activeColor === index ? 'border-3 border-white' : ' hover:scale-120'}
									cursor-pointer
									`}
									style={{ backgroundColor: item.color }}
								/>
							))}
						</div>
					</div>

					{/* <div>
						<p className='text-sm font-medium text-muted-foreground mb-1'>
							Sidenav Type
						</p>
						<p className='text-xs text-muted-foreground mb-2'>
							Choose between 2 different sidenav types.
						</p>
						<div className='flex gap-2'>
							{UIConfiguratorButtonTypes.map((item, index) => (
								<Button
									key={index}
									variant={activeType === index ? 'default' : 'outline'}
									onClick={() => handleClickButtonType(index)}
								>
									{item.label}
								</Button>
							))}
						</div>
					</div>

					<div>
						<p className='text-sm font-medium text-muted-foreground mb-1'>
							Navbar Fixed
						</p>
						<Switch checked={isSwitchOn} onCheckedChange={handleSwitchChange} />
					</div> */}
				</div>
			</SheetContent>
		</Sheet>
	)
}

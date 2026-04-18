'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { HeaderSearch } from '../home-header/HeaderSearch'
import { sidebarMenu } from '@/lists/sidebar.menu.items'
import { Logo } from '@/components/ui/Logo'

interface Props {
	isOpen: boolean
	onClose: () => void
}

export function MobileSidebar({ isOpen, onClose }: Props) {
	const t = useTranslations()

	return (
		<>
			<div
				onClick={onClose}
				className={cn(
					'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300',
					isOpen ? 'opacity-100 visible' : 'opacity-0 invisible',
				)}
			/>

			<div
				className={cn(
					'fixed top-0 left-0 h-full w-[280px] z-50',
					'bg-[oklch(0.19_0_0)]',
					'transition-transform duration-300',
					isOpen ? 'translate-x-0' : '-translate-x-full',
				)}
			>
				<div className='p-4 flex flex-col gap-6'>
					<div className='ml-2'>
						<Logo />
					</div>
					<HeaderSearch className='mx-0' />
					<div className='flex flex-col gap-2'>
						{sidebarMenu.map((item) => {
							const Icon = item.icon

							return (
								<Link
									key={item.id}
									href={item.url}
									onClick={onClose}
									className='
										flex items-center gap-3 px-3 py-2 rounded-lg
										hover:bg-white/10 transition
									'
								>
									<Icon size={22} />
									<span>{t(item.label)}</span>
								</Link>
							)
						})}
					</div>
				</div>
			</div>
		</>
	)
}

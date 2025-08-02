import Link from 'next/link'

import { homeHeaderItems } from '@/lists/home.header.items.list'

import { Card } from '../ui/card'
import { Logo } from '../ui/Logo'

export function IntroHeader() {
	return (
		<Card className='bg-neutral-900 right-0 left-0 top-10 relative z-50  rounded-[12px]  px-6 py-4 max-[540px]:px-[15px]'>
			<header className='flex justify-between max-[540px]:flex-col max-[540px]:items-center max-[540px]:gap-3 '>
				<Logo />

				<ul className='flex items-center gap-8  max-[355px]:gap-10'>
					{homeHeaderItems.map((item) => (
						<li key={item.id}>
							<Link
								href={item.href}
								className='flex gap-2 items-center text-[16px] font-medium text-white'
							>
								<item.icon className='max-[355px]:hidden' />
								<p>{item.label}</p>
							</Link>
						</li>
					))}
				</ul>
			</header>
		</Card>
	)
}

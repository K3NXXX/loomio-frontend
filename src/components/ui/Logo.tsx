import { PAGES } from '@/constants/pages.constants'
import { Montserrat } from 'next/font/google'
import Link from 'next/link'
import { FaRecordVinyl } from 'react-icons/fa'

const montserrat = Montserrat({
	subsets: ['latin'],
	weight: ['700', '800'],
	display: 'swap',
})

export function Logo() {
	return (
		<Link
			href={PAGES.HOME}
			className='flex items-center gap-3 group select-none'
		>
			<div className='relative flex items-center justify-center w-8 h-8 rounded-full bg-primary shadow-[0_0_12px_var(--color-primary)] transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_var(--color-primary)]'>
				<FaRecordVinyl className='text-primary-foreground text-xl animate-spin-slower' />
			</div>

			<span
				className={`${montserrat.className} text-white font-extrabold text-[20px] tracking-tight transition-colors duration-300 group-hover:text-primary`}
			>
				Loomio
			</span>
		</Link>
	)
}

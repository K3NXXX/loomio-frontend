import Link from 'next/link'

import { PAGES } from '@/constants/pages.constants'

export function Logo() {
	return (
		<Link href={PAGES.HOME}>
			<span className='text-white font-bold text-[24px]'>Loomio</span>
		</Link>
	)
}

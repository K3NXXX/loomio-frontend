import { PAGES } from '@/constants/pages.constants'
import Link from 'next/link'

export function Logo() {
	return (
		<Link href={PAGES.HOME}>
			<span className='text-white font-bold text-[24px]'>NextGen</span>
		</Link>
	)
}

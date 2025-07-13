import { SITE_NAME } from '@/constants/seo.constants'
import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import LogIn from './LogIn'

export const metadata: Metadata = {
	title: 'Log in',
	description: `${SITE_NAME} log in page`,
}

export default function LogInPage() {
	return (
		<>
			<LogIn />
			<Toaster
				position='top-right'
				toastOptions={{
					duration: 3000,
					style: {
						maxWidth: '320px',
						width: '100%',
					},
				}}
			/>
		</>
	)
}

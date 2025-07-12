import { SITE_NAME } from '@/constants/seo.constants'
import type { Metadata } from 'next'
import { SignUp } from './SignUp'

export const metadata: Metadata = {
	title: 'Registration',
	description: `${SITE_NAME} registration page`,
}

export default function SignUpPage() {
	return (
		<div
			style={{
				background:
					'linear-gradient(250deg, #202020 0%, transparent 50%)'
			}}
		>
			
			<SignUp />
		</div>
	)
}

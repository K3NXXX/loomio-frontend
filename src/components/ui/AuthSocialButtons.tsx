'use client'
import { toast } from 'sonner'

import { Card } from '@/components/ui/card'
import { providers } from '@/lists/auth.providers.list'

export function AuthSocialButtons() {
	const handleOAuthLogin = (url: string | undefined, name: string) => {
		if (!url) {
			console.error(`OAuth URL for ${name} is not configured.`)
			toast.error('Authorization failed: OAuth URL is not configured.')
			return
		}
		window.location.href = url
	}
	return (
		<div className='flex justify-center gap-5'>
			{providers.map((provider) => (
				<button
					key={provider.name}
					aria-label={`Login with ${provider.name}`}
					onClick={() => handleOAuthLogin(provider.url, provider.name)}
					className='w-full cursor-pointer'
				>
					<Card className='bg-neutral-900 py-5 px-5 flex justify-center items-center w-full'>
						<provider.icon color={provider.color} />
					</Card>
				</button>
			))}
		</div>
	)
}

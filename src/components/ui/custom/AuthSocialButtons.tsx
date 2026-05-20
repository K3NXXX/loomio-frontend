'use client'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import { Card } from '@/components/ui/card'
import { providers } from '@/lists/auth.providers.list'

export function AuthSocialButtons() {
	const t = useTranslations('toast')
	const handleOAuthLogin = (url: string | undefined, name: string) => {
		if (!url) {
			console.error(`OAuth URL for ${name} is not configured.`)
			toast.error(t('oauthNotConfigured'))
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
					className='w-full cursor-pointer flex justify-center items-center'
				>
					<Card className='border border-border bg-card py-5 px-5 flex justify-center items-center w-full shadow-sm hover:bg-muted/40 transition-colors'>
						<provider.icon color={provider.color} />
					</Card>
				</button>
			))}
		</div>
	)
}

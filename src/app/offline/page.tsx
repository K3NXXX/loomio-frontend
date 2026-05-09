'use client'

import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { WifiOff } from 'lucide-react'

export default function OfflinePage() {
	const t = useTranslations('pwa.offline')

	return (
		<div className='min-h-[70vh] flex flex-col items-center justify-center gap-4 px-6 text-center'>
			<WifiOff className='size-14 text-muted-foreground' aria-hidden />
			<h1 className='text-xl font-semibold'>{t('title')}</h1>
			<p className='text-sm text-muted-foreground max-w-sm'>{t('description')}</p>
			<Button type='button' className='rounded-full' onClick={() => window.location.reload()}>
				{t('retry')}
			</Button>
		</div>
	)
}

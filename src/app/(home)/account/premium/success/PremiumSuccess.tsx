'use client'

import { Button } from '@/components/ui/button'
import { PAGES } from '@/constants/pages.constants'
import { paymentsService } from '@/services/payment.service'
import { useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Crown, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function PremiumSuccess() {
	const t = useTranslations('premium.premiumSuccess')
	const searchParams = useSearchParams()
	const queryClient = useQueryClient()
	const sessionId = searchParams.get('session_id')

	useEffect(() => {
		if (!sessionId) return

		let cancelled = false

		void (async () => {
			try {
				await paymentsService.confirmCheckout(sessionId)
				if (!cancelled) {
					await queryClient.invalidateQueries({ queryKey: ['getMe'] })
				}
			} catch {
				// Webhook may have already activated premium; profile refetch still helps.
				if (!cancelled) {
					await queryClient.invalidateQueries({ queryKey: ['getMe'] })
				}
			}
		})()

		return () => {
			cancelled = true
		}
	}, [sessionId, queryClient])

	return (
		<div className='min-h-[80vh] flex flex-col items-center justify-center gap-6 text-center px-4'>
			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{ type: 'spring', stiffness: 200, damping: 15 }}
				className='relative'
			>
				<div className='w-24 h-24 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center'>
					<Crown className='w-12 h-12 text-yellow-400' />
				</div>
				<motion.div
					initial={{ opacity: 0, scale: 0 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.3 }}
					className='absolute -top-1 -right-1 w-7 h-7 rounded-full bg-yellow-400 flex items-center justify-center'
				>
					<Sparkles className='w-4 h-4 text-black' />
				</motion.div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className='flex flex-col gap-2'
			>
				<h1 className='text-4xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent'>
					{t('title')}
				</h1>
				<p className='text-muted-foreground max-w-md mx-auto'>
					{t('description')}
				</p>
			</motion.div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.4 }}
				className='flex flex-col sm:flex-row gap-3'
			>
				<Link href={PAGES.HOME}>
					<Button className='rounded-full px-8'>{t('goHome')}</Button>
				</Link>
				<Link href={PAGES.ACCOUNT}>
					<Button variant='outline' className='rounded-full px-8'>
						{t('myProfile')}
					</Button>
				</Link>
			</motion.div>
		</div>
	)
}

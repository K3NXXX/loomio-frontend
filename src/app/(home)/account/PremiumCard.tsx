'use client'

import { Button } from '@/components/ui/button'
import { Crown, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { PAGES } from '@/constants/pages.constants'

interface PremiumCardProps {
	isPremium?: boolean
}

export function PremiumCard({ isPremium }: PremiumCardProps) {
	const t = useTranslations('premium')
	const router = useRouter()

	if (isPremium) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, delay: 0.1 }}
				className='mt-6 relative rounded-2xl overflow-hidden p-[1px] bg-gradient-to-br from-yellow-400 via-yellow-300/80 to-yellow-600'
			>
				<div className='relative rounded-2xl border border-border bg-card text-card-foreground backdrop-blur-xl p-6 dark:border-transparent dark:bg-[#0e0e0e]/95'>
					<div className='absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-yellow-400 via-yellow-400/60 to-transparent' />
					<div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.08),transparent_70%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.12),transparent_70%)]' />

					<div className='relative z-10 flex flex-col sm:flex-row sm:items-center gap-4'>
						<div className='w-14 h-14 rounded-2xl bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(250,204,21,0.3)]'>
							<Crown className='w-7 h-7 text-yellow-400' />
						</div>
						<div className='flex-1'>
							<div className='flex items-center gap-2'>
								<h2 className='text-lg font-bold text-foreground'>{t('title')}</h2>
								<span className='text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 border border-yellow-400/30'>
									{t('active')}
								</span>
							</div>
							<p className='text-sm text-muted-foreground mt-0.5'>
								{t('activeDescription')}
							</p>
						</div>
					<Button
						onClick={() => router.push(`/${PAGES.PREMIUM_INFO}`)}
						variant='outline'
						className='shrink-0 rounded-full px-5 border-yellow-400/40 text-yellow-400 hover:bg-yellow-400/10 hover:text-yellow-300 hover:border-yellow-400/60 transition-all duration-200'
					>
						<Sparkles className='w-4 h-4 mr-2' />
						{t('manageButton')}
					</Button>
				</div>
			</div>
		</motion.div>
	)
}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, delay: 0.1 }}
			className='mt-6 relative rounded-2xl overflow-hidden p-[1px] bg-gradient-to-br from-yellow-500/30 via-yellow-400/10 to-transparent'
		>
			<div className='relative rounded-2xl border border-border bg-card text-card-foreground backdrop-blur-xl p-6 transition-all duration-300 hover:bg-muted/40 dark:border-transparent dark:bg-[#0e0e0e]/90 dark:hover:bg-[#121212]'>
				<div className='absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-yellow-400 via-yellow-400/60 to-transparent blur-[2px]' />
				<div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(234,179,8,0.06),transparent_70%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(234,179,8,0.08),transparent_70%)]' />

				<div className='relative z-10 flex flex-col justify-between sm:flex-row sm:items-center gap-6'>
					<div className='flex items-center gap-4'>
						<div className='w-14 h-14 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center shrink-0'>
							<Crown className='w-7 h-7 text-yellow-400' />
						</div>
						<div>
							<div className='flex items-center gap-2'>
								<h2 className='text-lg font-bold text-foreground'>{t('title')}</h2>
								<span className='text-xs font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border dark:bg-white/10 dark:text-white/50 dark:border-white/10'>
									{t('inactive')}
								</span>
							</div>
							<p className='text-sm text-muted-foreground mt-0.5'>{t('description')}</p>
						</div>
					</div>

					<Button
						onClick={() => router.push(`/${PAGES.PREMIUM_INFO}`)}
						className='shrink-0 rounded-full px-5 bg-yellow-400 text-black border border-yellow-300 hover:bg-yellow-300 transition-all duration-200 shadow-[0_0_20px_rgba(250,204,21,0.25)] hover:shadow-[0_0_30px_rgba(250,204,21,0.45)]'
					>
						<Crown className='w-4 h-4 mr-2' />
						{t('upgradeButton')}
					</Button>
				</div>
			</div>
		</motion.div>
	)
}

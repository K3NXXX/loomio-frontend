'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
	Check,
	Crown,
	Download,
	Gauge,
	LayoutTemplate,
	Paintbrush,
	Palette,
	PictureInPicture,
	Sparkles,
	type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRef } from 'react'
import { useCreateCheckoutSession } from '@/hooks/payments/useCreateCheckoutSession'
import Lottie from 'lottie-react'
import loader from '@/assets/animations/loader.json'
import { useGetMe } from '@/hooks/auth/useGetMe'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

function TiltCard({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) {
	const ref = useRef<HTMLDivElement>(null)

	const x = useMotionValue(0)
	const y = useMotionValue(0)

	const springX = useSpring(x, { stiffness: 150, damping: 20 })
	const springY = useSpring(y, { stiffness: 150, damping: 20 })

	const rotateX = useTransform(springY, [-0.5, 0.5], ['8deg', '-8deg'])
	const rotateY = useTransform(springX, [-0.5, 0.5], ['-8deg', '8deg'])

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		const el = ref.current
		if (!el) return
		const rect = el.getBoundingClientRect()
		x.set((e.clientX - rect.left) / rect.width - 0.5)
		y.set((e.clientY - rect.top) / rect.height - 0.5)
	}

	const handleMouseLeave = () => {
		x.set(0)
		y.set(0)
	}

	return (
		<motion.div
			ref={ref}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
			style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
			className={className}
		>
			{children}
		</motion.div>
	)
}

function BenefitCard({
	icon: Icon,
	title,
	description,
	index,
}: {
	icon: LucideIcon
	title: string
	description: string
	index: number
}) {
	return (
		<motion.article
			initial={{ opacity: 0, y: 16 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: '-40px' }}
			transition={{ duration: 0.35, delay: index * 0.06 }}
			className={cn(
				'relative rounded-2xl border border-border bg-card/80 p-5 shadow-sm backdrop-blur-sm transition-colors',
				'hover:border-yellow-400/35 hover:bg-yellow-400/[0.04] dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-yellow-400/25',
			)}
		>
			<div className='relative flex flex-col gap-3'>
				<div className='flex size-11 items-center justify-center rounded-xl bg-yellow-400/15 text-yellow-600 ring-1 ring-yellow-400/25 dark:text-yellow-400 dark:ring-yellow-400/20'>
					<Icon className='size-5' aria-hidden />
				</div>
				<div>
					<h3 className='text-base font-semibold tracking-tight text-foreground'>
						{title}
					</h3>
					<p className='mt-1.5 text-sm leading-relaxed text-muted-foreground'>
						{description}
					</p>
				</div>
			</div>
		</motion.article>
	)
}

export const Premium = () => {
	const t = useTranslations('premium')
	const { createCheckoutSession, isPending } = useCreateCheckoutSession()
	const { userData } = useGetMe()
	const isPremium = userData?.isPremium

	const benefits: { icon: LucideIcon; titleKey: string; bodyKey: string }[] = [
		{ icon: Palette, titleKey: 'benefitThemesTitle', bodyKey: 'benefitThemesBody' },
		{ icon: LayoutTemplate, titleKey: 'benefitLayoutTitle', bodyKey: 'benefitLayoutBody' },
		{ icon: Paintbrush, titleKey: 'benefitChannelTitle', bodyKey: 'benefitChannelBody' },
		{ icon: Gauge, titleKey: 'benefitSpeedTitle', bodyKey: 'benefitSpeedBody' },
		{ icon: PictureInPicture, titleKey: 'benefitMiniPlayerTitle', bodyKey: 'benefitMiniPlayerBody' },
		{ icon: Download, titleKey: 'benefitDownloadTitle', bodyKey: 'benefitDownloadBody' },
	]

	const standardKeys = [
		'planFreeF1',
		'planFreeF2',
		'planFreeF3',
		'planFreeF4',
		'planFreeF5',
		'planFreeF6',
	] as const
	const premiumKeys = [
		'planPremiumP1',
		'planPremiumP2',
		'planPremiumP3',
		'planPremiumP4',
		'planPremiumP5',
		'planPremiumP6',
	] as const

	return (
		<div className='max-w-5xl mx-auto px-4 py-10 pb-16'>
			<motion.header
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className='text-center mb-14'
			>
				<div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-400/30 bg-yellow-400/10 text-yellow-600 text-sm font-medium mb-5 dark:text-yellow-400'>
					<Sparkles className='size-4 shrink-0' aria-hidden />
					{t('heroBadge')}
				</div>
				<h1 className='text-3xl sm:text-4xl font-bold tracking-tight text-foreground dark:bg-gradient-to-r dark:from-white dark:via-white/92 dark:to-white/55 dark:bg-clip-text dark:text-transparent'>
					{t('heroTitle')}
				</h1>
				<p className='text-muted-foreground mt-4 max-w-xl mx-auto text-base leading-relaxed'>
					{t('heroSubtitle')}
				</p>
			</motion.header>

			<section className='mb-16' aria-labelledby='premium-benefits-heading'>
				<div className='text-center mb-10'>
					<h2
						id='premium-benefits-heading'
						className='text-2xl font-bold text-foreground sm:text-3xl'
					>
						{t('benefitsTitle')}
					</h2>
					<p className='mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed'>
						{t('benefitsSubtitle')}
					</p>
				</div>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{benefits.map((b, i) => (
						<BenefitCard
							key={b.titleKey}
							icon={b.icon}
							title={t(b.titleKey)}
							description={t(b.bodyKey)}
							index={i}
						/>
					))}
				</div>
			</section>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto perspective-[1000px]'>
				<TiltCard>
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.1 }}
						className='rounded-2xl border border-border bg-card p-6 h-full backdrop-blur dark:border-white/10 dark:bg-white/5'
					>
						<div className='flex items-center justify-between mb-1 gap-2'>
							<h2 className='text-xl font-semibold text-foreground'>
								{t('planFreeTitle')}
							</h2>
							{!isPremium && (
								<span className='text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground border border-border shrink-0 dark:bg-white/10 dark:text-white/50 dark:border-transparent'>
									{t('planFreeTag')}
								</span>
							)}
						</div>
						<p className='text-muted-foreground text-sm mb-6 leading-relaxed'>
							{t('planFreeDesc')}
						</p>

						<div className='text-3xl font-bold mb-6 text-foreground'>
							{t('planFreePrice')}
						</div>

						<ul className='space-y-3 mb-8'>
							{standardKeys.map((key) => (
								<li
									key={key}
									className='flex items-start gap-2.5 text-sm text-muted-foreground'
								>
									<span className='mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-muted dark:bg-white/10'>
										<Check className='size-3 text-muted-foreground dark:text-white/50' aria-hidden />
									</span>
									<span className='leading-snug'>{t(key)}</span>
								</li>
							))}
						</ul>

						{!isPremium && (
							<Button variant='secondary' className='w-full rounded-xl' disabled>
								{t('planFreeCta')}
							</Button>
						)}
					</motion.div>
				</TiltCard>

				<TiltCard>
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.15 }}
						className='relative rounded-2xl p-[1px] bg-gradient-to-br from-yellow-400 via-yellow-300/80 to-yellow-600 h-full'
					>
						<div className='rounded-2xl border border-border bg-card text-card-foreground p-6 h-full relative overflow-hidden dark:border-transparent dark:bg-[#0e0e0e]'>
							<div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.1),transparent_60%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.15),transparent_60%)]' />

							<div className='absolute top-4 right-4 flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-yellow-400 text-black font-bold shadow-lg shadow-yellow-400/30'>
								<Crown className='size-3 shrink-0' aria-hidden />
								{isPremium ? t('planPremiumBadgeActive') : t('planPremiumBadgeOffer')}
							</div>

							<h2 className='text-xl font-semibold mb-1 flex items-center gap-2 text-foreground pr-24'>
								<Crown className='size-5 text-yellow-500 dark:text-yellow-400 shrink-0' aria-hidden />
								{t('planPremiumTitle')}
							</h2>
							<p className='text-muted-foreground text-sm mb-6 leading-relaxed'>
								{t('planPremiumDesc')}
							</p>

							<div className='flex flex-wrap items-end gap-x-2 gap-y-1 mb-1'>
								<span className='text-3xl font-bold text-yellow-600 dark:text-yellow-400'>
									{t('planPremiumPrice')}
								</span>
							</div>
							<p className='text-xs text-muted-foreground mb-6'>{t('planPremiumPriceHint')}</p>

							<p className='text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3'>
								{t('planPremiumIntro')}
							</p>
							<ul className='space-y-3 mb-8'>
								{premiumKeys.map((key) => (
									<li
										key={key}
										className='flex items-start gap-2.5 text-sm text-foreground'
									>
										<span className='mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-yellow-400/20'>
											<Check className='size-3 text-yellow-600 dark:text-yellow-400' aria-hidden />
										</span>
										<span className='leading-snug'>{t(key)}</span>
									</li>
								))}
							</ul>

							<Button
								onClick={createCheckoutSession}
								disabled={isPending || isPremium}
								className='w-full rounded-xl bg-yellow-400 text-black font-semibold hover:bg-yellow-300 shadow-[0_0_30px_rgba(250,204,21,0.3)] disabled:opacity-100'
							>
								{isPremium ? (
									<>
										<Sparkles className='size-4 mr-2 shrink-0' aria-hidden />
										{t('planPremiumCtaActive')}
									</>
								) : isPending ? (
									<Lottie animationData={loader} loop={true} className='w-20' />
								) : (
									<>
										<Crown className='size-4 mr-2 shrink-0' aria-hidden />
										{t('planPremiumCta')}
									</>
								)}
							</Button>
						</div>
					</motion.div>
				</TiltCard>
			</div>
		</div>
	)
}

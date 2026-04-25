'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Crown, Check, Zap, Shield, Infinity, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRef } from 'react'
import { useCreateCheckoutSession } from '@/hooks/payments/useCreateCheckoutSession'
import Lottie from 'lottie-react'
import loader from '@/assets/animations/loader.json'
import { useGetMe } from '@/hooks/auth/useGetMe'

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

export const Premium = () => {
	const { createCheckoutSession, isPending } = useCreateCheckoutSession()
	const { userData } = useGetMe()
	const isPremium = userData?.isPremium

	const features = [
		{ icon: Zap, title: 'Швидша робота' },
		{ icon: Shield, title: 'Покращена безпека' },
		{ icon: Infinity, title: 'Безлімітний доступ' },
		{ icon: Crown, title: 'Преміум функції' },
	]

	const standardFeatures = [
		'Обмежений функціонал',
		'Стандартна швидкість',
		'Базова підтримка',
	]

	const premiumFeatures = [
		'Усі функції без обмежень',
		'Пріоритетна швидкість',
		'Преміум підтримка 24/7',
		'Нові функції першими',
	]

	return (
		<div className='max-w-5xl mx-auto px-4 py-10'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className='text-center mb-12'
			>
				<div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-400/30 bg-yellow-400/10 text-yellow-400 text-sm font-medium mb-4'>
					<Sparkles className='w-4 h-4' />
					Loomio Premium
				</div>
				<h1 className='text-4xl font-bold bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent'>
					Оновіться до Преміум
				</h1>
				<p className='text-muted-foreground mt-3 max-w-md mx-auto'>
					Відкрийте розширені можливості та отримайте максимум від платформи
				</p>

				<div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8'>
					{features.map(({ icon: Icon, title }, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: i * 0.08 }}
							className='rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col items-center gap-2 hover:border-yellow-400/30 hover:bg-yellow-400/5 transition-colors'
						>
							<Icon className='w-5 h-5 text-yellow-400' />
							<p className='text-xs text-white/70 font-medium'>{title}</p>
						</motion.div>
					))}
				</div>
			</motion.div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto perspective-[1000px]'>
				<TiltCard>
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.1 }}
						className='rounded-2xl border border-white/10 bg-white/5 p-6 h-full backdrop-blur'
					>
						<div className='flex items-center justify-between mb-1'>
							<h2 className='text-xl font-semibold'>Стандарт</h2>
							{!isPremium && (
								<span className='text-xs px-2 py-1 rounded-full bg-white/10 text-white/50'>
									Поточний план
								</span>
							)}
						</div>
						<p className='text-muted-foreground text-sm mb-6'>
							Базові можливості для щоденного використання
						</p>

						<div className='text-3xl font-bold mb-6'>Безкоштовно</div>

						<div className='space-y-3 mb-8'>
							{standardFeatures.map((item, i) => (
								<div
									key={i}
									className='flex items-center gap-2.5 text-sm text-white/70'
								>
									<div className='w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0'>
										<Check className='w-3 h-3 text-white/50' />
									</div>
									{item}
								</div>
							))}
						</div>

						{!isPremium && (
							<Button variant='secondary' className='w-full rounded-xl' disabled>
								Активний план
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
						<div className='rounded-2xl bg-[#0e0e0e] p-6 h-full relative overflow-hidden'>
							<div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.15),transparent_60%)]' />

							<div className='absolute top-4 right-4 flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-yellow-400 text-black font-bold shadow-lg shadow-yellow-400/30'>
								<Crown className='w-3 h-3' />
								{isPremium ? 'АКТИВНИЙ' : 'PREMIUM'}
							</div>

							<h2 className='text-xl font-semibold mb-1 flex items-center gap-2'>
								<Crown className='w-5 h-5 text-yellow-400' />
								Premium
							</h2>
							<p className='text-muted-foreground text-sm mb-6'>
								Максимум можливостей для продуктивної роботи
							</p>

							<div className='flex items-end gap-1 mb-1'>
								<span className='text-3xl font-bold text-yellow-400'>$10</span>
								<span className='text-sm text-white/40 mb-1'>/ міс</span>
							</div>
							<p className='text-xs text-white/30 mb-6'>Оплата щомісяця, скасування будь-коли</p>

							<div className='space-y-3 mb-8'>
								{premiumFeatures.map((item, i) => (
									<div key={i} className='flex items-center gap-2.5 text-sm'>
										<div className='w-5 h-5 rounded-full bg-yellow-400/20 flex items-center justify-center shrink-0'>
											<Check className='w-3 h-3 text-yellow-400' />
										</div>
										{item}
									</div>
								))}
							</div>

							<Button
								onClick={createCheckoutSession}
								disabled={isPending || isPremium}
								className='w-full rounded-xl bg-yellow-400 text-black font-semibold hover:bg-yellow-300 shadow-[0_0_30px_rgba(250,204,21,0.3)] disabled:opacity-100'
							>
								{isPremium ? (
									<>
										<Sparkles className='w-4 h-4 mr-2' />
										Активний план
									</>
								) : isPending ? (
									<Lottie animationData={loader} loop={true} className='w-20' />
								) : (
									<>
										<Crown className='w-4 h-4 mr-2' />
										Придбати
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

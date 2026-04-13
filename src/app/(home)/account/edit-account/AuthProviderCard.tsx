'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface AuthProviderCardProps {
	provider: string
	description?: string
	icon: ReactNode
	isConnected: boolean
	onDisconnect?: () => void
}

export function AuthProviderCard({
	provider,
	description,
	icon,
	isConnected,
	onDisconnect,
}: AuthProviderCardProps) {
	if (!isConnected) return null

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className='max-w-6xl mx-auto mt-6'
		>
			<div className='relative rounded-xl border border-white/10 bg-white/5 backdrop-blur p-6 overflow-hidden'>
				<div className='absolute left-0 top-0 h-full w-[4px] bg-gradient-to-b from-primary via-primary/60 to-transparent blur-[1px]' />

				<div className='flex items-center justify-between gap-4'>
					<div className='flex items-center gap-4'>
						<div className='w-12 h-12 flex items-center justify-center rounded-full bg-white'>
							{icon}
						</div>

						<div>
							<p className='text-sm text-white/60'>Connected account</p>
							<p className='text-lg font-semibold capitalize'>{provider}</p>
							{description && (
								<p className='text-xs text-white/40 mt-1'>{description}</p>
							)}
						</div>
					</div>

					<div className='flex items-center gap-3'>
						<div className='text-xs text-green-400 bg-green-400/10 px-3 py-1 rounded-full'>
							Connected
						</div>

						{onDisconnect && (
							<Button variant='destructive' size='sm' onClick={onDisconnect}>
								Disconnect
							</Button>
						)}
					</div>
				</div>
			</div>
		</motion.div>
	)
}

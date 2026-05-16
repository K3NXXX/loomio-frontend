'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

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
	const t = useTranslations()

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className='max-w-6xl mx-auto mt-4 min-[400px]:mt-6 px-2 min-[400px]:px-4 min-[600px]:px-0'
		>
			<div className='relative rounded-xl border border-border bg-card backdrop-blur p-3 min-[400px]:p-5 min-[600px]:p-6 overflow-hidden dark:border-white/10 dark:bg-white/5'>
				<div className='absolute left-0 top-0 h-full w-[4px] bg-gradient-to-b from-primary via-primary/60 to-transparent blur-[1px]' />

				<div className='flex flex-col min-[500px]:flex-row min-[500px]:items-center justify-between gap-3 min-[500px]:gap-4'>
					<div className='flex items-center gap-3 min-[400px]:gap-4'>
						<div className='w-9 h-9 min-[400px]:w-12 min-[400px]:h-12 shrink-0 flex items-center justify-center rounded-full bg-white'>
							{icon}
						</div>

						<div>
							<p className='text-xs min-[400px]:text-sm text-muted-foreground'>
								{t(
									'accountPage.editAccount.authProvider.connectedAccountLabel',
								)}
							</p>
							<p className='text-base min-[400px]:text-lg font-semibold capitalize text-foreground'>
								{provider}
							</p>
							{description && (
								<p className='text-[10px] min-[400px]:text-xs text-muted-foreground mt-1'>
									{description}
								</p>
							)}
						</div>
					</div>

					<div className='flex items-center gap-2 min-[400px]:gap-3'>
						<div className='text-[10px] min-[400px]:text-xs text-green-400 bg-green-400/10 px-2 min-[400px]:px-3 py-1 rounded-full'>
							{t('accountPage.editAccount.authProvider.connectedBadge')}
						</div>

						{onDisconnect && (
							<Button
								variant='destructive'
								size='sm'
								className='text-xs min-[400px]:text-sm h-7 min-[400px]:h-9 px-2.5 min-[400px]:px-4'
								onClick={onDisconnect}
							>
								{t('accountPage.editAccount.authProvider.disconnectButton')}
							</Button>
						)}
					</div>
				</div>
			</div>
		</motion.div>
	)
}

'use client'

import {
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { Info } from 'lucide-react'
import { useTranslations } from 'next-intl'

type AudienceHintNamespace = 'uploadVideoModal' | 'editVideo'

interface AudienceInfoHintProps {
	namespace: AudienceHintNamespace
}

export function AudienceInfoHint({ namespace }: AudienceInfoHintProps) {
	const t = useTranslations(`${namespace}.stepSecond`)

	return (
		<TooltipProvider delayDuration={200}>
			<TooltipPrimitive.Root>
				<TooltipTrigger asChild>
					<button
						type='button'
						className='inline-flex shrink-0 items-center justify-center rounded-full p-1 text-muted-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40'
						aria-label={t('audienceInfoAria')}
					>
						<Info className='h-4 w-4' />
					</button>
				</TooltipTrigger>
				<TooltipContent
					side='top'
					sideOffset={8}
					className='max-w-[min(320px,90vw)] px-3 py-2.5 text-xs leading-relaxed'
				>
					<p className='font-semibold text-foreground'>
						{t('audienceDifferenceTitle')}
					</p>
					<p className='mt-2 space-y-2 whitespace-pre-line text-muted-foreground'>
						{t('audienceDifferenceBody')}
					</p>
				</TooltipContent>
			</TooltipPrimitive.Root>
		</TooltipProvider>
	)
}

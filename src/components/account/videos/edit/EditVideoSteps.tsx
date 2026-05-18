'use client'

import { useTranslations } from 'next-intl'

interface IEditVideoStepsProps {
	currentStep: number
	publishType: string
}

const scheduledSteps = [
	{ number: 1, labelKey: 'general' as const },
	{ number: 2, labelKey: 'additional' as const },
	{ number: 3, labelKey: 'schedule' as const },
	{ number: 4, labelKey: 'chapters' as const },
]

const publishedNowSteps = [
	{ number: 1, labelKey: 'general' as const },
	{ number: 2, labelKey: 'additional' as const },
	{ number: 3, labelKey: 'chapters' as const },
]

export function EditVideoSteps({
	currentStep,
	publishType,
}: IEditVideoStepsProps) {
	const t = useTranslations('videoWizard.steps')
	const steps =
		publishType === 'scheduled' ? scheduledSteps : publishedNowSteps

	return (
		<div className='flex flex-wrap items-center justify-center gap-6 max-[640px]:gap-4'>
			{steps.map((step, index) => (
				<div
					key={step.number}
					className='flex items-center gap-6 max-[640px]:gap-4'
				>
					<div className='flex flex-col items-center gap-1'>
						<div
							className={`relative flex h-10 w-10 items-center justify-center rounded-full font-semibold shadow-md transition
								${
									currentStep === step.number
										? 'bg-primary text-primary-foreground'
										: 'border border-border bg-muted text-muted-foreground'
								}
							`}
						>
							<span>{step.number}</span>
							{currentStep === step.number && (
								<div className='absolute inset-0 animate-pulse rounded-full ring-4 ring-primary/30' />
							)}
						</div>
						<span
							className={`mt-1 text-sm font-medium transition
								${
									currentStep === step.number
										? 'text-foreground'
										: 'text-muted-foreground'
								}
							`}
						>
							{t(step.labelKey)}
						</span>
					</div>

					{index < steps.length - 1 && (
						<div
							className={`h-[2px] w-12 rounded-full transition max-[640px]:w-8
								${
									currentStep >= step.number + 1
										? 'bg-gradient-to-r from-primary to-primary/60'
										: 'bg-border'
								}
							`}
						/>
					)}
				</div>
			))}
		</div>
	)
}


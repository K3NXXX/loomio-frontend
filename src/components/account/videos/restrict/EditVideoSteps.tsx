'use client'

import { useTranslations } from 'next-intl'

interface IEditVideoStepsProps {
	currentStep: number
	publishType: string
}

const baseSteps = [
	{ number: 1, labelKey: 'general' as const },
	{ number: 2, labelKey: 'additional' as const },
]

export function EditVideoSteps({
	currentStep,
	publishType,
}: IEditVideoStepsProps) {
	const t = useTranslations('videoWizard.steps')

	const steps =
		publishType === 'scheduled'
			? [...baseSteps, { number: 3, labelKey: 'schedule' as const }]
			: baseSteps

	return (
		<div className='flex items-center justify-center gap-10'>
			{steps.map((step, index) => (
				<div key={step.number} className='flex items-center gap-10'>
					<div className='flex flex-col items-center gap-1'>
						<div
							className={`relative flex items-center justify-center w-10 h-10 rounded-full font-semibold shadow-md transition
								${currentStep === step.number ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground border border-border'}
							`}
						>
							<span>{step.number}</span>
							{currentStep === step.number && (
								<div className='absolute inset-0 rounded-full ring-4 ring-primary/30 animate-pulse' />
							)}
						</div>
						<span
							className={`text-sm font-medium mt-1 transition
								${currentStep === step.number ? 'text-foreground' : 'text-muted-foreground'}
							`}
						>
							{t(step.labelKey)}
						</span>
					</div>

					{index < steps.length - 1 && (
						<div
							className={`h-[2px] w-20 rounded-full transition
								${currentStep >= step.number + 1 ? 'bg-gradient-to-r from-primary to-primary/60' : 'bg-border'}
							`}
						/>
					)}
				</div>
			))}
		</div>
	)
}

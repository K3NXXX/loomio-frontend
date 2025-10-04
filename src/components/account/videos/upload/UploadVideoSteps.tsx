interface UploadVideoStepsProps {
	currentStep: number
}

const steps = [
	{ number: 1, label: 'General' },
	{ number: 2, label: 'Additional' },
	{ number: 3, label: 'Schedule' },
]

export function UploadVideoSteps({ currentStep }: UploadVideoStepsProps) {
	return (
		<div className='flex items-center justify-center gap-10'>
			{steps.map((step, index) => (
				<div key={step.number} className='flex items-center gap-10'>
					<div className='flex flex-col items-center gap-1'>
						<div
							className={`relative flex items-center justify-center w-10 h-10 rounded-full font-semibold shadow-md transition
								${currentStep === step.number ? 'bg-primary text-white' : 'bg-neutral-800 text-gray-300 border border-neutral-700'}
							`}
						>
							<span>{step.number}</span>
							{currentStep === step.number && (
								<div className='absolute inset-0 rounded-full ring-4 ring-primary/30 animate-pulse' />
							)}
						</div>
						<span
							className={`text-sm font-medium mt-1 transition
								${currentStep === step.number ? 'text-white' : 'text-gray-400'}
							`}
						>
							{step.label}
						</span>
					</div>

					{index < steps.length - 1 && (
						<div
							className={`h-[2px] w-20 rounded-full transition
								${currentStep >= step.number + 1 ? 'bg-gradient-to-r from-primary to-primary/60' : 'bg-neutral-700'}
							`}
						/>
					)}
				</div>
			))}
		</div>
	)
}

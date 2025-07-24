interface IStepIndicatorProps {
	number: number
	active: boolean
	label: string
}

export function StepIndicator({number, active, label}: IStepIndicatorProps) {
	return <div className='flex items-center flex-col'>
			<div
				className={`rounded-full w-7 h-7 flex justify-center items-center transition-colors`}
				style={{
					backgroundColor: active ? 'var(--primary)' : 'var(--muted)',
				}}
			>
				<span
					className='font-bold text-[16px] leading-none'
					style={{
						color: active ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
					}}
				>
					{number}
				</span>
			</div>
			<p className='font-medium'>{label}</p>
		</div>
}

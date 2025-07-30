'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getInitials } from '@/utils/get-initials'
import { truncateName } from '@/utils/truncateName'
import { useProjectStore } from '@/zustand/store/projectStore'

interface IFormThirdStepProps {
	setStep: (step: number) => void
	projectName: string
	projectDescription: string
}

export function FormThirdStep({
	setStep,
	projectName,
	projectDescription,
}: IFormThirdStepProps) {
	const { selectedMembers } = useProjectStore()
	return (
		<div className='flex flex-col h-full'>
			<div className='flex flex-col gap-3 flex-grow'>
				<div className='flex flex-col flex-1'>
					<p className='mb-2'>Total project info</p>
					<div className='flex flex-col gap-1 h-70 overflow-y-auto'>
						<div className='w-[98%] break-words text-muted-foreground flex flex-col'>
							<span
								className='font-medium mr-1'
								style={{ color: 'var(--primary)' }}
							>
								Project name
							</span>
							<p>{projectName}</p>
						</div>
						<div className='w-[98%] break-words  text-muted-foreground'>
							<span
								className='font-medium mr-1'
								style={{ color: 'var(--primary)' }}
							>
								Project description
							</span>
							<p>{projectDescription}</p>
						</div>
						<div>
							<p className='font-medium' style={{ color: 'var(--primary)' }}>
								<span>Project members</span>
							</p>
						</div>
						<ul className='flex flex-col gap-2 pr-2'>
							{selectedMembers.length > 0 ? (
								selectedMembers.map((member) => (
									<li
										className='flex items-center justify-between gap-3 bg-neutral-800 rounded-sm py-[6px] px-4 relative'
										key={member.id}
									>
										<div className='flex justify-between gap-3'>
											<Avatar>
												<AvatarImage src={member.avatarUrl ?? undefined} />
												<AvatarFallback>
													{getInitials(member.name)}
												</AvatarFallback>
											</Avatar>
											<div className='flex flex-col'>
												<p className='font-semibold text-sm'>
													{' '}
													{truncateName(member?.username || '')}
												</p>
												<p className='text-xs text-muted-foreground'>
													{' '}
													{truncateName(member?.name || '')}
												</p>
											</div>
											<div className='absolute top-[8px] right-3 flex items-center gap-3'></div>
										</div>
										<p className='font-medium text-[14px]'>{member.role}</p>
									</li>
								))
							) : (
								<p className='text-muted-foreground'>
									You did not add any members.{' '}
									<span
										onClick={() => setStep(2)}
										className='text-white cursor-pointer'
									>
										Add members?
									</span>
								</p>
							)}
						</ul>
					</div>
				</div>
			</div>

			<div className='pt-5 flex justify-between'>
				<Button
					onClick={() => setStep(2)}
					type='button'
					variant='secondary'
					className='w-25 font-bold'
				>
					Back
				</Button>
				<Button
					onClick={() => setStep(3)}
					type='button'
					className='w-25 font-bold px-5'
				>
					Confirm
				</Button>
			</div>
		</div>
	)
}

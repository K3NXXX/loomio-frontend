import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
	FaCirclePlus,
	FaRegCalendarDays,
	FaSquareArrowUpRight,
} from 'react-icons/fa6'
import { RiTeamFill } from 'react-icons/ri'
import { TiPlus } from 'react-icons/ti'
export function ProjectsList() {
	return (
		<div>
			<p className='font-bold text-[24px] mb-5'>Your projects</p>
			<div className='grid grid-cols-3 gap-7'>
				<Card className='flex flex-col justify-center text-center items-center gap-2 min-h-[450px] '>
					<FaCirclePlus size={40} />
					<p className='font-bold text-[20px]'>Create new project</p>
					<p className='max-w-[250px]'>
						Start new project and reach your goals together with teams
					</p>
					<Button className='font-bold mt-2 flex'>
						<TiPlus />
						<p className='text-[16px]'>Create project</p>
					</Button>
				</Card>
				<Card className='px-7 gap-1 border-l border-red-500 min-h-[450px]'>
					<p className='font-bold text-[20px]'>Website redesign</p>
					<p className='text-[#838383]'>
						Complete revamp of the corporate website with a new design and
						enhanced functionality
					</p>
					<div className='flex justify-between my-3 mb-5'>
						<Badge className='font-bold text-[14px] px-4 bg-green-700'>Active</Badge>
						<p className='font-bold'>75%</p>
					</div>
					<Progress className='mb-5' value={75} />
					<div className='flex justify-between'>
						<div className='flex gap-2 items-center'>
							<FaRegCalendarDays />
							<p>15 Feb</p>
						</div>
						<div className='flex gap-2 items-center'>
							<RiTeamFill />
							<p>5 member</p>
						</div>
					</div>

					<div className='mt-10 flex justify-between items-end flex-1'>
						<p className='font-bold'>Detail</p>
						<Button className='!px-5 flex items-center gap-2'>
							<FaSquareArrowUpRight /> <p className='font-bold'>Open</p>
						</Button>
					</div>
				</Card>
				<Card className='px-7 gap-1 border-l border-red-500 min-h-[450px]'>
					<p className='font-bold text-[20px]'>Website redesign</p>
					<p className='text-[#838383]'>
						Complete revamp of the corporate website with a new design and
						enhanced functionality
					</p>
					<div className='flex justify-between my-3 mb-5'>
						<Badge className='font-bold text-[14px] px-4 bg-yellow-700'>Pending</Badge>
						<p className='font-bold'>75%</p>
					</div>
					<Progress className='mb-5' value={75} />
					<div className='flex justify-between'>
						<div className='flex gap-2 items-center'>
							<FaRegCalendarDays />
							<p>15 Feb</p>
						</div>
						<div className='flex gap-2 items-center'>
							<RiTeamFill />
							<p>5 member</p>
						</div>
					</div>

					<div className='mt-10 flex justify-between items-end flex-1'>
						<p className='font-bold'>Detail</p>
						<Button className='!px-5 flex items-center gap-2'>
							<FaSquareArrowUpRight /> <p className='font-bold'>Open</p>
						</Button>
					</div>
				</Card>
				<Card className='px-7 gap-1 border-l border-red-500 min-h-[450px]'>
					<p className='font-bold text-[20px]'>Website redesign</p>
					<p className='text-[#838383]'>
						Complete revamp of the corporate website with a new design and
						enhanced functionality
					</p>
					<div className='flex justify-between my-3 mb-5'>
						<Badge className='font-bold text-[14px] px-4 bg-yellow-700'>Pending</Badge>
						<p className='font-bold'>75%</p>
					</div>
					<Progress className='mb-5' value={75} />
					<div className='flex justify-between'>
						<div className='flex gap-2 items-center'>
							<FaRegCalendarDays />
							<p>15 Feb</p>
						</div>
						<div className='flex gap-2 items-center'>
							<RiTeamFill />
							<p>5 member</p>
						</div>
					</div>

					<div className='mt-10 flex justify-between items-end flex-1'>
						<p className='font-bold'>Detail</p>
						<Button className='!px-5 flex items-center gap-2'>
							<FaSquareArrowUpRight /> <p className='font-bold'>Open</p>
						</Button>
					</div>
				</Card>
				<Card className='px-7 gap-1 border-l border-red-500 min-h-[450px]'>
					<p className='font-bold text-[20px]'>Website redesign</p>
					<p className='text-[#838383]'>
						Complete revamp of the corporate website with a new design and
						enhanced functionality
					</p>
					<div className='flex justify-between my-3 mb-5'>
						<Badge className='font-bold text-[14px] px-4 bg-yellow-700'>Active</Badge>
						<p className='font-bold'>75%</p>
					</div>
					<Progress className='mb-5' value={75} />
					<div className='flex justify-between'>
						<div className='flex gap-2 items-center'>
							<FaRegCalendarDays />
							<p>15 Feb</p>
						</div>
						<div className='flex gap-2 items-center'>
							<RiTeamFill />
							<p>5 member</p>
						</div>
					</div>

					<div className='mt-10 flex justify-between items-end flex-1'>
						<p className='font-bold'>Detail</p>
						<Button className='!px-5 flex items-center gap-2'>
							<FaSquareArrowUpRight /> <p className='font-bold'>Open</p>
						</Button>
					</div>
				</Card>
				<Card className='px-7 gap-1 border-l border-red-500 min-h-[450px]'>
					<p className='font-bold text-[20px]'>Website redesign</p>
					<p className='text-[#838383]'>
						Complete revamp of the corporate website with a new design and
						enhanced functionality
					</p>
					<div className='flex justify-between my-3 mb-5'>
						<Badge className='font-bold text-[14px] px-4 bg-yellow-700'>Pending</Badge>
						<p className='font-bold'>75%</p>
					</div>
					<Progress className='mb-5' value={75} />
					<div className='flex justify-between'>
						<div className='flex gap-2 items-center'>
							<FaRegCalendarDays />
							<p>15 Feb</p>
						</div>
						<div className='flex gap-2 items-center'>
							<RiTeamFill />
							<p>5 member</p>
						</div>
					</div>

					<div className='mt-10 flex justify-between items-end flex-1'>
						<p className='font-bold'>Detail</p>
						<Button className='!px-5 flex items-center gap-2'>
							<FaSquareArrowUpRight /> <p className='font-bold'>Open</p>
						</Button>
					</div>
				</Card>
			</div>
		</div>
	)
}

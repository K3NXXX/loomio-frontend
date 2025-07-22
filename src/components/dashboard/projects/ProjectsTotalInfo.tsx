import { Card } from '@/components/ui/card'
import { FaProjectDiagram } from 'react-icons/fa'
import { IoStatsChart } from 'react-icons/io5'
import { RiTeamFill } from "react-icons/ri";
import { FaRegCalendarDays } from "react-icons/fa6";
export function ProjectsTotalInfo() {
	return (
		<div className='grid grid-cols-4 gap-5'>
			<Card className='px-6 gap-2'>
				<div className='flex justify-between items-center'>
					<p>Projects in total</p>
					<FaProjectDiagram />
				</div>
				<p className='font-bold text-[30px]'>5</p>
				<p>3 active</p>
			</Card>
			<Card className='px-6 gap-2'>
				<div className='flex justify-between items-center'>
					<p>Average progress</p>
					<IoStatsChart />
				</div>
				<p className='font-bold text-[30px]'>65%</p>
				<p>65% across all projects</p>
			</Card>
			<Card className='px-6 gap-2'>
				<div className='flex justify-between items-center'>
					<p>Team member</p>
					<RiTeamFill />
				</div>
				<p className='font-bold text-[30px]'>27</p>
				<p>working on projects</p>
			</Card>
			<Card className='px-6 gap-2'>
				<div className='flex justify-between items-center'>
					<p>Upcoming deadlines</p>
					<FaRegCalendarDays />
				</div>
				<p className='font-bold text-[30px]'>3</p>
				<p>This week</p>
			</Card>
		</div>
	)
}

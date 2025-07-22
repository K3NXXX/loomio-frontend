'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { BsGridFill } from 'react-icons/bs'
import { FaList } from 'react-icons/fa6'
import { IoClose, IoSearchSharp } from 'react-icons/io5'
export function ProjectsInput() {
	const [searchValue, setSearchValue] = useState('')

	return (
		<div className='flex justify-between'>
			<div className='flex w-full'>
				<div className='relative flex-1 max-w-[350px]'>
					<IoSearchSharp size={20} className='absolute top-3 left-3'/>

					{searchValue && (
						<IoClose onClick={() => setSearchValue('')} size={20} className='absolute top-3 right-3 cursor-pointer'/>
					)}
					<Input
						value={searchValue}
						onChange={e => setSearchValue(e.target.value)}
						className='py-5 px-10'
						placeholder='Search projects...'
					/>
				</div>
			</div>
			<div className='flex gap-2'>
				<Button>
					<BsGridFill />
				</Button>
				<Button>
					<FaList />
				</Button>
			</div>
		</div>
	)
}

'use client'
import { useEffect, useState } from 'react'

import { IoClose, IoSearchSharp } from 'react-icons/io5'
import { useDebounce } from 'use-debounce'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSearchProjectMembers } from '@/hooks/project/useSearchProjectMembers'
import { useProjectStore } from '@/zustand/store/projectStore'

import { ISearchProjectMembersResponse } from '@/types/project.types'
import { AddedMembersList } from './AddedMembersList'
import { SearchMembersList } from './SearchMembersList'

interface IFormSecondStepProps {
	setStep: (step: number) => void
}

export function FormSecondStep({ setStep }: IFormSecondStepProps) {
	const [cursor, setCursor] = useState<string | undefined>(undefined)
	const [members, setMembers] = useState<ISearchProjectMembersResponse[]>([])
	const [searchValue, setSearchValue] = useState('')
	const [debouncedSearchValue] = useDebounce(searchValue, 500)
	const { selectedMembers } = useProjectStore()
	const [isSearchListVisible, setIsSearchListVisible] = useState(true)
	const { fetchedMembers, searchProjectMembersLoading } =
		useSearchProjectMembers({
			name: debouncedSearchValue,
			take: 3,
			cursor,
		})

	useEffect(() => {
		setMembers([])
		setCursor(undefined)
	}, [debouncedSearchValue])

	useEffect(() => {
		if (fetchedMembers && fetchedMembers.length > 0) {
			setMembers((prev) => [...prev, ...fetchedMembers])
			setCursor(fetchedMembers[fetchedMembers.length - 1].id)
		}
	}, [fetchedMembers])
	useEffect(() => {
		if (searchValue) {
			setIsSearchListVisible(true)
		}
	}, [searchValue])

	return (
		<div className='flex flex-col h-full'>
			<div className='flex flex-col gap-3 flex-grow'>
				<div className='flex flex-col flex-1'>
					<p className='text-white mb-2'>
						Add members to your project (optional)
					</p>
					<div className='relative flex-1'>
						<IoSearchSharp size={20} className='absolute top-3 left-3' />
						{searchValue && (
							<IoClose
								onClick={() => setSearchValue('')}
								size={20}
								className='absolute top-3 right-3 cursor-pointer'
							/>
						)}
						<Input
							value={searchValue}
							onChange={(e) => setSearchValue(e.target.value)}
							className='py-5 px-10 w-full'
							placeholder='Search members...'
						/>
						{isSearchListVisible && searchValue && members && (
							<SearchMembersList
								members={members}
								setSearchValue={setSearchValue}
								setIsSearchListVisible={setIsSearchListVisible}
								searchProjectMembersLoading={searchProjectMembersLoading}
							/>
						)}
						{selectedMembers.length > 0 && <AddedMembersList />}
					</div>
				</div>
			</div>

			<div className='pt-5 flex justify-between'>
				<Button
					onClick={() => setStep(1)}
					type='button'
					variant='secondary'
					className='w-25 font-bold'
				>
					Back
				</Button>
				<Button
					onClick={() => setStep(3)}
					type='button'
					className='w-25 font-bold'
				>
					Next step
				</Button>
			</div>
		</div>
	)
}

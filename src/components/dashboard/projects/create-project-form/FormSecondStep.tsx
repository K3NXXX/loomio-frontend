'use client'
import { useEffect, useState } from 'react'

import { IoClose, IoSearchSharp } from 'react-icons/io5'
import { useDebounce } from 'use-debounce'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSearchProjectMembers } from '@/hooks/project/useSearchProjectMembers'
import { useProjectStore } from '@/zustand/store/projectStore'

import { AddedMembersList } from './AddedMembersList'
import { SearchMembersList } from './SearchMembersList'

import type {
	ISearchProjectMembersResponse,
	TCreateProjectSteps,
} from '@/types/project.types'

interface IFormSecondStepProps {
	setStep: (step: TCreateProjectSteps) => void
}

export default function FormSecondStep({ setStep }: IFormSecondStepProps) {
	const [searchValue, setSearchValue] = useState('')
	const [cursor, setCursor] = useState<string | undefined>(undefined)
	const [members, setMembers] = useState<ISearchProjectMembersResponse[]>([])
	const [isSearchListVisible, setIsSearchListVisible] = useState(true)
	const [debouncedSearchValue] = useDebounce(searchValue, 500)

	const { selectedMembers } = useProjectStore()
	const { fetchedMembers, searchProjectMembersLoading } =
		useSearchProjectMembers({
			name: debouncedSearchValue,
			take: 5,
			cursor,
		})

	useEffect(() => {
		if (debouncedSearchValue.length >= 2) {
			setCursor(undefined)
			setMembers([])
		} else {
			setMembers([])
		}
	}, [debouncedSearchValue])

	useEffect(() => {
		if (!fetchedMembers) return

		if (cursor) {
			setMembers((prev) => [...prev, ...fetchedMembers])
		} else {
			setMembers(fetchedMembers)
		}
	}, [fetchedMembers, cursor])

	const onLoadMore = () => {
		if (
			!searchProjectMembersLoading &&
			members.length > 0 &&
			fetchedMembers?.length === 5
		) {
			setCursor(members[members.length - 1].id)
		}
	}

	useEffect(() => {
		if (searchValue) {
			setIsSearchListVisible(true)
		}
	}, [searchValue])

	return (
		<div className='flex flex-col h-full'>
			<div className='flex flex-col gap-3 flex-grow'>
				<div className='flex flex-col flex-1'>
					<label htmlFor='project-members' className='text-white mb-2'>
						Add members to your project (optional)
					</label>
					<div className='relative flex-1'>
						<IoSearchSharp size={20} className='absolute top-3 left-3' />
						{searchValue && (
							<IoClose
								aria-label='Clear search'
								onClick={() => setSearchValue('')}
								size={20}
								className='absolute top-3 right-3 cursor-pointer'
							/>
						)}
						<Input
							id='project-members'
							autoFocus
							value={searchValue}
							onChange={(e) => setSearchValue(e.target.value)}
							className='py-5 px-10 w-full'
							placeholder='Search members...'
						/>
						{isSearchListVisible && searchValue && members && (
							<SearchMembersList
								members={members}
								searchValue={searchValue}
								setSearchValue={setSearchValue}
								setIsSearchListVisible={setIsSearchListVisible}
								searchProjectMembersLoading={searchProjectMembersLoading}
								onLoadMore={onLoadMore}
							/>
						)}
						{selectedMembers.length > 0 && (
							<AddedMembersList searchValue={searchValue} />
						)}
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

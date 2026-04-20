'use client'

import { Input } from '@/components/ui/input'
import { PAGES } from '@/constants/pages.constants'
import { cn } from '@/lib/utils'
import debounce from 'lodash/debounce'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { IoCloseOutline, IoSearch } from 'react-icons/io5'
import { SearchSuggestions } from '../search/SearchSuggestions'

interface IHeaderSearchProps {
	className?: string
}

export function HeaderSearch({ className }: IHeaderSearchProps) {
	const [search, setSearch] = useState('')
	const [debouncedSearch, setDebouncedSearch] = useState('')
	const router = useRouter()
	const t = useTranslations()

	const debouncedUpdate = useCallback(
		debounce((value: string) => {
			setDebouncedSearch(value)
		}, 1000),
		[],
	)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value)
		debouncedUpdate(e.target.value)
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (!search.trim()) return
		router.push(PAGES.SEARCH(encodeURIComponent(search.trim())))
		setSearch('')
		setDebouncedSearch('')
	}

	const handleSelect = (label: string) => {
		router.push(PAGES.SEARCH(encodeURIComponent(label)))
		setSearch('')
		setDebouncedSearch('')
	}

	const handleClear = () => {
		setSearch('')
		setDebouncedSearch('')
		debouncedUpdate.cancel()
	}

	return (
		<div className={cn('flex-1 max-w-[500px] mx-4 relative', className)}>
			<form onSubmit={handleSubmit}>
				<IoSearch
					onClick={(e) => handleSubmit(e)}
					className='absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground size-5 cursor-pointer'
				/>

				<Input
					type='text'
					value={search}
					onChange={handleChange}
					placeholder={t('header.search')}
					className='w-full pl-12 pr-12 py-3 text-base rounded-xl bg-muted
					focus:ring-2 focus:ring-primary transition-all duration-300 ease-in-out'
				/>

				{search && (
					<IoCloseOutline
						className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground size-5 cursor-pointer hover:text-foreground transition-colors'
						onClick={handleClear}
					/>
				)}
			</form>

			<SearchSuggestions query={debouncedSearch} onSelect={handleSelect} />
		</div>
	)
}

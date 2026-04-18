'use client'

import { Input } from '@/components/ui/input'
import { PAGES } from '@/constants/pages.constants'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { IoCloseOutline, IoSearch } from 'react-icons/io5'
import { SearchSuggestions } from '../search/SearchSuggestions'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface IHeaderSearchProps {
	className?: string
}

export function HeaderSearch({ className }: IHeaderSearchProps) {
	const [search, setSearch] = useState('')
	const router = useRouter()
	const t = useTranslations()

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (!search.trim()) return
		router.push(PAGES.SEARCH(encodeURIComponent(search.trim())))
		setSearch('')
	}

	const handleSelect = (label: string) => {
		router.push(PAGES.SEARCH(encodeURIComponent(label)))
		setSearch('')
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
					onChange={(e) => setSearch(e.target.value)}
					placeholder={t('header.search')}
					className='w-full pl-12 pr-12 py-3 text-base rounded-xl bg-muted 
					focus:ring-2 focus:ring-primary transition-all duration-300 ease-in-out'
				/>

				{search && (
					<IoCloseOutline
						className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground size-5 cursor-pointer hover:text-foreground transition-colors'
						onClick={() => setSearch('')}
					/>
				)}
			</form>

			<SearchSuggestions query={search} onSelect={handleSelect} />
		</div>
	)
}

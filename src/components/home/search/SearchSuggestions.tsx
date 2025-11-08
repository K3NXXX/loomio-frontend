'use client'

import { useGetSearchSuggestions } from '@/hooks/search/useSearchSuggestions'
import { AnimatePresence, motion } from 'framer-motion'
import { IoSearch } from 'react-icons/io5'

interface SearchSuggestionsProps {
	query: string
	onSelect: (label: string) => void
}

export function SearchSuggestions({ query, onSelect }: SearchSuggestionsProps) {
	const { searchSuggestions, isLoading } = useGetSearchSuggestions(query)

	if (!query.trim()) return null

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0, y: -6 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -6 }}
				transition={{ duration: 0.15 }}
				className='absolute top-full left-0 right-0 mt-2 z-50 rounded-xl 
				border border-border/50 bg-popover shadow-lg overflow-hidden backdrop-blur-md'
			>
				{isLoading ? (
					<div className='p-4 text-sm text-muted-foreground text-center'>
						Loading...
					</div>
				) : searchSuggestions?.length ? (
					<ul className='divide-y divide-border/40'>
						{searchSuggestions.map((s) => (
							<li key={s.id}>
								<button
									type='button'
									onClick={() => onSelect(s.label)}
									className='flex w-full items-center gap-3 p-3 hover:bg-muted/70 
									transition-colors text-left cursor-pointer'
								>
									<IoSearch className='text-muted-foreground size-5 shrink-0' />
									<span className='truncate'>{s.label}</span>
								</button>
							</li>
						))}
					</ul>
				) : (
					<div className='p-4 text-sm text-muted-foreground text-center'>
						No results found
					</div>
				)}
			</motion.div>
		</AnimatePresence>
	)
}

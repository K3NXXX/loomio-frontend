'use client'

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import UserChannelsList from '../UserChannelsList'
import { useState } from 'react'
import { X } from 'lucide-react'
import CreateChannelModal from '@/components/account/channels/CreateChannelModal'

interface Props {
	open: boolean
	onOpenChange: (v: boolean) => void
}

export function UserChannelsModal({ open, onOpenChange }: Props) {
	const [search, setSearch] = useState('')
	const [isCreateOpen, setIsCreateOpen] = useState(false)

	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className='max-w-5xl w-full'>
					<DialogHeader className='space-y-2'>
						<DialogTitle>Your Channels</DialogTitle>
						<p className='text-sm text-muted-foreground'>
							Manage your channels, search through them, or{' '}
							<button
								onClick={() => setIsCreateOpen(true)}
								className='text-primary hover:underline cursor-pointer font-bold'
							>
								create a new one
							</button>
						</p>
					</DialogHeader>

					<div className='mt-4 relative'>
						<Input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder='Search your channels...'
							className='h-9 pr-10 text-sm'
						/>

						{search && (
							<button
								onClick={() => setSearch('')}
								className='absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted'
							>
								<X size={16} />
							</button>
						)}
					</div>

					<div className='mt-4 min-h-[150px]'>
						<UserChannelsList search={search} />
					</div>
				</DialogContent>
			</Dialog>

			<CreateChannelModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
		</>
	)
}

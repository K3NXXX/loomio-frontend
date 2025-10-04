'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'

type Video = {
	title: string
	thumbnail: string
	createdAt: string
}

export default function Account() {
	const [videos, setVideos] = useState<Video[]>([
		{
			title: 'My first video',
			thumbnail: 'https://picsum.photos/seed/11/600/400',
			createdAt: '2024-05-01',
		},
		{
			title: 'Vacation Vlog',
			thumbnail: 'https://picsum.photos/seed/12/600/400',
			createdAt: '2024-06-10',
		},
	])

	const [title, setTitle] = useState('')
	const [thumbnail, setThumbnail] = useState('')

	const addVideo = () => {
		if (!title || !thumbnail) return
		const newVideo: Video = {
			title,
			thumbnail,
			createdAt: new Date().toISOString().split('T')[0],
		}
		setVideos([newVideo, ...videos])
		setTitle('')
		setThumbnail('')
	}

	return (
		<div className='min-h-screen px-4 py-10'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
				className='max-w-6xl mx-auto'
			>
				{/* Profile header */}
				<div className='flex flex-col md:flex-row md:items-center gap-6 mb-10'>
					<div className='relative w-28 h-28 rounded-full overflow-hidden ring-4 ring-primary/30 shadow-lg'>
						<Image
							src='https://i.pravatar.cc/200?img=12'
							alt='User avatar'
							fill
							className='object-cover'
							unoptimized
						/>
					</div>
					<div>
						<h1 className='text-3xl font-bold tracking-tight'>My Account</h1>
						<p className='text-muted-foreground'>user@example.com</p>
						<div className='flex gap-3 mt-3'>
							<Button variant='outline' className='rounded-full px-5'>
								Edit profile
							</Button>
						</div>
					</div>
				</div>

				{/* Add new video */}
				<Dialog>
					<DialogTrigger asChild>
						<Button className='rounded-full px-6 mb-6 shadow-md hover:shadow-lg transition-all'>
							+ Upload Video
						</Button>
					</DialogTrigger>
					<DialogContent className='sm:max-w-md rounded-2xl'>
						<DialogHeader>
							<DialogTitle className='text-lg font-semibold'>
								Upload new video
							</DialogTitle>
						</DialogHeader>
						<div className='flex flex-col gap-4 mt-4'>
							<Input
								placeholder='Video title'
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
							<Input
								placeholder='Thumbnail URL'
								value={thumbnail}
								onChange={(e) => setThumbnail(e.target.value)}
							/>
							{thumbnail && (
								<div className='relative w-full h-40 rounded-lg overflow-hidden border'>
									<Image
										src={thumbnail}
										alt='Preview'
										fill
										className='object-cover transition-transform duration-300 hover:scale-105'
										unoptimized
									/>
								</div>
							)}
							<Button onClick={addVideo} className='rounded-full'>
								Save
							</Button>
						</div>
					</DialogContent>
				</Dialog>

				{/* My videos */}
				<h2 className='text-xl font-semibold mt-6 mb-4'>My videos</h2>
				{videos.length === 0 ? (
					<p className='text-muted-foreground'>
						You haven’t uploaded any videos yet.
					</p>
				) : (
					<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
						{videos.map((video, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.3, delay: i * 0.1 }}
								className='group rounded-xl overflow-hidden border hover:shadow-xl hover:-translate-y-1 transition-all bg-card'
							>
								<div className='relative w-full h-48 overflow-hidden'>
									<Image
										src={video.thumbnail}
										alt='Video thumbnail'
										fill
										className='object-cover transition-transform duration-300 group-hover:scale-110'
										unoptimized
									/>
									<div className='absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity'></div>
								</div>
								<div className='p-4 flex flex-col justify-between h-36'>
									<div>
										<h3 className='font-semibold line-clamp-2'>
											{video.title}
										</h3>
										<p className='text-xs text-muted-foreground mt-1'>
											Uploaded on {video.createdAt}
										</p>
									</div>
									<div className='flex justify-end gap-2 mt-3'>
										<Button
											size='sm'
											variant='outline'
											className='rounded-full'
										>
											Edit
										</Button>
										<Button
											size='sm'
											variant='destructive'
											className='rounded-full'
										>
											Delete
										</Button>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				)}
			</motion.div>
		</div>
	)
}

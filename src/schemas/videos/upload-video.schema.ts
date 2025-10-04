import { z } from 'zod'

export const uploadVideoSchema = z.object({
	title: z.string().min(3, 'Title must be at least 3 characters'),
	description: z.string().optional(),
	tags: z.string().optional(),
	file: z
		.any()
		.refine(
			(val) =>
				typeof window !== 'undefined' &&
				val instanceof FileList &&
				val.length > 0,
			{ message: 'Video file is required' },
		),
})

export type TUploadVideoSchema = z.infer<typeof uploadVideoSchema>

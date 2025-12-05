import { z } from 'zod'

export const restrictVideoSchema = z.object({
	title: z
		.string()
		.min(3, 'Title must be at least 3 characters')
		.max(200, { message: 'Title must be less than 200 characters' }),
	description: z
		.string()
		.trim()
		.max(1000, { message: 'Description must be less than 1000 characters' })
		.optional(),
	tags: z
		.string()
		.optional()
		.refine(
			(val) => {
				if (!val || val.trim() === '') return true
				const regex = /^#\w+( #\w+)*$/
				return regex.test(val.trim())
			},
			{
				message: 'Invalid tags format',
			},
		),
	video: z
		.array(z.instanceof(File))
		.min(1, { message: 'Video file is required' }),

	thumbnail: z
		.array(z.instanceof(File))
		.min(1, { message: 'Thumbnail is required' }),

	audience: z.enum(['yes', 'no']).refine((val) => !!val, {
		message: 'You must specify if the content is made for kids',
	}),
})

export type TRestrictVideoSchema = z.infer<typeof restrictVideoSchema>

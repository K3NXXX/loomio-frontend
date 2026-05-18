import { z } from 'zod'
import { uploadVideoSchema, videoChaptersSchema } from './upload-video.schema'

export const editVideoSchema = uploadVideoSchema
	.omit({ file: true, chapters: true, thumbnail: true })
	.extend({
		chapters: videoChaptersSchema,
		/** Empty array / omitted = keep server thumbnail; new file replaces it. */
		thumbnail: z.array(z.instanceof(File)).max(1).optional(),
	})
	.partial({
		publishType: true,
		publishDate: true,
	})
	.superRefine((data, ctx) => {
		if (data.publishType === 'scheduled' && !data.publishDate) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Publish date is required when scheduling a video',
				path: ['publishDate'],
			})
		}
	})

export type TEditVideoSchema = z.infer<typeof editVideoSchema>

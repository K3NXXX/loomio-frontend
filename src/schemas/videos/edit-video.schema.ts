import type { z } from 'zod'
import { uploadVideoSchema } from './upload-video.schema'

export const editVideoSchema = uploadVideoSchema
	.omit({ publishType: true, publishDate: true })
	.partial({
		file: true,
		thumbnail: true,
	})

export type TEditVideoSchema = z.infer<typeof editVideoSchema>

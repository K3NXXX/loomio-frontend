import { z } from 'zod'

import { PROJECT_MEMBER_ROLES } from '@/types/project.types'

export const createProjectSchema = z.object({
	name: z
		.string()
		.min(3, 'Project name must be at least 3 characters long')
		.max(100, 'Project name must be less than 100 characters')
		.regex(
			/^[\p{L}\d\s'.\-]+$/u,
			'Only letters, numbers, spaces, apostrophes, dots and dashes are allowed',
		)
		.refine((val) => val.trim() === val, {
			message: 'Name must not start or end with spaces',
		})
		.refine((val) => !/\s{2,}/.test(val), {
			message: 'Avoid double spaces in project name',
		}),

	description: z
		.string()
		.max(500, 'Description must be less than 500 characters')
		.regex(
			/^[\p{L}\d\s.,:;!?"'’“”()\-–—\n\r]*$/u,
			'Only letters, numbers, common punctuation, and whitespace are allowed',
		)
		.optional(),

	members: z
		.array(
			z.object({
				userId: z.string(),
				role: z.enum(PROJECT_MEMBER_ROLES),
			}),
		)
		.optional(),
})
export type TCreateProjectSchema = z.infer<typeof createProjectSchema>

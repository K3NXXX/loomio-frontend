import { z } from 'zod'

export const editAccountSchema = (hasPassword: boolean) =>
	z
		.object({
			name: z
				.string()
				.trim()
				.regex(/^[A-Za-zА-Яа-яЁёІіЇїЄєҐґ'’-]+ [A-Za-zА-Яа-яЁёІіЇїЄєҐґ'’-]+$/, {
					message: 'Name must contain exactly two words with only letters',
				})
				.max(100, { message: 'Name must be less than 100 characters' })
				.optional()
				.or(z.literal('')),

			email: z
				.string()
				.email({ message: 'Incorrect email' })
				.max(100, { message: 'Email requires max 100 characters' })
				.optional()
				.or(z.literal('')),

			username: z
				.string()
				.min(3, { message: 'Username must be at least 3 characters' })
				.optional()
				.or(z.literal('')),

			bio: z
				.string()
				.max(500, { message: 'Bio must be less than 500 characters' })
				.optional()
				.or(z.literal('')),

			newPassword: z
				.string()
				.min(10, { message: 'Password requires min 10 characters' })
				.regex(
					/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/,
					{
						message:
							'Password must contain at least one latin letter, one digit, and one special character',
					},
				)
				.optional()
				.or(z.literal('')),

			confirmPassword: z.string().optional().or(z.literal('')),

			currentPassword: z.string().optional().or(z.literal('')),
		})
		.superRefine((data, ctx) => {
			const isPasswordChange = data.newPassword?.trim()

			if (isPasswordChange && hasPassword && !data.currentPassword?.trim()) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					path: ['currentPassword'],
					message: 'Current password is required',
				})
			}

			if (isPasswordChange && data.newPassword !== data.confirmPassword) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					path: ['confirmPassword'],
					message: 'Passwords do not match',
				})
			}

			if (
				hasPassword &&
				data.newPassword?.trim() &&
				data.currentPassword?.trim() &&
				data.newPassword === data.currentPassword
			) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					path: ['newPassword'],
					message: 'New password must be different from current password',
				})
			}
		})

		export type TEditAccountSchema = z.infer<
		ReturnType<typeof editAccountSchema>
	>

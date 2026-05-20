import { userService } from '@/services/user.service'
import type { IUpdateAccountRequest } from '@/types/user.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export const useUpdateAccount = () => {
	const queryClient = useQueryClient()
	const t = useTranslations('toast')

	const { mutate: updateAccount, isSuccess } = useMutation({
		mutationKey: ['updateAccount'],
		mutationFn: (data: IUpdateAccountRequest) =>
			userService.updateAccount(data),

		onMutate: async (newData) => {
			await queryClient.cancelQueries({ queryKey: ['getMe'] })

			const previousUser = queryClient.getQueryData(['getMe'])

			queryClient.setQueryData(['getMe'], (old: unknown) => ({
				...(old as object),
				...newData,
			}))

			return { previousUser }
		},

		onError: (_err, _newData, context) => {
			if (context?.previousUser) {
				queryClient.setQueryData(['getMe'], context.previousUser)
			}
			toast.error(t('genericError'))
		},

		onSuccess: () => {
			toast.success(t('accountUpdated'))
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['getMe'] })
		},
	})

	return { updateAccount, isSuccess }
}

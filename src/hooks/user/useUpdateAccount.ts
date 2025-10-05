import { userService } from '@/services/user.service'
import type { IUpdateAccountRequest } from '@/types/user.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useUpdateAccount = () => {
	const queryClient = useQueryClient()
	const { mutate: updateAccount } = useMutation({
		mutationKey: ['updateAccount'],
		mutationFn: (data: IUpdateAccountRequest) =>
			userService.updateAccount(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['getMe'] })
			toast.success('Account successfully updated')
		},
		onError: () => {
			toast.error('Something went wrong. Try again')
		},
	})

	return { updateAccount }
}

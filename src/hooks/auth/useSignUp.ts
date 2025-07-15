import { authService } from '@/services/auth.service';
import { ISignupApiData } from '@/types/auth.types';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

export const useSignUp = () => {
	const [isSuccessSignUp, setIsSuccessSignUp] = useState(false);
	const [expiresAt, setExpiresAt] = useState<Date | undefined>();
	const { mutate: signUp, isPending } = useMutation({
		mutationKey: ['signup'],
		mutationFn: (data: ISignupApiData) => authService.signup(data),
		onSuccess: (data: { expiresAt: Date }) => {
			setExpiresAt(data.expiresAt), setIsSuccessSignUp(true);
		},
		onError: (error: any) => {
			if (
				error?.response?.status === 409 &&
				error?.response?.data?.message !== 'User with this email already exists'
			) {
				setExpiresAt(error.response.data?.expiresAt || 60);
				setIsSuccessSignUp(true);
			}
			if (error?.response?.data?.message === 'User with this email already exists') {
				toast(error?.response?.data?.message);
			}
		},
	});

	return {
		signUp,
		isSuccessSignUp,
		setIsSuccessSignUp,
		isLoading: isPending,
		expiresAt,
		setExpiresAt,
	};
};

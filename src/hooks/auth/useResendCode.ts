import { authService } from '@/services/auth.service';
import { IResendCode } from '@/types/auth.types';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

export const useResendCode = () => {
	const [expiresAtResend, setExpiresAtResend] = useState<Date>();
	const { mutateAsync: resendCode, isPending } = useMutation({
		mutationKey: ['resendCode'],
		mutationFn: (data: IResendCode) => authService.resendCode(data),
		onSuccess: (data: { message: string; expiresAt: Date }) => {
			setExpiresAtResend(data.expiresAt);
		},
		onError: (error: any) => {
			if (error?.response?.status === 409) {
				setExpiresAtResend(error.response.data?.expiresAt);
			}
		},
	});

	return { resendCode, expiresAtResend, loading: isPending };
};

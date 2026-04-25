'use client'
import { useState } from 'react'

import { Controller, useFormContext } from 'react-hook-form'
import { BsFillEyeSlashFill } from 'react-icons/bs'
import { HiEye } from 'react-icons/hi'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { useSignupFormErrors } from '@/hooks/auth/useSignupFormErrors'
import { PAGES } from '@/constants/pages.constants'

import type { TSignupSchema } from '@/schemas/auth/signup-schema'

export function SignUpFormFields() {
	const t = useTranslations()
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)

	const { register, control } = useFormContext<TSignupSchema>()
	useSignupFormErrors()

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword)
	}

	const handleClickShowConfirmPassword = () => {
		setShowConfirmPassword(!showConfirmPassword)
	}
	return (
		<>
			<div className='flex gap-3 max-[540px]:flex-col'>
				{/* <div className='flex flex-col flex-1 '>
					<label htmlFor='signup-name' className='text-white mb-2'>
						{t('auth.signup.fields.fullNameLabel')}
					</label>
					<Input
						id='signup-name'
						placeholder={t('auth.signup.fields.fullNamePlaceholder')}
						className='w-full text-white py-6'
						{...register('name')}
					/>
				</div> */}
				<div className='flex flex-col flex-1'>
					<label htmlFor='signup-username' className='text-white mb-2'>
						{t('auth.signup.fields.usernameLabel')}
					</label>
					<div className='relative'>
						<span className='absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary'>
							@
						</span>
						<Input
							id='signup-username'
							placeholder={t('auth.signup.fields.usernamePlaceholder')}
							className='w-full text-white py-6 pl-7'
							{...register('username')}
						/>
					</div>
				</div>
			</div>
			<div className='flex flex-col'>
				<label htmlFor='signup-email' className='text-white mb-2'>
					{t('auth.signup.fields.emailLabel')}
				</label>
				<Input
					type='email'
					id='signup-email'
					placeholder={t('auth.signup.fields.emailPlaceholder')}
					className='text-white py-6'
					{...register('email')}
				/>
			</div>
			<div className='flex gap-3 max-[540px]:flex-col'>
				<div className='flex flex-col'>
					<label htmlFor='signup-password' className='text-white mb-2'>
						{t('auth.signup.fields.passwordLabel')}
					</label>
					<div className='relative'>
						{showPassword ? (
							<HiEye
								onClick={handleClickShowPassword}
								className='absolute top-[17px] right-[15px] cursor-pointer'
								color='white'
							/>
						) : (
							<BsFillEyeSlashFill
								onClick={handleClickShowPassword}
								className='absolute top-[17px] right-[15px] cursor-pointer'
								color='white'
							/>
						)}
						<Input
							id='signup-password'
							type={showPassword ? 'text' : 'password'}
							placeholder={t('auth.signup.fields.passwordPlaceholder')}
							className='text-white py-6 pr-10'
							{...register('password')}
						/>
					</div>
				</div>
				<div className='flex flex-col'>
					<label htmlFor='signup-confirm-password' className='text-white mb-2'>
						{t('auth.signup.fields.confirmPasswordLabel')}
					</label>
					<div className='relative'>
						{showConfirmPassword ? (
							<HiEye
								onClick={handleClickShowConfirmPassword}
								className='absolute top-[17px] right-[15px] cursor-pointer'
								color='white'
							/>
						) : (
							<BsFillEyeSlashFill
								onClick={handleClickShowConfirmPassword}
								className='absolute top-[17px] right-[15px] cursor-pointer'
								color='white'
							/>
						)}
						<Input
							id='signup-confirm-password'
							type={showConfirmPassword ? 'text' : 'password'}
							placeholder={t('auth.signup.fields.confirmPasswordPlaceholder')}
							className='text-white py-6 pr-10'
							{...register('passwordConfirm')}
						/>
					</div>
				</div>
			</div>
			<div className='flex items-center gap-3 max-[375px]:items-start'>
				<Controller
					name='termsAccepted'
					control={control}
					render={({ field }) => (
						<div className='flex items-center gap-3  pt-[1px] max-[375px]:items-start'>
							<Checkbox
								checked={field.value}
								onCheckedChange={(checked) => {
									field.onChange(checked === true)
								}}
								className='max-[375px]:mt-[4px]'
								id='signup-terms-checkbox'
							/>
						</div>
					)}
				/>
			<label htmlFor='signup-terms-checkbox' className='text-white/70 text-sm leading-snug'>
				{t('auth.signup.fields.termsLabelPrefix')}{' '}
				<Link
					href={PAGES.TERMS}
					target='_blank'
					className='text-primary hover:text-primary/80 underline underline-offset-2 transition-colors'
				>
					{t('auth.signup.fields.termsLabelLink')}
				</Link>
			</label>
			</div>
		</>
	)
}

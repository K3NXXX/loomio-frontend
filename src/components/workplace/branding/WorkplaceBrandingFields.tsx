import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { TEditingChannelSchema } from '@/schemas/channel/edit-channel.schema'
import { getValidationMessage } from '@/utils/validationMessage'
import { useTranslations } from 'next-intl'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { FiAtSign } from 'react-icons/fi'

interface IWorkplaceBrandingFields {
	errors: FieldErrors<TEditingChannelSchema>
	register: UseFormRegister<TEditingChannelSchema>
	watchedUsername: string
}

export function WorkplaceBrandingFields({
	errors,
	register,
	watchedUsername,
}: IWorkplaceBrandingFields) {
	const t = useTranslations('workplaceBranding.fields')
	const tAll = useTranslations()
	return (
		<section className='w-full max-w-[700px] rounded-2xl border border-border/40 bg-background/60 p-6 shadow-sm hover:shadow-md transition-all'>
			<h2 className='text-xl font-semibold mb-2'>{t('sectionTitle')}</h2>
			<p className='text-sm text-muted-foreground mb-6'>
				{t('sectionDescription')}
			</p>
			<div className='space-y-6'>
				<div>
					<Label className='block text-sm font-medium mb-1'>
						{t('nameLabel')}
					</Label>
					<p className='text-xs text-muted-foreground mb-2'>{t('nameHint')}</p>
					<Input
						type='text'
						aria-invalid={!!errors.name}
						className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 ${
							errors.name
								? 'border-red-500 bg-muted/10 focus:ring-red-400'
								: 'border-border/50 bg-muted/10 focus:ring-primary/40'
						}`}
						{...register('name')}
					/>
					{errors.name && (
						<p className='mt-1 text-xs text-red-500'>
							{getValidationMessage(String(errors.name.message), tAll)}
						</p>
					)}
				</div>

				<div>
					<Label className='block text-sm font-medium mb-1'>
						{t('usernameLabel')}
					</Label>
					<p className='text-xs text-muted-foreground mb-2'>
						{t('usernameHint')}
					</p>
					<div className='relative w-full'>
						<FiAtSign className='absolute top-[10px] left-[6px]' size={16} />
						<Input
							type='text'
							aria-invalid={!!errors.username}
							value={watchedUsername}
							className={`w-full rounded-md border pl-7 pr-3 py-2 text-sm outline-none focus:ring-2 ${
								errors.username
									? 'border-red-500 bg-muted/10 focus:ring-red-400'
									: 'border-border/50 bg-muted/10 focus:ring-primary/40'
							}`}
							{...register('username')}
						/>
					</div>
					{errors.username && (
						<p className='mt-1 text-xs text-red-500'>
							{getValidationMessage(String(errors.username.message), tAll)}
						</p>
					)}
					<p className='text-xs text-muted-foreground mt-1'>
						loomio.com/@{watchedUsername}
					</p>
				</div>

				<div>
					<Label className='block text-sm font-medium mb-1'>
						{t('descriptionLabel')}
					</Label>
					<Textarea
						rows={7}
						placeholder={t('descriptionPlaceholder')}
						aria-invalid={!!errors.description}
						className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 resize-none min-h-[150px] ${
							errors.description
								? 'border-red-500 bg-muted/10 focus:ring-red-400'
								: 'border-border/50 bg-muted/10 focus:ring-primary/40'
						}`}
						{...register('description')}
					/>
					{errors.description && (
						<p className='mt-1 text-xs text-red-500'>
							{getValidationMessage(String(errors.description.message), tAll)}
						</p>
					)}
				</div>
			</div>
		</section>
	)
}

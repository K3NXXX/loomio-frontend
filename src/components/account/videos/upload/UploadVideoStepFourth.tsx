'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { TUploadVideoSchema } from '@/schemas/videos/upload-video.schema'
import { sanitizeChapterTimecodeInput } from '@/utils/chapterTimecode'
import { AnimatePresence, motion } from 'framer-motion'
import { Clock, ListOrdered, Plus, Trash2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { Control, UseFormRegister } from 'react-hook-form'
import { Controller, useFieldArray, useFormState } from 'react-hook-form'

interface UploadVideoStepFourthProps {
	control: Control<TUploadVideoSchema>
	register: UseFormRegister<TUploadVideoSchema>
}

export function UploadVideoStepFourth({
	control,
	register,
}: UploadVideoStepFourthProps) {
	const t = useTranslations('uploadVideoModal.stepFourth')
	const { errors } = useFormState({ control })
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'chapters',
	})

	return (
		<div className='flex h-full min-h-0 flex-col gap-3'>
			<div className='flex shrink-0 flex-col'>
				<h3 className='mb-3 text-lg font-semibold text-foreground'>{t('title')}</h3>
				<p className='mb-3 text-sm text-muted-foreground'>{t('description')}</p>
				<p className='flex items-start gap-2 text-xs text-muted-foreground'>
					<Clock className='mt-0.5 h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5' />
					<span>{t('hintFormat')}</span>
				</p>
			</div>

			{/* Column headers when there are rows */}
			{fields.length > 0 && (
				<div className='grid shrink-0 grid-cols-[44px_92px_1fr_36px] gap-2 border-b border-border/60 px-1 pb-1.5 pt-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground'>
					<span className='text-center'>#</span>
					<span>{t('timeLabel')}</span>
					<span>{t('titleLabel')}</span>
					<span className='sr-only'>{t('removeAria')}</span>
				</div>
			)}

			<ScrollArea className='min-h-0 h-full max-h-[min(44vh,420px)] flex-1 rounded-lg border border-border'>
				<div className='space-y-1.5 p-2 pr-1'>
					<AnimatePresence initial={false} mode='popLayout'>
						{fields.length === 0 ? (
							<motion.div
								key='empty'
								initial={{ opacity: 0, y: 6 }}
								animate={{ opacity: 1, y: 0 }}
								className='flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/80 bg-background/50 py-7 text-center'
							>
								<div className='flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10'>
									<ListOrdered className='h-5 w-5 text-primary' />
								</div>
								<p className='max-w-[320px] px-3 text-xs leading-relaxed text-muted-foreground'>
									{t('emptyState')}
								</p>
								<Button
									type='button'
									size='sm'
									className='h-8 gap-1.5 rounded-full px-4 text-xs'
									onClick={() => append({ title: '', timecode: '' })}
								>
									<Plus className='h-3.5 w-3.5' />
									{t('addFirst')}
								</Button>
							</motion.div>
						) : (
							fields.map((field, index) => (
								<motion.div
									key={field.id}
									layout
									initial={{ opacity: 0, x: -8 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, scale: 0.98 }}
									transition={{ type: 'spring', stiffness: 420, damping: 32 }}
									className='group grid grid-cols-[44px_92px_1fr_36px] items-center gap-2 rounded-lg border border-transparent bg-card/80 px-1.5 py-1 shadow-sm transition hover:border-primary/25 hover:bg-card dark:bg-white/[0.04] dark:hover:bg-white/[0.06]'
								>
									<div className='flex h-8 items-center justify-center rounded-md bg-muted/50 text-[11px] font-bold tabular-nums text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'>
										{index + 1}
									</div>
									<Controller
										control={control}
										name={`chapters.${index}.timecode`}
										render={({ field }) => (
											<Input
												{...field}
												onChange={(e) =>
													field.onChange(
														sanitizeChapterTimecodeInput(e.target.value),
													)
												}
												placeholder={t('timePlaceholder')}
												className={cn(
													'h-8 border-border/80 bg-background px-2 text-center font-mono text-xs tabular-nums',
													errors.chapters?.[index]?.timecode &&
														'border-destructive focus-visible:ring-destructive',
												)}
												autoComplete='off'
												spellCheck={false}
											/>
										)}
									/>
									<Input
										{...register(`chapters.${index}.title`)}
										placeholder={t('titlePlaceholder')}
										className='h-8 border-border/80 bg-background px-2.5 text-xs'
										autoComplete='off'
									/>
									<Button
										type='button'
										variant='ghost'
										size='icon'
										className='h-8 w-8 text-muted-foreground opacity-60 hover:bg-destructive/10 hover:text-destructive hover:opacity-100'
										onClick={() => remove(index)}
										aria-label={t('removeAria')}
									>
										<Trash2 className='h-3.5 w-3.5' />
									</Button>
								</motion.div>
							))
						)}
					</AnimatePresence>
				</div>
			</ScrollArea>

			{fields.length > 0 && (
				<Button
					type='button'
					variant='outline'
					size='sm'
					className='h-9 shrink-0 gap-1.5 rounded-lg border-dashed text-xs text-muted-foreground hover:border-primary/40 hover:bg-primary/[0.06] hover:text-foreground'
					onClick={() => append({ title: '', timecode: '' })}
				>
					<Plus className='h-3.5 w-3.5' />
					{t('addAnother')}
				</Button>
			)}
		</div>
	)
}

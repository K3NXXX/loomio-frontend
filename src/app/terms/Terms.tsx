import Link from 'next/link'
import { FileText, Shield, Eye, Bell, CreditCard, UserX, Mail } from 'lucide-react'

const Section = ({
	icon: Icon,
	title,
	children,
}: {
	icon: React.ElementType
	title: string
	children: React.ReactNode
}) => (
	<section className='group'>
		<div className='flex items-center gap-3 mb-4'>
			<div className='w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors'>
				<Icon className='w-4 h-4 text-primary' />
			</div>
			<h2 className='text-lg font-semibold text-white'>{title}</h2>
		</div>
		<div className='pl-12 text-sm text-white/60 leading-relaxed space-y-2'>{children}</div>
	</section>
)

export default function Terms() {
	return (
		<div className='min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black'>
			<div className='max-w-3xl mx-auto px-4 py-16'>

				{/* Header */}
				<div className='text-center mb-14'>
					<div className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-5'>
						<FileText className='w-4 h-4' />
						Юридична інформація
					</div>
					<h1 className='text-4xl font-bold bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent'>
						Умови використання та Політика конфіденційності
					</h1>
					<p className='text-white/40 mt-3 text-sm'>
						Останнє оновлення: квітень 2026 р.
					</p>
				</div>

				{/* Card */}
				<div className='relative rounded-2xl overflow-hidden p-[1px] bg-gradient-to-br from-white/10 via-white/5 to-transparent'>
					<div className='rounded-2xl bg-neutral-900/90 backdrop-blur-xl divide-y divide-white/5'>

						{/* Intro */}
						<div className='p-8 text-sm text-white/50 leading-relaxed'>
							Ласкаво просимо до <span className='text-white font-medium'>Loomio</span> — відеоплатформи для перегляду, публікації та монетизації контенту. Використовуючи наш сервіс, ви погоджуєтесь з наведеними нижче умовами. Будь ласка, прочитайте їх уважно.
						</div>

						<div className='p-8 space-y-10'>

							<Section icon={Shield} title='1. Прийняття умов'>
								<p>
									Реєструючись або використовуючи Loomio, ви підтверджуєте, що вам виповнилося 13 років, і ви погоджуєтеся з цими Умовами використання та Політикою конфіденційності.
								</p>
								<p>
									Ми залишаємо за собою право змінювати умови в будь-який час. Продовжуючи використовувати платформу після змін, ви автоматично приймаєте нові умови.
								</p>
							</Section>

							<Section icon={Eye} title='2. Збір та використання даних'>
								<p>Ми збираємо такі дані:</p>
								<ul className='list-disc list-inside space-y-1 pl-2'>
									<li><span className='text-white/80'>Облікові дані</span> — ім'я користувача, email, аватар</li>
									<li><span className='text-white/80'>Дані сесії</span> — IP-адреса, тип браузера, час відвідування</li>
									<li><span className='text-white/80'>Контент</span> — відео, коментарі, плейлисти які ви завантажуєте</li>
									<li><span className='text-white/80'>Платіжні дані</span> — обробляються виключно через Stripe, ми не зберігаємо дані карток</li>
								</ul>
								<p className='mt-2'>
									Дані використовуються виключно для надання та покращення сервісу, а також для зв'язку з вами щодо вашого акаунту.
								</p>
							</Section>

							<Section icon={Bell} title='3. Правила поведінки'>
								<p>Користувачам забороняється:</p>
								<ul className='list-disc list-inside space-y-1 pl-2'>
									<li>Публікувати контент, що порушує авторські права</li>
									<li>Завантажувати матеріали з насильством, ненавистю або незаконним змістом</li>
									<li>Здійснювати спам, фішинг або будь-яку шкідливу діяльність</li>
									<li>Намагатися зламати або дестабілізувати платформу</li>
								</ul>
								<p className='mt-2'>
									Порушення цих правил може призвести до блокування акаунту без попередження.
								</p>
							</Section>

							<Section icon={CreditCard} title='4. Преміум підписка'>
								<p>
									Підписка Loomio Premium коштує <span className='text-white font-medium'>$10 на місяць</span> і надає доступ до розширених можливостей платформи.
								</p>
								<p>
									Оплата здійснюється через <span className='text-white/80'>Stripe</span> — захищений платіжний сервіс. Підписку можна скасувати в будь-який момент через налаштування акаунту. Повернення коштів за поточний період не передбачено.
								</p>
							</Section>

							<Section icon={UserX} title='5. Видалення акаунту'>
								<p>
									Ви можете видалити свій акаунт у будь-який час через налаштування. Після видалення всі ваші дані, контент та підписки будуть видалені протягом 30 днів.
								</p>
								<p>
									Ми залишаємо за собою право призупинити або видалити акаунти, що порушують наші Умови використання.
								</p>
							</Section>

							<Section icon={Mail} title='6. Звязок з нами'>
								<p>
									З будь-яких питань щодо конфіденційності або умов використання звертайтесь:
								</p>
								<p className='mt-2'>
									Email:{' '}
									<a
										href='mailto:support@loomio.app'
										className='text-primary hover:underline'
									>
										support@loomio.app
									</a>
								</p>
							</Section>

						</div>

						{/* Footer */}
						<div className='px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30'>
							<span>© 2026 Loomio. Всі права захищені.</span>
							<Link
								href='/signup'
								className='text-primary hover:text-primary/80 transition-colors'
							>
								← Повернутись до реєстрації
							</Link>
						</div>
					</div>
				</div>

			</div>
		</div>
	)
}

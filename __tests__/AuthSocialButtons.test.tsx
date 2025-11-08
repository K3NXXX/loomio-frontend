import { render, screen } from '@testing-library/react'

import { AuthSocialButtons } from '@/components/ui/custom/AuthSocialButtons'
import { providers } from '@/lists/auth.providers.list'

it('renders all OAuth providers', () => {
	render(<AuthSocialButtons />)
	providers.forEach((provider) => {
		expect(
			screen.getByLabelText(`Login with ${provider.name}`),
		).toBeInTheDocument()
	})
})

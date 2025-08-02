import FormThirdStep from '@/components/dashboard/projects/create-project-form/FormThirdStep'
import { CREATE_PROJECT_FORM_STEPS } from '@/types/project.types'
import { fireEvent, render, screen } from '@testing-library/react'

jest.mock('@/zustand/store/projectStore', () => ({
	useProjectStore: () => ({
		selectedMembers: [],
	}),
}))

jest.mock('lottie-react', () => () => <div data-testid='lottie-mock' />)

describe('FormThirdStep', () => {
	it('renders project name and description', () => {
		const setStepMock = jest.fn()
		const projectName = 'Test Project Name'
		const projectDescription = 'Test project description'

		render(
			<FormThirdStep
				setStep={setStepMock}
				projectName={projectName}
				projectDescription={projectDescription}
				creatingProjectLoading={false}
			/>,
		)

		expect(screen.getByText('Project name')).toBeInTheDocument()
		expect(screen.getByText(projectName)).toBeInTheDocument()
		expect(screen.getByText('Project description')).toBeInTheDocument()
		expect(screen.getByText(projectDescription)).toBeInTheDocument()
	})

	it('shows empty members message and allows adding new members', () => {
		jest.mock('@/zustand/store/projectStore', () => ({
			useProjectStore: () => ({
				selectedMembers: [],
			}),
		}))

		const setStepMock = jest.fn()

		render(
			<FormThirdStep
				setStep={setStepMock}
				projectName='Project Y'
				projectDescription='Empty members'
				creatingProjectLoading={false}
			/>,
		)

		expect(screen.getByText('You did not add any members.')).toBeInTheDocument()

		fireEvent.click(screen.getByText('Add members?'))
		expect(setStepMock).toHaveBeenCalledWith(2)
	})
})

describe('FormThirdStep - Buttons', () => {
	it('Back and Confirm buttons behave correctly', () => {
		const setStepMock = jest.fn()

		render(
			<FormThirdStep
				setStep={setStepMock}
				projectName='Project X'
				projectDescription='Description'
				creatingProjectLoading={true}
			/>,
		)

		const backButton = screen.getByRole('button', { name: /back/i })
		fireEvent.click(backButton)
		expect(setStepMock).toHaveBeenCalledWith(CREATE_PROJECT_FORM_STEPS.SECOND)

		const confirmButton = screen.getByRole('button', { name: '' })
		expect(confirmButton).toHaveAttribute('type', 'submit')

		expect(confirmButton).toBeDisabled()

		expect(screen.getByTestId('lottie-mock')).toBeInTheDocument()
	})

	it('Confirm button shows text when not loading', () => {
		render(
			<FormThirdStep
				setStep={() => {}}
				projectName='Project X'
				projectDescription='Description'
				creatingProjectLoading={false}
			/>,
		)

		const confirmButton = screen.getByRole('button', { name: /confirm/i })
		expect(confirmButton).toBeEnabled()
		expect(confirmButton).toHaveTextContent('Confirm')
	})
})

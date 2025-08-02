import { CreateProjectForm } from '@/components/dashboard/projects/create-project-form/CreateProjectForm'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

const createProjectMock = jest.fn()

jest.mock('@/zustand/store/projectStore', () => ({
	useProjectStore: () => ({
		selectedMembers: [
			{ id: '1', role: 'MEMBER' },
			{ id: '2', role: 'ADMIN' },
		],
		isProjectCreatingFormOpened: true,
		setIsProjectCreatingFormOpened: jest.fn(),
	}),
}))

jest.mock('lottie-react', () => () => <div data-testid='mock-lottie' />)

jest.mock('@/hooks/project/useCreateProject', () => ({
	useCreateProject: () => ({
		createProject: createProjectMock,
		creatingProjectLoading: false,
		createdProjectSuccess: false,
	}),
}))

jest.mock('@/hooks/project/useCreateProjectFormErrors', () => ({
	useCreateProjectFormErrors: () => {},
}))

jest.mock(
	'@/components/dashboard/projects/create-project-form/FormFirstStep',
	() => {
		const FormFirstStep = ({ register }: any) => (
			<div>
				<div>Form First Step</div>
				<input {...register('name')} placeholder='Project name' />
				<input {...register('description')} placeholder='Project description' />
				<button type='submit'>Next</button>
			</div>
		)
		FormFirstStep.displayName = 'FormFirstStep'
		return FormFirstStep
	},
)

jest.mock(
	'@/components/dashboard/projects/create-project-form/FormSecondStep',
	() => {
		const FormSecondStep = () => <div>Form Second Step</div>
		FormSecondStep.displayName = 'FormSecondStep'
		return FormSecondStep
	},
)

jest.mock(
	'@/components/dashboard/projects/create-project-form/FormThirdStep',
	() => {
		const FormThirdStep = () => <div>Form Third Step</div>
		FormThirdStep.displayName = 'FormThirdStep'
		return FormThirdStep
	},
)

test('renders CreateProjectForm and shows first step', async () => {
	render(<CreateProjectForm />)

	await waitFor(() => {
		expect(screen.getByText('Form First Step')).toBeInTheDocument()
	})
})

test('calls createProject with correct data on form submit', async () => {
	render(<CreateProjectForm />)

	fireEvent.change(screen.getByPlaceholderText('Project name'), {
		target: { value: 'Test Project' },
	})
	fireEvent.change(screen.getByPlaceholderText('Project description'), {
		target: { value: 'Test description' },
	})

	fireEvent.click(screen.getByRole('button', { name: /next/i }))

	await waitFor(() => {
		expect(createProjectMock).toHaveBeenCalledWith({
			name: 'Test Project',
			description: 'Test description',
			members: [
				{ userId: '1', role: 'MEMBER' },
				{ userId: '2', role: 'ADMIN' },
			],
		})
	})
})

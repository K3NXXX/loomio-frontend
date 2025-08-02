import { AddedMembersList } from '@/components/dashboard/projects/create-project-form/AddedMembersList'
import { useProjectStore } from '@/zustand/store/projectStore'
import { fireEvent, render, screen } from '@testing-library/react'

jest.mock('@/zustand/store/projectStore', () => ({
	useProjectStore: jest.fn(),
}))

const mockedUseProjectStore = useProjectStore as unknown as jest.Mock

describe('AddedMembersList', () => {
	const mockRemoveSelectedMember = jest.fn()
	const mockUpdateRole = jest.fn()

	beforeEach(() => {
		jest.clearAllMocks()
		mockedUseProjectStore.mockReturnValue({
			selectedMembers: [
				{
					id: '1',
					name: 'John Doe',
					username: 'johnd',
					avatarUrl: null,
					role: 'member',
				},
			],
			removeSelectedMember: mockRemoveSelectedMember,
			updateRole: mockUpdateRole,
		})
	})

	it('renders members list when searchValue is empty', () => {
		render(<AddedMembersList searchValue='' />)

		expect(screen.getByText('Added members:')).toBeInTheDocument()
		expect(screen.getByText('johnd')).toBeInTheDocument()
		expect(screen.getByText('John Doe')).toBeInTheDocument()
	})

	it('does not render members list when searchValue is not empty', () => {
		render(<AddedMembersList searchValue='something' />)

		expect(screen.queryByText('Added members:')).not.toBeInTheDocument()
	})

	it('calls removeSelectedMember on close icon click', () => {
		render(<AddedMembersList searchValue='' />)
		const removeIcon = screen.getByLabelText(/remove member/i)
		fireEvent.click(removeIcon)
		expect(mockRemoveSelectedMember).toHaveBeenCalledWith('1')
	})
})

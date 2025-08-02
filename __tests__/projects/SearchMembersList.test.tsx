import { SearchMembersList } from '@/components/dashboard/projects/create-project-form/SearchMembersList'
import { fireEvent, render, screen } from '@testing-library/react'

const mockMembers = [
	{ id: '1', username: 'user1', name: 'User One', avatarUrl: null },
	{ id: '2', username: 'user2', name: 'User Two', avatarUrl: null },
]

const addSelectedMemberMock = jest.fn()

// Залишаємо мок useProjectStore
jest.mock('@/zustand/store/projectStore', () => ({
	useProjectStore: () => ({
		addSelectedMember: addSelectedMemberMock,
	}),
}))

// Тепер мок useVirtualizer повертає на 1 елемент більше, ніж є в mockMembers
jest.mock('@tanstack/react-virtual', () => ({
	useVirtualizer: () => ({
		getVirtualItems: () => [
			...mockMembers.map((_, index) => ({
				index,
				start: index * 50,
				size: 48,
			})),
			{ index: mockMembers.length, start: mockMembers.length * 50, size: 48 }, // skeleton item
		],
		getTotalSize: () => (mockMembers.length + 1) * 50,
	}),
}))

// Мок компонента skeleton з тестід
jest.mock('@/components/skeletons/SearchProjectMembersSkeleton', () => ({
	SearchProjectMembersSkeleton: () => <div data-testid='search-skeleton' />,
}))

describe('SearchMembersList', () => {
	beforeEach(() => {
		addSelectedMemberMock.mockClear()
	})

	it('shows loading skeleton when loading and no members', () => {
		render(
			<SearchMembersList
				members={[]}
				searchProjectMembersLoading={true}
				setSearchValue={jest.fn()}
				setIsSearchListVisible={jest.fn()}
				onLoadMore={jest.fn()}
				searchValue=''
			/>,
		)
		expect(screen.getByTestId('search-skeleton')).toBeInTheDocument()
	})

	it('shows "Users not found" if not loading and no members and searchValue >= 2', () => {
		render(
			<SearchMembersList
				members={[]}
				searchProjectMembersLoading={false}
				setSearchValue={jest.fn()}
				setIsSearchListVisible={jest.fn()}
				onLoadMore={jest.fn()}
				searchValue='abc'
			/>,
		)
		expect(screen.getByText(/users not found/i)).toBeInTheDocument()
	})

	it('renders list members', () => {
		render(
			<SearchMembersList
				members={mockMembers}
				searchProjectMembersLoading={false}
				setSearchValue={jest.fn()}
				setIsSearchListVisible={jest.fn()}
				onLoadMore={jest.fn()}
				searchValue='abc'
			/>,
		)
		expect(screen.getByText(/user1/i)).toBeInTheDocument()
		expect(screen.getByText(/user2/i)).toBeInTheDocument()
	})

	it('clicking a member calls handlers', () => {
		const setSearchValue = jest.fn()
		const setIsSearchListVisible = jest.fn()

		render(
			<SearchMembersList
				members={mockMembers}
				searchProjectMembersLoading={false}
				setSearchValue={setSearchValue}
				setIsSearchListVisible={setIsSearchListVisible}
				onLoadMore={jest.fn()}
				searchValue='abc'
			/>,
		)

		fireEvent.click(screen.getByText(mockMembers[0].name))

		expect(addSelectedMemberMock).toHaveBeenCalledWith(
			expect.objectContaining({ id: '1', role: 'MEMBER' }),
		)
		expect(setSearchValue).toHaveBeenCalledWith('')
		expect(setIsSearchListVisible).toHaveBeenCalledWith(false)
	})

	it('renders skeleton for virtual items beyond members length', () => {
		render(
			<SearchMembersList
				members={mockMembers}
				searchProjectMembersLoading={false}
				setSearchValue={jest.fn()}
				setIsSearchListVisible={jest.fn()}
				onLoadMore={jest.fn()}
				searchValue='abc'
			/>,
		)
		expect(screen.getByTestId('search-skeleton')).toBeInTheDocument()
	})

	it('calls onLoadMore when scrolling near bottom and not loading', () => {
		const onLoadMore = jest.fn()
		const { container } = render(
			<SearchMembersList
				members={mockMembers}
				searchProjectMembersLoading={false}
				setSearchValue={jest.fn()}
				setIsSearchListVisible={jest.fn()}
				onLoadMore={onLoadMore}
				searchValue='abc'
			/>,
		)

		const scrollElement = container.firstChild

		if (scrollElement) {
			Object.defineProperty(scrollElement, 'scrollHeight', {
				value: 200,
				configurable: true,
			})
			Object.defineProperty(scrollElement, 'clientHeight', {
				value: 100,
				configurable: true,
			})

			Object.defineProperty(scrollElement, 'scrollTop', {
				value: 105,
				configurable: true,
				writable: true,
			})

			fireEvent.scroll(scrollElement)
			expect(onLoadMore).toHaveBeenCalled()
		}
	})
})

import {
	DEFAULT_HOME_SIDEBAR_DOCK_SIDE,
	type HomeSidebarDockSide,
} from '@/lib/home-sidebar-dock-preference'
import {
	DEFAULT_HOME_VIDEO_GRID_COLUMNS,
	type HomeVideoGridColumns,
} from '@/lib/home-videos-grid-preference'

import { create } from 'zustand'

interface IState {
	isThemesMenuOpened: boolean
	isSidebarCollapsed: boolean
	headerSticky: boolean
	homeVideoColumns: HomeVideoGridColumns
	homeSidebarDockSide: HomeSidebarDockSide
}

interface IActions {
	toggleThemeMenuOpened: () => void
	setThemeMenuOpened: (opened: boolean) => void
	toggleSidebarCollapsed: () => void
	closeSidebar: () => void
	setHeaderSticky: (sticky: boolean) => void
	setHomeVideoColumns: (cols: HomeVideoGridColumns) => void
	setHomeSidebarDockSide: (side: HomeSidebarDockSide) => void
}

export const useGlobalStore = create<IState & IActions>((set) => ({
	isThemesMenuOpened: false,
	isSidebarCollapsed: true,
	headerSticky: true,
	homeVideoColumns: DEFAULT_HOME_VIDEO_GRID_COLUMNS,
	homeSidebarDockSide: DEFAULT_HOME_SIDEBAR_DOCK_SIDE,

	toggleThemeMenuOpened: () =>
		set((state) => ({ isThemesMenuOpened: !state.isThemesMenuOpened })),

	setThemeMenuOpened: (opened) => set({ isThemesMenuOpened: opened }),

	toggleSidebarCollapsed: () =>
		set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

	closeSidebar: () => set({ isSidebarCollapsed: true }),

	setHeaderSticky: (sticky) => set({ headerSticky: sticky }),

	setHomeVideoColumns: (cols) => set({ homeVideoColumns: cols }),

	setHomeSidebarDockSide: (side) => set({ homeSidebarDockSide: side }),
}))

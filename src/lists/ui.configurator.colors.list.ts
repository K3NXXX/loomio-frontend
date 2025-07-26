import { THEME_COLORS } from '@/types/colors.types'

export interface IUIConfiguratorColors {
	id: number
	color: THEME_COLORS
	colorCss: string
}
export const UIConfiguratorColors: IUIConfiguratorColors[] = [
	{
		id: 1,
		color: THEME_COLORS.RED,
		colorCss: '#fb2c36',
	},
	{
		id: 2,
		color: THEME_COLORS.ORANGE,
		colorCss: '#ff6900',
	},
	{
		id: 3,
		color: THEME_COLORS.GREEN,
		colorCss: '#00c951',
	},
	{
		id: 4,
		color: THEME_COLORS.BLUE,
		colorCss: '#2b7fff',
	},
	{
		id: 5,
		color: THEME_COLORS.YELLOW,
		colorCss: '#efb100',
	},
	{
		id: 6,
		color: THEME_COLORS.VIOLET,
		colorCss: '#8e51ff',
	},
	{
		id: 7,
		color: THEME_COLORS.WHITE,
		colorCss: '#fafafa',
	},
]



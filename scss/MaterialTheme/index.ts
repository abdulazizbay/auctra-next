import { ThemeOptions } from '@mui/material/styles';
import type {} from '@mui/lab/themeAugmentation';
import shadows from './shadow';
import typography from './typography';

/**
 * LIGHT THEME (DEFAULT)
 */
export const light: ThemeOptions = {
	palette: {
		mode: 'light',
		primary: {
			main: '#0F2742',
			contrastText: '#ffffff',
		},
		secondary: {
			main: '#C2A35A',
			contrastText: '#14202E',
		},
		background: {
			default: '#F6F7F9',
			paper: '#ffffff',
		},
		text: {
			primary: '#14202E',
			secondary: '#5B6573',
		},
		divider: '#E3E6EA',
	},
	shape: {
		borderRadius: 6,
	},
	components: {
		MuiTypography: {
			defaultProps: {
				variantMapping: {
					subtitle1: 'p',
					subtitle2: 'p',
					body1: 'p',
					body2: 'p',
				},
			},
		},
		MuiLink: {
			defaultProps: {
				underline: 'none',
			},
		},
		MuiButton: {
			defaultProps: {
				disableElevation: true,
			},
			styleOverrides: {
				root: {
					minWidth: 'auto',
				},
			},
		},
		MuiList: {
			styleOverrides: {
				root: {
					padding: 0,
				},
			},
		},
		MuiListItem: {
			styleOverrides: {
				root: {
					padding: 0,
				},
			},
		},
		MuiListItemButton: {
			styleOverrides: {
				root: {
					padding: 0,
				},
			},
		},
		MuiFormControl: {
			styleOverrides: {
				root: {
					width: '100%',
				},
			},
		},
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
					backgroundColor: '#ffffff',
				},
				notchedOutline: {
					borderColor: '#E3E6EA',
				},
			},
		},
		MuiMenu: {
			styleOverrides: {
				paper: {
					boxShadow: 'rgb(145 158 171 / 24%) 0px 0px 2px 0px, rgb(145 158 171 / 24%) -20px 20px 40px -4px',
				},
			},
		},
		MuiMenuItem: {
			styleOverrides: {
				root: {
					padding: '6px 8px',
				},
			},
		},
		MuiTabPanel: {
			styleOverrides: {
				root: {
					padding: 0,
				},
			},
		},
	},
	shadows,
	typography,
};

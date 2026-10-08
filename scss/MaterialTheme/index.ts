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
			main: '#111111',
			dark: '#2B2B2B',
			contrastText: '#ffffff',
		},
		secondary: {
			main: '#FF4D2E',
			contrastText: '#ffffff',
		},
		error: {
			main: '#E5484D',
		},
		success: {
			main: '#1F9D55',
		},
		background: {
			default: '#ffffff',
			paper: '#ffffff',
		},
		text: {
			primary: '#111111',
			secondary: '#555555',
			disabled: '#8A8A8A',
		},
		divider: '#ECECEC',
	},
	shape: {
		borderRadius: 10,
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
					borderRadius: 999,
					fontWeight: 700,
					transition: 'background-color .15s, border-color .15s, color .15s',
				},
				outlined: {
					borderColor: '#E4E4E4',
					color: '#111111',
					'&:hover': {
						borderColor: '#111111',
						backgroundColor: 'transparent',
					},
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
					'&:hover .MuiOutlinedInput-notchedOutline': {
						borderColor: '#C4C4C4',
					},
					'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
						borderWidth: 1,
						borderColor: '#111111',
					},
				},
				notchedOutline: {
					borderColor: '#E4E4E4',
				},
			},
		},
		MuiMenu: {
			styleOverrides: {
				paper: {
					border: '1px solid #ECECEC',
					boxShadow: '0 8px 24px rgba(17, 17, 17, 0.08)',
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
		MuiDialog: {
			styleOverrides: {
				paper: {
					borderRadius: 20,
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					borderRadius: 999,
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

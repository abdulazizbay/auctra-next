import { TypographyVariantsOptions } from '@mui/material/styles';

const heading = "'Cormorant Garamond', serif";

const typography: TypographyVariantsOptions = {
	fontFamily: "'Manrope', sans-serif",
	h1: {
		fontFamily: heading,
		fontSize: 44,
		fontWeight: 600,
	},
	h2: {
		fontFamily: heading,
		fontSize: 36,
		fontWeight: 600,
	},
	h3: {
		fontFamily: heading,
		fontSize: 30,
		fontWeight: 600,
	},
	h4: {
		fontFamily: heading,
		fontSize: 26,
		fontWeight: 600,
	},
	h5: {
		fontFamily: heading,
		fontSize: 22,
		fontWeight: 600,
	},
	h6: {
		fontFamily: heading,
		fontSize: 18,
		fontWeight: 600,
	},
	subtitle1: {
		fontSize: 16,
		fontWeight: 500,
	},
	subtitle2: {
		fontSize: 14,
		fontWeight: 500,
	},
	body1: {
		fontSize: 16,
		fontWeight: 400,
	},
	body2: {
		fontSize: 14,
		fontWeight: 400,
	},
	caption: {
		fontSize: 12,
		fontWeight: 400,
	},
	button: {
		fontSize: 14,
		fontWeight: 600,
		textTransform: 'none',
	},
};

export default typography;

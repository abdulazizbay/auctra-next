import type { AppProps } from 'next/app';
import { AppCacheProvider } from '@mui/material-nextjs/v14-pagesRouter';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React, { useState } from 'react';
import { light } from '../scss/MaterialTheme';
import '../scss/app.scss';

const App = (props: AppProps) => {
	const { Component, pageProps } = props;
	const [theme] = useState(createTheme(light));

	return (
		<AppCacheProvider {...props}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Component {...pageProps} />
			</ThemeProvider>
		</AppCacheProvider>
	);
};

export default App;

import type { AppProps } from 'next/app';
import { AppCacheProvider } from '@mui/material-nextjs/v14-pagesRouter';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React, { useState } from 'react';
import { light } from '../scss/MaterialTheme';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import { appWithTranslation } from 'next-i18next';
import Chat from '../libs/components/Chat';
import WatchToast from '../libs/components/WatchToast';
import '../scss/app.scss';

const App = (props: AppProps) => {
	const { Component, pageProps } = props;
	const [theme] = useState(createTheme(light));
	const client = useApollo(pageProps.initialApolloState);

	return (
		<AppCacheProvider {...props}>
			<ApolloProvider client={client}>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<Component {...pageProps} />
					<Chat />
					<WatchToast />
				</ThemeProvider>
			</ApolloProvider>
		</AppCacheProvider>
	);
};

export default appWithTranslation(App);

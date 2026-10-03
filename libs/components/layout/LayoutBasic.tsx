import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { Stack } from '@mui/material';
import Top from '../Top';
import Footer from '../Footer';

const withLayoutBasic = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const { t } = useTranslation('common');

		const memoizedValues = useMemo(() => {
			let title = '',
				desc = '',
				auth = false;

			switch (router.pathname) {
				case '/lot':
					title = 'Lots';
					desc = 'Bid on authenticated pre-owned watches';
					break;
				case '/seller':
					title = 'Sellers';
					desc = 'Trusted sellers with verified sales';
					break;
				case '/mypage':
					title = 'My Page';
					desc = 'Your lots, bids and orders';
					break;
				case '/community':
					title = 'Community';
					desc = 'Stories, guides and market talk';
					break;
				case '/community/detail':
					title = 'Community Detail';
					desc = 'Stories, guides and market talk';
					break;
				case '/cs':
					title = 'CS';
					desc = 'Notices and frequently asked questions';
					break;
				case '/account/join':
					title = 'Login / Signup';
					desc = 'Welcome to Auctra';
					auth = true;
					break;
				case '/404':
					title = 'Page not found';
					break;
				default:
					break;
			}

			return { title, desc, auth };
		}, [router.pathname]);

		return (
			<>
				<Head>
					<title>Auctra</title>
					<meta name={'title'} content={`Auctra`} />
				</Head>
				<Stack id="wrap">
					<Stack id={'top'}>
						<Top />
					</Stack>

					<Stack
						className={`header-basic ${memoizedValues.auth ? 'auth' : ''}`}
					>
						<Stack className={'container'}>
							<strong>{t(memoizedValues.title)}</strong>
							<span>{t(memoizedValues.desc)}</span>
						</Stack>
					</Stack>

					<Stack id={'main'}>
						<Component {...props} />
					</Stack>

					<Stack id={'footer'}>
						<Footer />
					</Stack>
				</Stack>
			</>
		);
	};
};

export default withLayoutBasic;

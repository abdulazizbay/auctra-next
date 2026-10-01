import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { Stack, Typography } from '@mui/material';
import Top from '../Top';
import Footer from '../Footer';
import HeaderFilter from '../homepage/HeaderFilter';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutMain = (Component: any) => {
	return (props: any) => {
		const { t } = useTranslation('common');

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

					<Stack className={'header-main'}>
						<Stack className={'container'}>
							<Typography className={'hero-title'}>
								{t('Bid on timeless pieces')}
							</Typography>
							<Typography className={'hero-desc'}>
								{t(
									'Live auctions for pre-owned luxury watches from verified sellers.',
								)}
							</Typography>
							<HeaderFilter />
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

export default withLayoutMain;

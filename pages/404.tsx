import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Button, Stack, Typography } from '@mui/material';
import withLayoutBasic from '../libs/components/layout/LayoutBasic';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const NotFound: NextPage = () => {
	const { t } = useTranslation('common');

	return (
		<div id="not-found-page">
			<Stack className={'container'}>
				<Typography className={'code'}>404</Typography>
				<Typography className={'text'}>
					{t('The page you are looking for does not exist')}
				</Typography>
				<Stack className={'buttons'}>
					<Link href={'/'}>
						<Button variant={'contained'}>{t('Back to home')}</Button>
					</Link>
					<Link href={'/lot'}>
						<Button variant={'outlined'}>{t('Browse lots')}</Button>
					</Link>
				</Stack>
			</Stack>
		</div>
	);
};

export default withLayoutBasic(NotFound);

import { NextPage } from 'next';
import { Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const { t } = useTranslation('common');

	return (
		<Stack id={'wrap'}>
			<Stack className={'container'} sx={{ gap: 2, py: 6 }}>
				<Typography variant={'h2'}>Auctra</Typography>
				<Typography variant={'body1'} color={'text.secondary'}>
					{t('Lots')} · {t('Sellers')} · {t('Community')}
				</Typography>
				<Stack direction={'row'} sx={{ gap: 1 }}>
					<Button variant={'contained'}>Place bid</Button>
					<Button variant={'outlined'}>Watch</Button>
					<Button variant={'contained'} color={'secondary'}>
						Live
					</Button>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default Home;

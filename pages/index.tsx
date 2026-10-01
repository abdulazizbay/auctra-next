import { NextPage } from 'next';
import { Button, Stack, Typography } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutMain from '../libs/components/layout/LayoutHome';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	return (
		<Stack className={'home-page'}>
			<Stack className={'container'} sx={{ gap: 2, py: 6 }}>
				<Typography variant={'h2'}>Auctra</Typography>
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

export default withLayoutMain(Home);

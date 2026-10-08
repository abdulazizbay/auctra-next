import { NextPage } from 'next';
import { Stack } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import EndingSoonLots from '../libs/components/homepage/EndingSoonLots';
import HotLots from '../libs/components/homepage/HotLots';
import NewLots from '../libs/components/homepage/NewLots';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import TopSellers from '../libs/components/homepage/TopSellers';
import SellCta from '../libs/components/homepage/SellCta';
import AuctionScene from '../libs/components/homepage/AuctionScene';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	return (
		<Stack className={'home-page'}>
			<EndingSoonLots />
			<AuctionScene />
			<HotLots />
			<NewLots />
			<CommunityBoards />
			<TopSellers />
			<SellCta />
		</Stack>
	);
};

export default withLayoutMain(Home);

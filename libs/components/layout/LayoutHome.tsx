import React from 'react';
import Seo from '../Seo';
import { Stack } from '@mui/material';
import Top from '../Top';
import Footer from '../Footer';
import HeroBanner from '../homepage/HeroBanner';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const withLayoutMain = (Component: any) => {
	return (props: any) => {
		return (
			<>
				<Seo />
				<Stack id="wrap">
					<Stack id={'top'}>
						<Top />
					</Stack>

					<HeroBanner />

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

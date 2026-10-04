import React from 'react';
import Seo from '../Seo';
import { Stack } from '@mui/material';
import Top from '../Top';
import Footer from '../Footer';

const withLayoutFull = (Component: any) => {
	return (props: any) => {
		return (
			<>
				<Seo />
				<Stack id="wrap">
					<Stack id={'top'}>
						<Top />
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

export default withLayoutFull;

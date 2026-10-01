import { NextPage } from 'next';
import { Button, Stack, Typography } from '@mui/material';

const Home: NextPage = () => {
	return (
		<Stack id={'wrap'}>
			<Stack className={'container'} sx={{ gap: 2, py: 6 }}>
				<Typography variant={'h2'}>Auctra</Typography>
				<Typography variant={'body1'} color={'text.secondary'}>
					Live auctions for pre-owned luxury watches.
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

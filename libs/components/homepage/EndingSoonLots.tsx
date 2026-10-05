import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Box, Stack } from '@mui/material';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import { useMutation, useQuery } from '@apollo/client';
import LotCard from '../lot/LotCard';
import LotCardSkeleton from '../lot/LotCardSkeleton';
import { Lot } from '../../types/lot/lot';
import { LotsInquiry } from '../../types/lot/lot.input';
import { T } from '../../types/common';
import { Message } from '../../enums/common.enum';
import { LotStatus } from '../../enums/lot.enum';
import { GET_LOTS } from '../../../apollo/user/query';
import { WATCH_TARGET_LOT } from '../../../apollo/user/mutation';
import {
	sweetMixinErrorAlert,
	sweetTopSmallSuccessAlert,
} from '../../sweetAlert';

interface EndingSoonLotsProps {
	initialInput: LotsInquiry;
}

const EndingSoonLots = (props: EndingSoonLotsProps) => {
	const { initialInput } = props;
	const { t } = useTranslation('common');
	const [endingSoonLots, setEndingSoonLots] = useState<Lot[]>([]);

	/** APOLLO REQUESTS **/
	const [watchTargetLot] = useMutation(WATCH_TARGET_LOT);
	const {
		loading: getLotsLoading,
		data: getLotsData,
		error: getLotsError,
		refetch: getLotsRefetch,
	} = useQuery(GET_LOTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setEndingSoonLots(data?.getLots?.list);
		},
	});

	/** HANDLERS **/
	const watchLotHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await watchTargetLot({ variables: { input: id } });
			await getLotsRefetch({ input: initialInput });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, watchLotHandler: ', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (!endingSoonLots) return null;

	return (
		<Stack className={'home-lots ending-soon-lots'}>
			<Stack className={'container'}>
				<Stack className={'ending-panel'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<em>
								<span className={'live-dot'} />
								{t('Last call')}
							</em>
							<span>{t('Ending Soon')}</span>
							<p>{t('Last chance to place your bid')}</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<Link
								href={{
									pathname: '/lot',
									query: {
										input: JSON.stringify({
											page: 1,
											limit: 9,
											sort: 'lotEndsAt',
											direction: 'ASC',
											search: {},
										}),
									},
								}}
								className={'more-box'}
							>
								{t('View all')}
								<EastIcon />
							</Link>
						</Box>
					</Stack>
					<Stack className={'card-box'}>
						{getLotsLoading && endingSoonLots.length === 0 ? (
							<Stack className={'skeleton-row'}>
								{[0, 1, 2, 3].map((i) => (
									<LotCardSkeleton key={i} />
								))}
							</Stack>
						) : endingSoonLots.length === 0 ? (
							<Box component={'div'} className={'empty-list'}>
								{t('No lots yet')}
							</Box>
						) : (
							<Swiper
								className={'home-lots-swiper'}
								slidesPerView={'auto'}
								spaceBetween={24}
								modules={[Navigation]}
								navigation={{
									nextEl: '.swiper-ending-next',
									prevEl: '.swiper-ending-prev',
								}}
							>
								{endingSoonLots.map((lot: Lot) => {
									return (
										<SwiperSlide key={lot._id} className={'home-lots-slide'}>
											<LotCard lot={lot} watchLotHandler={watchLotHandler} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						)}
					</Stack>
					<div className={'pagination-box'}>
						<WestIcon className={'nav-btn swiper-ending-prev'} />
						<EastIcon className={'nav-btn swiper-ending-next'} />
					</div>
				</Stack>
			</Stack>
		</Stack>
	);
};

EndingSoonLots.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'lotEndsAt',
		direction: 'ASC',
		search: {
			lotStatusList: [LotStatus.OPEN],
		},
	},
};

export default EndingSoonLots;

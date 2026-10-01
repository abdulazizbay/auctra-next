import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Box, Stack } from '@mui/material';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { useMutation, useQuery } from '@apollo/client';
import LotCard from '../lot/LotCard';
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

interface NewLotsProps {
	initialInput: LotsInquiry;
}

const NewLots = (props: NewLotsProps) => {
	const { initialInput } = props;
	const { t } = useTranslation('common');
	const [newLots, setNewLots] = useState<Lot[]>([]);

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
			setNewLots(data?.getLots?.list);
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

	if (!newLots) return null;

	return (
		<Stack className={'home-lots new-lots'}>
			<Stack className={'container'}>
				<Stack className={'info-box'}>
					<Box component={'div'} className={'left'}>
						<span>{t('Newly Listed')}</span>
						<p>{t('Fresh lots just added by sellers')}</p>
					</Box>
					<Box component={'div'} className={'right'}>
						<div className={'pagination-box'}>
							<WestIcon className={'swiper-new-prev'} />
							<div className={'swiper-new-pagination'}></div>
							<EastIcon className={'swiper-new-next'} />
						</div>
					</Box>
				</Stack>
				<Stack className={'card-box'}>
					{newLots.length === 0 ? (
						<Box component={'div'} className={'empty-list'}>
							{t('No lots yet')}
						</Box>
					) : (
						<Swiper
							className={'home-lots-swiper'}
							slidesPerView={'auto'}
							spaceBetween={24}
							modules={[Autoplay, Navigation, Pagination]}
							navigation={{
								nextEl: '.swiper-new-next',
								prevEl: '.swiper-new-prev',
							}}
							pagination={{
								el: '.swiper-new-pagination',
							}}
						>
							{newLots.map((lot: Lot) => {
								return (
									<SwiperSlide key={lot._id} className={'home-lots-slide'}>
										<LotCard lot={lot} watchLotHandler={watchLotHandler} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					)}
				</Stack>
			</Stack>
		</Stack>
	);
};

NewLots.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			lotStatus: LotStatus.OPEN,
		},
	},
};

export default NewLots;

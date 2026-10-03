import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Box, Stack } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { useQuery } from '@apollo/client';
import TopSellerCard from './TopSellerCard';
import { Member } from '../../types/member/member';
import { SellersInquiry } from '../../types/member/member.input';
import { T } from '../../types/common';
import { GET_SELLERS } from '../../../apollo/user/query';

interface TopSellersProps {
	initialInput: SellersInquiry;
}

const TopSellers = (props: TopSellersProps) => {
	const { initialInput } = props;
	const { t } = useTranslation('common');
	const [topSellers, setTopSellers] = useState<Member[]>([]);

	/** APOLLO REQUESTS **/
	const {
		loading: getSellersLoading,
		data: getSellersData,
		error: getSellersError,
		refetch: getSellersRefetch,
	} = useQuery(GET_SELLERS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTopSellers(data?.getSellers?.list);
		},
	});

	return (
		<Stack className={'top-sellers reveal'}>
			<Stack className={'container'}>
				<Stack className={'info-box'}>
					<Box component={'div'} className={'left'}>
						<em>{t('Trusted hands')}</em>
						<span>{t('Top Sellers')}</span>
						<p>{t('Highest rated sellers on Auctra')}</p>
					</Box>
					<Box component={'div'} className={'right'}>
						<Link href={'/seller'} className={'more-box'}>
							{t('See all sellers')}
							<EastIcon />
						</Link>
					</Box>
				</Stack>
				<Stack className={'wrapper'}>
					{topSellers.length === 0 ? (
						<Box component={'div'} className={'empty-list'}>
							{t('No sellers yet')}
						</Box>
					) : (
						<>
							<Box
								component={'div'}
								className={'switch-btn swiper-sellers-prev'}
							>
								<ArrowBackIosNewIcon />
							</Box>
							<Box component={'div'} className={'card-wrapper'}>
								<Swiper
									className={'top-sellers-swiper'}
									slidesPerView={'auto'}
									spaceBetween={24}
									modules={[Autoplay, Navigation, Pagination]}
									navigation={{
										nextEl: '.swiper-sellers-next',
										prevEl: '.swiper-sellers-prev',
									}}
								>
									{topSellers.map((seller: Member) => {
										return (
											<SwiperSlide
												className={'top-sellers-slide'}
												key={seller?._id}
											>
												<TopSellerCard seller={seller} />
											</SwiperSlide>
										);
									})}
								</Swiper>
							</Box>
							<Box
								component={'div'}
								className={'switch-btn swiper-sellers-next'}
							>
								<ArrowForwardIosIcon />
							</Box>
						</>
					)}
				</Stack>
			</Stack>
		</Stack>
	);
};

TopSellers.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'memberAvgRating',
		direction: 'DESC',
		search: {},
	},
};

export default TopSellers;

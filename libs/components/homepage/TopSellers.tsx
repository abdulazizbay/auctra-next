import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Box, Skeleton, Stack } from '@mui/material';
import EastIcon from '@mui/icons-material/East';
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
		<Stack className={'top-sellers'}>
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
				<Stack className={'seller-ranking'}>
					{getSellersLoading && topSellers.length === 0 ? (
						[0, 1, 2, 3, 4, 5].map((i) => (
							<Skeleton key={i} variant={'rounded'} height={72} />
						))
					) : topSellers.length === 0 ? (
						<Box component={'div'} className={'empty-list'}>
							{t('No sellers yet')}
						</Box>
					) : (
						topSellers.map((seller: Member, index: number) => (
							<TopSellerCard
								seller={seller}
								rank={index + 1}
								key={seller?._id}
							/>
						))
					)}
				</Stack>
			</Stack>
		</Stack>
	);
};

TopSellers.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'memberAvgRating',
		direction: 'DESC',
		search: {},
	},
};

export default TopSellers;

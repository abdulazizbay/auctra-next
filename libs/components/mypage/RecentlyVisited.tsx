import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useQuery } from '@apollo/client';
import { Pagination, Stack, Typography } from '@mui/material';
import LotCard from '../lot/LotCard';
import { Lot } from '../../types/lot/lot';
import { OrdinaryInquiry } from '../../types/lot/lot.input';
import { T } from '../../types/common';
import { GET_VISITED_LOTS } from '../../../apollo/user/query';

const RecentlyVisited = ({ initialInput, ...props }: any) => {
	const { t } = useTranslation('common');
	const [searchFilter, setSearchFilter] =
		useState<OrdinaryInquiry>(initialInput);
	const [visitedLots, setVisitedLots] = useState<Lot[]>([]);
	const [total, setTotal] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const {
		loading: getVisitedLotsLoading,
		data: getVisitedLotsData,
		error: getVisitedLotsError,
		refetch: getVisitedLotsRefetch,
	} = useQuery(GET_VISITED_LOTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setVisitedLots(data?.getVisitedLots?.list);
			setTotal(data?.getVisitedLots?.metaCounter[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	return (
		<div id="my-visited-page">
			<Stack className="main-title-box">
				<Typography className="main-title">
					{t('Recently Viewed')}
					<span className={'count'}>{total}</span>
				</Typography>
				<Typography className="sub-title">
					{t('Lots you opened recently')}
				</Typography>
			</Stack>
			<Stack className={'card-grid'}>
				{visitedLots?.length === 0 ? (
					<div className={'no-data'}>{t('No viewed lots yet')}</div>
				) : (
					visitedLots.map((lot: Lot) => (
						<LotCard lot={lot} key={lot?._id} recentlyVisited={true} />
					))
				)}
			</Stack>
			{total > searchFilter.limit && (
				<Stack className={'pagination-box'}>
					<Pagination
						page={searchFilter.page}
						count={Math.ceil(total / searchFilter.limit)}
						onChange={paginationHandler}
						shape="circular"
						color="primary"
					/>
				</Stack>
			)}
		</div>
	);
};

RecentlyVisited.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
	},
};

export default RecentlyVisited;

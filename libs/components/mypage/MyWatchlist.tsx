import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { Pagination, Stack, Typography } from '@mui/material';
import LotCard from '../lot/LotCard';
import { Lot } from '../../types/lot/lot';
import { OrdinaryInquiry } from '../../types/lot/lot.input';
import { T } from '../../types/common';
import { Message } from '../../enums/common.enum';
import { GET_WATCHED_LOTS } from '../../../apollo/user/query';
import { WATCH_TARGET_LOT } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert } from '../../sweetAlert';

const MyWatchlist = ({ initialInput, ...props }: any) => {
	const { t } = useTranslation('common');
	const [searchFilter, setSearchFilter] =
		useState<OrdinaryInquiry>(initialInput);
	const [watchedLots, setWatchedLots] = useState<Lot[]>([]);
	const [total, setTotal] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const [watchTargetLot] = useMutation(WATCH_TARGET_LOT);

	const {
		loading: getWatchedLotsLoading,
		data: getWatchedLotsData,
		error: getWatchedLotsError,
		refetch: getWatchedLotsRefetch,
	} = useQuery(GET_WATCHED_LOTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setWatchedLots(data?.getWatchedLots?.list);
			setTotal(data?.getWatchedLots?.metaCounter[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const watchLotHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await watchTargetLot({ variables: { input: id } });
			await getWatchedLotsRefetch({ input: searchFilter });
		} catch (err: any) {
			console.log('ERROR, watchLotHandler: ', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	return (
		<div id="my-watchlist-page">
			<Stack className="main-title-box">
				<Typography className="main-title">
					{t('Watchlist')}
					<span className={'count'}>{total}</span>
				</Typography>
				<Typography className="sub-title">
					{t('Lots you are watching')}
				</Typography>
			</Stack>
			<Stack className={'card-grid'}>
				{watchedLots?.length === 0 ? (
					<div className={'no-data'}>{t('No watched lots yet')}</div>
				) : (
					watchedLots.map((lot: Lot) => (
						<LotCard
							lot={lot}
							key={lot?._id}
							watchLotHandler={watchLotHandler}
							myWatched={true}
						/>
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

MyWatchlist.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
	},
};

export default MyWatchlist;

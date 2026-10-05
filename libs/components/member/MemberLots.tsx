import React, { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { Pagination, Stack, Typography } from '@mui/material';
import LotCard from '../lot/LotCard';
import { Lot } from '../../types/lot/lot';
import { LotsInquiry } from '../../types/lot/lot.input';
import { T } from '../../types/common';
import { LotStatus, publicLotStatuses } from '../../enums/lot.enum';
import { Message } from '../../enums/common.enum';
import { GET_LOTS } from '../../../apollo/user/query';
import { WATCH_TARGET_LOT } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert } from '../../sweetAlert';

interface MemberLotsProps {
	memberId: string;
	initialInput: LotsInquiry;
}

const MemberLots = (props: MemberLotsProps) => {
	const { memberId, initialInput } = props;
	const { t } = useTranslation('common');
	const [searchFilter, setSearchFilter] = useState<LotsInquiry>(initialInput);
	const [lots, setLots] = useState<Lot[]>([]);
	const [total, setTotal] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const [watchTargetLot] = useMutation(WATCH_TARGET_LOT);
	const {
		loading: getLotsLoading,
		data: getLotsData,
		error: getLotsError,
		refetch: getLotsRefetch,
	} = useQuery(GET_LOTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		skip: !searchFilter.search.memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setLots(data?.getLots?.list);
			setTotal(data?.getLots?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		setSearchFilter({
			...searchFilter,
			page: 1,
			search: { ...searchFilter.search, memberId },
		});
	}, [memberId]);

	/** HANDLERS **/
	const changeStatusHandler = (value: LotStatus) => {
		setSearchFilter({
			...searchFilter,
			page: 1,
			search: { ...searchFilter.search, lotStatusList: [value] },
		});
	};

	const paginationHandler = (e: ChangeEvent<unknown>, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const watchLotHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await watchTargetLot({ variables: { input: id } });
			await getLotsRefetch({ input: searchFilter });
		} catch (err: any) {
			console.log('ERROR, watchLotHandler: ', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	return (
		<Stack className={'member-section'}>
			<Stack className={'section-head'}>
				<Typography className={'section-title'}>
					{t('Lots')}
					<span className={'count'}>{total}</span>
				</Typography>
				<Stack className={'status-tabs'}>
					{publicLotStatuses.map((status: LotStatus) => (
						<Typography
							key={status}
							onClick={() => changeStatusHandler(status)}
							className={
								searchFilter.search.lotStatusList?.[0] === status
									? 'active'
									: ''
							}
						>
							{t(status)}
						</Typography>
					))}
				</Stack>
			</Stack>
			<Stack className={'lot-list'}>
				{lots?.length === 0 ? (
					<div className={'no-data'}>{t('No lots found')}</div>
				) : (
					lots.map((lot: Lot) => (
						<LotCard
							lot={lot}
							key={lot?._id}
							watchLotHandler={watchLotHandler}
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
		</Stack>
	);
};

MemberLots.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			lotStatusList: [LotStatus.OPEN],
		},
	},
};

export default MemberLots;

import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { Pagination, Stack, Typography } from '@mui/material';
import MyLotCard from './MyLotCard';
import { Lot } from '../../types/lot/lot';
import { LotsInquiry } from '../../types/lot/lot.input';
import { T } from '../../types/common';
import { LotStatus, publicLotStatuses } from '../../enums/lot.enum';
import { userVar } from '../../../apollo/store';
import { UPDATE_LOT } from '../../../apollo/user/mutation';
import { GET_LOTS } from '../../../apollo/user/query';
import {
	sweetConfirmAlert,
	sweetMixinErrorAlert,
	sweetTopSmallSuccessAlert,
} from '../../sweetAlert';

const MyLots = ({ initialInput, ...props }: any) => {
	const user = useReactiveVar(userVar);
	const { t } = useTranslation('common');
	const [searchFilter, setSearchFilter] = useState<LotsInquiry>({
		...initialInput,
		search: { ...initialInput.search, memberId: user._id },
	});
	const [myLots, setMyLots] = useState<Lot[]>([]);
	const [total, setTotal] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const [updateLot] = useMutation(UPDATE_LOT);

	const {
		loading: getLotsLoading,
		data: getLotsData,
		error: getLotsError,
		refetch: getLotsRefetch,
	} = useQuery(GET_LOTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setMyLots(data?.getLots?.list);
			setTotal(data?.getLots?.metaCounter[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const changeStatusHandler = (value: LotStatus) => {
		setSearchFilter({
			...searchFilter,
			page: 1,
			search: { ...searchFilter.search, lotStatus: value },
		});
	};

	const cancelLotHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert(t('Cancel this lot?'))) {
				await updateLot({
					variables: {
						input: {
							_id: id,
							lotStatus: LotStatus.CANCELLED,
						},
					},
				});

				await getLotsRefetch({ input: searchFilter });
				await sweetTopSmallSuccessAlert(t('Lot cancelled'), 800);
			}
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	return (
		<div id="my-lots-page">
			<Stack className="main-title-box">
				<Typography className="main-title">{t('My Lots')}</Typography>
				<Typography className="sub-title">
					{t('Manage your listings')}
				</Typography>
			</Stack>
			<Stack className="lot-list-box">
				<Stack className="tab-name-box">
					{publicLotStatuses.map((status: LotStatus) => (
						<Typography
							key={status}
							onClick={() => changeStatusHandler(status)}
							className={
								searchFilter.search.lotStatus === status
									? 'active-tab-name'
									: 'tab-name'
							}
						>
							{t(status)}
						</Typography>
					))}
				</Stack>
				<Stack className="list-box">
					<Stack className="listing-title-box">
						<Typography className="title-text">{t('Lot')}</Typography>
						<Typography className="title-text">{t('Listed')}</Typography>
						<Typography className="title-text">{t('Status')}</Typography>
						<Typography className="title-text">{t('Bids')}</Typography>
						<Typography className="title-text">{t('Action')}</Typography>
					</Stack>

					{myLots?.length === 0 ? (
						<div className={'no-data'}>
							<p>{t('No lots found')}</p>
						</div>
					) : (
						myLots.map((lot: Lot) => (
							<MyLotCard
								key={lot._id}
								lot={lot}
								cancelLotHandler={cancelLotHandler}
							/>
						))
					)}

					{myLots.length !== 0 && (
						<Stack className="pagination-config">
							<Pagination
								count={Math.ceil(total / searchFilter.limit)}
								page={searchFilter.page}
								shape="circular"
								color="primary"
								onChange={paginationHandler}
							/>
							<Typography className="total-result">
								{total} {t('lots')}
							</Typography>
						</Stack>
					)}
				</Stack>
			</Stack>
		</div>
	);
};

MyLots.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		search: {
			lotStatus: LotStatus.OPEN,
		},
	},
};

export default MyLots;

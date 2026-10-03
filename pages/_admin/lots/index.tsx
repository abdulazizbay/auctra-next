import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import moment from 'moment';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMutation, useQuery } from '@apollo/client';
import {
	Button,
	Stack,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	Tabs,
	TextField,
} from '@mui/material';
import withLayoutAdmin from '../../../libs/components/layout/LayoutAdmin';
import { GET_LOTS } from '../../../apollo/user/query';
import { UPDATE_LOT_BY_ADMIN } from '../../../apollo/admin/mutation';
import { Lot } from '../../../libs/types/lot/lot';
import { LotsInquiry } from '../../../libs/types/lot/lot.input';
import { LotStatus } from '../../../libs/enums/lot.enum';
import { T } from '../../../libs/types/common';
import { formatterStr } from '../../../libs/utils';
import {
	sweetConfirmAlert,
	sweetMixinErrorAlert,
	sweetTopSmallSuccessAlert,
} from '../../../libs/sweetAlert';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const lotTabs = [
	LotStatus.SCHEDULED,
	LotStatus.OPEN,
	LotStatus.SOLD,
	LotStatus.UNSOLD,
];

const AdminLots: NextPage = ({ initialInput, ...props }: any) => {
	const [searchFilter, setSearchFilter] = useState<LotsInquiry>(initialInput);
	const [lots, setLots] = useState<Lot[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchText, setSearchText] = useState<string>('');
	const lotStatus = searchFilter.search.lotStatusList?.[0];
	const cancellable =
		lotStatus === LotStatus.SCHEDULED || lotStatus === LotStatus.OPEN;

	/** APOLLO REQUESTS **/
	const [updateLotByAdmin] = useMutation(UPDATE_LOT_BY_ADMIN);

	const { refetch: getLotsRefetch } = useQuery(GET_LOTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setLots(data?.getLots?.list ?? []);
			setTotal(data?.getLots?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (searchText === (searchFilter.search.text ?? '')) return;
		const timer = setTimeout(
			() =>
				setSearchFilter({
					...searchFilter,
					page: 1,
					search: { ...searchFilter.search, text: searchText || undefined },
				}),
			400,
		);
		return () => clearTimeout(timer);
	}, [searchText]);

	/** HANDLERS **/
	const tabChangeHandler = (e: T, value: LotStatus) => {
		setSearchFilter({
			...searchFilter,
			page: 1,
			search: { ...searchFilter.search, lotStatusList: [value] },
		});
	};

	const cancelLotHandler = async (lot: Lot) => {
		try {
			const confirmed = await sweetConfirmAlert(
				`Cancel "${lot.lotName}"? This cannot be undone.`,
			);
			if (!confirmed) return;
			await updateLotByAdmin({
				variables: { input: { _id: lot._id, lotStatus: LotStatus.CANCELLED } },
			});
			await getLotsRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('Lot cancelled', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	return (
		<Stack className={'admin-page'}>
			<Stack className={'admin-filter'}>
				<Tabs value={lotStatus} onChange={tabChangeHandler}>
					{lotTabs.map((status) => (
						<Tab key={status} value={status} label={status} />
					))}
				</Tabs>
				<TextField
					size={'small'}
					placeholder={'Search lot'}
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
				/>
			</Stack>

			<TableContainer className={'admin-table'}>
				<Table size={'small'}>
					<TableHead>
						<TableRow>
							<TableCell>Lot</TableCell>
							<TableCell>Category</TableCell>
							<TableCell align={'right'}>Price</TableCell>
							<TableCell align={'right'}>Bids</TableCell>
							<TableCell>Starts</TableCell>
							<TableCell>Ends</TableCell>
							{cancellable && <TableCell align={'right'}>Action</TableCell>}
						</TableRow>
					</TableHead>
					<TableBody>
						{lots.map((lot) => (
							<TableRow key={lot._id}>
								<TableCell>
									<Link href={`/lot/detail?id=${lot._id}`}>{lot.lotName}</Link>
								</TableCell>
								<TableCell>{lot.lotCategory}</TableCell>
								<TableCell align={'right'}>
									${formatterStr(lot.lotCurrentPrice)}
								</TableCell>
								<TableCell align={'right'}>{lot.lotBids}</TableCell>
								<TableCell>
									{moment(lot.lotStartsAt).format('YYYY.MM.DD HH:mm')}
								</TableCell>
								<TableCell>
									{moment(lot.lotEndsAt).format('YYYY.MM.DD HH:mm')}
								</TableCell>
								{cancellable && (
									<TableCell align={'right'}>
										<Button
											size={'small'}
											color={'error'}
											onClick={() => cancelLotHandler(lot)}
										>
											Cancel
										</Button>
									</TableCell>
								)}
							</TableRow>
						))}
						{lots.length === 0 && (
							<TableRow>
								<TableCell colSpan={7} align={'center'}>
									No lots found
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				component={'div'}
				count={total}
				page={searchFilter.page - 1}
				rowsPerPage={searchFilter.limit}
				rowsPerPageOptions={[]}
				onPageChange={(e, page) =>
					setSearchFilter({ ...searchFilter, page: page + 1 })
				}
			/>
		</Stack>
	);
};

AdminLots.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		search: { lotStatusList: [LotStatus.OPEN] },
	},
};

export default withLayoutAdmin(AdminLots);

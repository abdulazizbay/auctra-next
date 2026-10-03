import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
	Box,
	Button,
	Menu,
	MenuItem,
	Pagination,
	Stack,
	Typography,
} from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';
import { useMutation, useQuery } from '@apollo/client';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Filter from '../../libs/components/lot/Filter';
import LotCard from '../../libs/components/lot/LotCard';
import { LotsInquiry } from '../../libs/types/lot/lot.input';
import { Lot } from '../../libs/types/lot/lot';
import { T } from '../../libs/types/common';
import { Direction, Message } from '../../libs/enums/common.enum';
import { GET_LOTS } from '../../apollo/user/query';
import { WATCH_TARGET_LOT } from '../../apollo/user/mutation';
import {
	sweetMixinErrorAlert,
	sweetTopSmallSuccessAlert,
} from '../../libs/sweetAlert';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const LotList: NextPage = ({ initialInput, ...props }: any) => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const [searchFilter, setSearchFilter] = useState<LotsInquiry>(
		router?.query?.input
			? JSON.parse(router?.query?.input as string)
			: initialInput,
	);
	const [lots, setLots] = useState<Lot[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [filterSortName, setFilterSortName] = useState('Newest');
	const [filtersOpen, setFiltersOpen] = useState<boolean>(false);

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
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setLots(data?.getLots?.list);
			setTotal(data?.getLots?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router?.query?.input as string);
			setSearchFilter(inputObj);
		}

		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	/** HANDLERS **/
	const handlePaginationChange = async (
		event: ChangeEvent<unknown>,
		value: number,
	) => {
		searchFilter.page = value;
		await router.push(
			`/lot?input=${JSON.stringify(searchFilter)}`,
			`/lot?input=${JSON.stringify(searchFilter)}`,
			{
				scroll: false,
			},
		);
		setCurrentPage(value);
	};

	const watchLotHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await watchTargetLot({ variables: { input: id } });
			await getLotsRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, watchLotHandler: ', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const resetFilterHandler = async () => {
		await router.push(
			`/lot?input=${JSON.stringify(initialInput)}`,
			`/lot?input=${JSON.stringify(initialInput)}`,
			{ scroll: false },
		);
	};

	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		switch (e.currentTarget.id) {
			case 'new':
				setSearchFilter({
					...searchFilter,
					sort: 'createdAt',
					direction: Direction.DESC,
				});
				setFilterSortName('Newest');
				break;
			case 'ending':
				setSearchFilter({
					...searchFilter,
					sort: 'lotEndsAt',
					direction: Direction.ASC,
				});
				setFilterSortName('Ending soon');
				break;
			case 'lowest':
				setSearchFilter({
					...searchFilter,
					sort: 'lotCurrentPrice',
					direction: Direction.ASC,
				});
				setFilterSortName('Lowest price');
				break;
			case 'highest':
				setSearchFilter({
					...searchFilter,
					sort: 'lotCurrentPrice',
					direction: Direction.DESC,
				});
				setFilterSortName('Highest price');
				break;
			case 'bids':
				setSearchFilter({
					...searchFilter,
					sort: 'lotBids',
					direction: Direction.DESC,
				});
				setFilterSortName('Most bids');
				break;
			case 'popular':
				setSearchFilter({
					...searchFilter,
					sort: 'lotPopular',
					direction: Direction.DESC,
				});
				setFilterSortName('Popular');
		}
		setSortingOpen(false);
		setAnchorEl(null);
	};

	return (
		<div id="lot-list-page">
			<Stack className="container">
				<Stack className={'lot-page'}>
					<Stack className={`filter-config ${filtersOpen ? 'open' : ''}`}>
						<Filter
							searchFilter={searchFilter}
							setSearchFilter={setSearchFilter}
							initialInput={initialInput}
						/>
					</Stack>
					<Stack className="main-config">
						<Box component={'div'} className={'listing-toolbar'}>
							<Typography className={'result-count'}>
								{t('Total {{count}} lots', { count: total })}
							</Typography>
							<Button
								className={'filter-toggle'}
								startIcon={<TuneRoundedIcon />}
								onClick={() => setFiltersOpen(!filtersOpen)}
							>
								{t('Filters')}
							</Button>
							<Box component={'div'} className={'sort-control'}>
								<Typography>{t('Sort by')}</Typography>
								<Button
									onClick={sortingClickHandler}
									endIcon={<KeyboardArrowDownRoundedIcon />}
								>
									{t(filterSortName)}
								</Button>
								<Menu
									anchorEl={anchorEl}
									open={sortingOpen}
									onClose={sortingCloseHandler}
								>
									<MenuItem onClick={sortingHandler} id={'new'} disableRipple>
										{t('Newest')}
									</MenuItem>
									<MenuItem
										onClick={sortingHandler}
										id={'ending'}
										disableRipple
									>
										{t('Ending soon')}
									</MenuItem>
									<MenuItem
										onClick={sortingHandler}
										id={'lowest'}
										disableRipple
									>
										{t('Lowest price')}
									</MenuItem>
									<MenuItem
										onClick={sortingHandler}
										id={'highest'}
										disableRipple
									>
										{t('Highest price')}
									</MenuItem>
									<MenuItem onClick={sortingHandler} id={'bids'} disableRipple>
										{t('Most bids')}
									</MenuItem>
									<MenuItem
										onClick={sortingHandler}
										id={'popular'}
										disableRipple
									>
										{t('Popular')}
									</MenuItem>
								</Menu>
							</Box>
						</Box>
						<Stack className={'list-config'}>
							{lots?.length === 0 ? (
								<div className={'no-data'}>
									<SearchOffRoundedIcon />
									<p>{t('No lots found!')}</p>
									<Button onClick={resetFilterHandler}>
										{t('Clear filters')}
									</Button>
								</div>
							) : (
								lots.map((lot: Lot) => {
									return (
										<LotCard
											lot={lot}
											key={lot?._id}
											watchLotHandler={watchLotHandler}
										/>
									);
								})
							)}
						</Stack>
						<Stack className="pagination-config">
							{lots.length !== 0 && (
								<Stack className="pagination-box">
									<Pagination
										page={currentPage}
										count={Math.ceil(total / searchFilter.limit)}
										onChange={handlePaginationChange}
										shape="circular"
										color="primary"
									/>
								</Stack>
							)}
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		</div>
	);
};

LotList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withLayoutBasic(LotList);

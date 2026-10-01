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
	OutlinedInput,
	Pagination,
	Stack,
	Typography,
} from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { useMutation, useQuery } from '@apollo/client';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import SellerCard from '../../libs/components/seller/SellerCard';
import { SellersInquiry } from '../../libs/types/member/member.input';
import { Member } from '../../libs/types/member/member';
import { T } from '../../libs/types/common';
import { Direction, Message } from '../../libs/enums/common.enum';
import { GET_SELLERS } from '../../apollo/user/query';
import { LIKE_TARGET_MEMBER } from '../../apollo/user/mutation';
import {
	sweetMixinErrorAlert,
	sweetTopSmallSuccessAlert,
} from '../../libs/sweetAlert';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const SellerList: NextPage = ({ initialInput, ...props }: any) => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const [searchFilter, setSearchFilter] = useState<SellersInquiry>(
		router?.query?.input
			? JSON.parse(router?.query?.input as string)
			: initialInput,
	);
	const [sellers, setSellers] = useState<Member[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [filterSortName, setFilterSortName] = useState('Top rated');
	const [searchText, setSearchText] = useState<string>(
		searchFilter?.search?.text ?? '',
	);

	/** APOLLO REQUESTS **/
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);
	const {
		loading: getSellersLoading,
		data: getSellersData,
		error: getSellersError,
		refetch: getSellersRefetch,
	} = useQuery(GET_SELLERS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setSellers(data?.getSellers?.list);
			setTotal(data?.getSellers?.metaCounter[0]?.total ?? 0);
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

	useEffect(() => {
		if (searchText === (searchFilter?.search?.text ?? '')) return;
		const timer = setTimeout(() => searchHandler(searchText), 400);
		return () => clearTimeout(timer);
	}, [searchText]);

	/** HANDLERS **/
	const handlePaginationChange = async (
		event: ChangeEvent<unknown>,
		value: number,
	) => {
		searchFilter.page = value;
		await router.push(
			`/seller?input=${JSON.stringify(searchFilter)}`,
			`/seller?input=${JSON.stringify(searchFilter)}`,
			{
				scroll: false,
			},
		);
		setCurrentPage(value);
	};

	const searchHandler = (text: string) => {
		setSearchFilter({
			...searchFilter,
			page: 1,
			search: { ...searchFilter.search, text: text },
		});
		setCurrentPage(1);
	};

	const likeMemberHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetMember({ variables: { input: id } });
			await getSellersRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeMemberHandler: ', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
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
			case 'rating':
				setSearchFilter({
					...searchFilter,
					sort: 'memberAvgRating',
					direction: Direction.DESC,
				});
				setFilterSortName('Top rated');
				break;
			case 'sales':
				setSearchFilter({
					...searchFilter,
					sort: 'memberSalesCount',
					direction: Direction.DESC,
				});
				setFilterSortName('Most sales');
				break;
			case 'followers':
				setSearchFilter({
					...searchFilter,
					sort: 'memberFollowers',
					direction: Direction.DESC,
				});
				setFilterSortName('Most followers');
				break;
			case 'likes':
				setSearchFilter({
					...searchFilter,
					sort: 'memberLikes',
					direction: Direction.DESC,
				});
				setFilterSortName('Most liked');
				break;
			case 'new':
				setSearchFilter({
					...searchFilter,
					sort: 'createdAt',
					direction: Direction.DESC,
				});
				setFilterSortName('Newest');
		}
		setSortingOpen(false);
		setAnchorEl(null);
	};

	return (
		<div id="seller-list-page">
			<Stack className="container">
				<Box component={'div'} className={'listing-toolbar'}>
					<OutlinedInput
						value={searchText}
						type={'text'}
						className={'search-input'}
						placeholder={t('Search sellers')}
						onChange={(e: any) => setSearchText(e.target.value)}
						startAdornment={<SearchRoundedIcon className={'search-icon'} />}
						endAdornment={
							searchText ? (
								<CancelRoundedIcon
									className={'cancel-icon'}
									onClick={() => setSearchText('')}
								/>
							) : null
						}
					/>
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
							<MenuItem onClick={sortingHandler} id={'rating'} disableRipple>
								{t('Top rated')}
							</MenuItem>
							<MenuItem onClick={sortingHandler} id={'sales'} disableRipple>
								{t('Most sales')}
							</MenuItem>
							<MenuItem onClick={sortingHandler} id={'followers'} disableRipple>
								{t('Most followers')}
							</MenuItem>
							<MenuItem onClick={sortingHandler} id={'likes'} disableRipple>
								{t('Most liked')}
							</MenuItem>
							<MenuItem onClick={sortingHandler} id={'new'} disableRipple>
								{t('Newest')}
							</MenuItem>
						</Menu>
					</Box>
				</Box>
				<Typography className={'result-count'}>
					{t('Total {{count}} sellers', { count: total })}
				</Typography>
				<Stack className={'list-config'}>
					{sellers?.length === 0 ? (
						<div className={'no-data'}>
							<p>{t('No sellers found')}</p>
						</div>
					) : (
						sellers.map((seller: Member) => {
							return (
								<SellerCard
									seller={seller}
									key={seller?._id}
									likeMemberHandler={likeMemberHandler}
								/>
							);
						})
					)}
				</Stack>
				<Stack className="pagination-config">
					{sellers.length !== 0 && (
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
		</div>
	);
};

SellerList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 12,
		sort: 'memberAvgRating',
		direction: 'DESC',
		search: {},
	},
};

export default withLayoutBasic(SellerList);

import React, { MouseEvent, useEffect, useState } from 'react';
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
	Tab,
	Typography,
} from '@mui/material';
import { TabContext, TabList } from '@mui/lab';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import CommunityCard from '../../libs/components/community/CommunityCard';
import { userVar } from '../../apollo/store';
import { Article } from '../../libs/types/article/article';
import { ArticlesInquiry } from '../../libs/types/article/article.input';
import { T } from '../../libs/types/common';
import { ArticleCategory } from '../../libs/enums/article.enum';
import { Direction, Message } from '../../libs/enums/common.enum';
import { GET_ARTICLES } from '../../apollo/user/query';
import { LIKE_TARGET_ARTICLE } from '../../apollo/user/mutation';
import {
	sweetMixinErrorAlert,
	sweetTopSmallSuccessAlert,
} from '../../libs/sweetAlert';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Community: NextPage = ({ initialInput, ...props }: T) => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);
	const [searchCommunity, setSearchCommunity] =
		useState<ArticlesInquiry>(initialInput);
	const [articles, setArticles] = useState<Article[]>([]);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [searchText, setSearchText] = useState<string>('');
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [filterSortName, setFilterSortName] = useState('Newest');
	const articleCategory = searchCommunity.search.articleCategory;

	/** APOLLO REQUESTS **/
	const [likeTargetArticle] = useMutation(LIKE_TARGET_ARTICLE);

	const {
		loading: getArticlesLoading,
		data: getArticlesData,
		error: getArticlesError,
		refetch: getArticlesRefetch,
	} = useQuery(GET_ARTICLES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchCommunity },
		skip: !articleCategory,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setArticles(data?.getArticles?.list);
			setTotalCount(data?.getArticles?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (!router.isReady) return;
		const category = router.query.articleCategory as ArticleCategory;
		if (!category) {
			router.replace(
				{
					pathname: '/community',
					query: { articleCategory: ArticleCategory.MARKET_TALK },
				},
				undefined,
				{ shallow: true },
			);
			return;
		}
		if (category !== articleCategory)
			setSearchCommunity({
				...searchCommunity,
				page: 1,
				search: { ...searchCommunity.search, articleCategory: category },
			});
	}, [router]);

	useEffect(() => {
		if (searchText === (searchCommunity.search.text ?? '')) return;
		const timer = setTimeout(
			() =>
				setSearchCommunity({
					...searchCommunity,
					page: 1,
					search: { ...searchCommunity.search, text: searchText },
				}),
			400,
		);
		return () => clearTimeout(timer);
	}, [searchText]);

	/** HANDLERS **/
	const tabChangeHandler = async (e: T, value: string) => {
		await router.push(
			{
				pathname: '/community',
				query: { articleCategory: value },
			},
			undefined,
			{ shallow: true },
		);
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchCommunity({ ...searchCommunity, page: value });
	};

	const writeHandler = async () => {
		await router.push({
			pathname: '/mypage',
			query: { category: 'writeArticle' },
		});
	};

	const likeArticleHandler = async (e: any, user: T, id: string) => {
		try {
			e.stopPropagation();
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetArticle({ variables: { input: id } });
			await getArticlesRefetch({ input: searchCommunity });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeArticleHandler: ', err.message);
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
			case 'new':
				setSearchCommunity({
					...searchCommunity,
					sort: 'createdAt',
					direction: Direction.DESC,
				});
				setFilterSortName('Newest');
				break;
			case 'likes':
				setSearchCommunity({
					...searchCommunity,
					sort: 'articleLikes',
					direction: Direction.DESC,
				});
				setFilterSortName('Most liked');
				break;
			case 'views':
				setSearchCommunity({
					...searchCommunity,
					sort: 'articleViews',
					direction: Direction.DESC,
				});
				setFilterSortName('Most viewed');
		}
		setSortingOpen(false);
		setAnchorEl(null);
	};

	return (
		<div id="community-list-page">
			<Stack className="container">
				<Box component={'div'} className={'board-bar'}>
					<TabContext value={articleCategory ?? ArticleCategory.MARKET_TALK}>
						<TabList
							className={'category-tabs'}
							onChange={tabChangeHandler}
							variant={'scrollable'}
							scrollButtons={false}
						>
							{Object.values(ArticleCategory).map((category) => (
								<Tab
									key={category}
									value={category}
									label={t(category)}
									disableRipple
								/>
							))}
						</TabList>
					</TabContext>

					<Box component={'div'} className={'board-actions'}>
						<OutlinedInput
							value={searchText}
							type={'text'}
							className={'search-input'}
							placeholder={t('Search articles')}
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
						{user?._id && (
							<Button
								className={'write-button'}
								startIcon={<EditRoundedIcon />}
								onClick={writeHandler}
							>
								{t('Write')}
							</Button>
						)}
					</Box>
				</Box>

				<Box component={'div'} className={'listing-toolbar'}>
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
							<MenuItem onClick={sortingHandler} id={'likes'} disableRipple>
								{t('Most liked')}
							</MenuItem>
							<MenuItem onClick={sortingHandler} id={'views'} disableRipple>
								{t('Most viewed')}
							</MenuItem>
						</Menu>
					</Box>
				</Box>

				<Stack className={'list-config'}>
					{articles?.length === 0 ? (
						<div className={'no-data'}>{t('No articles found')}</div>
					) : (
						articles.map((article: Article) => (
							<CommunityCard
								article={article}
								key={article?._id}
								likeArticleHandler={likeArticleHandler}
							/>
						))
					)}
				</Stack>

				{totalCount > searchCommunity.limit && (
					<Stack className={'pagination-config'}>
						<Pagination
							page={searchCommunity.page}
							count={Math.ceil(totalCount / searchCommunity.limit)}
							onChange={paginationHandler}
							shape="circular"
							color="primary"
						/>
					</Stack>
				)}
			</Stack>
		</div>
	);
};

Community.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withLayoutBasic(Community);

import React, { useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import moment from 'moment';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMutation, useQuery } from '@apollo/client';
import {
	Button,
	MenuItem,
	Select,
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
} from '@mui/material';
import withLayoutAdmin from '../../../libs/components/layout/LayoutAdmin';
import { GET_ALL_ARTICLES_BY_ADMIN } from '../../../apollo/admin/query';
import {
	REMOVE_ARTICLE_BY_ADMIN,
	UPDATE_ARTICLE_BY_ADMIN,
} from '../../../apollo/admin/mutation';
import { Article } from '../../../libs/types/article/article';
import { AllArticlesInquiry } from '../../../libs/types/article/article.input';
import {
	ArticleCategory,
	ArticleStatus,
} from '../../../libs/enums/article.enum';
import { T } from '../../../libs/types/common';
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

const AdminCommunity: NextPage = ({ initialInput, ...props }: any) => {
	const [searchFilter, setSearchFilter] =
		useState<AllArticlesInquiry>(initialInput);
	const [articles, setArticles] = useState<Article[]>([]);
	const [total, setTotal] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const [updateArticleByAdmin] = useMutation(UPDATE_ARTICLE_BY_ADMIN);
	const [removeArticleByAdmin] = useMutation(REMOVE_ARTICLE_BY_ADMIN);

	const { refetch: getArticlesRefetch } = useQuery(GET_ALL_ARTICLES_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setArticles(data?.getAllArticlesByAdmin?.list ?? []);
			setTotal(data?.getAllArticlesByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const searchChangeHandler = (key: string, value: string) => {
		setSearchFilter({
			...searchFilter,
			page: 1,
			search: { ...searchFilter.search, [key]: value || undefined },
		});
	};

	const statusHandler = async (article: Article, status: ArticleStatus) => {
		try {
			const confirmed = await sweetConfirmAlert(
				`${status === ArticleStatus.DELETED ? 'Delete' : 'Restore'} "${
					article.articleTitle
				}"?`,
			);
			if (!confirmed) return;
			await updateArticleByAdmin({
				variables: { input: { _id: article._id, articleStatus: status } },
			});
			await getArticlesRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('Updated', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const removeHandler = async (article: Article) => {
		try {
			const confirmed = await sweetConfirmAlert(
				`Permanently remove "${article.articleTitle}"?`,
			);
			if (!confirmed) return;
			await removeArticleByAdmin({ variables: { input: article._id } });
			await getArticlesRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('Removed', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	return (
		<Stack className={'admin-page'}>
			<Stack className={'admin-filter'}>
				<Tabs
					value={searchFilter.search.articleCategory ?? ''}
					onChange={(e, value) => searchChangeHandler('articleCategory', value)}
					variant={'scrollable'}
				>
					<Tab value={''} label={'All'} />
					{Object.values(ArticleCategory).map((category) => (
						<Tab key={category} value={category} label={category} />
					))}
				</Tabs>
				<Select
					size={'small'}
					value={searchFilter.search.articleStatus ?? ''}
					displayEmpty
					onChange={(e) => searchChangeHandler('articleStatus', e.target.value)}
				>
					<MenuItem value={''}>All statuses</MenuItem>
					<MenuItem value={ArticleStatus.ACTIVE}>ACTIVE</MenuItem>
					<MenuItem value={ArticleStatus.DELETED}>DELETED</MenuItem>
				</Select>
			</Stack>

			<TableContainer className={'admin-table'}>
				<Table size={'small'}>
					<TableHead>
						<TableRow>
							<TableCell>Title</TableCell>
							<TableCell>Category</TableCell>
							<TableCell>Author</TableCell>
							<TableCell align={'right'}>Views</TableCell>
							<TableCell align={'right'}>Likes</TableCell>
							<TableCell align={'right'}>Comments</TableCell>
							<TableCell>Created</TableCell>
							<TableCell>Status</TableCell>
							<TableCell align={'right'}>Action</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{articles.map((article) => (
							<TableRow key={article._id}>
								<TableCell>
									<Link href={`/community/detail?id=${article._id}`}>
										{article.articleTitle}
									</Link>
								</TableCell>
								<TableCell>{article.articleCategory}</TableCell>
								<TableCell>{article.memberData?.memberNick}</TableCell>
								<TableCell align={'right'}>{article.articleViews}</TableCell>
								<TableCell align={'right'}>{article.articleLikes}</TableCell>
								<TableCell align={'right'}>{article.articleComments}</TableCell>
								<TableCell>
									{moment(article.createdAt).format('YYYY.MM.DD')}
								</TableCell>
								<TableCell>{article.articleStatus}</TableCell>
								<TableCell align={'right'} className={'actions'}>
									{article.articleStatus === ArticleStatus.ACTIVE ? (
										<Button
											size={'small'}
											color={'error'}
											onClick={() =>
												statusHandler(article, ArticleStatus.DELETED)
											}
										>
											Delete
										</Button>
									) : (
										<>
											<Button
												size={'small'}
												onClick={() =>
													statusHandler(article, ArticleStatus.ACTIVE)
												}
											>
												Restore
											</Button>
											<Button
												size={'small'}
												color={'error'}
												onClick={() => removeHandler(article)}
											>
												Remove
											</Button>
										</>
									)}
								</TableCell>
							</TableRow>
						))}
						{articles.length === 0 && (
							<TableRow>
								<TableCell colSpan={9} align={'center'}>
									No articles found
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

AdminCommunity.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		search: {},
	},
};

export default withLayoutAdmin(AdminCommunity);

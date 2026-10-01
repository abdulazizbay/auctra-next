import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { Pagination, Stack, Typography } from '@mui/material';
import CommunityCard from '../community/CommunityCard';
import { userVar } from '../../../apollo/store';
import { Article } from '../../types/article/article';
import { ArticlesInquiry } from '../../types/article/article.input';
import { T } from '../../types/common';
import { Message } from '../../enums/common.enum';
import { GET_ARTICLES } from '../../../apollo/user/query';
import { LIKE_TARGET_ARTICLE } from '../../../apollo/user/mutation';
import {
	sweetMixinErrorAlert,
	sweetTopSmallSuccessAlert,
} from '../../sweetAlert';

const MemberArticles = ({ initialInput, ...props }: any) => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);
	const [searchFilter, setSearchFilter] =
		useState<ArticlesInquiry>(initialInput);
	const [memberArticles, setMemberArticles] = useState<Article[]>([]);
	const [total, setTotal] = useState<number>(0);
	const isMine = !router.query.memberId;

	/** APOLLO REQUESTS **/
	const [likeTargetArticle] = useMutation(LIKE_TARGET_ARTICLE);

	const {
		loading: getArticlesLoading,
		data: getArticlesData,
		error: getArticlesError,
		refetch: getArticlesRefetch,
	} = useQuery(GET_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		skip: !searchFilter?.search?.memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setMemberArticles(data?.getArticles?.list);
			setTotal(data?.getArticles?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		const memberId = (router.query.memberId as string) ?? user?._id;
		if (memberId)
			setSearchFilter({ ...searchFilter, page: 1, search: { memberId } });
	}, [router, user?._id]);

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const likeArticleHandler = async (e: any, user: T, id: string) => {
		try {
			e.stopPropagation();
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetArticle({ variables: { input: id } });
			await getArticlesRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeArticleHandler: ', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	return (
		<div id="member-articles-page">
			<Stack className="main-title-box">
				<Typography className="main-title">
					{isMine ? t('My Articles') : t('Articles')}
					<span className={'count'}>{total}</span>
				</Typography>
			</Stack>
			<Stack className={'card-grid'}>
				{memberArticles?.length === 0 ? (
					<div className={'no-data'}>{t('No articles yet')}</div>
				) : (
					memberArticles.map((article: Article) => (
						<CommunityCard
							article={article}
							key={article?._id}
							likeArticleHandler={likeArticleHandler}
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

MemberArticles.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default MemberArticles;

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Box, Stack, Typography } from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import { useQuery } from '@apollo/client';
import CommunityCard from './CommunityCard';
import { Article } from '../../types/article/article';
import { ArticleCategory } from '../../enums/article.enum';
import { T } from '../../types/common';
import { GET_ARTICLES } from '../../../apollo/user/query';

const CommunityBoards = () => {
	const { t } = useTranslation('common');
	const [searchCommunity, setSearchCommunity] = useState({
		page: 1,
		sort: 'articleViews',
		direction: 'DESC',
	});
	const [newsArticles, setNewsArticles] = useState<Article[]>([]);
	const [marketTalkArticles, setMarketTalkArticles] = useState<Article[]>([]);

	/** APOLLO REQUESTS **/
	const {
		loading: getNewsArticlesLoading,
		data: getNewsArticlesData,
		error: getNewsArticlesError,
		refetch: getNewsArticlesRefetch,
	} = useQuery(GET_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				...searchCommunity,
				limit: 6,
				search: { articleCategory: ArticleCategory.NEWS },
			},
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setNewsArticles(data?.getArticles?.list);
		},
	});

	const {
		loading: getMarketTalkArticlesLoading,
		data: getMarketTalkArticlesData,
		error: getMarketTalkArticlesError,
		refetch: getMarketTalkArticlesRefetch,
	} = useQuery(GET_ARTICLES, {
		fetchPolicy: 'network-only',
		variables: {
			input: {
				...searchCommunity,
				limit: 3,
				search: { articleCategory: ArticleCategory.MARKET_TALK },
			},
		},
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setMarketTalkArticles(data?.getArticles?.list);
		},
	});

	return (
		<Stack className={'community-board'}>
			<Stack className={'container'}>
				<Stack className={'info-box'}>
					<Box component={'div'} className={'left'}>
						<em>{t('Journal')}</em>
						<span>{t('Community Board')}</span>
						<p>{t('News, stories and market talk from collectors')}</p>
					</Box>
					<Box component={'div'} className={'right'}>
						<Link
							href={'/community?articleCategory=NEWS'}
							className={'more-box'}
						>
							{t('View all')}
							<EastIcon />
						</Link>
					</Box>
				</Stack>
				<Stack className="community-main">
					<Stack className={'community-left'}>
						<Stack className={'content-top'}>
							<Link href={'/community?articleCategory=NEWS'}>
								<span>{t('NEWS')}</span>
							</Link>
							<EastIcon />
						</Stack>
						<Stack className={'card-wrap'}>
							{newsArticles.length === 0 ? (
								<Typography className={'empty-list'}>
									{t('No articles yet')}
								</Typography>
							) : (
								newsArticles.map((article, index) => {
									return (
										<CommunityCard
											vertical={true}
											article={article}
											index={index}
											key={article?._id}
										/>
									);
								})
							)}
						</Stack>
					</Stack>
					<Stack className={'community-right'}>
						<Stack className={'content-top'}>
							<Link href={'/community?articleCategory=MARKET_TALK'}>
								<span>{t('MARKET_TALK')}</span>
							</Link>
							<EastIcon />
						</Stack>
						<Stack className={'card-wrap vertical'}>
							{marketTalkArticles.length === 0 ? (
								<Typography className={'empty-list'}>
									{t('No articles yet')}
								</Typography>
							) : (
								marketTalkArticles.map((article, index) => {
									return (
										<CommunityCard
											vertical={false}
											article={article}
											index={index}
											key={article?._id}
										/>
									);
								})
							)}
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default CommunityBoards;

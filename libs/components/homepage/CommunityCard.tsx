import React from 'react';
import Link from 'next/link';
import Moment from 'react-moment';
import { useTranslation } from 'next-i18next';
import { Box } from '@mui/material';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import { Article } from '../../types/article/article';
import { REACT_APP_API_URL } from '../../config';

interface CommunityCardProps {
	vertical: boolean;
	article: Article;
	index: number;
}

const CommunityCard = (props: CommunityCardProps) => {
	const { vertical, article, index } = props;
	const { t } = useTranslation('common');
	const image = article?.articleImages?.[0];
	const articleImage: string = !image
		? ''
		: image.startsWith('http')
		? image
		: `${REACT_APP_API_URL}/${image}`;

	if (vertical) {
		return (
			<Link
				href={`/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`}
			>
				<Box component={'div'} className={'vertical-card'}>
					<div
						className={'community-img'}
						style={
							articleImage ? { backgroundImage: `url(${articleImage})` } : {}
						}
					>
						{!articleImage && <ArticleOutlinedIcon className={'no-image'} />}
						<div>{index + 1}</div>
					</div>
					<strong>{article?.articleTitle}</strong>
					<span>{t(article?.articleCategory)}</span>
				</Box>
			</Link>
		);
	} else {
		return (
			<Link
				href={`/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`}
			>
				<Box component={'div'} className="horizontal-card">
					{articleImage ? (
						<img src={articleImage} alt="" loading="lazy" decoding="async" />
					) : (
						<div className={'no-image-box'}>
							<ArticleOutlinedIcon />
						</div>
					)}
					<div>
						<strong>{article.articleTitle}</strong>
						<span>
							<Moment format="DD.MM.YY">{article?.createdAt}</Moment>
						</span>
					</div>
				</Box>
			</Link>
		);
	}
};

export default CommunityCard;

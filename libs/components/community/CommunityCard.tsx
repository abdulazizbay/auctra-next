import React from 'react';
import Link from 'next/link';
import moment from 'moment';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Article } from '../../types/article/article';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../config';

interface CommunityCardProps {
	article: Article;
	likeArticleHandler: any;
}

const imageUrl = (image?: string) =>
	!image
		? ''
		: image.startsWith('http')
		? image
		: `${REACT_APP_API_URL}/${image}`;

const CommunityCard = (props: CommunityCardProps) => {
	const { article, likeArticleHandler } = props;
	const user = useReactiveVar(userVar);
	const { t } = useTranslation('common');
	const articleImage = imageUrl(article?.articleImages?.[0]);
	const authorImage = imageUrl(article?.memberData?.memberImage);
	const preview = article?.articleContent?.replace(/<[^>]+>/g, ' ') ?? '';
	const isLiked = !!article?.meLiked?.[0]?.myFavorite;
	const detailHref = `/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`;

	return (
		<Stack className="community-card">
			<Link href={detailHref} className={'image-box'}>
				{articleImage ? (
					<img src={articleImage} alt={article?.articleTitle} />
				) : (
					<Box component={'div'} className={'no-image'}>
						<ArticleOutlinedIcon />
					</Box>
				)}
				<span className={'category-chip'}>{t(article?.articleCategory)}</span>
				<Box component={'div'} className={'date-badge'}>
					<strong>{moment(article?.createdAt).format('DD')}</strong>
					<span>{moment(article?.createdAt).format('MMM')}</span>
				</Box>
			</Link>
			<Stack className={'content'}>
				<Link href={detailHref} className={'title'}>
					{article?.articleTitle}
				</Link>
				<Typography className={'preview'}>{preview}</Typography>
				<Box component={'div'} className={'footer'}>
					<Box component={'div'} className={'author'}>
						<Avatar src={authorImage || undefined} className={'avatar'}>
							{article?.memberData?.memberNick?.[0]?.toUpperCase()}
						</Avatar>
						<span>{article?.memberData?.memberNick}</span>
					</Box>
					<Box component={'div'} className={'counts'}>
						<span>
							<RemoveRedEyeOutlinedIcon />
							{article?.articleViews}
						</span>
						<span>
							<ChatBubbleOutlineRoundedIcon />
							{article?.articleComments}
						</span>
						<Button
							className={`like-button ${isLiked ? 'liked' : ''}`}
							startIcon={isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
							onClick={(e: any) => likeArticleHandler(e, user, article?._id)}
						>
							{article?.articleLikes}
						</Button>
					</Box>
				</Box>
			</Stack>
		</Stack>
	);
};

export default CommunityCard;

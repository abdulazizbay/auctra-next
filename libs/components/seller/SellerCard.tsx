import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Member } from '../../types/member/member';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../config';

interface SellerCardProps {
	seller: Member;
	likeMemberHandler: any;
}

const SellerCard = (props: SellerCardProps) => {
	const { seller, likeMemberHandler } = props;
	const user = useReactiveVar(userVar);
	const { t } = useTranslation('common');
	const image = seller?.memberImage;
	const sellerImage: string = !image
		? ''
		: image.startsWith('http')
		? image
		: `${REACT_APP_API_URL}/${image}`;
	const isTrusted =
		seller?.memberAvgRating >= 4 && seller?.memberSalesCount >= 5;
	const isLiked = !!seller?.meLiked?.[0]?.myFavorite;
	const detailHref = { pathname: '/member', query: { memberId: seller?._id } };

	return (
		<Stack className="seller-card">
			<Box component={'div'} className={'cover'}>
				{isTrusted && (
					<span className={'trusted-chip'}>
						<VerifiedRoundedIcon />
						{t('Trusted')}
					</span>
				)}
			</Box>
			<Link href={detailHref} className={'seller-info'}>
				<Avatar src={sellerImage || undefined} className={'avatar'}>
					{seller?.memberNick?.[0]?.toUpperCase()}
				</Avatar>
				<strong className={'name'}>{seller?.memberNick}</strong>
				<Typography className={'rating'}>
					<StarRoundedIcon />
					{seller?.memberReviewCount ? (
						<>
							<b>{seller?.memberAvgRating?.toFixed(1)}</b>
							<span>
								{t('{{count}} reviews', { count: seller?.memberReviewCount })}
							</span>
						</>
					) : (
						<span>{t('No reviews yet')}</span>
					)}
				</Typography>
			</Link>
			<Stack className={'stats'}>
				<Box component={'div'}>
					<strong>{seller?.memberSalesCount}</strong>
					<span>{t('Sales')}</span>
				</Box>
				<Box component={'div'}>
					<strong>{seller?.memberFollowers}</strong>
					<span>{t('Followers')}</span>
				</Box>
				<Box component={'div'}>
					<strong>{seller?.memberViews}</strong>
					<span>{t('Views')}</span>
				</Box>
			</Stack>
			<Stack className={'buttons'}>
				<Link href={detailHref} className={'profile-link'}>
					{t('View profile')}
				</Link>
				<Button
					className={`like-button ${isLiked ? 'liked' : ''}`}
					onClick={() => likeMemberHandler(user, seller?._id)}
					startIcon={isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
				>
					{seller?.memberLikes}
				</Button>
			</Stack>
		</Stack>
	);
};

export default SellerCard;

import React from 'react';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Member } from '../../types/member/member';
import { MeLiked } from '../../types/like/like';
import { MeFollowed } from '../../types/follow/follow';
import { MemberType } from '../../enums/member.enum';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../config';

interface MemberFollowCardProps {
	member?: Member;
	meLiked?: MeLiked[];
	meFollowed?: MeFollowed[];
	likeHandler: any;
	subscribeHandler: any;
	unsubscribeHandler: any;
	redirectToMemberPageHandler: any;
}

const MemberFollowCard = (props: MemberFollowCardProps) => {
	const {
		member,
		meLiked,
		meFollowed,
		likeHandler,
		subscribeHandler,
		unsubscribeHandler,
		redirectToMemberPageHandler,
	} = props;
	const user = useReactiveVar(userVar);
	const { t } = useTranslation('common');
	const image = member?.memberImage;
	const imagePath: string = !image
		? ''
		: image.startsWith('http')
		? image
		: `${REACT_APP_API_URL}/${image}`;
	const isMe = member?._id === user?._id;
	const isLiked = !!meLiked?.[0]?.myFavorite;
	const isFollowing = !!meFollowed?.[0]?.myFollowing;

	return (
		<Stack className={'follow-card'}>
			<Box
				component={'div'}
				className={'info'}
				onClick={() => redirectToMemberPageHandler(member?._id)}
			>
				<Avatar src={imagePath || undefined} className={'avatar'}>
					{member?.memberNick?.[0]?.toUpperCase()}
				</Avatar>
				<Stack className={'name-box'}>
					<strong>{member?.memberNick}</strong>
					{member?.memberType === MemberType.SELLER && (
						<span className={'seller-badge'}>{t('Seller')}</span>
					)}
				</Stack>
			</Box>
			<Box component={'div'} className={'stats'}>
				<span>
					<b>{member?.memberFollowers}</b> {t('Followers')}
				</span>
				<span>
					<b>{member?.memberFollowings}</b> {t('Followings')}
				</span>
			</Box>
			{!isMe && (
				<Box component={'div'} className={'actions'}>
					<Button
						className={`like-button ${isLiked ? 'liked' : ''}`}
						startIcon={isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
						onClick={() => likeHandler(member?._id)}
					>
						{member?.memberLikes}
					</Button>
					<Button
						className={`follow-button ${isFollowing ? 'following' : ''}`}
						onClick={() =>
							isFollowing
								? unsubscribeHandler(member?._id)
								: subscribeHandler(member?._id)
						}
					>
						{isFollowing ? t('Following') : t('Follow')}
					</Button>
				</Box>
			)}
		</Stack>
	);
};

export default MemberFollowCard;

import React from 'react';
import Link from 'next/link';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useQuery, useReactiveVar } from '@apollo/client';
import {
	Avatar,
	Box,
	Button,
	List,
	ListItem,
	Stack,
	Typography,
} from '@mui/material';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { userVar } from '../../../apollo/store';
import { T } from '../../types/common';
import { MemberType } from '../../enums/member.enum';
import { REACT_APP_API_URL } from '../../config';
import { GET_MEMBER } from '../../../apollo/user/query';

interface MemberMenuProps {
	subscribeHandler: any;
	unsubscribeHandler: any;
	likeMemberHandler: any;
}

const MemberMenu = (props: MemberMenuProps) => {
	const { subscribeHandler, unsubscribeHandler, likeMemberHandler } = props;
	const router = useRouter();
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);
	const category: any = router.query?.category;
	const memberId = router.query.memberId as string;

	/** APOLLO REQUESTS **/
	const {
		loading: getMemberLoading,
		data: getMemberData,
		error: getMemberError,
		refetch: getMemberRefetch,
	} = useQuery(GET_MEMBER, {
		fetchPolicy: 'network-only',
		variables: { input: memberId },
		skip: !memberId,
		notifyOnNetworkStatusChange: true,
	});
	const member = getMemberData?.getMember;

	if (getMemberError)
		return <div className={'no-data'}>{t('Member not found')}</div>;
	if (!member) return null;

	const image = member.memberImage;
	const imagePath: string = !image
		? ''
		: image.startsWith('http')
		? image
		: `${REACT_APP_API_URL}/${image}`;
	const isSeller = member.memberType === MemberType.SELLER;
	const isFollowing = !!member.meFollowed?.[0]?.myFollowing;
	const isLiked = !!member.meLiked?.[0]?.myFavorite;
	const menu = [
		{ key: 'articles', label: 'Articles', icon: <ArticleOutlinedIcon /> },
		{
			key: 'followers',
			label: 'Followers',
			icon: <GroupOutlinedIcon />,
			count: member.memberFollowers,
		},
		{
			key: 'followings',
			label: 'Followings',
			icon: <PersonAddAltOutlinedIcon />,
			count: member.memberFollowings,
		},
	];

	return (
		<Stack className={'my-menu member-menu'}>
			<Stack className={'member-profile'}>
				<Avatar src={imagePath || undefined} className={'profile-img'}>
					{member.memberNick?.[0]?.toUpperCase()}
				</Avatar>
				<Typography className={'user-name'}>{member.memberNick}</Typography>
				{isSeller && (
					<span className={'seller-badge'}>
						<StorefrontOutlinedIcon />
						{t('Seller')}
					</span>
				)}
				<Typography className={'joined'}>
					{t('Joined {{date}}', {
						date: moment(member.createdAt).format('MMM YYYY'),
					})}
				</Typography>
				{member.memberBio && (
					<Typography className={'bio'}>{member.memberBio}</Typography>
				)}
				{user?._id !== member._id && (
					<Box component={'div'} className={'actions'}>
						<Button
							className={`follow-button ${isFollowing ? 'following' : ''}`}
							onClick={() =>
								isFollowing
									? unsubscribeHandler(member._id, getMemberRefetch, memberId)
									: subscribeHandler(member._id, getMemberRefetch, memberId)
							}
						>
							{isFollowing ? t('Following') : t('Follow')}
						</Button>
						<Button
							className={`like-button ${isLiked ? 'liked' : ''}`}
							startIcon={isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
							onClick={() =>
								likeMemberHandler(member._id, getMemberRefetch, memberId)
							}
						>
							{member.memberLikes}
						</Button>
					</Box>
				)}
				{isSeller && (
					<Link
						href={{ pathname: '/seller/detail', query: { id: member._id } }}
						className={'seller-link'}
					>
						{t('View seller page')}
					</Link>
				)}
			</Stack>
			<Stack className={'section'}>
				<List className={'sub-section'}>
					{menu.map((item: T) => (
						<ListItem
							key={item.key}
							className={category === item.key ? 'focus' : ''}
						>
							<Link
								href={{
									pathname: '/member',
									query: { ...router.query, category: item.key },
								}}
								scroll={false}
							>
								{item.icon}
								<Typography className={'sub-title'}>{t(item.label)}</Typography>
								{item.count !== undefined && (
									<span className={'count'}>{item.count}</span>
								)}
							</Link>
						</ListItem>
					))}
				</List>
			</Stack>
		</Stack>
	);
};

export default MemberMenu;

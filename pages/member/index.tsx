import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import moment from 'moment';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import HowToRegRoundedIcon from '@mui/icons-material/HowToRegRounded';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import withLayoutFull from '../../libs/components/layout/LayoutFull';
import MemberLots from '../../libs/components/member/MemberLots';
import MemberReviews from '../../libs/components/member/MemberReviews';
import MemberArticles from '../../libs/components/member/MemberArticles';
import MemberFollowers from '../../libs/components/member/MemberFollowers';
import MemberFollowings from '../../libs/components/member/MemberFollowings';
import { userVar } from '../../apollo/store';
import { Member } from '../../libs/types/member/member';
import { MemberType } from '../../libs/enums/member.enum';
import { Message } from '../../libs/enums/common.enum';
import { REACT_APP_API_URL } from '../../libs/config';
import { GET_MEMBER } from '../../apollo/user/query';
import {
	LIKE_TARGET_MEMBER,
	SUBSCRIBE,
	UNSUBSCRIBE,
} from '../../apollo/user/mutation';
import {
	sweetErrorHandling,
	sweetMixinErrorAlert,
	sweetTopSmallSuccessAlert,
} from '../../libs/sweetAlert';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const MemberPage: NextPage = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);
	const memberId = router.query?.memberId as string;

	/** APOLLO REQUESTS **/
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

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
	const member: Member | undefined = getMemberData?.getMember;

	/** LIFECYCLES **/
	useEffect(() => {
		if (!router.isReady) return;
		if (memberId && memberId === user?._id) router.replace('/mypage');
	}, [router, user?._id]);

	/** HANDLERS **/
	const subscribeHandler = async (id: string, refetch: any, query: any) => {
		try {
			if (!id) throw new Error(Message.SOMETHING_WENT_WRONG);
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await subscribe({ variables: { input: id } });
			await sweetTopSmallSuccessAlert(t('Followed'), 800);
			await refetch({ input: query });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const unsubscribeHandler = async (id: string, refetch: any, query: any) => {
		try {
			if (!id) throw new Error(Message.SOMETHING_WENT_WRONG);
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await unsubscribe({ variables: { input: id } });
			await sweetTopSmallSuccessAlert(t('Unfollowed'), 800);
			await refetch({ input: query });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const likeMemberHandler = async (id: string, refetch: any, query: any) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetMember({ variables: { input: id } });
			await sweetTopSmallSuccessAlert('Success!', 800);
			await refetch({ input: query });
		} catch (err: any) {
			console.log('ERROR, likeMemberHandler:', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const redirectToMemberPageHandler = async (memberId: string) => {
		try {
			if (memberId === user?._id) await router.push('/mypage');
			else await router.push({ pathname: '/member', query: { memberId } });
		} catch (error) {
			await sweetErrorHandling(error);
		}
	};

	const changeCategoryHandler = (category: string) => {
		router.replace(
			{ pathname: '/member', query: { memberId, category } },
			undefined,
			{ shallow: true, scroll: false },
		);
	};

	if (getMemberError)
		return (
			<div id="member-page">
				<Stack className="container">
					<div className={'no-data'}>{t('Member not found')}</div>
				</Stack>
			</div>
		);

	if (!member) return <div id="member-page" />;

	const image = member.memberImage;
	const memberImage: string = !image
		? ''
		: image.startsWith('http')
		? image
		: `${REACT_APP_API_URL}/${image}`;
	const isSeller = member.memberType === MemberType.SELLER;
	const isTrusted =
		isSeller && member.memberAvgRating >= 4 && member.memberSalesCount >= 5;
	const isFollowing = !!member.meFollowed?.[0]?.myFollowing;
	const isLiked = !!member.meLiked?.[0]?.myFavorite;
	const location = member.memberLocation
		? member.memberLocation.charAt(0) +
		  member.memberLocation.slice(1).toLowerCase()
		: '';
	const tabs = [
		...(isSeller
			? [
					{ key: 'lots', label: 'Lots' },
					{ key: 'reviews', label: 'Reviews', count: member.memberReviewCount },
			  ]
			: []),
		{ key: 'articles', label: 'Articles' },
		{ key: 'followers', label: 'Followers', count: member.memberFollowers },
		{ key: 'followings', label: 'Followings', count: member.memberFollowings },
	];
	const queryCategory = router.query?.category as string;
	const category = tabs.some((tab) => tab.key === queryCategory)
		? queryCategory
		: tabs[0].key;

	return (
		<div id="member-page">
			<Stack className="container">
				<Stack className={'profile-box'}>
					<Box component={'div'} className={'cover'}>
						{isTrusted && (
							<span className={'trusted-chip'}>
								<VerifiedRoundedIcon />
								{t('Trusted seller')}
							</span>
						)}
					</Box>
					<Stack className={'profile-main'}>
						<Avatar src={memberImage || undefined} className={'avatar'}>
							{member.memberNick?.[0]?.toUpperCase()}
						</Avatar>
						<Stack className={'profile-info'}>
							<Typography className={'name'}>
								{member.memberNick}
								{isTrusted && <VerifiedRoundedIcon className={'trusted'} />}
							</Typography>
							{isSeller && (
								<Typography className={'rating'}>
									<span className={'seller-chip'}>
										<StorefrontOutlinedIcon />
										{t('Seller')}
									</span>
									<StarRoundedIcon />
									{member.memberReviewCount ? (
										<>
											<b>{member.memberAvgRating?.toFixed(1)}</b>
											<span>
												{t('{{count}} reviews', {
													count: member.memberReviewCount,
												})}
											</span>
										</>
									) : (
										<span>{t('No reviews yet')}</span>
									)}
								</Typography>
							)}
							{member.memberBio && (
								<Typography className={'bio'}>{member.memberBio}</Typography>
							)}
							<Box component={'div'} className={'meta'}>
								{location && (
									<span>
										<PlaceOutlinedIcon />
										{location}
									</span>
								)}
								<span>
									<CalendarMonthOutlinedIcon />
									{t('Joined {{date}}', {
										date: moment(member.createdAt).format('MMM YYYY'),
									})}
								</span>
							</Box>
						</Stack>
						<Stack className={'actions'}>
							<Button
								className={`follow-button ${isFollowing ? 'following' : ''}`}
								startIcon={
									isFollowing ? (
										<HowToRegRoundedIcon />
									) : (
										<PersonAddAlt1RoundedIcon />
									)
								}
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
						</Stack>
					</Stack>
					<Stack className={'stats'}>
						{isSeller && (
							<Box component={'div'}>
								<strong>{member.memberSalesCount}</strong>
								<span>{t('Sales')}</span>
							</Box>
						)}
						<Box component={'div'}>
							<strong>{member.memberFollowers}</strong>
							<span>{t('Followers')}</span>
						</Box>
						<Box component={'div'}>
							<strong>{member.memberFollowings}</strong>
							<span>{t('Followings')}</span>
						</Box>
						<Box component={'div'}>
							<strong>{member.memberLikes}</strong>
							<span>{t('Likes')}</span>
						</Box>
						<Box component={'div'}>
							<strong>{member.memberViews}</strong>
							<span>{t('Views')}</span>
						</Box>
					</Stack>
				</Stack>

				<Stack className={'member-tabs'}>
					{tabs.map((tab) => (
						<Typography
							key={tab.key}
							className={category === tab.key ? 'active' : ''}
							onClick={() => changeCategoryHandler(tab.key)}
						>
							{t(tab.label)}
							{tab.count !== undefined && <span>{tab.count}</span>}
						</Typography>
					))}
				</Stack>

				<Stack className={'member-content'}>
					{category === 'lots' && <MemberLots memberId={member._id} />}
					{category === 'reviews' && <MemberReviews memberId={member._id} />}
					{category === 'articles' && <MemberArticles />}
					{category === 'followers' && (
						<MemberFollowers
							subscribeHandler={subscribeHandler}
							unsubscribeHandler={unsubscribeHandler}
							likeMemberHandler={likeMemberHandler}
							redirectToMemberPageHandler={redirectToMemberPageHandler}
						/>
					)}
					{category === 'followings' && (
						<MemberFollowings
							subscribeHandler={subscribeHandler}
							unsubscribeHandler={unsubscribeHandler}
							likeMemberHandler={likeMemberHandler}
							redirectToMemberPageHandler={redirectToMemberPageHandler}
						/>
					)}
				</Stack>
			</Stack>
		</div>
	);
};

export default withLayoutFull(MemberPage);

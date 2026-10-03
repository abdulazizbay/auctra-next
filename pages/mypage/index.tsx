import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Stack, Typography } from '@mui/material';
import { useMutation, useReactiveVar } from '@apollo/client';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import MyMenu from '../../libs/components/mypage/MyMenu';
import MyLots from '../../libs/components/mypage/MyLots';
import AddNewLot from '../../libs/components/mypage/AddNewLot';
import MyWatchlist from '../../libs/components/mypage/MyWatchlist';
import MyBids from '../../libs/components/mypage/MyBids';
import RecentlyVisited from '../../libs/components/mypage/RecentlyVisited';
import MyOrders from '../../libs/components/mypage/MyOrders';
import MyProfile from '../../libs/components/mypage/MyProfile';
import WriteArticle from '../../libs/components/mypage/WriteArticle';
import MemberArticles from '../../libs/components/member/MemberArticles';
import MemberFollowers from '../../libs/components/member/MemberFollowers';
import MemberFollowings from '../../libs/components/member/MemberFollowings';
import { userVar } from '../../apollo/store';
import { getJwtToken, requestUserInfo } from '../../libs/auth';
import { MemberType } from '../../libs/enums/member.enum';
import { Message } from '../../libs/enums/common.enum';
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

const sellerCategories = ['addLot', 'myLots', 'mySales'];

const MyPage: NextPage = () => {
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const { t } = useTranslation('common');
	const isSeller = user.memberType === MemberType.SELLER;
	const category: any =
		router.query?.category ?? (isSeller ? 'myLots' : 'watchlist');

	/** APOLLO REQUESTS **/
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

	/** LIFECYCLES **/
	useEffect(() => {
		if (!getJwtToken()) router.push('/').then();
	}, [user]);

	useEffect(() => {
		if (getJwtToken() && user._id) requestUserInfo().then();
	}, []);

	/** HANDLERS **/
	const subscribeHandler = async (id: string, refetch: any, query: any) => {
		try {
			if (!id) throw new Error(Message.SOMETHING_WENT_WRONG);
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await subscribe({ variables: { input: id } });
			await sweetTopSmallSuccessAlert('Subscribed!', 800);
			await refetch({ input: query });
			await requestUserInfo();
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const unsubscribeHandler = async (id: string, refetch: any, query: any) => {
		try {
			if (!id) throw new Error(Message.SOMETHING_WENT_WRONG);
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await unsubscribe({ variables: { input: id } });
			await sweetTopSmallSuccessAlert('Unsubscribed!', 800);
			await refetch({ input: query });
			await requestUserInfo();
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
			else
				await router.push({
					pathname: '/member',
					query: { memberId, category: 'articles' },
				});
		} catch (error) {
			await sweetErrorHandling(error);
		}
	};

	if (!user._id) return null;

	return (
		<div id="my-page">
			<div className="container">
				<Stack className={'my-page'}>
					<Stack className={'left-config'}>
						<MyMenu />
					</Stack>
					<Stack className="main-config">
						{sellerCategories.includes(category) && !isSeller && (
							<Stack className={'no-data'}>
								<Typography>
									{t('Only approved sellers can manage lots')}
								</Typography>
							</Stack>
						)}
						{category === 'addLot' && isSeller && <AddNewLot />}
						{category === 'myLots' && isSeller && <MyLots />}
						{category === 'mySales' && isSeller && <MyOrders sales />}
						{category === 'myOrders' && <MyOrders />}
						{category === 'myProfile' && <MyProfile />}
						{category === 'myBids' && <MyBids />}
						{category === 'watchlist' && <MyWatchlist />}
						{category === 'recentlyVisited' && <RecentlyVisited />}
						{category === 'writeArticle' && <WriteArticle />}
						{category === 'myArticles' && <MemberArticles />}
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
		</div>
	);
};

export default withLayoutBasic(MyPage);

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useQuery, useReactiveVar } from '@apollo/client';
import { Pagination, Stack, Typography } from '@mui/material';
import MemberFollowCard from './MemberFollowCard';
import { userVar } from '../../../apollo/store';
import { Follower } from '../../types/follow/follow';
import { FollowInquiry } from '../../types/follow/follow.input';
import { T } from '../../types/common';
import { GET_MEMBER_FOLLOWERS } from '../../../apollo/user/query';

interface MemberFollowersProps {
	initialInput: FollowInquiry;
	subscribeHandler: any;
	unsubscribeHandler: any;
	likeMemberHandler: any;
	redirectToMemberPageHandler: any;
}

const MemberFollowers = (props: MemberFollowersProps) => {
	const {
		initialInput,
		subscribeHandler,
		unsubscribeHandler,
		likeMemberHandler,
		redirectToMemberPageHandler,
	} = props;
	const router = useRouter();
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);
	const [followInquiry, setFollowInquiry] =
		useState<FollowInquiry>(initialInput);
	const [memberFollowers, setMemberFollowers] = useState<Follower[]>([]);
	const [total, setTotal] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const {
		loading: getMemberFollowersLoading,
		data: getMemberFollowersData,
		error: getMemberFollowersError,
		refetch: getMemberFollowersRefetch,
	} = useQuery(GET_MEMBER_FOLLOWERS, {
		fetchPolicy: 'network-only',
		variables: { input: followInquiry },
		skip: !followInquiry?.search?.followingId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setMemberFollowers(data?.getMemberFollowers?.list);
			setTotal(data?.getMemberFollowers?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		const followingId = (router.query.memberId as string) ?? user?._id;
		if (followingId)
			setFollowInquiry({ ...followInquiry, page: 1, search: { followingId } });
	}, [router, user?._id]);

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setFollowInquiry({ ...followInquiry, page: value });
	};

	return (
		<div id="member-follows-page">
			<Stack className="main-title-box">
				<Typography className="main-title">
					{t('Followers')}
					<span className={'count'}>{total}</span>
				</Typography>
			</Stack>
			<Stack className={'follow-list'}>
				{memberFollowers?.length === 0 ? (
					<div className={'no-data'}>{t('No followers yet')}</div>
				) : (
					memberFollowers.map((follower: Follower) => (
						<MemberFollowCard
							key={follower._id}
							member={follower.followerData}
							meLiked={follower.meLiked}
							meFollowed={follower.meFollowed}
							likeHandler={(id: string) =>
								likeMemberHandler(id, getMemberFollowersRefetch, followInquiry)
							}
							subscribeHandler={(id: string) =>
								subscribeHandler(id, getMemberFollowersRefetch, followInquiry)
							}
							unsubscribeHandler={(id: string) =>
								unsubscribeHandler(id, getMemberFollowersRefetch, followInquiry)
							}
							redirectToMemberPageHandler={redirectToMemberPageHandler}
						/>
					))
				)}
			</Stack>
			{total > followInquiry.limit && (
				<Stack className={'pagination-box'}>
					<Pagination
						page={followInquiry.page}
						count={Math.ceil(total / followInquiry.limit)}
						onChange={paginationHandler}
						shape="circular"
						color="primary"
					/>
				</Stack>
			)}
		</div>
	);
};

MemberFollowers.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		search: {
			followingId: '',
		},
	},
};

export default MemberFollowers;

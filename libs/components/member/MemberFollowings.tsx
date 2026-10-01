import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useQuery, useReactiveVar } from '@apollo/client';
import { Pagination, Stack, Typography } from '@mui/material';
import MemberFollowCard from './MemberFollowCard';
import { userVar } from '../../../apollo/store';
import { Following } from '../../types/follow/follow';
import { FollowInquiry } from '../../types/follow/follow.input';
import { T } from '../../types/common';
import { GET_MEMBER_FOLLOWINGS } from '../../../apollo/user/query';

interface MemberFollowingsProps {
	initialInput: FollowInquiry;
	subscribeHandler: any;
	unsubscribeHandler: any;
	likeMemberHandler: any;
	redirectToMemberPageHandler: any;
}

const MemberFollowings = (props: MemberFollowingsProps) => {
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
	const [memberFollowings, setMemberFollowings] = useState<Following[]>([]);
	const [total, setTotal] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const {
		loading: getMemberFollowingsLoading,
		data: getMemberFollowingsData,
		error: getMemberFollowingsError,
		refetch: getMemberFollowingsRefetch,
	} = useQuery(GET_MEMBER_FOLLOWINGS, {
		fetchPolicy: 'network-only',
		variables: { input: followInquiry },
		skip: !followInquiry?.search?.followerId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setMemberFollowings(data?.getMemberFollowings?.list);
			setTotal(data?.getMemberFollowings?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		const followerId = (router.query.memberId as string) ?? user?._id;
		if (followerId)
			setFollowInquiry({ ...followInquiry, page: 1, search: { followerId } });
	}, [router, user?._id]);

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setFollowInquiry({ ...followInquiry, page: value });
	};

	return (
		<div id="member-follows-page">
			<Stack className="main-title-box">
				<Typography className="main-title">
					{t('Followings')}
					<span className={'count'}>{total}</span>
				</Typography>
			</Stack>
			<Stack className={'follow-list'}>
				{memberFollowings?.length === 0 ? (
					<div className={'no-data'}>{t('No followings yet')}</div>
				) : (
					memberFollowings.map((following: Following) => (
						<MemberFollowCard
							key={following._id}
							member={following.followingData}
							meLiked={following.meLiked}
							meFollowed={following.meFollowed}
							likeHandler={(id: string) =>
								likeMemberHandler(id, getMemberFollowingsRefetch, followInquiry)
							}
							subscribeHandler={(id: string) =>
								subscribeHandler(id, getMemberFollowingsRefetch, followInquiry)
							}
							unsubscribeHandler={(id: string) =>
								unsubscribeHandler(
									id,
									getMemberFollowingsRefetch,
									followInquiry,
								)
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

MemberFollowings.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		search: {
			followerId: '',
		},
	},
};

export default MemberFollowings;

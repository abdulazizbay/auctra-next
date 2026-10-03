import React, { ChangeEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import moment from 'moment';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
	Avatar,
	Box,
	Button,
	Pagination,
	Stack,
	Typography,
} from '@mui/material';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import HowToRegRoundedIcon from '@mui/icons-material/HowToRegRounded';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import withLayoutFull from '../../libs/components/layout/LayoutFull';
import LotCard from '../../libs/components/lot/LotCard';
import ReviewCard from '../../libs/components/seller/ReviewCard';
import { userVar } from '../../apollo/store';
import { Member } from '../../libs/types/member/member';
import { Lot } from '../../libs/types/lot/lot';
import { LotsInquiry } from '../../libs/types/lot/lot.input';
import { Review } from '../../libs/types/review/review';
import { ReviewsInquiry } from '../../libs/types/review/review.input';
import { T } from '../../libs/types/common';
import { LotStatus, publicLotStatuses } from '../../libs/enums/lot.enum';
import { MemberType } from '../../libs/enums/member.enum';
import { Message } from '../../libs/enums/common.enum';
import { REACT_APP_API_URL } from '../../libs/config';
import { GET_LOTS, GET_MEMBER, GET_REVIEWS } from '../../apollo/user/query';
import {
	LIKE_TARGET_MEMBER,
	SUBSCRIBE,
	UNSUBSCRIBE,
	WATCH_TARGET_LOT,
} from '../../apollo/user/mutation';
import {
	sweetMixinErrorAlert,
	sweetTopSmallSuccessAlert,
} from '../../libs/sweetAlert';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const SellerDetail: NextPage = ({
	initialInput,
	initialReview,
	...props
}: any) => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);
	const [sellerId, setSellerId] = useState<string | null>(null);
	const [seller, setSeller] = useState<Member | null>(null);
	const [searchFilter, setSearchFilter] = useState<LotsInquiry>(initialInput);
	const [sellerLots, setSellerLots] = useState<Lot[]>([]);
	const [lotTotal, setLotTotal] = useState<number>(0);
	const [reviewInquiry, setReviewInquiry] =
		useState<ReviewsInquiry>(initialReview);
	const [sellerReviews, setSellerReviews] = useState<Review[]>([]);
	const [reviewTotal, setReviewTotal] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);
	const [watchTargetLot] = useMutation(WATCH_TARGET_LOT);

	const {
		loading: getMemberLoading,
		data: getMemberData,
		error: getMemberError,
		refetch: getMemberRefetch,
	} = useQuery(GET_MEMBER, {
		fetchPolicy: 'network-only',
		variables: { input: sellerId },
		skip: !sellerId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getMember) setSeller(data.getMember);
		},
	});

	const {
		loading: getLotsLoading,
		data: getLotsData,
		error: getLotsError,
		refetch: getLotsRefetch,
	} = useQuery(GET_LOTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		skip: !searchFilter.search.memberId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setSellerLots(data?.getLots?.list);
			setLotTotal(data?.getLots?.metaCounter[0]?.total ?? 0);
		},
	});

	const {
		loading: getReviewsLoading,
		data: getReviewsData,
		error: getReviewsError,
		refetch: getReviewsRefetch,
	} = useQuery(GET_REVIEWS, {
		fetchPolicy: 'network-only',
		variables: { input: reviewInquiry },
		skip: !reviewInquiry.search.sellerId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setSellerReviews(data?.getReviews?.list);
			setReviewTotal(data?.getReviews?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.id) {
			const id = router.query.id as string;
			setSellerId(id);
			setSearchFilter({
				...searchFilter,
				page: 1,
				search: { ...searchFilter.search, memberId: id },
			});
			setReviewInquiry({ ...reviewInquiry, page: 1, search: { sellerId: id } });
		}
	}, [router]);

	/** HANDLERS **/
	const goMemberPage = (id: string) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	const changeStatusHandler = (value: LotStatus) => {
		setSearchFilter({
			...searchFilter,
			page: 1,
			search: { ...searchFilter.search, lotStatusList: [value] },
		});
	};

	const lotPaginationHandler = (e: ChangeEvent<unknown>, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const reviewPaginationHandler = (e: ChangeEvent<unknown>, value: number) => {
		setReviewInquiry({ ...reviewInquiry, page: value });
	};

	const subscribeHandler = async (id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await subscribe({ variables: { input: id } });
			await getMemberRefetch({ input: id });
			await sweetTopSmallSuccessAlert(t('Followed'), 800);
		} catch (err: any) {
			console.log('ERROR, subscribeHandler: ', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const unsubscribeHandler = async (id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await unsubscribe({ variables: { input: id } });
			await getMemberRefetch({ input: id });
			await sweetTopSmallSuccessAlert(t('Unfollowed'), 800);
		} catch (err: any) {
			console.log('ERROR, unsubscribeHandler: ', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const likeMemberHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetMember({ variables: { input: id } });
			await getMemberRefetch({ input: id });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeMemberHandler: ', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const watchLotHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await watchTargetLot({ variables: { input: id } });
			await getLotsRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, watchLotHandler: ', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (getMemberError)
		return (
			<div id="seller-detail-page">
				<Stack className="container">
					<div className={'no-data'}>{t('Seller not found')}</div>
				</Stack>
			</div>
		);

	if (!seller) return <div id="seller-detail-page" />;

	const image = seller.memberImage;
	const sellerImage: string = !image
		? ''
		: image.startsWith('http')
		? image
		: `${REACT_APP_API_URL}/${image}`;
	const isOwner = seller._id === user?._id;
	const isTrusted = seller.memberAvgRating >= 4 && seller.memberSalesCount >= 5;
	const isFollowing = !!seller.meFollowed?.[0]?.myFollowing;
	const isLiked = !!seller.meLiked?.[0]?.myFavorite;
	const location = seller.memberLocation
		? seller.memberLocation.charAt(0) +
		  seller.memberLocation.slice(1).toLowerCase()
		: '';

	return (
		<div id="seller-detail-page">
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
						<Avatar src={sellerImage || undefined} className={'avatar'}>
							{seller.memberNick?.[0]?.toUpperCase()}
						</Avatar>
						<Stack className={'profile-info'}>
							<Typography className={'name'}>
								{seller.memberNick}
								{isTrusted && <VerifiedRoundedIcon className={'trusted'} />}
							</Typography>
							<Typography className={'rating'}>
								<StarRoundedIcon />
								{seller.memberReviewCount ? (
									<>
										<b>{seller.memberAvgRating?.toFixed(1)}</b>
										<span>
											{t('{{count}} reviews', {
												count: seller.memberReviewCount,
											})}
										</span>
									</>
								) : (
									<span>{t('No reviews yet')}</span>
								)}
							</Typography>
							{seller.memberBio && (
								<Typography className={'bio'}>{seller.memberBio}</Typography>
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
										date: moment(seller.createdAt).format('MMM YYYY'),
									})}
								</span>
							</Box>
						</Stack>
						{!isOwner && (
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
											? unsubscribeHandler(seller._id)
											: subscribeHandler(seller._id)
									}
								>
									{isFollowing ? t('Following') : t('Follow')}
								</Button>
								<Button
									className={`like-button ${isLiked ? 'liked' : ''}`}
									startIcon={
										isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />
									}
									onClick={() => likeMemberHandler(user, seller._id)}
								>
									{seller.memberLikes}
								</Button>
							</Stack>
						)}
					</Stack>
					<Stack className={'stats'}>
						<Box component={'div'}>
							<strong>{seller.memberSalesCount}</strong>
							<span>{t('Sales')}</span>
						</Box>
						<Box component={'div'}>
							<strong>{seller.memberFollowers}</strong>
							<span>{t('Followers')}</span>
						</Box>
						<Box component={'div'}>
							<strong>{seller.memberLikes}</strong>
							<span>{t('Likes')}</span>
						</Box>
						<Box component={'div'}>
							<strong>{seller.memberViews}</strong>
							<span>{t('Views')}</span>
						</Box>
					</Stack>
				</Stack>

				{seller.memberType !== MemberType.SELLER ? (
					<div className={'no-data'}>{t('This member is not a seller')}</div>
				) : (
					<>
						<Stack className={'section'}>
							<Box component={'div'} className={'section-head'}>
								<Typography className={'section-title'}>
									{t('Lots')}
									<span className={'count'}>{lotTotal}</span>
								</Typography>
								<Stack className={'tab-name-box'}>
									{publicLotStatuses.map((status: LotStatus) => (
										<Typography
											key={status}
											onClick={() => changeStatusHandler(status)}
											className={
												searchFilter.search.lotStatusList?.[0] === status
													? 'active-tab-name'
													: 'tab-name'
											}
										>
											{t(status)}
										</Typography>
									))}
								</Stack>
							</Box>
							<Stack className={'lot-list'}>
								{sellerLots?.length === 0 ? (
									<div className={'no-data'}>{t('No lots found')}</div>
								) : (
									sellerLots.map((lot: Lot) => (
										<LotCard
											lot={lot}
											key={lot?._id}
											watchLotHandler={watchLotHandler}
										/>
									))
								)}
							</Stack>
							{lotTotal > searchFilter.limit && (
								<Stack className={'pagination-box'}>
									<Pagination
										page={searchFilter.page}
										count={Math.ceil(lotTotal / searchFilter.limit)}
										onChange={lotPaginationHandler}
										shape="circular"
										color="primary"
									/>
								</Stack>
							)}
						</Stack>

						<Stack className={'section'}>
							<Box component={'div'} className={'section-head'}>
								<Typography className={'section-title'}>
									{t('Reviews')}
									<span className={'count'}>{reviewTotal}</span>
								</Typography>
							</Box>
							<Stack className={'review-list'}>
								{sellerReviews?.length === 0 ? (
									<div className={'no-data'}>{t('No reviews yet')}</div>
								) : (
									sellerReviews.map((review: Review) => (
										<ReviewCard
											review={review}
											key={review?._id}
											goMemberPage={goMemberPage}
										/>
									))
								)}
							</Stack>
							{reviewTotal > reviewInquiry.limit && (
								<Stack className={'pagination-box'}>
									<Pagination
										page={reviewInquiry.page}
										count={Math.ceil(reviewTotal / reviewInquiry.limit)}
										onChange={reviewPaginationHandler}
										shape="circular"
										color="primary"
									/>
								</Stack>
							)}
						</Stack>
					</>
				)}
			</Stack>
		</div>
	);
};

SellerDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			lotStatusList: [LotStatus.OPEN],
		},
	},
	initialReview: {
		page: 1,
		limit: 5,
		search: {
			sellerId: '',
		},
	},
};

export default withLayoutFull(SellerDetail);

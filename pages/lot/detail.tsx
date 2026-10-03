import React, { ChangeEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import moment from 'moment';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
	Avatar,
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Pagination as MuiPagination,
	Stack,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import WatchOutlinedIcon from '@mui/icons-material/WatchOutlined';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import withLayoutFull from '../../libs/components/layout/LayoutFull';
import LotCard from '../../libs/components/lot/LotCard';
import LotComment from '../../libs/components/lot/LotComment';
import { socketVar, userVar } from '../../apollo/store';
import { joinRoom } from '../../libs/socket';
import { Lot } from '../../libs/types/lot/lot';
import { Bid } from '../../libs/types/bid/bid';
import { BidsInquiry } from '../../libs/types/bid/bid.input';
import { Comment } from '../../libs/types/comment/comment';
import {
	CommentInput,
	CommentsInquiry,
} from '../../libs/types/comment/comment.input';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { LotStatus } from '../../libs/enums/lot.enum';
import { Direction, Message } from '../../libs/enums/common.enum';
import { T } from '../../libs/types/common';
import { REACT_APP_API_URL } from '../../libs/config';
import { formatterStr } from '../../libs/utils';
import {
	GET_BIDS,
	GET_COMMENTS,
	GET_LOT,
	GET_LOTS,
} from '../../apollo/user/query';
import {
	CREATE_COMMENT,
	PLACE_BID,
	WATCH_TARGET_LOT,
} from '../../apollo/user/mutation';
import { REMOVE_COMMENT_BY_ADMIN } from '../../apollo/admin/mutation';
import { MemberType } from '../../libs/enums/member.enum';
import {
	sweetConfirmAlert,
	sweetErrorHandling,
	sweetMixinErrorAlert,
	sweetTopSmallSuccessAlert,
} from '../../libs/sweetAlert';

SwiperCore.use([Autoplay, Navigation, Pagination]);

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const LotDetail: NextPage = ({ initialComment, initialBid, ...props }: any) => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar);
	const [lotId, setLotId] = useState<string | null>(null);
	const [lot, setLot] = useState<Lot | null>(null);
	const [slideImage, setSlideImage] = useState<string>('');
	const [similarLots, setSimilarLots] = useState<Lot[]>([]);
	const [bidInquiry, setBidInquiry] = useState<BidsInquiry>(initialBid);
	const [lotBids, setLotBids] = useState<Bid[]>([]);
	const [bidTotal, setBidTotal] = useState<number>(0);
	const [bidPrice, setBidPrice] = useState<number>(0);
	const [now, setNow] = useState<number>(Date.now());
	const [wonOpen, setWonOpen] = useState<boolean>(false);
	const [commentInquiry, setCommentInquiry] =
		useState<CommentsInquiry>(initialComment);
	const [lotComments, setLotComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);
	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.LOT,
		commentText: '',
		commentRefId: '',
	});

	/** APOLLO REQUESTS **/
	const [watchTargetLot] = useMutation(WATCH_TARGET_LOT);
	const [placeBid] = useMutation(PLACE_BID);
	const [createComment] = useMutation(CREATE_COMMENT);
	const [removeCommentByAdmin] = useMutation(REMOVE_COMMENT_BY_ADMIN);

	const {
		loading: getLotLoading,
		data: getLotData,
		error: getLotError,
		refetch: getLotRefetch,
	} = useQuery(GET_LOT, {
		fetchPolicy: 'network-only',
		variables: { input: lotId },
		skip: !lotId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getLot) setLot(data.getLot);
			if (data?.getLot) setSlideImage(data.getLot?.lotImages[0]);
		},
	});

	const {
		loading: getLotsLoading,
		data: getLotsData,
		error: getLotsError,
		refetch: getLotsRefetch,
	} = useQuery(GET_LOTS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: 1,
				limit: 5,
				sort: 'createdAt',
				direction: Direction.DESC,
				search: {
					lotCategoryList: lot?.lotCategory ? [lot?.lotCategory] : [],
				},
			},
		},
		skip: !lot,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getLots?.list)
				setSimilarLots(
					data?.getLots?.list.filter((item: Lot) => item._id !== lotId),
				);
		},
	});

	const {
		loading: getBidsLoading,
		data: getBidsData,
		error: getBidsError,
		refetch: getBidsRefetch,
	} = useQuery(GET_BIDS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialBid },
		skip: !bidInquiry.search.lotId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getBids?.list) setLotBids(data?.getBids?.list);
			setBidTotal(data?.getBids?.metaCounter[0]?.total ?? 0);
		},
	});

	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialComment },
		skip: !commentInquiry.search.commentRefId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getComments?.list) setLotComments(data?.getComments?.list);
			setCommentTotal(data?.getComments?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.id) {
			setLotId(router.query.id as string);
			setBidInquiry({
				...bidInquiry,
				search: {
					lotId: router.query.id as string,
				},
			});
			setCommentInquiry({
				...commentInquiry,
				search: {
					commentRefId: router.query.id as string,
				},
			});
			setInsertCommentData({
				...insertCommentData,
				commentRefId: router.query.id as string,
			});
		}
	}, [router]);

	useEffect(() => {
		if (bidInquiry.search.lotId) {
			getBidsRefetch({ input: bidInquiry });
		}
	}, [bidInquiry]);

	useEffect(() => {
		if (commentInquiry.search.commentRefId) {
			getCommentsRefetch({ input: commentInquiry });
		}
	}, [commentInquiry]);

	useEffect(() => {
		const timer = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		if (!socket || !lotId) return;
		const leaveRoom = joinRoom(socket, `lot:${lotId}`);
		const lotHandler = (msg: MessageEvent) => {
			const data = JSON.parse(msg.data);
			if (data.lotId !== lotId) return;
			if (data.event === 'bid') {
				setLot((prev) =>
					prev
						? {
								...prev,
								lotCurrentPrice: data.bidPrice,
								lotBids: data.lotBids,
								lotHighestBidderId: data.memberId,
								lotEndsAt: data.lotEndsAt,
						  }
						: prev,
				);
				getBidsRefetch();
			}
			if (data.event === 'lotClosed') {
				setLot((prev) =>
					prev
						? {
								...prev,
								lotStatus: data.lotStatus,
								lotCurrentPrice: data.lotCurrentPrice,
								lotHighestBidderId: data.lotHighestBidderId,
						  }
						: prev,
				);
				if (
					data.lotStatus === LotStatus.SOLD &&
					data.lotHighestBidderId === userVar()._id
				)
					setWonOpen(true);
			}
		};
		socket.addEventListener('message', lotHandler);
		return () => {
			socket.removeEventListener('message', lotHandler);
			leaveRoom();
		};
	}, [socket, lotId]);

	useEffect(() => {
		if (lot) setBidPrice(minBidPrice(lot));
	}, [lot?._id, lot?.lotCurrentPrice]);

	/** HANDLERS **/
	const minBidPrice = (target: Lot) => {
		const min =
			target.lotBids === 0
				? target.lotStartPrice
				: target.lotCurrentPrice + target.lotMinIncrement;
		return target.lotCeilingPrice ? Math.min(min, target.lotCeilingPrice) : min;
	};

	const imagePath = (image: string) => {
		if (!image) return '';
		return image.startsWith('http') ? image : `${REACT_APP_API_URL}/${image}`;
	};

	const countdown = (target: Date) => {
		const diff = Math.max(new Date(target).getTime() - now, 0);
		const days = Math.floor(diff / 86400000);
		const time = moment.utc(diff).format('HH:mm:ss');
		return days > 0 ? `${days}d ${time}` : time;
	};

	const changeImageHandler = (image: string) => {
		setSlideImage(image);
	};

	const goMemberPage = (id: string) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	const watchLotHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await watchTargetLot({ variables: { input: id } });
			await getLotRefetch({ input: lotId });
			await getLotsRefetch();
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, watchLotHandler: ', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const placeBidHandler = async () => {
		try {
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			if (!lot) return;

			const confirmed = await sweetConfirmAlert(
				t('Place a bid of {{price}}?', { price: `$${formatterStr(bidPrice)}` }),
			);
			if (!confirmed) return;

			await placeBid({
				variables: { input: { lotId: lot._id, bidPrice: bidPrice } },
			});
			await sweetTopSmallSuccessAlert(t('Bid placed'), 800);
		} catch (err: any) {
			console.log('ERROR, placeBidHandler: ', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const removeCommentHandler = async (commentId: string) => {
		try {
			if (!(await sweetConfirmAlert(t('Delete this comment?')))) return;
			await removeCommentByAdmin({ variables: { input: commentId } });
			await getCommentsRefetch({ input: commentInquiry });
			await sweetTopSmallSuccessAlert(t('Comment deleted'), 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const bidPaginationChangeHandler = async (
		event: ChangeEvent<unknown>,
		value: number,
	) => {
		bidInquiry.page = value;
		setBidInquiry({ ...bidInquiry });
	};

	const commentPaginationChangeHandler = async (
		event: ChangeEvent<unknown>,
		value: number,
	) => {
		commentInquiry.page = value;
		setCommentInquiry({ ...commentInquiry });
	};

	const createCommentHandler = async () => {
		try {
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await createComment({ variables: { input: insertCommentData } });
			setInsertCommentData({ ...insertCommentData, commentText: '' });
			await getCommentsRefetch({ input: commentInquiry });
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	if (getLotLoading && !lot) {
		return (
			<Stack className={'detail-loading'}>
				<CircularProgress size={'4rem'} />
			</Stack>
		);
	}

	const isOpen =
		lot?.lotStatus === LotStatus.OPEN &&
		new Date(lot?.lotEndsAt as Date).getTime() > now;
	const isOwner = !!user?._id && user._id === lot?.memberId;
	const isHighest = !!user?._id && user._id === lot?.lotHighestBidderId;
	const seller = lot?.memberData;
	const isTrusted =
		(seller?.memberAvgRating ?? 0) >= 4 && (seller?.memberSalesCount ?? 0) >= 5;

	return (
		<div id={'lot-detail-page'}>
			<div className={'container'}>
				<Stack className={'lot-detail-config'}>
					<Stack className={'lot-info-config'}>
						<Stack className={'info'}>
							<Stack className={'left-box'}>
								<Typography className={'title-main'}>{lot?.lotName}</Typography>
								<Stack className={'top-box'}>
									<Box
										component={'div'}
										className={`status-badge ${isOpen ? 'live' : ''}`}
									>
										{t(lot?.lotStatus as string)}
									</Box>
									<Typography className={'meta'}>
										{t(lot?.lotCategory as string)} ·{' '}
										{t(lot?.lotCondition as string)}
									</Typography>
									<Stack className={'divider'}></Stack>
									<Typography className={'date'}>
										{t('Listed {{days}} days ago', {
											days: moment().diff(lot?.createdAt, 'days'),
										})}
									</Typography>
								</Stack>
							</Stack>
							<Stack className={'right-box'}>
								<Stack className="buttons">
									<Stack className="button-box">
										<RemoveRedEyeIcon fontSize="small" />
										<Typography>{lot?.lotViews}</Typography>
									</Stack>
									<Stack className="button-box">
										<Tooltip
											title={
												lot?.meWatched?.[0]?.myWatch
													? t('Remove from watchlist')
													: t('Add to watchlist')
											}
										>
											<IconButton
												size={'small'}
												onClick={() =>
													watchLotHandler(user, lot?._id as string)
												}
											>
												{lot?.meWatched && lot?.meWatched[0]?.myWatch ? (
													<BookmarkIcon className={'watched'} />
												) : (
													<BookmarkBorderIcon />
												)}
											</IconButton>
										</Tooltip>
										<Typography>{lot?.lotWatchers}</Typography>
									</Stack>
									{user?._id && (
										<Stack className="button-box">
											<Tooltip title={t('Write about this lot')}>
												<IconButton
													size={'small'}
													component={Link}
													href={{
														pathname: '/mypage',
														query: {
															category: 'writeArticle',
															lotId: lot?._id,
														},
													}}
												>
													<EditNoteOutlinedIcon />
												</IconButton>
											</Tooltip>
										</Stack>
									)}
								</Stack>
							</Stack>
						</Stack>
						<Stack className={'images'}>
							<Stack className={'main-image'}>
								{slideImage ? (
									<img src={imagePath(slideImage)} alt={'main-image'} />
								) : (
									<Stack className={'no-image'}>
										<WatchOutlinedIcon />
									</Stack>
								)}
							</Stack>
							{(lot?.lotImages?.length ?? 0) > 1 && (
								<Stack className={'sub-images'}>
									{lot?.lotImages.map((subImg: string) => {
										return (
											<Stack
												className={`sub-img-box ${
													subImg === slideImage ? 'active' : ''
												}`}
												onClick={() => changeImageHandler(subImg)}
												key={subImg}
											>
												<img src={imagePath(subImg)} alt={'sub-image'} />
											</Stack>
										);
									})}
								</Stack>
							)}
						</Stack>
					</Stack>

					<Stack className={'lot-desc-config'}>
						<Stack className={'left-config'}>
							<Stack className={'options-config'}>
								<Stack className={'option'}>
									<Typography className={'title'}>
										{t('Start price')}
									</Typography>
									<Typography className={'option-data'}>
										${formatterStr(lot?.lotStartPrice) || 0}
									</Typography>
								</Stack>
								<Stack className={'option'}>
									<Typography className={'title'}>
										{t('Min increment')}
									</Typography>
									<Typography className={'option-data'}>
										${formatterStr(lot?.lotMinIncrement) || 0}
									</Typography>
								</Stack>
								<Stack className={'option'}>
									<Typography className={'title'}>
										{t('Ceiling price')}
									</Typography>
									<Typography className={'option-data'}>
										{lot?.lotCeilingPrice
											? `$${formatterStr(lot?.lotCeilingPrice)}`
											: '—'}
									</Typography>
								</Stack>
								<Stack className={'option'}>
									<Typography className={'title'}>{t('Ends at')}</Typography>
									<Typography className={'option-data'}>
										{moment(lot?.lotEndsAt).format('YYYY.MM.DD HH:mm')}
									</Typography>
								</Stack>
							</Stack>

							<Stack className={'lot-desc'}>
								<Typography className={'title'}>{t('Description')}</Typography>
								<Typography className={'desc'}>
									{lot?.lotDesc ?? t('No description!')}
								</Typography>
								{lot?.lotShippingNote && (
									<>
										<Typography className={'title'}>{t('Shipping')}</Typography>
										<Typography className={'desc'}>
											{lot?.lotShippingNote}
										</Typography>
									</>
								)}
							</Stack>

							<Stack className={'bids-config'}>
								<Typography className={'title'}>
									{t('Bid history')} ({bidTotal})
								</Typography>
								{lotBids.length === 0 ? (
									<Typography className={'empty'}>
										{t('No bids yet')}
									</Typography>
								) : (
									<Stack className={'bid-list'}>
										{lotBids.map((bid: Bid, index: number) => {
											return (
												<Stack
													className={`bid-row ${
														bidInquiry.page === 1 && index === 0 ? 'top' : ''
													}`}
													key={bid._id}
												>
													<Avatar
														src={
															imagePath(
																bid?.memberData?.memberImage as string,
															) || undefined
														}
														className={'avatar'}
														onClick={() =>
															goMemberPage(bid?.memberData?._id as string)
														}
													>
														{bid?.memberData?.memberNick?.[0]?.toUpperCase()}
													</Avatar>
													<Typography
														className={'nick'}
														onClick={() =>
															goMemberPage(bid?.memberData?._id as string)
														}
													>
														{bid?.memberData?.memberNick}
													</Typography>
													<Typography className={'time'}>
														{moment(bid.createdAt).fromNow()}
													</Typography>
													<Typography className={'price'}>
														${formatterStr(bid.bidPrice)}
													</Typography>
												</Stack>
											);
										})}
									</Stack>
								)}
								{bidTotal > bidInquiry.limit && (
									<Box component={'div'} className={'pagination-box'}>
										<MuiPagination
											page={bidInquiry.page}
											count={Math.ceil(bidTotal / bidInquiry.limit)}
											onChange={bidPaginationChangeHandler}
											shape="circular"
											color="primary"
										/>
									</Box>
								)}
							</Stack>

							{commentTotal !== 0 && (
								<Stack className={'reviews-config'}>
									<Typography className={'title'}>
										{t('Comments')} ({commentTotal})
									</Typography>
									<Stack className={'review-list'}>
										{lotComments?.map((comment: Comment) => {
											return (
												<LotComment
													comment={comment}
													key={comment?._id}
													removeHandler={
														user?.memberType === MemberType.ADMIN
															? removeCommentHandler
															: undefined
													}
												/>
											);
										})}
										<Box component={'div'} className={'pagination-box'}>
											<MuiPagination
												page={commentInquiry.page}
												count={Math.ceil(commentTotal / commentInquiry.limit)}
												onChange={commentPaginationChangeHandler}
												shape="circular"
												color="primary"
											/>
										</Box>
									</Stack>
								</Stack>
							)}

							<Stack className={'leave-review-config'}>
								<Typography className={'title'}>
									{t('Leave a comment')}
								</Typography>
								<TextField
									multiline
									minRows={4}
									placeholder={t('Ask the seller or share your thoughts')}
									onChange={({ target: { value } }: any) => {
										setInsertCommentData({
											...insertCommentData,
											commentText: value,
										});
									}}
									value={insertCommentData.commentText}
								/>
								<Box className={'submit-btn'} component={'div'}>
									<Button
										variant={'contained'}
										disabled={
											insertCommentData.commentText === '' || user?._id === ''
										}
										onClick={createCommentHandler}
									>
										{t('Submit')}
									</Button>
								</Box>
							</Stack>
						</Stack>

						<Stack className={'right-config'}>
							<Stack className={'bid-box'}>
								<Stack className={'time-box'}>
									<Typography className={'label'}>
										{lot?.lotStatus === LotStatus.SCHEDULED
											? t('Starts in')
											: isOpen
											? t('Ends in')
											: t('Auction ended')}
									</Typography>
									{lot?.lotStatus === LotStatus.SCHEDULED && (
										<Typography className={'countdown'}>
											{countdown(lot?.lotStartsAt as Date)}
										</Typography>
									)}
									{isOpen && (
										<Typography className={'countdown'}>
											{countdown(lot?.lotEndsAt as Date)}
										</Typography>
									)}
								</Stack>

								<Stack className={'price-box'}>
									<Typography className={'label'}>
										{lot?.lotStatus === LotStatus.SOLD
											? t('Sold for')
											: t('Current price')}
									</Typography>
									<Typography className={'price'}>
										${formatterStr(lot?.lotCurrentPrice) || 0}
									</Typography>
									<Typography className={'bids'}>
										{lot?.lotBids} {t('bids')}
									</Typography>
								</Stack>

								{isOpen && isOwner && (
									<Typography className={'notice'}>
										{t('This is your lot')}
									</Typography>
								)}
								{isOpen && isHighest && (
									<Typography className={'notice highest'}>
										{t('You are the highest bidder')}
									</Typography>
								)}
								{isOpen && !isOwner && !isHighest && (
									<Stack className={'bid-form'}>
										<Typography className={'label'}>
											{t('Minimum bid')}: $
											{formatterStr(lot ? minBidPrice(lot) : 0)}
										</Typography>
										<TextField
											type={'number'}
											value={bidPrice || ''}
											onChange={(e: any) => setBidPrice(Number(e.target.value))}
											InputProps={{
												startAdornment: <span className={'currency'}>$</span>,
											}}
										/>
										<Button
											variant={'contained'}
											size={'large'}
											disabled={!lot || bidPrice < minBidPrice(lot)}
											onClick={placeBidHandler}
										>
											{t('Place bid')}
										</Button>
										{lot?.lotCeilingPrice && (
											<Typography className={'ceiling-note'}>
												{t('A bid of {{price}} wins the lot instantly', {
													price: `$${formatterStr(lot?.lotCeilingPrice)}`,
												})}
											</Typography>
										)}
									</Stack>
								)}
							</Stack>

							{seller && (
								<Stack className={'seller-box'}>
									<Typography className={'label'}>{t('Seller')}</Typography>
									<Link
										href={{
											pathname: '/seller/detail',
											query: { id: seller._id },
										}}
									>
										<Stack className={'seller-info'}>
											<Avatar
												src={imagePath(seller.memberImage) || undefined}
												className={'avatar'}
											>
												{seller.memberNick?.[0]?.toUpperCase()}
											</Avatar>
											<Stack>
												<Typography className={'name'}>
													{seller.memberNick}
													{isTrusted && (
														<VerifiedRoundedIcon className={'trusted'} />
													)}
												</Typography>
												<Typography className={'rating'}>
													<StarRoundedIcon />
													{seller.memberAvgRating?.toFixed(1)} (
													{seller.memberReviewCount}) ·{' '}
													{t('{{count}} sales', {
														count: seller.memberSalesCount,
													})}
												</Typography>
											</Stack>
										</Stack>
									</Link>
								</Stack>
							)}
						</Stack>
					</Stack>

					{similarLots.length !== 0 && (
						<Stack className={'similar-lots-config'}>
							<Stack className={'title-pagination-box'}>
								<Typography className={'main-title'}>
									{t('Similar lots')}
								</Typography>
								<Stack className={'pagination-box'}>
									<WestIcon className={'swiper-similar-prev'} />
									<div className={'swiper-similar-pagination'}></div>
									<EastIcon className={'swiper-similar-next'} />
								</Stack>
							</Stack>
							<Stack className={'cards-box'}>
								<Swiper
									className={'similar-lots-swiper'}
									slidesPerView={'auto'}
									spaceBetween={24}
									modules={[Autoplay, Navigation, Pagination]}
									navigation={{
										nextEl: '.swiper-similar-next',
										prevEl: '.swiper-similar-prev',
									}}
									pagination={{
										el: '.swiper-similar-pagination',
									}}
								>
									{similarLots.map((similar: Lot) => {
										return (
											<SwiperSlide
												className={'similar-lots-slide'}
												key={similar._id}
											>
												<LotCard
													lot={similar}
													watchLotHandler={watchLotHandler}
												/>
											</SwiperSlide>
										);
									})}
								</Swiper>
							</Stack>
						</Stack>
					)}
				</Stack>
			</div>

			<Dialog
				open={wonOpen}
				onClose={() => setWonOpen(false)}
				className={'won-dialog'}
			>
				<DialogTitle>{t('Congratulations, you won!')}</DialogTitle>
				<DialogContent>
					<Typography className={'lot-name'}>{lot?.lotName}</Typography>
					<Typography className={'price'}>
						${formatterStr(lot?.lotCurrentPrice)}
					</Typography>
					<Typography className={'note'}>
						{t('Please complete payment within 48 hours.')}
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setWonOpen(false)}>{t('Close')}</Button>
					<Button
						variant={'contained'}
						onClick={() => router.push('/mypage?category=myOrders')}
					>
						{t('Pay now')}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

LotDetail.defaultProps = {
	initialComment: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			commentRefId: '',
		},
	},
	initialBid: {
		page: 1,
		limit: 10,
		search: {
			lotId: '',
		},
	},
};

export default withLayoutFull(LotDetail);

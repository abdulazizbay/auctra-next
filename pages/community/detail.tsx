import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import moment from 'moment';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
	Avatar,
	Backdrop,
	Box,
	Button,
	IconButton,
	Pagination,
	Stack,
	Tab,
	TextField,
	Typography,
} from '@mui/material';
import { TabContext, TabList } from '@mui/lab';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import WatchOutlinedIcon from '@mui/icons-material/WatchOutlined';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { userVar } from '../../apollo/store';
import { Article } from '../../libs/types/article/article';
import { Comment } from '../../libs/types/comment/comment';
import { CommentsInquiry } from '../../libs/types/comment/comment.input';
import { CommentUpdate } from '../../libs/types/comment/comment.update';
import { T } from '../../libs/types/common';
import { ArticleCategory, ArticleStatus } from '../../libs/enums/article.enum';
import { CommentGroup, CommentStatus } from '../../libs/enums/comment.enum';
import { Message } from '../../libs/enums/common.enum';
import { REACT_APP_API_URL } from '../../libs/config';
import { GET_ARTICLE, GET_COMMENTS } from '../../apollo/user/query';
import {
	CREATE_COMMENT,
	LIKE_TARGET_ARTICLE,
	UPDATE_ARTICLE,
	UPDATE_COMMENT,
} from '../../apollo/user/mutation';
import { REMOVE_COMMENT_BY_ADMIN } from '../../apollo/admin/mutation';
import { MemberType } from '../../libs/enums/member.enum';
import {
	sweetConfirmAlert,
	sweetMixinErrorAlert,
	sweetMixinSuccessAlert,
	sweetTopSmallSuccessAlert,
} from '../../libs/sweetAlert';

const ToastViewerComponent = dynamic(
	() => import('../../libs/components/community/TViewer'),
	{ ssr: false },
);

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const imageUrl = (image?: string) =>
	!image
		? ''
		: image.startsWith('http')
		? image
		: `${REACT_APP_API_URL}/${image}`;

const CommunityDetail: NextPage = ({ initialInput, ...props }: T) => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);
	const [articleId, setArticleId] = useState<string | null>(null);
	const [article, setArticle] = useState<Article>();
	const [comment, setComment] = useState<string>('');
	const [comments, setComments] = useState<Comment[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchFilter, setSearchFilter] =
		useState<CommentsInquiry>(initialInput);
	const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
	const [updatedComment, setUpdatedComment] = useState<string>('');
	const [updatedCommentId, setUpdatedCommentId] = useState<string>('');
	const [likeLoading, setLikeLoading] = useState<boolean>(false);
	const articleCategory = (router.query.articleCategory ??
		article?.articleCategory) as ArticleCategory;

	/** APOLLO REQUESTS **/
	const [likeTargetArticle] = useMutation(LIKE_TARGET_ARTICLE);
	const [updateArticle] = useMutation(UPDATE_ARTICLE);
	const [createComment] = useMutation(CREATE_COMMENT);
	const [updateComment] = useMutation(UPDATE_COMMENT);
	const [removeCommentByAdmin] = useMutation(REMOVE_COMMENT_BY_ADMIN);

	const {
		loading: getArticleLoading,
		data: getArticleData,
		error: getArticleError,
		refetch: getArticleRefetch,
	} = useQuery(GET_ARTICLE, {
		fetchPolicy: 'network-only',
		variables: { input: articleId },
		skip: !articleId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			if (data?.getArticle) setArticle(data.getArticle);
		},
	});

	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		skip: !searchFilter.search.commentRefId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setComments(data?.getComments?.list);
			setTotal(data?.getComments?.metaCounter?.[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.id) {
			const id = router.query.id as string;
			setArticleId(id);
			setSearchFilter({
				...searchFilter,
				page: 1,
				search: { commentRefId: id },
			});
		}
	}, [router]);

	/** HANDLERS **/
	const tabChangeHandler = async (e: T, value: string) => {
		await router.push({
			pathname: '/community',
			query: { articleCategory: value },
		});
	};

	const goMemberPage = (id?: string) => {
		if (!id) return;
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	const writeHandler = async () => {
		await router.push({
			pathname: '/mypage',
			query: { category: 'writeArticle' },
		});
	};

	const editArticleHandler = async () => {
		await router.push({
			pathname: '/mypage',
			query: { category: 'writeArticle', articleId: article?._id },
		});
	};

	const deleteArticleHandler = async () => {
		try {
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);
			if (!(await sweetConfirmAlert(t('Delete this article?')))) return;

			await updateArticle({
				variables: {
					input: { _id: article?._id, articleStatus: ArticleStatus.DELETED },
				},
			});
			await sweetMixinSuccessAlert(t('Article deleted'));
			await router.push({
				pathname: '/community',
				query: { articleCategory: article?.articleCategory },
			});
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const likeArticleHandler = async (user: T, id?: string) => {
		try {
			if (likeLoading) return;
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			setLikeLoading(true);
			await likeTargetArticle({ variables: { input: id } });
			await getArticleRefetch({ input: articleId });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likeArticleHandler: ', err.message);
			sweetMixinErrorAlert(err.message).then();
		} finally {
			setLikeLoading(false);
		}
	};

	const createCommentHandler = async () => {
		if (!comment.trim()) return;
		try {
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);

			await createComment({
				variables: {
					input: {
						commentGroup: CommentGroup.ARTICLE,
						commentRefId: articleId,
						commentText: comment,
					},
				},
			});
			await getCommentsRefetch({ input: searchFilter });
			await getArticleRefetch({ input: articleId });
			setComment('');
			await sweetTopSmallSuccessAlert(t('Comment added'), 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const updateButtonHandler = async (
		commentId: string,
		commentStatus?: CommentStatus.DELETED,
	) => {
		try {
			if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);
			if (!commentId) return;
			if (
				!commentStatus &&
				updatedComment ===
					comments?.find((item) => item?._id === commentId)?.commentText
			)
				return;

			const updateData: CommentUpdate = {
				_id: commentId,
				...(commentStatus && { commentStatus: commentStatus }),
				...(!commentStatus && { commentText: updatedComment }),
			};

			if (commentStatus) {
				if (!(await sweetConfirmAlert(t('Delete this comment?')))) return;
				await updateComment({ variables: { input: updateData } });
				await getArticleRefetch({ input: articleId });
				await sweetTopSmallSuccessAlert(t('Comment deleted'), 800);
			} else {
				await updateComment({ variables: { input: updateData } });
				await sweetTopSmallSuccessAlert(t('Comment updated'), 800);
			}
			await getCommentsRefetch({ input: searchFilter });
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		} finally {
			cancelButtonHandler();
		}
	};

	const cancelButtonHandler = () => {
		setOpenBackdrop(false);
		setUpdatedComment('');
		setUpdatedCommentId('');
	};

	const removeCommentHandler = async (commentId: string) => {
		try {
			if (!(await sweetConfirmAlert(t('Delete this comment?')))) return;
			await removeCommentByAdmin({ variables: { input: commentId } });
			await getArticleRefetch({ input: articleId });
			await getCommentsRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert(t('Comment deleted'), 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	if (getArticleError)
		return (
			<div id="community-detail-page">
				<Stack className="container">
					<div className={'no-data'}>{t('Article not found')}</div>
				</Stack>
			</div>
		);

	const isAuthor = !!user?._id && article?.memberId === user?._id;
	const isAdmin = user?.memberType === MemberType.ADMIN;
	const isLiked = !!article?.meLiked?.[0]?.myFavorite;
	const authorImage = imageUrl(article?.memberData?.memberImage);

	return (
		<div id="community-detail-page">
			<Stack className="container">
				<TabContext value={articleCategory ?? ArticleCategory.MARKET_TALK}>
					<TabList
						className={'category-tabs'}
						onChange={tabChangeHandler}
						variant={'scrollable'}
						scrollButtons={false}
					>
						{Object.values(ArticleCategory).map((category) => (
							<Tab
								key={category}
								value={category}
								label={t(category)}
								disableRipple
							/>
						))}
					</TabList>
				</TabContext>

				{article && (
					<Stack className={'article-box'}>
						<Box component={'div'} className={'article-head'}>
							<Box component={'div'} className={'head-top'}>
								<span className={'category-chip'}>
									{t(article.articleCategory)}
								</span>
								<Box component={'div'} className={'head-actions'}>
									{isAuthor && (
										<>
											<Button
												className={'ghost-button'}
												startIcon={<EditRoundedIcon />}
												onClick={editArticleHandler}
											>
												{t('Edit')}
											</Button>
											<Button
												className={'ghost-button danger'}
												startIcon={<DeleteOutlineRoundedIcon />}
												onClick={deleteArticleHandler}
											>
												{t('Delete')}
											</Button>
										</>
									)}
									{user?._id && (
										<Button
											className={'write-button'}
											startIcon={<EditRoundedIcon />}
											onClick={writeHandler}
										>
											{t('Write')}
										</Button>
									)}
								</Box>
							</Box>
							<Typography className={'title'}>
								{article.articleTitle}
							</Typography>
							<Box component={'div'} className={'head-bottom'}>
								<Box
									component={'div'}
									className={'author'}
									onClick={() => goMemberPage(article.memberData?._id)}
								>
									<Avatar src={authorImage || undefined} className={'avatar'}>
										{article.memberData?.memberNick?.[0]?.toUpperCase()}
									</Avatar>
									<Stack>
										<strong>{article.memberData?.memberNick}</strong>
										<span>
											{moment(article.createdAt).format('YYYY.MM.DD HH:mm')}
										</span>
									</Stack>
								</Box>
								<Box component={'div'} className={'counts'}>
									<span>
										<RemoveRedEyeOutlinedIcon />
										{article.articleViews}
									</span>
									<span>
										<ChatBubbleOutlineRoundedIcon />
										{article.articleComments}
									</span>
									<Button
										className={`like-button ${isLiked ? 'liked' : ''}`}
										startIcon={
											isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />
										}
										onClick={() => likeArticleHandler(user, article._id)}
									>
										{article.articleLikes}
									</Button>
								</Box>
							</Box>
						</Box>

						<ToastViewerComponent markdown={article.articleContent} />

						{article.lotId && (
							<Link
								href={{ pathname: '/lot/detail', query: { id: article.lotId } }}
								className={'related-lot'}
							>
								<WatchOutlinedIcon />
								{t('View related lot')}
							</Link>
						)}
					</Stack>
				)}

				{article && (
					<Stack className={'comment-box'}>
						<Typography className={'comment-title'}>
							{t('Comments')}
							<span className={'count'}>{total}</span>
						</Typography>
						<Stack className={'leave-comment'}>
							<TextField
								multiline
								minRows={2}
								placeholder={
									user?._id ? t('Leave a comment') : t('Login to comment')
								}
								disabled={!user?._id}
								value={comment}
								onChange={(e) => {
									if (e.target.value.length > 500) return;
									setComment(e.target.value);
								}}
							/>
							<Box component={'div'} className={'button-box'}>
								<span>{comment.length}/500</span>
								<Button
									className={'comment-button'}
									disabled={!comment.trim()}
									onClick={createCommentHandler}
								>
									{t('Comment')}
								</Button>
							</Box>
						</Stack>

						{comments?.map((commentData: Comment) => (
							<Stack className={'comment-card'} key={commentData?._id}>
								<Box component={'div'} className={'comment-head'}>
									<Box
										component={'div'}
										className={'author'}
										onClick={() => goMemberPage(commentData?.memberData?._id)}
									>
										<Avatar
											src={
												imageUrl(commentData?.memberData?.memberImage) ||
												undefined
											}
											className={'avatar'}
										>
											{commentData?.memberData?.memberNick?.[0]?.toUpperCase()}
										</Avatar>
										<Stack>
											<strong>{commentData?.memberData?.memberNick}</strong>
											<span>
												{moment(commentData?.createdAt).format(
													'YYYY.MM.DD HH:mm',
												)}
											</span>
										</Stack>
									</Box>
									{commentData?.memberId === user?._id && (
										<Box component={'div'} className={'buttons'}>
											<IconButton
												size={'small'}
												onClick={() => {
													setUpdatedComment(commentData?.commentText);
													setUpdatedCommentId(commentData?._id);
													setOpenBackdrop(true);
												}}
											>
												<EditRoundedIcon />
											</IconButton>
											<IconButton
												size={'small'}
												onClick={() =>
													updateButtonHandler(
														commentData?._id,
														CommentStatus.DELETED,
													)
												}
											>
												<DeleteOutlineRoundedIcon />
											</IconButton>
										</Box>
									)}
									{isAdmin && commentData?.memberId !== user?._id && (
										<Box component={'div'} className={'buttons'}>
											<IconButton
												size={'small'}
												onClick={() => removeCommentHandler(commentData?._id)}
											>
												<DeleteOutlineRoundedIcon />
											</IconButton>
										</Box>
									)}
								</Box>
								<Typography className={'comment-text'}>
									{commentData?.commentText}
								</Typography>
							</Stack>
						))}

						{total > searchFilter.limit && (
							<Stack className={'pagination-box'}>
								<Pagination
									count={Math.ceil(total / searchFilter.limit)}
									page={searchFilter.page}
									shape="circular"
									color="primary"
									onChange={paginationHandler}
								/>
							</Stack>
						)}
					</Stack>
				)}
			</Stack>

			<Backdrop className={'comment-backdrop'} open={openBackdrop}>
				<Stack className={'update-box'}>
					<Typography className={'update-title'}>
						{t('Update comment')}
					</Typography>
					<TextField
						autoFocus
						multiline
						minRows={3}
						value={updatedComment}
						onChange={(e) => {
							if (e.target.value.length > 500) return;
							setUpdatedComment(e.target.value);
						}}
					/>
					<Box component={'div'} className={'update-footer'}>
						<span>{updatedComment.length}/500</span>
						<Box component={'div'} className={'update-buttons'}>
							<Button className={'ghost-button'} onClick={cancelButtonHandler}>
								{t('Cancel')}
							</Button>
							<Button
								className={'comment-button'}
								disabled={!updatedComment.trim()}
								onClick={() => updateButtonHandler(updatedCommentId)}
							>
								{t('Update')}
							</Button>
						</Box>
					</Box>
				</Stack>
			</Backdrop>
		</div>
	);
};

CommunityDetail.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: { commentRefId: '' },
	},
};

export default withLayoutBasic(CommunityDetail);

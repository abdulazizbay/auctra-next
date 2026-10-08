import React, { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useQuery, useReactiveVar } from '@apollo/client';
import { Pagination, Stack, Typography } from '@mui/material';
import ReviewCard from '../seller/ReviewCard';
import { userVar } from '../../../apollo/store';
import { Review } from '../../types/review/review';
import { ReviewsInquiry } from '../../types/review/review.input';
import { T } from '../../types/common';
import { GET_REVIEWS } from '../../../apollo/user/query';

interface MemberReviewsProps {
	memberId: string;
	initialInput: ReviewsInquiry;
}

const MemberReviews = (props: MemberReviewsProps) => {
	const { memberId, initialInput } = props;
	const router = useRouter();
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);
	const [reviewInquiry, setReviewInquiry] =
		useState<ReviewsInquiry>(initialInput);
	const [reviews, setReviews] = useState<Review[]>([]);
	const [total, setTotal] = useState<number>(0);

	/** APOLLO REQUESTS **/
	const {
		loading: getReviewsLoading,
		data: getReviewsData,
		error: getReviewsError,
	} = useQuery(GET_REVIEWS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: reviewInquiry },
		skip: !reviewInquiry.search.sellerId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setReviews(data?.getReviews?.list);
			setTotal(data?.getReviews?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		setReviewInquiry({
			...reviewInquiry,
			page: 1,
			search: { sellerId: memberId },
		});
	}, [memberId]);

	/** HANDLERS **/
	const goMemberPage = (id: string) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	const paginationHandler = (e: ChangeEvent<unknown>, value: number) => {
		setReviewInquiry({ ...reviewInquiry, page: value });
	};

	return (
		<Stack className={'member-section'}>
			<Stack className={'section-head'}>
				<Typography className={'section-title'}>
					{t('Reviews')}
					<span className={'count'}>{total}</span>
				</Typography>
			</Stack>
			<Stack className={'review-list'}>
				{reviews?.length === 0 ? (
					<div className={'no-data'}>{t('No reviews yet')}</div>
				) : (
					reviews.map((review: Review) => (
						<ReviewCard
							review={review}
							key={review?._id}
							goMemberPage={goMemberPage}
						/>
					))
				)}
			</Stack>
			{total > reviewInquiry.limit && (
				<Stack className={'pagination-box'}>
					<Pagination
						page={reviewInquiry.page}
						count={Math.ceil(total / reviewInquiry.limit)}
						onChange={paginationHandler}
						shape="circular"
						color="primary"
					/>
				</Stack>
			)}
		</Stack>
	);
};

MemberReviews.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		search: {
			sellerId: '',
		},
	},
};

export default MemberReviews;

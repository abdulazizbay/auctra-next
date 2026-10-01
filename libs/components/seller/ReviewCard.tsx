import React from 'react';
import moment from 'moment';
import { Avatar, Box, Rating, Stack, Typography } from '@mui/material';
import { Review } from '../../types/review/review';
import { REACT_APP_API_URL } from '../../config';

interface ReviewCardProps {
	review: Review;
	goMemberPage: any;
}

const ReviewCard = (props: ReviewCardProps) => {
	const { review, goMemberPage } = props;
	const image = review?.buyerData?.memberImage;
	const imagePath: string = !image
		? ''
		: image.startsWith('http')
		? image
		: `${REACT_APP_API_URL}/${image}`;

	return (
		<Stack className={'review-card'}>
			<Box component={'div'} className={'info'}>
				<Avatar
					src={imagePath || undefined}
					className={'avatar'}
					onClick={() => goMemberPage(review?.buyerData?._id as string)}
				>
					{review?.buyerData?.memberNick?.[0]?.toUpperCase()}
				</Avatar>
				<Stack className={'name-date'}>
					<strong
						onClick={() => goMemberPage(review?.buyerData?._id as string)}
					>
						{review?.buyerData?.memberNick}
					</strong>
					<span>{moment(review?.createdAt).format('YYYY.MM.DD')}</span>
				</Stack>
				<Rating
					className={'rating'}
					value={review?.reviewRating}
					size={'small'}
					readOnly
				/>
			</Box>
			{review?.reviewText && (
				<Typography className={'review-text'}>{review.reviewText}</Typography>
			)}
		</Stack>
	);
};

export default ReviewCard;

import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Avatar, Stack, Typography } from '@mui/material';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import { Member } from '../../types/member/member';
import { REACT_APP_API_URL } from '../../config';

interface TopSellerCardProps {
	seller: Member;
}

const TopSellerCard = (props: TopSellerCardProps) => {
	const { seller } = props;
	const router = useRouter();
	const { t } = useTranslation('common');
	const image = seller?.memberImage;
	const sellerImage: string = !image
		? ''
		: image.startsWith('http')
		? image
		: `${REACT_APP_API_URL}/${image}`;
	const isTrusted =
		seller?.memberAvgRating >= 4 && seller?.memberSalesCount >= 5;

	/** HANDLERS **/
	const pushDetailHandler = async (sellerId: string) => {
		await router.push({ pathname: '/member', query: { memberId: sellerId } });
	};

	return (
		<Stack
			className="top-seller-card"
			onClick={() => pushDetailHandler(seller?._id)}
		>
			<Avatar src={sellerImage || undefined} className={'avatar'}>
				{seller?.memberNick?.[0]?.toUpperCase()}
			</Avatar>
			<strong>
				{seller?.memberNick}
				{isTrusted && <VerifiedRoundedIcon className={'trusted'} />}
			</strong>
			<Typography className={'rating'}>
				<StarRoundedIcon />
				{seller?.memberAvgRating?.toFixed(1)} ({seller?.memberReviewCount})
			</Typography>
			<span>{t('{{count}} sales', { count: seller?.memberSalesCount })}</span>
		</Stack>
	);
};

export default TopSellerCard;

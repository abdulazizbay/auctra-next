import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useQuery } from '@apollo/client';
import { Stack, Typography } from '@mui/material';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import HeaderFilter from './HeaderFilter';
import HeroWatch from './HeroWatch';
import { GET_LOTS } from '../../../apollo/user/query';
import { LotCategory, LotStatus } from '../../enums/lot.enum';
import { T } from '../../types/common';

const heroCategories = [
	LotCategory.WATCHES,
	LotCategory.JEWELLERY,
	LotCategory.ART,
	LotCategory.COINS,
	LotCategory.COLLECTIBLES,
];

const HeroBanner = () => {
	const { t } = useTranslation('common');
	const [liveCount, setLiveCount] = useState<number>(0);
	const words = t('Bid on timeless pieces').split(' ');
	const accentWords = words.splice(-2);

	/** APOLLO REQUESTS **/
	const {
		loading: getLotsLoading,
		data: getLotsData,
		error: getLotsError,
	} = useQuery(GET_LOTS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: 1,
				limit: 1,
				search: { lotStatusList: [LotStatus.OPEN] },
			},
		},
		onCompleted: (data: T) => {
			setLiveCount(data?.getLots?.metaCounter[0]?.total ?? 0);
		},
	});

	const categoryHref = (category: LotCategory) => ({
		pathname: '/lot',
		query: {
			input: JSON.stringify({
				page: 1,
				limit: 9,
				sort: 'createdAt',
				direction: 'DESC',
				search: { lotCategoryList: [category] },
			}),
		},
	});

	return (
		<Stack className={'header-main'}>
			<Stack className={'container'}>
				<Stack className={'hero-content'}>
					<div className={'hero-eyebrow'}>
						<span className={'live-dot'} />
						{t('Live now')}
						{liveCount > 0 && ` · ${liveCount} ${t('lots open')}`}
					</div>
					<Typography component={'h1'} className={'hero-title'}>
						<span className={'line'}>
							{words.map((word, i) => (
								<span
									key={i}
									className={'word'}
									style={{ animationDelay: `${0.1 + i * 0.08}s` }}
								>
									{word}
								</span>
							))}
						</span>
						<span className={'line accent'}>
							{accentWords.map((word, i) => (
								<span
									key={i}
									className={'word'}
									style={{
										animationDelay: `${0.1 + (words.length + i) * 0.08}s`,
									}}
								>
									{word}
								</span>
							))}
						</span>
					</Typography>
					<Typography className={'hero-desc'}>
						{t(
							'Live auctions for watches, jewellery, art and rare collectibles from verified sellers.',
						)}
					</Typography>
					<HeaderFilter />
					<Stack className={'hero-chips'}>
						{heroCategories.map((category) => (
							<Link href={categoryHref(category)} key={category}>
								{t(category)}
							</Link>
						))}
					</Stack>
					<Stack className={'hero-trust'}>
						<div>
							<VerifiedOutlinedIcon />
							{t('Verified sellers')}
						</div>
						<div>
							<BoltOutlinedIcon />
							{t('Real-time bidding')}
						</div>
						<div>
							<StarBorderRoundedIcon />
							{t('Rated sellers')}
						</div>
					</Stack>
				</Stack>
				<Stack className={'hero-visual'}>
					<HeroWatch />
				</Stack>
			</Stack>
		</Stack>
	);
};

export default HeroBanner;

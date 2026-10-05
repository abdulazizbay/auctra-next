import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useQuery } from '@apollo/client';
import { Skeleton, Stack, Typography } from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import WatchOutlinedIcon from '@mui/icons-material/WatchOutlined';
import HeaderFilter from './HeaderFilter';
import { GET_LOTS } from '../../../apollo/user/query';
import { LotCategory, LotStatus } from '../../enums/lot.enum';
import { T } from '../../types/common';
import { Lot } from '../../types/lot/lot';
import { REACT_APP_API_URL } from '../../config';
import { countdownText, formatterStr } from '../../utils';

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
	const [featuredLot, setFeaturedLot] = useState<Lot | null>(null);
	const [now, setNow] = useState<number>(Date.now());

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
				sort: 'lotEndsAt',
				direction: 'ASC',
				search: { lotStatusList: [LotStatus.OPEN] },
			},
		},
		onCompleted: (data: T) => {
			setLiveCount(data?.getLots?.metaCounter[0]?.total ?? 0);
			setFeaturedLot(data?.getLots?.list?.[0] ?? null);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		const timer = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(timer);
	}, []);

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

	const image = featuredLot?.lotImages?.[0];
	const imagePath = !image
		? ''
		: image.startsWith('http')
		? image
		: `${REACT_APP_API_URL}/${image}`;

	return (
		<Stack className={'home-hero'}>
			<Stack className={'container'}>
				<div className={'hero-grid'}>
					<Stack className={'hero-main'}>
						<div className={'hero-eyebrow'}>
							<span className={'live-dot'} />
							{t('Live now')}
							{liveCount > 0 && ` · ${liveCount} ${t('lots open')}`}
						</div>
						<Typography component={'h1'} className={'hero-title'}>
							{t('Bid on timeless pieces')}
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
					</Stack>

					{getLotsLoading && !featuredLot ? (
						<Skeleton variant={'rounded'} className={'hero-feature-skeleton'} />
					) : featuredLot ? (
						<Link
							href={{ pathname: '/lot/detail', query: { id: featuredLot._id } }}
							className={'hero-feature'}
						>
							{imagePath ? (
								<img src={imagePath} alt={featuredLot.lotName} />
							) : (
								<div className={'no-image'}>
									<WatchOutlinedIcon />
								</div>
							)}
							<span className={'live-badge'}>
								<span className={'live-dot'} />
								{t('OPEN')}
							</span>
							<div className={'feature-info'}>
								<span className={'category'}>{t(featuredLot.lotCategory)}</span>
								<strong className={'name'}>{featuredLot.lotName}</strong>
								<div className={'row'}>
									<div>
										<span>{t('Current price')}</span>
										<b>${formatterStr(featuredLot.lotCurrentPrice) || 0}</b>
									</div>
									<div className={'timer'}>
										<span>{t('Ends in')}</span>
										<b>{countdownText(featuredLot.lotEndsAt, now)}</b>
									</div>
								</div>
							</div>
						</Link>
					) : (
						<Link href={'/lot'} className={'hero-feature empty'}>
							<WatchOutlinedIcon />
							<strong>{t('Lots')}</strong>
							<EastIcon />
						</Link>
					)}
				</div>
			</Stack>
		</Stack>
	);
};

export default HeroBanner;

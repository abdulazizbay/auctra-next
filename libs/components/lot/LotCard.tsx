import React from 'react';
import Link from 'next/link';
import moment from 'moment';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import WatchOutlinedIcon from '@mui/icons-material/WatchOutlined';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import { Lot } from '../../types/lot/lot';
import { LotStatus } from '../../enums/lot.enum';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../config';
import { formatterStr } from '../../utils';

interface LotCardType {
	lot: Lot;
	watchLotHandler?: any;
	myWatched?: boolean;
	recentlyVisited?: boolean;
	myBids?: boolean;
}

const LotCard = (props: LotCardType) => {
	const { lot, watchLotHandler, myWatched, recentlyVisited, myBids } = props;
	const isWatched = myWatched || !!lot?.meWatched?.[0]?.myWatch;
	const user = useReactiveVar(userVar);
	const { t } = useTranslation('common');
	const image = lot?.lotImages[0];
	const imagePath: string = !image
		? ''
		: image.startsWith('http')
		? image
		: `${REACT_APP_API_URL}/${image}`;

	const timeText =
		lot.lotStatus === LotStatus.OPEN
			? `${t('Ends')} ${moment(lot.lotEndsAt).fromNow()}`
			: lot.lotStatus === LotStatus.SCHEDULED
			? `${t('Starts')} ${moment(lot.lotStartsAt).fromNow()}`
			: `${t('Ended')} ${moment(lot.lotEndsAt).format('YYYY.MM.DD')}`;

	const isUrgent =
		lot.lotStatus === LotStatus.OPEN &&
		moment(lot.lotEndsAt).diff(moment(), 'hours') < 1;

	const isHighest = !!user._id && lot.lotHighestBidderId === user._id;
	const bidStatus =
		lot.lotStatus === LotStatus.OPEN
			? isHighest
				? 'Winning'
				: 'Outbid'
			: isHighest
			? 'Won'
			: 'Lost';

	return (
		<Stack className="lot-card">
			<Stack className="top">
				<Link href={{ pathname: '/lot/detail', query: { id: lot?._id } }}>
					{imagePath ? (
						<img src={imagePath} alt={lot.lotName} />
					) : (
						<Stack className={'no-image'}>
							<WatchOutlinedIcon />
						</Stack>
					)}
				</Link>
				<Box
					component={'div'}
					className={`status-badge ${
						myBids
							? bidStatus.toLowerCase()
							: lot.lotStatus === LotStatus.OPEN
							? 'live'
							: ''
					}`}
				>
					{!myBids && lot.lotStatus === LotStatus.OPEN && (
						<span className={'live-dot'} />
					)}
					{t(myBids ? bidStatus : lot.lotStatus)}
				</Box>
			</Stack>
			<Stack className="bottom">
				<Link href={{ pathname: '/lot/detail', query: { id: lot?._id } }}>
					<Typography className={'name'}>{lot.lotName}</Typography>
				</Link>
				<Typography className={'meta'}>
					{t(lot.lotCategory)} · {t(lot.lotCondition)}
				</Typography>
				<Stack className={'price-row'}>
					<Stack>
						<Typography className={'price-label'}>
							{t('Current price')}
						</Typography>
						<Typography className={'price'}>
							${formatterStr(lot.lotCurrentPrice) || 0}
						</Typography>
					</Stack>
					<Typography className={'bids'}>
						{lot.lotBids} {t('bids')}
					</Typography>
				</Stack>
				<Stack className={'footer'}>
					<Typography className={`time ${isUrgent ? 'urgent' : ''}`}>
						<AccessTimeRoundedIcon />
						{timeText}
					</Typography>
					<Stack className={'buttons'}>
						{recentlyVisited && <BookmarkBorderIcon className={'static'} />}
						{!recentlyVisited && (
							<Tooltip
								title={
									isWatched ? t('Remove from watchlist') : t('Add to watchlist')
								}
							>
								<IconButton
									size={'small'}
									onClick={() => watchLotHandler(user, lot?._id)}
								>
									{isWatched ? (
										<BookmarkIcon className={'watched'} />
									) : (
										<BookmarkBorderIcon />
									)}
								</IconButton>
							</Tooltip>
						)}
						<Typography className={'watch-count'}>{lot.lotWatchers}</Typography>
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default LotCard;

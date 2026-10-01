import React from 'react';
import Link from 'next/link';
import moment from 'moment';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import WatchOutlinedIcon from '@mui/icons-material/WatchOutlined';
import { Lot } from '../../types/lot/lot';
import { LotStatus } from '../../enums/lot.enum';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../config';
import { formatterStr } from '../../utils';

interface LotCardType {
	lot: Lot;
	watchLotHandler?: any;
}

const LotCard = (props: LotCardType) => {
	const { lot, watchLotHandler } = props;
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
						lot.lotStatus === LotStatus.OPEN ? 'live' : ''
					}`}
				>
					{t(lot.lotStatus)}
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
							₩{formatterStr(lot.lotCurrentPrice) || 0}
						</Typography>
					</Stack>
					<Typography className={'bids'}>
						{lot.lotBids} {t('bids')}
					</Typography>
				</Stack>
				<Stack className={'footer'}>
					<Typography className={'time'}>{timeText}</Typography>
					<Stack className={'buttons'}>
						<Tooltip
							title={
								lot?.meWatched?.[0]?.myWatch
									? t('Remove from watchlist')
									: t('Add to watchlist')
							}
						>
							<IconButton
								size={'small'}
								onClick={() => watchLotHandler(user, lot?._id)}
							>
								{lot?.meWatched && lot?.meWatched[0]?.myWatch ? (
									<BookmarkIcon className={'watched'} />
								) : (
									<BookmarkBorderIcon />
								)}
							</IconButton>
						</Tooltip>
						<Typography className={'watch-count'}>{lot.lotWatchers}</Typography>
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default LotCard;

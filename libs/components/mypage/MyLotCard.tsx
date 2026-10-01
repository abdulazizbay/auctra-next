import React from 'react';
import Link from 'next/link';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import ModeIcon from '@mui/icons-material/Mode';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import WatchOutlinedIcon from '@mui/icons-material/WatchOutlined';
import { Lot } from '../../types/lot/lot';
import { LotStatus } from '../../enums/lot.enum';
import { REACT_APP_API_URL } from '../../config';
import { formatterStr } from '../../utils';

interface MyLotCardProps {
	lot: Lot;
	cancelLotHandler: any;
}

const MyLotCard = (props: MyLotCardProps) => {
	const { lot, cancelLotHandler } = props;
	const router = useRouter();
	const { t } = useTranslation('common');
	const image = lot?.lotImages[0];
	const imagePath: string = !image
		? ''
		: image.startsWith('http')
		? image
		: `${REACT_APP_API_URL}/${image}`;
	const editable =
		lot.lotBids === 0 &&
		(lot.lotStatus === LotStatus.SCHEDULED || lot.lotStatus === LotStatus.OPEN);

	/** HANDLERS **/
	const pushEditLot = async (id: string) => {
		await router.push({
			pathname: '/mypage',
			query: { category: 'addLot', lotId: id },
		});
	};

	return (
		<Stack className="my-lot-card">
			<Link
				href={{ pathname: '/lot/detail', query: { id: lot._id } }}
				className="lot-box"
			>
				<Stack className="image-box">
					{imagePath ? (
						<img src={imagePath} alt={lot.lotName} />
					) : (
						<WatchOutlinedIcon />
					)}
				</Stack>
				<Stack className="information-box">
					<Typography className="name">{lot.lotName}</Typography>
					<Typography className="meta">
						{t(lot.lotCategory)} · {t(lot.lotCondition)}
					</Typography>
					<Typography className="price">
						${formatterStr(lot.lotCurrentPrice) || 0}
					</Typography>
				</Stack>
			</Link>
			<Typography className="date">
				{moment(lot.createdAt).format('YYYY.MM.DD')}
			</Typography>
			<Stack className="status-box">
				<Typography
					className={`status ${lot.lotStatus === LotStatus.OPEN ? 'live' : ''}`}
				>
					{t(lot.lotStatus)}
				</Typography>
			</Stack>
			<Typography className="bids">{lot.lotBids}</Typography>
			<Stack className="action-box">
				{editable && (
					<>
						<Tooltip title={t('Edit')}>
							<IconButton size="small" onClick={() => pushEditLot(lot._id)}>
								<ModeIcon />
							</IconButton>
						</Tooltip>
						<Tooltip title={t('Cancel lot')}>
							<IconButton
								size="small"
								onClick={() => cancelLotHandler(lot._id)}
							>
								<BlockOutlinedIcon />
							</IconButton>
						</Tooltip>
					</>
				)}
			</Stack>
		</Stack>
	);
};

export default MyLotCard;

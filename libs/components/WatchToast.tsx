import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import moment from 'moment';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import WatchOutlinedIcon from '@mui/icons-material/WatchOutlined';
import EastIcon from '@mui/icons-material/East';
import { watchToastVar } from '../../apollo/store';
import { REACT_APP_API_URL } from '../config';
import { LotStatus } from '../enums/lot.enum';

const countdown = (target: Date, now: number) => {
	const diff = Math.max(0, moment(target).valueOf() - now);
	const d = Math.floor(diff / 86400000);
	const h = Math.floor((diff % 86400000) / 3600000);
	const m = Math.floor((diff % 3600000) / 60000);
	const s = Math.floor((diff % 60000) / 1000);
	const pad = (n: number) => String(n).padStart(2, '0');
	return d > 0
		? `${d}d ${pad(h)}h ${pad(m)}m`
		: `${pad(h)}:${pad(m)}:${pad(s)}`;
};

const WatchToast = () => {
	const { t } = useTranslation('common');
	const toast = useReactiveVar(watchToastVar);
	const [now, setNow] = useState<number>(Date.now());

	useEffect(() => {
		if (!toast) return;
		const close = setTimeout(() => watchToastVar(null), 4200);
		const tick = setInterval(() => setNow(Date.now()), 1000);
		return () => {
			clearTimeout(close);
			clearInterval(tick);
		};
	}, [toast?.key]);

	if (!toast) return null;

	const { lot, added } = toast;
	const image = lot?.lotImages?.[0];
	const imagePath = !image
		? ''
		: image.startsWith('http')
		? image
		: `${REACT_APP_API_URL}/${image}`;
	const timer =
		lot.lotStatus === LotStatus.OPEN
			? `${t('Ends in')} ${countdown(lot.lotEndsAt, now)}`
			: lot.lotStatus === LotStatus.SCHEDULED
			? `${t('Starts in')} ${countdown(lot.lotStartsAt, now)}`
			: t(lot.lotStatus);

	return (
		<div
			className={`watch-toast ${added ? 'added' : 'removed'}`}
			key={toast.key}
		>
			<div className={'wt-head'}>
				<span className={'wt-label'}>
					{added ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
					{added ? t('Watching this auction') : t('Stopped watching')}
				</span>
				{added && (
					<span
						className={`wt-timer ${
							lot.lotStatus === LotStatus.OPEN ? 'live' : ''
						}`}
					>
						{lot.lotStatus === LotStatus.OPEN && (
							<span className={'live-dot'} />
						)}
						{timer}
					</span>
				)}
			</div>
			<div className={'wt-body'}>
				<div className={'thumb'}>
					{imagePath ? (
						<img src={imagePath} alt={lot.lotName} />
					) : (
						<WatchOutlinedIcon />
					)}
				</div>
				<div className={'text'}>
					<strong>{lot.lotName}</strong>
					<span>
						{added
							? t("You'll be notified about this auction.")
							: t('Removed from your watchlist.')}
					</span>
				</div>
				{added && (
					<Link
						href={'/mypage?category=watchlist'}
						className={'wt-link'}
						onClick={() => watchToastVar(null)}
					>
						<EastIcon />
					</Link>
				)}
			</div>
			<span className={'progress'} />
		</div>
	);
};

export default WatchToast;

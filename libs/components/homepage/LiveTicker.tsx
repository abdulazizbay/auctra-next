import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useQuery } from '@apollo/client';
import { GET_LOTS } from '../../../apollo/user/query';
import { LotStatus } from '../../enums/lot.enum';
import { Lot } from '../../types/lot/lot';
import { T } from '../../types/common';
import { countdownText, formatterStr } from '../../utils';

const LiveTicker = () => {
	const { t } = useTranslation('common');
	const [liveLots, setLiveLots] = useState<Lot[]>([]);
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
				limit: 12,
				sort: 'lotEndsAt',
				direction: 'ASC',
				search: { lotStatusList: [LotStatus.OPEN] },
			},
		},
		onCompleted: (data: T) => {
			setLiveLots(data?.getLots?.list ?? []);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		const timer = setInterval(() => setNow(Date.now()), 1000);
		return () => clearInterval(timer);
	}, []);

	if (liveLots.length === 0) return null;

	return (
		<div className={'live-ticker'}>
			<span className={'ticker-label'}>
				<span className={'live-dot'} />
				{t('LIVE')}
			</span>
			<div className={'ticker-track'}>
				<div
					className={'ticker-move'}
					style={{ animationDuration: `${liveLots.length * 7}s` }}
				>
					{[...liveLots, ...liveLots].map((lot: Lot, i: number) => (
						<Link
							href={{ pathname: '/lot/detail', query: { id: lot._id } }}
							className={'ticker-item'}
							key={`${lot._id}-${i}`}
						>
							<span className={'name'}>{lot.lotName}</span>
							<b>${formatterStr(lot.lotCurrentPrice) || 0}</b>
							<span className={'muted'}>
								{lot.lotBids} {t('bids')}
							</span>
							<span className={'time'}>
								{countdownText(lot.lotEndsAt, now)}
							</span>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default LiveTicker;

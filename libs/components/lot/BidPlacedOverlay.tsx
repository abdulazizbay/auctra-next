import React, { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import GavelStrike from '../common/GavelStrike';

interface BidPlacedOverlayProps {
	price: string;
	won: boolean;
	onClose: () => void;
}

const confettiColors = ['#111', '#ff4d2e', '#c2a35a', '#c4c4c4'];

const BidPlacedOverlay = ({ price, won, onClose }: BidPlacedOverlayProps) => {
	const { t } = useTranslation('common');

	useEffect(() => {
		const timer = setTimeout(onClose, won ? 4200 : 3000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className={'bid-overlay'} onClick={onClose}>
			{won && (
				<div className={'confetti'}>
					{Array.from({ length: 36 }).map((_, i) => (
						<span
							key={i}
							style={{
								left: `${(i * 37) % 100}%`,
								background: confettiColors[i % confettiColors.length],
								animationDelay: `${(i % 9) * 0.06}s`,
								animationDuration: `${1.6 + (i % 5) * 0.25}s`,
							}}
						/>
					))}
				</div>
			)}
			<div className={'bid-card'}>
				<GavelStrike />
				<strong className={'bid-title'}>
					{won ? t('Sold to you!') : t('Bid placed')}
				</strong>
				<span className={'bid-price'}>{price}</span>
				<p className={'bid-note'}>
					{won
						? t(
								'You reached the ceiling price. The lot closes now and you win it.',
						  )
						: t(
								"You're the highest bidder. We'll notify you if someone outbids you.",
						  )}
				</p>
			</div>
		</div>
	);
};

export default BidPlacedOverlay;

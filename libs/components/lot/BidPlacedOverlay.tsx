import React, { useEffect } from 'react';
import { useTranslation } from 'next-i18next';

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
				<svg className={'gavel-scene'} viewBox={'0 0 160 120'}>
					<ellipse
						className={'ripple'}
						cx={'80'}
						cy={'104'}
						rx={'46'}
						ry={'6'}
					/>
					<rect x={'38'} y={'94'} width={'84'} height={'12'} rx={'6'} />
					<g className={'gavel'}>
						<line x1={'80'} y1={'80'} x2={'138'} y2={'38'} />
						<rect x={'56'} y={'70'} width={'48'} height={'24'} rx={'6'} />
						<rect
							className={'band'}
							x={'64'}
							y={'70'}
							width={'4'}
							height={'24'}
						/>
						<rect
							className={'band'}
							x={'92'}
							y={'70'}
							width={'4'}
							height={'24'}
						/>
					</g>
					<g className={'impact'}>
						<line x1={'40'} y1={'78'} x2={'30'} y2={'70'} />
						<line x1={'120'} y1={'78'} x2={'130'} y2={'70'} />
						<line x1={'80'} y1={'60'} x2={'80'} y2={'50'} />
					</g>
				</svg>
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

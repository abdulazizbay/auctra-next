import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { Stack, Typography } from '@mui/material';
import EastIcon from '@mui/icons-material/East';

const AuctionScene = () => {
	const { t } = useTranslation('common');

	return (
		<Stack className={'auction-scene'}>
			<Stack className={'container'}>
				<div className={'scene-grid'}>
					<Stack className={'scene-text'}>
						<em>{t('How it works')}</em>
						<Typography className={'title'}>
							{t('Raise your paddle.')}
							<br />
							{t('Hear it sold.')}
						</Typography>
						<ol className={'steps'}>
							<li>
								<b>01</b>
								{t('Find a lot you love')}
							</li>
							<li>
								<b>02</b>
								{t('Place your bid in real time')}
							</li>
							<li>
								<b>03</b>
								{t('Win when the gavel falls')}
							</li>
						</ol>
						<Link href={'/lot'} className={'scene-link'}>
							{t('Browse lots')}
							<EastIcon />
						</Link>
					</Stack>

					<div className={'scene-stage'}>
						<svg viewBox={'0 0 480 300'} className={'scene-svg'}>
							<line
								className={'floor'}
								x1={'30'}
								y1={'270'}
								x2={'450'}
								y2={'270'}
							/>

							<g className={'bidder'}>
								<rect x={'72'} y={'178'} width={'76'} height={'92'} rx={'36'} />
								<circle cx={'110'} cy={'152'} r={'22'} />
								<g className={'paddle'}>
									<line
										className={'arm'}
										x1={'140'}
										y1={'192'}
										x2={'168'}
										y2={'164'}
									/>
									<line
										className={'stick'}
										x1={'168'}
										y1={'164'}
										x2={'168'}
										y2={'124'}
									/>
									<rect
										className={'paddle-head'}
										x={'143'}
										y={'72'}
										width={'50'}
										height={'56'}
										rx={'12'}
									/>
									<text x={'168'} y={'108'}>
										27
									</text>
								</g>
							</g>

							<g className={'price-tag'}>
								<rect x={'196'} y={'52'} width={'92'} height={'30'} rx={'15'} />
								<text x={'242'} y={'72'}>
									$12,000
								</text>
							</g>

							<g className={'auctioneer'}>
								<rect
									x={'330'}
									y={'170'}
									width={'64'}
									height={'46'}
									rx={'22'}
								/>
								<circle cx={'362'} cy={'148'} r={'20'} />
								<rect
									className={'podium'}
									x={'300'}
									y={'198'}
									width={'124'}
									height={'72'}
									rx={'8'}
								/>
								<rect
									className={'block'}
									x={'282'}
									y={'188'}
									width={'44'}
									height={'10'}
									rx={'4'}
								/>
								<g className={'gavel'}>
									<line x1={'303'} y1={'178'} x2={'340'} y2={'174'} />
									<rect
										x={'288'}
										y={'168'}
										width={'30'}
										height={'20'}
										rx={'4'}
									/>
								</g>
								<g className={'impact'}>
									<line x1={'276'} y1={'176'} x2={'266'} y2={'168'} />
									<line x1={'304'} y1={'160'} x2={'304'} y2={'150'} />
									<line x1={'332'} y1={'176'} x2={'342'} y2={'168'} />
								</g>
							</g>

							<g className={'sold'}>
								<rect
									x={'318'}
									y={'52'}
									width={'110'}
									height={'42'}
									rx={'21'}
								/>
								<text x={'373'} y={'80'}>
									{t('SOLD!')}
								</text>
							</g>
						</svg>
						<div className={'scene-caption'}>
							<span className={'once'}>{t('Going once…')}</span>
							<span className={'twice'}>{t('Going twice…')}</span>
							<span className={'done'}>{t('Sold to paddle 27')}</span>
						</div>
					</div>
				</div>
			</Stack>
		</Stack>
	);
};

export default AuctionScene;

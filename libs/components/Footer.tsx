import React from 'react';
import Link from 'next/link';
import moment from 'moment';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import { Box, Stack } from '@mui/material';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { userVar } from '../../apollo/store';

const Footer = () => {
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);

	return (
		<Stack className={'footer-container'}>
			<Stack className={'container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<span className={'logo'}>
							AUCTRA<em>.</em>
						</span>
						<p>
							{t(
								'Live auctions for luxury watches, jewellery, art and collectibles.',
							)}
						</p>
						<div className={'live-pill'}>
							<span className={'live-dot'} />
							{t('Live auctions every day')}
						</div>
						<Box component={'div'} className={'media-box'}>
							<FacebookOutlinedIcon />
							<InstagramIcon />
							<TelegramIcon />
							<YouTubeIcon />
						</Box>
					</Stack>
					<Stack className={'right'}>
						<div>
							<strong>{t('Marketplace')}</strong>
							<Link href={'/lot'}>{t('Lots')}</Link>
							<Link href={'/seller'}>{t('Sellers')}</Link>
						</div>
						<div>
							<strong>{t('Community')}</strong>
							<Link href={'/community?articleCategory=NEWS'}>{t('NEWS')}</Link>
							<Link href={'/community?articleCategory=MARKET_TALK'}>
								{t('MARKET_TALK')}
							</Link>
							<Link href={'/community?articleCategory=SHOWCASE'}>
								{t('SHOWCASE')}
							</Link>
							<Link href={'/community?articleCategory=AUTHENTICATION'}>
								{t('AUTHENTICATION')}
							</Link>
						</div>
						<div>
							<strong>{t('Account')}</strong>
							{user?._id ? (
								<>
									<Link href={'/mypage?category=myBids'}>{t('My Bids')}</Link>
									<Link href={'/mypage?category=watchlist'}>
										{t('Watchlist')}
									</Link>
									<Link href={'/mypage?category=myOrders'}>
										{t('My Orders')}
									</Link>
								</>
							) : (
								<Link href={'/account/join'}>
									{t('Login')} / {t('Register')}
								</Link>
							)}
						</div>
						<div>
							<strong>{t('Support')}</strong>
							<Link href={'/cs?tab=notice'}>{t('Notices')}</Link>
							<Link href={'/cs?tab=faq'}>{t('FAQ')}</Link>
						</div>
					</Stack>
				</Stack>
				<div className={'wordmark'}>AUCTRA</div>
				<Stack className={'second'}>
					<span>
						© Auctra {moment().year()}. {t('All rights reserved.')}
					</span>
					<span>{t('Made for collectors')}</span>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default Footer;

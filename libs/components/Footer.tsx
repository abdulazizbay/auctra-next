import React from 'react';
import Link from 'next/link';
import moment from 'moment';
import { useTranslation } from 'next-i18next';
import { Box, Stack } from '@mui/material';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import YouTubeIcon from '@mui/icons-material/YouTube';

const Footer = () => {
	const { t } = useTranslation('common');

	return (
		<Stack className={'footer-container'}>
			<Stack className={'container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<span className={'logo'}>AUCTRA</span>
						<p>{t('Live auctions for pre-owned luxury watches.')}</p>
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
							<Link href={'/community?articleCategory=MARKET_TALK'}>{t('Community')}</Link>
						</div>
						<div>
							<strong>{t('Support')}</strong>
							<Link href={'/cs?tab=notice'}>{t('Notices')}</Link>
							<Link href={'/cs?tab=faq'}>{t('FAQ')}</Link>
						</div>
					</Stack>
				</Stack>
				<Stack className={'second'}>
					<span>
						© Auctra {moment().year()}. {t('All rights reserved.')}
					</span>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default Footer;

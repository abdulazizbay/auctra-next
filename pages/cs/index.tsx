import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Box, Stack } from '@mui/material';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Notice from '../../libs/components/cs/Notice';
import Faq from '../../libs/components/cs/Faq';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CS: NextPage = () => {
	const router = useRouter();
	const { t } = useTranslation('common');

	/** HANDLERS **/
	const changeTabHandler = (tab: string) => {
		router.push(
			{
				pathname: '/cs',
				query: { tab: tab },
			},
			undefined,
			{ scroll: false },
		);
	};
	const tab = router.query.tab ?? 'notice';

	return (
		<Stack className={'cs-page'}>
			<Stack className={'container'}>
				<Box component={'div'} className={'cs-main-info'}>
					<Box component={'div'} className={'info'}>
						<span>{t('Help Center')}</span>
						<p>{t('Announcements and answers to common questions')}</p>
					</Box>
					<Box component={'div'} className={'btns'}>
						<div
							className={tab == 'notice' ? 'active' : ''}
							onClick={() => changeTabHandler('notice')}
						>
							<CampaignOutlinedIcon />
							{t('Notices')}
						</div>
						<div
							className={tab == 'faq' ? 'active' : ''}
							onClick={() => changeTabHandler('faq')}
						>
							<HelpOutlineRoundedIcon />
							{t('FAQ')}
						</div>
					</Box>
				</Box>

				<Box component={'div'} className={'cs-content'}>
					{tab === 'notice' && <Notice />}
					{tab === 'faq' && <Faq />}
				</Box>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(CS);

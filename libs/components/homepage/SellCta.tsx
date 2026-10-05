import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import { Button, Stack, Typography } from '@mui/material';
import EastIcon from '@mui/icons-material/East';
import { userVar } from '../../../apollo/store';
import { MemberType } from '../../enums/member.enum';

const SellCta = () => {
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);
	const isSeller = user.memberType === MemberType.SELLER;
	const href = !user._id
		? '/account/join'
		: isSeller
		? '/mypage?category=addLot'
		: '/mypage?category=myProfile';

	return (
		<Stack className={'sell-cta'}>
			<Stack className={'container'}>
				<Stack className={'cta-box'}>
					<Stack className={'cta-text'}>
						<em>{t('For collectors')}</em>
						<Typography className={'title'}>
							{t('Have a piece worth sharing?')}
						</Typography>
						<Typography className={'desc'}>
							{t(
								'Apply as a seller, list your lots and reach collectors who follow you.',
							)}
						</Typography>
					</Stack>
					<Link href={href}>
						<Button className={'cta-btn'} endIcon={<EastIcon />}>
							{isSeller ? t('List a lot') : t('Start selling')}
						</Button>
					</Link>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default SellCta;

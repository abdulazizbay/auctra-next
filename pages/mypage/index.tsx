import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Stack, Typography } from '@mui/material';
import { useReactiveVar } from '@apollo/client';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import MyMenu from '../../libs/components/mypage/MyMenu';
import MyLots from '../../libs/components/mypage/MyLots';
import AddNewLot from '../../libs/components/mypage/AddNewLot';
import { userVar } from '../../apollo/store';
import { getJwtToken } from '../../libs/auth';
import { MemberType } from '../../libs/enums/member.enum';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const MyPage: NextPage = () => {
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const { t } = useTranslation('common');
	const category: any = router.query?.category ?? 'myLots';

	/** LIFECYCLES **/
	useEffect(() => {
		if (!getJwtToken()) router.push('/').then();
	}, [user]);

	if (!user._id) return null;

	return (
		<div id="my-page">
			<div className="container">
				<Stack className={'my-page'}>
					<Stack className={'left-config'}>
						<MyMenu />
					</Stack>
					<Stack className="main-config">
						{user.memberType !== MemberType.SELLER ? (
							<Stack className={'no-data'}>
								<Typography>
									{t('Only approved sellers can manage lots')}
								</Typography>
							</Stack>
						) : (
							<>
								{category === 'addLot' && <AddNewLot />}
								{category === 'myLots' && <MyLots />}
							</>
						)}
					</Stack>
				</Stack>
			</div>
		</div>
	);
};

export default withLayoutBasic(MyPage);

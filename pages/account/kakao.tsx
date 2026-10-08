import React, { useEffect, useRef } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { CircularProgress, Stack } from '@mui/material';
import { socialLogIn } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { MemberAuthType } from '../../libs/enums/member.enum';
import { Message } from '../../libs/enums/common.enum';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const KakaoCallback: NextPage = () => {
	const router = useRouter();
	const called = useRef(false);

	useEffect(() => {
		if (!router.isReady || called.current) return;
		called.current = true;

		const { code, state, error } = router.query;
		const savedState = sessionStorage.getItem('kakaoState');
		const referrer = sessionStorage.getItem('kakaoReferrer') ?? '/';
		sessionStorage.removeItem('kakaoState');
		sessionStorage.removeItem('kakaoReferrer');

		const login = async () => {
			if (error) return await router.replace('/account/join');
			try {
				if (!code || state !== savedState)
					throw new Error(Message.SOCIAL_LOGIN_FAILED);
				await socialLogIn(MemberAuthType.KAKAO, `${code}`);
				await router.replace(referrer);
			} catch (err: any) {
				await sweetMixinErrorAlert(err.message);
				await router.replace('/account/join');
			}
		};
		login();
	}, [router.isReady]);

	return (
		<Stack className={'social-callback'}>
			<CircularProgress />
		</Stack>
	);
};

export default KakaoCallback;

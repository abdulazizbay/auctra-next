import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { logIn, signUp } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Join: NextPage = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const [input, setInput] = useState({ nick: '', password: '', phone: '' });
	const [loginView, setLoginView] = useState<boolean>(true);

	/** HANDLERS **/
	const viewChangeHandler = (state: boolean) => {
		setLoginView(state);
	};

	const handleInput = useCallback((name: any, value: any) => {
		setInput((prev) => {
			return { ...prev, [name]: value };
		});
	}, []);

	const doLogin = useCallback(async () => {
		try {
			await logIn(input.nick, input.password);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	const doSignUp = useCallback(async () => {
		try {
			await signUp(input.nick, input.password, input.phone);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	const submitHandler = (e: any) => {
		e.preventDefault();
		if (loginView) doLogin();
		else doSignUp();
	};

	return (
		<Stack className={'join-page'}>
			<Stack className={'container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Box className={'info'}>
							<Typography variant={'h3'}>{loginView ? t('Login') : t('Register')}</Typography>
							<p>
								{loginView
									? t('Welcome back. Log in to bid and track your orders.')
									: t('Create an account to start bidding.')}
							</p>
						</Box>
						<Box component={'form'} className={'input-wrap'} onSubmit={submitHandler}>
							<TextField
								label={t('Nickname')}
								value={input.nick}
								onChange={(e) => handleInput('nick', e.target.value)}
							/>
							<TextField
								label={t('Password')}
								type={'password'}
								value={input.password}
								onChange={(e) => handleInput('password', e.target.value)}
							/>
							{!loginView && (
								<TextField
									label={t('Phone')}
									value={input.phone}
									onChange={(e) => handleInput('phone', e.target.value)}
								/>
							)}
							<Button
								type={'submit'}
								variant={'contained'}
								size={'large'}
								disabled={input.nick == '' || input.password == '' || (!loginView && input.phone == '')}
							>
								{loginView ? t('Login') : t('Register')}
							</Button>
						</Box>
						<Box className={'ask-info'}>
							{loginView ? (
								<p>
									{t('Not registered yet?')}
									<b onClick={() => viewChangeHandler(false)}>{t('Register')}</b>
								</p>
							) : (
								<p>
									{t('Have an account?')}
									<b onClick={() => viewChangeHandler(true)}>{t('Login')}</b>
								</p>
							)}
						</Box>
					</Stack>
					<Stack className={'right'}>
						<span className={'logo'}>AUCTRA</span>
						<p>{t('Live auctions for pre-owned luxury watches.')}</p>
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(Join);

import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
	Box,
	Button,
	Divider,
	IconButton,
	InputAdornment,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import HeroWatch from '../../libs/components/homepage/HeroWatch';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { logIn, signUp, socialLogIn } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { MemberAuthType } from '../../libs/enums/member.enum';

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
	const [showPassword, setShowPassword] = useState<boolean>(false);

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

	const doSocialLogin = async (
		memberAuthType: MemberAuthType,
		token?: string,
	) => {
		if (!token) return;
		try {
			await socialLogIn(memberAuthType, token);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	};

	const kakaoLoginHandler = () => {
		const state = crypto.randomUUID();
		sessionStorage.setItem('kakaoState', state);
		sessionStorage.setItem('kakaoReferrer', `${router.query.referrer ?? '/'}`);
		const params = new URLSearchParams({
			client_id: process.env.REACT_APP_KAKAO_REST_KEY ?? '',
			redirect_uri: `${window.location.origin}/account/kakao`,
			response_type: 'code',
			state,
		});
		window.location.href = `https://kauth.kakao.com/oauth/authorize?${params}`;
	};

	const submitHandler = (e: any) => {
		e.preventDefault();
		if (loginView) doLogin();
		else doSignUp();
	};

	const iconAdornment = (icon: React.ReactNode) => ({
		input: {
			startAdornment: (
				<InputAdornment position={'start'}>{icon}</InputAdornment>
			),
		},
	});

	return (
		<Stack className={'join-page'}>
			<Stack className={'container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>
						<Stack className={'view-tabs'}>
							<Typography
								className={loginView ? 'active' : ''}
								onClick={() => viewChangeHandler(true)}
							>
								{t('Login')}
							</Typography>
							<Typography
								className={!loginView ? 'active' : ''}
								onClick={() => viewChangeHandler(false)}
							>
								{t('Register')}
							</Typography>
						</Stack>
						<Box className={'info'} key={loginView ? 'login' : 'register'}>
							<Typography variant={'h3'}>
								{loginView ? t('Welcome back') : t('Join Auctra')}
							</Typography>
							<p>
								{loginView
									? t('Welcome back. Log in to bid and track your orders.')
									: t('Create an account to start bidding.')}
							</p>
						</Box>
						<Box
							component={'form'}
							className={'input-wrap'}
							onSubmit={submitHandler}
						>
							<TextField
								label={t('Nickname')}
								value={input.nick}
								onChange={(e) => handleInput('nick', e.target.value)}
								slotProps={iconAdornment(<PersonOutlineRoundedIcon />)}
							/>
							<TextField
								label={t('Password')}
								type={showPassword ? 'text' : 'password'}
								value={input.password}
								onChange={(e) => handleInput('password', e.target.value)}
								slotProps={{
									input: {
										startAdornment: (
											<InputAdornment position={'start'}>
												<LockOutlinedIcon />
											</InputAdornment>
										),
										endAdornment: (
											<InputAdornment position={'end'}>
												<IconButton
													size={'small'}
													onClick={() => setShowPassword(!showPassword)}
												>
													{showPassword ? (
														<VisibilityOffOutlinedIcon />
													) : (
														<VisibilityOutlinedIcon />
													)}
												</IconButton>
											</InputAdornment>
										),
									},
								}}
							/>
							{!loginView && (
								<TextField
									className={'phone-field'}
									label={t('Phone')}
									value={input.phone}
									onChange={(e) => handleInput('phone', e.target.value)}
									slotProps={iconAdornment(<PhoneIphoneOutlinedIcon />)}
								/>
							)}
							<Button
								type={'submit'}
								variant={'contained'}
								size={'large'}
								disabled={
									input.nick == '' ||
									input.password == '' ||
									(!loginView && input.phone == '')
								}
							>
								{loginView ? t('Login') : t('Create account')}
							</Button>
						</Box>
						<Stack className={'social-login'}>
							<Divider>{t('or')}</Divider>
							{process.env.REACT_APP_GOOGLE_CLIENT_ID && (
								<GoogleOAuthProvider
									clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
									locale={router.locale === 'kr' ? 'ko' : 'en'}
								>
									<GoogleLogin
										text={'continue_with'}
										shape={'pill'}
										width={360}
										onSuccess={(res) =>
											doSocialLogin(MemberAuthType.GOOGLE, res.credential)
										}
									/>
								</GoogleOAuthProvider>
							)}
							{process.env.REACT_APP_KAKAO_REST_KEY && (
								<Button className={'kakao-btn'} onClick={kakaoLoginHandler}>
									<svg viewBox={'0 0 24 24'}>
										<path
											d={
												'M12 3C6.48 3 2 6.58 2 11c0 2.83 1.86 5.32 4.66 6.73l-.95 3.48c-.08.31.27.56.54.38l4.15-2.75c.52.05 1.06.08 1.6.08 5.52 0 10-3.58 10-8S17.52 3 12 3z'
											}
										/>
									</svg>
									{t('Continue with Kakao')}
								</Button>
							)}
						</Stack>
						<Box className={'ask-info'}>
							{loginView ? (
								<p>
									{t('Not registered yet?')}
									<b onClick={() => viewChangeHandler(false)}>
										{t('Register')}
									</b>
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
						<span className={'logo'}>
							AUCTRA<em>.</em>
						</span>
						<p>
							{t(
								'Live auctions for luxury watches, jewellery, art and collectibles.',
							)}
						</p>
						<Box component={'div'} className={'visual'}>
							<HeroWatch />
						</Box>
						<Stack className={'perks'}>
							<div>
								<VerifiedOutlinedIcon />
								{t('Verified sellers')}
							</div>
							<div>
								<BoltOutlinedIcon />
								{t('Real-time bidding')}
							</div>
							<div>
								<StarBorderRoundedIcon />
								{t('Rated sellers')}
							</div>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(Join);

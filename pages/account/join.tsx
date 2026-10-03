import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
	Box,
	Button,
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
import HeroWatch from '../../libs/components/homepage/HeroWatch';
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

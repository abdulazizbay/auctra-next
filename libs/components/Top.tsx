import React, { useEffect, useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useReactiveVar } from '@apollo/client';
import {
	Avatar,
	Box,
	Button,
	Drawer,
	IconButton,
	Menu,
	MenuItem,
	Stack,
} from '@mui/material';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuIcon from '@mui/icons-material/Menu';
import { Logout } from '@mui/icons-material';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import { userVar } from '../../apollo/store';
import { getJwtToken, logOut, requestUserInfo } from '../auth';
import { REACT_APP_API_URL } from '../config';
import { MemberType } from '../enums/member.enum';
import { connectSocket } from '../socket';
import NotificationBell from './NotificationBell';

const Top = () => {
	const user = useReactiveVar(userVar);
	const { t } = useTranslation('common');
	const router = useRouter();
	const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);
	const [logoutAnchor, setLogoutAnchor] = useState<null | HTMLElement>(null);
	const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
	const [scrolled, setScrolled] = useState<boolean>(false);
	const isHome = router.pathname === '/';

	/** LIFECYCLES **/
	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt && !userVar()._id) requestUserInfo();
	}, []);

	useEffect(() => {
		connectSocket();
	}, [user?._id]);

	useEffect(() => {
		const scrollHandler = () => setScrolled(window.scrollY > 40);
		scrollHandler();
		window.addEventListener('scroll', scrollHandler, { passive: true });
		return () => window.removeEventListener('scroll', scrollHandler);
	}, []);

	/** HANDLERS **/
	const langChoice = async (locale: string) => {
		setLangAnchor(null);
		await router.push(router.asPath, router.asPath, { locale });
	};

	const activeClass = (path: string) =>
		(path === '/' ? isHome : router.pathname.startsWith(path)) ? 'active' : '';

	const links = (
		<>
			<Link href={'/'} className={activeClass('/')}>
				{t('Home')}
			</Link>
			<Link href={'/lot'} className={activeClass('/lot')}>
				{t('Lots')}
				<span className={'live-dot'} />
			</Link>
			<Link href={'/seller'} className={activeClass('/seller')}>
				{t('Sellers')}
			</Link>
			<Link
				href={'/community?articleCategory=MARKET_TALK'}
				className={activeClass('/community')}
			>
				{t('Community')}
			</Link>
			<Link href={'/cs'} className={activeClass('/cs')}>
				{t('CS')}
			</Link>
		</>
	);

	return (
		<Stack
			className={`navbar ${isHome ? 'light' : ''} ${
				scrolled ? 'scrolled' : ''
			}`}
		>
			<Stack className={'container'}>
				<Box component={'div'} className={'logo-box'}>
					<Link href={'/'}>
						AUCTRA<span>.</span>
					</Link>
				</Box>
				<Box component={'div'} className={'router-box'}>
					{links}
				</Box>
				<Box component={'div'} className={'user-box'}>
					{user?._id ? (
						<>
							<NotificationBell />
							<IconButton
								onClick={(event: any) => setLogoutAnchor(event.currentTarget)}
							>
								<Avatar
									className={'login-user'}
									src={
										user?.memberImage
											? `${REACT_APP_API_URL}/${user?.memberImage}`
											: undefined
									}
								>
									{user?.memberNick?.[0]?.toUpperCase()}
								</Avatar>
							</IconButton>
							<Menu
								anchorEl={logoutAnchor}
								open={Boolean(logoutAnchor)}
								onClose={() => setLogoutAnchor(null)}
								anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
								transformOrigin={{ vertical: 'top', horizontal: 'center' }}
								className={'nav-menu'}
							>
								{user.memberType === MemberType.ADMIN && (
									<MenuItem onClick={() => router.push('/_admin')}>
										<AdminPanelSettingsOutlinedIcon
											fontSize="small"
											sx={{ mr: 1 }}
										/>
										{t('Admin')}
									</MenuItem>
								)}
								<MenuItem onClick={() => router.push('/mypage')}>
									<PersonOutlineRoundedIcon fontSize="small" sx={{ mr: 1 }} />
									{t('My Page')}
								</MenuItem>
								<MenuItem onClick={() => logOut()}>
									<Logout fontSize="small" sx={{ mr: 1 }} />
									{t('Logout')}
								</MenuItem>
							</Menu>
						</>
					) : (
						<Link href={'/account/join'}>
							<div className={'join-box'}>
								<AccountCircleOutlinedIcon />
								<span>
									{t('Login')} / {t('Register')}
								</span>
							</div>
						</Link>
					)}

					<Button
						disableRipple
						className={'btn-lang'}
						onClick={(event: any) => setLangAnchor(event.currentTarget)}
						endIcon={<KeyboardArrowDownIcon />}
					>
						{router.locale?.toUpperCase()}
					</Button>
					<Menu
						anchorEl={langAnchor}
						open={Boolean(langAnchor)}
						onClose={() => setLangAnchor(null)}
						anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
						transformOrigin={{ vertical: 'top', horizontal: 'center' }}
						className={'nav-menu'}
					>
						<MenuItem onClick={() => langChoice('en')}>English</MenuItem>
						<MenuItem onClick={() => langChoice('kr')}>한국어</MenuItem>
					</Menu>

					<IconButton
						className={'menu-btn'}
						onClick={() => setDrawerOpen(true)}
					>
						<MenuIcon />
					</IconButton>
				</Box>
			</Stack>

			<Drawer
				anchor={'right'}
				open={drawerOpen}
				onClose={() => setDrawerOpen(false)}
				className={'nav-drawer'}
			>
				<Box component={'div'} onClick={() => setDrawerOpen(false)}>
					{links}
				</Box>
			</Drawer>
		</Stack>
	);
};

export default withRouter(Top);

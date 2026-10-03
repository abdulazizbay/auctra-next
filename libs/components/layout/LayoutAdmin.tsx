import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import {
	Avatar,
	Box,
	Button,
	Drawer,
	IconButton,
	Stack,
	Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { userVar } from '../../../apollo/store';
import { getJwtToken, logOut, requestUserInfo } from '../../auth';
import { MemberType } from '../../enums/member.enum';
import { REACT_APP_API_URL } from '../../config';

const adminMenu = [
	{ href: '/_admin/members', title: 'Members' },
	{ href: '/_admin/sellers', title: 'Seller Applications' },
	{ href: '/_admin/lots', title: 'Lots' },
	{ href: '/_admin/community', title: 'Community' },
	{ href: '/_admin/cs', title: 'Notices & FAQ' },
];

const withLayoutAdmin = (Component: any) => {
	return (props: any) => {
		const router = useRouter();
		const user = useReactiveVar(userVar);
		const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
		const current = adminMenu.find((item) =>
			router.pathname.startsWith(item.href),
		);

		/** LIFECYCLES **/
		useEffect(() => {
			if (!getJwtToken()) router.replace('/').then();
			else if (!userVar()._id) requestUserInfo();
		}, []);

		useEffect(() => {
			if (user._id && user.memberType !== MemberType.ADMIN)
				router.replace('/').then();
		}, [user]);

		if (user.memberType !== MemberType.ADMIN) return null;

		const menu = (
			<Stack className={'admin-menu'}>
				<Link href={'/'} className={'logo'}>
					AUCTRA
				</Link>
				{adminMenu.map((item) => (
					<Link
						key={item.href}
						href={item.href}
						className={item === current ? 'active' : ''}
						onClick={() => setDrawerOpen(false)}
					>
						{item.title}
					</Link>
				))}
			</Stack>
		);

		return (
			<>
				<Head>
					<title>Auctra Admin</title>
				</Head>
				<Stack id={'admin-wrap'}>
					<Drawer variant={'permanent'} className={'admin-aside'}>
						{menu}
					</Drawer>
					<Drawer
						open={drawerOpen}
						onClose={() => setDrawerOpen(false)}
						className={'admin-aside-mobile'}
					>
						{menu}
					</Drawer>

					<Stack className={'admin-main'}>
						<Box component={'div'} className={'admin-top'}>
							<IconButton
								className={'menu-btn'}
								onClick={() => setDrawerOpen(true)}
							>
								<MenuIcon />
							</IconButton>
							<Typography className={'title'}>{current?.title}</Typography>
							<Avatar
								src={
									user.memberImage
										? `${REACT_APP_API_URL}/${user.memberImage}`
										: undefined
								}
							>
								{user.memberNick?.[0]?.toUpperCase()}
							</Avatar>
							<Typography className={'nick'}>{user.memberNick}</Typography>
							<Button size={'small'} onClick={() => logOut()}>
								Logout
							</Button>
						</Box>
						<Box component={'div'} className={'admin-content'}>
							<Component {...props} />
						</Box>
					</Stack>
				</Stack>
			</>
		);
	};
};

export default withLayoutAdmin;

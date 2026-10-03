import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import { Avatar, List, ListItem, Stack, Typography } from '@mui/material';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import { userVar } from '../../../apollo/store';
import { T } from '../../types/common';
import { REACT_APP_API_URL } from '../../config';
import { MemberType } from '../../enums/member.enum';

const MyMenu = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);
	const isSeller = user.memberType === MemberType.SELLER;
	const category: any =
		router.query?.category ?? (isSeller ? 'myLots' : 'watchlist');
	const sections = [
		...(isSeller
			? [
					{
						title: 'Manage Lots',
						items: [
							{ key: 'addLot', label: 'Add Lot', icon: <AddBoxOutlinedIcon /> },
							{
								key: 'myLots',
								label: 'My Lots',
								icon: <Inventory2OutlinedIcon />,
							},
							{
								key: 'mySales',
								label: 'My Sales',
								icon: <LocalShippingOutlinedIcon />,
							},
						],
					},
			  ]
			: []),
		{
			title: 'Activity',
			items: [
				{
					key: 'myOrders',
					label: 'My Orders',
					icon: <ReceiptLongOutlinedIcon />,
				},
				{
					key: 'watchlist',
					label: 'Watchlist',
					icon: <BookmarkBorderRoundedIcon />,
				},
				{
					key: 'recentlyVisited',
					label: 'Recently Viewed',
					icon: <HistoryRoundedIcon />,
				},
			],
		},
		{
			title: 'Community',
			items: [
				{
					key: 'writeArticle',
					label: 'Write Article',
					icon: <EditNoteOutlinedIcon />,
				},
				{
					key: 'myArticles',
					label: 'My Articles',
					icon: <ArticleOutlinedIcon />,
				},
				{
					key: 'followers',
					label: 'Followers',
					icon: <GroupOutlinedIcon />,
					count: user.memberFollowers,
				},
				{
					key: 'followings',
					label: 'Followings',
					icon: <PersonAddAltOutlinedIcon />,
					count: user.memberFollowings,
				},
			],
		},
		{
			title: 'Account',
			items: [
				{
					key: 'myProfile',
					label: 'My Profile',
					icon: <ManageAccountsOutlinedIcon />,
				},
			],
		},
	];

	return (
		<Stack className={'my-menu'}>
			<Stack className={'profile'}>
				<Avatar
					className={'profile-img'}
					src={
						user?.memberImage
							? `${REACT_APP_API_URL}/${user?.memberImage}`
							: undefined
					}
				>
					{user?.memberNick?.[0]?.toUpperCase()}
				</Avatar>
				<Stack className={'user-info'}>
					<Typography className={'user-name'}>{user?.memberNick}</Typography>
					<Typography className={'user-type'}>{user?.memberType}</Typography>
				</Stack>
			</Stack>
			{sections.map((section: T) => (
				<Stack className={'section'} key={section.title}>
					<Typography className={'title'}>{t(section.title)}</Typography>
					<List className={'sub-section'}>
						{section.items.map((item: T) => (
							<ListItem
								key={item.key}
								className={category === item.key ? 'focus' : ''}
							>
								<Link
									href={{ pathname: '/mypage', query: { category: item.key } }}
									scroll={false}
								>
									{item.icon}
									<Typography className={'sub-title'}>
										{t(item.label)}
									</Typography>
									{item.count !== undefined && (
										<span className={'count'}>{item.count}</span>
									)}
								</Link>
							</ListItem>
						))}
					</List>
				</Stack>
			))}
		</Stack>
	);
};

export default MyMenu;

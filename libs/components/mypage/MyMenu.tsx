import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import { Avatar, List, ListItem, Stack, Typography } from '@mui/material';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../config';
import { MemberType } from '../../enums/member.enum';

const MyMenu = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const category: any = router.query?.category ?? 'myLots';
	const user = useReactiveVar(userVar);

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
			{user.memberType === MemberType.SELLER && (
				<Stack className={'section'}>
					<Typography className={'title'}>{t('Manage Lots')}</Typography>
					<List className={'sub-section'}>
						<ListItem className={category === 'addLot' ? 'focus' : ''}>
							<Link
								href={{ pathname: '/mypage', query: { category: 'addLot' } }}
								scroll={false}
							>
								<AddBoxOutlinedIcon />
								<Typography className={'sub-title'}>{t('Add Lot')}</Typography>
							</Link>
						</ListItem>
						<ListItem className={category === 'myLots' ? 'focus' : ''}>
							<Link
								href={{ pathname: '/mypage', query: { category: 'myLots' } }}
								scroll={false}
							>
								<Inventory2OutlinedIcon />
								<Typography className={'sub-title'}>{t('My Lots')}</Typography>
							</Link>
						</ListItem>
					</List>
				</Stack>
			)}
		</Stack>
	);
};

export default MyMenu;

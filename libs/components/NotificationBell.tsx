import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import moment from 'moment';
import {
	useLazyQuery,
	useMutation,
	useQuery,
	useReactiveVar,
} from '@apollo/client';
import {
	Badge,
	Box,
	Button,
	IconButton,
	Menu,
	MenuItem,
	Typography,
} from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { socketVar, userVar } from '../../apollo/store';
import { GET_NOTIFICATIONS } from '../../apollo/user/query';
import {
	READ_ALL_NOTIFICATIONS,
	READ_NOTIFICATION,
} from '../../apollo/user/mutation';
import { Notification } from '../types/notification/notification';
import {
	NotificationRefType,
	NotificationType,
} from '../enums/notification.enum';
import { MemberType } from '../enums/member.enum';
import { T } from '../types/common';
import { notificationMessages } from '../config';
import { formatterStr } from '../utils';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../sweetAlert';

const NotificationBell = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const socket = useReactiveVar(socketVar);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [unreadCount, setUnreadCount] = useState<number>(0);
	const user = useReactiveVar(userVar);

	/** APOLLO REQUESTS **/
	const [readNotification] = useMutation(READ_NOTIFICATION);
	const [readAllNotifications] = useMutation(READ_ALL_NOTIFICATIONS);
	const [getNotifications] = useLazyQuery(GET_NOTIFICATIONS, {
		fetchPolicy: 'network-only',
	});

	useQuery(GET_NOTIFICATIONS, {
		fetchPolicy: 'network-only',
		variables: { input: { page: 1, limit: 1, search: { unreadOnly: true } } },
		onCompleted: (data: T) => {
			setUnreadCount(data?.getNotifications?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (!socket) return;
		const notificationHandler = (msg: MessageEvent) => {
			const data = JSON.parse(msg.data);
			if (data.event !== 'notification') return;
			setUnreadCount((count) => count + 1);
			setNotifications((list) => [data.notification, ...list].slice(0, 10));
			sweetTopSmallSuccessAlert(notificationText(data.notification), 3000);
		};
		socket.addEventListener('message', notificationHandler);
		return () => socket.removeEventListener('message', notificationHandler);
	}, [socket, t]);

	/** HANDLERS **/
	const notificationText = (notification: Notification) => {
		const { lotName, price, text } = notification.notificationPayload ?? {};
		return t(notificationMessages[notification.notificationType], {
			lotName: lotName ?? '',
			price: `$${formatterStr(price)}`,
			text: text ?? '',
		});
	};

	const notificationLink = (notification: Notification) => {
		switch (notification.notificationType) {
			case NotificationType.NEW_MESSAGE:
				return `/mypage?category=${
					user.memberType === MemberType.SELLER ? 'mySales' : 'myOrders'
				}&chat=${notification.notificationRefId}`;
			case NotificationType.WON:
			case NotificationType.SHIPPED:
				return '/mypage?category=myOrders';
			case NotificationType.PAYMENT_RECEIVED:
			case NotificationType.ORDER_COMPLETED:
				return '/mypage?category=mySales';
			case NotificationType.SELLER_APPROVED:
			case NotificationType.SELLER_REJECTED:
				return '/mypage?category=myProfile';
			case NotificationType.LOT_CANCELLED:
				return user.memberType === MemberType.SELLER
					? '/mypage?category=myLots'
					: '';
		}
		if (notification.notificationRefType === NotificationRefType.ARTICLE)
			return `/community/detail?id=${notification.notificationRefId}`;
		return `/lot/detail?id=${notification.notificationRefId}`;
	};

	const openHandler = async (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
		const { data } = await getNotifications({
			variables: { input: { page: 1, limit: 10, search: {} } },
		});
		if (data?.getNotifications?.list)
			setNotifications(data.getNotifications.list);
	};

	const clickNotificationHandler = async (notification: Notification) => {
		try {
			setAnchorEl(null);
			if (!notification.notificationReadAt) {
				await readNotification({ variables: { input: notification._id } });
				setUnreadCount((count) => Math.max(count - 1, 0));
			}
			const link = notificationLink(notification);
			if (link) await router.push(link);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const readAllHandler = async () => {
		try {
			await readAllNotifications();
			setUnreadCount(0);
			setNotifications(
				notifications.map((item) => ({
					...item,
					notificationReadAt: new Date(),
				})),
			);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	return (
		<>
			<IconButton className={'icon-btn'} onClick={openHandler}>
				<Badge badgeContent={unreadCount} color={'error'} max={99}>
					<NotificationsOutlinedIcon />
				</Badge>
			</IconButton>
			<Menu
				className={'notification-menu'}
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={() => setAnchorEl(null)}
			>
				<Box component={'div'} className={'notification-head'}>
					<Typography className={'title'}>{t('Notifications')}</Typography>
					<Button
						size={'small'}
						disabled={!unreadCount}
						onClick={readAllHandler}
					>
						{t('Mark all read')}
					</Button>
				</Box>
				{notifications.length === 0 && (
					<Typography className={'notification-empty'}>
						{t('No notifications')}
					</Typography>
				)}
				{notifications.map((notification) => (
					<MenuItem
						key={notification._id}
						className={
							notification.notificationReadAt
								? 'notification-item'
								: 'notification-item unread'
						}
						onClick={() => clickNotificationHandler(notification)}
					>
						<Typography className={'text'}>
							{notificationText(notification)}
						</Typography>
						<Typography className={'date'}>
							{moment(notification.createdAt).fromNow()}
						</Typography>
					</MenuItem>
				))}
			</Menu>
		</>
	);
};

export default NotificationBell;

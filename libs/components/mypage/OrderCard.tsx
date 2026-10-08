import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import moment from 'moment';
import { useTranslation } from 'next-i18next';
import { Button, IconButton, Stack, Typography } from '@mui/material';
import WatchOutlinedIcon from '@mui/icons-material/WatchOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { Order } from '../../types/order/order';
import { OrderStatus } from '../../enums/order.enum';
import { REACT_APP_API_URL } from '../../config';
import { formatterStr } from '../../utils';

interface OrderCardProps {
	order: Order;
	sales: boolean;
	actionHandler: any;
	chatHandler: any;
}

const OrderCard = (props: OrderCardProps) => {
	const { order, sales, actionHandler, chatHandler } = props;
	const { t } = useTranslation('common');
	const lot = order.lotData?.[0];
	const moreLots = (order.lotData?.length ?? 0) - 1;
	const image = lot?.lotImages?.[0];
	const imagePath: string = !image
		? ''
		: image.startsWith('http')
		? image
		: `${REACT_APP_API_URL}/${image}`;
	const payable =
		order.orderStatus === OrderStatus.PENDING_PAYMENT &&
		moment(order.orderPaymentDueAt).isAfter();
	const actionLabel = sales
		? order.orderStatus === OrderStatus.PAID && 'Mark shipped'
		: (payable && 'Pay') ||
		  (order.orderStatus === OrderStatus.SHIPPED && 'Confirm receipt') ||
		  (order.orderStatus === OrderStatus.COMPLETED &&
				!order.orderReviewed &&
				'Leave review');

	return (
		<Stack className="my-order-card">
			<Link
				href={{ pathname: '/lot/detail', query: { id: lot?._id } }}
				className="lot-box"
			>
				<Stack className="image-box">
					{imagePath ? (
						<Image
							src={imagePath}
							alt={lot?.lotName ?? ''}
							width={128}
							height={128}
						/>
					) : (
						<WatchOutlinedIcon />
					)}
				</Stack>
				<Stack className="information-box">
					<Typography className="name">
						{lot?.lotName}
						{moreLots > 0 && ` +${moreLots}`}
					</Typography>
					<Typography className="price">
						${formatterStr(order.orderTotal)}
					</Typography>
					{payable && (
						<Typography className="meta">
							{t('Pay by')}{' '}
							{moment(order.orderPaymentDueAt).format('YYYY.MM.DD HH:mm')}
						</Typography>
					)}
					{order.orderAddress && (
						<Typography className="meta">{order.orderAddress}</Typography>
					)}
				</Stack>
			</Link>
			<Typography className="date">
				{moment(order.createdAt).format('YYYY.MM.DD')}
			</Typography>
			<Stack className="status-box">
				<Typography className="status">{t(order.orderStatus)}</Typography>
			</Stack>
			<Stack className="action-box">
				<IconButton size="small" onClick={() => chatHandler(order._id)}>
					<ChatBubbleOutlineIcon />
				</IconButton>
				{actionLabel ? (
					<Button
						size="small"
						variant="contained"
						onClick={() => actionHandler(order)}
					>
						{t(actionLabel)}
					</Button>
				) : (
					order.orderReviewed && (
						<Typography className="meta">{t('Reviewed')}</Typography>
					)
				)}
			</Stack>
		</Stack>
	);
};

export default OrderCard;

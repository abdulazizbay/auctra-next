import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Pagination,
	Rating,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import OrderCard from './OrderCard';
import { Order } from '../../types/order/order';
import { OrdersInquiry } from '../../types/order/order.input';
import { OrderUpdate } from '../../types/order/order.update';
import { T } from '../../types/common';
import { OrderStatus, orderTabStatuses } from '../../enums/order.enum';
import { formatterStr } from '../../utils';
import { userVar } from '../../../apollo/store';
import { CREATE_REVIEW, UPDATE_ORDER } from '../../../apollo/user/mutation';
import { GET_MY_ORDERS, GET_MY_SALES } from '../../../apollo/user/query';
import {
	sweetConfirmAlert,
	sweetMixinErrorAlert,
	sweetTopSmallSuccessAlert,
} from '../../sweetAlert';

const MyOrders = ({ initialInput, sales, ...props }: any) => {
	const user = useReactiveVar(userVar);
	const { t } = useTranslation('common');
	const [searchFilter, setSearchFilter] = useState<OrdersInquiry>({
		...initialInput,
		search: {
			orderStatus: sales ? OrderStatus.PAID : OrderStatus.PENDING_PAYMENT,
		},
	});
	const [orders, setOrders] = useState<Order[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [dialog, setDialog] = useState<{ type: string; order: Order } | null>(
		null,
	);
	const [address, setAddress] = useState<string>('');
	const [rating, setRating] = useState<number | null>(5);
	const [reviewText, setReviewText] = useState<string>('');

	/** APOLLO REQUESTS **/
	const [updateOrder] = useMutation(UPDATE_ORDER);
	const [createReview] = useMutation(CREATE_REVIEW);

	const { refetch: getOrdersRefetch } = useQuery(
		sales ? GET_MY_SALES : GET_MY_ORDERS,
		{
			fetchPolicy: 'network-only',
			variables: { input: searchFilter },
			notifyOnNetworkStatusChange: true,
			onCompleted: (data: T) => {
				const result = sales ? data?.getMySales : data?.getMyOrders;
				setOrders(result?.list ?? []);
				setTotal(result?.metaCounter[0]?.total ?? 0);
			},
		},
	);

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
	};

	const changeStatusHandler = (value: OrderStatus) => {
		setSearchFilter({
			...searchFilter,
			page: 1,
			search: { orderStatus: value },
		});
	};

	const updateOrderHandler = async (input: OrderUpdate, message: string) => {
		await updateOrder({ variables: { input } });
		await getOrdersRefetch({ input: searchFilter });
		await sweetTopSmallSuccessAlert(t(message), 800);
	};

	const actionHandler = async (order: Order) => {
		try {
			if (order.orderStatus === OrderStatus.PENDING_PAYMENT) {
				setAddress(user.memberAddress ?? '');
				setDialog({ type: 'pay', order });
			} else if (order.orderStatus === OrderStatus.PAID) {
				if (await sweetConfirmAlert(t('Mark this order as shipped?')))
					await updateOrderHandler(
						{ _id: order._id, orderStatus: OrderStatus.SHIPPED },
						'Order shipped',
					);
			} else if (order.orderStatus === OrderStatus.SHIPPED) {
				if (await sweetConfirmAlert(t('Confirm you received this order?')))
					await updateOrderHandler(
						{ _id: order._id, orderStatus: OrderStatus.COMPLETED },
						'Order completed',
					);
			} else if (order.orderStatus === OrderStatus.COMPLETED) {
				setRating(5);
				setReviewText('');
				setDialog({ type: 'review', order });
			}
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const payHandler = async () => {
		try {
			if (!dialog) return;
			await updateOrderHandler(
				{
					_id: dialog.order._id,
					orderStatus: OrderStatus.PAID,
					orderAddress: address.trim(),
				},
				'Payment complete',
			);
			setDialog(null);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const reviewHandler = async () => {
		try {
			if (!dialog || !rating) return;
			await createReview({
				variables: {
					input: {
						orderId: dialog.order._id,
						reviewRating: rating,
						reviewText: reviewText.trim() || undefined,
					},
				},
			});
			await getOrdersRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert(t('Review submitted'), 800);
			setDialog(null);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	return (
		<div id="my-orders-page">
			<Stack className="main-title-box">
				<Typography className="main-title">
					{t(sales ? 'My Sales' : 'My Orders')}
				</Typography>
				<Typography className="sub-title">
					{t(
						sales
							? 'Ship the lots you sold'
							: 'Pay for and track your won lots',
					)}
				</Typography>
			</Stack>
			<Stack className="lot-list-box">
				<Stack className="tab-name-box">
					{orderTabStatuses.map((status: OrderStatus) => (
						<Typography
							key={status}
							onClick={() => changeStatusHandler(status)}
							className={
								searchFilter.search.orderStatus === status
									? 'active-tab-name'
									: 'tab-name'
							}
						>
							{t(status)}
						</Typography>
					))}
				</Stack>
				<Stack className="list-box">
					<Stack className="listing-title-box">
						<Typography className="title-text">{t('Lot')}</Typography>
						<Typography className="title-text">{t('Ordered')}</Typography>
						<Typography className="title-text">{t('Status')}</Typography>
						<Typography className="title-text">{t('Action')}</Typography>
					</Stack>

					{orders.length === 0 ? (
						<div className={'no-data'}>
							<p>{t('No orders found')}</p>
						</div>
					) : (
						orders.map((order: Order) => (
							<OrderCard
								key={order._id}
								order={order}
								sales={!!sales}
								actionHandler={actionHandler}
							/>
						))
					)}

					{orders.length !== 0 && (
						<Stack className="pagination-config">
							<Pagination
								count={Math.ceil(total / searchFilter.limit)}
								page={searchFilter.page}
								shape="circular"
								color="primary"
								onChange={paginationHandler}
							/>
							<Typography className="total-result">
								{total} {t('orders')}
							</Typography>
						</Stack>
					)}
				</Stack>
			</Stack>

			<Dialog
				open={dialog?.type === 'pay'}
				onClose={() => setDialog(null)}
				fullWidth
				maxWidth="xs"
			>
				<DialogTitle>{t('Pay for order')}</DialogTitle>
				<DialogContent>
					<Stack gap={2} pt={1}>
						<Typography variant="body2" color="text.secondary">
							{t('Payment is simulated. Enter your shipping address.')}
						</Typography>
						<TextField
							label={t('Shipping address')}
							value={address}
							onChange={({ target: { value } }) => setAddress(value)}
							inputProps={{ maxLength: 200 }}
							multiline
							minRows={2}
							fullWidth
						/>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDialog(null)}>{t('Cancel')}</Button>
					<Button
						variant="contained"
						disabled={address.trim().length < 5}
						onClick={payHandler}
					>
						{t('Pay')} ${formatterStr(dialog?.order.orderTotal)}
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={dialog?.type === 'review'}
				onClose={() => setDialog(null)}
				fullWidth
				maxWidth="xs"
			>
				<DialogTitle>{t('Leave review')}</DialogTitle>
				<DialogContent>
					<Stack gap={2} pt={1}>
						<Rating value={rating} onChange={(e, value) => setRating(value)} />
						<TextField
							label={t('Review')}
							value={reviewText}
							onChange={({ target: { value } }) => setReviewText(value)}
							inputProps={{ maxLength: 500 }}
							multiline
							minRows={3}
							fullWidth
						/>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDialog(null)}>{t('Cancel')}</Button>
					<Button
						variant="contained"
						disabled={!rating}
						onClick={reviewHandler}
					>
						{t('Submit')}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

MyOrders.defaultProps = {
	initialInput: {
		page: 1,
		limit: 5,
		search: {},
	},
};

export default MyOrders;

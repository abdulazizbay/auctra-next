export enum OrderStatus {
	PENDING_PAYMENT = 'PENDING_PAYMENT',
	PAID = 'PAID',
	SHIPPED = 'SHIPPED',
	COMPLETED = 'COMPLETED',
	EXPIRED = 'EXPIRED',
	CANCELLED = 'CANCELLED',
}

export const orderTabStatuses = [
	OrderStatus.PENDING_PAYMENT,
	OrderStatus.PAID,
	OrderStatus.SHIPPED,
	OrderStatus.COMPLETED,
	OrderStatus.EXPIRED,
];

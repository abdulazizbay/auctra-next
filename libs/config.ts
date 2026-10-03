export const REACT_APP_API_URL = `${process.env.REACT_APP_API_URL}`;

export const Messages = {
	error1: 'Something went wrong!',
	error2: 'Please login first!',
	error3: 'Please fulfill all inputs!',
	error4: 'Message is empty!',
	error5: 'Only images with jpeg, jpg, png format allowed!',
	INSERT_ALL_INPUTS: 'Please insert all inputs!',
};

export const lotPriceMax = 2147483647;

export const lotPriceRanges = [
	{ start: 0, end: 1000 },
	{ start: 1000, end: 5000 },
	{ start: 5000, end: 20000 },
	{ start: 20000, end: 100000 },
	{ start: 100000, end: lotPriceMax },
];

export const notificationMessages: Record<string, string> = {
	OUTBID: 'You were outbid on {{lotName}} ({{price}})',
	ENDING_SOON: '{{lotName}} is ending soon',
	WON: 'You won {{lotName}} for {{price}}',
	LOST: '{{lotName}} sold to another bidder',
	PAYMENT_DUE: 'Payment due for your order ({{price}})',
	PAYMENT_RECEIVED: 'Payment received ({{price}})',
	SHIPPED: 'Your order has shipped',
	ORDER_COMPLETED: 'Order completed ({{price}})',
	NEW_COMMENT: 'New comment: {{text}}',
	NEW_MESSAGE: 'New message: {{text}}',
	NEW_LOT_FROM_FOLLOWED: 'New lot from a seller you follow: {{lotName}}',
	SELLER_APPROVED: 'Your seller application was approved',
	SELLER_REJECTED: 'Your seller application was rejected',
};

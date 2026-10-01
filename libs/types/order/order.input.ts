import { OrderStatus } from '../../enums/order.enum';

interface OISearch {
	orderStatus?: OrderStatus;
}

export interface OrdersInquiry {
	page: number;
	limit: number;
	search: OISearch;
}

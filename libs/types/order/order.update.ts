import { OrderStatus } from '../../enums/order.enum';

export interface OrderUpdate {
	_id: string;
	// buyer: PAID, COMPLETED; seller: SHIPPED
	orderStatus: OrderStatus;
	orderAddress?: string;
}

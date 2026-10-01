import { OrderStatus } from '../../enums/order.enum';
import { Lot } from '../lot/lot';
import { TotalCounter } from '../member/member';

export interface OrderItem {
	_id: string;
	orderId: string;
	lotId: string;
	itemPrice: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface Order {
	_id: string;
	buyerId: string;
	sellerId: string;
	orderTotal: number;
	orderStatus: OrderStatus;
	orderAddress?: string;
	orderPaymentDueAt: Date;
	createdAt: Date;
	updatedAt: Date;
	orderItems?: OrderItem[];
	lotData?: Lot[];
}

export interface Orders {
	list: Order[];
	metaCounter?: TotalCounter[];
}

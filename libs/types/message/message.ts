import { TotalCounter } from '../member/member';

export interface OrderMessage {
	_id: string;
	orderId: string;
	memberId: string;
	messageText: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface OrderMessages {
	list: OrderMessage[];
	metaCounter?: TotalCounter[];
}

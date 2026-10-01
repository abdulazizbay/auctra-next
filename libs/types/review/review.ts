import { Member, TotalCounter } from '../member/member';

export interface Review {
	_id: string;
	orderId: string;
	buyerId: string;
	sellerId: string;
	reviewRating: number;
	reviewText?: string;
	createdAt: Date;
	updatedAt: Date;
	buyerData?: Member;
}

export interface Reviews {
	list: Review[];
	metaCounter?: TotalCounter[];
}

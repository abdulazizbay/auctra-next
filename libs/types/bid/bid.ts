import { Member, TotalCounter } from '../member/member';

export interface Bid {
	_id: string;
	lotId: string;
	memberId: string;
	bidPrice: number;
	createdAt: Date;
	updatedAt: Date;
	memberData?: Member;
}

export interface Bids {
	list: Bid[];
	metaCounter?: TotalCounter[];
}

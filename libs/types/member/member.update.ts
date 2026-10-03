import {
	MemberLocation,
	MemberSellerStatus,
	MemberStatus,
} from '../../enums/member.enum';

export interface MemberUpdate {
	_id?: string;

	memberNick?: string;
	memberPhone?: string;
	memberEmail?: string;
	memberFullName?: string;
	memberImage?: string;
	memberBio?: string;
	memberLocation?: MemberLocation;
	memberAddress?: string;
	memberStatus?: MemberStatus;
}

export interface SellerApply {
	memberSellerDocUrl: string;
}

export interface SellerStatusUpdate {
	_id: string;
	memberSellerStatus: MemberSellerStatus;
}

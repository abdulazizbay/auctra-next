import { Direction } from '../../enums/common.enum';
import {
	MemberAuthType,
	MemberSellerStatus,
	MemberStatus,
	MemberType,
} from '../../enums/member.enum';

export interface MemberInput {
	memberNick: string;
	memberPassword: string;
	memberPhone: string;
}

export interface SocialLoginInput {
	memberAuthType: MemberAuthType;
	token: string;
}

export interface LoginInput {
	memberNick: string;
	memberPassword: string;
}

interface SISearch {
	text?: string;
}

export interface SellersInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: SISearch;
}

interface MISearch {
	memberStatus?: MemberStatus;
	memberType?: MemberType;
	memberSellerStatus?: MemberSellerStatus;
	text?: string;
}

export interface MembersInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: MISearch;
}

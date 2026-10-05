import { MeLiked } from '../like/like';
import { MeFollowed } from '../follow/follow';
import {
	MemberLocation,
	MemberSellerStatus,
	MemberStatus,
	MemberType,
} from '../../enums/member.enum';

export interface Member {
	_id: string;
	memberNick: string;
	memberPhone?: string;
	memberEmail?: string;
	memberType: MemberType;
	memberStatus: MemberStatus;
	memberSellerStatus: MemberSellerStatus;
	memberImage: string;
	memberFullName?: string;
	memberBio?: string;
	memberLocation?: MemberLocation;
	memberAddress?: string;
	memberSellerDocUrl?: string;
	memberSellerAppliedAt?: Date;
	memberAvgRating: number;
	memberReviewCount: number;
	memberSalesCount: number;
	memberFollowers: number;
	memberFollowings: number;
	memberLikes: number;
	memberViews: number;
	createdAt: Date;
	updatedAt: Date;
	meLiked?: MeLiked[];
	meFollowed?: MeFollowed[];
}

export interface AuthResponse {
	member: Member;
	accessToken: string;
}

export interface Members {
	list: Member[];
	metaCounter?: TotalCounter[];
}

export interface TotalCounter {
	total?: number;
}

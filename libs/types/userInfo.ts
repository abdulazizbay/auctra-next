export interface UserInfo {
	_id: string;
	memberNick: string;
	memberPhone: string;
	memberEmail?: string;
	memberType: string;
	memberStatus: string;
	memberSellerStatus: string;
	memberImage: string;
	memberFullName?: string;
	memberBio?: string;
	memberLocation?: string;
	memberAddress?: string;
	memberAvgRating: number;
	memberReviewCount: number;
	memberSalesCount: number;
	memberFollowers: number;
	memberFollowings: number;
	memberLikes: number;
	memberViews: number;
}

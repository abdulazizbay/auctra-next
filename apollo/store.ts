import { makeVar } from '@apollo/client';
import { UserInfo } from '../libs/types/userInfo';

export const userVar = makeVar<UserInfo>({
	_id: '',
	memberNick: '',
	memberPhone: '',
	memberEmail: '',
	memberType: '',
	memberStatus: '',
	memberSellerStatus: '',
	memberImage: '',
	memberFullName: '',
	memberBio: '',
	memberLocation: '',
	memberAddress: '',
	memberAvgRating: 0,
	memberReviewCount: 0,
	memberSalesCount: 0,
	memberFollowers: 0,
	memberFollowings: 0,
	memberLikes: 0,
	memberViews: 0,
});

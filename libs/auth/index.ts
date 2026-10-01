import { userVar } from '../../apollo/store';

export function getJwtToken(): any {
	if (typeof window !== 'undefined') {
		return localStorage.getItem('accessToken') ?? '';
	}
}

export const logOut = () => {
	deleteStorage();
	deleteUserInfo();
	window.location.reload();
};

const deleteStorage = () => {
	localStorage.removeItem('accessToken');
	window.localStorage.setItem('logout', Date.now().toString());
};

const deleteUserInfo = () => {
	userVar({
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
};

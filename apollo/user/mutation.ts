import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const SIGN_UP = gql`
	mutation Signup($input: MemberInput!) {
		signup(input: $input) {
			accessToken
			member {
				_id
				memberNick
				memberPhone
				memberEmail
				memberType
				memberStatus
				memberSellerStatus
				memberImage
				memberFullName
				memberBio
				memberLocation
				memberAddress
				memberAvgRating
				memberReviewCount
				memberSalesCount
				memberFollowers
				memberFollowings
				memberLikes
				memberViews
				createdAt
				updatedAt
			}
		}
	}
`;

export const LOGIN = gql`
	mutation Login($input: LoginInput!) {
		login(input: $input) {
			accessToken
			member {
				_id
				memberNick
				memberPhone
				memberEmail
				memberType
				memberStatus
				memberSellerStatus
				memberImage
				memberFullName
				memberBio
				memberLocation
				memberAddress
				memberAvgRating
				memberReviewCount
				memberSalesCount
				memberFollowers
				memberFollowings
				memberLikes
				memberViews
				createdAt
				updatedAt
			}
		}
	}
`;

/**************************
 *          LOT           *
 *************************/

export const WATCH_TARGET_LOT = gql`
	mutation WatchTargetLot($input: String!) {
		watchTargetLot(lotId: $input) {
			_id
			lotWatchers
		}
	}
`;

import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_ME = gql`
	query GetMe {
		getMe {
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
`;

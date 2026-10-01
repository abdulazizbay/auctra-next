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

/**************************
 *          LOT           *
 *************************/

export const GET_LOTS = gql`
	query GetLots($input: LotsInquiry!) {
		getLots(input: $input) {
			list {
				_id
				memberId
				lotName
				lotImages
				lotCategory
				lotCondition
				lotStatus
				lotStartPrice
				lotCurrentPrice
				lotCeilingPrice
				lotMinIncrement
				lotBids
				lotWatchers
				lotViews
				lotStartsAt
				lotEndsAt
				createdAt
				meWatched {
					memberId
					lotId
					myWatch
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

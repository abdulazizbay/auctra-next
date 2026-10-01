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

export const GET_MEMBER = gql`
	query GetMember($input: String!) {
		getMember(memberId: $input) {
			_id
			memberNick
			memberImage
			memberType
			memberSellerStatus
			memberAvgRating
			memberReviewCount
			memberSalesCount
			memberFollowers
			createdAt
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

export const GET_LOT = gql`
	query GetLot($input: String!) {
		getLot(lotId: $input) {
			_id
			memberId
			lotName
			lotDesc
			lotImages
			lotCategory
			lotCondition
			lotStatus
			lotStartPrice
			lotCurrentPrice
			lotCeilingPrice
			lotMinIncrement
			lotHighestBidderId
			lotBids
			lotWatchers
			lotViews
			lotComments
			lotShippingNote
			lotStartsAt
			lotEndsAt
			lotClosedAt
			createdAt
			meWatched {
				memberId
				lotId
				myWatch
			}
			memberData {
				_id
				memberNick
				memberImage
				memberType
				memberSellerStatus
				memberAvgRating
				memberReviewCount
				memberSalesCount
				memberFollowers
				createdAt
			}
		}
	}
`;

/**************************
 *          BID           *
 *************************/

export const GET_BIDS = gql`
	query GetBids($input: BidsInquiry!) {
		getBids(input: $input) {
			list {
				_id
				lotId
				memberId
				bidPrice
				createdAt
				memberData {
					_id
					memberNick
					memberImage
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const GET_COMMENTS = gql`
	query GetComments($input: CommentsInquiry!) {
		getComments(input: $input) {
			list {
				_id
				commentStatus
				commentGroup
				commentText
				commentRefId
				memberId
				createdAt
				updatedAt
				memberData {
					_id
					memberNick
					memberImage
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

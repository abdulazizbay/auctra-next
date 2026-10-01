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

/**************************
 *          BID           *
 *************************/

export const PLACE_BID = gql`
	mutation PlaceBid($input: BidInput!) {
		placeBid(input: $input) {
			_id
			lotId
			memberId
			bidPrice
			createdAt
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const CREATE_COMMENT = gql`
	mutation CreateComment($input: CommentInput!) {
		createComment(input: $input) {
			_id
			commentGroup
			commentText
			commentRefId
			memberId
			createdAt
		}
	}
`;

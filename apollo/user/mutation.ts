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

export const LIKE_TARGET_MEMBER = gql`
	mutation LikeTargetMember($input: String!) {
		likeTargetMember(memberId: $input) {
			_id
			memberNick
			memberLikes
		}
	}
`;

/**************************
 *          LOT           *
 *************************/

export const CREATE_LOT = gql`
	mutation CreateLot($input: LotInput!) {
		createLot(input: $input) {
			_id
			memberId
			lotName
			lotImages
			lotStatus
			lotStartPrice
			lotCurrentPrice
			lotStartsAt
			lotEndsAt
			createdAt
		}
	}
`;

export const UPDATE_LOT = gql`
	mutation UpdateLot($input: LotUpdate!) {
		updateLot(input: $input) {
			_id
			memberId
			lotName
			lotImages
			lotStatus
			lotStartPrice
			lotCurrentPrice
			lotStartsAt
			lotEndsAt
			lotClosedAt
			createdAt
		}
	}
`;

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

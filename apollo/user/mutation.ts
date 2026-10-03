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

export const UPDATE_MEMBER = gql`
	mutation UpdateMember($input: MemberUpdate!) {
		updateMember(input: $input) {
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

export const APPLY_SELLER = gql`
	mutation ApplySeller($input: SellerApply!) {
		applySeller(input: $input) {
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

export const LIKE_TARGET_MEMBER = gql`
	mutation LikeTargetMember($input: String!) {
		likeTargetMember(memberId: $input) {
			_id
			memberNick
			memberLikes
		}
	}
`;

export const SUBSCRIBE = gql`
	mutation Subscribe($input: String!) {
		subscribe(input: $input) {
			_id
			followingId
			followerId
		}
	}
`;

export const UNSUBSCRIBE = gql`
	mutation Unsubscribe($input: String!) {
		unsubscribe(input: $input) {
			_id
			followingId
			followerId
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
 *         ARTICLE        *
 *************************/

export const LIKE_TARGET_ARTICLE = gql`
	mutation LikeTargetArticle($input: String!) {
		likeTargetArticle(articleId: $input) {
			_id
			articleTitle
			articleLikes
		}
	}
`;

export const CREATE_ARTICLE = gql`
	mutation CreateArticle($input: ArticleInput!) {
		createArticle(input: $input) {
			_id
			articleCategory
			articleTitle
			lotId
			createdAt
		}
	}
`;

export const UPDATE_ARTICLE = gql`
	mutation UpdateArticle($input: ArticleUpdate!) {
		updateArticle(input: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			updatedAt
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

export const UPDATE_COMMENT = gql`
	mutation UpdateComment($input: CommentUpdate!) {
		updateComment(input: $input) {
			_id
			commentStatus
			commentText
			updatedAt
		}
	}
`;

/**************************
 *      ORDER / REVIEW    *
 *************************/

export const UPDATE_ORDER = gql`
	mutation UpdateOrder($input: OrderUpdate!) {
		updateOrder(input: $input) {
			_id
			orderStatus
			orderAddress
			updatedAt
		}
	}
`;

export const CREATE_REVIEW = gql`
	mutation CreateReview($input: ReviewInput!) {
		createReview(input: $input) {
			_id
			orderId
			reviewRating
			reviewText
			createdAt
		}
	}
`;

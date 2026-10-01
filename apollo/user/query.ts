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
			memberBio
			memberLocation
			memberAvgRating
			memberReviewCount
			memberSalesCount
			memberFollowers
			memberFollowings
			memberLikes
			memberViews
			createdAt
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
			meFollowed {
				followingId
				followerId
				myFollowing
			}
		}
	}
`;

export const GET_REVIEWS = gql`
	query GetReviews($input: ReviewsInquiry!) {
		getReviews(input: $input) {
			list {
				_id
				orderId
				buyerId
				sellerId
				reviewRating
				reviewText
				createdAt
				buyerData {
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

/**************************
 *         SELLER         *
 *************************/

export const GET_SELLERS = gql`
	query GetSellers($input: SellersInquiry!) {
		getSellers(input: $input) {
			list {
				_id
				memberNick
				memberImage
				memberType
				memberAvgRating
				memberReviewCount
				memberSalesCount
				memberFollowers
				memberLikes
				memberViews
				createdAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *        ARTICLE         *
 *************************/

export const GET_ARTICLE = gql`
	query GetArticle($input: String!) {
		getArticle(articleId: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImages
			lotId
			articleViews
			articleLikes
			articleComments
			memberId
			createdAt
			updatedAt
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
			memberData {
				_id
				memberNick
				memberImage
			}
		}
	}
`;

export const GET_ARTICLES = gql`
	query GetArticles($input: ArticlesInquiry!) {
		getArticles(input: $input) {
			list {
				_id
				articleCategory
				articleStatus
				articleTitle
				articleImages
				articleViews
				articleLikes
				articleComments
				memberId
				createdAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
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
 *         NOTICE         *
 *************************/

export const GET_NOTICES = gql`
	query GetNotices($input: NoticesInquiry!) {
		getNotices(input: $input) {
			list {
				_id
				noticeTitle
				noticeContent
				noticeType
				noticeOrder
				createdAt
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         FOLLOW         *
 *************************/

export const GET_MEMBER_FOLLOWERS = gql`
	query GetMemberFollowers($input: FollowInquiry!) {
		getMemberFollowers(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
				followerData {
					_id
					memberNick
					memberImage
					memberType
					memberFollowers
					memberFollowings
					memberLikes
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MEMBER_FOLLOWINGS = gql`
	query GetMemberFollowings($input: FollowInquiry!) {
		getMemberFollowings(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
				followingData {
					_id
					memberNick
					memberImage
					memberType
					memberFollowers
					memberFollowings
					memberLikes
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *      WATCH / VIEW      *
 *************************/

export const GET_WATCHED_LOTS = gql`
	query GetWatchedLots($input: OrdinaryInquiry!) {
		getWatchedLots(input: $input) {
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
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_VISITED_LOTS = gql`
	query GetVisitedLots($input: OrdinaryInquiry!) {
		getVisitedLots(input: $input) {
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
			}
			metaCounter {
				total
			}
		}
	}
`;

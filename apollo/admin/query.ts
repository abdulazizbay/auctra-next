import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_ALL_MEMBERS_BY_ADMIN = gql`
	query GetAllMembersByAdmin($input: MembersInquiry!) {
		getAllMembersByAdmin(input: $input) {
			list {
				_id
				memberNick
				memberFullName
				memberEmail
				memberPhone
				memberType
				memberStatus
				memberSellerStatus
				memberSellerDocUrl
				memberSellerAppliedAt
				memberImage
				createdAt
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         ARTICLE        *
 *************************/

export const GET_ALL_ARTICLES_BY_ADMIN = gql`
	query GetAllArticlesByAdmin($input: AllArticlesInquiry!) {
		getAllArticlesByAdmin(input: $input) {
			list {
				_id
				articleCategory
				articleStatus
				articleTitle
				articleViews
				articleLikes
				articleComments
				createdAt
				memberData {
					_id
					memberNick
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

export const GET_ALL_NOTICES_BY_ADMIN = gql`
	query GetAllNoticesByAdmin($input: AllNoticesInquiry!) {
		getAllNoticesByAdmin(input: $input) {
			list {
				_id
				noticeTitle
				noticeContent
				noticeType
				noticeStatus
				noticeOrder
				createdAt
			}
			metaCounter {
				total
			}
		}
	}
`;

import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const UPDATE_MEMBER_BY_ADMIN = gql`
	mutation UpdateMemberByAdmin($input: MemberUpdate!) {
		updateMemberByAdmin(input: $input) {
			_id
			memberStatus
		}
	}
`;

export const UPDATE_SELLER_STATUS_BY_ADMIN = gql`
	mutation UpdateSellerStatusByAdmin($input: SellerStatusUpdate!) {
		updateSellerStatusByAdmin(input: $input) {
			_id
			memberType
			memberSellerStatus
		}
	}
`;

/**************************
 *           LOT          *
 *************************/

export const UPDATE_LOT_BY_ADMIN = gql`
	mutation UpdateLotByAdmin($input: LotUpdate!) {
		updateLotByAdmin(input: $input) {
			_id
			lotStatus
		}
	}
`;

/**************************
 *         ARTICLE        *
 *************************/

export const UPDATE_ARTICLE_BY_ADMIN = gql`
	mutation UpdateArticleByAdmin($input: ArticleUpdate!) {
		updateArticleByAdmin(input: $input) {
			_id
			articleStatus
		}
	}
`;

export const REMOVE_ARTICLE_BY_ADMIN = gql`
	mutation RemoveArticleByAdmin($input: String!) {
		removeArticleByAdmin(articleId: $input) {
			_id
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const REMOVE_COMMENT_BY_ADMIN = gql`
	mutation RemoveCommentByAdmin($input: String!) {
		removeCommentByAdmin(commentId: $input) {
			_id
		}
	}
`;

/**************************
 *         NOTICE         *
 *************************/

export const CREATE_NOTICE = gql`
	mutation CreateNotice($input: NoticeInput!) {
		createNotice(input: $input) {
			_id
		}
	}
`;

export const UPDATE_NOTICE_BY_ADMIN = gql`
	mutation UpdateNoticeByAdmin($input: NoticeUpdate!) {
		updateNoticeByAdmin(input: $input) {
			_id
			noticeStatus
		}
	}
`;

export const REMOVE_NOTICE_BY_ADMIN = gql`
	mutation RemoveNoticeByAdmin($input: String!) {
		removeNoticeByAdmin(noticeId: $input) {
			_id
		}
	}
`;

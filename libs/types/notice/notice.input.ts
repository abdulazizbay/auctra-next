import { NoticeStatus, NoticeType } from '../../enums/notice.enum';

export interface NoticeInput {
	noticeTitle: string;
	noticeContent: string;
	noticeType: NoticeType;
	noticeOrder?: number;
}

interface NoticeSearch {
	noticeType?: NoticeType;
}

export interface NoticesInquiry {
	page: number;
	limit: number;
	search: NoticeSearch;
}

interface AllNoticeSearch {
	noticeType?: NoticeType;
	noticeStatus?: NoticeStatus;
}

export interface AllNoticesInquiry {
	page: number;
	limit: number;
	search: AllNoticeSearch;
}

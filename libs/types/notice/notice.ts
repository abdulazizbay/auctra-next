import { NoticeStatus, NoticeType } from '../../enums/notice.enum';
import { TotalCounter } from '../member/member';

export interface Notice {
	_id: string;
	noticeTitle: string;
	noticeContent: string;
	noticeType: NoticeType;
	noticeStatus: NoticeStatus;
	noticeOrder: number;
	createdAt: Date;
	updatedAt: Date;
}

export interface Notices {
	list: Notice[];
	metaCounter?: TotalCounter[];
}

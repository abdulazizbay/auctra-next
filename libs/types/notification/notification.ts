import { NotificationRefType, NotificationType } from '../../enums/notification.enum';
import { TotalCounter } from '../member/member';

export interface NotificationPayload {
	lotName?: string;
	price?: number;
	text?: string;
}

export interface Notification {
	_id: string;
	memberId: string;
	notificationType: NotificationType;
	notificationRefId: string;
	notificationRefType: NotificationRefType;
	notificationPayload?: NotificationPayload;
	notificationReadAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

export interface Notifications {
	list: Notification[];
	metaCounter?: TotalCounter[];
}

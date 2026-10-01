interface NISearch {
	unreadOnly?: boolean;
}

export interface NotificationsInquiry {
	page: number;
	limit: number;
	search: NISearch;
}

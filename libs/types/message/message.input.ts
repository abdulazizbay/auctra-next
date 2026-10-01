export interface MessageInput {
	orderId: string;
	messageText: string;
}

interface MSearch {
	orderId: string;
}

export interface MessagesInquiry {
	page: number;
	limit: number;
	search: MSearch;
}

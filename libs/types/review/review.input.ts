export interface ReviewInput {
	orderId: string;
	reviewRating: number;
	reviewText?: string;
}

interface RISearch {
	sellerId: string;
}

export interface ReviewsInquiry {
	page: number;
	limit: number;
	search: RISearch;
}

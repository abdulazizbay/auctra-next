export interface BidInput {
	lotId: string;
	bidPrice: number;
}

interface BidSearch {
	lotId: string;
}

export interface BidsInquiry {
	page: number;
	limit: number;
	search: BidSearch;
}

export interface MeWatched {
	memberId: string;
	lotId: string;
	myWatch: boolean;
}

export interface Watch {
	_id: string;
	memberId: string;
	lotId: string;
	createdAt: Date;
	updatedAt: Date;
}

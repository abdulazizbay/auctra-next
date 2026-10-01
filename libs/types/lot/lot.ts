import { LotCategory, LotCondition, LotStatus } from '../../enums/lot.enum';
import { TotalCounter } from '../member/member';
import { MeWatched } from '../watch/watch';

export interface Lot {
	_id: string;
	memberId: string;
	lotName: string;
	lotDesc?: string;
	lotImages: string[];
	lotCategory: LotCategory;
	lotCondition: LotCondition;
	lotStatus: LotStatus;
	lotStartPrice: number;
	lotCurrentPrice: number;
	lotCeilingPrice?: number;
	lotMinIncrement: number;
	lotHighestBidderId?: string;
	lotBids: number;
	lotWatchers: number;
	lotViews: number;
	lotComments: number;
	lotShippingNote?: string;
	lotStartsAt: Date;
	lotEndsAt: Date;
	lotClosedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
	meWatched?: MeWatched[];
}

export interface Lots {
	list: Lot[];
	metaCounter?: TotalCounter[];
}

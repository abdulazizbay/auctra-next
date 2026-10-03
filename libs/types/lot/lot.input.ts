import { LotCategory, LotCondition, LotStatus } from '../../enums/lot.enum';
import { Direction } from '../../enums/common.enum';

export interface LotInput {
	lotName: string;
	lotDesc?: string;
	lotImages: string[];
	lotCategory: LotCategory;
	lotCondition: LotCondition;
	lotStartPrice: number;
	lotCeilingPrice?: number;
	lotMinIncrement: number;
	lotShippingNote?: string;
	lotStartsAt?: Date;
	lotEndsAt: Date;
}

interface PricesRange {
	start: number;
	end: number;
}

interface LISearch {
	memberId?: string;
	lotStatusList?: LotStatus[];
	lotCategoryList?: LotCategory[];
	lotConditionList?: LotCondition[];
	pricesRange?: PricesRange;
	text?: string;
}

export interface LotsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: LISearch;
}

export interface OrdinaryInquiry {
	page: number;
	limit: number;
}

import { LotCategory, LotCondition, LotStatus } from '../../enums/lot.enum';

export interface LotUpdate {
	_id: string;
	lotName?: string;
	lotDesc?: string;
	lotImages?: string[];
	lotCategory?: LotCategory;
	lotCondition?: LotCondition;
	lotStartPrice?: number;
	lotCeilingPrice?: number;
	lotMinIncrement?: number;
	lotShippingNote?: string;
	lotStartsAt?: Date;
	lotEndsAt?: Date;
	// only cancelling is allowed; SOLD/UNSOLD are set by the batch
	lotStatus?: LotStatus;
}

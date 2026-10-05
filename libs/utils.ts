import numeral from 'numeral';
import moment from 'moment';
import { sweetMixinErrorAlert } from './sweetAlert';

export const formatterStr = (value: number | undefined): string => {
	return numeral(value).format('0,0') != '0'
		? numeral(value).format('0,0')
		: '';
};

export const countdownText = (target: Date, now: number): string => {
	const diff = Math.max(0, moment(target).valueOf() - now);
	const d = Math.floor(diff / 86400000);
	const h = Math.floor((diff % 86400000) / 3600000);
	const m = Math.floor((diff % 3600000) / 60000);
	const s = Math.floor((diff % 60000) / 1000);
	const pad = (n: number) => String(n).padStart(2, '0');
	return d > 0
		? `${d}d ${pad(h)}h ${pad(m)}m`
		: `${pad(h)}:${pad(m)}:${pad(s)}`;
};

export const watchTargetLotHandler = async (
	watchTargetLot: any,
	id: string,
) => {
	try {
		await watchTargetLot({
			variables: {
				input: id,
			},
		});
	} catch (err: any) {
		console.log('ERROR, watchTargetLotHandler:', err.message);
		sweetMixinErrorAlert(err.message).then();
	}
};

export const likeTargetArticleHandler = async (
	likeTargetArticle: any,
	id: string,
) => {
	try {
		await likeTargetArticle({
			variables: {
				input: id,
			},
		});
	} catch (err: any) {
		console.log('ERROR, likeTargetArticleHandler:', err.message);
		sweetMixinErrorAlert(err.message).then();
	}
};

export const likeTargetMemberHandler = async (
	likeTargetMember: any,
	id: string,
) => {
	try {
		await likeTargetMember({
			variables: {
				input: id,
			},
		});
	} catch (err: any) {
		console.log('ERROR, likeTargetMemberHandler:', err.message);
		sweetMixinErrorAlert(err.message).then();
	}
};

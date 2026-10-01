import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import {
	Checkbox,
	Chip,
	IconButton,
	OutlinedInput,
	Stack,
	Tooltip,
	Typography,
} from '@mui/material';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import RefreshIcon from '@mui/icons-material/Refresh';
import { LotsInquiry } from '../../types/lot/lot.input';
import { LotCategory, LotCondition, LotStatus } from '../../enums/lot.enum';
import { lotPriceMax, lotPriceRanges } from '../../config';
import { formatterStr } from '../../utils';

interface FilterType {
	searchFilter: LotsInquiry;
	setSearchFilter: any;
	initialInput: LotsInquiry;
}

const Filter = (props: FilterType) => {
	const { searchFilter, setSearchFilter, initialInput } = props;
	const router = useRouter();
	const { t } = useTranslation('common');
	const [lotStatus, setLotStatus] = useState<LotStatus[]>([
		LotStatus.OPEN,
		LotStatus.SCHEDULED,
		LotStatus.SOLD,
		LotStatus.UNSOLD,
	]);
	const [lotCategory, setLotCategory] = useState<LotCategory[]>(
		Object.values(LotCategory),
	);
	const [lotCondition, setLotCondition] = useState<LotCondition[]>(
		Object.values(LotCondition),
	);
	const [searchText, setSearchText] = useState<string>('');

	/** LIFECYCLES **/
	useEffect(() => {
		if (searchFilter?.search?.lotCategoryList?.length == 0) {
			delete searchFilter.search.lotCategoryList;
			router
				.push(
					`/lot?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/lot?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}
		if (searchFilter?.search?.lotConditionList?.length == 0) {
			delete searchFilter.search.lotConditionList;
			router
				.push(
					`/lot?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					`/lot?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
						},
					})}`,
					{ scroll: false },
				)
				.then();
		}
	}, [searchFilter]);

	/** HANDLERS **/
	const lotStatusSelectHandler = useCallback(
		async (status: LotStatus) => {
			try {
				await router.push(
					`/lot?input=${JSON.stringify({
						...searchFilter,
						search: { ...searchFilter.search, lotStatus: status },
					})}`,
					`/lot?input=${JSON.stringify({
						...searchFilter,
						search: { ...searchFilter.search, lotStatus: status },
					})}`,
					{ scroll: false },
				);
			} catch (err: any) {
				console.log('ERROR, lotStatusSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const lotCategorySelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/lot?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								lotCategoryList: [
									...(searchFilter?.search?.lotCategoryList || []),
									value,
								],
							},
						})}`,
						`/lot?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								lotCategoryList: [
									...(searchFilter?.search?.lotCategoryList || []),
									value,
								],
							},
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.lotCategoryList?.includes(value)) {
					await router.push(
						`/lot?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								lotCategoryList: searchFilter?.search?.lotCategoryList?.filter(
									(item: string) => item !== value,
								),
							},
						})}`,
						`/lot?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								lotCategoryList: searchFilter?.search?.lotCategoryList?.filter(
									(item: string) => item !== value,
								),
							},
						})}`,
						{ scroll: false },
					);
				}
			} catch (err: any) {
				console.log('ERROR, lotCategorySelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const lotConditionSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;
				if (isChecked) {
					await router.push(
						`/lot?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								lotConditionList: [
									...(searchFilter?.search?.lotConditionList || []),
									value,
								],
							},
						})}`,
						`/lot?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								lotConditionList: [
									...(searchFilter?.search?.lotConditionList || []),
									value,
								],
							},
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.lotConditionList?.includes(value)) {
					await router.push(
						`/lot?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								lotConditionList:
									searchFilter?.search?.lotConditionList?.filter(
										(item: string) => item !== value,
									),
							},
						})}`,
						`/lot?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								lotConditionList:
									searchFilter?.search?.lotConditionList?.filter(
										(item: string) => item !== value,
									),
							},
						})}`,
						{ scroll: false },
					);
				}
			} catch (err: any) {
				console.log('ERROR, lotConditionSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const lotPriceHandler = useCallback(
		async (range: { start: number; end: number }) => {
			try {
				if (
					searchFilter?.search?.pricesRange?.start === range.start &&
					searchFilter?.search?.pricesRange?.end === range.end
				) {
					delete searchFilter?.search.pricesRange;
					setSearchFilter({ ...searchFilter });
					await router.push(
						`/lot?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						`/lot?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
							},
						})}`,
						{ scroll: false },
					);
				} else {
					await router.push(
						`/lot?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, pricesRange: range },
						})}`,
						`/lot?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, pricesRange: range },
						})}`,
						{ scroll: false },
					);
				}
			} catch (err: any) {
				console.log('ERROR, lotPriceHandler:', err);
			}
		},
		[searchFilter],
	);

	const refreshHandler = async () => {
		try {
			setSearchText('');
			await router.push(
				`/lot?input=${JSON.stringify(initialInput)}`,
				`/lot?input=${JSON.stringify(initialInput)}`,
				{ scroll: false },
			);
		} catch (err: any) {
			console.log('ERROR, refreshHandler:', err);
		}
	};

	const priceLabel = (range: { start: number; end: number }) => {
		if (range.start === 0)
			return t('Under {{price}}', { price: `₩${formatterStr(range.end)}` });
		if (range.end === lotPriceMax)
			return t('Over {{price}}', { price: `₩${formatterStr(range.start)}` });
		return `₩${formatterStr(range.start)} – ₩${formatterStr(range.end)}`;
	};

	return (
		<Stack className={'filter-box'}>
			<Typography className={'filter-title'}>{t('Filters')}</Typography>
			<Stack className={'section'}>
				<Stack className={'input-box'}>
					<OutlinedInput
						value={searchText}
						type={'text'}
						className={'search-input'}
						placeholder={t('Search lots')}
						onChange={(e: any) => setSearchText(e.target.value)}
						onKeyDown={(event: any) => {
							if (event.key == 'Enter') {
								setSearchFilter({
									...searchFilter,
									search: { ...searchFilter.search, text: searchText },
								});
							}
						}}
						endAdornment={
							searchText ? (
								<CancelRoundedIcon
									className={'cancel-icon'}
									onClick={() => {
										setSearchText('');
										setSearchFilter({
											...searchFilter,
											search: { ...searchFilter.search, text: '' },
										});
									}}
								/>
							) : null
						}
					/>
					<Tooltip title={t('Reset')}>
						<IconButton onClick={refreshHandler}>
							<RefreshIcon />
						</IconButton>
					</Tooltip>
				</Stack>
			</Stack>

			<Stack className={'section'}>
				<Typography className={'title'}>{t('Status')}</Typography>
				<Stack className={'chips'}>
					{lotStatus.map((status: LotStatus) => (
						<Chip
							key={status}
							label={t(status)}
							color={
								(searchFilter?.search?.lotStatus ?? LotStatus.OPEN) === status
									? 'primary'
									: 'default'
							}
							onClick={() => lotStatusSelectHandler(status)}
						/>
					))}
				</Stack>
			</Stack>

			<Stack className={'section'}>
				<Typography className={'title'}>{t('Category')}</Typography>
				{lotCategory.map((category: string) => (
					<Stack className={'input-box'} key={category}>
						<Checkbox
							id={category}
							size="small"
							value={category}
							checked={(searchFilter?.search?.lotCategoryList || []).includes(
								category as LotCategory,
							)}
							onChange={lotCategorySelectHandler}
						/>
						<label htmlFor={category}>{t(category)}</label>
					</Stack>
				))}
			</Stack>

			<Stack className={'section'}>
				<Typography className={'title'}>{t('Condition')}</Typography>
				{lotCondition.map((condition: string) => (
					<Stack className={'input-box'} key={condition}>
						<Checkbox
							id={condition}
							size="small"
							value={condition}
							checked={(searchFilter?.search?.lotConditionList || []).includes(
								condition as LotCondition,
							)}
							onChange={lotConditionSelectHandler}
						/>
						<label htmlFor={condition}>{t(condition)}</label>
					</Stack>
				))}
			</Stack>

			<Stack className={'section'}>
				<Typography className={'title'}>{t('Price')}</Typography>
				<Stack className={'chips'}>
					{lotPriceRanges.map((range) => (
						<Chip
							key={range.start}
							label={priceLabel(range)}
							color={
								searchFilter?.search?.pricesRange?.start === range.start &&
								searchFilter?.search?.pricesRange?.end === range.end
									? 'primary'
									: 'default'
							}
							onClick={() => lotPriceHandler(range)}
						/>
					))}
				</Stack>
			</Stack>
		</Stack>
	);
};

export default Filter;

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Button, MenuItem, OutlinedInput, Select, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { LotsInquiry } from '../../types/lot/lot.input';
import { LotCategory } from '../../enums/lot.enum';

interface HeaderFilterProps {
	initialInput: LotsInquiry;
}

const HeaderFilter = (props: HeaderFilterProps) => {
	const { initialInput } = props;
	const router = useRouter();
	const { t } = useTranslation('common');
	const [searchFilter, setSearchFilter] = useState<LotsInquiry>(initialInput);

	/** HANDLERS **/
	const lotCategorySelectHandler = (value: string) => {
		if (value) {
			setSearchFilter({
				...searchFilter,
				search: {
					...searchFilter.search,
					lotCategoryList: [value as LotCategory],
				},
			});
		} else {
			delete searchFilter.search.lotCategoryList;
			setSearchFilter({ ...searchFilter });
		}
	};

	const pushSearchHandler = async () => {
		try {
			await router.push(
				`/lot?input=${JSON.stringify(searchFilter)}`,
				`/lot?input=${JSON.stringify(searchFilter)}`,
			);
		} catch (err: any) {
			console.log('ERROR, pushSearchHandler:', err);
		}
	};

	return (
		<Stack className={'search-box'}>
			<OutlinedInput
				className={'search-input'}
				value={searchFilter?.search?.text ?? ''}
				placeholder={t('Search watches, jewellery, art and more')}
				onChange={(e: any) =>
					setSearchFilter({
						...searchFilter,
						search: { ...searchFilter.search, text: e.target.value },
					})
				}
				onKeyDown={(event: any) => {
					if (event.key == 'Enter') pushSearchHandler();
				}}
			/>
			<Select
				className={'category-select'}
				value={searchFilter?.search?.lotCategoryList?.[0] ?? ''}
				displayEmpty
				onChange={(e: any) => lotCategorySelectHandler(e.target.value)}
			>
				<MenuItem value={''}>{t('All categories')}</MenuItem>
				{Object.values(LotCategory).map((category: string) => (
					<MenuItem value={category} key={category}>
						{t(category)}
					</MenuItem>
				))}
			</Select>
			<Button
				className={'search-btn'}
				variant={'contained'}
				startIcon={<SearchIcon />}
				onClick={pushSearchHandler}
			>
				{t('Search')}
			</Button>
		</Stack>
	);
};

HeaderFilter.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default HeaderFilter;

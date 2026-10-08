import React from 'react';
import { Skeleton, Stack } from '@mui/material';

const LotCardSkeleton = () => {
	return (
		<Stack className={'lot-card-skeleton'}>
			<Skeleton variant={'rounded'} className={'image'} />
			<Skeleton variant={'text'} width={'80%'} />
			<Skeleton variant={'text'} width={'50%'} />
			<Skeleton variant={'text'} width={'35%'} height={28} />
		</Stack>
	);
};

export default LotCardSkeleton;

import React, { useState } from 'react';
import moment from 'moment';
import { useTranslation } from 'next-i18next';
import { Box, Pagination, Stack, Typography } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useQuery } from '@apollo/client';
import { Notice as NoticeData } from '../../types/notice/notice';
import { NoticesInquiry } from '../../types/notice/notice.input';
import { T } from '../../types/common';
import { NoticeType } from '../../enums/notice.enum';
import { GET_NOTICES } from '../../../apollo/user/query';

const Notice = ({ initialInput, ...props }: any) => {
	const { t } = useTranslation('common');
	const [searchFilter, setSearchFilter] =
		useState<NoticesInquiry>(initialInput);
	const [notices, setNotices] = useState<NoticeData[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [openId, setOpenId] = useState<string | false>(false);

	/** APOLLO REQUESTS **/
	const {
		loading: getNoticesLoading,
		data: getNoticesData,
		error: getNoticesError,
		refetch: getNoticesRefetch,
	} = useQuery(GET_NOTICES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setNotices(data?.getNotices?.list);
			setTotal(data?.getNotices?.metaCounter[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
		setOpenId(false);
	};

	return (
		<Stack className={'notice-content'}>
			<Box component={'div'} className={'top'}>
				<span>{t('No.')}</span>
				<span>{t('Title')}</span>
				<span>{t('Date')}</span>
			</Box>
			<Stack className={'bottom'}>
				{notices?.length === 0 ? (
					<div className={'no-data'}>{t('No notices yet')}</div>
				) : (
					notices.map((notice: NoticeData, index: number) => (
						<Box
							component={'div'}
							key={notice._id}
							className={`notice-row ${openId === notice._id ? 'open' : ''}`}
						>
							<Box
								component={'div'}
								className={'notice-card'}
								onClick={() =>
									setOpenId(openId === notice._id ? false : notice._id)
								}
							>
								<span className={'notice-number'}>
									{total - (searchFilter.page - 1) * searchFilter.limit - index}
								</span>
								<span className={'notice-title'}>{notice.noticeTitle}</span>
								<span className={'notice-date'}>
									{moment(notice.createdAt).format('YYYY.MM.DD')}
									<KeyboardArrowDownRoundedIcon className={'arrow'} />
								</span>
							</Box>
							{openId === notice._id && (
								<Typography className={'notice-body'}>
									{notice.noticeContent}
								</Typography>
							)}
						</Box>
					))
				)}
			</Stack>
			{total > searchFilter.limit && (
				<Stack className={'pagination-box'}>
					<Pagination
						page={searchFilter.page}
						count={Math.ceil(total / searchFilter.limit)}
						onChange={paginationHandler}
						shape="circular"
						color="primary"
					/>
				</Stack>
			)}
		</Stack>
	);
};

Notice.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		search: { noticeType: NoticeType.NOTICE },
	},
};

export default Notice;

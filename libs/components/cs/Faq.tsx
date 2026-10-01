import React, { SyntheticEvent, useState } from 'react';
import { useTranslation } from 'next-i18next';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
	AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import {
	AccordionDetails,
	Box,
	Pagination,
	Stack,
	Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useQuery } from '@apollo/client';
import { Notice } from '../../types/notice/notice';
import { NoticesInquiry } from '../../types/notice/notice.input';
import { T } from '../../types/common';
import { NoticeType } from '../../enums/notice.enum';
import { GET_NOTICES } from '../../../apollo/user/query';

const Accordion = styled((props: AccordionProps) => (
	<MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
	border: `1px solid ${theme.palette.divider}`,
	'&:not(:last-child)': {
		borderBottom: 0,
	},
	'&:before': {
		display: 'none',
	},
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
	<MuiAccordionSummary
		expandIcon={<KeyboardArrowDownRoundedIcon sx={{ fontSize: '1.4rem' }} />}
		{...props}
	/>
))(({ theme }) => ({
	backgroundColor: '#fff',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(180deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
}));

const Faq = ({ initialInput, ...props }: any) => {
	const { t } = useTranslation('common');
	const [searchFilter, setSearchFilter] =
		useState<NoticesInquiry>(initialInput);
	const [faqs, setFaqs] = useState<Notice[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [expanded, setExpanded] = useState<string | false>(false);

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
			setFaqs(data?.getNotices?.list);
			setTotal(data?.getNotices?.metaCounter[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const handleChange =
		(panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
			setExpanded(newExpanded ? panel : false);
		};

	const paginationHandler = (e: T, value: number) => {
		setSearchFilter({ ...searchFilter, page: value });
		setExpanded(false);
	};

	return (
		<Stack className={'faq-content'}>
			<Box className={'wrap'} component={'div'}>
				{faqs?.length === 0 ? (
					<div className={'no-data'}>{t('No FAQs yet')}</div>
				) : (
					faqs.map((faq: Notice) => (
						<Accordion
							expanded={expanded === faq._id}
							onChange={handleChange(faq._id)}
							key={faq._id}
						>
							<AccordionSummary className="question">
								<Typography className="badge">Q</Typography>
								<Typography className="subject">{faq.noticeTitle}</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Stack className={'answer'}>
									<Typography className="badge answer-badge">A</Typography>
									<Typography className="answer-text">
										{faq.noticeContent}
									</Typography>
								</Stack>
							</AccordionDetails>
						</Accordion>
					))
				)}
			</Box>
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

Faq.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		search: { noticeType: NoticeType.FAQ },
	},
};

export default Faq;

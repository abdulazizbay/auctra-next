import React, { useState } from 'react';
import { NextPage } from 'next';
import moment from 'moment';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMutation, useQuery } from '@apollo/client';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Stack,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	Tabs,
	TextField,
} from '@mui/material';
import withLayoutAdmin from '../../../libs/components/layout/LayoutAdmin';
import { GET_ALL_NOTICES_BY_ADMIN } from '../../../apollo/admin/query';
import {
	CREATE_NOTICE,
	REMOVE_NOTICE_BY_ADMIN,
	UPDATE_NOTICE_BY_ADMIN,
} from '../../../apollo/admin/mutation';
import { Notice } from '../../../libs/types/notice/notice';
import { AllNoticesInquiry } from '../../../libs/types/notice/notice.input';
import { NoticeStatus, NoticeType } from '../../../libs/enums/notice.enum';
import { T } from '../../../libs/types/common';
import {
	sweetConfirmAlert,
	sweetMixinErrorAlert,
	sweetTopSmallSuccessAlert,
} from '../../../libs/sweetAlert';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

interface NoticeForm {
	_id?: string;
	noticeTitle: string;
	noticeContent: string;
	noticeOrder: number;
}

const AdminCs: NextPage = ({ initialInput, ...props }: any) => {
	const [searchFilter, setSearchFilter] =
		useState<AllNoticesInquiry>(initialInput);
	const [notices, setNotices] = useState<Notice[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [form, setForm] = useState<NoticeForm | null>(null);
	const noticeType = searchFilter.search.noticeType as NoticeType;

	/** APOLLO REQUESTS **/
	const [createNotice] = useMutation(CREATE_NOTICE);
	const [updateNoticeByAdmin] = useMutation(UPDATE_NOTICE_BY_ADMIN);
	const [removeNoticeByAdmin] = useMutation(REMOVE_NOTICE_BY_ADMIN);

	const { refetch: getNoticesRefetch } = useQuery(GET_ALL_NOTICES_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setNotices(data?.getAllNoticesByAdmin?.list ?? []);
			setTotal(data?.getAllNoticesByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const tabChangeHandler = (e: T, value: NoticeType) => {
		setSearchFilter({
			...searchFilter,
			page: 1,
			search: { noticeType: value },
		});
	};

	const saveHandler = async () => {
		try {
			if (!form?.noticeTitle.trim() || !form?.noticeContent.trim()) return;
			const { _id, ...input } = form;
			if (_id) {
				await updateNoticeByAdmin({ variables: { input: { _id, ...input } } });
			} else {
				await createNotice({ variables: { input: { ...input, noticeType } } });
			}
			setForm(null);
			await getNoticesRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('Saved', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const toggleStatusHandler = async (notice: Notice) => {
		try {
			const noticeStatus =
				notice.noticeStatus === NoticeStatus.ACTIVE
					? NoticeStatus.HIDDEN
					: NoticeStatus.ACTIVE;
			await updateNoticeByAdmin({
				variables: { input: { _id: notice._id, noticeStatus } },
			});
			await getNoticesRefetch({ input: searchFilter });
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const removeHandler = async (notice: Notice) => {
		try {
			const confirmed = await sweetConfirmAlert(
				`Permanently remove "${notice.noticeTitle}"?`,
			);
			if (!confirmed) return;
			await removeNoticeByAdmin({ variables: { input: notice._id } });
			await getNoticesRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('Removed', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	return (
		<Stack className={'admin-page'}>
			<Stack className={'admin-filter'}>
				<Tabs value={noticeType} onChange={tabChangeHandler}>
					<Tab value={NoticeType.NOTICE} label={'Notices'} />
					<Tab value={NoticeType.FAQ} label={'FAQ'} />
				</Tabs>
				<Button
					variant={'contained'}
					onClick={() =>
						setForm({ noticeTitle: '', noticeContent: '', noticeOrder: 0 })
					}
				>
					New {noticeType === NoticeType.FAQ ? 'FAQ' : 'notice'}
				</Button>
			</Stack>

			<TableContainer className={'admin-table'}>
				<Table size={'small'}>
					<TableHead>
						<TableRow>
							<TableCell>Order</TableCell>
							<TableCell>Title</TableCell>
							<TableCell>Created</TableCell>
							<TableCell>Status</TableCell>
							<TableCell align={'right'}>Action</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{notices.map((notice) => (
							<TableRow key={notice._id}>
								<TableCell>{notice.noticeOrder}</TableCell>
								<TableCell>{notice.noticeTitle}</TableCell>
								<TableCell>
									{moment(notice.createdAt).format('YYYY.MM.DD')}
								</TableCell>
								<TableCell>{notice.noticeStatus}</TableCell>
								<TableCell align={'right'} className={'actions'}>
									<Button
										size={'small'}
										onClick={() =>
											setForm({
												_id: notice._id,
												noticeTitle: notice.noticeTitle,
												noticeContent: notice.noticeContent,
												noticeOrder: notice.noticeOrder,
											})
										}
									>
										Edit
									</Button>
									<Button
										size={'small'}
										onClick={() => toggleStatusHandler(notice)}
									>
										{notice.noticeStatus === NoticeStatus.ACTIVE
											? 'Hide'
											: 'Show'}
									</Button>
									<Button
										size={'small'}
										color={'error'}
										onClick={() => removeHandler(notice)}
									>
										Remove
									</Button>
								</TableCell>
							</TableRow>
						))}
						{notices.length === 0 && (
							<TableRow>
								<TableCell colSpan={5} align={'center'}>
									Nothing here yet
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				component={'div'}
				count={total}
				page={searchFilter.page - 1}
				rowsPerPage={searchFilter.limit}
				rowsPerPageOptions={[]}
				onPageChange={(e, page) =>
					setSearchFilter({ ...searchFilter, page: page + 1 })
				}
			/>

			<Dialog
				open={!!form}
				onClose={() => setForm(null)}
				fullWidth
				maxWidth={'sm'}
			>
				<DialogTitle>
					{form?._id ? 'Edit' : 'New'}{' '}
					{noticeType === NoticeType.FAQ ? 'FAQ' : 'notice'}
				</DialogTitle>
				{form && (
					<DialogContent className={'admin-form'}>
						<TextField
							label={noticeType === NoticeType.FAQ ? 'Question' : 'Title'}
							value={form.noticeTitle}
							onChange={(e) =>
								setForm({ ...form, noticeTitle: e.target.value })
							}
						/>
						<TextField
							label={noticeType === NoticeType.FAQ ? 'Answer' : 'Content'}
							multiline
							minRows={5}
							value={form.noticeContent}
							onChange={(e) =>
								setForm({ ...form, noticeContent: e.target.value })
							}
						/>
						<TextField
							label={'Order'}
							type={'number'}
							value={form.noticeOrder}
							onChange={(e) =>
								setForm({ ...form, noticeOrder: Number(e.target.value) })
							}
						/>
					</DialogContent>
				)}
				<DialogActions>
					<Button onClick={() => setForm(null)}>Cancel</Button>
					<Button
						variant={'contained'}
						disabled={!form?.noticeTitle.trim() || !form?.noticeContent.trim()}
						onClick={saveHandler}
					>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</Stack>
	);
};

AdminCs.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		search: { noticeType: NoticeType.NOTICE },
	},
};

export default withLayoutAdmin(AdminCs);

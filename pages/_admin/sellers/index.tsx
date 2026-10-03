import React, { useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
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
} from '@mui/material';
import withLayoutAdmin from '../../../libs/components/layout/LayoutAdmin';
import { GET_ALL_MEMBERS_BY_ADMIN } from '../../../apollo/admin/query';
import { UPDATE_SELLER_STATUS_BY_ADMIN } from '../../../apollo/admin/mutation';
import { Member } from '../../../libs/types/member/member';
import { MembersInquiry } from '../../../libs/types/member/member.input';
import { MemberSellerStatus } from '../../../libs/enums/member.enum';
import { Direction } from '../../../libs/enums/common.enum';
import { T } from '../../../libs/types/common';
import { REACT_APP_API_URL } from '../../../libs/config';
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

const AdminSellers: NextPage = ({ initialInput, ...props }: any) => {
	const [searchFilter, setSearchFilter] =
		useState<MembersInquiry>(initialInput);
	const [members, setMembers] = useState<Member[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [docMember, setDocMember] = useState<Member | null>(null);

	/** APOLLO REQUESTS **/
	const [updateSellerStatusByAdmin] = useMutation(
		UPDATE_SELLER_STATUS_BY_ADMIN,
	);

	const { refetch: getMembersRefetch } = useQuery(GET_ALL_MEMBERS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setMembers(data?.getAllMembersByAdmin?.list ?? []);
			setTotal(data?.getAllMembersByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	/** HANDLERS **/
	const imagePath = (image?: string) => {
		if (!image) return '';
		return image.startsWith('http') ? image : `${REACT_APP_API_URL}/${image}`;
	};

	const tabChangeHandler = (e: T, value: MemberSellerStatus) => {
		setSearchFilter({
			...searchFilter,
			page: 1,
			search: { memberSellerStatus: value },
		});
	};

	const reviewHandler = async (member: Member, status: MemberSellerStatus) => {
		try {
			const confirmed = await sweetConfirmAlert(
				`${status === MemberSellerStatus.APPROVED ? 'Approve' : 'Reject'} ${
					member.memberNick
				}?`,
			);
			if (!confirmed) return;
			await updateSellerStatusByAdmin({
				variables: { input: { _id: member._id, memberSellerStatus: status } },
			});
			setDocMember(null);
			await getMembersRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('Updated', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const isPending =
		searchFilter.search.memberSellerStatus === MemberSellerStatus.PENDING;

	return (
		<Stack className={'admin-page'}>
			<Stack className={'admin-filter'}>
				<Tabs
					value={searchFilter.search.memberSellerStatus}
					onChange={tabChangeHandler}
				>
					<Tab value={MemberSellerStatus.PENDING} label={'Pending'} />
					<Tab value={MemberSellerStatus.APPROVED} label={'Approved'} />
					<Tab value={MemberSellerStatus.REJECTED} label={'Rejected'} />
				</Tabs>
			</Stack>

			<TableContainer className={'admin-table'}>
				<Table size={'small'}>
					<TableHead>
						<TableRow>
							<TableCell>Nick</TableCell>
							<TableCell>Full name</TableCell>
							<TableCell>Email</TableCell>
							<TableCell>Applied</TableCell>
							<TableCell>Document</TableCell>
							{isPending && <TableCell align={'right'}>Action</TableCell>}
						</TableRow>
					</TableHead>
					<TableBody>
						{members.map((member) => (
							<TableRow key={member._id}>
								<TableCell>
									<Link href={`/member?memberId=${member._id}`}>
										{member.memberNick}
									</Link>
								</TableCell>
								<TableCell>{member.memberFullName}</TableCell>
								<TableCell>{member.memberEmail}</TableCell>
								<TableCell>
									{member.memberSellerAppliedAt &&
										moment(member.memberSellerAppliedAt).format(
											'YYYY.MM.DD HH:mm',
										)}
								</TableCell>
								<TableCell>
									<Button
										size={'small'}
										disabled={!member.memberSellerDocUrl}
										onClick={() => setDocMember(member)}
									>
										View
									</Button>
								</TableCell>
								{isPending && (
									<TableCell align={'right'} className={'actions'}>
										<Button
											size={'small'}
											variant={'contained'}
											onClick={() =>
												reviewHandler(member, MemberSellerStatus.APPROVED)
											}
										>
											Approve
										</Button>
										<Button
											size={'small'}
											color={'error'}
											onClick={() =>
												reviewHandler(member, MemberSellerStatus.REJECTED)
											}
										>
											Reject
										</Button>
									</TableCell>
								)}
							</TableRow>
						))}
						{members.length === 0 && (
							<TableRow>
								<TableCell colSpan={6} align={'center'}>
									No applications found
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
				open={!!docMember}
				onClose={() => setDocMember(null)}
				maxWidth={'md'}
			>
				<DialogTitle>{docMember?.memberNick} — seller document</DialogTitle>
				<DialogContent>
					<img
						className={'admin-doc'}
						src={imagePath(docMember?.memberSellerDocUrl)}
						alt={'seller document'}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDocMember(null)}>Close</Button>
					{docMember?.memberSellerStatus === MemberSellerStatus.PENDING && (
						<>
							<Button
								color={'error'}
								onClick={() =>
									reviewHandler(docMember, MemberSellerStatus.REJECTED)
								}
							>
								Reject
							</Button>
							<Button
								variant={'contained'}
								onClick={() =>
									reviewHandler(docMember, MemberSellerStatus.APPROVED)
								}
							>
								Approve
							</Button>
						</>
					)}
				</DialogActions>
			</Dialog>
		</Stack>
	);
};

AdminSellers.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'memberSellerAppliedAt',
		direction: Direction.DESC,
		search: { memberSellerStatus: MemberSellerStatus.PENDING },
	},
};

export default withLayoutAdmin(AdminSellers);

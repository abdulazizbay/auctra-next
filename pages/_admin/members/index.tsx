import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import moment from 'moment';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMutation, useQuery } from '@apollo/client';
import {
	MenuItem,
	Select,
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
import { GET_ALL_MEMBERS_BY_ADMIN } from '../../../apollo/admin/query';
import { UPDATE_MEMBER_BY_ADMIN } from '../../../apollo/admin/mutation';
import { Member } from '../../../libs/types/member/member';
import { MembersInquiry } from '../../../libs/types/member/member.input';
import { MemberStatus, MemberType } from '../../../libs/enums/member.enum';
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

const AdminMembers: NextPage = ({ initialInput, ...props }: any) => {
	const [searchFilter, setSearchFilter] =
		useState<MembersInquiry>(initialInput);
	const [members, setMembers] = useState<Member[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchText, setSearchText] = useState<string>('');

	/** APOLLO REQUESTS **/
	const [updateMemberByAdmin] = useMutation(UPDATE_MEMBER_BY_ADMIN);

	const { refetch: getMembersRefetch } = useQuery(GET_ALL_MEMBERS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setMembers(data?.getAllMembersByAdmin?.list ?? []);
			setTotal(data?.getAllMembersByAdmin?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (searchText === (searchFilter.search.text ?? '')) return;
		const timer = setTimeout(
			() =>
				setSearchFilter({
					...searchFilter,
					page: 1,
					search: { ...searchFilter.search, text: searchText || undefined },
				}),
			400,
		);
		return () => clearTimeout(timer);
	}, [searchText]);

	/** HANDLERS **/
	const typeChangeHandler = (e: T, value: string) => {
		setSearchFilter({
			...searchFilter,
			page: 1,
			search: {
				...searchFilter.search,
				memberType: (value || undefined) as MemberType,
			},
		});
	};

	const statusChangeHandler = async (member: Member, status: MemberStatus) => {
		try {
			const confirmed = await sweetConfirmAlert(
				`${status === MemberStatus.BLOCK ? 'Block' : 'Unblock'} ${
					member.memberNick
				}?`,
			);
			if (!confirmed) return;
			await updateMemberByAdmin({
				variables: { input: { _id: member._id, memberStatus: status } },
			});
			await getMembersRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('Updated', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	return (
		<Stack className={'admin-page'}>
			<Stack className={'admin-filter'}>
				<Tabs
					value={searchFilter.search.memberType ?? ''}
					onChange={typeChangeHandler}
				>
					<Tab value={''} label={'All'} />
					<Tab value={MemberType.USER} label={'Users'} />
					<Tab value={MemberType.SELLER} label={'Sellers'} />
					<Tab value={MemberType.ADMIN} label={'Admins'} />
				</Tabs>
				<TextField
					size={'small'}
					placeholder={'Search nick'}
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
				/>
			</Stack>

			<TableContainer className={'admin-table'}>
				<Table size={'small'}>
					<TableHead>
						<TableRow>
							<TableCell>Nick</TableCell>
							<TableCell>Email</TableCell>
							<TableCell>Phone</TableCell>
							<TableCell>Type</TableCell>
							<TableCell>Seller</TableCell>
							<TableCell>Joined</TableCell>
							<TableCell>Status</TableCell>
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
								<TableCell>{member.memberEmail}</TableCell>
								<TableCell>{member.memberPhone}</TableCell>
								<TableCell>{member.memberType}</TableCell>
								<TableCell>{member.memberSellerStatus}</TableCell>
								<TableCell>
									{moment(member.createdAt).format('YYYY.MM.DD')}
								</TableCell>
								<TableCell>
									<Select
										size={'small'}
										value={member.memberStatus}
										disabled={member.memberType === MemberType.ADMIN}
										onChange={(e) =>
											statusChangeHandler(
												member,
												e.target.value as MemberStatus,
											)
										}
									>
										<MenuItem value={MemberStatus.ACTIVE}>ACTIVE</MenuItem>
										<MenuItem value={MemberStatus.BLOCK}>BLOCK</MenuItem>
										{member.memberStatus === MemberStatus.DELETE && (
											<MenuItem value={MemberStatus.DELETE} disabled>
												DELETE
											</MenuItem>
										)}
									</Select>
								</TableCell>
							</TableRow>
						))}
						{members.length === 0 && (
							<TableRow>
								<TableCell colSpan={7} align={'center'}>
									No members found
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
		</Stack>
	);
};

AdminMembers.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		search: {},
	},
};

export default withLayoutAdmin(AdminMembers);

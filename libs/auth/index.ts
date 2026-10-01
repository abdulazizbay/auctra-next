import { initializeApollo } from '../../apollo/client';
import { userVar } from '../../apollo/store';
import { LOGIN, SIGN_UP } from '../../apollo/user/mutation';
import { GET_ME } from '../../apollo/user/query';
import { Member } from '../types/member/member';
import { Message } from '../enums/common.enum';

export function getJwtToken(): any {
	if (typeof window !== 'undefined') {
		return localStorage.getItem('accessToken') ?? '';
	}
}

export function setJwtToken(token: string) {
	localStorage.setItem('accessToken', token);
}

export const logIn = async (nick: string, password: string): Promise<void> => {
	const { jwtToken, member } = await requestJwtToken({ nick, password });

	if (jwtToken) {
		updateStorage({ jwtToken });
		updateUserInfo(member);
	}
};

const requestJwtToken = async ({
	nick,
	password,
}: {
	nick: string;
	password: string;
}): Promise<{ jwtToken: string; member: Member }> => {
	const apolloClient = await initializeApollo();

	const result = await apolloClient.mutate({
		mutation: LOGIN,
		variables: { input: { memberNick: nick, memberPassword: password } },
		fetchPolicy: 'network-only',
	});

	const { accessToken, member } = result?.data?.login;
	return { jwtToken: accessToken, member };
};

export const signUp = async (
	nick: string,
	password: string,
	phone: string,
): Promise<void> => {
	const { jwtToken, member } = await requestSignUpJwtToken({
		nick,
		password,
		phone,
	});

	if (jwtToken) {
		updateStorage({ jwtToken });
		updateUserInfo(member);
	}
};

const requestSignUpJwtToken = async ({
	nick,
	password,
	phone,
}: {
	nick: string;
	password: string;
	phone: string;
}): Promise<{ jwtToken: string; member: Member }> => {
	const apolloClient = await initializeApollo();

	const result = await apolloClient.mutate({
		mutation: SIGN_UP,
		variables: {
			input: { memberNick: nick, memberPassword: password, memberPhone: phone },
		},
		fetchPolicy: 'network-only',
	});

	const { accessToken, member } = result?.data?.signup;
	return { jwtToken: accessToken, member };
};

export const requestUserInfo = async () => {
	const apolloClient = await initializeApollo();

	try {
		const result = await apolloClient.query({
			query: GET_ME,
			fetchPolicy: 'network-only',
		});
		updateUserInfo(result?.data?.getMe);
	} catch (err: any) {
		console.warn('getMe err', err.message);
		if (err?.graphQLErrors?.[0]?.message === Message.NOT_AUTHENTICATED)
			logOut();
	}
};

export const updateStorage = ({ jwtToken }: { jwtToken: any }) => {
	setJwtToken(jwtToken);
	window.localStorage.setItem('login', Date.now().toString());
};

export const updateUserInfo = (member: Member) => {
	if (!member) return false;

	userVar({
		_id: member._id ?? '',
		memberNick: member.memberNick ?? '',
		memberPhone: member.memberPhone ?? '',
		memberEmail: member.memberEmail ?? '',
		memberType: member.memberType ?? '',
		memberStatus: member.memberStatus ?? '',
		memberSellerStatus: member.memberSellerStatus ?? '',
		memberImage: member.memberImage ?? '',
		memberFullName: member.memberFullName ?? '',
		memberBio: member.memberBio ?? '',
		memberLocation: member.memberLocation ?? '',
		memberAddress: member.memberAddress ?? '',
		memberAvgRating: member.memberAvgRating ?? 0,
		memberReviewCount: member.memberReviewCount ?? 0,
		memberSalesCount: member.memberSalesCount ?? 0,
		memberFollowers: member.memberFollowers ?? 0,
		memberFollowings: member.memberFollowings ?? 0,
		memberLikes: member.memberLikes ?? 0,
		memberViews: member.memberViews ?? 0,
	});
};

export const logOut = () => {
	deleteStorage();
	deleteUserInfo();
	window.location.reload();
};

const deleteStorage = () => {
	localStorage.removeItem('accessToken');
	window.localStorage.setItem('logout', Date.now().toString());
};

const deleteUserInfo = () => {
	userVar({
		_id: '',
		memberNick: '',
		memberPhone: '',
		memberEmail: '',
		memberType: '',
		memberStatus: '',
		memberSellerStatus: '',
		memberImage: '',
		memberFullName: '',
		memberBio: '',
		memberLocation: '',
		memberAddress: '',
		memberAvgRating: 0,
		memberReviewCount: 0,
		memberSalesCount: 0,
		memberFollowers: 0,
		memberFollowings: 0,
		memberLikes: 0,
		memberViews: 0,
	});
};

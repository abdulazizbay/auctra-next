import { useEffect } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

const AdminHome: NextPage = () => {
	const router = useRouter();

	useEffect(() => {
		router.replace('/_admin/members').then();
	}, []);

	return null;
};

export default AdminHome;

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import GavelStrike from './common/GavelStrike';

const pathOf = (url: string) =>
	url.split('?')[0].replace(/^\/kr(?=\/|$)/, '') || '/';

const RouteLoader = () => {
	const router = useRouter();
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		let timer: ReturnType<typeof setTimeout>;

		const start = (url: string, { shallow }: { shallow: boolean }) => {
			if (shallow || pathOf(url) === pathOf(window.location.pathname)) return;
			timer = setTimeout(() => setLoading(true), 250);
		};
		const end = () => {
			clearTimeout(timer);
			setLoading(false);
		};

		router.events.on('routeChangeStart', start);
		router.events.on('routeChangeComplete', end);
		router.events.on('routeChangeError', end);
		return () => {
			clearTimeout(timer);
			router.events.off('routeChangeStart', start);
			router.events.off('routeChangeComplete', end);
			router.events.off('routeChangeError', end);
		};
	}, []);

	if (!loading) return null;

	return (
		<div className={'route-loader'}>
			<GavelStrike />
		</div>
	);
};

export default RouteLoader;

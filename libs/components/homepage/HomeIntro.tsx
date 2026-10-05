import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import GavelStrike from '../common/GavelStrike';

const HomeIntro = () => {
	const { t } = useTranslation('common');
	const [show, setShow] = useState<boolean>(true);

	useEffect(() => {
		try {
			if (sessionStorage.getItem('auctraIntro')) return setShow(false);
			sessionStorage.setItem('auctraIntro', '1');
		} catch (err) {}
		const timer = setTimeout(() => setShow(false), 2000);
		return () => clearTimeout(timer);
	}, []);

	if (!show) return null;

	return (
		<div className={'home-intro'} onClick={() => setShow(false)}>
			<GavelStrike />
			<span className={'intro-logo'}>
				AUCTRA<em>.</em>
			</span>
			<span className={'intro-sub'}>
				<span className={'live-dot'} />
				{t('Live auctions')}
			</span>
		</div>
	);
};

export default HomeIntro;

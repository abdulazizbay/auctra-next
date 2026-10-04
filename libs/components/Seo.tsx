import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SITE_URL } from '../config';

interface SeoProps {
	title?: string;
	description?: string;
	image?: string;
}

const defaultDescription =
	'Live auctions for luxury watches, jewellery, art and collectibles. Bid in real time on lots from verified sellers on Auctra.';

const Seo = (props: SeoProps) => {
	const { title, description, image } = props;
	const router = useRouter();
	const fullTitle = title
		? `${title} | Auctra`
		: 'Auctra | Live auctions for watches, jewellery, art and collectibles';
	const desc = description?.slice(0, 160) || defaultDescription;
	const imageUrl = !image
		? `${SITE_URL}/og-image.png`
		: image.startsWith('http')
		? image
		: `${SITE_URL}/${image.replace(/^\//, '')}`;

	return (
		<Head>
			<title>{fullTitle}</title>
			<meta key="robots" name="robots" content="index,follow" />
			<meta key="description" name="description" content={desc} />
			<meta key="og:title" property="og:title" content={fullTitle} />
			<meta key="og:description" property="og:description" content={desc} />
			<meta key="og:image" property="og:image" content={imageUrl} />
			<meta
				key="og:url"
				property="og:url"
				content={`${SITE_URL}${router.asPath}`}
			/>
			<meta key="twitter:title" name="twitter:title" content={fullTitle} />
			<meta
				key="twitter:description"
				name="twitter:description"
				content={desc}
			/>
			<meta key="twitter:image" name="twitter:image" content={imageUrl} />
		</Head>
	);
};

export default Seo;

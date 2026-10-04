import {
	Html,
	Head,
	Main,
	NextScript,
	DocumentContext,
	DocumentProps,
} from 'next/document';
import {
	DocumentHeadTags,
	DocumentHeadTagsProps,
	documentGetInitialProps,
} from '@mui/material-nextjs/v14-pagesRouter';

const Document = (props: DocumentProps & DocumentHeadTagsProps) => {
	return (
		<Html lang="en">
			<Head>
				<DocumentHeadTags {...props} />
				<link rel="icon" href="/favicon.ico" sizes="any" />
				<link rel="icon" type="image/png" href="/icon-512.png" />
				<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
				<meta name="theme-color" content="#0F2742" />
				<meta
					name="keywords"
					content={
						'auctra, live auction, luxury watches, jewellery, art, coins, collectibles, live bidding'
					}
				/>
				<meta property="og:site_name" content="Auctra" />
				<meta property="og:type" content="website" />
				<meta name="twitter:card" content="summary_large_image" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
};

Document.getInitialProps = async (ctx: DocumentContext) => {
	return documentGetInitialProps(ctx);
};

export default Document;

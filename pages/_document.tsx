import { Html, Head, Main, NextScript, DocumentContext, DocumentProps } from 'next/document';
import { DocumentHeadTags, DocumentHeadTagsProps, documentGetInitialProps } from '@mui/material-nextjs/v14-pagesRouter';

const Document = (props: DocumentProps & DocumentHeadTagsProps) => {
	return (
		<Html lang="en">
			<Head>
				<DocumentHeadTags {...props} />
				<meta name="robots" content="index,follow" />

				{/* SEO */}
				<meta name="keyword" content={'auctra, watch auction, luxury watches, pre-owned watches, live bidding'} />
				<meta
					name={'description'}
					content={
						'Live auctions for pre-owned luxury watches. Bid in real time on lots from verified sellers on Auctra.'
					}
				/>
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

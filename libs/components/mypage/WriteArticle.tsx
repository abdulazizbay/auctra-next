import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Stack, Typography } from '@mui/material';

const TEditor = dynamic(() => import('../community/TEditor'), { ssr: false });

const WriteArticle = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const articleId = router.query.articleId as string | undefined;

	return (
		<div id="write-article-page">
			<Stack className="main-title-box">
				<Typography className="main-title">
					{t(articleId ? 'Edit Article' : 'Write an Article')}
				</Typography>
				<Typography className="sub-title">
					{t('Share your knowledge with other collectors')}
				</Typography>
			</Stack>
			<TEditor key={articleId ?? 'new'} />
		</div>
	);
};

export default WriteArticle;

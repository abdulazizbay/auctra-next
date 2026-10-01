import React from 'react';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from '@toast-ui/react-editor';
import { Box } from '@mui/material';

const TViewer = (props: { markdown: string }) => {
	return (
		<Box component={'div'} className={'article-viewer'}>
			<Viewer initialValue={props.markdown} />
		</Box>
	);
};

export default TViewer;

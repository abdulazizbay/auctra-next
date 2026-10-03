import React from 'react';
import { useRouter } from 'next/router';
import Moment from 'react-moment';
import { useReactiveVar } from '@apollo/client';
import { Avatar, IconButton, Stack, Typography } from '@mui/material';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { Comment } from '../../types/comment/comment';
import { REACT_APP_API_URL } from '../../config';
import { userVar } from '../../../apollo/store';

interface LotCommentProps {
	comment: Comment;
	removeHandler?: (commentId: string) => void;
}

const LotComment = (props: LotCommentProps) => {
	const { comment, removeHandler } = props;
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const image = comment?.memberData?.memberImage;
	const imagePath: string = !image
		? ''
		: image.startsWith('http')
		? image
		: `${REACT_APP_API_URL}/${image}`;

	/** HANDLERS **/
	const goMemberPage = (id: string) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	return (
		<Stack className={'review-config'}>
			<Stack className={'img-name-box'}>
				<Avatar src={imagePath || undefined} className={'img-box'}>
					{comment?.memberData?.memberNick?.[0]?.toUpperCase()}
				</Avatar>
				<Stack>
					<Typography
						className={'name'}
						onClick={() => goMemberPage(comment?.memberData?._id as string)}
					>
						{comment?.memberData?.memberNick}
					</Typography>
					<Typography className={'date'}>
						<Moment format={'DD MMMM, YYYY'}>{comment.createdAt}</Moment>
					</Typography>
				</Stack>
				{removeHandler && (
					<IconButton
						size={'small'}
						className={'remove-btn'}
						onClick={() => removeHandler(comment._id)}
					>
						<DeleteOutlineRoundedIcon />
					</IconButton>
				)}
			</Stack>
			<Typography className={'description'}>{comment.commentText}</Typography>
		</Stack>
	);
};

export default LotComment;

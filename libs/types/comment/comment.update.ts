import { CommentStatus } from '../../enums/comment.enum';

export interface CommentUpdate {
	_id: string;
	commentStatus?: CommentStatus;
	commentText?: string;
}

import { ArticleCategory, ArticleStatus } from '../../enums/article.enum';
import { Member, TotalCounter } from '../member/member';
import { MeLiked } from '../like/like';

export interface Article {
	_id: string;
	articleCategory: ArticleCategory;
	articleStatus: ArticleStatus;
	articleTitle: string;
	articleContent: string;
	articleImages: string[];
	lotId?: string;
	articleViews: number;
	articleLikes: number;
	articleComments: number;
	memberId: string;
	createdAt: Date;
	updatedAt: Date;
	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface Articles {
	list: Article[];
	metaCounter?: TotalCounter[];
}

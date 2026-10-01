import { ArticleCategory, ArticleStatus } from '../../enums/article.enum';
import { Direction } from '../../enums/common.enum';

export interface ArticleInput {
	articleCategory: ArticleCategory;
	articleTitle: string;
	articleContent: string;
	articleImages?: string[];
	lotId?: string;
}

interface AISearch {
	articleCategory?: ArticleCategory;
	text?: string;
	memberId?: string;
	lotId?: string;
}

export interface ArticlesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: AISearch;
}

interface AAISearch {
	articleStatus?: ArticleStatus;
	articleCategory?: ArticleCategory;
}

export interface AllArticlesInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: AAISearch;
}

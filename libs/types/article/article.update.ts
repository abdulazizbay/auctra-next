import { ArticleStatus } from '../../enums/article.enum';

export interface ArticleUpdate {
	_id: string;
	articleStatus?: ArticleStatus;
	articleTitle?: string;
	articleContent?: string;
	articleImages?: string[];
}

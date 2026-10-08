import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import axios from 'axios';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import {
	Autocomplete,
	Button,
	CircularProgress,
	MenuItem,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Lot } from '../../types/lot/lot';
import { LotsInquiry } from '../../types/lot/lot.input';
import { T } from '../../types/common';
import { ArticleCategory } from '../../enums/article.enum';
import { publicLotStatuses } from '../../enums/lot.enum';
import { Direction, Message } from '../../enums/common.enum';
import { REACT_APP_API_URL } from '../../config';
import { getJwtToken } from '../../auth';
import { userVar } from '../../../apollo/store';
import { CREATE_ARTICLE, UPDATE_ARTICLE } from '../../../apollo/user/mutation';
import { GET_ARTICLE, GET_LOT, GET_LOTS } from '../../../apollo/user/query';
import { sweetMixinErrorAlert, sweetTopSuccessAlert } from '../../sweetAlert';

const imagePath = (image?: string) =>
	!image
		? ''
		: image.startsWith('http')
		? image
		: `${REACT_APP_API_URL}/${image}`;

const TEditor = ({ initialInput, ...props }: any) => {
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { t } = useTranslation('common');
	const editorRef = useRef<Editor>(null);
	const token = getJwtToken();
	const articleId = router.query.articleId as string | undefined;
	const [articleCategory, setArticleCategory] = useState<ArticleCategory>(
		ArticleCategory.MARKET_TALK,
	);
	const [articleTitle, setArticleTitle] = useState<string>('');
	const [articleContent, setArticleContent] = useState<string | null>(
		articleId ? null : '',
	);
	const [notAuthor, setNotAuthor] = useState<boolean>(false);
	const [linkedLotId, setLinkedLotId] = useState<string>(
		(router.query.lotId as string) ?? '',
	);
	const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
	const [lotFilter, setLotFilter] = useState<LotsInquiry>(initialInput);
	const [lots, setLots] = useState<Lot[]>([]);
	const [lotTotal, setLotTotal] = useState<number>(0);
	const [lotText, setLotText] = useState<string>('');

	/** APOLLO REQUESTS **/
	const [createArticle] = useMutation(CREATE_ARTICLE);
	const [updateArticle] = useMutation(UPDATE_ARTICLE);

	useQuery(GET_ARTICLE, {
		fetchPolicy: 'network-only',
		variables: { input: articleId },
		skip: !articleId,
		onCompleted: (data: T) => {
			const article = data?.getArticle;
			if (article?.memberId !== user._id) return setNotAuthor(true);
			setArticleCategory(article.articleCategory);
			setArticleTitle(article.articleTitle);
			setArticleContent(article.articleContent);
			setLinkedLotId(article.lotId ?? '');
		},
	});

	useQuery(GET_LOT, {
		fetchPolicy: 'network-only',
		variables: { input: linkedLotId },
		skip: !linkedLotId,
		onCompleted: (data: T) => setSelectedLot(data?.getLot ?? null),
	});

	const { loading: getLotsLoading } = useQuery(GET_LOTS, {
		fetchPolicy: 'network-only',
		variables: { input: lotFilter },
		skip: !!articleId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			const list = data?.getLots?.list ?? [];
			setLots((prev) => (lotFilter.page === 1 ? list : [...prev, ...list]));
			setLotTotal(data?.getLots?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (lotText === (lotFilter.search.text ?? '')) return;
		const timer = setTimeout(
			() =>
				setLotFilter({
					...lotFilter,
					page: 1,
					search: { ...lotFilter.search, text: lotText },
				}),
			400,
		);
		return () => clearTimeout(timer);
	}, [lotText]);

	/** HANDLERS **/
	const uploadImage = async (image: any) => {
		try {
			const formData = new FormData();
			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target)
					}`,
					variables: { file: null, target: 'article' },
				}),
			);
			formData.append('map', JSON.stringify({ '0': ['variables.file'] }));
			formData.append('0', image);

			const response = await axios.post(
				`${process.env.REACT_APP_API_GRAPHQL_URL}`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
						'apollo-require-preflight': true,
						Authorization: `Bearer ${token}`,
					},
				},
			);
			const url = response.data?.data?.imageUploader;
			if (!url)
				throw new Error(
					response.data?.errors?.[0]?.message ?? Message.UPLOAD_FAILED,
				);
			return `${REACT_APP_API_URL}/${url}`;
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const lotScrollHandler = (e: React.UIEvent<HTMLElement>) => {
		const box = e.currentTarget;
		if (
			box.scrollTop + box.clientHeight >= box.scrollHeight - 20 &&
			lots.length < lotTotal &&
			!getLotsLoading
		)
			setLotFilter({ ...lotFilter, page: lotFilter.page + 1 });
	};

	const submitHandler = async () => {
		try {
			const editor = editorRef.current?.getInstance();
			const content = editor?.getHTML() ?? '';
			const title = articleTitle.trim();
			if (title.length < 3 || !editor?.getMarkdown().trim())
				throw new Error(t('Please insert a title and content'));
			if (content.length > 5000)
				throw new Error(t('Article is too long (max 5000 characters)'));

			const articleImages = Array.from(
				content.matchAll(/<img[^>]+src="([^"]+)"/g),
			)
				.map((match) => match[1].replace(`${REACT_APP_API_URL}/`, ''))
				.slice(0, 10);

			let id = articleId;
			if (articleId) {
				await updateArticle({
					variables: {
						input: {
							_id: articleId,
							articleTitle: title,
							articleContent: content,
							articleImages,
						},
					},
				});
			} else {
				const result = await createArticle({
					variables: {
						input: {
							articleCategory,
							articleTitle: title,
							articleContent: content,
							articleImages,
							lotId: selectedLot?._id,
						},
					},
				});
				id = result.data.createArticle._id;
			}

			await sweetTopSuccessAlert(
				t(articleId ? 'Article updated' : 'Article published'),
				700,
			);
			await router.push({ pathname: '/community/detail', query: { id } });
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (notAuthor)
		return (
			<Stack className={'no-data'}>
				<Typography>{t('You can only edit your own articles')}</Typography>
			</Stack>
		);

	const lotOptions =
		selectedLot && !lots.some((lot) => lot._id === selectedLot._id)
			? [selectedLot, ...lots]
			: lots;

	return (
		<Stack className={'editor-config'}>
			<Stack className={'config-row'}>
				<TextField
					select
					label={t('Category')}
					value={articleCategory}
					disabled={!!articleId}
					onChange={({ target: { value } }) =>
						setArticleCategory(value as ArticleCategory)
					}
				>
					{Object.values(ArticleCategory).map((category) => (
						<MenuItem key={category} value={category}>
							{t(category)}
						</MenuItem>
					))}
				</TextField>
				<TextField
					label={t('Title')}
					value={articleTitle}
					onChange={({ target: { value } }) => setArticleTitle(value)}
					inputProps={{ maxLength: 100 }}
				/>
			</Stack>
			<Autocomplete
				options={lotOptions}
				value={selectedLot}
				disabled={!!articleId}
				loading={getLotsLoading}
				filterOptions={(options) => options}
				getOptionLabel={(lot: Lot) => lot.lotName}
				isOptionEqualToValue={(option: Lot, value: Lot) =>
					option._id === value._id
				}
				onChange={(e, value) => setSelectedLot(value)}
				onInputChange={(e, value, reason) => {
					if (reason !== 'reset') setLotText(value);
				}}
				slotProps={{ listbox: { onScroll: lotScrollHandler } as any }}
				renderOption={({ key, ...optionProps }: any, lot: Lot) => (
					<li
						key={lot._id}
						{...optionProps}
						className={`${optionProps.className} lot-option`}
					>
						{lot.lotImages?.[0] ? (
							<Image
								src={imagePath(lot.lotImages[0])}
								alt={lot.lotName}
								width={80}
								height={64}
							/>
						) : (
							<span className={'no-image'} />
						)}
						<span className={'name'}>{lot.lotName}</span>
						<span className={'status'}>{t(lot.lotStatus)}</span>
					</li>
				)}
				renderInput={(params) => (
					<TextField
						{...params}
						label={t('Related lot (optional)')}
						InputProps={{
							...params.InputProps,
							endAdornment: (
								<>
									{getLotsLoading && <CircularProgress size={18} />}
									{params.InputProps.endAdornment}
								</>
							),
						}}
					/>
				)}
			/>
			{articleContent !== null && (
				<Editor
					initialValue={articleContent}
					placeholder={t('Type here')}
					previewStyle={'vertical'}
					height={'560px'}
					initialEditType={'wysiwyg'}
					useCommandShortcut={true}
					toolbarItems={[
						['heading', 'bold', 'italic', 'strike'],
						['image', 'table', 'link'],
						['ul', 'ol', 'task'],
					]}
					ref={editorRef}
					hooks={{
						addImageBlobHook: async (image: any, callback: any) => {
							const url = await uploadImage(image);
							if (url) callback(url);
							return false;
						},
					}}
				/>
			)}
			<Stack className={'buttons-row'}>
				<Button variant={'contained'} onClick={submitHandler}>
					{t(articleId ? 'Save' : 'Publish')}
				</Button>
			</Stack>
		</Stack>
	);
};

TEditor.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: Direction.DESC,
		search: { lotStatusList: publicLotStatuses },
	},
};

export default TEditor;

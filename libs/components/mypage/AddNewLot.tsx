import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import axios from 'axios';
import moment from 'moment';
import { useMutation, useQuery } from '@apollo/client';
import { Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { LotInput } from '../../types/lot/lot.input';
import { LotCategory, LotCondition, LotStatus } from '../../enums/lot.enum';
import { Message } from '../../enums/common.enum';
import { REACT_APP_API_URL } from '../../config';
import { getJwtToken } from '../../auth';
import { CREATE_LOT, UPDATE_LOT } from '../../../apollo/user/mutation';
import { GET_LOT } from '../../../apollo/user/query';
import { sweetMixinErrorAlert, sweetMixinSuccessAlert } from '../../sweetAlert';

const toInputDate = (date?: Date) =>
	date ? moment(date).format('YYYY-MM-DDTHH:mm') : '';

const AddNewLot = ({ initialValues, ...props }: any) => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const inputRef = useRef<any>(null);
	const [insertLotData, setInsertLotData] = useState<LotInput>(initialValues);
	const token = getJwtToken();

	/** APOLLO REQUESTS **/
	const [createLot] = useMutation(CREATE_LOT);
	const [updateLot] = useMutation(UPDATE_LOT);

	// get data to updateLot
	const { loading: getLotLoading, data: getLotData } = useQuery(GET_LOT, {
		fetchPolicy: 'network-only',
		variables: { input: router.query.lotId },
		skip: !router.query.lotId,
	});

	/** LIFECYCLES **/
	useEffect(() => {
		const lot = getLotData?.getLot;
		setInsertLotData(
			lot
				? {
						lotName: lot.lotName,
						lotDesc: lot.lotDesc ?? '',
						lotImages: lot.lotImages,
						lotCategory: lot.lotCategory,
						lotCondition: lot.lotCondition,
						lotStartPrice: lot.lotStartPrice,
						lotCeilingPrice: lot.lotCeilingPrice ?? undefined,
						lotMinIncrement: lot.lotMinIncrement,
						lotShippingNote: lot.lotShippingNote ?? '',
						lotStartsAt: lot.lotStartsAt,
						lotEndsAt: lot.lotEndsAt,
				  }
				: initialValues,
		);
	}, [getLotLoading, getLotData]);

	/** HANDLERS **/
	async function uploadImages() {
		try {
			const formData = new FormData();
			const selectedFiles = inputRef.current.files;

			if (selectedFiles.length == 0) return false;
			if (selectedFiles.length > 5)
				throw new Error('Cannot upload more than 5 images!');

			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImagesUploader($files: [Upload!]!, $target: String!) {
						imagesUploader(files: $files, target: $target)
				  }`,
					variables: {
						files: [null, null, null, null, null],
						target: 'lot',
					},
				}),
			);
			formData.append(
				'map',
				JSON.stringify({
					'0': ['variables.files.0'],
					'1': ['variables.files.1'],
					'2': ['variables.files.2'],
					'3': ['variables.files.3'],
					'4': ['variables.files.4'],
				}),
			);
			for (const key in selectedFiles) {
				if (/^\d+$/.test(key)) formData.append(`${key}`, selectedFiles[key]);
			}

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

			const responseImages = response.data.data.imagesUploader;

			setInsertLotData({ ...insertLotData, lotImages: responseImages });
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}

	const doDisabledCheck = () => {
		if (
			insertLotData.lotName === '' ||
			insertLotData.lotDesc === '' ||
			!insertLotData.lotCategory ||
			!insertLotData.lotCondition ||
			insertLotData.lotStartPrice === 0 ||
			insertLotData.lotMinIncrement === 0 ||
			!insertLotData.lotEndsAt ||
			insertLotData.lotImages.length === 0
		) {
			return true;
		}
	};

	const getLotInput = () => {
		const { lotStartPrice, lotCeilingPrice, lotStartsAt, lotEndsAt } =
			insertLotData;
		if (lotCeilingPrice && lotCeilingPrice <= lotStartPrice)
			throw new Error(Message.INVALID_CEILING_PRICE);
		if (lotStartsAt && !moment(lotEndsAt).isAfter(lotStartsAt))
			throw new Error(Message.INVALID_LOT_TIME);

		return {
			...insertLotData,
			lotCeilingPrice: lotCeilingPrice || null,
			lotShippingNote: insertLotData.lotShippingNote || null,
			lotStartsAt: lotStartsAt || undefined,
		};
	};

	const insertLotHandler = useCallback(async () => {
		try {
			await createLot({ variables: { input: getLotInput() } });

			await sweetMixinSuccessAlert(t('Lot created'));
			await router.push({ pathname: '/mypage', query: { category: 'myLots' } });
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	}, [insertLotData]);

	const updateLotHandler = useCallback(async () => {
		try {
			await updateLot({
				variables: {
					input: { _id: getLotData?.getLot?._id, ...getLotInput() },
				},
			});

			await sweetMixinSuccessAlert(t('Lot updated'));
			await router.push({ pathname: '/mypage', query: { category: 'myLots' } });
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	}, [insertLotData, getLotData]);

	return (
		<div id="add-lot-page">
			<Stack className="main-title-box">
				<Typography className="main-title">
					{router.query.lotId ? t('Edit Lot') : t('Add New Lot')}
				</Typography>
				<Typography className="sub-title">
					{t('Fill in the details buyers will see')}
				</Typography>
			</Stack>

			<Stack className="config">
				<TextField
					label={t('Lot name')}
					value={insertLotData.lotName}
					onChange={({ target: { value } }) =>
						setInsertLotData({ ...insertLotData, lotName: value })
					}
				/>
				<TextField
					label={t('Description')}
					multiline
					minRows={4}
					value={insertLotData.lotDesc}
					onChange={({ target: { value } }) =>
						setInsertLotData({ ...insertLotData, lotDesc: value })
					}
				/>
				<Stack className="config-row">
					<TextField
						select
						label={t('Category')}
						value={insertLotData.lotCategory}
						onChange={({ target: { value } }) =>
							setInsertLotData({
								...insertLotData,
								lotCategory: value as LotCategory,
							})
						}
					>
						{Object.values(LotCategory).map((category: LotCategory) => (
							<MenuItem key={category} value={category}>
								{t(category)}
							</MenuItem>
						))}
					</TextField>
					<TextField
						select
						label={t('Condition')}
						value={insertLotData.lotCondition}
						onChange={({ target: { value } }) =>
							setInsertLotData({
								...insertLotData,
								lotCondition: value as LotCondition,
							})
						}
					>
						{Object.values(LotCondition).map((condition: LotCondition) => (
							<MenuItem key={condition} value={condition}>
								{t(condition)}
							</MenuItem>
						))}
					</TextField>
				</Stack>
				<Stack className="config-row">
					<TextField
						label={`${t('Start price')} ($)`}
						type="number"
						value={insertLotData.lotStartPrice || ''}
						onChange={({ target: { value } }) =>
							setInsertLotData({
								...insertLotData,
								lotStartPrice: parseInt(value) || 0,
							})
						}
					/>
					<TextField
						label={`${t('Min increment')} ($)`}
						type="number"
						value={insertLotData.lotMinIncrement || ''}
						onChange={({ target: { value } }) =>
							setInsertLotData({
								...insertLotData,
								lotMinIncrement: parseInt(value) || 0,
							})
						}
					/>
				</Stack>
				<Stack className="config-row">
					<TextField
						label={`${t('Ceiling price')} ($)`}
						type="number"
						value={insertLotData.lotCeilingPrice ?? ''}
						onChange={({ target: { value } }) =>
							setInsertLotData({
								...insertLotData,
								lotCeilingPrice: parseInt(value) || undefined,
							})
						}
					/>
					<TextField
						label={t('Shipping note')}
						value={insertLotData.lotShippingNote}
						onChange={({ target: { value } }) =>
							setInsertLotData({ ...insertLotData, lotShippingNote: value })
						}
					/>
				</Stack>
				<Stack className="config-row">
					<TextField
						label={t('Starts at')}
						type="datetime-local"
						helperText={t('Leave empty to start now')}
						disabled={getLotData?.getLot?.lotStatus === LotStatus.OPEN}
						slotProps={{ inputLabel: { shrink: true } }}
						value={toInputDate(insertLotData.lotStartsAt)}
						onChange={({ target: { value } }) =>
							setInsertLotData({
								...insertLotData,
								lotStartsAt: value ? new Date(value) : undefined,
							})
						}
					/>
					<TextField
						label={t('Ends at')}
						type="datetime-local"
						slotProps={{ inputLabel: { shrink: true } }}
						value={toInputDate(insertLotData.lotEndsAt)}
						onChange={({ target: { value } }) =>
							setInsertLotData({
								...insertLotData,
								lotEndsAt: value ? new Date(value) : initialValues.lotEndsAt,
							})
						}
					/>
				</Stack>

				<Stack className="images-box">
					<Typography className="title">{t('Images')}</Typography>
					<Stack className="upload-box">
						<CloudUploadOutlinedIcon className="upload-icon" />
						<Typography className="format-title">
							{t('Up to 5 images, JPG or PNG')}
						</Typography>
						<Button variant="outlined" onClick={() => inputRef.current.click()}>
							{t('Browse files')}
						</Button>
						<input
							ref={inputRef}
							type="file"
							hidden={true}
							onChange={uploadImages}
							multiple={true}
							accept="image/jpg, image/jpeg, image/png"
						/>
					</Stack>
					<Stack className="gallery-box">
						{insertLotData?.lotImages.map((image: string) => {
							const imagePath: string = image.startsWith('http')
								? image
								: `${REACT_APP_API_URL}/${image}`;
							return (
								<Stack className="image-box" key={image}>
									<Image src={imagePath} alt="" width={240} height={240} />
								</Stack>
							);
						})}
					</Stack>
				</Stack>

				<Stack className="buttons-row">
					{router.query.lotId ? (
						<Button
							variant="contained"
							disabled={doDisabledCheck()}
							onClick={updateLotHandler}
						>
							{t('Save')}
						</Button>
					) : (
						<Button
							variant="contained"
							disabled={doDisabledCheck()}
							onClick={insertLotHandler}
						>
							{t('Save')}
						</Button>
					)}
				</Stack>
			</Stack>
		</div>
	);
};

AddNewLot.defaultProps = {
	initialValues: {
		lotName: '',
		lotDesc: '',
		lotImages: [],
		lotCategory: '',
		lotCondition: '',
		lotStartPrice: 0,
		lotCeilingPrice: undefined,
		lotMinIncrement: 0,
		lotShippingNote: '',
		lotStartsAt: undefined,
		lotEndsAt: '',
	},
};

export default AddNewLot;

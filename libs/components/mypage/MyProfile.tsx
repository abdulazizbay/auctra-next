import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import axios from 'axios';
import { useMutation, useReactiveVar } from '@apollo/client';
import {
	Avatar,
	Button,
	MenuItem,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import { MemberUpdate } from '../../types/member/member.update';
import {
	MemberLocation,
	MemberSellerStatus,
	MemberType,
} from '../../enums/member.enum';
import { Message } from '../../enums/common.enum';
import { REACT_APP_API_URL } from '../../config';
import { getJwtToken, updateUserInfo } from '../../auth';
import { userVar } from '../../../apollo/store';
import { APPLY_SELLER, UPDATE_MEMBER } from '../../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetMixinSuccessAlert } from '../../sweetAlert';

const imagePath = (image?: string) =>
	!image
		? undefined
		: image.startsWith('http')
		? image
		: `${REACT_APP_API_URL}/${image}`;

const MyProfile = () => {
	const user = useReactiveVar(userVar);
	const { t } = useTranslation('common');
	const token = getJwtToken();
	const [updateData, setUpdateData] = useState<MemberUpdate>({
		memberNick: user.memberNick,
		memberFullName: user.memberFullName ?? '',
		memberPhone: user.memberPhone ?? '',
		memberEmail: user.memberEmail ?? '',
		memberImage: user.memberImage ?? '',
		memberBio: user.memberBio ?? '',
		memberLocation: user.memberLocation as MemberLocation,
		memberAddress: user.memberAddress ?? '',
	});
	const [docUrl, setDocUrl] = useState<string>('');

	/** APOLLO REQUESTS **/
	const [updateMember] = useMutation(UPDATE_MEMBER);
	const [applySeller] = useMutation(APPLY_SELLER);

	/** HANDLERS **/
	const uploadImage = async (file?: File) => {
		if (!file) return '';
		const formData = new FormData();
		formData.append(
			'operations',
			JSON.stringify({
				query: `mutation ImageUploader($file: Upload!, $target: String!) {
					imageUploader(file: $file, target: $target)
				}`,
				variables: { file: null, target: 'member' },
			}),
		);
		formData.append('map', JSON.stringify({ '0': ['variables.file'] }));
		formData.append('0', file);

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
		return url;
	};

	const imageHandler = async (e: any) => {
		try {
			const url = await uploadImage(e.target.files?.[0]);
			if (url) setUpdateData({ ...updateData, memberImage: url });
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const docHandler = async (e: any) => {
		try {
			setDocUrl(await uploadImage(e.target.files?.[0]));
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const updateHandler = async () => {
		try {
			const input: any = {};
			for (const [key, value] of Object.entries(updateData))
				input[key] = (value as string)?.trim() || undefined;

			const result = await updateMember({ variables: { input } });
			updateUserInfo(result.data.updateMember);
			await sweetMixinSuccessAlert(t('Profile updated'));
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const applyHandler = async () => {
		try {
			const result = await applySeller({
				variables: { input: { memberSellerDocUrl: docUrl } },
			});
			updateUserInfo(result.data.applySeller);
			setDocUrl('');
			await sweetMixinSuccessAlert(t('Application submitted'));
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const field = (key: keyof MemberUpdate, label: string, props: any = {}) => (
		<TextField
			label={t(label)}
			value={updateData[key] ?? ''}
			onChange={({ target: { value } }) =>
				setUpdateData({ ...updateData, [key]: value })
			}
			fullWidth
			{...props}
		/>
	);

	return (
		<div id="my-profile-page">
			<Stack className="main-title-box">
				<Typography className="main-title">{t('My Profile')}</Typography>
				<Typography className="sub-title">
					{t('Update your account details')}
				</Typography>
			</Stack>
			<Stack className="config">
				<Stack className="image-row">
					<Avatar
						className="profile-img"
						src={imagePath(updateData.memberImage)}
					>
						{user.memberNick?.[0]?.toUpperCase()}
					</Avatar>
					<Button variant="outlined" component="label">
						{t('Change photo')}
						<input
							type="file"
							hidden
							accept="image/jpg, image/jpeg, image/png"
							onChange={imageHandler}
						/>
					</Button>
				</Stack>
				<Stack className="config-row">
					{field('memberNick', 'Nickname', { inputProps: { maxLength: 12 } })}
					{field('memberFullName', 'Full name', {
						inputProps: { maxLength: 100 },
					})}
					{field('memberPhone', 'Phone')}
					{field('memberEmail', 'Email', { type: 'email' })}
					{field('memberLocation', 'Location', {
						select: true,
						children: Object.values(MemberLocation).map((location) => (
							<MenuItem key={location} value={location}>
								{location}
							</MenuItem>
						)),
					})}
					{field('memberAddress', 'Shipping address', {
						inputProps: { maxLength: 200 },
					})}
				</Stack>
				{field('memberBio', 'Bio', { multiline: true, minRows: 3 })}
				<Stack className="buttons-row">
					<Button
						variant="contained"
						disabled={(updateData.memberNick?.trim().length ?? 0) < 3}
						onClick={updateHandler}
					>
						{t('Save')}
					</Button>
				</Stack>
			</Stack>

			{user.memberType === MemberType.USER && (
				<Stack className="config seller-box">
					<Typography className="title">{t('Become a seller')}</Typography>
					{user.memberSellerStatus === MemberSellerStatus.PENDING ? (
						<Typography className="note">
							{t('Your seller application is under review.')}
						</Typography>
					) : (
						<>
							{user.memberSellerStatus === MemberSellerStatus.REJECTED && (
								<Typography className="note rejected">
									{t('Your application was rejected. You can apply again.')}
								</Typography>
							)}
							<Typography className="note">
								{t('Upload a photo of your ID or business document.')}
							</Typography>
							{docUrl && (
								<img className="doc-preview" src={imagePath(docUrl)} alt="" />
							)}
							<Stack className="buttons-row">
								<Button variant="outlined" component="label">
									{t('Upload document')}
									<input
										type="file"
										hidden
										accept="image/jpg, image/jpeg, image/png"
										onChange={docHandler}
									/>
								</Button>
								<Button
									variant="contained"
									disabled={!docUrl}
									onClick={applyHandler}
								>
									{t('Apply')}
								</Button>
							</Stack>
						</>
					)}
				</Stack>
			)}
		</div>
	);
};

export default MyProfile;

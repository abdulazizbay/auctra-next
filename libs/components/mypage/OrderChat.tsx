import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import moment from 'moment';
import { useLazyQuery, useMutation, useReactiveVar } from '@apollo/client';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { socketVar, userVar } from '../../../apollo/store';
import { GET_MESSAGES } from '../../../apollo/user/query';
import { SEND_MESSAGE } from '../../../apollo/user/mutation';
import { OrderMessage } from '../../types/message/message';
import { joinRoom } from '../../socket';
import { sweetMixinErrorAlert } from '../../sweetAlert';

interface OrderChatProps {
	orderId: string | null;
	onClose: () => void;
}

const OrderChat = (props: OrderChatProps) => {
	const { orderId, onClose } = props;
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar);
	const listRef = useRef<HTMLDivElement>(null);
	const [messages, setMessages] = useState<OrderMessage[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [page, setPage] = useState<number>(1);
	const [messageText, setMessageText] = useState<string>('');
	const lastMessageId = messages[messages.length - 1]?._id;

	/** APOLLO REQUESTS **/
	const [getMessages] = useLazyQuery(GET_MESSAGES, {
		fetchPolicy: 'network-only',
	});
	const [sendMessage] = useMutation(SEND_MESSAGE);

	/** LIFECYCLES **/
	useEffect(() => {
		if (!orderId) return;
		setMessages([]);
		loadMessages(1).then();
	}, [orderId]);

	useEffect(() => {
		if (!socket || !orderId) return;
		const leaveRoom = joinRoom(socket, `order:${orderId}`);
		const messageHandler = (msg: MessageEvent) => {
			const data = JSON.parse(msg.data);
			if (data.event === 'orderMessage' && data.message.orderId === orderId)
				mergeMessages([data.message]);
		};
		socket.addEventListener('message', messageHandler);
		return () => {
			socket.removeEventListener('message', messageHandler);
			leaveRoom();
		};
	}, [socket, orderId]);

	useEffect(() => {
		listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
	}, [lastMessageId]);

	/** HANDLERS **/
	const mergeMessages = (list: OrderMessage[]) => {
		setMessages((prev) => {
			const ids = new Set(prev.map((message) => message._id));
			return [...prev, ...list.filter((message) => !ids.has(message._id))].sort(
				(a, b) => moment(a.createdAt).valueOf() - moment(b.createdAt).valueOf(),
			);
		});
	};

	const loadMessages = async (target: number) => {
		const { data } = await getMessages({
			variables: { input: { page: target, limit: 30, search: { orderId } } },
		});
		mergeMessages(data?.getMessages?.list ?? []);
		setTotal(data?.getMessages?.metaCounter?.[0]?.total ?? 0);
		setPage(target);
	};

	const sendMessageHandler = async () => {
		try {
			const text = messageText.trim();
			if (!text || !orderId) return;
			const { data } = await sendMessage({
				variables: { input: { orderId, messageText: text } },
			});
			if (data?.sendMessage) mergeMessages([data.sendMessage]);
			setMessageText('');
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const keyDownHandler = (e: KeyboardEvent) => {
		if (e.key !== 'Enter' || e.shiftKey) return;
		e.preventDefault();
		sendMessageHandler().then();
	};

	return (
		<Dialog
			open={!!orderId}
			onClose={onClose}
			fullWidth
			maxWidth="sm"
			className="order-chat"
		>
			<DialogTitle>{t('Messages')}</DialogTitle>
			<DialogContent ref={listRef} className="chat-list">
				{messages.length < total && (
					<Button size="small" onClick={() => loadMessages(page + 1)}>
						{t('Load older')}
					</Button>
				)}
				{messages.length === 0 && (
					<Typography className="chat-empty">{t('No messages yet')}</Typography>
				)}
				{messages.map((message) => (
					<Stack
						key={message._id}
						className={
							message.memberId === user._id
								? 'chat-message mine'
								: 'chat-message'
						}
					>
						<Typography className="text">{message.messageText}</Typography>
						<Typography className="date">
							{moment(message.createdAt).format('MM.DD HH:mm')}
						</Typography>
					</Stack>
				))}
			</DialogContent>
			<DialogActions className="chat-input">
				<TextField
					fullWidth
					multiline
					maxRows={4}
					size="small"
					placeholder={t('Write a message')}
					value={messageText}
					onChange={(e) => setMessageText(e.target.value)}
					onKeyDown={keyDownHandler}
					slotProps={{ htmlInput: { maxLength: 1000 } }}
				/>
				<IconButton
					color="primary"
					disabled={!messageText.trim()}
					onClick={sendMessageHandler}
				>
					<SendIcon />
				</IconButton>
			</DialogActions>
		</Dialog>
	);
};

export default OrderChat;

import React, { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useReactiveVar } from '@apollo/client';
import {
	Badge,
	Box,
	IconButton,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { socketVar, userVar } from '../../apollo/store';
import { Member } from '../types/member/member';

interface LobbyMessage {
	text: string;
	memberData: Member | null;
}

const Chat = () => {
	const router = useRouter();
	const { t } = useTranslation('common');
	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar);
	const listRef = useRef<HTMLDivElement>(null);
	const [open, setOpen] = useState<boolean>(false);
	const [unread, setUnread] = useState<boolean>(false);
	const [messages, setMessages] = useState<LobbyMessage[]>([]);
	const [onlineCount, setOnlineCount] = useState<number>(0);
	const [messageText, setMessageText] = useState<string>('');

	/** LIFECYCLES **/
	useEffect(() => {
		if (!socket) return;
		const lobbyHandler = (msg: MessageEvent) => {
			const data = JSON.parse(msg.data);
			if (data.event === 'getMessages') setMessages(data.list);
			if (data.event === 'info') setOnlineCount(data.totalClients);
			if (data.event === 'message') {
				setMessages((prev) => [...prev, data].slice(-50));
				setUnread(true);
			}
		};
		socket.addEventListener('message', lobbyHandler);
		return () => socket.removeEventListener('message', lobbyHandler);
	}, [socket]);

	useEffect(() => {
		listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
	}, [messages, open]);

	/** HANDLERS **/
	const toggleHandler = () => {
		setOpen(!open);
		setUnread(false);
	};

	const sendHandler = () => {
		const text = messageText.trim();
		if (!text || socket?.readyState !== WebSocket.OPEN) return;
		socket.send(JSON.stringify({ event: 'message', data: text }));
		setMessageText('');
	};

	const keyDownHandler = (e: KeyboardEvent) => {
		if (e.key !== 'Enter') return;
		e.preventDefault();
		sendHandler();
	};

	if (!socket || router.pathname.startsWith('/_admin')) return null;

	return (
		<Box component={'div'} className={'lobby-chat'}>
			{open && (
				<Stack className={'chat-box'}>
					<Box component={'div'} className={'chat-head'}>
						<Typography className={'title'}>{t('Live chat')}</Typography>
						<Typography className={'online'}>
							{t('{{count}} online', { count: onlineCount })}
						</Typography>
					</Box>
					<Stack ref={listRef} className={'chat-list'}>
						{messages.length === 0 && (
							<Typography className={'chat-empty'}>
								{t('Say hello!')}
							</Typography>
						)}
						{messages.map((message, index) => {
							const mine = !!user._id && message.memberData?._id === user._id;
							return (
								<Stack
									key={index}
									className={mine ? 'chat-message mine' : 'chat-message'}
								>
									{!mine && (
										<Typography className={'nick'}>
											{message.memberData?.memberNick ?? t('Guest')}
										</Typography>
									)}
									<Typography className={'text'}>{message.text}</Typography>
								</Stack>
							);
						})}
					</Stack>
					<Box component={'div'} className={'chat-input'}>
						<TextField
							fullWidth
							size={'small'}
							disabled={!user._id}
							placeholder={user._id ? t('Write a message') : t('Login to chat')}
							value={messageText}
							onChange={(e) => setMessageText(e.target.value)}
							onKeyDown={keyDownHandler}
							slotProps={{ htmlInput: { maxLength: 300 } }}
						/>
						<IconButton
							color={'primary'}
							disabled={!user._id || !messageText.trim()}
							onClick={sendHandler}
						>
							<SendIcon />
						</IconButton>
					</Box>
				</Stack>
			)}
			<IconButton className={'chat-button'} onClick={toggleHandler}>
				<Badge variant={'dot'} color={'error'} invisible={open || !unread}>
					{open ? <CloseIcon /> : <ChatBubbleOutlineIcon />}
				</Badge>
			</IconButton>
		</Box>
	);
};

export default Chat;

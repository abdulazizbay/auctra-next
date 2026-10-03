import { socketVar } from '../apollo/store';
import { getJwtToken } from './auth';

let token = '';
let retry = 0;
let timer: ReturnType<typeof setTimeout> | undefined;

const openSocket = () => {
	const url = `${process.env.REACT_APP_API_WS}`;
	const socket = new WebSocket(token ? `${url}?token=${token}` : url);
	socket.onopen = () => {
		retry = 0;
	};
	socket.onclose = () => {
		if (socketVar() !== socket) return;
		timer = setTimeout(openSocket, Math.min(1000 * 2 ** retry++, 30000));
	};
	socketVar(socket);
};

export const connectSocket = () => {
	const jwt = getJwtToken() ?? '';
	if (socketVar() && jwt === token) return;
	closeSocket();
	token = jwt;
	openSocket();
};

const closeSocket = () => {
	clearTimeout(timer);
	const socket = socketVar();
	socketVar(null);
	socket?.close();
};

export const joinRoom = (socket: WebSocket, room: string) => {
	const join = () => socket.send(JSON.stringify({ event: 'join', data: room }));
	if (socket.readyState === WebSocket.OPEN) join();
	else socket.addEventListener('open', join, { once: true });
	return () => {
		socket.removeEventListener('open', join);
		if (socket.readyState === WebSocket.OPEN)
			socket.send(JSON.stringify({ event: 'leave', data: room }));
	};
};

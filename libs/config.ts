export const REACT_APP_API_URL = `${process.env.REACT_APP_API_URL}`;

export const Messages = {
	error1: 'Something went wrong!',
	error2: 'Please login first!',
	error3: 'Please fulfill all inputs!',
	error4: 'Message is empty!',
	error5: 'Only images with jpeg, jpg, png format allowed!',
	INSERT_ALL_INPUTS: 'Please insert all inputs!',
};

export const lotPriceMax = 2147483647;

export const lotPriceRanges = [
	{ start: 0, end: 1000000 },
	{ start: 1000000, end: 5000000 },
	{ start: 5000000, end: 20000000 },
	{ start: 20000000, end: 100000000 },
	{ start: 100000000, end: lotPriceMax },
];

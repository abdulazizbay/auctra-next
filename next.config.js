const apiUrl = new URL(
	process.env.REACT_APP_API_URL || 'http://localhost:3009',
);

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	output: 'standalone',
	images: {
		remotePatterns: [
			{
				protocol: apiUrl.protocol.replace(':', ''),
				hostname: apiUrl.hostname,
				port: apiUrl.port,
				pathname: '/uploads/**',
			},
		],
	},
	experimental: {
		esmExternals: false,
	},
	env: {
		REACT_APP_API_URL: process.env.REACT_APP_API_URL,
		REACT_APP_API_GRAPHQL_URL: process.env.REACT_APP_API_GRAPHQL_URL,
		REACT_APP_API_WS: process.env.REACT_APP_API_WS,
		REACT_APP_SITE_URL: process.env.REACT_APP_SITE_URL,
		REACT_APP_GOOGLE_CLIENT_ID: process.env.REACT_APP_GOOGLE_CLIENT_ID,
		REACT_APP_KAKAO_REST_KEY: process.env.REACT_APP_KAKAO_REST_KEY,
	},
};

const { i18n } = require('./next-i18next.config');
nextConfig.i18n = i18n;

module.exports = nextConfig;

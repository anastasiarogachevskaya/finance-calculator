import React, { ReactElement } from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';

import Layout from '../components/Layout';

import '../styles/app.scss';

export default function App({ Component, pageProps }: AppProps): ReactElement {
	return (
		<Layout>
			<Head>
				<title>react-md with next.js</title>
				<link
					rel='stylesheet'
					href='https://fonts.googleapis.com/icon?family=Material+Icons'
				/>
				<link
					rel='stylesheet'
					href='https://fonts.googleapis.com/css?family=Roboto:400,500:700&display=swap'
				/>
			</Head>
			<Component {...pageProps} />
		</Layout>
	);
}

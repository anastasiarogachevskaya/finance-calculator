import { NextApiRequest } from 'next';
import React, { useState, ReactElement } from 'react';
import {
	Form,
	Text,
	TextContainer,
	TextField,
	Radio,
	useChoice,
	Fieldset,
	Button,
	CircularProgress,
	DialogFooter,
	Select,
} from 'react-md';

import clientPromise from '../utils/mongoDB-util';
// import axios from 'axios';

interface State {
	loading: boolean;
	data?: {
		date: string;
		total: number;
		shop: string;
		payer: string;
		amount: number;
		percentage: number;
	} | null;
}

const percentages = [
	{ label: '0%', value: 0 },
	{ label: '50%', value: 0.5 },
	{ label: '100%', value: 1 },
];

export default function Home({ isConnected, shops }): ReactElement {
	// console.log(shops);
	const [{ data, loading }, setState] = useState<State>({
		loading: false,
		data: null,
	});
	const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
	const [currentPercentage, handlePercentageChange] = useChoice(0.5);
	const [currentPayer, handlePayerChange] = useChoice('');
	const [shopName, setShopName] = useState('');
	const [amount, setAmount] = useState(0);

	const handleAmountChange = (
		event: React.ChangeEvent<HTMLInputElement>
	): void => {
		setAmount(Number(event.target.value));
	};

	const handleSubmit = (e): void => {
		e.preventDefault();
		setState({
			loading: true,
			data: {
				total: amount,
				shop: shopName,
				payer: currentPayer,
				amount,
				percentage: currentPercentage,
				date,
			},
		});
		setAmount(0);
		setShopName('');
		setState({ loading: false });
		setDate('');
	};

	console.log(shops);

	return (
		<>
			<TextContainer>
				<Text type='headline-4'>Let's begin!</Text>
			</TextContainer>
			<Form
				className='container'
				onSubmit={(e) => {
					handleSubmit(e);
				}}
			>
				<TextField
					id='date'
					key='date'
					type='date'
					label='Date'
					value={date}
					onChange={(e) => setDate(e.target.value)}
				/>
				<TextField
					id='shop'
					label='Shop'
					value={shopName}
					onChange={(e) => setShopName(e.target.value)}
				/>
				<TextField
					id='amount'
					key='amount'
					type='number'
					label='Amount'
					onChange={(e) => handleAmountChange(e)}
				/>
				<Fieldset legend='Percentage'>
					{percentages.map(({ label, value }) => (
						<Radio
							id={`text-field-types-theme-${label}`}
							key={label}
							name='percentage'
							onChange={handlePercentageChange}
							value={value}
							defaultChecked={value === currentPercentage}
							label={label}
						/>
					))}
				</Fieldset>
				<Fieldset legend='Payer'>
					<Radio
						id='payer-A'
						key='payer-A'
						name='payer-A'
						value='A'
						label='Anastasia'
						onChange={handlePayerChange}
					/>
					<Radio
						id='payer-S'
						key='payer-S'
						name='payer-S'
						value='S'
						label='Sergey'
						onChange={handlePayerChange}
					/>
				</Fieldset>
				{data && (
					<>
						<strong>Total:</strong>
						{data.total}
					</>
				)}
				<DialogFooter align='end'>
					<Button
						id='rhf-reset'
						type='reset'
						theme='secondary'
						themeType='outline'
					>
						Reset
					</Button>
					<Button
						id='rhf-submit'
						type={loading ? 'button' : 'submit'}
						theme={loading ? 'disabled' : 'primary'}
						themeType='outline'
						aria-label={loading ? 'Submitting' : undefined}
					>
						{loading ? (
							<CircularProgress id='rhf-submit-progress' centered={false} />
						) : (
							'Submit'
						)}
					</Button>
				</DialogFooter>
			</Form>
		</>
	);
}

export async function getServerSideProps() {
	try {
		const client = await clientPromise;
		const db = client.db('finance');
		const shops = await db.collection('shops').find({}).toArray();
		return {
			props: {
				isConnected: true,
				shops: JSON.stringify(shops),
			},
		};
	} catch (e) {
		console.error(e);
		return {
			props: { isConnected: false },
		};
	}
}

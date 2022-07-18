import axios from 'axios';
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
	AutoComplete,
} from 'react-md';

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

export default function Home({ shops }): ReactElement {
	const [{ data, loading }, setState] = useState<State>({
		loading: false,
		data: null,
	});
	const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
	const [currentPercentage, handlePercentageChange] = useChoice(0.5);
	const [currentPayer, handlePayerChange] = useChoice('');
	const [shopName, setShopName] = useState('');
	const [searchString, setSearchString] = useState<string>('');
	const [suggestions, setSuggestions] = useState([]);
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

	const onChange = async (text) => {
		const { data } = await axios(
			`${process.env.NEXT_PUBLIC_API_HOST}/api/search?q=${text}`
		);
		console.log(data);
		setSuggestions(data?.shops);
		setSearchString(text);
	};

	const onSuggestHandler = (text: string) => {
		setSearchString(text);
		setSuggestions([]);
	};

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
				<AutoComplete
					id='shop'
					label='Shops'
					placeholder='Search for a shop'
					data={suggestions}
					onChange={(e) => onChange(e.target.value)}
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

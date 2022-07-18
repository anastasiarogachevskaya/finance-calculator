import type { NextApiRequest, NextApiResponse } from 'next';
import connectDatabase from '../../utils/connectToDatabase';
import getByPartialString from '../../utils/getByPartialString';

async function handler(
	req: NextApiRequest,
	res: NextApiResponse<{
		total_shops?: number;
		shops?: {
			name: string;
		};
		message?: string;
	}>
) {
	const { q } = req.query;

	let client;
	try {
		client = await connectDatabase();
		try {
			const data = await getByPartialString(client, q, 10, true);
			res.status(200).json({
				total_shops: data.length,
				shops: data,
			});
		} catch (error) {
			console.error('No shops found');
		}
	} catch (error) {
		res.status(500).json({ message: 'Connecting to the database failed' });
		return;
	}
}

export default handler;

import { MongoClient } from 'mongodb';

export default async function connectDatabase() {
	const client = new MongoClient(process.env.MONGODB_URI, {
		useUnifiedTopology: true,
	});
	return client.connect();
}

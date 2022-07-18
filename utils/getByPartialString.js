export default async function getByPartialString(
	client,
	q,
	limit = 0,
	namesOnly = false
) {
	const filter =
		q === undefined || q.length < 1
			? {}
			: { name: { $regex: q, $options: 'i' } };
	const shops = await client
		.db('finance')
		.collection('shops')
		.find(filter)
		.limit(limit)
		.toArray();
	client.close();
	if (namesOnly) {
		return shops.map((shop) => shop.name);
	}
	return shops;
}

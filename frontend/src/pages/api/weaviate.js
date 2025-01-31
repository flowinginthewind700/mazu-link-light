import axios from 'axios';

const WEAVIATE_URL = process.env.NEXT_PUBLIC_WEAVIATE_URL;

export default async function handler(req, res) {
  try {
    if (!WEAVIATE_URL) {
      throw new Error('WEAVIATE_URL is not defined');
    }

    const response = await axios.post(`${WEAVIATE_URL}/v1/graphql`, req.body);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error proxying request to Weaviate:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

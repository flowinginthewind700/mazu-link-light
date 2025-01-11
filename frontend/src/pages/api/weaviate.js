import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.post('http://weaviate:8080/v1/graphql', req.body);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error proxying request to Weaviate:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
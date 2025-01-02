import { Metadata } from 'next'
import axios from 'axios'
import AIImageDetailPage from './AIImageDetailPage'

const apiUrl = process.env.NEXT_PUBLIC_CMS_API_BASE_URL

const truncateText = (text: string, maxLength: number) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

type Props = {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params
  const query = `
    query($id: ID!) {
      t2Iexample(id: $id) {
        id
        prompt
        img {
          url
        }
      }
    }
  `
  const variables = { id }
  const response = await axios.post(`${apiUrl}/graphql`, { query, variables })
  const image = response.data.data.t2Iexample

  const truncatedPrompt = truncateText(image.prompt, 200)
  const pageTitle = `Text2Image Example - ${truncatedPrompt} | LLMStock`
  const pageDescription = `Explore this Text2Image example on LLMStock: ${truncatedPrompt}`
  const imageUrl = `${apiUrl}${image.img[0].url}`

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      images: [imageUrl],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [imageUrl],
    },
  }
}

export default function Page({ params }: Props) {
  return <AIImageDetailPage id={params.id} />
}

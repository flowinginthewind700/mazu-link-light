// app/agitool/[id]/page.tsx
import { Metadata } from 'next';
import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_CMS_API_BASE_URL || '';

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = params;

  try {
    const query = `
      query($id: ID!) {
        agitool(id: $id) {
          name
          Description
          screenshot {
            url
          }
          imagelarge {
            url
          }
        }
      }
    `;

    const response = await axios.post(`${apiUrl}/graphql`, {
      query,
      variables: { id },
    });

    const tool = response.data.data.agitool;

    const title = `${tool.name} | AGIEntry`;
    const description = tool.Description || 'Explore this tool on AGIEntry';
    const imageUrl = tool.screenshot?.url || tool.imagelarge?.url 
      ? `${apiUrl}${tool.screenshot?.url || tool.imagelarge?.url}`
      : `${apiUrl}/images/default_tool.jpg`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [imageUrl],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'AGIEntry',
      description: 'Explore AI tools on AGIEntry',
    };
  }
}

export { default } from './AgiToolClient';
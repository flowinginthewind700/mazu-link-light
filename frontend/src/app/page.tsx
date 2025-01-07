import { Metadata } from 'next'
import HomePage from '@/components/home/HomePage'

export async function generateMetadata(): Promise<Metadata> {
  const pageTitle = "AGI Entry - Your Gateway to AI and AGI Tools"
  const pageDescription = "Discover and navigate the best AI and AGI tools including ChatGPT, Claude, Midjourney, and more. Your one-stop directory for AI chatbots, image generators, coding assistants, and AGI innovations."
  const imageUrl = "https://agientry.com/images/agiog.jpg"

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: 'https://agientry.com',
      siteName: 'AGI Entry',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [imageUrl],
      creator: '@McQueenFu',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    // verification: {
    //   google: 'your-google-verification-code',
    //   yandex: 'your-yandex-verification-code',
    //   bing: 'your-bing-verification-code',
    // },
  }
}

export default function Page() {
  return <HomePage />
}

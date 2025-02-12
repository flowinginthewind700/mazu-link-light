import type { Metadata } from "next"
import HalftoneProcessor from '@/components/halftoneProcessor'
import { Navigation } from '@/components/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const metadata: Metadata = {
  title: "Halftone Image Processor | AI Tools | AGIEntry",
  description:
    "Transform your images and videos into stunning halftone art with our AI-powered Halftone Image Processor. Adjust grid size, brightness, contrast, and more for unique visual effects.",
  keywords: "halftone, image processing, AI tools, video processing, dithering, image effects, AGIEntry",
}

export default function HalftoneProcessorPage() {
  return (
    <>
      <Navigation currentPage="" />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ToastContainer />
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Halftone Image Processor</CardTitle>
          </CardHeader>
          <CardContent>
            <HalftoneProcessor />
          </CardContent>
        </Card>
      </div>
    </>
  )
}

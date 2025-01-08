import { Metadata } from 'next'
import { Navigation } from '@/components/navigation'

export const metadata: Metadata = {
  title: 'Terms of Service | AI Tools Directory',
  description: 'Terms of Service for AI Tools Directory',
}

export default function TermsOfServicePage() {
  return (
    <><Navigation
    currentPage=""
    showMobileMenu={true}
  />
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <div className="space-y-6">
        <p>Last updated: [Current Date]</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
        <p>
          By accessing and using the AI Tools Directory website, you accept and agree to be bound by the terms and provision of this agreement.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Use License</h2>
        <p>
          Permission is granted to temporarily download one copy of the materials (information or software) on AI Tools Directory's website for personal, non-commercial transitory viewing only.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Disclaimer</h2>
        <p>
          The materials on AI Tools Directory's website are provided on an 'as is' basis. AI Tools Directory makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Limitations</h2>
        <p>
          In no event shall AI Tools Directory or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on AI Tools Directory's website.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Accuracy of Materials</h2>
        <p>
          The materials appearing on AI Tools Directory's website could include technical, typographical, or photographic errors. AI Tools Directory does not warrant that any of the materials on its website are accurate, complete or current.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Links</h2>
        <p>
          AI Tools Directory has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by AI Tools Directory of the site. Use of any such linked website is at the user's own risk.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Modifications</h2>
        <p>
          AI Tools Directory may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Governing Law</h2>
        <p>
          These terms and conditions are governed by and construed in accordance with the laws of [Your Country/State] and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
        </p>
      </div>
    </div>
    </>
  )
}


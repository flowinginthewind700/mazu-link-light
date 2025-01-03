import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | AI Tools Directory',
  description: 'Privacy Policy for AI Tools Directory',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="space-y-6">
        <p>Last updated: [Current Date]</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
        <p>
          Welcome to AI Tools Directory. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Data We Collect</h2>
        <p>
          We do not collect any personal data through our website. The AI Tools Directory is an informational resource and does not require user registration or the submission of personal information.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Cookies</h2>
        <p>
          Our website uses essential cookies to enhance your browsing experience. These cookies are necessary for the website to function properly and cannot be switched off in our systems.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Third-Party Links</h2>
        <p>
          Our website may include links to third-party websites, plug-ins, and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Changes to This Privacy Policy</h2>
        <p>
          We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contact Us</h2>
        <p>
          If you have any questions about this privacy policy, please contact us at: [Your Contact Information]
        </p>
      </div>
    </div>
  )
}


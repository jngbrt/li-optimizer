export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <div className="prose prose-blue max-w-none">
        <p className="text-lg mb-6">
          This Privacy Policy explains how LinkedIn Optimizer collects, uses, and protects your data when you use our
          service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>

        <h3 className="text-xl font-medium mt-6 mb-3">LinkedIn Data</h3>
        <p>
          When you connect your LinkedIn account, we collect your basic profile information and your LinkedIn posts.
          This data is used solely for analyzing your writing style and generating content that matches your voice. We
          do not share this data with third parties.
        </p>

        <h3 className="text-xl font-medium mt-6 mb-3">User Content</h3>
        <p>
          Any content you manually upload or create using our service is stored securely and used only for the purposes
          of style analysis and content generation.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Data</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>To analyze your writing style and create a personalized style profile</li>
          <li>To generate content that matches your unique voice</li>
          <li>To improve our AI models and service quality</li>
          <li>To maintain and secure your account</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information against unauthorized access,
          alteration, disclosure, or destruction. Your data is encrypted both in transit and at rest.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
        <p>
          You have the right to access, correct, or delete your personal data. You can also request a copy of your data
          or withdraw your consent at any time by contacting us.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at privacy@linkedinoptimizer.com.</p>
      </div>
    </div>
  )
}

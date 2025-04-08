export default function SecurityPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Security Information</h1>

      <div className="prose prose-blue max-w-none">
        <p className="text-lg mb-6">
          At LinkedIn Optimizer, we take your security and privacy seriously. This page explains how we protect your
          data and what you can do to keep your account secure.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">How We Protect Your Data</h2>

        <h3 className="text-xl font-medium mt-6 mb-3">Authentication</h3>
        <p>We use LinkedIn's OAuth 2.0 authentication protocol, which means:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>We never see or store your LinkedIn password</li>
          <li>You authenticate directly with LinkedIn</li>
          <li>You can revoke our access to your LinkedIn account at any time</li>
          <li>We only request the minimal permissions needed for the application to function</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">Data Security</h3>
        <p>Your data is protected using industry-standard security practices:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>All data is transmitted over secure HTTPS connections</li>
          <li>Access tokens are encrypted and stored securely</li>
          <li>We never store your access tokens in client-side code or localStorage</li>
          <li>Your data is only used for the specific features you've requested</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Security Best Practices</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Always check that you're on our official website before signing in</li>
          <li>Be cautious of phishing attempts - we'll never ask for your LinkedIn password</li>
          <li>Regularly review the apps connected to your LinkedIn account</li>
          <li>Sign out when using shared or public computers</li>
          <li>Keep your browser and operating system updated</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Revoking Access</h2>
        <p>You can revoke our application's access to your LinkedIn account at any time:</p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Go to your LinkedIn account</li>
          <li>Click on "Me" &gt; "Settings & Privacy"</li>
          <li>Select "Data privacy" from the left menu</li>
          <li>Click on "Other applications"</li>
          <li>Find "LinkedIn Optimizer" and click "Remove"</li>
        </ol>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p>If you have any security concerns or questions, please contact us at security@linkedinoptimizer.com.</p>
      </div>
    </div>
  )
}

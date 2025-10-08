export default function PrivacyPolicy() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <header className="bg-secondary py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary">Privacy Policy</h1>
          <p className="mt-2 text-lg text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              BITPANDA PRO ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Services. By using our Services, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may collect information about you in a variety of ways. The information we may collect on the Service includes:
            </p>
            <h3 className="text-xl font-semibold mb-2">Personal Data</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Personally identifiable information, such as your name, email address, telephone number, and government-issued identification (for KYC purposes) that you voluntarily give to us when you register for an account or when you choose to participate in various activities related to the Service.
            </p>
            <h3 className="text-xl font-semibold mb-2">Financial Data</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Financial information, such as data related to your bank account or payment card, that we may collect when you link a payment method to your account. We also collect information about your transactions on the platform, including deposits, withdrawals, and trades.
            </p>
            <h3 className="text-xl font-semibold mb-2">Usage Data</h3>
            <p className="text-muted-foreground leading-relaxed">
              Information that your browser sends whenever you visit our Service. This may include information such as your computer's Internet Protocol (IP) address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other statistics.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              Having accurate information permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Service to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>Create and manage your account.</li>
              <li>Process your transactions and send you related information, including confirmations and invoices.</li>
              <li>Comply with legal and regulatory obligations (e.g., anti-money laundering).</li>
              <li>Monitor and analyze usage and trends to improve your experience with the Service.</li>
              <li>Notify you about changes to our Service.</li>
              <li>Provide customer support.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Your Data Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              Depending on your jurisdiction, you may have the following rights regarding your personal data:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>The right to access – You have the right to request copies of your personal data.</li>
              <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate.</li>
              <li>The right to erasure – You have the right to request that we erase your personal data, under certain conditions.</li>
              <li>The right to restrict processing – You have the right to request that we restrict the processing of your personal data, under certain conditions.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4">6. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions or concerns about this Privacy Policy, please contact our Data Protection Officer at <a href="mailto:privacy@bitpanda-pro.com" className="text-primary hover:underline">privacy@bitpanda-pro.com</a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

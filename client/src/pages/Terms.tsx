export default function TermsOfService() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <header className="bg-secondary py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary">Terms of Service</h1>
          <p className="mt-2 text-lg text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to BITPANDA PRO! These Terms of Service ("Terms") govern your use of our cryptocurrency trading platform, website, and associated services (collectively, the "Services"). By creating an account or using our Services, you agree to be bound by these Terms, our Privacy Policy, and all applicable laws and regulations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Eligibility</h2>
            <p className="text-muted-foreground leading-relaxed">
              You must be at least 18 years old and have the legal capacity to enter into a binding contract to use our Services. You may not use our Services if you are located in a jurisdiction where access to or use of our Services is prohibited. You are responsible for ensuring your use of the Services is compliant with all local laws and regulations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. User Account</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              To access most features of our Services, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to keep your account information updated. You are responsible for safeguarding your account password and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We may require you to complete identity verification (KYC) procedures before you can use certain features of the Services. This may include providing personal identification documents.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Risk Disclosure</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Trading cryptocurrencies involves significant risk and may not be suitable for all investors. The market is highly volatile, and you could lose all or a substantial amount of your investment. You should carefully consider your investment objectives, level of experience, and risk appetite before trading.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              BITPANDA PRO does not provide investment advice. Any information provided through our Services is for informational purposes only and should not be construed as a recommendation to buy or sell any digital asset.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Prohibited Activities</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree not to engage in any of the following prohibited activities:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>Using the Services for any illegal purpose, including financing of terrorism or money laundering.</li>
              <li>Engaging in any activity that could harm, disable, or impair the functioning of our Services.</li>
              <li>Using any automated means (e.g., bots, scrapers) to access the Services without our express written permission.</li>
              <li>Attempting to gain unauthorized access to our systems or another user's account.</li>
              <li>Engaging in market manipulation, such as pump-and-dump schemes, wash trading, or spoofing.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All content and materials on our platform, including the BITPANDA PRO logo, design, text, graphics, and other files, are the property of BITPANDA PRO or our licensors and are protected by intellectual property laws. You are granted a limited, non-exclusive license to access and use the Services for your personal, non-commercial use.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the fullest extent permitted by law, BITPANDA PRO shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms at any time. We will provide notice of any changes by posting the new Terms on our website and updating the "Last updated" date. Your continued use of the Services after any such change constitutes your acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms, please contact us at <a href="mailto:legal@bitpanda-pro.com" className="text-primary hover:underline">legal@bitpanda-pro.com</a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

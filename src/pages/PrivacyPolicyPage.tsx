
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Privacy Policy for WaveMentor</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <h2>1. Introduction</h2>
          <p>Welcome to WaveMentor. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.</p>
          
          <h2>2. What Information Do We Collect?</h2>
          <p>We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website or otherwise when you contact us.</p>
          <p>The personal information that we collect depends on the context of your interactions with us and the Website, the choices you make and the products and features you use. The personal information we collect may include the following:</p>
          <ul>
            <li>Email Address</li>
            <li>Full Name</li>
            <li>Session and usage data (via your consents)</li>
          </ul>

          <h2>3. How Do We Use Your Information?</h2>
          <p>We use personal information collected via our Website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
          
          <h2>4. Will Your Information Be Shared With Anyone?</h2>
          <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
          
          <h2>5. Your Privacy Rights</h2>
          <p>You have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability. You can manage your data from the Privacy Settings page.</p>

          <h2>6. Data Retention</h2>
          <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements). Inactive user accounts and associated data are automatically purged after two years.</p>
          
          <h2>7. Contact Us</h2>
          <p>If you have questions or comments about this policy, you may email us at privacy@wavementor.com</p>

        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicyPage;

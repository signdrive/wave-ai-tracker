
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20">
      <NavBar />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-ocean-dark">Privacy Policy</CardTitle>
              <p className="text-gray-600">Last updated: December 2023</p>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
              <p className="mb-4">
                At WaveFinder, we collect information to provide better services to our users. We collect information in the following ways:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li><strong>Account Information:</strong> When you create an account, we collect your email address, username, and profile information.</li>
                <li><strong>Location Data:</strong> With your permission, we collect location data to provide personalized surf spot recommendations and local conditions.</li>
                <li><strong>Surf Session Data:</strong> We store your logged surf sessions, including spots visited, session duration, and personal ratings.</li>
                <li><strong>Device Information:</strong> We collect information about your device, browser, and how you interact with our service.</li>
                <li><strong>Camera and Media:</strong> If you upload photos or videos, we store this content to enhance your surf log experience.</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
              <p className="mb-4">We use the collected information for the following purposes:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Provide personalized surf forecasts and spot recommendations</li>
                <li>Enable booking of wave pool sessions and surf lessons</li>
                <li>Analyze surf conditions using AI-powered camera feeds</li>
                <li>Improve our services and develop new features</li>
                <li>Send you notifications about surf conditions and bookings</li>
                <li>Provide customer support and respond to your inquiries</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">3. Information Sharing</h2>
              <p className="mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information in the following limited circumstances:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li><strong>Service Providers:</strong> We work with trusted third-party providers for payment processing, analytics, and cloud storage.</li>
                <li><strong>Wave Pool Partners:</strong> When booking sessions, we share necessary information with our partner wave pools.</li>
                <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights and safety.</li>
                <li><strong>Aggregated Data:</strong> We may share anonymized, aggregated data for research and industry insights.</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Security</h2>
              <p className="mb-6">
                We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Your Rights and Choices</h2>
              <p className="mb-4">You have the following rights regarding your personal information:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Access and download your data</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and data</li>
                <li>Opt-out of marketing communications</li>
                <li>Control location data sharing</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Cookies and Tracking</h2>
              <p className="mb-6">
                We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie settings through your browser preferences.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">7. Children's Privacy</h2>
              <p className="mb-6">
                Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">8. International Data Transfers</h2>
              <p className="mb-6">
                Your information may be processed and stored in countries other than your own. We ensure appropriate safeguards are in place for international data transfers.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">9. Changes to This Policy</h2>
              <p className="mb-6">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <ul className="list-none mb-6">
                <li>Email: privacy@wavefinder.com</li>
                <li>Address: 123 Ocean Drive, Surf City, CA 90210</li>
                <li>Phone: (555) 123-WAVE</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;

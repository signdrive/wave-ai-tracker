
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20">
      <NavBar />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-ocean-dark">Terms of Service</CardTitle>
              <p className="text-gray-600">Last updated: December 2023</p>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="mb-6">
                By accessing and using WaveFinder ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">2. Description of Service</h2>
              <p className="mb-4">
                WaveFinder is a comprehensive surf platform that provides:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Real-time surf conditions and forecasts</li>
                <li>AI-powered wave analysis from surf cameras</li>
                <li>Wave pool booking and reservation services</li>
                <li>Surf session logging and tracking</li>
                <li>Community features and spot recommendations</li>
                <li>Integration with surf-related wearable devices</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts and Registration</h2>
              <p className="mb-4">
                To access certain features of the Service, you must register for an account. When registering, you agree to:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your account information</li>
                <li>Keep your password secure and confidential</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">4. User Conduct and Responsibilities</h2>
              <p className="mb-4">You agree not to use the Service to:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>Upload false or misleading surf condition reports</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Attempt to gain unauthorized access to other accounts</li>
                <li>Use the Service for illegal or unauthorized purposes</li>
                <li>Violate any local, state, national, or international laws</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Share inappropriate content or spam</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Booking and Payment Terms</h2>
              <p className="mb-4">
                For wave pool bookings and paid services:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>All prices are subject to change without notice</li>
                <li>Payment is required at time of booking</li>
                <li>Cancellation policies vary by venue and are clearly stated</li>
                <li>Refunds are processed according to the specific venue's policy</li>
                <li>You are responsible for any applicable taxes or fees</li>
                <li>We reserve the right to refuse service</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Intellectual Property Rights</h2>
              <p className="mb-6">
                The Service and its original content, features, and functionality are owned by WaveFinder and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">7. User-Generated Content</h2>
              <p className="mb-4">
                By uploading content to WaveFinder, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content. You retain ownership of your content and can remove it at any time.
              </p>
              <p className="mb-6">
                You are solely responsible for your content and warrant that it does not violate any third-party rights or applicable laws.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">8. Safety and Assumption of Risk</h2>
              <p className="mb-6">
                <strong>IMPORTANT:</strong> Surfing and water activities involve inherent risks. WaveFinder provides information and booking services but does not guarantee safety. Users participate in surf activities at their own risk and should always prioritize safety, check local conditions, and follow proper safety protocols.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">9. Disclaimers and Limitation of Liability</h2>
              <p className="mb-4">
                The Service is provided "as is" without warranties of any kind. WaveFinder disclaims all warranties, express or implied, including but not limited to:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>Accuracy of surf forecasts and conditions</li>
                <li>Availability of booking services</li>
                <li>Uninterrupted or error-free service operation</li>
                <li>Security of data transmission</li>
              </ul>
              <p className="mb-6">
                WaveFinder shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">10. Privacy</h2>
              <p className="mb-6">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">11. Termination</h2>
              <p className="mb-6">
                We reserve the right to terminate or suspend your account and access to the Service at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">12. Changes to Terms</h2>
              <p className="mb-6">
                We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page. Your continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">13. Governing Law</h2>
              <p className="mb-6">
                These Terms are governed by and construed in accordance with the laws of California, United States, without regard to its conflict of law provisions.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">14. Contact Information</h2>
              <p className="mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <ul className="list-none mb-6">
                <li>Email: legal@wavefinder.com</li>
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

export default TermsOfServicePage;

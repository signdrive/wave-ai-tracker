
import React from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CookiePolicyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean/5 to-sand/20">
      <NavBar />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-ocean-dark">Cookie Policy</CardTitle>
              <p className="text-gray-600">Last updated: December 2023</p>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. What Are Cookies</h2>
              <p className="mb-6">
                Cookies are small text files that are placed on your device when you visit our website. They are widely used to make websites work more efficiently and to provide information to website owners. WaveFinder uses cookies to enhance your browsing experience and provide personalized surf content.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Cookies</h2>
              <p className="mb-4">
                WaveFinder uses cookies for the following purposes:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li><strong>Essential Cookies:</strong> Required for basic website functionality, user authentication, and security</li>
                <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our website and identify areas for improvement</li>
                <li><strong>Functionality Cookies:</strong> Remember your preferences, such as language settings and favorite surf spots</li>
                <li><strong>Analytics Cookies:</strong> Provide insights into website usage patterns and help us optimize our services</li>
                <li><strong>Advertising Cookies:</strong> Used to deliver relevant advertisements and measure campaign effectiveness</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">3. Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Essential Cookies</h3>
              <p className="mb-4">These cookies are necessary for the website to function properly:</p>
              <ul className="list-disc pl-6 mb-6">
                <li><strong>Session Cookies:</strong> Maintain your login state and shopping cart contents</li>
                <li><strong>Security Cookies:</strong> Protect against cross-site request forgery and other security threats</li>
                <li><strong>Load Balancing Cookies:</strong> Ensure optimal website performance</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Performance and Analytics Cookies</h3>
              <p className="mb-4">These cookies help us understand website usage:</p>
              <ul className="list-disc pl-6 mb-6">
                <li><strong>Google Analytics:</strong> Tracks page views, user sessions, and traffic sources</li>
                <li><strong>Heat Mapping:</strong> Shows how users interact with different page elements</li>
                <li><strong>Error Tracking:</strong> Helps us identify and fix technical issues</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Functionality Cookies</h3>
              <p className="mb-4">These cookies enhance your user experience:</p>
              <ul className="list-disc pl-6 mb-6">
                <li><strong>Preference Cookies:</strong> Remember your surf spot preferences and notification settings</li>
                <li><strong>Language Cookies:</strong> Store your selected language and regional settings</li>
                <li><strong>Location Cookies:</strong> Remember your preferred location for personalized forecasts</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Advertising and Marketing Cookies</h3>
              <p className="mb-4">These cookies are used for targeted advertising:</p>
              <ul className="list-disc pl-6 mb-6">
                <li><strong>Third-party Advertising:</strong> Enable personalized ads from our partners</li>
                <li><strong>Social Media Cookies:</strong> Allow sharing content on social platforms</li>
                <li><strong>Conversion Tracking:</strong> Measure the effectiveness of our marketing campaigns</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">4. Third-Party Cookies</h2>
              <p className="mb-4">
                We work with trusted third-party services that may set their own cookies:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li><strong>Google Analytics:</strong> Web analytics service</li>
                <li><strong>Stripe:</strong> Payment processing for wave pool bookings</li>
                <li><strong>Supabase:</strong> Backend services and authentication</li>
                <li><strong>Social Media Platforms:</strong> Facebook, Instagram, Twitter integration</li>
                <li><strong>Weather Services:</strong> Surf forecast and condition data providers</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Managing Your Cookie Preferences</h2>
              <p className="mb-4">
                You have control over cookies and can manage them in several ways:
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Browser Settings</h3>
              <p className="mb-4">Most browsers allow you to:</p>
              <ul className="list-disc pl-6 mb-6">
                <li>View and delete cookies</li>
                <li>Block cookies from specific websites</li>
                <li>Block third-party cookies</li>
                <li>Clear all cookies when you close the browser</li>
                <li>Set warnings before cookies are stored</li>
              </ul>

              <h3 className="text-xl font-semibold mt-6 mb-3">Cookie Preference Center</h3>
              <p className="mb-6">
                You can manage your cookie preferences through our Cookie Preference Center, accessible from our website footer. This allows you to opt-out of non-essential cookies while keeping essential functionality intact.
              </p>

              <h3 className="text-xl font-semibold mt-6 mb-3">Opt-Out Links</h3>
              <p className="mb-4">You can opt-out of specific third-party services:</p>
              <ul className="list-disc pl-6 mb-6">
                <li><a href="https://tools.google.com/dlpage/gaoptout" className="text-ocean hover:underline">Google Analytics Opt-out</a></li>
                <li><a href="https://www.facebook.com/help/568137493302217" className="text-ocean hover:underline">Facebook Cookie Controls</a></li>
                <li><a href="https://optout.aboutads.info/" className="text-ocean hover:underline">Digital Advertising Alliance Opt-out</a></li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Cookie Retention</h2>
              <p className="mb-4">
                Different cookies have different lifespans:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Remain on your device for a set period (typically 30 days to 2 years)</li>
                <li><strong>Essential Cookies:</strong> May persist longer to maintain security and functionality</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">7. Impact of Disabling Cookies</h2>
              <p className="mb-4">
                Disabling certain cookies may affect your experience:
              </p>
              <ul className="list-disc pl-6 mb-6">
                <li>You may need to log in repeatedly</li>
                <li>Personalized surf recommendations may not work</li>
                <li>Some features may not function properly</li>
                <li>You may see less relevant advertisements</li>
                <li>Website performance analytics may be impacted</li>
              </ul>

              <h2 className="text-2xl font-semibold mt-8 mb-4">8. Updates to This Policy</h2>
              <p className="mb-6">
                We may update this Cookie Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on our website and updating the "Last updated" date.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about our Cookie Policy or how we use cookies, please contact us at:
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

export default CookiePolicyPage;

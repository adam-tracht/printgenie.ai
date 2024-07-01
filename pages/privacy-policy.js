// pages/privacy-policy.js
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Head>
        <title>Privacy Policy - CanvasGenie.ai</title>
        <meta name="description" content="Privacy Policy for CanvasGenie.ai" />
      </Head>
      
      <Header />

      <main className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-white mb-8">Privacy Policy</h1>
          
          <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Data Collection and Usage</h2>
            <p className="mb-4">
              At CanvasGenie.ai, we are committed to protecting your privacy and ensuring transparency in our data practices. This policy outlines how we collect and use data to improve our services and your experience.
            </p>

            <h3 className="text-xl font-semibold mb-2">Microsoft Clarity and Microsoft Advertising</h3>
            <p className="mb-4">
              We partner with Microsoft Clarity and Microsoft Advertising to capture how you use and interact with our website through behavioral metrics, heatmaps, and session replay to improve and market our products/services. Website usage data is captured using first and third-party cookies and other tracking technologies to determine the popularity of products/services and online activity. Additionally, we use this information for site optimization, fraud/security purposes, and advertising.
            </p>

            <h3 className="text-xl font-semibold mb-2">How We Use Clarity</h3>
            <p className="mb-4">
              Microsoft Clarity is a user behavior analytics tool that helps us understand how visitors interact with our website. It provides us with valuable insights through:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Session Replays: Anonymous recordings of user interactions, helping us identify usability issues and improve the user experience.</li>
              <li>Heatmaps: Visual representations of where users click, scroll, and spend time on our pages, allowing us to optimize our layout and content.</li>
              <li>Usage Metrics: Data on page views, device types, and user behavior patterns to inform our design and functionality decisions.</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">Data We Capture</h3>
            <p className="mb-4">
              Through Clarity, we capture the following types of data:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Mouse movements, clicks, and scrolls</li>
              <li>Pages visited and time spent on each page</li>
              <li>Device and browser information</li>
              <li>Geographic location (country and city level only)</li>
            </ul>
            <p className="mb-4">
              This data is used to improve our website user interface, identify and fix bugs, and enhance the overall user experience of CanvasGenie.ai.
            </p>

            <h3 className="text-xl font-semibold mb-2">Your Rights and Choices</h3>
            <p className="mb-4">
              You have the right to opt-out of data collection by Microsoft Clarity. You can do this by disabling cookies in your browser or by using browser extensions designed to block tracking scripts.
            </p>

            <h3 className="text-xl font-semibold mb-2">More Information</h3>
            <p className="mb-4">
              For more information about how Microsoft collects and uses your data, please visit the{' '}
              <a href="https://privacy.microsoft.com/en-us/privacystatement" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                Microsoft Privacy Statement
              </a>.
            </p>

            <h3 className="text-xl font-semibold mb-2">Contact Us</h3>
            <p className="mb-4">
              If you have any questions or concerns about our privacy practices, please contact us at{' '}
              <a href="mailto:privacy@canvasgenie.ai" className="text-purple-400 hover:text-purple-300">
                privacy@canvasgenie.ai
              </a>.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 mt-12 py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-400">
          <p>© 2023 CanvasGenie.ai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;
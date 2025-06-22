'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import logo from '@/assets/logo.png'; 

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter(); 

  const handleLoginClick = () => {
    setLoading(true);
    router.push('/login'); 
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 sm:p-8">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-center w-full max-w-7xl bg-white dark:bg-gray-800 py-10 px-6 sm:px-12 rounded-4xl shadow-xl dark:shadow-2xl dark:shadow-gray-500"> 
        <div className="mb-8 md:mb-0 md:w-1/3 flex flex-col items-center md:items-start text-center md:text-left md:pr-8">
          <p className="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-gray-100 leading-tight">DTU TNP</p>
          <p className="text-3xl sm:text-4xl font-semibold text-gray-700 dark:text-gray-200 mb-6 leading-tight">Student Data Portal</p>
          <Image 
            className="mx-auto md:mx-0 rounded-full border-4 border-gray-500 dark:border-gray-400 shadow-lg transition-transform transform hover:scale-105 duration-300" 
            src={logo} 
            alt="DTU Logo" 
            width={200} 
            height={200} 
          />
          <button
            disabled={loading}
            onClick={handleLoginClick}
            className={`mt-8 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-opacity-50 transition duration-300 ease-in-out ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? "Redirecting..." : "Go to Login"}
          </button>
        </div>

        {/* Right Section: Welcome Message, Features, Walkthrough, and Login Button */}
        <div className='w-full md:w-2/3 text-center md:text-left md:pl-8'>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            Welcome to the Student Data Sharing Portal
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-4">
            This portal enables secure, controlled sharing of student data via unique, time-limited links.
            It features an administrator panel for link generation and a public-facing view for data access.
          </p>
          <div className="text-gray-600 dark:text-gray-300 text-sm sm:text-base mb-6">
            <p className="font-semibold mb-2">Built with modern web technologies including:</p>
            <ul className="list-disc list-inside ml-4 sm:ml-6 mt-2 text-left space-y-1">
              <li><b>Next.js 14</b> (App Router) for robust architecture</li>
              <li><b>React</b> for dynamic user interfaces</li>
              <li><b>TypeScript</b> for type safety</li>
              <li><b>Tailwind CSS</b> for responsive styling</li>
              <li><b>Axios</b> for API communication</li>
              <li><b>Zod</b> for data validation</li>
            </ul>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-md mb-8">
            Please log in to access the admin panel and manage shareable links.
          </p>

          {/* Application Walkthrough Section */}
          <h2 className="text-2xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 border-b-2 border-gray-200 dark:border-gray-700 pb-2">Application Walkthrough</h2>
          <ol className="text-gray-600 dark:text-gray-300 text-sm sm:text-base space-y-4">
              <li><h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-2">1. Home Page (<code className="bg-gray-200 dark:bg-gray-700 dark:text-gray-200 px-1 rounded">/</code>)</h3>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Upon launching the application, you'll land on a welcome page.</li>
                      <li>It provides a brief introduction to the portal.</li>
                      <li>Click the "Go to Login" button to proceed to the administrator login page.</li>
                  </ul>
              </li>
              <li><h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-2">2. Admin Login (<code className="bg-gray-200 dark:bg-gray-700 dark:text-gray-200 px-1 rounded">/login</code>)</h3>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>This is the entry point for administrators.</li>
                      <li><strong>Login Credentials (Mock API):</strong>
                          <ul className="list-disc list-inside ml-4 space-y-1">
                              <li><strong>Username:</strong> <code className="bg-gray-200 dark:bg-gray-700 dark:text-gray-200 px-1 rounded">user@example.com</code></li>
                              <li><strong>Password:</strong> <code className="bg-gray-200 dark:bg-gray-700 dark:text-gray-200 px-1 rounded">password123</code></li>
                          </ul>
                      </li>
                      <li>Enter the credentials and click "Login".</li>
                      <li>Successful login will redirect you to the Admin Panel. If login fails, an error message will be displayed.</li>
                  </ul>
              </li>
              <li><h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-2">3. Admin Panel (<code className="bg-gray-200 dark:bg-gray-700 dark:text-gray-200 px-1 rounded">/admin</code>)</h3>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>This is a protected route, accessible only after successful login.</li>
                      <li>Here, you can:
                          <ul className="list-disc list-inside ml-4 space-y-1">
                              <li><strong>Generate Shareable Link:</strong> Click the "Generate Shareable Link" button. The application will make an API call to obtain a unique share token.</li>
                              <li><strong>Copy Link:</strong> Once generated, the shareable link will be displayed. Click "Copy Link" to copy it to your clipboard.</li>
                          </ul>
                      </li>
                      <li>If your access token expires, the application will attempt to refresh it automatically using your refresh token. If refresh fails, you'll be logged out.</li>
                      <li><strong>Logout:</strong> Click the "Logout" button to clear your session and return to the login page.</li>
                  </ul>
              </li>
              <li><h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-2">4. Public Share Page (<code className="bg-gray-200 dark:bg-gray-700 dark:text-gray-200 px-1 rounded">/share/:token</code>)</h3>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>This page is publicly accessible and does not require a login.</li>
                      <li>Paste the copied shareable link (from the Admin Panel) into your browser's address bar and press Enter.</li>
                      <li>The page will fetch and display the associated student data in a table.</li>
                      <li><strong>Filter by Email:</strong> Use the "Filter by Email" input field to dynamically narrow down the displayed student records based on their email addresses.</li>
                      <li>Error messages will be displayed if the share link is invalid, expired, or if no data is found.</li>
                  </ul>
              </li>
          </ol>

        </div>
      </div>
    </div>
  );
}

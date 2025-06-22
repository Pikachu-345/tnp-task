'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const [loading,setLoading] = useState<boolean>(false);
  const router = useRouter(); 

  const handleLoginClick = () => {
    setLoading(true);
    router.push('/login'); 
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-lg text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to the Student Data Sharing Portal
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          This portal allows administrators to securely share student data via unique, time-limited links.
        </p>
        <p className="text-gray-600 text-md mb-8">
          Please log in to access the admin panel and generate shareable links.
        </p>
        <button
          disabled={loading}
          onClick={handleLoginClick}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
        >
          {loading? "Redirecting.." : "Go to Login"}
        </button>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { generateShareTokenApi, refreshAccessTokenApi } from '@/services/api';
import { json } from 'stream/consumers';

export default function AdminPanelPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [copiedMessageVisible, setCopiedMessageVisible] = useState<boolean>(false); // New state for copied message

  useEffect(() => {
    const storedAccessToken = sessionStorage.getItem('accessToken');
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
      setIsAuthenticated(true);
    } else {
      router.replace('/login');
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken'); 
    sessionStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  const handleCopyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setCopiedMessageVisible(true);
      setTimeout(() => {
        setCopiedMessageVisible(false);
      }, 2000); 
    }
  };

  const generateShareToken = async () => {
    if (!accessToken) {
      setError('Not authenticated. Please log in again.');
      router.replace('/login');
      return;
    }

    setLoading(true);
    setError(null);
    setShareLink(null);
    setCopiedMessageVisible(false);

    try {
      const shareResponseData = await generateShareTokenApi(accessToken);
      
      let shareToken = null;
      shareToken = shareResponseData.shareToken;

      if (shareToken) {
        const baseUrl = window.location.origin;
        setShareLink(`${baseUrl}/share/${shareToken}`);
      } else {
        throw new Error('API did not return a share token in the expected format.');
      }

    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            setError('Access token expired. Attempting to refresh...');
            try {
              const refreshResponseData = await refreshAccessTokenApi(refreshToken);

              const newAccessToken = refreshResponseData.accessToken;
              const newRefreshToken = refreshResponseData.refreshToken;

              if (newAccessToken && newRefreshToken) {
                sessionStorage.setItem('accessToken', newAccessToken);
                localStorage.setItem('refreshToken', newRefreshToken);
                setAccessToken(newAccessToken); 
                setError(null); 

                await generateShareToken(); 
                return; 
              } else {
                throw new Error('Refresh token API did not return new tokens.');
              }
            } catch (refreshErr: any) {
              setError('Failed to refresh token. Please log in again.');
              handleLogout(); 
            }
          } else {
            setError('Authentication expired. No refresh token found. Please log in again.');
            handleLogout(); 
          }
        } else {
          setError(err.response?.data?.message || err.message || 'An error occurred while generating the share link.');
        }
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300">Checking authentication...</p>
      </div>
    );  
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-8 flex flex-col items-center">
      <div className="bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-3xl shadow-xl dark:shadow-xl dark:shadow-gray-600 w-full max-w-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4 sm:mb-0">Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-opacity-50 transition-colors duration-200"
          >
            Logout
          </button>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-6 text-base sm:text-lg">
          Click the button below to generate a unique, shareable link for student data.
        </p>

        <button
          onClick={generateShareToken}
          disabled={loading}
          className={`bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-opacity-50 transition-colors duration-200 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Generating Link...' : 'Generate Shareable Link'}
        </button>

        {shareLink && (
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-700 rounded-md shadow-inner dark:shadow-sm relative"> {/* Added relative for positioning pop-up */}
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Shareable Link:</h3>
            <p className="break-all text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 p-2 rounded font-mono text-sm sm:text-base">
              <a href={shareLink} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline transition-colors duration-200">
                {shareLink}
              </a>
            </p>
            <button
              onClick={handleCopyLink} // Use the new handler
              className="mt-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-1 px-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 focus:ring-opacity-50 transition-colors duration-200"
            >
              Copy Link
            </button>
            {copiedMessageVisible && (
              <span className="absolute -top-3 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-lg animate-fade-in-out">
                Copied!
              </span>
            )}
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-100 dark:bg-red-950 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded-md relative shadow-inner dark:shadow-sm" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}

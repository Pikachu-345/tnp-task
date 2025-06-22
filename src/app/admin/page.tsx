'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { generateShareTokenApi, refreshAccessTokenApi } from '@/services/api';

export default function AdminPanelPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

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

  const generateShareToken = async () => {
    if (!accessToken) {
      setError('Not authenticated. Please log in again.');
      router.replace('/login');
      return;
    }

    setLoading(true);
    setError(null);
    setShareLink(null);

    try {
      const shareResponseData = await generateShareTokenApi(accessToken);
      console.log("Share token API response:", shareResponseData);

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
        console.error('Axios error during share token generation:', err.response || err.message);
        if (err.response?.status === 401 || err.response?.status === 403) {
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            setError('Access token expired. Attempting to refresh...');
            try {
              const refreshResponseData = await refreshAccessTokenApi(refreshToken);
              console.log("Refresh token API response:", refreshResponseData);

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
              console.error('Error during token refresh:', refreshErr.response || refreshErr.message);
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
        console.error('Unexpected error generating share token:', err);
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Logout
          </button>
        </div>

        <p className="text-gray-700 mb-6">
          Click the button below to generate a unique, shareable link for student data.
        </p>

        <button
          onClick={generateShareToken}
          disabled={loading}
          className={`bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Generating Link...' : 'Generate Shareable Link'}
        </button>

        {shareLink && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Shareable Link:</h3>
            <p className="break-all text-blue-700 bg-blue-100 p-2 rounded">
              <a href={shareLink} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
                {shareLink}
              </a>
            </p>
            <button
              onClick={() => navigator.clipboard.writeText(shareLink)}
              className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-3 rounded text-sm focus:outline-none focus:shadow-outline"
            >
              Copy Link
            </button>
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
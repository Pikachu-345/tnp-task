'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import axios from 'axios'; 
import { loginUserApi } from '@/services/api';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof LoginFormInput, string>>>({});
  const [loginError, setLoginError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();

    setFormErrors({});
    setLoginError('');
    setLoading(true);

    try {
      loginSchema.parse({ username, password });

      const responseData = await loginUserApi(username, password);

      const { accessToken, refreshToken } = responseData; 

      if (accessToken && refreshToken) {
        console.log('Login successful! Access and refresh token obtained.');
        sessionStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        sessionStorage.setItem('isAuthenticated', 'true');
        router.push('/admin');
      } else {
        throw new Error('Login successful but no access or refresh token received.');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof LoginFormInput, string>> = {};
        error.errors.forEach(err => {
          if (err.path.length > 0) {
            newErrors[err.path[0] as keyof LoginFormInput] = err.message;
          }
        });
        setFormErrors(newErrors);
      } else if (axios.isAxiosError(error)) {
        if (error.response) {
          const message = error.response.data?.message || error.message || `Login failed with status: ${error.response.status}`;
          setLoginError(message);
        } else if (error.request) {
          setLoginError('No response from server. Please check your internet connection or try again later.');
        } else {
          setLoginError('An unexpected error occurred while setting up the login request.');
        }
        console.error('Axios login error:', error);
      } else if (error instanceof Error) {
        setLoginError(error.message);
      } else {
        setLoginError('An unexpected error occurred.');
        console.error('Login error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
              Username:
            </label>
            <input
              type="text"
              id="username"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.username ? 'border-red-500' : 'focus:border-blue-500'
              }`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {formErrors.username && (
              <p className="text-red-500 text-xs italic mt-1">{formErrors.username}</p>
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password:
            </label>
            <input
              type="password"
              id="password"
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
                formErrors.password ? 'border-red-500' : 'focus:border-blue-500'
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {formErrors.password && (
              <p className="text-red-500 text-xs italic mt-1">{formErrors.password}</p>
            )}
          </div>
          {loginError && <p className="text-red-500 text-xs italic mb-4 text-center">{loginError}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
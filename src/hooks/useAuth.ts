
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { STORAGE_KEYS } from '@/constants';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedAccessToken = sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []); 

  const login = useCallback((newAccessToken: string, newRefreshToken: string) => {
    sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
    setIsAuthenticated(true);
    setAccessToken(newAccessToken);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    setIsAuthenticated(false);
    setAccessToken(null);
    router.push('/login');
  }, [router]);

  const requireAuth = useCallback(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
        const storedAccessToken = sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (!storedAccessToken) {
            router.replace('/login');
        } else {
            setAccessToken(storedAccessToken);
            setIsAuthenticated(true);
        }
    }
  }, [isAuthenticated, router]);


  return { isAuthenticated, accessToken, login, logout, requireAuth };
}
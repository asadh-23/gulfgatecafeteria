'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { admin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !admin) {
      router.push('/login');
    }
  }, [admin, isLoading, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#121212] via-[#1A1A1A] to-[#121212]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FFC107] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Don't render protected content if not authenticated
  if (!admin) {
    return null;
  }

  // Render protected content
  return <>{children}</>;
}

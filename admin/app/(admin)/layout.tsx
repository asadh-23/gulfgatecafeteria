import Sidebar from '@/src/components/Sidebar';
import Header from '@/src/components/Header';
import { ToastProvider } from '@/src/components/ToastContainer';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#f4f6f8]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main area — offset by sidebar width */}
        <div className="ml-[240px]">
          {/* Header */}
          <Header />

          {/* Page Content — offset by header height */}
          <main className="pt-16 min-h-screen">
            <div className="p-6 animate-fadeIn">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

import Sidebar from '@/components/dashboard/Sidebar';
import MobileNav from '@/components/dashboard/MobileNav';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAFAF5]">
      {/* Desktop Sidebar */}
      <Sidebar companyName="TradeFlow Services" userName="Admin" syncStatus="online" />

      {/* Mobile Header */}
      <DashboardHeader syncStatus="online" />

      {/* Main Content */}
      <main className="lg:pl-64 pb-20 lg:pb-0">
        <div className="max-w-6xl mx-auto px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <MobileNav />
    </div>
  );
}

import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Sidebar } from '../components/Sidebar';
import { GlobalUpdateModal } from '../components/GlobalUpdateModal';
import { Button } from '../components/ui/button';
import { ChevronRight, PlusCircle, Menu } from 'lucide-react';

export const AppLayout = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Dynamic Breadcrumb Generator
  const getBreadcrumb = () => {
    if (!user) return 'Workspace';
    const role = user.role === 'ADMIN' ? 'Admin Gateway' : 'Agent Workspace';
    const path = location.pathname.split('/').pop() || 'dashboard';
    const viewMap: Record<string, string> = {
      'agent': 'My Fields',
      'history': 'Update History',
      'profile': 'My Profile',
      'admin': 'Overview',
      'agents': 'Agent Logistics',
    };
    return (
      <div className="flex items-center text-sm font-semibold tracking-tight">
        <span className="text-gray-400 hidden sm:inline">{role}</span>
        <ChevronRight className="w-3.5 h-3.5 mx-2 text-gray-300 hidden sm:inline" />
        <span className="text-gray-900">{viewMap[path] || 'Section'}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Global Floating Navbar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between shadow-sm shadow-gray-100/50">
           
           {/* Left: Hamburger + Breadcrumbs */}
           <div className="flex-1 min-w-0 flex items-center gap-3 pr-4">
             {/* Mobile hamburger */}
             <button 
               onClick={() => setIsSidebarOpen(true)} 
               className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
               aria-label="Open menu"
             >
               <Menu className="w-5 h-5" />
             </button>
             {getBreadcrumb()}
           </div>


           {/* Right: Actions */}
           <div className="flex items-center justify-end pl-4">
              {user?.role === 'AGENT' && (
               <>
                {/* Desktop button */}
                <Button 
                  onClick={() => setIsUpdateModalOpen(true)}
                  className="bg-linear-to-r from-[#a3e635] to-[#84cc16] hover:from-[#84cc16] hover:to-[#65a30d] text-gray-900 font-bold px-6 py-5 rounded-full shadow-md shadow-[#a3e635]/30 hidden sm:flex items-center gap-2 transition-all duration-300 transform hover:scale-[1.02] border border-[#a3e635]/50"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Submit Field Update</span>
                </Button>
                {/* Mobile FAB */}
                <Button 
                  onClick={() => setIsUpdateModalOpen(true)}
                  className="sm:hidden bg-primary text-white rounded-full w-10 h-10 p-0 shadow-md"
                  aria-label="Submit update"
                >
                  <PlusCircle className="w-5 h-5" />
                </Button>
               </>
             )}
           </div>
        </header>

        {/* Dynamic Context */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Global Modals */}
      <GlobalUpdateModal 
        isOpen={isUpdateModalOpen} 
        onClose={() => setIsUpdateModalOpen(false)} 
      />
    </div>
  );
};

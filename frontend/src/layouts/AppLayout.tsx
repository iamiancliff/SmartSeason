import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Sidebar } from '../components/Sidebar';
import { GlobalUpdateModal } from '../components/GlobalUpdateModal';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Bell, ChevronRight, User } from 'lucide-react';

export const AppLayout = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

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
      'directory': 'Field Directory',
      'agents': 'Agent Logistics',
    };
    return (
      <div className="flex items-center text-sm font-semibold tracking-tight">
        <span className="text-gray-400">{role}</span>
        <ChevronRight className="w-3.5 h-3.5 mx-2 text-gray-300" />
        <span className="text-gray-900">{viewMap[path] || 'Section'}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Global Floating Navbar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-6 sm:px-8 py-3 flex items-center justify-between shadow-sm shadow-gray-100/50">
           
           {/* Left: Breadcrumbs */}
           <div className="flex-1 min-w-0 flex items-center pr-4">
             {getBreadcrumb()}
           </div>

           {/* Center: Minimal Search */}
           <div className="flex-1 max-w-md hidden md:flex items-center">
             <div className="relative w-full group">
               <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#a3e635] transition-colors" />
               <Input 
                 placeholder="Search platform..." 
                 className="w-full bg-slate-100 border-transparent rounded-full h-9 pl-10 pr-4 text-sm focus-visible:ring-1 focus-visible:ring-[#a3e635] focus-visible:border-[#a3e635] hover:bg-slate-200/60 transition-colors"
               />
             </div>
           </div>

           {/* Right: Actions & Identity */}
           <div className="flex-1 flex items-center justify-end gap-5 pl-4">
             {user?.role === 'AGENT' && (
               <Button 
                 onClick={() => setIsUpdateModalOpen(true)}
                 className="bg-[#a3e635] hover:bg-[#84cc16] text-gray-900 font-bold px-4 h-9 shadow-sm shadow-[#a3e635]/20 hidden sm:flex"
               >
                 + Submit Update
               </Button>
             )}
             
             <div className="flex items-center gap-1.5 text-gray-400">
               <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-slate-100 hover:text-gray-900 rounded-full relative">
                 <Bell className="w-4 h-4" />
                 <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
               </Button>
             </div>

             <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200">
               <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-gray-500">
                 <User className="w-4 h-4" />
               </div>
               <span className="text-sm font-bold text-gray-900 hidden lg:block">{user?.name}</span>
             </div>
           </div>
        </header>

        {/* Dynamic Context */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
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

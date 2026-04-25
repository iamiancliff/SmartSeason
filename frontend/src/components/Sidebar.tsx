import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Leaf, LayoutDashboard, Users, LogOut, History, User, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const adminLinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Agents', path: '/admin/agents', icon: Users },
    { name: 'Profile', path: '/admin/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const agentLinks = [
    { name: 'My Fields', path: '/agent', icon: LayoutDashboard },
    { name: 'Update History', path: '/agent/history', icon: History },
    { name: 'Profile', path: '/agent/profile', icon: User },
  ];

  const links = user.role === 'ADMIN' ? adminLinks : agentLinks;

  const handleLinkClick = () => {
    // Close sidebar on mobile after navigation
    onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden" 
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "flex flex-col w-64 bg-white border-r border-gray-100 min-h-screen z-50 transition-transform duration-300 ease-in-out",
        // Mobile: fixed + slide in/out
        "fixed lg:sticky lg:top-0 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-white">
          <Link to="/dashboard" className="flex items-center gap-2" onClick={handleLinkClick}>
            <div className="bg-primary/10 p-1.5 rounded-lg">
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">SmartSeason</span>
          </Link>
          {/* Mobile close button */}
          <button onClick={onClose} className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Links */}
        <div className="flex-1 py-6 px-4 space-y-1">
          <div className="px-2 mb-4">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {user.role} VIEW
            </span>
          </div>
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-primary text-white shadow-sm shadow-primary/20" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <link.icon className={cn("w-4 h-4 mr-3", isActive ? "text-white" : "text-gray-400")} />
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* User Section bottom */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-neutral-200">
              {user.profilePhoto && (
                <AvatarImage src={user.profilePhoto} alt={user.name} />
              )}
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium text-gray-900 truncate">{user.name}</span>
              <span className="text-xs text-gray-500 truncate">{user.email}</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-center text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100" 
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </div>
      </div>
    </>
  );
};

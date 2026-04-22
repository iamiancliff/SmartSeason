import { useAuthStore } from '../stores/authStore';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { User, Mail, ShieldCheck, MapPin, Camera, KeyRound } from 'lucide-react';

export const AgentProfile = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  const displayLocation = user.location || 'Central Headquarters';

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Identity & Security</h1>
        <p className="text-gray-500 text-sm mt-1.5 font-medium">
          Manage your credentials, location details, and secure your access workflow.
        </p>
      </div>

      <Card className="border border-gray-200 shadow-xl shadow-gray-200/40 rounded-3xl bg-white overflow-hidden">
        {/* Banner with Avatar Overlay */}
        <div className="h-40 bg-zinc-900 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
           <div className="absolute -bottom-12 left-10 group cursor-pointer">
             <div className="w-28 h-28 bg-white border-4 border-white shadow-lg rounded-full flex justify-center items-center text-[#a3e635] relative overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <User size={56} strokeWidth={1.5} />
                
                {/* Edit Photo Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                   <Camera className="w-6 h-6 text-white mb-1" />
                   <span className="text-white text-[10px] font-bold uppercase tracking-wider">Edit Photo</span>
                </div>
             </div>
           </div>
        </div>

        <CardContent className="pt-20 pb-8 px-10 space-y-10">
          
          {/* Data Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-1.5 border-b border-gray-100 pb-4">
              <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Display Name
              </label>
              <div className="font-semibold text-gray-900 text-lg">
                {user.name}
              </div>
            </div>

            <div className="space-y-1.5 border-b border-gray-100 pb-4">
              <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email Address
              </label>
              <div className="font-semibold text-gray-900 text-lg">
                {user.email}
              </div>
            </div>

            <div className="space-y-1.5 border-b border-gray-100 pb-4">
              <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Access Role
              </label>
              <div className="font-semibold text-gray-900 text-lg">
                <span className="bg-[#a3e635]/20 text-[#65a30d] font-bold px-3 py-1 rounded-md text-sm border border-[#a3e635]/30">
                  {user.role}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 border-b border-gray-100 pb-4">
              <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Assignment Location
              </label>
              <div className="font-semibold text-gray-900 text-lg">
                {displayLocation}
              </div>
            </div>
          </div>

          {/* Security Zone */}
          <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-red-500" />
                  Password Management
                </h3>
                <p className="text-sm text-gray-500 mt-1 font-medium">Keep your account secure by rotating your password regularly.</p>
              </div>
              <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 font-semibold shrink-0">
                Change Password
              </Button>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

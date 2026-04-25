import { useState, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../api/auth.api';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { PasswordInput } from '../components/ui/password-input';
import { Label } from '../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import { User, Mail, ShieldCheck, Camera, KeyRound, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const AdminProfile = () => {
  const { user, updateUser, logout } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  if (!user) return null;



  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const updatedUser = await authApi.uploadPhoto(file);
      updateUser({ profilePhoto: updatedUser.profilePhoto });
      toast.success('Profile photo updated successfully');
    } catch (error) {
      toast.error('Failed to update profile photo');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsChangingPassword(true);
      await authApi.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      toast.success('Password changed successfully. Please log in again.');
      setIsPasswordModalOpen(false);
      setPasswordForm({ currentPassword: '', newPassword: '' });
      logout();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="border-b border-gray-100 pb-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Identity & Security</h1>
        <p className="text-gray-500 text-sm mt-1.5 font-medium">
          Manage your credentials, location details, and secure your access workflow.
        </p>
      </div>

      <Card className="border border-gray-200 shadow-xl shadow-gray-200/40 rounded-3xl bg-white overflow-hidden">
        {/* Clean Profile Header */}
        <div className="bg-linear-to-r from-gray-50 to-white border-b border-gray-100 px-10 py-10 flex items-center gap-8">
           <div className="group cursor-pointer relative shrink-0" onClick={() => fileInputRef.current?.click()}>
             <div className="w-32 h-32 bg-white border-4 border-white shadow-md rounded-full flex justify-center items-center text-[#a3e635] overflow-hidden transition-transform duration-300 group-hover:scale-105">
                {user.profilePhoto ? (
                  <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={64} strokeWidth={1.5} />
                )}
                
                {/* Edit Photo Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
                   {isUploading ? (
                     <Loader2 className="w-6 h-6 text-white mb-1 animate-spin" />
                   ) : (
                     <>
                       <Camera className="w-6 h-6 text-white mb-1" />
                       <span className="text-white text-[10px] font-bold uppercase tracking-wider">Edit Photo</span>
                     </>
                   )}
                </div>
             </div>
             <input 
               type="file" 
               className="hidden" 
               ref={fileInputRef} 
               accept="image/jpeg, image/png, image/webp" 
               onChange={handlePhotoUpload} 
             />
           </div>
           <div>
             <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{user.name}</h2>
             <p className="text-gray-500 font-medium mt-1">{user.email}</p>
             <div className="mt-3 inline-block bg-[#a3e635]/20 text-[#65a30d] font-bold px-3 py-1 rounded-full text-xs border border-[#a3e635]/30 uppercase tracking-wide">
               {user.role}
             </div>
           </div>
        </div>

        <CardContent className="pt-10 pb-8 px-10 space-y-10">
          
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
              <Button 
                variant="outline" 
                className="border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 font-semibold shrink-0"
                onClick={() => setIsPasswordModalOpen(true)}
              >
                Change Password
              </Button>
            </div>
          </div>

        </CardContent>
      </Card>
      {/* Change Password Dialog */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleChangePassword}>
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <PasswordInput 
                  id="currentPassword" 
                  value={passwordForm.currentPassword} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordForm({...passwordForm, currentPassword: e.target.value})} 
                  required 
                  disabled={isChangingPassword}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <PasswordInput 
                  id="newPassword" 
                  value={passwordForm.newPassword} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordForm({...passwordForm, newPassword: e.target.value})} 
                  required 
                  minLength={6}
                  disabled={isChangingPassword}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsPasswordModalOpen(false)} disabled={isChangingPassword}>
                Cancel
              </Button>
              <Button type="submit" disabled={isChangingPassword}>
                {isChangingPassword ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Update Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

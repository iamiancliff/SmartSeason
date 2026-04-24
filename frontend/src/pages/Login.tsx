import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff, Leaf, Mail, Lock } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role');
  const isAdmin = role === 'admin';
  
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const data = await authApi.login(email, password);
      setAuth(data.user, data.token);
      toast.success('Successfully logged in');
      
      // Explicit redirect based on role
      if (data.user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/agent', { replace: true });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-12 h-12 bg-[#a3e635]/20 text-[#a3e635] rounded-xl flex items-center justify-center mb-4">
          <Leaf size={24} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {isAdmin ? 'Admin Portal' : 'Agent Access'}
        </h1>
        <p className="text-gray-500 mt-2 font-medium">
          Sign in to your account
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Mail size={18} />
            </div>
            <Input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@smartseason.com"
              required
              autoComplete="email"
              disabled={isLoading}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="space-y-2 relative">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <Lock size={18} />
            </div>
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              disabled={isLoading}
              className="pl-10 pr-10"
            />
            <button 
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign in'
        )}
      </Button>

        <div className="text-center text-sm text-neutral-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Create one
          </Link>
        </div>
      </form>
    </div>
  );
};

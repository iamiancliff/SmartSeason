import { Outlet } from 'react-router-dom';
import { Leaf } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex bg-white font-sans text-gray-900">
      {/* Left side: Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-1/2 xl:w-[45%] lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md pt-8 lg:pt-0">     
          <div className="bg-white">
            <Outlet />
          </div>
        </div>
      </div>
      
      {/* Right side: Branding/Green Background */}
      <div className="hidden lg:block relative w-0 flex-1 bg-[#a3e635]">
        {/* Subtle background pattern or overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/5 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-gray-900">
          <div className="bg-white p-4 rounded-3xl shadow-xs mb-8">
            <Leaf className="w-16 h-16 text-[#a3e635]" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6 max-w-lg leading-tight">
             The Future of Farming Tech is Here.
          </h2>
          <p className="text-xl max-w-lg opacity-80 font-medium">
             Track field progress, monitor updates, and manage farming operations with clarity.
          </p>
        </div>
      </div>
    </div>
  );
};

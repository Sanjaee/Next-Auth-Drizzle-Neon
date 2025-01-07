import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingOverlay = ({ isLoading }:any) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred background overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      
      {/* Loading spinner */}
      <div className="relative z-10 flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
        <span className="text-sm font-medium text-white">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
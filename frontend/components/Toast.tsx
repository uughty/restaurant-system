import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // disappears after 3s
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className={`fixed bottom-8 right-8 p-4 rounded-xl shadow-xl text-black font-bold animate-slide-in ${bgColor}`}>
      {message}
    </div>
  );
}

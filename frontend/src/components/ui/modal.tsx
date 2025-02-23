import React, { useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  variant?: 'default' | 'alert';
  actions?: React.ReactNode;
}

/**
 * Base Modal component with responsive design and animations
 */
export function Modal({ isOpen, onClose, children, title, variant = 'default', actions }: ModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const isAlert = variant === 'alert';

  return (
    <div 
      className={`
        fixed inset-0 z-50 
        transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
        ${isAnimating ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none'}
      `}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`min-h-screen flex items-center justify-center p-4 ${isAlert ? 'md:items-start md:pt-[20vh]' : ''}`}>
        <div 
          className={`
            bg-white shadow-xl
            transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${isAlert 
              ? 'w-full max-w-md rounded-lg'
              : `
                w-full md:w-[36rem] md:rounded-lg md:max-h-[95vh]
                max-w-full h-full md:h-auto
                fixed bottom-0 md:relative
                rounded-t-[1.25rem] md:rounded-lg
              `
            }
            ${isAnimating 
              ? 'translate-y-0 opacity-100 scale-100' 
              : `
                ${isAlert
                  ? 'translate-y-4 opacity-0 scale-95'
                  : 'translate-y-full md:translate-y-8 opacity-0'
                }
              `
            }
          `}
        >
          {/* Header with slide-down animation */}
          <div 
            className={`
              flex justify-between items-center p-6 border-b border-gray-200
              transition-all duration-500 delay-100 ease-[cubic-bezier(0.22,1,0.36,1)]
              ${isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}
            `}
          >
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            {actions && (
              <div className="flex items-center space-x-2">
                {actions}
              </div>
            )}
          </div>

          {/* Content with fade-in animation */}
          <div 
            className={`
              p-6 
              ${!isAlert ? 'overflow-y-auto max-h-[calc(100vh-6rem)] md:max-h-[calc(95vh-6rem)]' : ''}
              transition-all duration-500 delay-200 ease-[cubic-bezier(0.22,1,0.36,1)]
              ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
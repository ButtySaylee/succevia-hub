'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function MobileDrawer({ isOpen, onClose, children }: MobileDrawerProps) {
  // Handle escape key to close drawer
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle touch events for swipe-to-close
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    const startX = touch.clientX;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const moveTouch = moveEvent.touches[0];
      const deltaX = moveTouch.clientX - startX;

      // If swiping left from the right edge, close drawer
      if (deltaX < -50 && startX > window.innerWidth * 0.7) {
        onClose();
        document.removeEventListener('touchmove', handleTouchMove);
      }
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  if (!isOpen) return null;

  return (
    <div className="mobile-drawer-overlay">
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="mobile-drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        onTouchStart={handleTouchStart}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Navigation</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
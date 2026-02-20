'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X } from 'lucide-react';

interface Popup {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  actionButtonText: string;
  actionButtonUrl: string;
  isActive: boolean;
}

export default function PopupDisplay() {
  const [popup, setPopup] = useState<Popup | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if popup has been dismissed by user
    const isDismissed = localStorage.getItem('livingrite_popup_dismissed');
    if (isDismissed) {
      setIsLoading(false);
      return;
    }

    // Track if we've shown popup this session
    const hasShown = localStorage.getItem('livingrite_popup_shown');
    
    // Wait 5 seconds before showing popup (let page load fully)
    const timer = setTimeout(async () => {
      try {
        const response = await fetch('/api/popups', {
          cache: 'no-store',
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.popup) {
            setPopup(data.popup);
            // Increment popup count
            await fetch(`/api/popups/${data.popup.id}/increment`, {
              method: 'PATCH',
            }).catch(err => console.error('Failed to increment popup count:', err));
            
            // Only auto-show if first visit this session
            if (!hasShown) {
              setIsVisible(true);
              localStorage.setItem('livingrite_popup_shown', 'true');
            } else {
              setIsVisible(false);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch popup:', error);
      } finally {
        setIsLoading(false);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Mark as dismissed - won't show again for 30 days
    localStorage.setItem('livingrite_popup_dismissed', 'true');
    // Also set expiry
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    localStorage.setItem('livingrite_popup_dismissal_date', expiryDate.toISOString());
  };

  if (!isVisible || !popup || isLoading) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ease-in-out"
        onClick={handleDismiss}
        aria-hidden="true"
      />

      {/* Popup Modal */}
      <div className="fixed inset-0 z-50 w-[100vw] flex items-center justify-center p-4 animate-fadeIn">
        <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden animate-slideUp">
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute cursor-pointer top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors z-10"
            aria-label="Close popup"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>

          {/* Image */}
          {popup.imageUrl && (
            <div className="relative w-full h-[50vh] overflow-hidden bg-gray-100">
              <Image
                src={popup.imageUrl}
                alt={popup.imageAlt || popup.title}
                fill
                className="object-contain"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{popup.title}</h2>
            
            {popup.description && (
              <p className="text-gray-600 text-sm mb-6">{popup.description}</p>
            )}

            {/* CTA Button */}
            <Link href={popup.actionButtonUrl} target='_blank'>
              <button className="w-full bg-primary hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105">
                {popup.actionButtonText}
              </button>
            </Link>

            {/* Dismiss hint */}
            {/* <p className="text-xs text-gray-400 text-center mt-4">
              You won't see this after you dismiss it. It will reappear after 30 days.
            </p> */}
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-in-out;
        }
      `}</style>
    </>
  );
}

// client/src/components/TheatreGalleryModal.tsx
import React, { useState } from 'react';
import { Theatre } from "@shared/schema";

interface TheatreGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  theatre: Theatre;
}

export default function TheatreGalleryModal({ isOpen, onClose, theatre }: TheatreGalleryModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!isOpen) return null;

  // SAFE ACCESS - critical fix for undefined additionalImages
  const additionalImages = theatre.additionalImages || [];
  const allImages = [theatre.imageUrl, ...additionalImages];

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % allImages.length);
  };

  const goToPrev = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + allImages.length) % allImages.length);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
        <div className="bg-theatre-charcoal rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-theatre-gold/20">
            <h3 className="font-display text-2xl font-semibold text-white">{theatre.name} - Gallery</h3>
            <button
              onClick={onClose}
              className="text-theatre-gold hover:text-white text-2xl font-bold transition-colors"
            >
              ×
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto">
            {/* Main image */}
            <div className="mb-6">
              <div className="relative group">
                <img
                  src={theatre.imageUrl}
                  alt={theatre.name}
                  className="w-full h-64 object-cover rounded-2xl cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => openLightbox(0)}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-2xl flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 text-sm bg-black bg-opacity-50 px-3 py-2 rounded-full">
                    Click to enlarge
                  </span>
                </div>
              </div>
            </div>

            {/* Additional images grid - only show if there are additional images */}
            {additionalImages.length > 0 && (
              <div>
                <h4 className="font-display text-lg font-medium mb-4 text-theatre-gold">Additional Photos</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {additionalImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`${theatre.name} ${index + 1}`}
                        className="w-full h-32 object-cover rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => openLightbox(index + 1)}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-xl" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Message if no additional images */}
            {additionalImages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400 text-lg">No additional photos available</p>
                <p className="text-gray-500 text-sm mt-2">Check back later for more images of this theatre</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox functionality */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white text-3xl z-60 bg-theatre-charcoal bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-75 transition-all"
          >
            ×
          </button>
          
          {allImages.length > 1 && (
            <>
              <button
                onClick={goToPrev}
                className="absolute left-6 text-white text-2xl z-60 bg-theatre-charcoal bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 transition-all"
              >
                ‹
              </button>
              
              <button
                onClick={goToNext}
                className="absolute right-6 text-white text-2xl z-60 bg-theatre-charcoal bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 transition-all"
              >
                ›
              </button>
            </>
          )}

          <div className="relative max-w-4xl max-h-full mx-4">
            <img
              src={allImages[currentImageIndex]}
              alt={`${theatre.name} ${currentImageIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm bg-theatre-charcoal bg-opacity-50 py-2 rounded-full">
              {currentImageIndex + 1} of {allImages.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

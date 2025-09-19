// client/src/components/theatre-card.tsx
import React, { useState } from 'react';
import { Theatre } from "@shared/schema";
import TheatreGalleryModal from './TheatreGalleryModal';

interface TheatreCardProps {
  theatre?: Theatre; // allow undefined for safety

}

export default function TheatreCard({ theatre }: TheatreCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!theatre) {
    // Render a skeleton or fallback if theatre is not loaded yet
    return (
      <div className="bg-theatre-charcoal rounded-3xl p-8 text-center text-gray-400">
        Loading theatre...
      </div>
    );
  }
  
  const handleBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

   // ✅ Safe access with fallback
  const additionalImages = theatre?.additionalImages ?? [];
  
  return (
    <>
      <div className="bg-theatre-charcoal rounded-3xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-2xl">
        {/* Image with click handler for gallery */}
        <div 
          className="relative cursor-pointer group"
          onClick={() => setIsModalOpen(true)}
        >
          <img 
            src={theatre.imageUrl || "/images/theatres/grand.jpg"} 
            alt={theatre.name || "Theatre"}  
            className="w-full h-64 object-cover" 
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
          {additionalImages.length > 0 && (
            <div className="absolute top-4 right-4 bg-theatre-gold bg-opacity-90 rounded-full px-3 py-1 text-sm font-semibold text-theatre-charcoal">
              +{additionalImages.length} photos
            </div>
          )}
        </div>
        
        <div className="p-8">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-display text-2xl font-semibold text-white">{theatre.name}</h3>
            <div className="text-theatre-gold text-sm">
              {Array.from({ length: Math.floor(parseFloat(theatre.rating || "0")) }, (_, i) => (
                <i key={i} className="fas fa-star"></i>
              ))}
              {parseFloat(theatre.rating || "0") % 1 !== 0 && <i className="fas fa-star-half-alt"></i>}
            </div>
          </div>
          <p className="text-gray-300 mb-6">{theatre.description || "No description available."}</p>
         
          <div className="space-y-3 mb-6">
            {(theatre.amenities ?? []).map((amenity, index) => (
              <div key={index} className="flex items-center text-sm text-gray-300">
                <i className="fas fa-check w-5 text-theatre-gold"></i>
                <span>{amenity}</span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <span className="text-3xl font-bold text-theatre-gold">
                {new Intl.NumberFormat("en-IN", { 
                  style: "currency", 
                  currency: "INR", 
                  maximumFractionDigits: 0 
                }).format(Number(theatre.basePrice ?? 0))}
              </span>
              <span className="text-gray-400 text-sm">/experience</span>
            </div>
            <button 
              className="gradient-gold text-theatre-black px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
              onClick={handleBooking}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      <TheatreGalleryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        theatre={{

          ...theatre,

          additionalImages

        }}
      />
    </>
  );
}

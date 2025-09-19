// client/src/components/TheatreGalleryModal.tsx
import React from "react";
import { Theatre } from "@shared/schema";

interface TheatreGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  theatre: Theatre & { additionalImages?: string[] };
}

export default function TheatreGalleryModal({
  isOpen,
  onClose,
  theatre,
}: TheatreGalleryModalProps) {
  if (!isOpen) return null;

  // ✅ Safe fallback for images
  const additionalImages = theatre?.additionalImages || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-5xl w-full relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          {theatre.name} – Gallery
        </h2>

        {/* Gallery Content */}
        {additionalImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {additionalImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${theatre.name} photo ${index + 1}`}
                className="rounded-lg object-cover w-full h-64 hover:scale-105 transition-transform duration-300"
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            No additional images available.
          </p>
        )}
      </div>
    </div>
  );
}

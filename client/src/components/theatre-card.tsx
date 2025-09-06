import { Theatre } from "@shared/schema";

interface TheatreCardProps {
  theatre: Theatre;
}

export default function TheatreCard({ theatre }: TheatreCardProps) {
  const handleBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-theatre-charcoal rounded-3xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300 shadow-2xl">
      <img 
        src={theatre.imageUrl} 
        alt={theatre.name} 
        className="w-full h-64 object-cover" 
      />
      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-display text-2xl font-semibold text-white">{theatre.name}</h3>
          <div className="text-theatre-gold text-sm">
            {Array.from({ length: Math.floor(parseFloat(theatre.rating)) }, (_, i) => (
              <i key={i} className="fas fa-star"></i>
            ))}
            {parseFloat(theatre.rating) % 1 !== 0 && <i className="fas fa-star-half-alt"></i>}
          </div>
        </div>
        <p className="text-gray-300 mb-6">{theatre.description}</p>
        
        <div className="space-y-3 mb-6">
          {theatre.amenities.map((amenity, index) => (
            <div key={index} className="flex items-center text-sm text-gray-300">
              <i className="fas fa-check w-5 text-theatre-gold"></i>
              <span>{amenity}</span>
            </div>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-3xl font-bold text-theatre-gold">{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Number(theatre.basePrice))}</span>

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
  );
}

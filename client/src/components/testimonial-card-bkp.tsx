interface TestimonialCardProps {
  rating: number;
  testimonial: string;
  customerName: string;
  location: string;
  imageUrl: string;
}

export default function TestimonialCard({ 
  rating, 
  testimonial, 
  customerName, 
  location, 
  imageUrl 
}: TestimonialCardProps) {
  return (
    <div className="bg-theatre-gray p-8 rounded-3xl">
      <div className="flex items-center mb-4">
        <div className="text-theatre-gold text-sm">
          {Array.from({ length: rating }, (_, i) => (
            <i key={i} className="fas fa-star"></i>
          ))}
        </div>
      </div>
      <p className="text-gray-200 mb-6 italic">"{testimonial}"</p>
      <div className="flex items-center">
        <img 
          src={imageUrl} 
          alt={customerName} 
          className="w-12 h-12 rounded-full object-cover" 
        />
        <div className="ml-4">
          <p className="font-semibold text-white">{customerName}</p>
          <p className="text-sm text-gray-400">{location}</p>
        </div>
      </div>
    </div>
  );
}

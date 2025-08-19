import { Package } from "@shared/schema";

interface PackageCardProps {
  package: Package;
}

export default function PackageCard({ package: pkg }: PackageCardProps) {
  return (
    <div className="bg-theatre-charcoal border border-theatre-gray rounded-3xl p-8 hover:border-theatre-gold transition-all duration-300">
      <div className="text-center">
        <div className="text-5xl mb-4 text-theatre-gold">
          <i className={pkg.icon}></i>
        </div>
        <h3 className="font-display text-2xl font-semibold mb-4 text-white">{pkg.name}</h3>
        <p className="text-gray-300 mb-6">{pkg.description}</p>
        
        <div className="space-y-3 mb-8 text-left">
          {pkg.features.map((feature, index) => (
            <div key={index} className="flex items-center text-sm text-gray-300">
              <i className="fas fa-check w-5 text-theatre-gold"></i>
              <span>{feature}</span>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <span className="text-3xl font-bold text-theatre-gold">
            +{formatINR(pkg.price)}
          </span>
          <p className="text-gray-400 text-sm mb-6">add-on package</p>
          <button 
            className="w-full border-2 border-theatre-gold text-theatre-gold py-3 rounded-full font-semibold hover:bg-theatre-gold hover:text-theatre-black transition-all"
            onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Add to Booking
          </button>
        </div>
      </div>
    </div>
  );
}

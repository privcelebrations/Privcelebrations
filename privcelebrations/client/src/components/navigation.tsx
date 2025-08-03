import { useState } from "react";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 glass-effect border-b border-theatre-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="font-cinzel text-2xl font-semibold text-theatre-gold">CinePrivé</h1>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#home" className="text-white hover:text-theatre-gold transition-colors">Home</a>
              <a href="#theatres" className="text-white hover:text-theatre-gold transition-colors">Theatres</a>
              <a href="#packages" className="text-white hover:text-theatre-gold transition-colors">Packages</a>
              <a href="#gallery" className="text-white hover:text-theatre-gold transition-colors">Gallery</a>
              <a href="#contact" className="text-white hover:text-theatre-gold transition-colors">Contact</a>
              <button 
                className="gradient-gold text-theatre-black px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all"
                onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Book Now
              </button>
            </div>
          </div>
          
          <div className="md:hidden">
            <button 
              className="text-white hover:text-theatre-gold"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-theatre-charcoal border-t border-theatre-gray">
            <a href="#home" className="block px-3 py-2 text-white hover:text-theatre-gold transition-colors">Home</a>
            <a href="#theatres" className="block px-3 py-2 text-white hover:text-theatre-gold transition-colors">Theatres</a>
            <a href="#packages" className="block px-3 py-2 text-white hover:text-theatre-gold transition-colors">Packages</a>
            <a href="#gallery" className="block px-3 py-2 text-white hover:text-theatre-gold transition-colors">Gallery</a>
            <a href="#contact" className="block px-3 py-2 text-white hover:text-theatre-gold transition-colors">Contact</a>
            <button 
              className="w-full mt-2 gradient-gold text-theatre-black px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all"
              onClick={() => {
                setIsMobileMenuOpen(false);
                document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

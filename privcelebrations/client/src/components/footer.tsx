export default function Footer() {
  return (
    <footer className="bg-theatre-charcoal border-t border-theatre-gray py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-cinzel text-3xl font-semibold text-theatre-gold mb-4">CinePrivé</h3>
            <p className="text-gray-300 mb-6 max-w-md">
             PriV Creating unforgettable private theatre experiences for parties, events, and special celebrations. 
              Where luxury meets entertainment.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-theatre-gold hover:text-white transition-colors text-xl">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-theatre-gold hover:text-white transition-colors text-xl">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-theatre-gold hover:text-white transition-colors text-xl">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-theatre-gold hover:text-white transition-colors text-xl">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-display text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-300 hover:text-theatre-gold transition-colors">Home</a></li>
              <li><a href="#theatres" className="text-gray-300 hover:text-theatre-gold transition-colors">Our Theatres</a></li>
              <li><a href="#packages" className="text-gray-300 hover:text-theatre-gold transition-colors">Packages</a></li>
              <li><a href="#gallery" className="text-gray-300 hover:text-theatre-gold transition-colors">Gallery</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-theatre-gold transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-display text-lg font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-theatre-gold transition-colors">Private Screenings</a></li>
              <li><a href="#" className="text-gray-300 hover:text-theatre-gold transition-colors">Birthday Parties</a></li>
              <li><a href="#" className="text-gray-300 hover:text-theatre-gold transition-colors">Corporate Events</a></li>
              <li><a href="#" className="text-gray-300 hover:text-theatre-gold transition-colors">Special Occasions</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-theatre-gray mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; 2025 PriV by PrivCelebrations.com. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
}

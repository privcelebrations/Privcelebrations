import { useEffect, useState } from "react";
import Navigation from "@/components/navigation";
import TheatreCard from "@/components/theatre-card";
import BookingForm from "@/components/booking-form";
import PackageCard from "@/components/package-card";
import TestimonialCard from "@/components/testimonial-card";
import Footer from "@/components/footer";
import WhatsAppButton from "@/components/whatsapp-button";
import { useQuery } from "@tanstack/react-query";
import { Theatre, Package } from "@shared/schema";
import { sendContact } from "@/lib/api";

export default function Home() {
  const { data: theatres = [], isLoading: theatresLoading } = useQuery<Theatre[]>({
    queryKey: ['/api/theatres'],
  });

  const { data: packages = [], isLoading: packagesLoading } = useQuery<Package[]>({
    queryKey: ['/api/packages'],
  });

  const [submittingContact, setSubmittingContact] = useState(false);
  useEffect(() => {
    // Smooth scrolling for navigation links
    const handleClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const element = document.querySelector(target.getAttribute('href')!);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    // Add scroll effect to navigation
    const handleScroll = () => {
      const nav = document.querySelector('nav');
      if (nav) {
        if (window.scrollY > 100) {
          nav.classList.add('backdrop-blur-lg');
        } else {
          nav.classList.remove('backdrop-blur-lg');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-theatre-black text-white">
      <Navigation />
      
      {/* Hero Section */}
      {/* Hero Section */}
<section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
  {/* Background */}
  <div 
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1489599735819-c4f67c14a5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
    }}
  />
  <div className="absolute inset-0 bg-gradient-to-r from-theatre-black via-theatre-black/70 to-transparent" />

  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    {/* Inline keyframes to avoid Tailwind purge */}
    <style>{`
      @keyframes shimmer {
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }
      @keyframes fadeInUp {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
    `}</style>

    {/* PRIV heading with shimmer */}
    <h1 className="font-display font-bold mb-4">
      <span
        className="inline-block text-[clamp(3rem,6vw,7rem)] bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-700 bg-[length:200%_auto] bg-clip-text text-transparent animate-[shimmer_3s_linear_infinite]"
      >
        PRIV
      </span>
      <br />
      <span
        className="text-[clamp(1.25rem,2vw,2rem)] text-white opacity-0 animate-[fadeInUp_1s_ease-out_forwards]"
        style={{ animationDelay: "0.5s" }}
      >
        Coolest Way to Celebrate!
      </span>
    </h1>

    <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed">
      Premium Private Theatre Experience! Host unforgettable parties, events, and get-togethers in our luxury theatre rooms
    </p>

    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button 
        className="gradient-gold text-theatre-black px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all animate-slide-up"
        onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <i className="fas fa-ticket-alt mr-2"></i>
        Book Your Experience
      </button>
      <button className="border-2 border-theatre-gold text-theatre-gold px-8 py-4 rounded-full text-lg font-semibold hover:bg-theatre-gold hover:text-theatre-black transition-all animate-slide-up">
        <i className="fas fa-play mr-2"></i>
        Watch Virtual Tour
      </button>
    </div>
  </div>

  {/* Scroll Indicator */}
  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
    <div className="w-6 h-10 border-2 border-theatre-gold rounded-full flex justify-center">
      <div className="w-1 h-3 bg-theatre-gold rounded-full mt-2 animate-pulse"></div>
    </div>
  </div>
</section>


      {/* Features Section */}
      <section className="py-20 bg-theatre-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-white">
              Why Choose <span className="text-theatre-gold">PriV</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Experience cinema like never before with our premium amenities and personalized service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-theatre-gray p-8 rounded-2xl hover:bg-theatre-gold hover:text-theatre-black transition-all duration-300 group">
              <div className="text-4xl mb-4 text-theatre-gold group-hover:text-theatre-black">
                <i className="fas fa-crown"></i>
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Premium Luxury</h3>
              <p className="text-gray-300 group-hover:text-theatre-black">Plush reclining seats, ambient lighting, and climate control for ultimate comfort</p>
            </div>

            <div className="bg-theatre-gray p-8 rounded-2xl hover:bg-theatre-gold hover:text-theatre-black transition-all duration-300 group">
              <div className="text-4xl mb-4 text-theatre-gold group-hover:text-theatre-black">
                <i className="fas fa-users"></i>
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Private Parties</h3>
              <p className="text-gray-300 group-hover:text-theatre-black">Perfect for birthdays, anniversaries, corporate events, and special celebrations</p>
            </div>

            <div className="bg-theatre-gray p-8 rounded-2xl hover:bg-theatre-gold hover:text-theatre-black transition-all duration-300 group">
              <div className="text-4xl mb-4 text-theatre-gold group-hover:text-theatre-black">
                <i className="fab fa-whatsapp"></i>
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Gaming </h3>
              <p className="text-gray-300 group-hover:text-theatre-black">Big screen. Next-gen power. Pure gaming euphoria.Just PlayStation perfection</p>
            </div>

            <div className="bg-theatre-gray p-8 rounded-2xl hover:bg-theatre-gold hover:text-theatre-black transition-all duration-300 group">
              <div className="text-4xl mb-4 text-theatre-gold group-hover:text-theatre-black">
                <i className="fas fa-film"></i>
              </div>
              <h3 className="font-display text-xl font-semibold mb-3">Latest Technology</h3>
              <p className="text-gray-300 group-hover:text-theatre-black">4K projection, Dolby Atmos sound, and streaming capabilities for any content</p>
            </div>
          </div>
        </div>
      </section>

      {/* Theatre Rooms Section */}
      <section id="theatres" className="py-20 bg-theatre-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-white">
              Our <span className="text-theatre-gold">Exclusive</span> Theatres
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose from our carefully curated selection of premium theatre rooms, each designed for unforgettable experiences
            </p>
          </div>

          {theatresLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-theatre-charcoal rounded-3xl overflow-hidden animate-pulse">
                  <div className="w-full h-64 bg-theatre-gray"></div>
                  <div className="p-8">
                    <div className="h-6 bg-theatre-gray rounded mb-4"></div>
                    <div className="h-4 bg-theatre-gray rounded mb-6"></div>
                    <div className="space-y-3 mb-6">
                      <div className="h-4 bg-theatre-gray rounded"></div>
                      <div className="h-4 bg-theatre-gray rounded"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="h-8 w-20 bg-theatre-gray rounded"></div>
                      <div className="h-10 w-24 bg-theatre-gray rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {theatres.map((theatre) => (
                <TheatreCard key={theatre.id} theatre={theatre} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-20 bg-theatre-charcoal">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-white">
              Book Your <span className="text-theatre-gold">Experience</span>
            </h2>
            <p className="text-xl text-gray-300">
              Reserve your private theatre experience in just a few simple steps
            </p>
          </div>

          <BookingForm theatres={theatres} packages={packages} />
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-20 bg-theatre-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-white">
              Experience <span className="text-theatre-gold">Packages</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Enhance your private theatre experience with our curated packages and add-ons
            </p>
          </div>

          {packagesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-theatre-charcoal border border-theatre-gray rounded-3xl p-8 animate-pulse">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-theatre-gray rounded-full mx-auto mb-4"></div>
                    <div className="h-6 bg-theatre-gray rounded mb-4"></div>
                    <div className="h-4 bg-theatre-gray rounded mb-6"></div>
                    <div className="space-y-3 mb-8">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="h-4 bg-theatre-gray rounded"></div>
                      ))}
                    </div>
                    <div className="h-8 bg-theatre-gray rounded mb-6"></div>
                    <div className="h-10 bg-theatre-gray rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} package={pkg} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-theatre-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-white">
              Experience <span className="text-theatre-gold">Gallery</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Step inside our luxurious private theatres and see the premium amenities that await you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Theatre Interior Images */}
            <div className="group relative overflow-hidden rounded-3xl bg-theatre-gray">
              <img 
                src="/images/theatres/overthemoon.jpg?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Imperial Suite Interior" 
                className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-theatre-black/80 via-transparent to-transparent">
                <div className="absolute bottom-6 left-6">
                  <h3 className="font-display text-xl font-semibold text-white mb-2">Imperial Suite</h3>
                  <p className="text-gray-300 text-sm">Luxury recliners & premium service</p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-theatre-gray">
              <img 
                src="/images/theatres/otm.jpg?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Velvet Amour Interior" 
                className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-theatre-black/80 via-transparent to-transparent">
                <div className="absolute bottom-6 left-6">
                  <h3 className="font-display text-xl font-semibold text-white mb-2">Velvet Amour</h3>
                  <p className="text-gray-300 text-sm">Intimate setting with love seats</p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-theatre-gray">
              <img 
                src="/images/theatres/grand.jpg?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Golden Imperial Interior" 
                className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-theatre-black/80 via-transparent to-transparent">
                <div className="absolute bottom-6 left-6">
                  <h3 className="font-display text-xl font-semibold text-white mb-2">Golden Imperial</h3>
                  <p className="text-gray-300 text-sm">Spacious tiered seating</p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-theatre-gray">
              <img 
                src="https://images.unsplash.com/photo-1440404653325-ab127d49abc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Premium Catering Service" 
                className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-theatre-black/80 via-transparent to-transparent">
                <div className="absolute bottom-6 left-6">
                  <h3 className="font-display text-xl font-semibold text-white mb-2">Premium Catering</h3>
                  <p className="text-gray-300 text-sm">Gourmet snacks & beverages</p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-theatre-gray">
              <img 
                src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Birthday Party Setup" 
                className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-theatre-black/80 via-transparent to-transparent">
                <div className="absolute bottom-6 left-6">
                  <h3 className="font-display text-xl font-semibold text-white mb-2">Party Celebrations</h3>
                  <p className="text-gray-300 text-sm">Custom decorations & themes</p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-theatre-gray">
              <img 
                src="https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Corporate Event Setup" 
                className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-theatre-black/80 via-transparent to-transparent">
                <div className="absolute bottom-6 left-6">
                  <h3 className="font-display text-xl font-semibold text-white mb-2">Corporate Events</h3>
                  <p className="text-gray-300 text-sm">Professional presentations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Virtual Tour Button */}
          <div className="text-center">
            <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-theatre-gold to-theatre-amber rounded-full hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <i className="fas fa-video mr-3 text-theatre-black"></i>
              <span className="text-theatre-black">Take a Virtual Tour</span>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
            <p className="text-gray-400 text-sm mt-4">Experience our theatres in 360° virtual reality</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-theatre-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-white">
              What Our <span className="text-theatre-gold">Guests</span> Say
            </h2>
            <p className="text-xl text-gray-300">
              Read about the unforgettable experiences our guests have enjoyed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              rating={5}
              testimonial="It was an amazing experience to celebrate here and it as the best place to celebrate and surprise parties with ur loved ones. The offers are in affordable budget,please don't miss the place if you want to give any surprise or any planned parties contact them to book your slot on planned date.Thank you PriV"
              customerName="Nikhil"
              location="Hyderabad"
              imageUrl="https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
            />
            <TestimonialCard
              rating={5}
              testimonial="Our Sons's 3rdth birthday party was incredible! The staff helped coordinate everything perfectly, and the birthday package was worth every penny."
              customerName="Yash"
	      location="Hyderabad"
              imageUrl="https://images.unsplash.com/photo-1494790108755-2616b612b2bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
            />
            <TestimonialCard
              rating={5}
              testimonial="The WhatsApp booking system made everything so easy! Quick responses and seamless coordination. The Velvet Amour was perfect for our team celebration."
              customerName="Vamsi"
              location="Hyderabad"
              imageUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-theatre-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-white">
              Get In <span className="text-theatre-gold">Touch</span>
            </h2>
            <p className="text-xl text-gray-300">
              Ready to create unforgettable memories? Contact us today to book your exclusive experience
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="text-theatre-gold text-2xl mt-1">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold mb-2 text-white">Visit Our Location</h3>
                  <p className="text-gray-300">3-9-585/1, 4th floor <br /> SBI Bank Building, beside KFC,<br />Saharastates Road, Balajinagar Rd,<br /> L B Nagar, Mansoorabad<br />Hyderabad, Telangana 500068<br />PrivCelebrations.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="text-theatre-gold text-2xl mt-1">
                  <i className="fas fa-phone"></i>
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold mb-2 text-white">Call Us</h3>
                  <p className="text-gray-300">+918297642050<br />Available 24/7</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="text-theatre-gold text-2xl mt-1">
                  <i className="fab fa-whatsapp"></i>
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold mb-2 text-white">WhatsApp Us</h3>
                  <p className="text-gray-300">+918297642050<br />Instant responses & booking assistance</p>
                  <WhatsAppButton 
                    className="mt-3 gradient-gold text-theatre-black px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all animate-pulse-gold"
                    message="Hi! I'm interested in booking a private theatre experience. Can you help me?"
                    showText={true}
                  />
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="text-theatre-gold text-2xl mt-1">
                  <i className="fas fa-clock"></i>
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold mb-2 text-white">Operating Hours</h3>
                  <p className="text-gray-300">Monday - Thursday: 9:00 AM - 11:30 PM<br />Friday - Sunday: 9:00 AM - 12:00 AM</p>
                </div>
              </div>
            </div>

            <div className="bg-theatre-charcoal rounded-3xl p-8">
              <h3 className="font-display text-2xl font-semibold mb-6 text-white">Quick Contact</h3>
              <form
                className="space-y-6"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget as HTMLFormElement;
                  const formData = new FormData(form);
                  const payload = Object.fromEntries(formData.entries()) as {
                    name?: string;
                    email?: string;
                    message?: string;
                  };

                  if (!payload.name || !payload.email || !payload.message) {
                    alert("Please fill in name, email and message.");
                    return;
                  }

                  try {
                    setSubmittingContact(true);
                    await sendContact(payload);
                    alert("Message sent — thank you! We'll get back to you soon.");
                    form.reset();
                  } catch (err) {
                    console.error("Contact submit error:", err);
                    alert("Failed to send message. Please try again later.");
                  } finally {
                    setSubmittingContact(false);
                  }
                }}
              >
                <div>
                  <input
                    name="name"
                    type="text"
                    placeholder="Your Name"
                    className="w-full bg-theatre-gray border border-theatre-gold rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-theatre-gold focus:border-transparent focus:outline-none"
                  />
                </div>
                <div>
                  <input
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    className="w-full bg-theatre-gray border border-theatre-gold rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-theatre-gold focus:border-transparent focus:outline-none"
                  />
                </div>
                <div>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Your Message"
                    className="w-full bg-theatre-gray border border-theatre-gold rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-theatre-gold focus:border-transparent resize-none focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submittingContact}
                  className={`w-full gradient-gold text-theatre-black py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all ${submittingContact ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  <i className="fas fa-paper-plane mr-2"></i>
                  {submittingContact ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}

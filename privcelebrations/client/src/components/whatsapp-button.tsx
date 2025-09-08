interface WhatsAppButtonProps {
  className?: string;
  message?: string;
  showText?: boolean;
  customText?: string;
}

export default function WhatsAppButton({ 
  className = "fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 animate-pulse-gold",
  message = "Hi! I'm interested in booking a private theatre experience. Can you help me?",
  showText = false,
  customText = "Chat Now"
}: WhatsAppButtonProps) {
  const whatsappNumber = "+918297642050"; // PrivCelebrations.com contact number
  
  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button className={className} onClick={handleWhatsAppClick}>
      <i className="fab fa-whatsapp text-2xl"></i>
      {showText && <span className="ml-2">{customText}</span>}
    </button>
  );
}

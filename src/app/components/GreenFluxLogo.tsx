export default function GreenFluxLogo({ className = "w-8 h-8 md:w-10 md:h-10" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Sun */}
        <circle cx="35" cy="25" r="12" fill="#F59E0B" />
        <rect x="32" y="8" width="6" height="8" rx="3" fill="#F59E0B" />
        <rect x="45" y="12" width="6" height="8" rx="3" fill="#F59E0B" transform="rotate(45 48 16)" />
        <rect x="45" y="28" width="6" height="8" rx="3" fill="#F59E0B" transform="rotate(90 48 32)" />
        <rect x="19" y="28" width="6" height="8" rx="3" fill="#F59E0B" transform="rotate(90 22 32)" />
        <rect x="19" y="12" width="6" height="8" rx="3" fill="#F59E0B" transform="rotate(-45 22 16)" />
        
        {/* Wrench */}
        <path d="M45 35 L65 55 L68 52 L58 42 L62 38 L68 44 L72 40 L58 26 L45 35Z" fill="#EA580C" />
        <circle cx="68" cy="44" r="3" fill="white" />
        
        {/* Shopping Cart */}
        <path d="M15 45 L20 45 L25 70 L70 70 L75 55 L30 55 L25 45 L85 45" 
              stroke="#059669" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="35" cy="80" r="4" fill="#059669" />
        <circle cx="60" cy="80" r="4" fill="#059669" />
      </svg>
    </div>
  );
} 
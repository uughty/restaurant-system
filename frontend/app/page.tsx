"use client";
import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { 
  Utensils, 
  Menu as MenuIcon, 
  X,
  Instagram,
  Facebook,
  Twitter,
  ChevronDown,
  ShoppingBag,
  Clock,
  MapPin,
  Star,
  ArrowRight,
  Quote,
  Calendar
} from 'lucide-react';

const App = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [localTime, setLocalTime] = useState("");

  // Update local restaurant time
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setLocalTime(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true,
        timeZone: 'Kenya/East_Africa' 
      }));
    };
    updateClock();
    const interval = setInterval(updateClock, 60000);
    return () => clearInterval(interval);
  }, []);

  // Intersection Observer for scroll reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  type NavItem = {
    name: string;
    href: string;
  };
  const navItems: NavItem[] = [
    { name: 'Home', href: '/' },
    { name: 'Experience', href: '/experience' },
    { name: 'Menu', href: '/menu' },
    { name: 'Reservations', href: '/reservation' },
  ];

  const scrollToSection = (id:string) => {
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
    setMobileMenuOpen(false);
  };

  const addToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#070707] text-stone-200 font-sans antialiased selection:bg-amber-500/30 text-[14px]">
      
      {/* HEADER */}
<header className="fixed top-0 w-full z-50 transition-all duration-500">
  {/* TOP INFO BAR */}
  <div
    className={`bg-[#0a0a0a] border-b border-white/5 overflow-hidden transition-all duration-500 ease-in-out hidden lg:block ${
      isScrolled ? "max-h-0 opacity-0" : "max-h-20 opacity-100 py-3"
    }`}
  >
    <div className="max-w-[1800px] mx-auto px-8 flex justify-between items-center text-[11px] xl:text-[12px] tracking-[0.25em] uppercase text-stone-400 font-bold">
      <div className="flex gap-8">
        <span className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-500/60" />
           Haile Selassie Avenue
Nairobi/Kenya
        </span>
        <span className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500/60" />
          EST Time: {localTime}
        </span>
      </div>

      <div className="flex gap-8">
        <a href="#" className="hover:text-amber-500 transition-colors">
          Gift Cards
        </a>
        <a href="#" className="hover:text-amber-500 transition-colors">
          Careers
        </a>
      </div>
    </div>
  </div>

  {/* MAIN NAV */}
  <nav
    className={`transition-all duration-500 ease-in-out ${
      isScrolled
        ? "bg-black/90 backdrop-blur-xl border-b border-white/5 py-4"
        : "bg-transparent py-8"
    }`}
  >
    <div className="max-w-[1400px] mx-auto px-8 flex justify-between items-center">
      {/* LOGO */}
      <div
        className="flex items-center gap-4 cursor-pointer group"
        onClick={() => scrollToSection("home")}
      >
        <div className="w-9 h-9 bg-amber-500 rounded-full flex items-center justify-center transition-transform duration-700 group-hover:rotate-[360deg]">
          <Utensils className="text-black w-5 h-5" />
        </div>
        <span className="text-2xl lg:text-3xl font-bold tracking-[0.4em] uppercase font-serif">
          Malivère
        </span>
      </div>

      {/* DESKTOP MENU */}
      <div className="hidden lg:flex items-center gap-12 text-[11px] xl:text-[12px] font-black tracking-[0.35em] uppercase">
 {navItems.map((item) => {
    const isActive = pathname === item.href;

    return (
      <Link
        key={item.name}
        href={item.href}
        className={`relative group py-1 transition-colors ${
          isActive
            ? 'text-amber-500'
            : 'text-stone-300 hover:text-amber-500'
        }`}
      >
        {item.name}
        <span
          className={`absolute bottom-0 left-0 h-[1px] bg-amber-500/60 transition-all duration-500 ${
            isActive ? 'w-full' : 'w-0 group-hover:w-full'
          }`}
        />
      </Link>
    );
  })}

        <div className="h-5 w-[1px] bg-white/10 mx-2"></div>

        {/* CART */}
        <button className="relative p-2 text-stone-300 hover:text-amber-500 transition-colors">
          <ShoppingBag className="w-5.5 h-5.5" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center leading-none">
              {cartCount}
            </span>
          )}
        </button>

        {/* RESERVE BUTTON */}
        <button
          onClick={() => scrollToSection("reserve")}
          className="bg-amber-600/10 border border-amber-600/30 text-amber-500 px-8 py-3 hover:bg-amber-600 hover:text-black transition-all duration-500 text-[11px] xl:text-[12px] tracking-[0.45em] font-black"
        >
          RESERVE
        </button>
      </div>

      {/* MOBILE MENU */}
      <div className="lg:hidden flex items-center gap-4">
        <button className="relative p-2 text-white" onClick={addToCart}>
          <ShoppingBag className="w-6 h-6" />
        </button>

        <button
          className="text-white p-2"
          onClick={() => setMobileMenuOpen(true)}
        >
          <MenuIcon className="w-7 h-7" />
        </button>
      </div>
    </div>
  </nav>
</header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[100] bg-[#070707] flex flex-col items-center justify-center gap-8 transition-all duration-700 ease-in-out ${mobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}>
        <button className="absolute top-8 right-8 p-2" onClick={() => setMobileMenuOpen(false)}>
          <X className="w-8 h-8 text-stone-500 hover:text-white" />
        </button>
        <div className="flex flex-col items-center gap-8">
          {navItems.map((item) => (
            <button key={item.name} onClick={() => scrollToSection(item.name.toLowerCase().replace(' ', ''))} className="text-4xl font-serif italic text-stone-200 hover:text-amber-500">
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80" className="w-full h-full object-cover brightness-[0.2] scale-105 animate-subtle-zoom" alt="Atmosphere" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <span className="text-amber-500 uppercase tracking-[0.8em] text-[10px] font-black mb-12 block opacity-0 animate-fade-in-up">
            A MICHELIN STARRED ODYSSEY
          </span>
          <h1 className="text-5xl md:text-[7.5rem] font-serif italic leading-[0.85] mb-12 opacity-0 animate-fade-in-up-delayed">
            The Art Of <br/>
            <span className="text-amber-500 not-italic tracking-tighter">Fine Dining</span>
          </h1>
          <div className="flex justify-center opacity-0 animate-fade-in-up-more-delayed">
            <button onClick={() => scrollToSection('menu')} className="group border border-white/10 bg-white/5 backdrop-blur-md text-white px-12 py-5 uppercase text-[9px] font-black tracking-[0.4em] hover:bg-amber-600 hover:text-black transition-all duration-500 flex items-center gap-4">
              Explore the Menu <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section id="experience" className="py-40 bg-[#070707] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-5 reveal relative group">
              <div className="relative aspect-[4/5] overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80" className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-[2.5s]" alt="Chef" />
                <div className="absolute inset-0 border border-white/5 m-4"></div>
              </div>
              <div className="absolute -bottom-8 -right-8 bg-amber-600 p-8 hidden xl:block animate-float shadow-2xl">
                <p className="text-black text-[9px] font-black uppercase tracking-[0.4em] mb-1">Culinarian</p>
                <h3 className="text-black text-2xl font-serif italic">Julian Vance</h3>
              </div>
            </div>
            <div className="lg:col-span-7 lg:pl-16 space-y-12">
              <div className="reveal space-y-6">
                <span className="text-amber-500 text-[10px] font-black tracking-[0.6em] uppercase flex items-center gap-4">
                  <div className="w-8 h-[1px] bg-amber-500/40"></div> THE VISION
                </span>
                <h2 className="text-5xl md:text-8xl font-serif italic leading-[1.0] text-white">
                  Heritage <br/> meets <span className="text-amber-500">Innovation</span>
                </h2>
              </div>
              <div className="reveal space-y-8">
                <div className="relative pl-8 border-l border-white/20">
                  <p className="text-stone-200 text-xl md:text-2xl leading-relaxed font-light italic">
                    "We don't just serve food; we compose experiences. Every plate is a study in 
                    biodiversity and a testament to the hands that tilled the soil."
                  </p>
                </div>
                <p className="text-stone-400 text-[15px] leading-relaxed max-w-xl font-light">
                  Malivère translates the ephemeral beauty of the seasons into a 12-course narrative. 
                  Our kitchen acts as a laboratory of flavor, utilizing exclusive ingredients from 
                  local biodynamic partners to create edible art.
                </p>
              </div>
              <div className="reveal grid grid-cols-2 gap-px bg-white/5 border border-white/5">
                <div className="bg-black p-10 group hover:bg-[#0c0c0c] transition-colors">
                  <span className="text-4xl font-serif italic text-amber-500 mb-4 block">03</span>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-2">Michelin Stars</h4>
                  <p className="text-stone-500 text-[12px] leading-relaxed">Three consecutive years of excellence.</p>
                </div>
                <div className="bg-black p-10 group hover:bg-[#0c0c0c] transition-colors">
                  <span className="text-4xl font-serif italic text-amber-500 mb-4 block">20+</span>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-2">Local Farmers</h4>
                  <p className="text-stone-500 text-[12px] leading-relaxed">Sustainable direct partnerships.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-40 bg-black border-y border-white/5">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-24 reveal">
            <span className="text-amber-500/60 text-[10px] tracking-[1em] uppercase mb-6 font-black block">Current Curation</span>
            <h2 className="text-5xl md:text-6xl font-serif italic text-white">Autumn Collection</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-x-24 gap-y-20">
            {[
              { name: "Wagyu Ribeye", price: "$84", desc: "Grade A5 beef, truffle butter, aged balsamic.", img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80", tag: "Signature" },
              { name: "Lobster Thermidor", price: "$62", desc: "Atlantic lobster, cognac cream, gruyère.", img: "https://images.unsplash.com/photo-1553247407-23251cecca19?auto=format&fit=crop&q=80" },
              { name: "Wild Mushroom", price: "$34", desc: "Porcini mushrooms, 24-month parmesan.", img: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80", tag: "Vegetarian" },
              { name: "Scallop Carpaccio", price: "$28", desc: "Sea scallops, lime zest, fermented chili.", img: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&q=80" }
            ].map((dish, idx) => (
              <div key={idx} className="reveal group flex flex-col sm:flex-row gap-8 items-start border-b border-white/5 pb-12 transition-all duration-500">
                <div className="w-full sm:w-36 aspect-square overflow-hidden relative shadow-xl">
                  <img src={dish.img} className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110 transition-all duration-700" alt={dish.name} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={addToCart} className="bg-white text-black px-4 py-2 text-[8px] font-black uppercase tracking-widest">Add to Order</button>
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-baseline">
                    <div className="flex items-center gap-4">
                      <h4 className="text-2xl font-serif italic text-white group-hover:text-amber-500 transition-colors">{dish.name}</h4>
                      {dish.tag && <span className="text-[7px] border border-amber-600/50 text-amber-500 px-2 py-0.5 uppercase tracking-widest font-black">{dish.tag}</span>}
                    </div>
                    <span className="text-amber-500 font-mono text-base font-bold">{dish.price}</span>
                  </div>
                  <p className="text-stone-500 text-[14px] font-light leading-relaxed">{dish.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reservation Section */}
      <section id="reserve" className="py-48 bg-[#070707] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-amber-500/[0.03] rounded-full blur-[140px] pointer-events-none"></div>
        <div className="max-w-3xl mx-auto px-8 relative">
          <div className="reveal text-center space-y-12">
            <div className="space-y-4">
              <span className="text-amber-500 text-[10px] tracking-[1em] uppercase font-black block">Exclusive Entry</span>
              <h2 className="text-5xl md:text-6xl font-serif italic text-white tracking-tight">Join Our Table</h2>
              <div className="w-16 h-[1px] bg-amber-600/30 mx-auto mt-8"></div>
            </div>
            
            <p className="text-stone-400 text-[14px] font-light tracking-wide max-w-md mx-auto leading-relaxed">
              Experience the pinnacle of fine dining. 
              <br/>We recommend booking at least 14 days in advance.
            </p>

            <div className="bg-white/[0.03] border border-white/5 p-10 md:p-16 backdrop-blur-md shadow-2xl">
              <div className="grid md:grid-cols-2 gap-8 mb-10">
                <div className="relative group text-left space-y-3">
                  <label className="text-[8px] uppercase tracking-[0.4em] text-stone-400 font-black pl-1">Preferred Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/60 pointer-events-none" />
                    <input type="date" className="w-full bg-black/60 border border-white/10 px-12 py-5 text-[11px] tracking-[0.2em] text-white outline-none focus:border-amber-600/50 transition-colors uppercase font-bold" />
                  </div>
                </div>
                <div className="relative group text-left space-y-3">
                  <label className="text-[8px] uppercase tracking-[0.4em] text-stone-400 font-black pl-1">Party Size</label>
                  <div className="relative">
                    <select className="w-full bg-black/60 border border-white/10 p-5 text-[11px] tracking-[0.2em] text-white outline-none focus:border-amber-600/50 transition-colors appearance-none uppercase cursor-pointer font-bold">
                      <option>2 Table Guests</option>
                      <option>4 Table Guests</option>
                      <option>Private Dining Suite</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/60 pointer-events-none" />
                  </div>
                </div>
              </div>
              
              <button className="w-full group relative overflow-hidden bg-amber-600 text-black py-6 text-[10px] font-black tracking-[0.5em] uppercase transition-all duration-700 hover:bg-white shadow-lg">
                <span className="relative z-10">Confirm Availability</span>
              </button>
            </div>
            
            <p className="text-[10px] text-stone-400 tracking-[0.3em] uppercase font-bold bg-white/5 inline-block px-6 py-3 border border-white/5">
              For parties larger than 6, please call our concierge directly.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black pt-32 pb-16 border-t border-white/5 relative">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid lg:grid-cols-12 gap-16 mb-24">
            
            <div className="lg:col-span-5 space-y-12 reveal">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                  <Utensils className="text-black w-4 h-4" />
                </div>
                <span className="text-xl font-bold tracking-[0.5em] uppercase font-serif text-white">Malivère</span>
              </div>
              <div className="max-w-sm space-y-6">
                <p className="text-[10px] uppercase tracking-[0.5em] text-white font-black">Stay Curated</p>
                <div className="flex border-b border-white/20 pb-4 group focus-within:border-amber-500 transition-colors">
                  <input type="email" placeholder="YOUR@EMAIL.COM" className="bg-transparent text-white outline-none flex-1 text-[11px] tracking-[0.2em] font-medium placeholder:text-stone-700" />
                  <button className="text-amber-500 group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8 reveal delay-100">
              <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Sitemap</h5>
              <ul className="space-y-4 text-stone-400 text-[11px] tracking-widest font-bold uppercase">
                {navItems.map(item => (
                  <li key={item.name}><button onClick={() => scrollToSection(item.name.toLowerCase().replace(' ', ''))} className="hover:text-amber-500 transition-colors">— {item.name}</button></li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-3 space-y-8 reveal delay-200">
              <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Nairobi</h5>
              <div className="space-y-4 text-stone-400 text-[11px] tracking-widest font-bold uppercase leading-loose">
                <p>Haile Selassie Avenue<br/>Nairobi/Kenya</p>
                <p className="text-amber-500 text-sm tracking-widest">+254750050171</p>
                <div className="pt-4 space-y-2 border-t border-white/5 mt-4">
                  <p className="text-stone-500 text-[10px] font-mono">TUE — THU 18:00 — 22:30</p>
                  <p className="text-stone-500 text-[10px] font-mono">FRI — SAT 17:30 — 23:30</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8 reveal delay-300 text-right">
              <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Connect</h5>
              <div className="flex gap-6 justify-end text-stone-400">
                <Instagram className="w-5 h-5 hover:text-amber-500 transition-colors cursor-pointer" />
                <Twitter className="w-5 h-5 hover:text-amber-500 transition-colors cursor-pointer" />
                <Facebook className="w-5 h-5 hover:text-amber-500 transition-colors cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[9px] tracking-[0.4em] text-stone-600 uppercase font-black">
            <p>© {new Date().getFullYear()} Malivère GASTRONOMY GROUP</p>
            <div className="flex gap-12">
              <a href="#" className="hover:text-stone-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-stone-400 transition-colors">Terms of Use</a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeInUp { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes subtleZoom {
          from { transform: scale(1.1); }
          to { transform: scale(1); }
        }
        @keyframes float {
         0%, 100% { transform: translateY(0px); }
         50% { transform: translateY(-10px); }
        }

        .animate-fade-in-up { animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in-up-delayed { animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 0; }
        .animate-fade-in-up-more-delayed { animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards; opacity: 0; }
        .animate-subtle-zoom { animation: subtleZoom 8s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }

        .reveal { opacity: 0; transform: translateY(30px); transition: all 1s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal-visible { opacity: 1; transform: translateY(0); }
        .delay-100 { transition-delay: 0.1s; }
        .delay-200 { transition-delay: 0.2s; }
        .delay-300 { transition-delay: 0.3s; }

        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #070707; }
        ::-webkit-scrollbar-thumb { background: #1a1a1a; }
        ::-webkit-scrollbar-thumb:hover { background: #amber-600; }

        input[type="date"]::-webkit-calendar-picker-indicator { 
          position: absolute; left: 0; top: 0; width: 100%; height: 100%;
          opacity: 0; cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default App;

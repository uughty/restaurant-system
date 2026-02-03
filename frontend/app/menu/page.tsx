'use client';
import React, { useState, useEffect, useMemo } from 'react';
import jallofImg from '../public/images/jallof.jpg';
import Link from "next/link";
import { 
  ChefHat, 
  ShoppingBag,
  Plus,
  X,
  ChevronRight,
  Instagram,
  Facebook,
  Twitter,
  ArrowUpRight,
  Minus,
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  Trash2,
  Utensils,
  MapPin,
  Phone,
  Mail,
  MoveRight,
  Wine,
  GlassWater,
  Flame,
  Droplets
} from 'lucide-react';


// ✅ TypeScript Interfaces
interface MenuItem {
  id: string;
  category: string;
  name: string;
  price: number;
  img: string;
  desc: string;
  qty?: number;
}

interface BookingData {
  date: string;
  time: string;
  guests: number;
  email: string;
}

const App = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [showCartOverlay, setShowCartOverlay] = useState<boolean>(false);
  const [reservationSuccess, setReservationSuccess] = useState<boolean>(false);
  
  // Reservation Form State
  const [bookingData, setBookingData] = useState<BookingData>({
    date: '',
    time: '19:00',
    guests: 2,
    email: ''
  });

  const categories: string[] = ['All', 'African', 'American', 'Indian', 'Chinese', 'European', 'Drinks'];

  const menuData: MenuItem[] = [
    { id: 'af1', category: 'African', name: 'Heritage Jollof Risotto', price: 42, img:"./images/jallof.jpg", desc: 'Smoked scotch bonnet reduction, gold-leaf plantain.' },
    { id: 'af2', category: 'African', name: 'Senegalese Thieboudienne', price: 48, img: "./images/senegalese.jpg", desc: 'Heritage red rice, break-apart grouper.' },
    { id: 'am1', category: 'American', name: 'Wagyu Gold Burger', price: 52, img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600", desc: 'A5 Wagyu, truffle-infused brioche, gold leaf.' },
    { id: 'am4', category: 'American', name: 'Prime Cowboy Ribeye', price: 88, img: "https://images.unsplash.com/photo-1546241072-48010ad2862c?auto=format&fit=crop&q=80&w=600", desc: '32oz dry-aged beef, bone marrow butter.' },
    { id: 'in1', category: 'Indian', name: 'Lobster Tandoor', price: 65, img: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=600", desc: 'Saffron foam, black garlic naan shards.' },
    { id: 'ch1', category: 'Chinese', name: 'Imperial Peking Duck', price: 58, img: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=600", desc: 'Plum air, cucumber-scallion julienne.' },
    { id: 'eu1', category: 'European', name: 'Truffle Tagliatelle', price: 45, img: "https://images.unsplash.com/photo-1556760544-74068565f05c?auto=format&fit=crop&q=80&w=600", desc: 'Hand-pulled pasta, Perigord black truffle, 36-month parm.' },
    { id: 'eu2', category: 'European', name: 'Chateaubriand for Two', price: 120, img: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&q=80&w=600", desc: 'Center-cut fillet, béarnaise, marrow-crusted potatoes.' },
    { id: 'dr1', category: 'Drinks', name: 'The Lumière Martini', price: 24, img: "https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&q=80&w=600", desc: 'Diamond-filtered vodka, gold-pressed olive essence.' },
     { id: 'dr1', category: 'African', name: 'South African Braii(Barbeque)', price: 24, img: "./images/braii.jpg", desc: 'a traditional South African social gathering centered around cooking food over a wood or charcoal fire.' },
     { id: 'dr1', category: 'Chinese', name: 'Kung Pao Chicken', price: 24, img: "./images/kungpao.jpg", desc: 'a classic Sichuan-style Chinese stir-fry dish featuring diced chicken, peanuts, vegetables, and dried chili peppers in a savory, sweet, and slightly sour sauce.' },
     { id: 'dr1', category: 'Chinese', name: 'Szechuan Cuisine', price: 24, img: "./images/Szechuan.jpg", desc: 'Spicy Szechuan chicken stir fry made with Szechuan (Sichuan) peppers for that tongue-tingling heat.' },
    
  
    
  ];

  interface BarCategory {
    name: string;
    icon: React.ReactNode;
    items: string[];
    img: string;
  }

  const barCategories: BarCategory[] = [
    { 
      name: "Signature Cocktails", 
      icon: <GlassWater className="w-5 h-5" />,
      items: ["Obsidian Old Fashioned", "Violet Saffron Sour", "Nitro Espresso Martini"],
      img: "./images/nonalco.jpg"
    },
    { 
      name: "Grand Crus & Vintages", 
      icon: <Wine className="w-5 h-5" />,
      items: ["Château Margaux 2010", "Dom Pérignon Plénitude", "Screaming Eagle"],
      img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800"
    },
    { 
      name: "Rare Spirits", 
      icon: <Flame className="w-5 h-5" />,
      items: ["Macallan 25 Year", "Clase Azul Ultra", "Louis XIII Cognac"],
      img: "./images/Azul.webp"
    }
  ];

  const galleryFood: string[] = [
    "./images/drinks.webp",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800",
    "./images/martins.jpg",
    "./images/ugali.jpg"
  ];

  const filteredItems = useMemo(() => {
    return activeCategory === 'All' ? menuData : menuData.filter(i => i.category === activeCategory);
  }, [activeCategory, menuData]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id ? {...i, qty: (i.qty || 0) + 1} : i
        );
      }
      return [...prev, {...item, qty: 1}];
    });
    setShowCartOverlay(true);
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(i => 
      i.id === id ? {...i, qty: Math.max(1, (i.qty || 1) + delta)} : i
    ).filter(i => i.qty && i.qty > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const cartTotal = cart.reduce((acc: number, curr: MenuItem) => 
    acc + (curr.price * (curr.qty || 1)), 0
  );

  const handleReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setReservationSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-serif flex overflow-x-hidden">
      
      {/* MAIN CONTENT AREA */}
      <div className="flex-grow h-screen overflow-y-auto custom-scroll relative scroll-smooth">
        
        {/* Nav */}
        <nav className={`fixed top-0 left-0 right-0 z-[120] transition-all duration-500 px-8 py-6 flex justify-between items-center ${isScrolled ? 'bg-black/90 backdrop-blur-xl py-4 border-b border-white/5' : 'bg-transparent'}`}>
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <ChefHat className="text-amber-500 w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-xl font-light tracking-[0.4em] uppercase">Malivère</span>
          </div>
          <div className="flex items-center gap-8 font-sans text-[10px] tracking-widest uppercase font-black text-stone-400">
            <a href="#menu" className="hover:text-amber-500 transition-colors duration-300">Menu</a>
            <a href="#bar" className="hover:text-amber-500 transition-colors duration-300">Bar</a>
            <a href="#chef" className="hover:text-amber-500 transition-colors duration-300">Chef</a>
            <Link
          href="/reservation#reservation-form"
          className="ml-6 text-amber-500 hover:text-amber-400 transition-colors duration-300"
        >
          Book
        </Link>
            
            <button 
              onClick={() => setShowCartOverlay(true)} 
              className="relative hover:text-amber-500 transition-colors duration-300 flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-600 text-black text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cart.length}
                </span>
              )}
            </button>
            <a href="#gallery" className="bg-amber-600 px-6 py-2.5 text-black hover:bg-white transition-all duration-300 font-bold rounded-sm">View Gallery</a>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=100&w=2000" 
            className="absolute inset-0 w-full h-full object-cover brightness-[0.5]" 
            alt="Hero Background" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black"></div>
          
          <div className="relative z-10 px-8 space-y-6 max-w-5xl">
            <div className="inline-block px-4 py-1 border border-amber-500/50 bg-black/40 backdrop-blur-sm mb-4">
              <span className="text-[10px] font-sans tracking-[0.6em] uppercase text-amber-500 font-bold">The Gastronomy Collection</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-light italic leading-[1.1] tracking-tight">
              Vibrant <span className="not-italic font-bold text-amber-600">Soul</span> In Every Detail.
            </h1>
            <p className="max-w-xl mx-auto font-sans text-stone-200 text-sm uppercase tracking-[0.3em] opacity-90 leading-relaxed drop-shadow-lg">
              Translating emotion into flavor, crafting a sensory dialogue between tradition and the avant-garde.
            </p>
          </div>
        </section>

        {/* Category Navigation */}
        <div className="relative bg-[#050505] z-[100]">
          <div className="sticky top-[72px] bg-[#050505]/95 backdrop-blur-md border-y border-white/5 py-6 overflow-x-auto no-scrollbar flex justify-center gap-10 px-8">
            {categories.map(cat => (
              <button 
                key={cat} 
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`font-sans text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-300 relative py-1 whitespace-nowrap ${
                  activeCategory === cat 
                    ? 'text-amber-500' 
                    : 'text-stone-500 hover:text-white'
                }`}
              >
                {cat}
                {activeCategory === cat && (
                  <span className="absolute bottom-0 left-0 w-full h-px bg-amber-500"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div id="menu" className="p-8 lg:p-20 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24 bg-[#050505]">
          {filteredItems.map(item => (
            <div key={item.id} className="flex flex-col md:flex-row gap-8 group">
              <div className="w-full md:w-56 h-56 overflow-hidden rounded-sm bg-stone-900 flex-shrink-0 relative">
                <img 
                  src={item.img} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 group-hover:brightness-110" 
                  alt={item.name} 
                />
                <div className="absolute top-4 left-4 bg-black/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-amber-500 tracking-tighter shadow-xl border border-white/10 italic">
                  ${item.price}
                </div>
              </div>
              <div className="flex flex-col justify-between py-1 flex-grow">
                <div>
                  <h3 className="text-4xl italic font-light mb-3 tracking-tighter group-hover:text-amber-500 transition-colors duration-300">
                    {item.name}
                  </h3>
                  <p className="text-stone-500 font-sans text-[11px] uppercase tracking-[0.2em] leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => addToCart(item)}
                    className="flex-grow group/btn relative flex items-center justify-between bg-transparent border border-white/20 px-6 py-4 overflow-hidden transition-all duration-500 hover:border-amber-500"
                  >
                    <div className="absolute inset-0 w-0 bg-amber-600 transition-all duration-500 group-hover/btn:w-full"></div>
                    <span className="relative z-10 font-sans font-black text-[10px] uppercase tracking-[0.3em] text-white group-hover/btn:text-black transition-colors">
                      Add Selection
                    </span>
                    <div className="relative z-10 w-6 h-6 rounded-full border border-white/20 group-hover/btn:border-black/20 flex items-center justify-center transition-all">
                      <Plus className="w-3 h-3 group-hover/btn:text-black transition-colors" />
                    </div>
                  </button>
                  <a href="#reserve" className="flex items-center justify-center w-14 h-14 border border-white/10 hover:border-amber-500 transition-colors duration-300">
                    <Calendar className="w-4 h-4 text-stone-500 hover:text-amber-500 transition-colors" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BAR SECTION */}
        <section id="bar" className="py-32 bg-[#0a0a0a] border-y border-white/5">
          <div className="px-8 lg:px-24 mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="space-y-4">
              <span className="text-amber-500 font-sans text-[10px] font-black tracking-[0.5em] uppercase flex items-center gap-3">
                <Wine className="w-4 h-4" /> The Reserve Program
              </span>
              <h2 className="text-6xl italic font-light">The <span className="font-bold not-italic text-amber-600">Liquid</span> Library</h2>
            </div>
            <p className="max-w-md text-stone-400 font-sans text-xs tracking-widest uppercase leading-loose opacity-70">
              A curated journey through ancestral vineyards and molecular mixology where color meets clarity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {barCategories.map((cat, i) => (
              <div key={i} className="relative group overflow-hidden h-[600px] border-r border-white/5 last:border-r-0">
                <img 
                  src={cat.img} 
                  className="absolute inset-0 w-full h-full object-cover brightness-[0.6] group-hover:brightness-[0.9] group-hover:scale-105 transition-all duration-3000" 
                  alt={cat.name} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                
                <div className="absolute inset-0 p-12 flex flex-col justify-end">
                  <div className="mb-8 flex items-center gap-4 text-amber-500">
                    {cat.icon}
                    <h3 className="text-2xl italic tracking-tighter">{cat.name}</h3>
                  </div>
                  
                  <ul className="space-y-4 mb-10 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                    {cat.items.map((item, idx) => (
                      <li key={idx} className="font-sans text-[10px] font-black tracking-[0.3em] uppercase text-stone-400 flex items-center gap-3">
                        <div className="w-1 h-1 bg-amber-500 rounded-full"></div> 
                        {item}
                      </li>
                    ))}
                  </ul>
                  
                  <button className="w-fit flex items-center gap-3 font-sans text-[11px] font-black tracking-[0.4em] uppercase text-white bg-amber-600/20 backdrop-blur-md px-6 py-3 border border-amber-600/30 hover:bg-amber-600 hover:text-black transition-all duration-300">
                    View Full List <MoveRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Transition Hero */}
        <div className="h-[60vh] relative overflow-hidden flex items-center justify-center">
          <img 
            src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1600" 
            className="absolute inset-0 w-full h-full object-cover brightness-[0.4]" 
            alt="Kitchen Atmosphere" 
          />
          <div className="relative z-10 text-center space-y-4 px-8">
            <h3 className="text-4xl italic font-light tracking-widest text-white/80 uppercase">
              Precision. Fire. Malivère.
            </h3>
            <div className="w-24 h-px bg-amber-600 mx-auto"></div>
          </div>
        </div>

        {/* Chef Section */}
        <section id="chef" className="py-32 px-8 lg:px-24 bg-[#080808]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center max-w-7xl mx-auto">
            <div className="relative group grid grid-cols-12 gap-4">
              <div className="col-span-4 self-end pb-12 z-20">
                <img 
                  src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&q=80&w=400" 
                  className="w-full aspect-square object-cover border-4 border-[#080808] hover:scale-110 transition-all duration-700 shadow-2xl rounded-sm" 
                  alt="Chef Plating" 
                />
              </div>
              <div className="col-span-12 relative">
                <div className="absolute -top-6 -left-6 w-full h-full border border-amber-600/20 translate-x-3 translate-y-3 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700"></div>
                <img 
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800" 
                  className="relative z-10 w-full aspect-[4/5] object-cover rounded-sm group-hover:brightness-110 transition-all duration-1000" 
                  alt="Executive Chef Profile" 
                />
              </div>
            </div>
            <div className="space-y-10">
              <div className="space-y-6">
                <span className="text-amber-500 font-sans text-xs tracking-[0.5em] uppercase font-bold">The Visionary</span>
                <h2 className="text-7xl italic font-light leading-tight">
                  Chef <span className="font-bold not-italic">Julian Rossi</span>
                </h2>
              </div>
              <p className="text-stone-400 font-sans text-base leading-loose tracking-wide opacity-80">
                Malivère is the culmination of three decades in Michelin-starred kitchens. Julian&apos;s philosophy is &quot;Flavor is the memory of the earth.&quot; We focus on pure ingredients and radical commitment to visual excellence.
              </p>
              <div className="pt-8 flex gap-16">
                <div className="space-y-2">
                  <p className="text-4xl font-bold italic tracking-tighter">24</p>
                  <p className="text-[10px] font-sans text-stone-600 uppercase tracking-widest font-black">Michelin Years</p>
                </div>
                <div className="space-y-2">
                  <p className="text-4xl font-bold italic tracking-tighter">12</p>
                  <p className="text-[10px] font-sans text-stone-600 uppercase tracking-widest font-black">Global Awards</p>
                </div>
              </div>
              <div className="p-8 bg-white/5 border-l-2 border-amber-600 italic text-stone-300 font-light">
                &quot;We don&apos;t just serve food; we serve the spectrum of light and shadow found in the natural world.&quot;
              </div>
            </div>
          </div>
        </section>

        {/* Reservation Section */}
        <section id="reserve" className="py-32 px-8 lg:px-24 bg-stone-950 border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20 space-y-6">
              <h2 className="text-7xl italic font-light">Secure Your <span className="font-bold not-italic">Place.</span></h2>
              <p className="text-stone-500 font-sans text-xs uppercase tracking-[0.5em]">Experience the light of gastronomy</p>
            </div>
            
            {reservationSuccess ? (
              <div className="bg-amber-600/5 border border-amber-600/20 p-16 text-center space-y-8 animate-in">
                <CheckCircle2 className="w-16 h-16 text-amber-500 mx-auto" />
                <h3 className="text-4xl italic font-light tracking-tight">Booking Request Sent</h3>
                <p className="font-sans text-sm text-stone-400 tracking-widest max-w-sm mx-auto leading-loose">
                  Confirmed for {bookingData.guests} guests on {bookingData.date} at {bookingData.time}.
                </p>
                <button 
                  type="button"
                  onClick={() => setReservationSuccess(false)} 
                  className="text-amber-500 underline text-[10px] uppercase tracking-[0.4em] font-sans font-black hover:text-white transition-colors duration-300"
                >
                  Start New Booking
                </button>
              </div>
            ) : (
              <form onSubmit={handleReservation} className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
                {/* Date Selection */}
                <div className="space-y-3">
                  <label className="text-[10px] text-stone-500 tracking-[0.3em] uppercase font-black flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> Preferred Date
                  </label>
                  <input 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-black border border-white/10 p-5 outline-none focus:border-amber-600 transition-colors duration-300 text-xs font-bold text-white" 
                    value={bookingData.date}
                    onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                    required 
                  />
                </div>

                {/* Time Selection */}
                <div className="space-y-3">
                  <label className="text-[10px] text-stone-500 tracking-[0.3em] uppercase font-black flex items-center gap-2">
                    <Clock className="w-3 h-3" /> Sitting Time
                  </label>
                  <select 
                    className="w-full bg-black border border-white/10 p-5 outline-none focus:border-amber-600 transition-colors duration-300 text-xs font-bold uppercase tracking-widest text-white appearance-none"
                    value={bookingData.time}
                    onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                  >
                    <option value="18:00">18:00 (Sunset Sitting)</option>
                    <option value="19:00">19:00</option>
                    <option value="20:00">20:00 (Grand Tasting)</option>
                    <option value="21:00">21:00</option>
                    <option value="22:00">22:00 (Late Night)</option>
                  </select>
                </div>

                {/* Guest Count */}
                <div className="space-y-3">
                  <label className="text-[10px] text-stone-500 tracking-[0.3em] uppercase font-black flex items-center gap-2">
                    <Users className="w-3 h-3" /> Party Size
                  </label>
                  <div className="flex items-center bg-black border border-white/10 p-2 rounded-sm">
                    <button 
                      type="button"
                      onClick={() => setBookingData({...bookingData, guests: Math.max(1, bookingData.guests - 1)})}
                      className="w-12 h-12 flex items-center justify-center hover:text-amber-500 transition-colors duration-300"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="flex-grow text-center text-xs font-bold uppercase tracking-wider">
                      {bookingData.guests} PEOPLE
                    </span>
                    <button 
                      type="button"
                      onClick={() => setBookingData({...bookingData, guests: Math.min(12, bookingData.guests + 1)})}
                      className="w-12 h-12 flex items-center justify-center hover:text-amber-500 transition-colors duration-300"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <label className="text-[10px] text-stone-500 tracking-[0.3em] uppercase font-black flex items-center gap-2">
                    <Mail className="w-3 h-3" /> Contact Email
                  </label>
                  <input 
                    type="email" 
                    placeholder="YOUR@EMAIL.COM" 
                    className="w-full bg-black border border-white/10 p-5 outline-none focus:border-amber-600 transition-colors duration-300 text-xs font-bold uppercase tracking-widest" 
                    value={bookingData.email}
                    onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                    required 
                  />
                </div>

                <button 
                  type="submit"
                  className="md:col-span-2 group relative bg-amber-600 py-7 text-black font-black uppercase tracking-[0.6em] text-[11px] overflow-hidden hover:bg-white transition-all duration-300"
                >
                  Confirm Reservation Request
                </button>
              </form>
            )}
          </div>
        </section>

        {/* GALLERY */}
        <section id="gallery" className="bg-[#050505] py-32 border-t border-white/5">
          <div className="px-8 lg:px-20 mb-16 text-center space-y-4">
            <span className="text-amber-500 font-sans text-[10px] font-black tracking-[0.6em] uppercase">Visual Journey</span>
            <h2 className="text-5xl italic font-light">The <span className="font-bold not-italic">Plating</span> Gallery</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-2">
            {galleryFood.map((src, idx) => (
              <div key={idx} className="relative overflow-hidden group aspect-[4/5]">
                <img 
                  src={src} 
                  className="w-full h-full object-cover transition-transform duration-2500 group-hover:scale-110 brightness-[0.8] group-hover:brightness-100" 
                  alt={`Gallery ${idx + 1}`} 
                />
                <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 transition-all duration-500 m-4"></div>
                <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Plus className="text-amber-500 w-6 h-6" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black pt-32 pb-16 px-8 lg:px-24 border-t border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-32 max-w-7xl mx-auto">
            <div className="col-span-1 md:col-span-2 space-y-10">
              <div className="flex items-center gap-4">
                <ChefHat className="text-amber-500 w-8 h-8" />
                <span className="text-3xl font-light tracking-[0.4em] uppercase">Lumière</span>
              </div>
              <p className="text-stone-500 font-sans max-w-md text-sm leading-relaxed tracking-wide">
                Experience culinary excellence in the heart of Paris. Open nightly from 18:00 to 02:00.
              </p>
            </div>
            <div className="space-y-8">
              <h4 className="text-[11px] font-black font-sans uppercase tracking-[0.5em] text-white/50">Navigation</h4>
              <div className="flex flex-col gap-5 font-sans text-xs text-stone-500 tracking-widest font-bold">
                <a href="#menu" className="hover:text-amber-500 transition-colors duration-300">MENU</a>
                <a href="#bar" className="hover:text-amber-500 transition-colors duration-300">BAR</a>
                <a href="#chef" className="hover:text-amber-500 transition-colors duration-300">CHEF</a>
                <a href="#gallery" className="hover:text-amber-500 transition-colors duration-300">VISUALS</a>
              </div>
            </div>
            <div className="space-y-8">
              <h4 className="text-[11px] font-black font-sans uppercase tracking-[0.5em] text-white/50">Address</h4>
              <div className="font-sans text-[10px] text-stone-500 tracking-widest font-black leading-loose">
                Haile Selassie Avenue
Nairobi/Kenya
              </div>
            </div>
          </div>
          <p className="text-center text-[8px] font-sans tracking-[0.8em] text-stone-800 uppercase">Malivère Gastronomy © 2026.</p>
        </footer>
      </div>

      {/* OVERLAY CART */}
      {showCartOverlay && (
        <div className="fixed inset-0 z-[200] flex justify-end bg-black/80 backdrop-blur-sm">
          <div 
            className="absolute inset-0" 
            onClick={() => setShowCartOverlay(false)}
          />
          <div className="relative w-full max-w-[420px] bg-stone-950 h-full shadow-2xl flex flex-col">
            <div className="p-12 border-b border-white/5 flex items-center justify-between sticky top-0 bg-stone-950 z-10">
              <div>
                <h2 className="text-4xl italic font-light tracking-tighter">My Selections</h2>
                <p className="text-[9px] font-sans font-black uppercase tracking-[0.5em] text-stone-700 mt-2">
                  {cart.length} items
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setShowCartOverlay(false)} 
                className="hover:rotate-90 transition-transform duration-300 p-2"
              >
                <X className="w-8 h-8 text-stone-500 hover:text-white" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-12 custom-scroll">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-10 space-y-6">
                  <Utensils className="w-16 h-16" />
                  <p className="text-[9px] font-sans font-black uppercase tracking-[0.8em]">Awaiting Selection</p>
                </div>
              ) : (
                <div className="space-y-10">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-6 group">
                      <img src={item.img} className="w-20 h-20 object-cover rounded-sm flex-shrink-0" alt={item.name} />
                      <div className="flex-grow space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="text-base italic font-light pr-4">{item.name}</h4>
                          <button 
                            type="button"
                            onClick={() => removeFromCart(item.id)} 
                            className="text-stone-800 hover:text-red-400 transition-colors duration-300 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4 bg-white/5 px-3 py-2 rounded-sm">
                            <button 
                              type="button"
                              onClick={() => updateQty(item.id, -1)}
                              className="p-1 hover:text-amber-500 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-[11px] font-black min-w-[1.5rem] text-center">
                              {item.qty}
                            </span>
                            <button 
                              type="button"
                              onClick={() => updateQty(item.id, 1)}
                              className="p-1 hover:text-amber-500 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-amber-600 font-bold text-lg">
                            ${(item.price * (item.qty || 1)).toFixed(0)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-12 bg-black border-t border-white/5">
                <div className="flex justify-between items-center mb-10">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-700">Total</span>
                  <span className="text-5xl font-light text-amber-500 tracking-tighter">
                    ${cartTotal.toFixed(0)}
                  </span>
                </div>
                <button className="w-full bg-white text-black py-7 font-sans font-black text-[11px] uppercase tracking-[0.5em] hover:bg-amber-600 transition-all duration-300 rounded-sm">
                  Proceed To Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;700;800&display=swap');
        
        body { 
          font-family: 'Playfair Display', serif; 
          background: #050505; 
          margin: 0; 
          -webkit-font-smoothing: antialiased;
        }

        .font-sans { 
          font-family: 'Plus Jakarta Sans', sans-serif !important; 
        }
        
        .no-scrollbar::-webkit-scrollbar { 
          display: none; 
        }
        
        .custom-scroll::-webkit-scrollbar { 
          width: 4px; 
        }
        
        .custom-scroll::-webkit-scrollbar-thumb { 
          background: #1a1a1a; 
          border-radius: 2px; 
        }
        
        .animate-in {
          animation: fadeIn 0.3s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default App;

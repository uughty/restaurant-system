"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Share2, 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff,
  Minus,
  Plus,
  Star,
  ChevronDown,
  Users
} from 'lucide-react';

// Using high-res images with quality parameters (q=90) and no grayscale filters
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=90&w=2000", 
  "https://images.unsplash.com/photo-1550966841-3ee71031f3d6?auto=format&fit=crop&q=90&w=2000", 
  "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&q=90&w=2000", 
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=90&w=2000"
];

export default function ReservationSection() {
  const [date, setDate] = useState('2026-02-14'); // Updated to current year
  const [time, setTime] = useState('20:00');
  const [guests, setGuests] = useState(2);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setIsLoaded(true);
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleAuthSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
      // Reset form
      setEmail('');
      setPassword('');
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  const scrollToReservation = () => {
    document.getElementById('reservation-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#050505] font-sans text-white overflow-x-hidden selection:bg-amber-500/30 min-h-screen">
      
      {/* IMPROVED VISIBILITY BACKGROUND - NO GRAYSCALE */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-black">
        {HERO_IMAGES.map((url, index) => (
          <div 
            key={url}
            className={`absolute inset-0 transition-opacity duration-[2500ms] ease-in-out ${
              index === currentImageIndex ? 'opacity-45' : 'opacity-0'
            }`}
          >
            <img 
              src={url} 
              className="w-full h-full object-cover" 
              alt="Atmosphere" 
              loading="lazy"
            />
          </div>
        ))}
        {/* Subtle gradient to ensure text remains legible without muddying the image */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      </div>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 p-6 md:p-10 flex justify-between items-center transition-all duration-1000 ${
        isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}>
        <div className="flex items-center gap-4 group cursor-pointer hover:scale-[1.02] transition-transform">
           <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-black/40 backdrop-blur-xl group-hover:border-amber-500/70 transition-all duration-300">
             <span className="text-amber-500 font-serif italic text-2xl font-bold">M</span>
           </div>
           <div className="flex flex-col leading-tight">
             <span className="text-[10px] uppercase tracking-[0.8em] font-black leading-none text-white/90">Malivère</span>
             <span className="text-[7px] uppercase tracking-[0.4em] text-stone-500 font-medium">Registry</span>
           </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            className="p-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full hover:bg-white/10 hover:scale-105 transition-all duration-300 shadow-lg"
            aria-label="Share"
            title="Share Malivère"
          >
            <Share2 className="w-4 h-4 text-white/90" />
          </button>
          {isLoggedIn && (
            <button 
              onClick={() => setIsLoggedIn(false)}
              className="px-6 py-2.5 bg-amber-500 text-black rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-amber-600 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg"
            >
              Exit
            </button>
          )}
        </div>
      </header>

      <main className="relative z-10 pt-24">
        {!isLoggedIn ? (
          /* AUTH VIEW - ENHANCED WITH BETTER UX */
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 md:p-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 shadow-2xl shadow-black/50">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500/15 to-amber-500/5 border-2 border-amber-500/30 flex items-center justify-center mx-auto shadow-xl">
                  <Lock className="w-8 h-8 text-amber-500" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-4xl font-light tracking-tight italic bg-gradient-to-r from-white to-amber-200/50 bg-clip-text text-transparent">Private Registry</h2>
                  <p className="text-[10px] uppercase tracking-[0.5em] text-stone-400 font-black">Verification Required</p>
                </div>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-6">
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <input 
                    type="email" 
                    placeholder="Registry Email" 
                    required 
                    value={email} 
                    onChange={handleEmailChange}
                    className="w-full bg-white/5 border border-white/15 px-16 py-5 rounded-2xl focus:outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/20 transition-all duration-300 text-sm placeholder-stone-500" 
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Passcode" 
                    required 
                    value={password} 
                    onChange={handlePasswordChange}
                    className="w-full bg-white/5 border border-white/15 px-16 py-5 rounded-2xl focus:outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/20 transition-all duration-300 text-sm placeholder-stone-500" 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-5 top-1/2 -translate-y-1/2 p-1 hover:scale-110 transition-transform"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5 text-stone-400" /> : <Eye className="w-5 h-5 text-stone-400" />}
                  </button>
                </div>
                <button 
                  type="submit" 
                  disabled={!email || !password}
                  className="group relative w-full h-[60px] bg-gradient-to-r from-white to-amber-100 text-black font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl hover:from-amber-500 hover:to-amber-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-amber-500/30 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 shadow-xl mt-2"
                >
                  <span className="relative z-10">Enter Registry</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* MAIN SITE - ENHANCED DESIGN */
          <div className="animate-in fade-in duration-1000">
            {/* HERO SECTION */}
            <section className="h-screen flex flex-col items-center justify-center text-center px-6 relative">
              <div className="space-y-10 max-w-5xl mx-auto">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border-2 border-white/15 bg-black/30 backdrop-blur-xl shadow-xl">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500 drop-shadow-lg" />
                  <span className="text-white text-[11px] uppercase tracking-[0.5em] font-black">New York • Since 1994</span>
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500 drop-shadow-lg" />
                </div>
                
                <h1 className="text-6xl md:text-[120px] font-light leading-[0.85] tracking-[-0.05em]">
                  <span className="block italic opacity-90">The Art of the</span>
                  <span className="block font-serif text-amber-400 font-semibold drop-shadow-2xl bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">Late Evening.</span>
                </h1>

                <p className="text-stone-300 text-xl md:text-3xl font-light max-w-3xl mx-auto leading-relaxed italic mt-8 px-4">
                  Where the light is low, the spirits are high, and time has no place.
                </p>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-6 pt-12">
                  <button 
                    onClick={scrollToReservation} 
                    className="group relative px-14 py-6 bg-white text-black font-black text-[11px] uppercase tracking-[0.5em] rounded-full hover:bg-amber-500 hover:text-white focus:outline-none focus:ring-4 focus:ring-amber-500/40 transition-all duration-500 shadow-2xl hover:shadow-amber-500/25 active:scale-[0.97] min-w-[220px]"
                  >
                    <span className="relative z-10 translate-y-0 group-hover:-translate-y-0.5 transition-transform">Request Table</span>
                  </button>
                  <button className="px-14 py-6 border-2 border-white/20 bg-black/20 backdrop-blur-xl rounded-full font-black text-[11px] uppercase tracking-[0.5em] hover:bg-white/10 hover:border-white/40 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300 shadow-xl hover:shadow-white/10 min-w-[200px]">
                    The Menu
                  </button>
                </div>
              </div>
              <button 
                onClick={scrollToReservation} 
                className="absolute bottom-16 left-1/2 -translate-x-1/2 p-4 opacity-50 hover:opacity-100 transition-all duration-300 hover:scale-110"
                aria-label="Scroll to reservation"
              >
                <ChevronDown className="w-7 h-7 text-white/60" />
              </button>
            </section>

            {/* RESERVATION FORM */}
            <section id="reservation-form" className="py-32 px-6 flex items-center justify-center min-h-screen">
              <div className="max-w-6xl w-full flex flex-col lg:flex-row bg-black/40 backdrop-blur-3xl border border-white/15 rounded-[3rem] overflow-hidden shadow-2xl shadow-black/50">
                
                {/* Left Side */}
                <div className="lg:w-2/5 p-16 border-b lg:border-b-0 lg:border-r border-white/10 space-y-12 bg-gradient-to-br from-black/20 to-transparent">
                  <div className="space-y-8">
                    <h2 className="text-5xl font-light italic leading-tight text-white drop-shadow-md">
                      Secure Your <br /> <span className="text-amber-400 font-semibold">Place.</span>
                    </h2>
                    <p className="text-stone-400 text-base font-light leading-relaxed max-w-md">
                      Reservations are released 30 days in advance. Membership ensures priority placement for weekend seatings.
                    </p>
                  </div>
                  <div className="space-y-6 pt-8 border-t border-white/10">
                    <div className="flex items-center gap-4 text-stone-400">
                      <MapPin className="w-5 h-5 text-amber-500 flex-shrink-0" />
                      <span className="text-sm uppercase tracking-[0.1em] font-medium">Upper East Side, NYC</span>
                    </div>
                    <div className="flex items-center gap-4 text-stone-400">
                      <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" />
                      <span className="text-sm uppercase tracking-[0.1em] font-medium">18:00 — 02:00 Daily</span>
                    </div>
                  </div>
                </div>

                {/* Right Side */}
                <div className="lg:w-3/5 p-16 space-y-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[11px] uppercase font-black text-stone-500 tracking-[0.3em] block ml-2">Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                        <input 
                          type="date" 
                          value={date} 
                          onChange={handleDateChange}
                          className="w-full bg-white/10 border border-white/20 pl-16 pr-4 py-5 rounded-2xl focus:outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/20 transition-all duration-300 text-sm font-medium placeholder-stone-500" 
                          style={{ colorScheme: 'dark' }}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] uppercase font-black text-stone-500 tracking-[0.3em] block ml-2">Time</label>
                      <div className="relative">
                        <Clock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                        <input 
                          type="time" 
                          value={time} 
                          onChange={handleTimeChange}
                          className="w-full bg-white/10 border border-white/20 pl-16 pr-4 py-5 rounded-2xl focus:outline-none focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/20 transition-all duration-300 text-sm font-medium placeholder-stone-500" 
                          style={{ colorScheme: 'dark' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[11px] uppercase font-black text-stone-500 tracking-[0.3em] block ml-2">Party Size</label>
                    <div className="flex items-center justify-between bg-white/10 border border-white/20 p-6 rounded-2xl backdrop-blur-md hover:bg-white/15 transition-all duration-300">
                      <div className="flex items-center gap-4 ml-2">
                        <Users className="w-5 h-5 text-amber-500" />
                        <span className="text-base font-light text-white/90">Guests</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setGuests(Math.max(1, guests - 1))} 
                          className="w-12 h-12 rounded-full border-2 border-white/20 bg-black/30 flex items-center justify-center hover:bg-amber-500/20 hover:border-amber-500 hover:scale-105 transition-all duration-200 active:scale-95"
                          aria-label="Decrease guests"
                        >
                          <Minus className="w-4 h-4 text-white/70" />
                        </button>
                        <span className="font-serif italic text-3xl w-12 text-center text-amber-500 font-bold drop-shadow-lg">{guests}</span>
                        <button 
                          onClick={() => setGuests(Math.min(12, guests + 1))} 
                          className="w-12 h-12 rounded-full border-2 border-white/20 bg-black/30 flex items-center justify-center hover:bg-amber-500/20 hover:border-amber-500 hover:scale-105 transition-all duration-200 active:scale-95"
                          aria-label="Increase guests"
                        >
                          <Plus className="w-4 h-4 text-white/70" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 pt-4">
                    <button className="group relative w-full h-[70px] bg-white text-black font-black text-[11px] uppercase tracking-[0.5em] rounded-[2.5rem] hover:bg-amber-500 hover:text-white focus:outline-none focus:ring-4 focus:ring-amber-500/40 transition-all duration-500 shadow-2xl hover:shadow-amber-500/30 active:scale-[0.97] overflow-hidden">
                      <span className="relative z-10 flex items-center justify-center gap-3 h-full">
                        Book Table
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </button>
                    <p className="text-[10px] text-stone-500 text-center uppercase tracking-[0.3em] font-black bg-white/5 px-6 py-3 rounded-xl backdrop-blur-sm border border-white/10">
                      A $45 deposit secures your invitation • 24h cancellation policy
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <footer className="py-24 px-8 text-center border-t border-white/10 bg-black/50 backdrop-blur-xl">
              <div className="text-[12px] uppercase tracking-[1.2em] font-black text-stone-500 mb-12 drop-shadow-lg">Malivère</div>
              <div className="flex justify-center gap-12 text-[10px] uppercase tracking-widest font-bold text-stone-600 mb-12">
                <a href="#" className="hover:text-amber-500 transition-colors duration-300">Instagram</a>
                <a href="#" className="hover:text-amber-500 transition-colors duration-300">Terms</a>
                <a href="#" className="hover:text-amber-500 transition-colors duration-300">Contact</a>
              </div>
              <p className="text-stone-800 text-[9px] uppercase tracking-[0.6em] font-black">© 2026 The Malivère Registry. Strictly Private.</p>
            </footer>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); border-radius: 10px; }
        ::-webkit-scrollbar-thumb { 
          background: linear-gradient(to bottom, #666, #999); 
          border-radius: 10px; 
        }
        ::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom, #d97706, #f59e0b); }
        @media (max-width: 768px) {
          ::-webkit-scrollbar { width: 4px; }
        }
      `}} />
    </div>
  );
}

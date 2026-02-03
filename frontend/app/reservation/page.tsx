"use client";
import React, { useState, useEffect, FormEvent } from 'react';

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
  Users,
  CreditCard,
  ChevronLeft,
  CheckCircle2,
  ShieldCheck,
  Phone,
  Smartphone
} from 'lucide-react';



const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=90&w=2000", 
  "https://images.unsplash.com/photo-1550966841-3ee71031f3d6?auto=format&fit=crop&q=90&w=2000", 
  "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&q=90&w=2000", 
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=90&w=2000"
];

export default function ReservationSection() {
  const [checkoutId, setCheckoutId] = useState<string | null>(null); // ✅ moved inside
  const [view, setView] = useState('landing'); // landing, payment, success
  const [paymentMethod, setPaymentMethod] = useState('card'); // card, mpesa
  const [date, setDate] = useState('2026-02-14');
  const [time, setTime] = useState('20:00');
  const [guests, setGuests] = useState(2);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Payment State
  // Payment State
const [isProcessing, setIsProcessing] = useState(false);
const [phone, setPhone] = useState('');
const [cardName, setCardName] = useState('');
const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed' | 'cancelled' | null>(null);


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
    }
  };

  const handleBookingClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setView('payment');
  };

  const normalizePhone = (phone: string) => {
    phone = phone.replace(/\s+/g, '');
    if (phone.startsWith('+')) return phone.substring(1);
    if (phone.startsWith('0')) return '254' + phone.substring(1);
    if (phone.startsWith('7')) return '254' + phone;
    return phone;
  };

 

const handlePaymentSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsProcessing(true);
  setPaymentStatus('pending');

  const normalizedPhone = phone.replace(/\s+/g, '').replace(/^0/, '254');

  try {
    const res = await fetch('http://localhost:5000/api/stkpush', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: normalizedPhone, amount: 45, email })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'STK Push failed');

    const checkoutRequestID = data.checkoutRequestID;
    setCheckoutId(checkoutRequestID);

    // Poll for payment status (max 2 minutes)
    const MAX_POLL_TIME = 120_000;
    const start = Date.now();

    const poll = setInterval(async () => {
      if (Date.now() - start > MAX_POLL_TIME) {
        clearInterval(poll);
        setIsProcessing(false);
        setPaymentStatus('failed');
        alert('Payment timeout.');
        setView('payment');
        return;
      }

       try {
    const statusRes = await fetch(`http://localhost:5000/api/payment-status/${checkoutRequestID}`);
    const statusData = await statusRes.json();

    if (statusData.status === 'success') {
      clearInterval(poll);
      setIsProcessing(false);
      setPaymentStatus('success');
      setView('success');
    } else if (statusData.status === 'failed') {
      clearInterval(poll);
      setIsProcessing(false);
      setPaymentStatus('failed');
      alert('Payment failed. Please try again.');
      setView('payment');
    } else if (statusData.status === 'cancelled') {
      clearInterval(poll);
      setIsProcessing(false);
      setPaymentStatus('cancelled');
      alert('Payment was cancelled by user.');
      setView('failed'); // optional: show a cancelled page
    }
    // else keep polling
  } catch (pollErr) {
    console.error('Polling error:', pollErr);
    clearInterval(poll);
    setIsProcessing(false);
    setPaymentStatus('failed');
    alert('Error checking payment status.');
    setView('payment');
  }
}, 3000);

  } catch (err: any) {
    console.error('STK Push error:', err.message);
    setIsProcessing(false);
    setPaymentStatus('failed');
    alert(err.message);
    setView('payment');
  }
};



  const scrollToReservation = () => {
    document.getElementById('reservation-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#050505] font-sans text-white overflow-x-hidden selection:bg-amber-500/30 min-h-screen">
      
      {/* BACKGROUND LAYER */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-black">
        {HERO_IMAGES.map((url, index) => (
          <div 
            key={url}
            className={`absolute inset-0 transition-opacity duration-[2500ms] ease-in-out ${
              index === currentImageIndex ? 'opacity-45' : 'opacity-0'
            }`}
          >
            <img src={url} className="w-full h-full object-cover" alt="Atmosphere" />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
      </div>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 p-6 md:p-10 flex justify-between items-center transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setView('landing')}>
          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-black/40 backdrop-blur-xl group-hover:border-amber-500/70 transition-all">
            <span className="text-amber-500 font-serif italic text-2xl font-bold">M</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] uppercase tracking-[0.8em] font-black leading-none text-white/90">Malivère</span>
            <span className="text-[7px] uppercase tracking-[0.4em] text-stone-500 font-medium">Registry</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
         <button className="p-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full hover:bg-white/10 transition-all shadow-lg">
           <Share2 className="w-4 h-4 text-white/90" />
         </button>
         {isLoggedIn && (
           <button onClick={() => setIsLoggedIn(false)} className="px-6 py-2.5 bg-amber-500 text-black rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg">
             Exit
           </button>
         )}
        </div>
      </header>

      <main className="relative z-10">
        {!isLoggedIn ? (
         /* LOGIN VIEW - Minimalized for prompt brevity */
         <div className="min-h-screen flex items-center justify-center p-4">
           <div className="max-w-md w-full bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
             <div className="text-center space-y-4">
               <Lock className="w-12 h-12 text-amber-500 mx-auto" />
               <h2 className="text-3xl font-light italic">Private Registry</h2>
             </div>
             <form onSubmit={handleAuthSubmit} className="space-y-6">
               <input type="email" placeholder="Registry Email" required value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/15 px-6 py-5 rounded-2xl outline-none focus:border-amber-500/50 transition-all text-sm" />
               <input type="password" placeholder="Passcode" required value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/15 px-6 py-5 rounded-2xl outline-none focus:border-amber-500/50 transition-all text-sm" />
               <button type="submit" className="w-full h-[60px] bg-white text-black font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl hover:bg-amber-500 hover:text-white transition-all">
                 Enter Registry
               </button>
             </form>
           </div>
         </div>
        ) : (
         <div className="animate-in fade-in duration-700">
           {view === 'landing' && (
             <>
               {/* HERO */}
               <section className="h-screen flex flex-col items-center justify-center text-center px-6 relative">
                 <div className="space-y-10 max-w-5xl mx-auto">
                   <h1 className="text-6xl md:text-[120px] font-light leading-[0.85] tracking-tight">
                     <span className="block italic opacity-90">The Art of the</span>
                     <span className="block font-serif text-amber-400 font-semibold drop-shadow-2xl">Late Evening.</span>
                   </h1>
                   <div className="flex flex-col lg:flex-row items-center justify-center gap-6 pt-12">
                     <button onClick={scrollToReservation} className="px-14 py-6 bg-white text-black font-black text-[11px] uppercase tracking-[0.5em] rounded-full hover:bg-amber-500 hover:text-white transition-all shadow-2xl min-w-[220px]">
                       Request Table
                     </button>
                   </div>
                 </div>
                 <button onClick={scrollToReservation} className="absolute bottom-16 left-1/2 -translate-x-1/2 p-4 opacity-50 hover:opacity-100 transition-all">
                   <ChevronDown className="w-7 h-7 text-white/60 animate-bounce" />
                 </button>
               </section>

               {/* RESERVATION FORM */}
               <section id="reservation-form" className="py-32 px-6 flex items-center justify-center min-h-screen">
                 <div className="max-w-6xl w-full flex flex-col lg:flex-row bg-black/40 backdrop-blur-3xl border border-white/15 rounded-[3rem] overflow-hidden shadow-2xl">
                   <div className="lg:w-2/5 p-16 border-b lg:border-b-0 lg:border-r border-white/10 space-y-12">
                     <h2 className="text-5xl font-light italic leading-tight text-white">Secure Your <br /><span className="text-amber-400 font-semibold">Place.</span></h2>
                     <div className="space-y-6 pt-8 border-t border-white/10">
                       <div className="flex items-center gap-4 text-stone-400">
                         <MapPin className="w-5 h-5 text-amber-500" />
                         <span className="text-sm uppercase tracking-widest font-medium">Upper East Side, NYC</span>
                       </div>
                     </div>
                   </div>
                   <div className="lg:w-3/5 p-16 space-y-10">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                       <div className="space-y-2">
                         <label className="text-[10px] uppercase font-black text-stone-500 tracking-widest ml-2">Date</label>
                         <input type="date" value={date} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)} className="w-full bg-white/10 border border-white/20 px-6 py-5 rounded-2xl outline-none focus:border-amber-500/50 transition-all text-sm" style={{ colorScheme: 'dark' }} />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] uppercase font-black text-stone-500 tracking-widest ml-2">Time</label>
                         <input type="time" value={time} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTime(e.target.value)} className="w-full bg-white/10 border border-white/20 px-6 py-5 rounded-2xl outline-none focus:border-amber-500/50 transition-all text-sm" style={{ colorScheme: 'dark' }} />
                       </div>
                     </div>
                     <div className="space-y-4">
                       <label className="text-[10px] uppercase font-black text-stone-500 tracking-widest ml-2">Party Size</label>
                       <div className="flex items-center justify-between bg-white/10 border border-white/20 p-6 rounded-2xl">
                         <span className="text-base font-light">Guests</span>
                         <div className="flex items-center gap-4">
                           <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-amber-500 transition-all"><Minus className="w-4 h-4" /></button>
                           <span className="font-serif italic text-3xl w-10 text-center text-amber-500">{guests}</span>
                           <button onClick={() => setGuests(guests + 1)} className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-amber-500 transition-all"><Plus className="w-4 h-4" /></button>
                         </div>
                       </div>
                     </div>
                     <button onClick={handleBookingClick} className="group w-full h-[70px] bg-white text-black font-black text-[11px] uppercase tracking-[0.5em] rounded-[2.5rem] hover:bg-amber-500 hover:text-white transition-all flex items-center justify-center gap-3 shadow-2xl">
                       Book Table <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                     </button>
                   </div>
                 </div>
               </section>
             </>
           )}

           {view === 'payment' && (
             /* PAYMENT SECTION */
             <section className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center">
               <div className="max-w-4xl w-full space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                 <div className="flex items-center gap-4">
                   <button onClick={() => setView('landing')} className="p-3 rounded-full border border-white/10 hover:bg-white/5 transition-all">
                     <ChevronLeft className="w-5 h-5" />
                   </button>
                   <h2 className="text-3xl font-light italic">Secure Deposit</h2>
                 </div>

                 {/* Payment Method Selector */}
                 <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                   <button 
                     onClick={() => setPaymentMethod('card')}
                     className={`flex items-center justify-center gap-3 py-4 rounded-2xl border transition-all ${paymentMethod === 'card' ? 'bg-white text-black border-white' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}
                   >
                     <CreditCard className="w-4 h-4" />
                     <span className="text-[10px] uppercase font-black tracking-widest">Card</span>
                   </button>
                   <button 
                     onClick={() => setPaymentMethod('mpesa')}
                     className={`flex items-center justify-center gap-3 py-4 rounded-2xl border transition-all ${paymentMethod === 'mpesa' ? 'bg-[#00BF32] text-white border-[#00BF32]' : 'bg-white/5 text-white border-white/10 hover:bg-white/10'}`}
                   >
                     <Smartphone className="w-4 h-4" />
                     <span className="text-[10px] uppercase font-black tracking-widest">M-Pesa</span>
                   </button>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mt-8">
                   {/* Payment Form */}
                   <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 space-y-8 shadow-2xl relative overflow-hidden min-h-[480px]">
                     {isProcessing && (
                       <div className="absolute inset-0 z-20 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center space-y-8 animate-in fade-in duration-300">
                          <div className="relative">
                              <div className="w-20 h-20 border-2 border-amber-500/10 border-t-amber-500 rounded-full animate-spin" />
                              <ShieldCheck className="absolute inset-0 m-auto w-8 h-8 text-amber-500/50" />
                          </div>
                          <div className="space-y-4">
                              <p className="text-[11px] uppercase tracking-[0.5em] text-amber-500 font-black animate-pulse">
                                {paymentMethod === 'mpesa' ? 'Pushing STK Request...' : 'Verifying Invitation...'}
                              </p>
                              <p className="text-[10px] text-stone-500 uppercase tracking-widest leading-relaxed">
                                {paymentMethod === 'mpesa' ? 'Check your handset for the M-Pesa prompt' : 'Authorizing with secure registry protocols'}
                              </p>
                          </div>
                       </div>
                     )}
                     
                     {paymentMethod === 'card' ? (
                       <form onSubmit={handlePaymentSubmit} className="space-y-6">
                         <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-2">
                           <CreditCard className="w-5 h-5 text-amber-500" />
                           <span className="text-xs uppercase tracking-widest font-bold">Credit / Debit</span>
                         </div>
                         <div className="space-y-2">
                           <label className="text-[9px] uppercase tracking-widest font-black text-stone-500 ml-2">Cardholder</label>
                           <input required type="text" placeholder="GABRIEL MALIVÈRE" value={cardName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCardName(e.target.value.toUpperCase())} className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-xl outline-none text-sm tracking-widest transition-all focus:border-amber-500/40" />
                         </div>
                         <div className="space-y-2">
                           <label className="text-[9px] uppercase tracking-widest font-black text-stone-500 ml-2">Number</label>
                           <input required type="text" placeholder="•••• •••• •••• ••••" className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-xl outline-none text-sm tracking-widest transition-all focus:border-amber-500/40" />
                         </div>
                         <div className="grid grid-cols-2 gap-6">
                           <input required type="text" placeholder="MM/YY" className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-xl outline-none text-sm text-center tracking-widest focus:border-amber-500/40" />
                           <input required type="password" placeholder="CVV" className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-xl outline-none text-sm text-center tracking-widest focus:border-amber-500/40" />
                         </div>
                         <button type="submit" className="w-full h-[64px] bg-white text-black font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl hover:bg-amber-500 hover:text-white transition-all mt-4">
                           Pay $45.00 Deposit
                         </button>
                       </form>
                     ) : (
                       <form onSubmit={handlePaymentSubmit} className="space-y-8">
                         <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-2">
                           <Smartphone className="w-5 h-5 text-[#00BF32]" />
                           <span className="text-xs uppercase tracking-widest font-bold">Lipa na M-Pesa</span>
                         </div>
                         
                         <div className="bg-[#00BF32]/5 border border-[#00BF32]/10 p-6 rounded-2xl flex items-start gap-4">
                           <Phone className="w-5 h-5 text-[#00BF32] mt-1" />
                           <div className="space-y-1">
                             <p className="text-[10px] uppercase font-black text-white tracking-widest">Instant Push</p>
                             <p className="text-[9px] text-stone-500 leading-relaxed uppercase tracking-widest">Funds will be converted at current registry rates (KES 5,850 approx.)</p>
                           </div>
                         </div>

                         <div className="space-y-3">
                           <label className="text-[9px] uppercase tracking-widest font-black text-stone-500 ml-2">Mobile Number</label>
                           <div className="flex gap-3">
                             <div className="w-24 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-xs font-bold text-stone-400">
                               +254
                             </div>
                             <input 
                               required 
                               type="tel" 
                               placeholder="712 345 678" 
                               value={phone}
                               onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                               className="flex-1 bg-white/5 border border-white/10 px-6 py-4 rounded-xl outline-none text-sm tracking-[0.3em] focus:border-[#00BF32]/50 transition-all"
                             />
                           </div>
                         </div>

                         <div className="space-y-4 pt-4">
                           <button type="submit" className="w-full h-[64px] bg-[#00BF32] text-white font-black text-[11px] uppercase tracking-[0.4em] rounded-2xl hover:bg-[#009e2a] transition-all shadow-xl shadow-[#00BF32]/10">
                             Request M-Pesa Push
                           </button>
                           <p className="text-[8px] text-stone-600 text-center uppercase tracking-[0.3em] font-black">
                             Secured by Malivère Private Gateway
                           </p>
                         </div>
                       </form>
                     )}
                   </div>

                   {/* Summary */}
                   <div className="space-y-8 p-6">
                      <div className="pb-8 border-b border-white/10">
                       <h3 className="text-xl italic font-light mb-6">Reservation Details</h3>
                       <div className="space-y-4 text-[10px] uppercase tracking-widest font-bold">
                          <div className="flex justify-between"><span className="text-stone-500">Venue</span><span className="text-white">Malivère Registry</span></div>
                          <div className="flex justify-between"><span className="text-stone-500">Date</span><span className="text-white">{date}</span></div>
                          <div className="flex justify-between"><span className="text-stone-500">Time</span><span className="text-white">{time}</span></div>
                          <div className="flex justify-between border-t border-white/5 pt-4 mt-4">
                             <span className="text-amber-500">Deposit Due</span>
                             <span className="text-xl font-serif italic text-amber-500">$45.00</span>
                          </div>
                       </div>
                     </div>
                      <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                       <div className="flex items-center gap-3">
                          <ShieldCheck className="w-4 h-4 text-stone-500" />
                          <span className="text-[9px] uppercase tracking-[0.2em] font-black text-stone-400">Security Note</span>
                       </div>
                       <p className="text-[9px] text-stone-500 leading-relaxed italic uppercase tracking-widest">Invitation transfers are strictly monitored. Deposit is applied to final statement.</p>
                     </div>
                   </div>
                 </div>
               </div>
             </section>
           )}

           {view === 'success' && (
             /* SUCCESS VIEW */
             <section className="min-h-screen flex items-center justify-center p-6 text-center">
                <div className="max-w-2xl w-full bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-16 space-y-10 animate-in zoom-in-95 duration-700 shadow-2xl">
                   <div className="w-24 h-24 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center mx-auto mb-8 shadow-inner">
                      <CheckCircle2 className="w-10 h-10 text-amber-500 animate-in fade-in zoom-in-50 delay-300" />
                   </div>
                   <div className="space-y-4">
                      <h2 className="text-5xl font-light italic leading-tight">It's a <span className="text-amber-400">Date.</span></h2>
                      <p className="text-stone-400 text-lg font-light leading-relaxed">Your invitation has been confirmed. A formal digital packet has been sent to your registry email.</p>
                   </div>
                   <button onClick={() => setView('landing')} className="px-14 py-6 border-2 border-white/10 bg-white/5 rounded-full font-black text-[10px] uppercase tracking-[0.5em] hover:bg-white/10 transition-all w-full">
                      Return to Registry
                   </button>
                </div>
             </section>
           )}

           {view === 'failed' && (
  <section className="min-h-screen flex items-center justify-center p-6 text-center">
    <div className="max-w-2xl w-full bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-16 space-y-10 animate-in zoom-in-95 duration-700 shadow-2xl">
      <div className="w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center mx-auto mb-8 shadow-inner">
        <ShieldCheck className="w-10 h-10 text-red-500 animate-in fade-in zoom-in-50 delay-300" />
      </div>
      <div className="space-y-4">
        <h2 className="text-5xl font-light italic leading-tight">Payment <span className="text-red-500">Cancelled.</span></h2>
        <p className="text-stone-400 text-lg font-light leading-relaxed">Your M-Pesa payment was not completed. Please try again.</p>
      </div>
      <button onClick={() => setView('payment')} className="px-14 py-6 border-2 border-white/10 bg-white/5 rounded-full font-black text-[10px] uppercase tracking-[0.5em] hover:bg-white/10 transition-all w-full">
        Retry Payment
      </button>
    </div>
  </section>
)}


           <footer className="py-24 px-8 text-center border-t border-white/10 bg-black/50 backdrop-blur-xl">
              <div className="text-[12px] uppercase tracking-[1.2em] font-black text-stone-600 mb-12">Malivère</div>
              <p className="text-stone-800 text-[9px] uppercase tracking-[0.6em] font-black">© 2026 The Malivère Registry. Strictly Private.</p>
           </footer>
         </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: rgba(0,0,0,0.3); }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #d97706; }
      `}} />
    </div>
  );
}

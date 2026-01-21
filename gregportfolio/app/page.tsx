"use client"
import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { Playfair_Display, Inter, Oswald } from 'next/font/google';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

// --- FONTS ---
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const oswald = Oswald({ subsets: ['latin'], variable: '--font-display' });

gsap.registerPlugin(ScrollTrigger);

// --- DATA SERVICES (Pour la conversion) ---
const services = [
  {
    id: "01",
    title: "Automotive",
    desc: "Commercial & Private Shoots",
    img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1983&auto=format&fit=crop"
  },
  {
    id: "02",
    title: "Editorial Portrait",
    desc: "Studio & Outdoor Lighting",
    img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop"
  },
  {
    id: "03",
    title: "Brand Content",
    desc: "Social Media Strategy & Visuals",
    img: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop"
  }
];

export default function Portfolio() {
  const containerRef = useRef(null);
  const horizontalWrapperRef = useRef(null);
  const [activeService, setActiveService] = useState(0);

  useEffect(() => {
    // 1. Setup Lenis (Smooth Scroll)
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    let ctx = gsap.context(() => {
      
      // 2. Intro Animation
      const tl = gsap.timeline();
      tl.to(".loader-text", { y: -100, duration: 1, delay: 0.5, ease: "power4.in" })
        .to(".loader-overlay", { yPercent: -100, duration: 1, ease: "power4.inOut" }, "-=0.5")
        .from(".hero-title span", { y: 200, skewY: 10, duration: 1.5, stagger: 0.1, ease: "power4.out" }, "-=0.5");

      // 3. Parallaxe Hero
      gsap.to(".hero-img-inner", {
        yPercent: 30,
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      // 4. Horizontal Scroll Gallery
      const sections = gsap.utils.toArray(".h-item");
      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: horizontalWrapperRef.current,
          pin: true,
          scrub: 1,
          end: () => "+=" + horizontalWrapperRef.current.offsetWidth
        }
      });

      // 5. Manifesto Text Reveal (Conversion: Trust)
      const text = document.querySelector('.manifesto-text');
      if(text) {
        gsap.fromTo(text, 
          { backgroundPositionX: "0%" }, 
          { 
            backgroundPositionX: "100%", 
            ease: "none",
            scrollTrigger: {
              trigger: ".manifesto-section",
              start: "top 80%",
              end: "bottom 20%",
              scrub: 1,
            }
          }
        );
      }

    }, containerRef);

    return () => {
      lenis.destroy();
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className={`${playfair.variable} ${inter.variable} ${oswald.variable} bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-red-600 selection:text-white`}>
      <Head>
        <title>Venox | Photographer Paris</title>
      </Head>

      {/* --- LOADER --- */}
      <div className="loader-overlay fixed inset-0 bg-white z-[9999] flex items-center justify-center overflow-hidden">
        <div className="loader-text text-black text-9xl font-display font-bold uppercase tracking-tighter">
          Venox.
        </div>
      </div>

      {/* --- BACKGROUND NOISE --- */}
      <div className='fixed inset-0 pointer-events-none opacity-[0.06] z-[100]' 
           style={{backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")'}}></div>

      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 w-full p-8 flex justify-between items-end z-50 mix-blend-difference">
        <div className="leading-none">
          <span className="block font-display text-3xl font-bold tracking-tighter uppercase">Venox</span>
          <span className="block text-[10px] uppercase tracking-[0.3em] opacity-70">Paris based</span>
        </div>
        <a href="#contact" className="hidden md:block px-6 py-2 border border-white/30 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300">
          Book a Shoot
        </a>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="hero-section h-screen w-full relative flex flex-col justify-center px-6 md:px-10 overflow-hidden">
        <div className="z-10 relative mix-blend-difference">
          <h1 className="hero-title text-[13vw] leading-[0.8] font-display font-bold uppercase tracking-tighter text-transparent stroke-white">
            <span className="block">Speed</span>
            <span className="block text-white">Legacy</span>
            <span className="block italic font-serif text-[6vw] normal-case opacity-80 mt-4 tracking-normal">
              & Raw Emotions
            </span>
          </h1>
        </div>
        <div className="absolute top-0 right-0 w-[60vw] h-full overflow-hidden opacity-60">
          <div className="hero-img-inner w-full h-[120%] bg-cover bg-center" 
               style={{backgroundImage: 'url("https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2070&auto=format&fit=crop")'}}>
             <div className="absolute inset-0 bg-gradient-to-l from-[#050505] via-transparent to-transparent"></div>
          </div>
        </div>
      </section>

      {/* --- MANIFESTO (Why Him?) --- */}
      <section className="manifesto-section min-h-[60vh] flex items-center justify-center py-20 px-6">
        <div className="max-w-4xl text-center">
            <p className="text-red-500 font-bold uppercase tracking-[0.3em] mb-8 text-xs">The Vision</p>
            <h2 className="manifesto-text text-4xl md:text-6xl font-display uppercase leading-tight text-white/20 bg-clip-text bg-gradient-to-r from-white via-white to-white/20 bg-no-repeat"
                style={{ backgroundSize: "0% 100%" }}>
                "Photography isn't about the camera. It's about the <span className="text-red-600">drive</span>. 
                My goal is simple: Create visuals that stop the scroll and build your legacy. 
                Fast cars, raw portraits, zero compromise."
            </h2>
        </div>
      </section>

      {/* --- SERVICES INTERACTIVE (Conversion Tool) --- */}
      <section className="relative py-20 md:py-32 border-t border-white/10 bg-[#050505]">
        <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row gap-10">
                <div className="w-full md:w-1/3">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] mb-4 text-gray-500">What I do</p>
                    <h3 className="text-5xl font-display font-bold uppercase mb-8">Select <br/> Your <br/> Style</h3>
                    <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                        Chaque projet est unique. Je m'adapte à votre vision pour délivrer des images qui convertissent et marquent les esprits.
                    </p>
                </div>
                
                <div className="w-full md:w-2/3 flex flex-col">
                    {services.map((service, index) => (
                        <div key={index} 
                             onMouseEnter={() => setActiveService(index)}
                             className="group flex items-center justify-between py-10 border-b border-white/10 cursor-pointer hover:border-red-600 transition-colors duration-300">
                             <div>
                                <span className="text-xs text-red-500 mb-2 block font-mono">0{index + 1}</span>
                                <h4 className="text-4xl md:text-6xl font-display uppercase group-hover:translate-x-4 transition-transform duration-300">{service.title}</h4>
                             </div>
                             <span className="hidden md:block text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {service.desc} ➝
                             </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Dynamic Background Image for Services */}
        <div className="absolute top-0 right-0 w-full md:w-[60vw] h-full pointer-events-none z-0 opacity-20 md:opacity-40 transition-opacity duration-700">
             <img src={services[activeService].img} alt="Service" className="w-full h-full object-cover grayscale mix-blend-screen" />
             <div className="absolute inset-0 bg-gradient-to-r from-[#050505] to-transparent"></div>
        </div>
      </section>

      {/* --- HORIZONTAL SCROLL GALLERY --- */}
      <section ref={horizontalWrapperRef} className="h-screen w-full overflow-hidden flex bg-[#050505]">
        <div className="h-item h-full min-w-[30vw] flex flex-col justify-center px-16 border-r border-white/5 bg-[#080808]">
          <span className="text-white/40 text-xs uppercase tracking-[0.4em] mb-6 font-bold">Latest Works</span>
          <h2 className="text-5xl font-display font-bold uppercase leading-tight">
            Visual <br/> Proof
          </h2>
        </div>
        <div className="h-item h-full min-w-[70vw] flex items-center justify-center p-10 relative border-r border-white/5 group">
          <div className="relative w-[80%] h-[70%] overflow-hidden border border-white/10">
            <img src="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop" 
                 className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110" />
          </div>
          <div className="absolute bottom-20 left-20 z-30 mix-blend-difference pointer-events-none">
             <h3 className="text-6xl font-display font-bold uppercase">Porsche 911</h3>
          </div>
        </div>
        <div className="h-item h-full min-w-[60vw] flex items-center justify-center p-10 relative border-r border-white/5 group">
          <div className="relative w-[60%] h-[80%] overflow-hidden border border-white/10">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop" 
                 className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110" />
          </div>
          <div className="absolute top-20 right-20 text-right z-30 pointer-events-none">
             <h3 className="text-6xl font-display font-bold uppercase leading-none">Night<br/>Vision</h3>
          </div>
        </div>
      </section>

      {/* --- STATS / TRUST --- */}
      <section className="py-20 border-y border-white/10 flex flex-wrap justify-around text-center bg-[#0a0a0a]">
        <div>
            <span className="block text-5xl font-display font-bold text-red-600">3+</span>
            <span className="text-xs uppercase tracking-widest opacity-60">Years Grinding</span>
        </div>
        <div>
            <span className="block text-5xl font-display font-bold text-white">50+</span>
            <span className="text-xs uppercase tracking-widest opacity-60">Projects Done</span>
        </div>
        <div>
            <span className="block text-5xl font-display font-bold text-white">100%</span>
            <span className="text-xs uppercase tracking-widest opacity-60">Dedication</span>
        </div>
      </section>

      {/* --- FOOTER (Conversion Focus) --- */}
      <footer id="contact" className="h-[80vh] flex flex-col justify-center items-center bg-[#050505] relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop')] bg-cover opacity-10"></div>
        <div className="z-10 text-center flex flex-col items-center">
          <p className="text-red-600 font-bold uppercase tracking-[0.3em] mb-4 animate-pulse">Open for commissions</p>
          <h2 className="text-6xl md:text-9xl font-display font-black uppercase tracking-tighter mb-8 text-white">
            Ready to <br/> Shoot?
          </h2>
          
          {/* Main Call to Action */}
          <div className="flex flex-col md:flex-row gap-6">
            <a href="mailto:contact@venox.com" className="group relative px-10 py-5 bg-white text-black font-bold uppercase tracking-widest overflow-hidden hover:bg-red-600 hover:text-white transition-colors duration-300">
                <span className="relative z-10">Email Me</span>
            </a>
            <a href="https://www.instagram.com/venoxalacam" target="_blank" className="px-10 py-5 border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                DM on Instagram
            </a>
          </div>

          <p className="mt-10 text-xs text-gray-600 uppercase tracking-widest">
            Paris, France — Worldwide Available
          </p>
        </div>
      </footer>

      <style jsx global>{`
        .stroke-white { -webkit-text-stroke: 1px white; }
        .stroke-text { -webkit-text-stroke: 1px rgba(255,255,255,0.3); color: transparent; }
      `}</style>
    </div>
  );
}
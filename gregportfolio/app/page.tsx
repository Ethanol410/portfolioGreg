"use client"
import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { Playfair_Display, Inter, Oswald } from 'next/font/google';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

// Import des nouvelles librairies
import { Canvas, useFrame } from '@react-three/fiber';
import { Image as DreiImage, Environment } from '@react-three/drei';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// Import des composants (Assure-toi de les avoir créés comme indiqué ci-dessus)
// Si tu préfères tout dans un fichier pour tester, dis-le moi, mais c'est moins propre.
import MagneticButton from './components/MagneticButton'; // Crée ce fichier !
import BookingForm from './components/BookingForm';       // Crée ce fichier !

// --- FONTS ---
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const oswald = Oswald({ subsets: ['latin'], variable: '--font-display' });

gsap.registerPlugin(ScrollTrigger);

// --- DATA ---
const services = [
  { id: "01", title: "Automotive", desc: "Commercial & Private Shoots", img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1983" },
  { id: "02", title: "Editorial Portrait", desc: "Studio & Outdoor Lighting", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964" },
  { id: "03", title: "Brand Content", desc: "Social Media Strategy & Visuals", img: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070" }
];

const galleryImages = [
  "/pics/pics1.jpg",
  "/pics/pics2.jpg",
  "/pics/pics3.jpg",
  "/pics/pics4.jpg",
  "/pics/pics5.jpg",
  "/pics/pics6.jpg",
  "/pics/pics7.jpg",
  "/pics/pics8.jpg"
];

// --- 3D COMPONENT (Hero Image) ---
function HeroScene() {
  const ref = useRef<any>(null);
  useFrame((state) => {
    if (ref.current) {
      // Effet de "respiration" et mouvement subtil
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      ref.current.material.zoom = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      ref.current.material.grayscale = 1 - Math.abs(Math.sin(state.clock.elapsedTime * 0.2)); // Noir et blanc pulsatile
    }
  });

  return (
    <DreiImage 
      ref={ref}
      url="/pics/pics1.jpg" 
      scale={[10, 6, 1]} 
      transparent 
      opacity={0.8}
    />
  );
}

export default function Portfolio() {
  const containerRef = useRef(null);
  const horizontalWrapperRef = useRef(null);
  const [activeService, setActiveService] = useState(0);
  
  // State pour la Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    // 1. Setup Lenis
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    let ctx = gsap.context(() => {
      // 2. Animations GSAP (Hero, Loader, etc.)
      const tl = gsap.timeline();
      tl.to(".loader-text", { y: -100, duration: 1, delay: 0.5, ease: "power4.in" })
        .to(".loader-overlay", { yPercent: -100, duration: 1, ease: "power4.inOut" }, "-=0.5")
        .from(".hero-title span", { y: 200, skewY: 10, duration: 1.5, stagger: 0.1, ease: "power4.out" }, "-=0.5");

      // Horizontal Scroll
      const sections = gsap.utils.toArray(".h-item");
      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: horizontalWrapperRef.current,
          pin: true,
          scrub: 1,
          end: () => "+=" + (horizontalWrapperRef.current as HTMLElement).offsetWidth
        }
      });
      
      // Manifesto Reveal
      const text = document.querySelector('.manifesto-text');
      if(text) {
        gsap.fromTo(text, 
          { backgroundPositionX: "0%" }, 
          { backgroundPositionX: "100%", ease: "none", scrollTrigger: { trigger: ".manifesto-section", start: "top 80%", end: "bottom 20%", scrub: 1 }}
        );
      }
    }, containerRef);

    return () => { lenis.destroy(); ctx.revert(); };
  }, []);

  return (
    <div ref={containerRef} className={`${playfair.variable} ${inter.variable} ${oswald.variable} bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-red-600 selection:text-white`}>
      <Head><title>Venox | Photographer Paris</title></Head>

      {/* LOADER */}
      <div className="loader-overlay fixed inset-0 bg-white z-[9999] flex items-center justify-center overflow-hidden">
        <div className="loader-text text-black text-9xl font-display font-bold uppercase tracking-tighter">Venox.</div>
      </div>

      {/* BACKGROUND NOISE */}
      <div className='fixed inset-0 pointer-events-none opacity-[0.06] z-[100]' style={{backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")'}}></div>

      {/* NAV */}
      <nav className="fixed top-0 w-full p-8 flex justify-between items-end z-50 mix-blend-difference">
        <div className="leading-none">
          <span className="block font-display text-3xl font-bold tracking-tighter uppercase">Venox</span>
          <span className="block text-[10px] uppercase tracking-[0.3em] opacity-70">Paris based</span>
        </div>
        <MagneticButton className="hidden md:block">
           <a href="#contact" className="px-6 py-2 border border-white/30 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 block">
             Book a Shoot
           </a>
        </MagneticButton>
      </nav>

      {/* HERO SECTION WITH WEBGL */}
      <section className="hero-section h-screen w-full relative flex flex-col justify-center px-6 md:px-10 overflow-hidden">
        <div className="z-10 relative mix-blend-difference pointer-events-none">
          <h1 className="hero-title text-[13vw] leading-[0.8] font-display font-bold uppercase tracking-tighter text-transparent stroke-white">
            <span className="block">Speed</span>
            <span className="block text-white">Legacy</span>
            <span className="block italic font-serif text-[6vw] normal-case opacity-80 mt-4 tracking-normal">& Raw Emotions</span>
          </h1>
        </div>
        
        {/* Remplacement de l'image statique par le Canvas 3D */}
        <div className="absolute top-0 right-0 w-[80vw] h-full overflow-hidden opacity-80 z-0">
          <Canvas camera={{ position: [0, 0, 5], fov: 15 }}>
            <HeroScene />
          </Canvas>
          <div className="absolute inset-0 bg-gradient-to-l from-[#050505] via-transparent to-transparent"></div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="manifesto-section min-h-[60vh] flex items-center justify-center py-20 px-6">
        <div className="max-w-4xl text-center">
            <p className="text-red-500 font-bold uppercase tracking-[0.3em] mb-8 text-xs">The Vision</p>
            <h2 className="manifesto-text text-4xl md:text-6xl font-display uppercase leading-tight text-white/20 bg-clip-text bg-gradient-to-r from-white via-white to-white/20 bg-no-repeat" style={{ backgroundSize: "0% 100%" }}>
                "Photography isn't about the camera. It's about the <span className="text-red-600">drive</span>. My goal is simple: Create visuals that stop the scroll and build your legacy."
            </h2>
        </div>
      </section>

      {/* SERVICES */}
      <section className="relative py-20 md:py-32 border-t border-white/10 bg-[#050505]">
        <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row gap-10">
                <div className="w-full md:w-1/3">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] mb-4 text-gray-500">What I do</p>
                    <h3 className="text-5xl font-display font-bold uppercase mb-8">Select <br/> Your <br/> Style</h3>
                </div>
                <div className="w-full md:w-2/3 flex flex-col">
                    {services.map((service, index) => (
                        <div key={index} onMouseEnter={() => setActiveService(index)} className="group flex items-center justify-between py-10 border-b border-white/10 cursor-pointer hover:border-red-600 transition-colors duration-300">
                             <div>
                                <span className="text-xs text-red-500 mb-2 block font-mono">0{index + 1}</span>
                                <h4 className="text-4xl md:text-6xl font-display uppercase group-hover:translate-x-4 transition-transform duration-300">{service.title}</h4>
                             </div>
                             <span className="hidden md:block text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">{service.desc} ➝</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <div className="absolute top-0 right-0 w-full md:w-[60vw] h-full pointer-events-none z-0 opacity-20 md:opacity-40 transition-opacity duration-700">
             <img src={services[activeService].img} alt="Service" className="w-full h-full object-cover grayscale mix-blend-screen" />
             <div className="absolute inset-0 bg-gradient-to-r from-[#050505] to-transparent"></div>
        </div>
      </section>

      {/* HORIZONTAL SCROLL GALLERY WITH LIGHTBOX TRIGGER */}
      <section ref={horizontalWrapperRef} className="h-screen w-full overflow-hidden flex bg-[#050505]">
        <div className="h-item h-full min-w-[30vw] flex flex-col justify-center px-16 border-r border-white/5 bg-[#080808]">
          <span className="text-white/40 text-xs uppercase tracking-[0.4em] mb-6 font-bold">Latest Works</span>
          <h2 className="text-5xl font-display font-bold uppercase leading-tight">Visual <br/> Proof</h2>
        </div>
        
        {galleryImages.map((src, idx) => (
           <div key={idx} className="h-item h-full min-w-[70vw] flex items-center justify-center p-10 relative border-r border-white/5 group">
             <div className="relative w-[80%] h-[70%] overflow-hidden border border-white/10 cursor-zoom-in"
                  onClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}>
               <img src={src} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110" />
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                 <span className="bg-white text-black text-xs font-bold px-4 py-2 uppercase tracking-widest">View Project</span>
               </div>
             </div>
           </div>
        ))}
      </section>

      {/* FOOTER AVEC FORMULAIRE */}
      <footer id="contact" className="min-h-screen flex flex-col justify-center items-center bg-[#050505] relative z-10 py-20">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070')] bg-cover opacity-10 pointer-events-none"></div>
        <div className="z-10 w-full max-w-4xl px-6 flex flex-col md:flex-row gap-10 items-center justify-between">
            
            <div className="text-left">
              <p className="text-red-600 font-bold uppercase tracking-[0.3em] mb-4 animate-pulse">Open for commissions</p>
              <h2 className="text-6xl md:text-8xl font-display font-black uppercase tracking-tighter mb-8 text-white">
                Ready to <br/> Shoot?
              </h2>
              <MagneticButton>
                <a href="https://instagram.com/venoxalacam" target="_blank" className="inline-block px-10 py-5 border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                    DM on Instagram
                </a>
              </MagneticButton>
            </div>

            {/* INTEGRATION DU FORMULAIRE */}
            <BookingForm />
            
        </div>
      </footer>

      {/* LIGHTBOX COMPONENT */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={galleryImages.map(src => ({ src }))}
      />

      <style jsx global>{`
        .stroke-white { -webkit-text-stroke: 1px white; }
        .stroke-text { -webkit-text-stroke: 1px rgba(255,255,255,0.3); color: transparent; }
      `}</style>
    </div>
  );
}
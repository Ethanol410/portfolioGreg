"use client"
import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { Playfair_Display, Inter, Oswald } from 'next/font/google';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

import Image from 'next/image';

// Libs
import { Canvas, useFrame } from '@react-three/fiber';
import { Image as DreiImage } from '@react-three/drei';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// Components
import MagneticButton from './components/MagneticButton';
import BookingForm from './components/BookingForm';
import Link from 'next/link';

// Fonts
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const oswald = Oswald({ subsets: ['latin'], variable: '--font-display' });

gsap.registerPlugin(ScrollTrigger);

// Data
const services = [
  { id: "01", title: "Automobile", desc: "Shootings commerciaux & privés", slug: "automotive", img: "/pics/car/DSC03037-Enhanced-NR.jpg" },
  { id: "02", title: "Portrait Éditorial", desc: "Éclairage studio & extérieur", slug: "portrait", img: "/pics/portrait/blond5.jpg" },
  { id: "03", title: "Contenu de Marque", desc: "Stratégie réseaux sociaux & visuels", slug: "brand", img: "/pics/car/DSC01428.jpg" }
];

// Fallback images si les locales ne marchent pas pour la démo
const galleryImages = [
  "/pics/car/DSC03037-Enhanced-NR.jpg",
  "/pics/car/DSC00511.jpg",
  "/pics/car/DSC02570-Enhanced-NR.jpg",
  "/pics/portrait/DSC03090-Enhanced-NR.jpg",
  "/pics/car/DSC00904.jpg",
  "/pics/car/IMG_1830-Enhanced-NR.jpg",
  "/pics/car/DSC02671-Enhanced-NR.jpg",
  "/pics/car/DSC01439.jpg",
];

// 3D Scene
function HeroScene() {
  const ref = useRef<any>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      ref.current.material.zoom = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      ref.current.material.grayscale = 0.5 + Math.sin(state.clock.elapsedTime * 0.3) * 0.5; // Effet plus visible
    }
  });

  return (
    <DreiImage 
      ref={ref}
      url="/pics/car/DSC03037-Enhanced-NR.jpg" 
      scale={[7, 6] as unknown as [number, number]} 
      transparent 
      opacity={0.9} // Plus d'impact
    />
  );
}

export default function Portfolio() {
  const containerRef = useRef(null);
  const horizontalWrapperRef = useRef(null);
  const [activeService, setActiveService] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // 1. Lenis Smooth Scroll
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // 2. Gestionnaire de Navbar (Glass effect)
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    // 3. GSAP Context
    let ctx = gsap.context(() => {
      // Intro
      const tl = gsap.timeline();
      tl.to(".loader-text", { y: -100, duration: 1, delay: 0.5, ease: "power4.in" })
        .to(".loader-overlay", { yPercent: -100, duration: 1, ease: "power4.inOut" }, "-=0.5")
        .from(".hero-title span", { y: 200, skewY: 10, duration: 1.5, stagger: 0.1, ease: "power4.out" }, "-=0.5");

      // RESPONSIVE SCROLL LOGIC
      // On utilise matchMedia pour ne pas casser l'UX sur mobile
      let mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        // Desktop : Horizontal Scroll
        const sections = gsap.utils.toArray(".h-item");
        gsap.to(sections, {
          xPercent: -100 * (sections.length - 1),
          ease: "none",
          scrollTrigger: {
            trigger: horizontalWrapperRef.current,
            pin: true,
            scrub: 1,
            end: () => "+=" + (horizontalWrapperRef.current as unknown as HTMLElement).offsetWidth
          }
        });
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

    return () => { 
      lenis.destroy(); 
      ctx.revert();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className={`${playfair.variable} ${inter.variable} ${oswald.variable} bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-red-600 selection:text-white`}>
      <Head><title>Venox | Photographe à Paris</title></Head>

      {/* LOADER */}
      <div className="loader-overlay fixed inset-0 bg-white z-[9999] flex items-center justify-center overflow-hidden">
        <div className="loader-text text-black text-9xl font-display font-bold uppercase tracking-tighter">Venox.</div>
      </div>

      {/* NOISE OVERLAY */}
      <div className='fixed inset-0 pointer-events-none opacity-[0.06] z-[100]' style={{backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")'}}></div>

      {/* NAVBAR DYNAMIQUE */}
      <nav className={`fixed top-0 w-full p-6 md:p-8 flex justify-between items-end z-50 transition-all duration-500 ${isScrolled ? 'glass-nav py-4' : 'mix-blend-difference'}`}>
        <div className="leading-none">
          <span className="block font-display text-3xl font-bold tracking-tighter uppercase">Venox</span>
          <span className="block text-[10px] uppercase tracking-[0.3em] opacity-70">Basé à Paris</span>
        </div>
        <MagneticButton className="hidden md:block">
           <a href="#contact" className={`px-6 py-2 border rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 block ${isScrolled ? 'border-white text-white hover:bg-white hover:text-black' : 'border-white/30 text-white hover:bg-white hover:text-black'}`}>
             Réserver une séance
           </a>
        </MagneticButton>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section h-screen w-full relative flex flex-col justify-center px-6 md:px-10 overflow-hidden">
        <div className="z-10 relative mix-blend-difference pointer-events-none mt-20 md:mt-0">
          <h1 className="hero-title text-[15vw] leading-[0.8] font-display font-bold uppercase tracking-tighter text-transparent stroke-white">
            <span className="block">Speed</span>
            <span className="block text-white">Legacy</span>
            <span className="block italic font-serif text-[6vw] normal-case opacity-80 mt-4 tracking-normal">& Raw Emotions</span>
          </h1>
        </div>
        
        {/* WebGL Background */}
        <div className="absolute top-0 right-0 w-full md:w-[80vw] h-[80vh] md:h-full overflow-hidden opacity-80 z-0">
          <Canvas camera={{ position: [0, 0, 5], fov: 15 }}>
            <HeroScene />
          </Canvas>
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-[#050505] via-transparent to-transparent"></div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="manifesto-section min-h-[50vh] flex items-center justify-center py-20 px-6">
        <div className="max-w-4xl text-center">
            <p className="text-red-500 font-bold uppercase tracking-[0.3em] mb-8 text-xs">The Vision</p>
            <h2 className="manifesto-text text-3xl md:text-6xl font-display uppercase leading-tight text-white/20 bg-clip-text bg-gradient-to-r from-white via-white to-white/20 bg-no-repeat" style={{ backgroundSize: "0% 100%" }}>
                "La photographie ne se résume pas à l'appareil. C'est la <span className="text-red-600">volonté</span> qui compte. Créez des visuels qui arrêtent le défilement."
            </h2>
        </div>
      </section>

      {/* SERVICES (Optimized Layout) */}
      <section className="relative py-20 md:py-32 border-t border-white/10 bg-[#050505]">
        <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row gap-10">
                <div className="w-full md:w-1/3">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] mb-4 text-gray-500">Ce que je fais</p>
                    <h3 className="text-5xl font-display font-bold uppercase mb-8">Sélectionnez <br/> votre <br/> style</h3>
                </div>
                <div className="w-full md:w-2/3 flex flex-col">
                    {services.map((service, index) => (
                        // On remplace le div par Link
        <Link href={`/work/${service.slug}`} key={index}> 
            <div 
                 onMouseEnter={() => setActiveService(index)}
                 className={`group flex items-center justify-between py-8 md:py-10 border-b cursor-pointer transition-all duration-300 ${activeService === index ? 'border-red-600 opacity-100' : 'border-white/10 opacity-60 hover:opacity-100'}`}>
                 <div>
                    <span className={`text-xs mb-2 block font-mono transition-colors ${activeService === index ? 'text-red-500' : 'text-gray-500'}`}>0{index + 1}</span>
                    <h4 className="text-3xl md:text-6xl font-display uppercase group-hover:translate-x-4 transition-transform duration-300">{service.title}</h4>
                 </div>
                 <span className="hidden md:block text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-red-500">View Work ➝</span>
            </div>
        </Link>
                    ))}
                </div>
            </div>
        </div>
        {/* Image de fond Service - Transition améliorée */}
        <div className="absolute top-0 right-0 w-full md:w-[60vw] h-full pointer-events-none z-0 opacity-20 md:opacity-40">
             {services.map((s, i) => (
              <Image 
                 key={s.id} 
                 src={s.img} 
                 alt={s.title}
                 fill // <--- AJOUTEZ CECI
                 sizes="(max-width: 768px) 100vw, 60vw" // Bonne pratique pour la performance
                 className={`absolute inset-0 w-full h-full object-cover grayscale mix-blend-screen transition-opacity duration-700 ease-in-out ${activeService === i ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}  
              />
             ))}
             <div className="absolute inset-0 bg-gradient-to-r from-[#050505] to-transparent"></div>
        </div>
      </section>

      {/* GALLERY: HORIZONTAL (Desktop) / VERTICAL (Mobile) */}
      <section ref={horizontalWrapperRef} className="relative w-full bg-[#050505] flex flex-col lg:flex-row lg:h-screen lg:overflow-hidden">
        
        {/* Titre Galerie */}
        <div className="h-item w-full lg:h-full lg:min-w-[30vw] flex flex-col justify-center px-6 py-20 lg:px-16 border-b lg:border-b-0 lg:border-r border-white/5 bg-[#080808]">
          <span className="text-white/40 text-xs uppercase tracking-[0.4em] mb-6 font-bold">Dernières réalisations</span>
          <h2 className="text-5xl font-display font-bold uppercase leading-tight">Portfolio <br/> Visuel</h2>
          <p className="mt-4 text-xs text-gray-500 md:hidden">(Appuyez sur les images pour agrandir)</p>
        </div>
        
        {/* Images Loop */}
        {galleryImages.map((src, idx) => (
           <div key={idx} className="h-item w-full lg:h-full lg:min-w-[70vw] flex items-center justify-center p-6 lg:p-10 relative border-b lg:border-b-0 lg:border-r border-white/5 group min-h-[50vh]">
             <div className="relative w-full lg:w-[80%] h-[40vh] lg:h-[70%] overflow-hidden border border-white/10 cursor-zoom-in"
                  onClick={() => { setLightboxIndex(idx); setLightboxOpen(true); }}>
               <Image 
                  src={src} 
                  alt={`Gallery image ${idx + 1}`} 
                  fill // <--- AJOUTEZ CECI
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110" 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw" 
                  quality={80} 
               />
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-black/20">
                 <span className="bg-white text-black text-xs font-bold px-4 py-2 uppercase tracking-widest">Agrandir</span>
               </div>
             </div>
             {/* Numéro visible sur mobile */}
             <span className="absolute bottom-10 right-10 text-6xl font-display text-white/5 lg:hidden">0{idx + 1}</span>
           </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer id="contact" className="min-h-screen flex flex-col justify-center items-center bg-[#050505] relative z-10 py-20 px-4">
        <div className="absolute inset-0 bg-cover opacity-20 pointer-events-none z-0" style={{ backgroundImage: "url('/pics/car/DSC00688.jpg')", backgroundPosition: 'center' }}></div>
        <div className="z-10 w-full max-w-5xl flex flex-col md:flex-row gap-16 items-center justify-between">
            
            <div className="text-center md:text-left">
              <p className="text-red-600 font-bold uppercase tracking-[0.3em] mb-4 animate-pulse">Ouvert aux commandes</p>
              <h2 className="text-5xl md:text-8xl font-display font-black uppercase tracking-tighter mb-8 text-white">
                Ready to <br/> Shoot?
              </h2>
              <MagneticButton>
                <a href="https://instagram.com/venoxalacam" target="_blank" className="inline-block px-10 py-5 border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                    Envoyer un message sur Instagram
                </a>
              </MagneticButton>
            </div>

            {/* Formulaire */}
            <BookingForm />
        </div>
      </footer>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={galleryImages.map(src => ({ src }))}
      />

      <style jsx global>{`
        .stroke-white { -webkit-text-stroke: 1px white; }
      `}</style>
    </div>
  );
}
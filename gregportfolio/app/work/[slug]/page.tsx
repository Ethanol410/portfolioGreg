"use client"
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Playfair_Display, Inter, Oswald } from 'next/font/google';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { ArrowLeft, ArrowRight } from 'lucide-react'; // Assure-toi d'avoir lucide-react ou utilise un svg

// --- FONTS (On réimporte pour garder le style) ---
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const oswald = Oswald({ subsets: ['latin'], variable: '--font-display' });

gsap.registerPlugin(ScrollTrigger);

// --- FAKE DATA (Simule une DB) ---
const projectData: any = {
  "automotive": {
    title: "Automotive",
    subtitle: "Speed & Legacy",
    desc: "Capturing the raw power of engineering. From the racetrack to the showroom, every curve tells a story of speed.",
    next: "portrait",
    images: [
      "/pics/car/DSC03037-Enhanced-NR.jpg",
      "/pics/car/_DSC5710.jpg",
      "/pics/car/DSC02570-Enhanced-NR.jpg",
      "/pics/car/DSC01439.jpg",
      "/pics/car/DSC00904.jpg",
      "/pics/car/DSC02671-Enhanced-NR.jpg",
        "/pics/car/IMG_1810-Enhanced-NR.jpg",
        "/pics/car/DSC02707-Enhanced-NR.jpg",
        "/pics/car/DSC03080-Enhanced-NR.jpg",
        "/pics/car/DSC00892.jpg",
        "/pics/car/DSC01449.jpg",
        "/pics/car/DSC01926-Enhanced-NR.jpg",
        "/pics/car/DSC00508.jpg",
        "/pics/car/DSC02558-Enhanced-NR.jpg",
        "/pics/car/DSC00476.jpg",
        "/pics/car/DSC00737.jpg",
        "/pics/car/_DSC5523.jpg",
        "/pics/car/_DSC5469.jpg",
        "/pics/car/DSC00694.jpg",
        "/pics/car/_DSC5389.jpg",
        "/pics/car/DSC03028-Enhanced-NR.jpg",
    ]
  },
  "portrait": {
    title: "Editorial Portrait",
    subtitle: "The Human Soul",
    desc: "Beyond the face. We look for the story, the emotion, and the unspoken words in every gaze.",
    next: "brand",
    images: [
      "/pics/portrait/blond1.jpg",
      "/pics/portrait/blond2.jpg",
      "/pics/portrait/blond3.jpg",
      "/pics/portrait/blond4.jpg",
      "/pics/portrait/blond5.jpg",
      "/pics/portrait/blond6.jpg",
      "/pics/portrait/erell1.jpg",
      "/pics/portrait/erell2.jpg",
      "/pics/portrait/erell3.jpg",
      "/pics/portrait/erell4.jpg",
      "/pics/portrait/erell5.jpg",
      "/pics/portrait/erell6.jpg",
      "/pics/portrait/erell7.jpg",
      "/pics/portrait/erell8.jpg",
      "/pics/portrait/erell9.jpg",
      "/pics/portrait/erell10.jpg",
      "/pics/portrait/erell11.jpg",
      "/pics/portrait/casque1.jpg",
        "/pics/portrait/casque2.jpg",
        "/pics/portrait/casque3.jpg",
        "/pics/portrait/casque4.jpg",
    ]
  },
  "brand": {
    title: "Brand Content",
    subtitle: "Identity & Vision",
    desc: "Elevating brands through visual storytelling. Consistent, powerful, and memorable imagery for the digital age.",
    next: "automotive",
    images: [
      "/pics/car/IMG_1830-Enhanced-NR.jpg",
      "/pics/car/DSC01428.jpg",
      "/pics/car/DSC02701-Enhanced-NR.jpg",
      "/pics/car/DSC00896.jpg",
        "/pics/car/DSC01417-Enhanced-NR.jpg",
        "/pics/car/DSC00715.jpg",
        "/pics/car/DSC00436.jpg",
        "/pics/car/DSC00748.jpg",
        "/pics/portrait/casque3.jpg",
    ]
  }
};

export default function ProjectPage() {
  const { slug } = useParams(); // Récupère "automotive", "portrait", etc.
  const containerRef = useRef(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Sécurité si le slug n'existe pas dans nos data
  const currentData = projectData[slug as string] || projectData["automotive"];

  useEffect(() => {
    // 1. Smooth Scroll
    const lenis = new Lenis();
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // 2. Animations GSAP
    let ctx = gsap.context(() => {
      
      // Hero reveal
      const tl = gsap.timeline();
      tl.from(".page-title", { y: 100, opacity: 0, duration: 1.5, ease: "power4.out" })
        .from(".page-desc", { y: 50, opacity: 0, duration: 1, ease: "power3.out" }, "-=1")
        .from(".gallery-img", { 
          y: 100, 
          opacity: 0, 
          duration: 1, 
          stagger: 0.1, 
          ease: "power3.out" 
        }, "-=0.5");

    }, containerRef);

    return () => { lenis.destroy(); ctx.revert(); };
  }, [slug]); // Relance l'anim si on change de projet

  return (
    <div ref={containerRef} className={`${playfair.variable} ${inter.variable} ${oswald.variable} bg-[#050505] text-white font-sans min-h-screen selection:bg-red-600 selection:text-white`}>
      
      {/* HEADER NAV */}
      <nav className="fixed top-0 w-full p-8 flex justify-between items-center z-50 mix-blend-difference">
        <Link href="/" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-red-500 transition-colors">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Back Home
        </Link>
        <span className="font-display font-bold uppercase text-xl">Venox.</span>
      </nav>

      {/* HERO SECTION DU PROJET */}
      <header className="pt-40 pb-20 px-6 md:px-20 max-w-7xl mx-auto">
        <span className="text-red-600 font-bold uppercase tracking-[0.3em] text-xs block mb-4">
            Selected Works — {currentData.subtitle}
        </span>
        <h1 className="page-title text-6xl md:text-9xl font-display font-black uppercase tracking-tighter mb-10 text-transparent stroke-white leading-none">
            {currentData.title}
        </h1>
        <div className="page-desc max-w-xl border-l border-white/20 pl-8">
            <p className="text-gray-400 text-lg md:text-xl leading-relaxed font-serif italic">
                {currentData.desc}
            </p>
        </div>
      </header>

      {/* MASONRY GALLERY (GRID ASYMETRIQUE) */}
      <section className="px-4 md:px-10 pb-32">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {currentData.images.map((src: string, index: number) => (
                <div key={index} 
                     className="gallery-img break-inside-avoid relative group overflow-hidden cursor-zoom-in"
                     onClick={() => { setLightboxIndex(index); setLightboxOpen(true); }}>
                    
                    <img src={src} alt="Project" className="w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out scale-100 group-hover:scale-105" />
                    
                    {/* Overlay Info */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                        <span className="border border-white/30 bg-black/50 backdrop-blur-md px-4 py-2 text-xs font-bold uppercase tracking-widest text-white">
                            View Full
                        </span>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* NEXT PROJECT NAVIGATION */}
      <section className="h-[60vh] bg-[#0a0a0a] flex items-center justify-center border-t border-white/10 relative overflow-hidden group">
        <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
            <img src={projectData[currentData.next].images[0]} className="w-full h-full object-cover grayscale" />
        </div>
        
        <Link href={`/work/${currentData.next}`} className="relative z-10 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.4em] mb-4 text-white/60">Next Collection</p>
            <h2 className="text-6xl md:text-8xl font-display font-black uppercase tracking-tighter text-white group-hover:scale-110 transition-transform duration-700">
                {projectData[currentData.next].title}
            </h2>
            <div className="mt-8 inline-flex items-center gap-2 border-b border-red-600 pb-1 text-red-500 font-bold uppercase tracking-widest">
                Discover <ArrowRight size={16} />
            </div>
        </Link>
      </section>

      {/* LIGHTBOX */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={currentData.images.map((src: string) => ({ src }))}
      />
      
       <style jsx global>{`
        .stroke-white { -webkit-text-stroke: 1px white; color: transparent; }
      `}</style>
    </div>
  );
}
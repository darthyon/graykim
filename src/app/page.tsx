'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'gray-kim' | 'backstory' | 'that-bar' | 'plots';

interface Plot {
  title: string;
  tag: string;
  description: string;
}

const pages: { id: Tab; label: string }[] = [
  { id: 'gray-kim', label: 'Bio' },
  { id: 'backstory', label: 'Timeline' },
  { id: 'that-bar', label: 'That Bar' },
  { id: 'plots', label: 'Plot List' },
];

export default function Home() {
  const [showMain, setShowMain] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('gray-kim');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [imageIndex, setImageIndex] = useState(0);
  const [barImageIndex, setBarImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentBarImageIndex, setCurrentBarImageIndex] = useState(0);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [bioContent, setBioContent] = useState<any>(null);
  const [timelineContent, setTimelineContent] = useState<any[]>([]);
  const [thatBarContent, setThatBarContent] = useState<any>(null);

  const currentPageIndex = pages.findIndex(p => p.id === activeTab);
  
  const goToNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setDirection(1);
      setActiveTab(pages[currentPageIndex + 1].id);
    }
  };
  
  const goToPrevPage = () => {
    if (currentPageIndex > 0) {
      setDirection(-1);
      setActiveTab(pages[currentPageIndex - 1].id);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showMain) {
        setShowMain(false);
      } else if (e.key === 'ArrowLeft' && showMain) {
        goToPrevPage();
      } else if (e.key === 'ArrowRight' && showMain) {
        goToNextPage();
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showMain, currentPageIndex]);

  // Auto-change Bio carousel every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % 3);
    }, 7000); // Change every 7 seconds
    return () => clearInterval(interval);
  }, []);

  // Auto-change That Bar carousel every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBarImageIndex((prev) => (prev + 1) % 2);
    }, 7000); // Change every 7 seconds
    return () => clearInterval(interval);
  }, []);

  // Load all content from MD files
  useEffect(() => {
    // Load plots
    fetch('/api/content?type=plots')
      .then(res => res.json())
      .then(data => setPlots(data))
      .catch(err => console.error('Failed to load plots:', err));
    
    // Load bio
    fetch('/api/content?type=bio')
      .then(res => res.json())
      .then(data => setBioContent(data))
      .catch(err => console.error('Failed to load bio:', err));
    
    // Load timeline
    fetch('/api/content?type=timeline')
      .then(res => res.json())
      .then(data => setTimelineContent(data))
      .catch(err => console.error('Failed to load timeline:', err));
    
    // Load that-bar
    fetch('/api/content?type=that-bar')
      .then(res => res.json())
      .then(data => setThatBarContent(data))
      .catch(err => console.error('Failed to load that-bar:', err));
  }, []);

  if (!showMain) {
    return (
      <div className="film-grain h-screen relative overflow-hidden bg-black flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8 lg:py-16">
        {/* Menu Cover Book */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative max-w-2xl w-full h-full lg:h-auto lg:aspect-[3/4] perspective-1000"
        >
          {/* Book Shadow */}
          <div className="absolute inset-0 bg-black/80 blur-3xl scale-95" />
          
          {/* Menu Cover */}
          <div className="relative h-full bg-gradient-to-br from-[#1a1a1a] via-[#0d0d0d] to-black rounded-sm shadow-2xl border-2 border-white/5 flex flex-col items-center justify-center p-12">
            {/* Decorative Corner Elements */}
            <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-white/10" />
            <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-white/10" />
            <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-white/10" />
            <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-white/10" />
            
            {/* Menu Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-center mb-8"
            >
              <p className="font-header text-[10px] tracking-[0.5em] uppercase text-white/40 mb-6">Est. 2022</p>
              <h1 className="font-signature neon-text neon-flicker text-6xl sm:text-7xl md:text-8xl text-white mb-6 leading-none">
                That Bar
              </h1>
              <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#8b0000] to-transparent mx-auto mb-6" />
              <p className="font-signature text-2xl text-white/60 italic">Menu</p>
            </motion.div>
            
            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="font-header text-xs tracking-[0.3em] uppercase text-white/30 text-center mb-12 max-w-md"
            >
              Thirsty sinners are welcomed
            </motion.p>
            
            {/* View Menu Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMain(true)}
              className="group relative px-12 py-4 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#8b0000]/30 transition-all duration-300"
            >
              <span className="text-white/80 group-hover:text-white font-header text-sm tracking-[0.3em] uppercase transition-colors">
                View Menu
              </span>
            </motion.button>
            
            {/* Bottom Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute bottom-12 font-header text-[10px] tracking-[0.3em] uppercase text-white/20"
            >
              Underground District
            </motion.p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="film-grain h-screen bg-black overflow-hidden flex flex-col">
      {/* Escape Button - Top Right */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowMain(false)}
        className="fixed top-8 right-8 z-[100] px-6 py-3 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
      >
        <span className="text-white/60 group-hover:text-white font-header text-[10px] tracking-[0.3em] uppercase transition-colors">
          Esc
        </span>
      </motion.button>


      {/* Content Area with Container */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div 
          key={activeTab}
          custom={direction}
          initial={{ 
            opacity: 0,
            rotateY: direction > 0 ? 15 : -15,
            scale: 0.95
          }}
          animate={{ 
            opacity: 1,
            rotateY: 0,
            scale: 1
          }}
          exit={{ 
            opacity: 0,
            rotateY: direction > 0 ? -15 : 15,
            scale: 0.95
          }}
          transition={{ 
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1]
          }}
          style={{ perspective: 1200 }}
          className="flex-1 relative overflow-hidden"
        >
          {/* Mobile Layout */}
          <div className="lg:hidden h-full py-4 px-4 flex flex-col">
            <div className="max-w-4xl mx-auto relative w-full h-full flex flex-col">
              {/* Page Shadow */}
              <div className="absolute inset-0 bg-black/60 blur-3xl scale-95" />
              
              {/* Single Menu Page - Mobile */}
              <div className="relative bg-gradient-to-b from-[#1a1a1a] via-[#0d0d0d] to-black rounded-sm shadow-2xl border border-white/5 h-full flex flex-col overflow-hidden">
              
              {/* Desktop Navigation - Inside Menu */}
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="hidden lg:flex justify-center pt-8 relative z-50"
              >
                <nav className="group relative px-6 py-3 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                  <div className="flex items-center gap-8">
                    {pages.map((page) => (
                      <motion.button
                        key={page.id}
                        onClick={() => {
                          setDirection(pages.findIndex(p => p.id === page.id) > currentPageIndex ? 1 : -1);
                          setActiveTab(page.id);
                        }}
                        className="relative px-4 py-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className={`font-header text-[10px] tracking-[0.3em] uppercase transition-colors duration-300 ${
                          activeTab === page.id ? 'text-white' : 'text-white/60 hover:text-white'
                        }`}>
                          {page.label}
                        </span>
                        {activeTab === page.id && (
                          <motion.div
                            layoutId="activeTabDesktop"
                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#8b0000]"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </nav>
              </motion.div>
              
              {/* Mobile Navigation - Bottom Fixed */}
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="lg:hidden fixed left-1/2 -translate-x-1/2 z-50"
                style={{ 
                  bottom: 'max(5rem, calc(3rem + env(safe-area-inset-bottom, 0px)))'
                }}
              >
                <nav className="px-8 py-4 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group">
                  <div className="flex items-center gap-8">
                    {pages.map((page) => (
                      <motion.button
                        key={page.id}
                        onClick={() => {
                          setDirection(pages.findIndex(p => p.id === page.id) > currentPageIndex ? 1 : -1);
                          setActiveTab(page.id);
                        }}
                        className="relative"
                        whileTap={{ scale: 0.9 }}
                      >
                        <span className={`font-header text-[10px] tracking-[0.3em] uppercase transition-colors duration-300 ${
                          activeTab === page.id ? 'text-white' : 'text-white/60 hover:text-white'
                        }`}>
                          {page.label === 'Timeline' ? 'Story' : page.label === 'Plot List' ? 'Plots' : page.label === 'That Bar' ? 'Bar' : page.label}
                        </span>
                        {activeTab === page.id && (
                          <motion.div
                            layoutId="activeTabMobile"
                            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#8b0000]"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </nav>
              </motion.div>
              {activeTab === 'gray-kim' && (
                <div className="flex-1 overflow-y-auto p-6 pb-32 relative">
                  {/* Decorative Corner Elements */}
                  <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-white/10" />
                  <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-white/10" />
                  <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-white/10" />
                  <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-white/10" />
                  
                  {/* Scroll indicator - Fixed to viewport */}
                  <motion.div
                    className="fixed bottom-28 right-8 z-50 lg:hidden"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <svg className="w-8 h-8 text-white/60 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                  
                  {/* Page Title */}
                  <motion.div
                    className="text-center mb-12 pt-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <p className="font-header text-[10px] tracking-[0.5em] uppercase text-white/40 mb-6">Biography</p>
                    <h2 className="font-signature text-6xl sm:text-7xl md:text-8xl text-white mb-6 leading-none">
                      Gray Kim
                    </h2>
                    <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#8b0000] to-transparent mx-auto mb-6" />
                    <p className="font-header text-xs tracking-[0.3em] uppercase text-white/30">30, Owner of That Bar</p>
                  </motion.div>
                  
                  {/* Auto-changing Carousel */}
                  <motion.div 
                    className="relative aspect-video overflow-hidden rounded-sm mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentImageIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={['/gray1.webp', '/gray2.webp', '/gray3.webp'][currentImageIndex]}
                          alt="Gray Kim"
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                    </AnimatePresence>
                    {/* Carousel Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                      {[0, 1, 2].map((i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImageIndex(i)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            currentImageIndex === i ? 'bg-white w-6' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </motion.div>
                  
                  {bioContent && (
                    <>
                      {/* Quote - Featured */}
                      {bioContent['The One-Liner'] && (
                        <motion.div 
                          className="relative mb-12 p-8 border-l-2 border-[#8b0000]/50"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4, duration: 0.8 }}
                        >
                          <p className="font-signature text-2xl text-white italic leading-relaxed mb-2">
                            {bioContent['The One-Liner']}
                          </p>
                          <p className="text-[10px] text-gray-600 uppercase tracking-[0.3em]">— Gray Kim</p>
                        </motion.div>
                      )}
                      
                      {/* Who */}
                      {bioContent['Who?'] && (
                        <motion.div
                          className="mb-12"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5, duration: 0.8 }}
                        >
                          <h3 className="font-signature text-3xl text-white mb-4">Who?</h3>
                          <div className="text-gray-400 text-sm leading-relaxed space-y-4">
                            {bioContent['Who?'].split('\n\n').filter((p: string) => p.trim()).map((para: string, i: number) => (
                              <p key={i} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
                            ))}
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Daylight */}
                      {bioContent['Daylight'] && (
                        <motion.div
                          className="mb-12 pb-8 border-b border-gray-900"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6, duration: 0.8 }}
                        >
                          <h3 className="font-signature text-3xl text-white mb-4">Daylight</h3>
                          <div className="text-gray-400 text-sm leading-relaxed space-y-4">
                            {bioContent['Daylight'].split('\n\n').filter((p: string) => p.trim()).map((para: string, i: number) => (
                              <p key={i}>{para}</p>
                            ))}
                          </div>
                        </motion.div>
                      )}
                      
                      {/* 0:00AM */}
                      {bioContent['0:00AM'] && (
                        <motion.div
                          className="mb-12 pb-8 border-b border-gray-900"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.7, duration: 0.8 }}
                        >
                          <h3 className="font-signature text-3xl text-white mb-4">0:00AM</h3>
                          <div className="text-gray-400 text-sm leading-relaxed space-y-4">
                            {bioContent['0:00AM'].split('\n\n').filter((p: string) => p.trim()).map((para: string, i: number) => (
                              <p key={i}>{para}</p>
                            ))}
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Gray's Rule */}
                      {bioContent["Gray's Rule"] && (
                        <motion.div
                          className="mb-8"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8, duration: 0.8 }}
                        >
                          <h3 className="font-signature text-3xl text-white mb-4">Gray's Rule</h3>
                          <div className="text-gray-400 text-sm leading-relaxed">
                            {bioContent["Gray's Rule"].split('\n\n').filter((p: string) => p.trim()).map((para: string, i: number) => (
                              <p key={i}>{para}</p>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </>
                  )}
                </div>
              )}

              {activeTab === 'backstory' && (
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-12 pb-20 lg:pb-12 relative">
              {/* Decorative Corner Elements */}
              <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-white/10" />
              <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-white/10" />
              <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-white/10" />
              <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-white/10" />
              
              {/* Scroll indicator - Fixed to viewport */}
              <motion.div
                className="fixed bottom-28 right-8 z-50 lg:hidden"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <svg className="w-8 h-8 text-white/60 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
              
              {/* Page Title */}
              <motion.div
                className="text-center mb-12 pt-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <p className="font-header text-[10px] tracking-[0.5em] uppercase text-white/40 mb-6">The Journey</p>
                <h2 className="font-signature text-6xl sm:text-7xl md:text-8xl text-white mb-6 leading-none">
                  Timeline
                </h2>
                <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#8b0000] to-transparent mx-auto mb-6" />
                <p className="font-header text-xs tracking-[0.3em] uppercase text-white/30">1994 — Present</p>
              </motion.div>
              
              {/* Content */}
              <div className="relative">
                <div className="max-w-4xl mx-auto">
                  
                  <div className="space-y-10 mb-12">
                    {timelineContent.map((item, i) => (
                      <motion.div
                        key={i}
                        className="group relative pl-8 border-l border-gray-800"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.6 }}
                      >
                        <motion.div 
                          className={`absolute -left-[5px] top-2 w-[9px] h-[9px] rounded-full border-2 border-gray-800 ${i === timelineContent.length - 1 ? 'bg-[#8b0000] animate-pulse' : 'bg-black group-hover:bg-[#8b0000]'} transition-colors`}
                          whileHover={{ scale: 1.3 }}
                        />
                        <p className="text-[10px] text-[#8b0000] uppercase tracking-[0.3em] mb-2">{item.year}</p>
                        <h3 className="text-2xl text-white font-signature mb-3 group-hover:text-[#8b0000] transition-colors">{item.title}</h3>
                        <div className="text-gray-400 text-sm leading-relaxed space-y-3">
                          {item.description.split('\n\n').map((para: string, j: number) => (
                            <p key={j}>{para}</p>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Fade gradient at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
              </div>
                </div>
              )}

              {activeTab === 'that-bar' && (
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-12 pb-20 lg:pb-12 relative">
              {/* Decorative Corner Elements */}
              <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-white/10" />
              <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-white/10" />
              <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-white/10" />
              <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-white/10" />
              
              {/* Scroll indicator - Fixed to viewport */}
              <motion.div
                className="fixed bottom-28 right-8 z-50 lg:hidden"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <svg className="w-8 h-8 text-white/60 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
              
              {/* Page Title */}
              <motion.div
                className="text-center mb-12 pt-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <p className="font-header text-[10px] tracking-[0.5em] uppercase text-white/40 mb-6">The Location</p>
                <h2 className="font-signature text-6xl sm:text-7xl md:text-8xl text-white mb-6 leading-none">
                  That Bar
                </h2>
                <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#8b0000] to-transparent mx-auto mb-6" />
                <p className="font-header text-xs tracking-[0.3em] uppercase text-white/30">Underground District</p>
              </motion.div>
              
              {/* Content */}
              <div className="relative">
                <div className="max-w-4xl mx-auto">
                  {/* Auto-changing Carousel */}
                  <motion.div
                    className="relative aspect-video mb-8 overflow-hidden rounded-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentBarImageIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={['/thatbar3.webp', '/thatbar2.webp'][currentBarImageIndex]}
                          alt="That Bar Interior"
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                    </AnimatePresence>
                    {/* Carousel Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                      {[0, 1].map((i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentBarImageIndex(i)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            currentBarImageIndex === i ? 'bg-white w-6' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </motion.div>
                  
                  {thatBarContent && (
                    <div className="space-y-10 mb-12">
                      {Object.entries(thatBarContent).map(([key, value], i) => (
                        <motion.div
                          key={key}
                          className="border-b border-gray-900 pb-10 last:border-0"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1, duration: 0.6 }}
                        >
                          <h3 className="text-2xl text-white font-signature mb-4 group-hover:text-[#8b0000] transition-colors">{key}</h3>
                          <div className="text-gray-400 text-sm leading-relaxed space-y-3">
                            {(value as string).split('\n\n').map((para: string, j: number) => (
                              <p key={j}>{para}</p>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  </div>
                </div>
                
                {/* Fade gradient at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
              </div>
              )}

              {activeTab === 'plots' && (
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-12 pb-20 lg:pb-12 relative">
              {/* Decorative Corner Elements */}
              <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-white/10" />
              <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-white/10" />
              <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-white/10" />
              <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-white/10" />
              
              {/* Scroll indicator - Fixed to viewport */}
              <motion.div
                className="fixed bottom-28 right-8 z-50 lg:hidden"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <svg className="w-8 h-8 text-white/60 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
              
              {/* Page Title */}
              <motion.div
                className="text-center mb-12 pt-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <p className="font-header text-[10px] tracking-[0.5em] uppercase text-white/40 mb-6">Place Your Order</p>
                <h2 className="font-signature text-6xl sm:text-7xl md:text-8xl text-white mb-6 leading-none">
                  Plot List
                </h2>
                <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#8b0000] to-transparent mx-auto mb-6" />
                <p className="font-signature text-xl text-white/60 italic">Choose your adventure</p>
                
                {/* Intensity Legend */}
                <div className="mt-8 text-xs text-gray-500" style={{ fontFamily: 'var(--font-manrope)' }}>
                  <p className="mb-1">⚡ = Low (chill, quiet) | ⚡⚡ = Medium (tension, drama) | ⚡⚡⚡ = High (chaos, unhinged)</p>
                  <p className="mb-3"></p>
                  <p className="leading-relaxed max-w-md mx-auto">These are conversation starters—something to kick things off. They might change completely once we start plotting, and I'm very much open to that. Got your own ideas? Even better. Let's talk.</p>
                </div>
              </motion.div>
              
              {/* Content */}
              <div className="relative">
                <div className="max-w-xl">
                  <div className="space-y-8 mb-12">
                    {plots.map((plot, i) => (
                      <motion.div
                        key={i}
                        className="group relative cursor-pointer pb-8 border-b border-gray-900 last:border-0"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.6 }}
                        whileHover={{ x: 5 }}
                      >
                        {/* Menu item header */}
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-2xl text-white font-signature group-hover:text-[#8b0000] transition-colors">
                            {plot.title}
                          </h3>
                          <span className="text-[10px] text-[#8b0000] font-header tracking-wider px-2 py-1 border border-[#8b0000]/30 rounded">
                            {plot.tag}
                          </span>
                        </div>
                        
                        {/* Description */}
                        <p className="text-gray-400 text-sm leading-relaxed">{plot.description}</p>
                        
                        {/* Decorative line */}
                        <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#8b0000] group-hover:w-full transition-all duration-500" />
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Fade gradient at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
              </div>
                </div>
              )}
              </div>
            </div>
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center py-8 px-8 h-full">
            <div className="max-w-4xl mx-auto relative w-full">
              {/* Page Shadow */}
              <div className="absolute inset-0 bg-black/60 blur-3xl scale-95" />
              
              {/* Single Menu Page - Desktop */}
              <div className="relative bg-gradient-to-b from-[#1a1a1a] via-[#0d0d0d] to-black rounded-sm shadow-2xl border border-white/5">
                
                {/* Desktop Navigation - Inside Menu */}
                <motion.div 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex justify-center pt-8 relative z-50"
                >
                  <nav className="group relative px-6 py-3 rounded-full backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                    <div className="flex items-center gap-8">
                      {pages.map((page) => (
                        <motion.button
                          key={page.id}
                          onClick={() => {
                            setDirection(pages.findIndex(p => p.id === page.id) > currentPageIndex ? 1 : -1);
                            setActiveTab(page.id);
                          }}
                          className="relative px-4 py-1"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className={`font-header text-[10px] tracking-[0.3em] uppercase transition-colors duration-300 ${
                            activeTab === page.id ? 'text-white' : 'text-white/60 hover:text-white'
                          }`}>
                            {page.label}
                          </span>
                          {activeTab === page.id && (
                            <motion.div
                              layoutId="activeTabDesktopInner"
                              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#8b0000]"
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </nav>
                </motion.div>
                
                {/* Desktop Content - All Pages */}
                <div className="overflow-y-auto max-h-[85vh] p-12 relative">
                  {/* Decorative Corner Elements - Desktop */}
                  <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-white/10 pointer-events-none" />
                  <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-white/10 pointer-events-none" />
                  <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-white/10 pointer-events-none" />
                  <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-white/10 pointer-events-none" />
                  
                  {/* Scroll indicator - Desktop */}
                  <motion.div
                    className="fixed bottom-12 right-12 z-50 hidden lg:block"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <svg className="w-8 h-8 text-white/60 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                  
                  {activeTab === 'gray-kim' && (
                    <div>
                      
                      {/* Page Title */}
                      <motion.div
                        className="text-center mb-12 pt-8"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                      >
                        <p className="font-header text-[10px] tracking-[0.5em] uppercase text-white/40 mb-6">Biography</p>
                        <h2 className="font-signature text-6xl sm:text-7xl md:text-8xl text-white mb-6 leading-none">
                          Gray Kim
                        </h2>
                        <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#8b0000] to-transparent mx-auto mb-6" />
                        <p className="font-header text-xs tracking-[0.3em] uppercase text-white/30">30, Owner of That Bar</p>
                      </motion.div>
                      
                      {/* Content */}
                      <div className="relative">
                        <div className="max-w-4xl mx-auto">
                          {/* Auto-changing Carousel */}
                          <motion.div
                            className="relative aspect-video mb-8 overflow-hidden rounded-sm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.6 }}
                          >
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={currentImageIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0"
                              >
                                <Image
                                  src={['/gray1.webp', '/gray2.webp', '/gray3.webp'][currentImageIndex]}
                                  alt="Gray Kim"
                                  fill
                                  className="object-cover"
                                />
                              </motion.div>
                            </AnimatePresence>
                            {/* Carousel Indicators */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                              {[0, 1, 2].map((i) => (
                                <button
                                  key={i}
                                  onClick={() => setCurrentImageIndex(i)}
                                  className={`w-2 h-2 rounded-full transition-all ${
                                    currentImageIndex === i ? 'bg-white w-6' : 'bg-white/50'
                                  }`}
                                />
                              ))}
                            </div>
                          </motion.div>
                          
                          {bioContent && (
                            <>
                              {/* Quote - Featured */}
                              {bioContent['The One-Liner'] && (
                                <motion.div 
                                  className="relative mb-12 p-8 border-l-2 border-[#8b0000]/50"
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.4, duration: 0.8 }}
                                >
                                  <p className="font-signature text-2xl text-white italic leading-relaxed mb-2">
                                    {bioContent['The One-Liner']}
                                  </p>
                                  <p className="text-[10px] text-gray-600 uppercase tracking-[0.3em]">— Gray Kim</p>
                                </motion.div>
                              )}
                              
                              {/* Who */}
                              {bioContent['Who?'] && (
                                <motion.div
                                  className="mb-12"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.5, duration: 0.8 }}
                                >
                                  <h3 className="font-signature text-3xl text-white mb-4">Who?</h3>
                                  <div className="text-gray-400 text-sm leading-relaxed space-y-4">
                                    {bioContent['Who?'].split('\n\n').filter((p: string) => p.trim()).map((para: string, i: number) => (
                                      <p key={i} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                              
                              {/* Daylight */}
                              {bioContent['Daylight'] && (
                                <motion.div
                                  className="mb-12 pb-8 border-b border-gray-900"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.6, duration: 0.8 }}
                                >
                                  <h3 className="font-signature text-3xl text-white mb-4">Daylight</h3>
                                  <div className="text-gray-400 text-sm leading-relaxed space-y-4">
                                    {bioContent['Daylight'].split('\n\n').filter((p: string) => p.trim()).map((para: string, i: number) => (
                                      <p key={i}>{para}</p>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                              
                              {/* 0:00AM */}
                              {bioContent['0:00AM'] && (
                                <motion.div
                                  className="mb-12 pb-8 border-b border-gray-900"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.7, duration: 0.8 }}
                                >
                                  <h3 className="font-signature text-3xl text-white mb-4">0:00AM</h3>
                                  <div className="text-gray-400 text-sm leading-relaxed space-y-4">
                                    {bioContent['0:00AM'].split('\n\n').filter((p: string) => p.trim()).map((para: string, i: number) => (
                                      <p key={i}>{para}</p>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                              
                              {/* Gray's Rule */}
                              {bioContent["Gray's Rule"] && (
                                <motion.div
                                  className="mb-32"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.8, duration: 0.8 }}
                                >
                                  <h3 className="font-signature text-3xl text-white mb-4">Gray's Rule</h3>
                                  <div className="text-gray-400 text-sm leading-relaxed">
                                    {bioContent["Gray's Rule"].split('\n\n').filter((p: string) => p.trim()).map((para: string, i: number) => (
                                      <p key={i}>{para}</p>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'backstory' && (
                    <div>
                      {/* Page Title */}
                      <motion.div
                        className="text-center mb-12 pt-8"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                      >
                        <p className="font-header text-[10px] tracking-[0.5em] uppercase text-white/40 mb-6">The Journey</p>
                        <h2 className="font-signature text-6xl sm:text-7xl md:text-8xl text-white mb-6 leading-none">
                          Timeline
                        </h2>
                        <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#8b0000] to-transparent mx-auto mb-6" />
                        <p className="font-header text-xs tracking-[0.3em] uppercase text-white/30">1994 — Present</p>
                      </motion.div>
                      
                      {/* Content */}
                      <div className="relative">
                        <div className="max-w-4xl mx-auto">
                          <div className="space-y-10 mb-12">
                            {timelineContent.map((item, i) => (
                              <motion.div
                                key={i}
                                className="group relative pl-8 border-l border-gray-800"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.6 }}
                              >
                                <motion.div 
                                  className={`absolute -left-[5px] top-2 w-[9px] h-[9px] rounded-full border-2 border-gray-800 ${i === timelineContent.length - 1 ? 'bg-[#8b0000] animate-pulse' : 'bg-black group-hover:bg-[#8b0000]'} transition-colors`}
                                  whileHover={{ scale: 1.3 }}
                                />
                                <p className="text-[10px] text-[#8b0000] uppercase tracking-[0.3em] mb-2">{item.year}</p>
                                <h3 className="text-2xl text-white font-signature mb-3 group-hover:text-[#8b0000] transition-colors">{item.title}</h3>
                                <div className="text-gray-400 text-sm leading-relaxed space-y-3">
                                  {item.description.split('\n\n').map((para: string, j: number) => (
                                    <p key={j}>{para}</p>
                                  ))}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'that-bar' && (
                    <div>
                      {/* Page Title */}
                      <motion.div
                        className="text-center mb-12 pt-8"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                      >
                        <p className="font-header text-[10px] tracking-[0.5em] uppercase text-white/40 mb-6">The Location</p>
                        <h2 className="font-signature text-6xl sm:text-7xl md:text-8xl text-white mb-6 leading-none">
                          That Bar
                        </h2>
                        <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#8b0000] to-transparent mx-auto mb-6" />
                        <p className="font-header text-xs tracking-[0.3em] uppercase text-white/30">Underground District</p>
                      </motion.div>
                      
                      {/* Content */}
                      <div className="relative">
                        <div className="max-w-4xl mx-auto">
                          {/* Auto-changing Carousel */}
                          <motion.div
                            className="relative aspect-video mb-8 overflow-hidden rounded-sm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.6 }}
                          >
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={currentBarImageIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0"
                              >
                                <Image
                                  src={['/thatbar3.webp', '/thatbar2.webp'][currentBarImageIndex]}
                                  alt="That Bar Interior"
                                  fill
                                  className="object-cover"
                                />
                              </motion.div>
                            </AnimatePresence>
                            {/* Carousel Indicators */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                              {[0, 1].map((i) => (
                                <button
                                  key={i}
                                  onClick={() => setCurrentBarImageIndex(i)}
                                  className={`w-2 h-2 rounded-full transition-all ${
                                    currentBarImageIndex === i ? 'bg-white w-6' : 'bg-white/50'
                                  }`}
                                />
                              ))}
                            </div>
                          </motion.div>
                          
                          {thatBarContent && (
                            <div className="space-y-10 mb-12">
                              {Object.entries(thatBarContent).map(([key, value], i) => (
                                <motion.div
                                  key={key}
                                  className="border-b border-gray-900 pb-10 last:border-0"
                                  initial={{ opacity: 0, y: 30 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.1, duration: 0.6 }}
                                >
                                  <h3 className="text-2xl text-white font-signature mb-4 group-hover:text-[#8b0000] transition-colors">{key}</h3>
                                  <div className="text-gray-400 text-sm leading-relaxed space-y-3">
                                    {(value as string).split('\n\n').map((para: string, j: number) => (
                                      <p key={j}>{para}</p>
                                    ))}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'plots' && (
                    <div>
                      {/* Page Title */}
                      <motion.div
                        className="text-center mb-12 pt-8"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                      >
                        <p className="font-header text-[10px] tracking-[0.5em] uppercase text-white/40 mb-6">Place Your Order</p>
                        <h2 className="font-signature text-6xl sm:text-7xl md:text-8xl text-white mb-6 leading-none">
                          Plot List
                        </h2>
                        <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#8b0000] to-transparent mx-auto mb-6" />
                        <p className="font-signature text-xl text-white/60 italic">Choose your adventure</p>
                        
                        {/* Intensity Legend */}
                        <div className="mt-8 text-xs text-gray-500" style={{ fontFamily: 'var(--font-manrope)' }}>
                          <p className="mb-1">⚡ = Low (chill, quiet) | ⚡⚡ = Medium (tension, drama) | ⚡⚡⚡ = High (chaos, unhinged)</p>
                          <p className="mb-3"></p>
                          <p className="leading-relaxed max-w-md mx-auto">These are conversation starters—something to kick things off. They might change completely once we start plotting, and I'm very much open to that. Got your own ideas? Even better. Let's talk.</p>
                        </div>
                      </motion.div>
                      
                      {/* Content */}
                      <div className="relative">
                        <div className="max-w-xl mx-auto">
                          <div className="space-y-8 mb-12">
                            {plots.map((plot, i) => (
                              <motion.div
                                key={i}
                                className="group relative cursor-pointer pb-8 border-b border-gray-900 last:border-0"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.6 }}
                                whileHover={{ x: 5 }}
                              >
                                {/* Menu item header */}
                                <div className="flex items-start justify-between mb-3">
                                  <h3 className="text-2xl text-white font-signature group-hover:text-[#8b0000] transition-colors">
                                    {plot.title}
                                  </h3>
                                  <span className="text-[10px] text-[#8b0000] font-header tracking-wider px-2 py-1 border border-[#8b0000]/30 rounded">
                                    {plot.tag}
                                  </span>
                                </div>
                                
                                {/* Description */}
                                <p className="text-gray-400 text-sm leading-relaxed">{plot.description}</p>
                                
                                {/* Decorative line */}
                                <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#8b0000] group-hover:w-full transition-all duration-500" />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

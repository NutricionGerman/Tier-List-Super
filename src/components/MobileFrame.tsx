import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, Battery, ShieldAlert, CheckCircle } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [time, setTime] = useState<string>('17:04');

  // Update clock every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      let minutes = now.getMinutes();
      const strHours = hours < 10 ? '0' + hours : hours.toString();
      const strMinutes = minutes < 10 ? '0' + minutes : minutes.toString();
      setTime(`${strHours}:${strMinutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  if (isFullscreen) {
    return (
      <div className="min-h-screen bg-editorial-bg text-editorial-text transition-colors duration-300">
        {/* Floating Controller to switch back */}
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(false)}
            className="flex items-center gap-2 px-4 py-2.5 bg-editorial-text hover:bg-stone-800 text-white rounded-full shadow-lg font-sans text-xs font-semibold tracking-wider transition-all duration-300 hover:scale-105"
            title="Vista de Dispositivo Móvil"
          >
            <Smartphone className="w-4 h-4 text-[#C5A059]" />
            <span>Vista Móvil</span>
          </button>
        </div>
        <div className="w-full min-h-screen">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F2EB] flex flex-col items-center justify-center p-4 py-8 md:p-8 select-none font-sans">
      
      {/* Top Selector Banner */}
      <div className="w-full max-w-sm mb-6 flex items-center justify-between px-2">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-editorial-text tracking-tight">Simulador de Dispositivo</span>
          <span className="text-[10px] text-editorial-muted">Diseñado para Smartphones</span>
        </div>
        
        <button
          onClick={() => setIsFullscreen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FCFAF7] hover:bg-white border border-editorial-border text-editorial-text hover:text-black rounded-lg text-xs font-medium shadow-sm transition-all duration-200"
          title="Vista de Pantalla Completa"
        >
          <Monitor className="w-3.5 h-3.5 text-editorial-muted" />
          <span>Pantalla Completa</span>
        </button>
      </div>

      {/* Simulated Smartphone Shell */}
      <div className="relative w-full max-w-[390px] h-[820px] bg-slate-950 rounded-[55px] shadow-[0_25px_60px_-15px_rgba(45,42,38,0.2)] border-[12px] border-slate-900 flex flex-col overflow-hidden transition-all duration-300">
        
        {/* Dynamic Inner Gloss Glow */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-40 rounded-t-[43px]" />
        
        {/* Hardware Elements: Speaker Grille and Front Camera Notch */}
        <div className="absolute top-2 inset-x-0 flex justify-center z-50 pointer-events-none">
          {/* Dynamic Island / Pill Camera */}
          <div className="w-28 h-6.5 bg-slate-900 rounded-full flex items-center justify-end px-3.5 shadow-inner gap-1">
            <div className="w-2 h-2 rounded-full bg-[#080d1a] border border-slate-800/50" />
            <div className="w-1 h-1 rounded-full bg-[#111e3b] opacity-80" />
          </div>
        </div>

        {/* Top Status Bar (Inside Screen) */}
        <div className="w-full h-11 bg-editorial-bg text-editorial-text px-6 flex items-end justify-between pb-1.5 text-xs font-bold font-sans select-none z-40 shrink-0">
          {/* Time Display */}
          <span>{time}</span>
          
          {/* Status Icons */}
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-editorial-text stroke-[2.5]" />
            <span className="text-[9px] font-extrabold uppercase tracking-widest bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded border border-emerald-200">5G</span>
            <Battery className="w-4 h-4 text-editorial-text stroke-[2.5]" />
          </div>
        </div>

        {/* Interactive App Screen Container */}
        <div className="flex-1 bg-editorial-bg overflow-y-auto no-scrollbar flex flex-col relative z-30">
          {children}
        </div>

        {/* Physical Home Indicator Bar */}
        <div className="w-full h-8 bg-slate-900 flex items-center justify-center pb-2 z-40 shrink-0 select-none">
          <div className="w-32 h-1 bg-white/40 rounded-full" />
        </div>
      </div>

      {/* Under Frame Marketing Tags */}
      <div className="mt-6 flex flex-col items-center gap-1 text-center">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
          <span>Optimizada para consultas rápidas en góndolas de supermercado</span>
        </div>
        <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed mt-1">
          La app se adapta perfectamente a pantallas táctiles tácticas de iOS y Android para un uso ágil con una sola mano.
        </p>
      </div>

    </div>
  );
};

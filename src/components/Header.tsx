import React, { useState } from 'react';
import { Brain, Volume2, VolumeX, Activity, ShieldAlert, Cpu } from 'lucide-react';
import { toggleAudioMute, playBlip } from '../utils/audio';

interface HeaderProps {
  isErrorState?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isErrorState = false }) => {
  const [muted, setMuted] = useState(false);

  const handleAudioToggle = () => {
    const isNowMuted = toggleAudioMute();
    setMuted(isNowMuted);
    if (!isNowMuted) {
      playBlip(750, 'sine', 0.1);
    }
  };

  return (
    <header className="border-b border-cyan-900/60 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg border transition-colors ${
            isErrorState 
              ? 'bg-red-950/60 border-red-500/80 text-red-400 animate-pulse' 
              : 'bg-cyan-950/60 border-cyan-500/50 text-cyan-400'
          }`}>
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg md:text-xl tracking-wider text-slate-100 flex items-center gap-1.5">
                BRAIN CELL SCANNER
              </span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border uppercase tracking-widest ${
                isErrorState
                  ? 'bg-red-900/50 border-red-500 text-red-300 animate-pulse'
                  : 'bg-cyan-900/40 border-cyan-500/40 text-cyan-300'
              }`}>
                {isErrorState ? 'MALFUNCTION' : 'v4.0.9 ONLINE'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono hidden sm:block">
              NEURAL_DIAGNOSTIC_SUITE // SYSTEM VERIFIED BY ABSOLUTELY NO SCIENTISTS
            </p>
          </div>
        </div>

        {/* Telemetry and Controls */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded bg-slate-900/80 border border-slate-800 text-slate-300">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span className="text-slate-400">COGNITION:</span>
            <span className={isErrorState ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
              {isErrorState ? '0.00% CRITICAL' : 'STANDBY'}
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded bg-slate-900/80 border border-slate-800 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400">NEURAL CORE:</span>
            <span className="text-indigo-300">100% ARTIFICIAL</span>
          </div>

          <button
            onClick={handleAudioToggle}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 transition-colors text-xs font-medium cursor-pointer"
            title={muted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
          >
            {muted ? (
              <>
                <VolumeX className="w-4 h-4 text-red-400" />
                <span className="hidden sm:inline">SFX: MUTED</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="hidden sm:inline">SFX: ACTIVE</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

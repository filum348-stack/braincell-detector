import React, { useEffect, useState } from 'react';
import { AlertTriangle, ShieldAlert, ArrowRight, Activity, Terminal } from 'lucide-react';
import { playEmergencyAlarm, playSadHorn } from '../utils/audio';

interface HugeErrorScreenProps {
  onProceed: () => void;
}

export const HugeErrorScreen: React.FC<HugeErrorScreenProps> = ({ onProceed }) => {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    playEmergencyAlarm();

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          playSadHorn();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Red Hazard Background Glow and Pulse */}
      <div className="absolute inset-0 bg-red-950/40 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.25)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 scanlines opacity-50" />

      {/* Top & Bottom Hazard Warning Stripes */}
      <div className="w-full h-3 hazard-stripe mb-8 shadow-[0_0_20px_#ef4444]" />

      <div className="max-w-2xl w-full mx-auto text-center relative z-10 space-y-6">
        {/* Massive Red Triangle Shape ⚠️ */}
        <div className="relative inline-block animate-alarm-pulse">
          <div className="relative flex items-center justify-center w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 mx-auto">
            {/* Outer Triangle Glow */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full drop-shadow-[0_0_35px_rgba(239,68,68,0.9)] filter"
            >
              <polygon
                points="50,6 94,90 6,90"
                fill="#7f1d1d"
                stroke="#ef4444"
                strokeWidth="7"
                strokeLinejoin="round"
              />
              <polygon
                points="50,15 88,85 12,85"
                fill="#991b1b"
              />
            </svg>
            
            {/* Center Exclamation Icon */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-5 sm:pt-6">
              <span className="text-white text-5xl sm:text-6xl md:text-7xl font-black font-mono select-none drop-shadow-[0_0_10px_#ffffff]">
                !
              </span>
            </div>
          </div>
        </div>

        {/* Alarm Banner */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-900/80 border border-red-500 text-red-200 text-xs sm:text-sm font-mono tracking-widest uppercase animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]">
          <ShieldAlert className="w-4 h-4 text-red-400" />
          CRITICAL BIO-METRIC ANOMALY DETECTED
        </div>

        {/* Required Text from Prompt */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-display tracking-wide drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]">
            The scanner detected something unexpected.
          </h2>
          <p className="text-base sm:text-xl text-red-300 font-mono tracking-wide">
            Further analysis is required.
          </p>
        </div>

        {/* Technical readout box */}
        <div className="bg-black/90 border border-red-500/50 rounded-xl p-4 max-w-lg mx-auto text-left font-mono text-xs space-y-1.5 text-slate-300 shadow-[0_0_25px_rgba(239,68,68,0.2)]">
          <div className="flex justify-between text-red-400 font-bold border-b border-red-900/60 pb-1 mb-1">
            <span>DIAGNOSTIC FAULT: BIO_NULL_REF</span>
            <span>CODE: 0x00000000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">FRONTAL LOBE SIGNATURE:</span>
            <span className="text-red-400 font-bold">VACUUM (0.00 PSI)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">EXPECTED SYNAPSE RANGE:</span>
            <span>86,000,000,000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">ACTUAL SYNAPSES DETECTED:</span>
            <span className="text-red-400 font-bold">0 (ZERO)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">SYSTEM RECOMMENDATION:</span>
            <span className="text-amber-400">DO NOT PANIC (OR MAYBE PANIC)</span>
          </div>
        </div>

        {/* Proceed Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onProceed}
            className="px-8 py-4 bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold font-display tracking-widest text-base sm:text-lg rounded-xl shadow-[0_0_35px_rgba(239,68,68,0.7)] hover:shadow-[0_0_50px_rgba(239,68,68,0.9)] transition-all flex items-center justify-center gap-3 mx-auto cursor-pointer group"
          >
            <span>VIEW DECLASSIFIED DIAGNOSIS</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
          </button>
          
          <p className="text-[11px] font-mono text-slate-500 mt-2">
            Auto-proceeding in {countdown > 0 ? `${countdown}s` : 'ready'}...
          </p>
        </div>
      </div>

      {/* Bottom Hazard Stripe */}
      <div className="w-full h-3 hazard-stripe mt-8 shadow-[0_0_20px_#ef4444]" />
    </div>
  );
};

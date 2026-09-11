import React, { useEffect, useState, useRef } from 'react';
import { Search, Radio, Brain, AlertTriangle, Terminal, Zap } from 'lucide-react';
import { startScannerSound, stopScannerSound, playBlip, playGlitchZap, playEmergencyAlarm } from '../utils/audio';

interface ScanningViewProps {
  photoUrl: string;
  onScanHalt: () => void;
}

interface LogEntry {
  time: string;
  text: string;
  highlight?: boolean;
}

export const ScanningView: React.FC<ScanningViewProps> = ({ photoUrl, onScanHalt }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(12);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [glitching, setGlitching] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // The exact steps requested by user
  const STEPS = [
    {
      icon: Search,
      text: '🔍 Initializing Neural Scanner...',
      subtitle: 'Calibrating sub-atomic cranial spectrograph...'
    },
    {
      icon: Radio,
      text: '📡 Connecting to Brain Database...',
      subtitle: 'Querying global synapse registries and intergalactic thought records...'
    },
    {
      icon: Brain,
      text: '🧠 Searching for brain activity...',
      subtitle: 'Scanning cerebral cortex, frontal lobes, and common sense reserves...'
    }
  ];

  // Sound & animation lifecycle
  useEffect(() => {
    startScannerSound();

    const initialLogs: LogEntry[] = [
      { time: '0.00s', text: 'INIT_NEURAL_BUS: OK [FREQ: 4.8 GHz]' },
      { time: '0.45s', text: 'ACQUIRING_CRANIAL_SUBJECT_GEOMETRY...' },
      { time: '0.90s', text: 'FOREHEAD_APERTURE_EXPANDED_TO_MAXIMUM' }
    ];
    setLogs(initialLogs);

    // Step 1 -> Step 2
    const timer1 = setTimeout(() => {
      setStepIndex(1);
      setProgress(48);
      playBlip(750, 'sine', 0.12);
      setLogs((prev) => [
        ...prev,
        { time: '2.10s', text: 'PULLING_SYNAPSE_CACHE_FROM_ORBITAL_SERVER...' },
        { time: '2.80s', text: 'NEURAL_PINGS_EMITTED: 4096 PACKETS' },
        { time: '3.40s', text: 'RESPONSE: 0 ACKS RECEIVED (RADIO SILENCE)' }
      ]);
    }, 2200);

    // Step 2 -> Step 3
    const timer2 = setTimeout(() => {
      setStepIndex(2);
      setProgress(84);
      playBlip(880, 'sine', 0.12);
      setLogs((prev) => [
        ...prev,
        { time: '4.20s', text: 'SEARCHING_FRONTAL_LOBE: BUFFER EMPTY (0 bytes)' },
        { time: '4.90s', text: 'SEARCHING_TEMPORAL_LOBE: ONLY MEMES & REELS FOUND' },
        { time: '5.40s', text: 'CRITICAL: COGNITIVE SENSORS DETECTING VACUUM!' }
      ]);
    }, 4200);

    // Sudden halt & glitch!
    const timerHalt = setTimeout(() => {
      setProgress(99);
      setGlitching(true);
      stopScannerSound();
      playGlitchZap();
      playEmergencyAlarm();

      setLogs((prev) => [
        ...prev,
        { time: '5.95s', text: 'FATAL_EXCEPTION_0x00000000_ZERO_BRAINCELLS', highlight: true },
        { time: '6.00s', text: 'EMERGENCY_INTERRUPT: SENSORS BLOWN OUT!', highlight: true }
      ]);

      // Trigger transition to STEP 2 (HUGE ERROR)
      const transitionTimer = setTimeout(() => {
        onScanHalt();
      }, 1400);

      return () => clearTimeout(transitionTimer);
    }, 6100);

    return () => {
      stopScannerSound();
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timerHalt);
    };
  }, [onScanHalt]);

  // Animated EEG Brainwave Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let offset = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = glitching ? '#ef4444' : '#06b6d4';
      ctx.lineWidth = 2;
      ctx.beginPath();

      const height = canvas.height;
      const width = canvas.width;
      const mid = height / 2;

      for (let x = 0; x < width; x++) {
        // As time progresses into step 3, line goes almost completely flat (flatlining braincells!)
        const flatlineFactor = stepIndex >= 2 ? 0.15 : 1.0;
        let y = mid + Math.sin((x + offset) * 0.05) * 14 * flatlineFactor;
        
        // Random glitch spike
        if (Math.random() > 0.96 && !glitching) {
          y += (Math.random() - 0.5) * 30 * flatlineFactor;
        }
        if (glitching) {
          y += (Math.random() - 0.5) * 45;
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      offset += glitching ? 8 : 3;
      animFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animFrameId);
  }, [stepIndex, glitching]);

  return (
    <div className={`max-w-5xl mx-auto w-full px-4 py-8 transition-all ${glitching ? 'animate-glitch' : ''}`}>
      {/* Top Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-cyan-400 font-bold">SCAN IN PROGRESS</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">FRAME_RATE: 60.0 FPS</span>
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          <span>ALGORITHM: QUANTUM_CRANIAL_ROASTER</span>
          <span className={`px-2 py-0.5 rounded font-bold ${glitching ? 'bg-red-950 text-red-400' : 'bg-cyan-950 text-cyan-300'}`}>
            {glitching ? 'SYS_HALT_EXCEPTION' : `ANALYZING (${progress}%)`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Scanned Photo with Sci-Fi HUD Overlay */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden border-2 border-cyan-500/50 bg-black shadow-[0_0_40px_rgba(6,182,212,0.25)]">
            {/* User photo */}
            <img
              src={photoUrl}
              alt="Scan Subject"
              className="w-full h-full object-cover filter contrast-110 brightness-90"
            />

            {/* Blue Tint Cyber Screen Filter */}
            <div className="absolute inset-0 bg-cyan-950/20 mix-blend-color pointer-events-none" />
            <div className="absolute inset-0 scanlines" />

            {/* Laser Line Sweeping */}
            {!glitching && (
              <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-laser-sweep z-10" />
            )}

            {/* Glitch red flash when halted */}
            {glitching && (
              <div className="absolute inset-0 bg-red-600/40 animate-pulse z-20 flex items-center justify-center">
                <div className="bg-black/80 border border-red-500 text-red-400 p-4 rounded-xl text-center font-mono text-sm shadow-[0_0_30px_#ef4444]">
                  <AlertTriangle className="w-8 h-8 mx-auto text-red-500 animate-bounce mb-2" />
                  <p className="font-bold">CRITICAL SIGNAL COLLAPSE</p>
                  <p className="text-xs text-red-300">NEURAL VOID DETECTED</p>
                </div>
              </div>
            )}

            {/* Futuristic HUD Overlays */}
            <div className="absolute top-3 left-3 font-mono text-[10px] text-cyan-400 bg-black/60 px-2 py-0.5 rounded border border-cyan-500/30">
              TARGET: SUBJECT_01
            </div>
            <div className="absolute top-3 right-3 font-mono text-[10px] text-cyan-400 bg-black/60 px-2 py-0.5 rounded border border-cyan-500/30">
              COGNITIVE_INDEX: --
            </div>

            {/* Forehead Biometric Bounding Box */}
            <div className="absolute top-[18%] left-[24%] right-[24%] h-[28%] border-2 border-dashed border-cyan-400/70 rounded-lg flex flex-col justify-between p-1 pointer-events-none">
              <div className="flex justify-between text-[9px] font-mono text-cyan-300">
                <span>[CRANIAL_ZONE]</span>
                <span>SEARCHING...</span>
              </div>
              <div className="flex justify-between text-[9px] font-mono text-cyan-300">
                <span>RADAR: COLD</span>
                <span>VOL: 0 cm³</span>
              </div>
            </div>

            {/* Circular crosshair centered */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-44 h-44 rounded-full border border-cyan-500/30 border-t-cyan-400 border-b-cyan-400 animate-spin flex items-center justify-center">
                <div className="w-24 h-24 rounded-full border border-cyan-500/20" />
              </div>
            </div>
          </div>

          {/* Brainwave EEG Display */}
          <div className="w-full max-w-md mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mb-1">
              <span>EEG NEURO-FREQUENCY WAVEFORM</span>
              <span className={stepIndex >= 2 ? 'text-red-400 font-bold' : 'text-cyan-400'}>
                {stepIndex >= 2 ? 'WARNING: FLATLINING' : '0.02 Hz (SLUGGISH)'}
              </span>
            </div>
            <canvas
              ref={canvasRef}
              width={400}
              height={48}
              className="w-full h-12 bg-black/70 rounded border border-slate-800"
            />
          </div>
        </div>

        {/* Right: Step Sequence and Terminal Logs */}
        <div className="lg:col-span-6 flex flex-col space-y-6">
          {/* Main Step Cards (Direct translation of prompt instructions) */}
          <div className="space-y-3">
            {STEPS.map((step, idx) => {
              const isActive = stepIndex === idx && !glitching;
              const isCompleted = stepIndex > idx;
              const isPending = stepIndex < idx;

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    isActive
                      ? 'bg-cyan-950/70 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.3)] scale-[1.02]'
                      : isCompleted
                      ? 'bg-slate-900/60 border-emerald-500/40 text-slate-300'
                      : 'bg-slate-950/40 border-slate-800 text-slate-600 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold ${
                        isActive
                          ? 'bg-cyan-500 text-black animate-pulse'
                          : isCompleted
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-900 text-slate-600'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    <div className="flex-1">
                      <div className="text-base sm:text-lg font-bold font-display tracking-wide text-slate-100 flex items-center gap-2">
                        {step.text}
                      </div>
                      <p className="text-xs font-mono text-slate-400 mt-0.5">
                        {step.subtitle}
                      </p>
                    </div>

                    {isActive && (
                      <span className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 font-mono">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">SCAN PROGRESSION</span>
              <span className="text-cyan-400 font-bold">{progress}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  glitching
                    ? 'bg-red-500 shadow-[0_0_15px_#ef4444]'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_12px_#22d3ee]'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Simulated Terminal Telemetry */}
          <div className="rounded-xl bg-black/90 border border-slate-800 p-4 font-mono text-xs text-slate-300 shadow-inner">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                NEURAL_DIAGNOSTIC_LOG.TXT
              </span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Zap className="w-3 h-3 animate-pulse" /> LIVE STREAM
              </span>
            </div>

            <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
              {logs.map((log, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 ${
                    log.highlight ? 'text-red-400 font-bold bg-red-950/40 px-1 rounded' : 'text-slate-400'
                  }`}
                >
                  <span className="text-slate-600 select-none">[{log.time}]</span>
                  <span>{log.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

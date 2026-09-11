import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Brain, 
  AlertTriangle, 
  Share2, 
  Check, 
  Sparkles, 
  Flame, 
  Layers, 
  Compass, 
  RotateCcw,
  Dice5,
  Activity,
  Scan,
  RefreshCw,
  Zap
} from 'lucide-react';
import { ForeheadRoast, BrainCategory, RandomBrainRoastItem } from '../types';
import { RANDOM_BRAIN_ROASTS, FOREHEAD_ROASTS_POOL, BRAIN_CATEGORIES_POOL } from '../data/roasts';
import { playSadHorn, playGlitchZap, playSuccessDing, playBlip } from '../utils/audio';

interface ResultsViewProps {
  photoUrl: string;
  onResetToUpload: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ photoUrl, onResetToUpload }) => {
  // Randomly select ONE of the 6 results on initial mount
  const [selectedRoastIndex, setSelectedRoastIndex] = useState<number>(() => 
    Math.floor(Math.random() * RANDOM_BRAIN_ROASTS.length)
  );
  
  const [foreheadRoastIndex, setForeheadRoastIndex] = useState<number>(() => 
    Math.floor(Math.random() * FOREHEAD_ROASTS_POOL.length)
  );

  const [categoryIndex, setCategoryIndex] = useState<number>(() => 
    Math.floor(Math.random() * BRAIN_CATEGORIES_POOL.length)
  );

  const [randomId, setRandomId] = useState<string>(() => 
    `CRAN-${Math.floor(1000 + Math.random() * 9000)}-FAIL`
  );

  const [isGlitching, setIsGlitching] = useState(false);
  const [copied, setCopied] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const activeRoast: RandomBrainRoastItem = RANDOM_BRAIN_ROASTS[selectedRoastIndex];
  const activeForehead: ForeheadRoast = FOREHEAD_ROASTS_POOL[foreheadRoastIndex];
  const activeCategory: BrainCategory = BRAIN_CATEGORIES_POOL[categoryIndex];

  // Sound on first mount
  useEffect(() => {
    playSadHorn();
  }, []);

  // Big Button: "🔥Try again ! Fail again!"
  // "Every time the button is clicked, generate a different random brain category."
  const handleTryAgainFailAgain = () => {
    setIsGlitching(true);
    playGlitchZap();
    playSadHorn();

    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#ef4444', '#f59e0b', '#06b6d4', '#ec4899', '#8b5cf6', '#10b981']
      });
    } catch {
      // Ignore
    }

    // Always generate a DIFFERENT random brain category
    let nextCatIdx = Math.floor(Math.random() * BRAIN_CATEGORIES_POOL.length);
    if (nextCatIdx === categoryIndex) {
      nextCatIdx = (categoryIndex + 1) % BRAIN_CATEGORIES_POOL.length;
    }

    // Pick a different random brain roast from the 6 options
    let nextRoastIdx = Math.floor(Math.random() * RANDOM_BRAIN_ROASTS.length);
    if (nextRoastIdx === selectedRoastIndex) {
      nextRoastIdx = (selectedRoastIndex + 1) % RANDOM_BRAIN_ROASTS.length;
    }

    // Pick a different forehead roast
    let nextForeheadIdx = Math.floor(Math.random() * FOREHEAD_ROASTS_POOL.length);
    if (nextForeheadIdx === foreheadRoastIndex) {
      nextForeheadIdx = (foreheadRoastIndex + 1) % FOREHEAD_ROASTS_POOL.length;
    }

    setTimeout(() => {
      setCategoryIndex(nextCatIdx);
      setSelectedRoastIndex(nextRoastIdx);
      setForeheadRoastIndex(nextForeheadIdx);
      setRandomId(`CRAN-${Math.floor(1000 + Math.random() * 9000)}-FAIL`);
      setRetryCount((prev) => prev + 1);
      setIsGlitching(false);
    }, 280);
  };

  const handleSelectRoastManually = (index: number) => {
    playBlip(720, 'sine', 0.1);
    setSelectedRoastIndex(index);
  };

  const copyDiagnosis = () => {
    let roastDetails = `${activeRoast.title}\n`;
    if (activeRoast.metricLabel) {
      roastDetails += `${activeRoast.metricLabel} ${activeRoast.metricValue}\n`;
    }
    if (activeRoast.highlightText) {
      roastDetails += `${activeRoast.highlightText}\n`;
    }
    roastDetails += `${activeRoast.quote}\n`;
    if (activeRoast.warningAlert) {
      roastDetails += `\n${activeRoast.warningAlert.title}\n${activeRoast.warningAlert.description}\n${activeRoast.warningAlert.subtext}\n`;
    }

    const textToCopy = `🧠 BRAIN CELL SCANNER DIAGNOSIS REPORT 💀\n\n` +
      `🔍 FOREHEAD ROAST:\n${activeForehead.title}\n${activeForehead.roastText}\n\n` +
      `STEP 4 — RANDOM BRAIN ROAST:\n${roastDetails}\n` +
      `🧠 BRAIN CATEGORY:\n${activeCategory.name} (${activeCategory.tag})\n${activeCategory.description}\n\n` +
      `Tested on Brain Cell Scanner: Absolutely 0% scientific accuracy! 😭`;

    navigator.clipboard.writeText(textToCopy);
    playSuccessDing();
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-8 md:py-12 space-y-8">
      {/* Top Bio-Certificate Header */}
      <div className="rounded-2xl bg-slate-900/90 border-2 border-red-500/50 p-5 sm:p-6 shadow-[0_0_50px_rgba(239,68,68,0.2)] backdrop-blur-md relative overflow-hidden">
        {/* Corner Accents */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-red-400" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-red-400" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-red-400" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-red-400" />

        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Scanned Subject with Fake Stamp */}
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-xl overflow-hidden border-2 border-red-500/70 shadow-lg shrink-0">
            <img
              src={photoUrl}
              alt="Tested Subject"
              className="w-full h-full object-cover filter contrast-110"
            />
            <div className="absolute inset-0 bg-red-900/20 mix-blend-color" />
            <div className="absolute bottom-0 inset-x-0 bg-black/85 text-center py-0.5 font-mono text-[10px] text-red-400 font-bold border-t border-red-500/50">
              FAILED INSPECTION
            </div>
            {/* Rubber Stamp */}
            <div className="absolute top-2 right-2 rotate-12 border-2 border-red-500 text-red-400 font-display font-black text-[10px] px-1 py-0.5 rounded uppercase tracking-wider bg-black/80 shadow-md">
              FAIL
            </div>
          </div>

          {/* Report Title & Metadata */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950 border border-red-500/40 text-red-400 text-xs font-mono">
              <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
              OFFICIAL BIO-DEBACLE REPORT // REF #{randomId}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              NEURAL DEFICIENCY DIAGNOSIS
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 font-mono">
              Quantum Cranial Analysis complete. The algorithm has concluded that attempting to detect thoughts was an act of extreme optimism.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
              <button
                type="button"
                id="share-roast-btn"
                onClick={copyDiagnosis}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                {copied ? 'COPIED TO CLIPBOARD!' : 'SHARE ROAST'}
              </button>

              <button
                type="button"
                id="scan-another-btn"
                onClick={onResetToUpload}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                SCAN ANOTHER VICTIM
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. THE FOREHEAD ROAST (Shows first, leading into STEP 4) */}
      {/* ========================================================================= */}
      <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-black border-2 border-amber-500/40 p-6 md:p-8 shadow-[0_0_35px_rgba(245,158,11,0.15)] relative">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400 animate-spin" />
            <h2 className="font-display font-black text-xl sm:text-2xl text-white tracking-wide">
              FOREHEAD ROAST & CRANIAL RADAR
            </h2>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800">
            AERODYNAMIC TELEMETRY
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-xs text-amber-400 uppercase tracking-wider font-bold flex items-center gap-2">
              <Scan className="w-4 h-4 text-amber-400" />
              SURFACE DESIGNATION: {activeForehead.title}
            </span>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              ORBITAL SATELLITE LOCK
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono text-slate-300 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-start gap-2">
              <span className="text-amber-400">📐</span>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Forehead Dimensions</div>
                <div>{activeForehead.dimension}</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-400">🌡️</span>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Thermal Infrared Profile</div>
                <div>{activeForehead.thermalRoast}</div>
              </div>
            </div>
          </div>

          {/* Forehead Roast Malayalam Punchline */}
          <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-amber-950/40 via-black to-amber-950/40 border border-amber-500/40 shadow-inner text-center sm:text-left">
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-amber-200 font-sans italic leading-relaxed">
              {activeForehead.roastText}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. STEP 4 — RANDOM BRAIN ROAST (Directly follows forehead roast) */}
      {/* "After the forehead roast, randomly select ONE of these results:" */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <h2 className="font-display font-black text-xl sm:text-2xl md:text-3xl text-white tracking-wide flex items-center gap-2">
                <span>STEP 4 — RANDOM BRAIN ROAST</span>
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              After the forehead roast, randomly select ONE of these results:
            </p>
          </div>

          <span className="text-xs font-mono px-2.5 py-1 rounded bg-red-950 text-red-300 border border-red-800">
            RESULT {selectedRoastIndex + 1} OF 6 RANDOMLY SELECTED
          </span>
        </div>

        {/* The Selected Roast Spotlight Card */}
        <div className={`rounded-2xl bg-gradient-to-b from-slate-900 via-slate-950 to-black border-2 border-red-500/70 p-6 sm:p-8 shadow-[0_0_50px_rgba(239,68,68,0.25)] relative overflow-hidden transition-all ${isGlitching ? 'animate-glitch opacity-80' : ''}`}>
          
          {/* Cyber Hazard Corner Markers */}
          <div className="absolute top-0 right-0 w-28 h-28 bg-red-500/10 rounded-bl-full pointer-events-none" />
          <div className="absolute top-4 right-4 text-4xl sm:text-5xl opacity-80 select-none animate-pulse">
            {activeRoast.icon}
          </div>

          {/* Badge & Title */}
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-[11px] font-mono px-2.5 py-1 rounded border uppercase tracking-wider font-bold ${activeRoast.badgeColor}`}>
              {activeRoast.badge}
            </span>
            <span className="text-xs font-mono text-slate-500">
              FAULT_ID: #{activeRoast.id.toUpperCase()}
            </span>
          </div>

          {/* Title exact to prompt */}
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black font-display text-white mb-4 tracking-tight flex items-center gap-2">
            <span>{activeRoast.title}</span>
          </h3>

          {/* Metric / Braincells Count (e.g. Braincells detected: 0 or 999999) */}
          {activeRoast.metricLabel && (
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 my-4 flex items-baseline gap-3">
              <span className="font-mono text-sm sm:text-base text-slate-300">
                {activeRoast.metricLabel}
              </span>
              <span className="font-mono text-3xl sm:text-4xl font-black text-red-500 tracking-wider">
                {activeRoast.metricValue}
              </span>
            </div>
          )}

          {/* Highlight Text (e.g. "HUMAN VERIFICATION FAILED.", "You don't just have zero braincells.", "ERROR 404 COMMON SENSE NOT FOUND", etc.) */}
          {activeRoast.highlightText && (
            <div className="py-3 px-4 rounded-xl bg-red-950/50 border border-red-500/40 my-3">
              <p className="font-mono font-black text-lg sm:text-xl text-red-400 tracking-wide whitespace-pre-line">
                {activeRoast.highlightText}
              </p>
            </div>
          )}

          {/* The Malayalam Quote / Punchline */}
          <div className="my-5 p-4 sm:p-6 rounded-xl bg-black/60 border border-amber-500/30 shadow-inner">
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-300 font-sans tracking-wide leading-relaxed italic drop-shadow-[0_0_12px_rgba(245,158,11,0.3)]">
              {activeRoast.quote}
            </p>
          </div>

          {/* Special Sub-alert for result 4: TOO MANY BRAIN CELLS */}
          {activeRoast.warningAlert && (
            <div className="my-4 p-4 rounded-xl bg-red-950/80 border-2 border-red-500 text-center space-y-2 animate-pulse shadow-[0_0_25px_rgba(239,68,68,0.4)]">
              <div className="text-xl sm:text-2xl font-black font-display text-white tracking-widest">
                {activeRoast.warningAlert.title}
              </div>
              <div className="text-base sm:text-lg font-mono text-red-200 font-bold">
                {activeRoast.warningAlert.description}
              </div>
              <div className="text-sm sm:text-base font-sans text-amber-300 italic">
                {activeRoast.warningAlert.subtext}
              </div>
            </div>
          )}

          {/* Sub-description note */}
          {activeRoast.subDescription && (
            <p className="text-xs font-mono text-slate-500 mt-4 border-t border-slate-900 pt-3">
              Diagnosis notes: {activeRoast.subDescription}
            </p>
          )}
        </div>

        {/* Quick Tabs to preview any of the 6 Results */}
        <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
              <Dice5 className="w-3.5 h-3.5 text-cyan-400" />
              QUICK FAULT CODE PREVIEW (ALL 6 DIAGNOSES):
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Click any code to inspect
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {RANDOM_BRAIN_ROASTS.map((roast, idx) => {
              const isCurrent = selectedRoastIndex === idx;
              return (
                <button
                  key={roast.id}
                  type="button"
                  onClick={() => handleSelectRoastManually(idx)}
                  className={`p-2 rounded-lg text-left transition-all border text-xs font-mono truncate cursor-pointer ${
                    isCurrent
                      ? 'bg-red-950/80 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                  title={roast.title}
                >
                  <div className="flex items-center gap-1 truncate">
                    <span>{roast.icon}</span>
                    <span className="truncate">{roast.title.replace(/^[^\w\s]*\s*/, '')}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. BRAIN CATEGORY (Dynamic Classification) */}
      {/* "Every time the button is clicked, generate a different random brain category." */}
      {/* ========================================================================= */}
      <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-black border-2 border-cyan-500/40 p-6 md:p-8 shadow-[0_0_40px_rgba(6,182,212,0.15)] relative">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h2 className="font-display font-bold text-xl md:text-2xl text-white">
              ASSIGNED BRAIN CATEGORY
            </h2>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
            CATEGORY {categoryIndex + 1} OF {BRAIN_CATEGORIES_POOL.length}
          </span>
        </div>

        <div className="rounded-xl bg-slate-950/90 border border-cyan-500/30 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
              <Zap className="w-4 h-4 text-cyan-400" />
              CLASSIFICATION: {activeCategory.tag}
            </span>
            <span className="text-3xl select-none">{activeCategory.icon}</span>
          </div>

          <h3 className="font-display font-black text-xl sm:text-2xl text-cyan-300">
            {activeCategory.name}
          </h3>

          <p className="text-base text-slate-200 leading-relaxed">
            {activeCategory.description}
          </p>

          <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>⚡ Power Consumption: <strong className="text-cyan-400 font-bold">{activeCategory.powerConsumption}</strong></span>
            <span className="text-[10px] text-slate-500">REAL-TIME TELEMETRY</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. THE BIG BUTTON: 🔥Try again ! Fail again! */}
        {/* "Every time the button is clicked, generate a different random brain category." */}
        {/* ========================================================================= */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <button
            type="button"
            id="try-again-fail-again-btn"
            onClick={handleTryAgainFailAgain}
            className="w-full max-w-xl mx-auto py-5 px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:via-orange-400 hover:to-red-500 text-slate-950 font-black font-display text-xl sm:text-2xl md:text-3xl tracking-wider shadow-[0_0_40px_rgba(249,115,22,0.6)] hover:shadow-[0_0_60px_rgba(249,115,22,0.9)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            <Flame className="w-8 h-8 text-slate-950 animate-bounce group-hover:scale-125 transition-transform" />
            <span>🔥Try again ! Fail again!</span>
            <Flame className="w-8 h-8 text-slate-950 animate-bounce group-hover:scale-125 transition-transform" />
          </button>

          <p className="text-xs font-mono text-slate-400 mt-3">
            Click to generate a different random brain category, forehead telemetry & random brain roast! (Total Fails: {retryCount})
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. AT THE VERY BOTTOM: Exact text requested by prompt */}
      {/* ========================================================================= */}
      <footer className="mt-12 pt-8 border-t border-slate-800 text-center space-y-4">
        <div className="max-w-2xl mx-auto p-6 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-lg">
          <p className="text-base sm:text-lg font-bold text-amber-400 font-sans mb-2">
            Congratulations! 🎉 You just wasted several seconds of your life scanning a completely fake brain scanner.
          </p>
          <p className="text-sm sm:text-base font-bold text-slate-300 font-mono flex items-center justify-center gap-2">
            Thank you for contributing absolutely nothing to science. 🧠💀
          </p>
        </div>

        <div className="text-[11px] font-mono text-slate-600">
          BRAIN CELL SCANNER © 2026 // ZERO NEURONS PERSISTED // ABSOLUTE SCI-FI COMEDY
        </div>
      </footer>
    </div>
  );
};

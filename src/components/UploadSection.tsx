import React, { useState, useRef } from 'react';
import { Upload, Camera, Sparkles, AlertCircle, Scan, CheckCircle2, User, RefreshCw } from 'lucide-react';
import { SAMPLE_SUBJECTS } from '../data/roasts';
import { playBlip } from '../utils/audio';

interface UploadSectionProps {
  onPhotoSelected: (photoUrl: string) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onPhotoSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }
    playBlip(640, 'sine', 0.1);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onPhotoSelected(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSampleClick = (url: string) => {
    playBlip(550, 'sine', 0.1);
    onPhotoSelected(url);
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
      playBlip(700, 'sine', 0.15);
    } catch (err) {
      setCameraError('Camera access denied or unavailable. Please upload a photo instead.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      stopCamera();
      playBlip(880, 'sine', 0.2);
      onPhotoSelected(dataUrl);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-8 md:py-12">
      {/* Top Banner / System Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-4 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <Scan className="w-3.5 h-3.5 animate-pulse" />
          QUANTUM NEURO-CRANIAL SPECTROMETRY v9.8
        </div>
        
        {/* Exact required heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3 flex items-center justify-center gap-3 font-display">
          <span>UPLOAD YOUR PHOTO</span>
          <span className="text-4xl sm:text-5xl animate-bounce">🧠</span>
        </h1>
        
        <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base font-mono">
          Feed a subject into the high-precision AI cranial scanner to count individual braincells and detect cognitive abnormalities.
        </p>
      </div>

      {/* Main Scanner Container with Sci-Fi HUD Borders */}
      <div className="relative rounded-2xl bg-slate-900/60 border border-cyan-500/30 p-6 md:p-10 shadow-[0_0_50px_rgba(6,182,212,0.1)] backdrop-blur-md">
        {/* Corner HUD markers */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

        {/* Camera Modal / Live View */}
        {cameraActive ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative w-full max-w-md aspect-4/3 rounded-xl overflow-hidden border-2 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)] bg-black">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
              
              {/* Overlay Crosshairs */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-56 border-2 border-dashed border-cyan-400/80 rounded-full animate-pulse flex items-center justify-center">
                  <span className="text-[10px] font-mono text-cyan-300 bg-black/60 px-2 py-0.5 rounded">ALIGN FOREHEAD</span>
                </div>
              </div>

              {/* Laser Line */}
              <div className="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_12px_#22d3ee] animate-laser-sweep" />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={capturePhoto}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold font-display tracking-wider rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                CAPTURE FOREHEAD
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs rounded-lg cursor-pointer"
              >
                CANCEL
              </button>
            </div>
          </div>
        ) : (
          /* Dropzone */
          <div>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 relative group ${
                isDragging
                  ? 'border-cyan-400 bg-cyan-950/40 shadow-[0_0_30px_rgba(6,182,212,0.3)]'
                  : 'border-slate-700 hover:border-cyan-500/60 bg-slate-950/60 hover:bg-slate-900/80'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />

              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-20 h-20 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-105 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">
                  <Upload className="w-9 h-9 animate-pulse" />
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-display text-white mb-1 group-hover:text-cyan-300 transition-colors">
                    CLICK TO BROWSE OR DRAG & DROP PHOTO
                  </h3>
                  <p className="text-xs text-slate-400 font-mono max-w-sm mx-auto">
                    Full face or forehead portrait recommended for optimal neural detection.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <span className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-[11px] font-mono text-slate-300">
                    JPG, PNG, WEBP
                  </span>
                  <span className="px-2.5 py-1 rounded bg-cyan-950/60 border border-cyan-800/60 text-[11px] font-mono text-cyan-400">
                    BIO-METRIC RESOLUTION: AUTO
                  </span>
                  <span className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> 100% CONFIDENTIAL ROAST
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Live Camera Trigger */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  startCamera();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-cyan-950/60 border border-slate-700 hover:border-cyan-500/50 text-cyan-300 transition-colors cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                USE LIVE WEBCAM SCANNER
              </button>

              <span className="text-slate-500">
                CRANIAL ALIGNMENT PROTOCOL ACTIVE
              </span>
            </div>

            {cameraError && (
              <p className="mt-2 text-xs text-red-400 font-mono flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {cameraError}
              </p>
            )}
          </div>
        )}

        {/* Quick Test Samples for Instant Fun */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              OR CHOOSE A PRESET TEST SUBJECT:
            </span>
            <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
              Instant 1-Click Verification
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SAMPLE_SUBJECTS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSampleClick(sample.url)}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/60 hover:bg-cyan-950/30 text-left transition-all group cursor-pointer"
              >
                <img
                  src={sample.url}
                  alt={sample.name}
                  className="w-12 h-12 rounded-lg object-cover border border-slate-700 group-hover:border-cyan-400"
                />
                <div className="overflow-hidden">
                  <div className="text-xs font-bold font-display text-slate-200 group-hover:text-cyan-300 truncate">
                    {sample.name}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate">
                    {sample.label}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Futuristic Medical System Disclaimer */}
      <div className="mt-6 text-center text-xs font-mono text-slate-500 flex items-center justify-center gap-2">
        <AlertCircle className="w-3.5 h-3.5 text-amber-500/70" />
        <span>CERTIFIED FAKE SYSTEM: No actual neurons will be measured or harmed during this process.</span>
      </div>
    </div>
  );
};

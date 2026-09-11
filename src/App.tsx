/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  RESULTS, 
  FOREHEAD_ROASTS, 
  BRAIN_CATEGORIES, 
  SAMPLE_FACES,
  BrainScanResult,
  ForeheadRoast,
  BrainCategory 
} from './data/roasts';
import { 
  playBlip, 
  startScannerSound, 
  stopScannerSound, 
  playEmergencyAlarm, 
  playSadHorn, 
  playGlitchZap, 
  playSuccessDing,
  toggleAudioMute,
  getAudioMuted
} from './utils/audio';

export default function App() {
  const [step, setStep] = useState<'upload' | 'scan' | 'error' | 'result'>('upload');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [scanLines, setScanLines] = useState<string[]>([]);
  const [scanProgress, setScanProgress] = useState<number>(0);
  
  // Audio mute state
  const [isMuted, setIsMuted] = useState<boolean>(getAudioMuted());

  // Result indices
  const [selectedResultIndex, setSelectedResultIndex] = useState<number>(0);
  const [foreheadIndex, setForeheadIndex] = useState<number>(0);
  const [categoryIndex, setCategoryIndex] = useState<number>(0);
  
  // Camera active state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Copied state
  const [copied, setCopied] = useState<boolean>(false);

  // Pick initial random results on mount
  useEffect(() => {
    setSelectedResultIndex(Math.floor(Math.random() * RESULTS.length));
    setForeheadIndex(Math.floor(Math.random() * FOREHEAD_ROASTS.length));
    setCategoryIndex(Math.floor(Math.random() * BRAIN_CATEGORIES.length));
  }, []);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      stopScannerSound();
    };
  }, []);

  const handleToggleMute = () => {
    const nextMute = toggleAudioMute();
    setIsMuted(nextMute);
  };

  // Start scanning process
  const triggerScan = (imageUrl: string) => {
    setPhotoUrl(imageUrl);
    setStep('scan');
    setScanLines([]);
    setScanProgress(0);

    startScannerSound();

    const messages = [
      "🔍 Initializing Neural Scanner...",
      "📡 Connecting to Brain Database...",
      "🧠 Searching for brain activity..."
    ];

    // Animate lines sequentially
    messages.forEach((msg, idx) => {
      setTimeout(() => {
        setScanLines((prev) => [...prev, msg]);
        setScanProgress(((idx + 1) / messages.length) * 100);
        playBlip(540 + idx * 120, 'sine', 0.1);
      }, idx * 900);
    });

    // Sudden halt after 3rd message
    setTimeout(() => {
      stopScannerSound();
      playGlitchZap();
      playEmergencyAlarm();
      setStep('error');
    }, messages.length * 900 + 700);
  };

  // File selection
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    triggerScan(url);
  };

  // Drag and Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      triggerScan(url);
    }
  };

  // Camera start
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 640 } }
      });
      streamRef.current = stream;
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch {
      // Fallback
      alert('Camera access denied or unavailable. Please upload a photo or use a sample image.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 400;
    canvas.height = videoRef.current.videoHeight || 400;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const url = canvas.toDataURL('image/jpeg');
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setIsCameraActive(false);
      triggerScan(url);
    }
  };

  const cancelCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Continue from Error to Result
  const handleContinueAnalysis = () => {
    playSadHorn();
    setStep('result');
  };

  // "🔥Try again ! Fail again!"
  // Prompt requirement: "Every time the button is clicked, generate a different random brain category."
  const handleTryAgainFailAgain = () => {
    playGlitchZap();
    playSadHorn();

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#ff2e3d', '#ffb02e', '#39ff6a', '#4ce0ff']
      });
    } catch {
      // Ignore
    }

    // Generate a DIFFERENT random brain category
    let nextCategory = Math.floor(Math.random() * BRAIN_CATEGORIES.length);
    if (nextCategory === categoryIndex) {
      nextCategory = (categoryIndex + 1) % BRAIN_CATEGORIES.length;
    }
    setCategoryIndex(nextCategory);

    // Pick a different random brain roast from the 6 results
    let nextResult = Math.floor(Math.random() * RESULTS.length);
    if (nextResult === selectedResultIndex) {
      nextResult = (selectedResultIndex + 1) % RESULTS.length;
    }
    setSelectedResultIndex(nextResult);

    // Pick a different forehead roast
    let nextForehead = Math.floor(Math.random() * FOREHEAD_ROASTS.length);
    if (nextForehead === foreheadIndex) {
      nextForehead = (foreheadIndex + 1) % FOREHEAD_ROASTS.length;
    }
    setForeheadIndex(nextForehead);
  };

  // Reset to Upload
  const handleScanAnother = () => {
    setPhotoUrl('');
    setStep('upload');
  };

  // Copy diagnosis to clipboard
  const handleCopyReport = () => {
    const curResult = RESULTS[selectedResultIndex];
    const curForehead = FOREHEAD_ROASTS[foreheadIndex];
    const curCat = BRAIN_CATEGORIES[categoryIndex];

    const text = `🧠 BRAIN CELL SCANNER™ DIAGNOSIS REPORT 💀\n\n` +
      `FOREHEAD ROAST: ${curForehead.title}\n${curForehead.roastText}\n\n` +
      `STEP 4 — RANDOM BRAIN ROAST: ${curResult.label}\n` +
      `Braincells detected: ${curResult.count}\n\n` +
      `BRAIN CATEGORY: ${curCat.name}\n${curCat.description}\n\n` +
      `Scientific Accuracy: Absolutely 0.00% 😭`;

    navigator.clipboard.writeText(text);
    playSuccessDing();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentResult: BrainScanResult = RESULTS[selectedResultIndex] || RESULTS[0];
  const currentForehead: ForeheadRoast = FOREHEAD_ROASTS[foreheadIndex] || FOREHEAD_ROASTS[0];
  const currentCategory: BrainCategory = BRAIN_CATEGORIES[categoryIndex] || BRAIN_CATEGORIES[0];

  return (
    <div className="device">
      {/* Chrome Top Header */}
      <div className="chrome-top">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span><span className="dot">●</span> SYSTEM ONLINE</span>
          <button 
            type="button"
            onClick={handleToggleMute}
            style={{
              background: 'transparent',
              border: '1px solid var(--panel-edge)',
              color: isMuted ? 'var(--warn-red)' : 'var(--scan-green)',
              fontSize: '9px',
              fontFamily: 'var(--mono)',
              padding: '1px 6px',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            {isMuted ? '🔇 AUDIO OFF' : '🔊 AUDIO ON'}
          </button>
        </div>
        <span>NEUROSCAN OS v4.0.1</span>
      </div>

      {/* Brand Title */}
      <div className="brand">
        <h1>🧠 BRAIN CELL SCANNER</h1>
        <div className="sub">CLINICAL-GRADE COGNITIVE IMAGING</div>
        <div className="model">MODEL NS-2200 · NOT FDA APPROVED · NOT REAL</div>
      </div>

      {/* Main Panel Shell */}
      <div className="panel">
        <div className="corner tl"></div>
        <div className="corner tr"></div>
        <div className="corner bl"></div>
        <div className="corner br"></div>

        {/* STEP 1: UPLOAD */}
        {step === 'upload' && (
          <div className="step active" id="step-upload">
            <div className="upload-label">UPLOAD YOUR PHOTO 🧠</div>
            
            {!isCameraActive ? (
              <>
                <label 
                  className="drop" 
                  id="dropZone"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  <span className="icon">📷</span>
                  <span className="txt">
                    TAP TO SELECT IMAGE<br />
                    FOR NEURAL ANALYSIS
                  </span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    id="fileInput" 
                    onChange={handleFileInputChange} 
                  />
                </label>

                {/* Instant Camera Option */}
                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                  <button
                    type="button"
                    onClick={startCamera}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--scan-cyan)',
                      color: 'var(--scan-cyan)',
                      padding: '6px 14px',
                      fontFamily: 'var(--mono)',
                      fontSize: '11px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    📹 OR USE LIVE WEBCAM
                  </button>
                </div>

                {/* Sample Face Quick Picker for fast testing */}
                <div style={{ marginTop: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '10px', color: 'var(--ghost)', letterSpacing: '0.08em', marginBottom: '8px' }}>
                    QUICK TEST PRESETS:
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    {SAMPLE_FACES.map((face, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => triggerScan(face.url)}
                        style={{
                          background: 'rgba(76,224,255,0.06)',
                          border: '1px solid var(--panel-edge)',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          color: 'var(--ghost)',
                          fontFamily: 'var(--mono)',
                          fontSize: '10px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <img 
                          src={face.url} 
                          alt={face.name} 
                          style={{ width: '16px', height: '16px', borderRadius: '50%', objectFit: 'cover' }} 
                        />
                        <span>{face.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto 12px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--scan-green)' }}>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div className="scan-grid"></div>
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={capturePhoto}
                    style={{
                      background: 'var(--scan-green)',
                      color: '#05070a',
                      border: 'none',
                      padding: '8px 16px',
                      fontFamily: 'var(--mono)',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    CAPTURE & SCAN
                  </button>
                  <button
                    type="button"
                    onClick={cancelCamera}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--ghost)',
                      color: 'var(--ghost)',
                      padding: '8px 14px',
                      fontFamily: 'var(--mono)',
                      fontSize: '11px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            )}

            <div className="fineprint">
              By uploading, you agree to receive brutally fake medical results.
            </div>
          </div>
        )}

        {/* STEP 2: SCANNING */}
        {step === 'scan' && (
          <div className="step active" id="step-scan">
            <div className="scan-stage">
              <div className="scan-frame">
                <img id="scanImg" src={photoUrl} alt="scan target" />
                <div className="scan-grid"></div>
                <div className="scan-line" id="scanLine"></div>
              </div>
              <div className="console" id="console">
                {scanLines.map((line, idx) => (
                  <div key={idx} className="line" style={{ display: 'block' }}>
                    {line}
                  </div>
                ))}
              </div>
              <div className="progress-outer">
                <div 
                  className="progress-inner" 
                  id="progressBar" 
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: ERROR */}
        {step === 'error' && (
          <div className="step active" id="step-error">
            <div className="error-stage">
              <div className="warn-icon">⚠️</div>
              <div className="error-title">SCAN INTERRUPTED</div>
              <div className="error-tape">◤ ◢ CRITICAL ANOMALY DETECTED ◤ ◢</div>
              <div className="error-body">
                The scanner detected something unexpected.<br />
                Further analysis is required.
              </div>
              <button 
                type="button"
                className="continue-btn" 
                id="continueBtn"
                onClick={handleContinueAnalysis}
              >
                ▸ CONTINUE ANALYSIS
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: RESULT */}
        {step === 'result' && (
          <div className="step active" id="step-result">
            <div className="result-stage">
              <div className="step-badge">
                STEP 4 — RANDOM BRAIN ROAST
              </div>

              {/* Forehead Roast (After the forehead roast, randomly select ONE of these results) */}
              <div className="forehead-card">
                <div className="forehead-title">
                  🔍 FOREHEAD RADAR TELEMETRY: {currentForehead.title}
                </div>
                <div className="forehead-dim">
                  {currentForehead.dimension} · {currentForehead.thermalRoast}
                </div>
                <div className="forehead-quote">
                  {currentForehead.roastText}
                </div>
              </div>

              {/* Result Icon, Label & Count */}
              <div className="result-icon" id="resultIcon">
                {currentResult.icon}
              </div>
              <div className="result-label" id="resultLabel">
                {currentResult.label}
              </div>
              <div className="result-count" id="resultCount">
                {currentResult.count !== "" && (
                  <span>
                    BRAINCELLS DETECTED: <b>{currentResult.count}</b>
                  </span>
                )}
              </div>

              {/* Roast Box */}
              <div 
                className="roast-box" 
                id="roastBox"
                dangerouslySetInnerHTML={{ __html: currentResult.roast }}
              />

              {/* Extra Line */}
              {currentResult.extra && (
                <div className="extra-line" id="extraLine">
                  {currentResult.extra}
                </div>
              )}

              {/* Assigned Brain Category Box */}
              <div className="category-badge-box">
                <div className="category-tag">
                  CLASSIFICATION: {currentCategory.tag}
                </div>
                <div className="category-name">
                  {currentCategory.icon} {currentCategory.name}
                </div>
                <div className="category-desc">
                  {currentCategory.description}
                </div>
              </div>

              {/* Big Button: 🔥TRY AGAIN ! FAIL AGAIN! */}
              <button 
                type="button"
                className="retry-btn" 
                id="retryBtn"
                onClick={handleTryAgainFailAgain}
              >
                🔥 TRY AGAIN ! FAIL AGAIN!
              </button>

              {/* Utility actions */}
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={handleScanAnother}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--panel-edge)',
                    color: 'var(--ghost)',
                    padding: '6px 12px',
                    fontFamily: 'var(--mono)',
                    fontSize: '11px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  🔄 SCAN ANOTHER PHOTO
                </button>
                <button
                  type="button"
                  onClick={handleCopyReport}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--scan-cyan)',
                    color: copied ? 'var(--scan-green)' : 'var(--scan-cyan)',
                    padding: '6px 12px',
                    fontFamily: 'var(--mono)',
                    fontSize: '11px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {copied ? '✓ COPIED REPORT' : '📋 COPY REPORT'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer text */}
      <div className="footer">
        Congratulations! 🎉 You just wasted several seconds of your life scanning a completely fake brain scanner.<br />
        Thank you for contributing absolutely nothing to <b>science</b>. 🧠💀
      </div>
    </div>
  );
}

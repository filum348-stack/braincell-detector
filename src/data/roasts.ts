export interface BrainScanResult {
  id: string;
  icon: string;
  label: string;
  count: string;
  roast: string;
  extra: string;
}

export interface ForeheadRoast {
  title: string;
  dimension: string;
  thermalRoast: string;
  roastText: string;
}

export interface BrainCategory {
  name: string;
  tag: string;
  icon: string;
  description: string;
}

export const RESULTS: BrainScanResult[] = [
  {
    id: "empty-brain",
    icon: "🧠",
    label: "Empty Brain",
    count: "0",
    roast: `Braincells detected: 0<br><span class="quote-highlight">“എന്തുവാടേ ഇത്?”😭</span><br><span style="color:#5a7a83; font-size:11px;">Your brain is so empty even the echo left. 💀</span>`,
    extra: "Cranial ultrasound reveals pure void. No thoughts, just cosmic wind."
  },
  {
    id: "definitely-alien",
    icon: "👽",
    label: "Definitely Alien",
    count: "N/A",
    roast: `HUMAN VERIFICATION FAILED.<br><span class="quote-highlight">“ദാസപ്പാ, എന്നെ ശരിക്കും ഒന്ന് ശ്രദ്ധിച്ചേ… എന്റെ പെരുമാറ്റത്തിൽ എന്തെങ്കിലും പന്തികേടുണ്ടോന്ന് നോക്കിക്കേ.”👽</span>`,
    extra: "Congratulations, alien. Your human disguise is terrible. Galactic police notified. 👽"
  },
  {
    id: "warning-zero",
    icon: "⚠️",
    label: "WARNING:",
    count: "-3",
    roast: `You don't just have zero braincells.<br><span class="quote-highlight">“ഈശ്വരാ… ഇവിടെ ആരും ഇല്ലല്ലോ! ഇതൊന്ന് പറഞ്ഞ് ചിരിക്കാനായിട്ട്!” 😭💀</span>`,
    extra: "You somehow owe the cranial department 3 braincells with compound interest."
  },
  {
    id: "final-diagnosis",
    icon: "🧠",
    label: "FINAL DIAGNOSIS:",
    count: "999,999",
    roast: `<span class="quote-highlight">“ചിലപ്പോ തോന്നും നീയൊരു കോമാളിയാണെന്ന്… ചിലപ്പോ തോന്നും നീ വലിയ ആളാണെന്ന്… സത്യത്തിൽ നീ ആരാ?” 💀😭</span><br><br>Braincells detected: 999999<br><span style="color:#ff2e3d; font-weight:bold;">🚨 TOO MANY BRAIN CELLS 🚨</span><br>This is suspicious.`,
    extra: "You may actually be an alien pretending to be human. 👽"
  },
  {
    id: "brain-offline",
    icon: "📡",
    label: "Brain Offline",
    count: "0 bars",
    roast: `Your brain is currently offline.<br><span class="quote-highlight">Last seen connected to Wi-Fi 3 weeks ago. 📡</span>`,
    extra: "Ping: Request timed out (100% packet loss). DNS lookup failed for cortex."
  },
  {
    id: "common-sense-404",
    icon: "❌",
    label: "Common Sense Not Found",
    count: "404",
    roast: `ERROR 404<br><span style="color:#ff2e3d; font-weight:bold; font-size:15px;">COMMON SENSE NOT FOUND</span>`,
    extra: "Have you tried turning yourself off and on again?"
  }
];

export const FOREHEAD_ROASTS: ForeheadRoast[] = [
  {
    title: "AERODYNAMIC LANDING STRIP HAZARD",
    dimension: "Surface Area: 14.6 km² | Friction: 0.00%",
    thermalRoast: "Blinding glare. Satellite reflection visible from outer space.",
    roastText: "“ബോയിങ് 747 അടിയന്തിരമായി ലാൻഡ് ചെയ്യാൻ നോക്കുന്നുണ്ട്… നെറ്റി ഒരൽപ്പം താഴ്ത്തിപ്പിടിക്കുമോ?” ✈️🚨"
  },
  {
    title: "IMAX PROJECTOR DRIVE-IN SCREEN",
    dimension: "Curvature: 180° Curved | Gloss: 99.8%",
    thermalRoast: "Reflectivity blinded local neighborhood solar panels.",
    roastText: "“അളിയാ… ആ നെറ്റിയിൽ ഒരെണ്ണത്തിന് പ്രൊജക്ടർ വെച്ച് സിനിമ പ്രദർശനം നടത്താം!” 📽️🍿"
  },
  {
    title: "CRANIAL ECHO CHAMBER",
    dimension: "Volume: 45 Liters of Pure Atmospheric Void",
    thermalRoast: "Acoustic ping: Shouting causes 4-minute continuous echo.",
    roastText: "“തലയ്ക്കകത്ത് കാറ്റടിക്കുന്ന ശബ്ദം കേൾക്കാം… വിൻഡോസ് ഷട്ട്ഡൗൺ സൗണ്ട് ലൂപ്പിൽ ഇട്ടിരിക്കുവാ!” 💨👂"
  },
  {
    title: "FIVE-HEAD ARCHITECTURAL MONUMENT",
    dimension: "Eyebrows to hairline: 3 Uber rides & a toll booth",
    thermalRoast: "Sub-zero temperatures. Dandruff refuses to settle.",
    roastText: "“ഇത് നെറ്റിയല്ല, സോളാർ പാനലുകൾ നിരത്തി വെക്കാനുള്ള കേരള വികസന പദ്ധതിയാണ്!” ☀️🔋"
  },
  {
    title: "PRIME BILLBOARD OPPORTUNITY ZONE",
    dimension: "Commercial Real Estate: Grade-A Billboard Area",
    thermalRoast: "Cold as yesterday's leftover porotta.",
    roastText: "“ദാസപ്പാ… ഈ നെറ്റിയിൽ വലിയൊരു ഫ്ലെക്സ് ബോർഡ് അടിച്ചുവെക്കാം, വാടക കിട്ടും!” 🪧😂"
  }
];

export const BRAIN_CATEGORIES: BrainCategory[] = [
  {
    name: "POTATO OS v0.0.1 (ALPHA)",
    tag: "STARCH-POWERED NEURO-CIRCUIT",
    icon: "🥔",
    description: "Operates on 0.8 volts. Single copper wire connecting two boiled russet potatoes. Freezes when chewing gum and walking simultaneously."
  },
  {
    name: "BLUETOOTH BRAIN: PAIRING FOREVER",
    tag: "DISCONNECTED PERIPHERAL",
    icon: "📶",
    description: "Permanently searching for nearby logic devices. Passcode '0000' rejected by own central nervous system."
  },
  {
    name: "HAMSTER WHEEL STALLED",
    tag: "MECHANICAL SUSPENSION",
    icon: "🐹",
    description: "The internal hamster took voluntary retirement in 2016. Wheel is rusted shut with cobwebs and existential dread."
  },
  {
    name: "QUANTUM VACUUM OF THOUGHT",
    tag: "THEORETICAL VOID ANOMALY",
    icon: "🕳️",
    description: "Neutrino detectors detected literal antimatter: negative thoughts and pure elevator jazz playing on loop."
  },
  {
    name: "FACTORY DEFAULT (NEVER UNBOXED)",
    tag: "MINT CONDITION / UNUSED",
    icon: "📦",
    description: "Original plastic wrapping still intact. Zero thoughts registered in warranty log. High resale value because it was never used."
  },
  {
    name: "SPONGEBOB CRANIUM EDITION",
    tag: "HIGH ABSORBENCY / ZERO RECALL",
    icon: "🧽",
    description: "Absorbs useless memes and Instagram reels at 3 AM. Completely repellent to common sense."
  },
  {
    name: "CIRCUS TENT HARMONICS",
    tag: "CARNIVAL COGNITIVE SUITE",
    icon: "🎪",
    description: "Internal soundtrack consists entirely of circus accordion music and squeaky rubber chicken sound effects on infinite loop."
  }
];

export const SAMPLE_FACES = [
  {
    id: "sample-1",
    name: "Sample 1",
    label: "Subject Alpha",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "sample-2",
    name: "Sample 2",
    label: "Subject Beta",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
  },
  {
    id: "sample-3",
    name: "Sample 3 (Orange Cat)",
    label: "Feline Unit",
    url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80"
  }
];

export const SAMPLE_SUBJECTS = SAMPLE_FACES;
export const FOREHEAD_ROASTS_POOL = FOREHEAD_ROASTS;
export const BRAIN_CATEGORIES_POOL = BRAIN_CATEGORIES;

export const RANDOM_BRAIN_ROASTS = [
  {
    id: 'empty-brain',
    title: '🧠 Empty Brain',
    icon: '🧠',
    badge: 'ZERO CELL DETECTED',
    badgeColor: 'bg-red-950 text-red-300 border-red-800',
    metricLabel: 'Braincells detected:',
    metricValue: 0,
    quote: '“എന്തുവാടേ ഇത്?”😭',
    subDescription: 'Cranial ultrasound reveals pure void. No thoughts, just wind howling between ears.'
  },
  {
    id: 'definitely-alien',
    title: '👽 Definitely Alien',
    icon: '👽',
    badge: 'HUMAN_VERIF_FAILED',
    badgeColor: 'bg-purple-950 text-purple-300 border-purple-800',
    highlightText: 'HUMAN VERIFICATION FAILED.',
    quote: '“ദാസപ്പാ, എന്നെ ശരിക്കും ഒന്ന് ശ്രദ്ധിച്ചേ… എന്റെ പെരുമാറ്റത്തിൽ എന്തെങ്കിലും പന്തികേടുണ്ടോന്ന് നോക്കിക്കേ.”👽',
    subDescription: 'Extraterrestrial cognitive frequencies detected. Galactic police have been notified.'
  },
  {
    id: 'warning-zero',
    title: '⚠️ WARNING:',
    icon: '⚠️',
    badge: 'CRITICAL ALERT',
    badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
    highlightText: "You don't just have zero braincells.",
    quote: '“ഈശ്വരാ… ഇവിടെ ആരും ഇല്ലല്ലോ! ഇതൊന്ന് പറഞ്ഞ് ചിരിക്കാനായിട്ട്!” 😭💀',
    subDescription: 'Even the echo inside your skull refused to talk back out of utter loneliness.'
  },
  {
    id: 'final-diagnosis',
    title: '🧠 FINAL DIAGNOSIS:',
    icon: '🧠',
    badge: 'CEREBRAL OVERFLOW',
    badgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
    quote: '“ചിലപ്പോ തോന്നും നീയൊരു കോമാളിയാണെന്ന്… ചിലപ്പോ തോന്നും നീ വലിയ ആളാണെന്ന്… സത്യത്തിൽ നീ ആരാ?” 💀😭',
    metricLabel: 'Braincells detected:',
    metricValue: 999999,
    warningAlert: {
      title: '🚨 TOO MANY BRAIN CELLS 🚨',
      description: 'This is suspicious.',
      subtext: 'You may actually be an alien pretending to be human. 👽'
    },
    subDescription: 'Memory address 0xFFFFFFFF breached. Intelligence integer overflow error.'
  },
  {
    id: 'brain-offline',
    title: '📡 Brain Offline',
    icon: '📡',
    badge: 'NO PACKET RESPONSE',
    badgeColor: 'bg-cyan-950 text-cyan-300 border-cyan-800',
    highlightText: 'Your brain is currently offline.',
    quote: 'Last seen connected to Wi-Fi 3 weeks ago. 📡',
    subDescription: 'Ping: Request timed out (100% packet loss). DNS lookup failed for cortex.local.'
  },
  {
    id: 'common-sense-404',
    title: '❌ Common Sense Not Found',
    icon: '❌',
    badge: 'HTTP 404 NOT FOUND',
    badgeColor: 'bg-red-950 text-red-400 border-red-700',
    highlightText: 'ERROR 404\nCOMMON SENSE NOT FOUND',
    quote: 'Have you tried turning yourself off and on again?',
    subDescription: 'The requested module /cranial/common-sense could not be located in this human instance.'
  }
];


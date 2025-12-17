import React, { useState } from 'react';
import { AppMode, ImageFile, Language, AspectRatio, VideoPromptData, VideoCharacter, PromptGenOutput } from './types';
import { generateAIImage, generateTextResponse } from './services/geminiService';
import { CyberButton } from './components/CyberButton';
import { ImageUploader } from './components/ImageUploader';
import { TRANSLATIONS, PROMPT_OPTIONS } from './constants';
import { 
  PhotoIcon, 
  UserIcon, 
  SwatchIcon, 
  SparklesIcon, 
  ArrowDownTrayIcon,
  SunIcon,
  MoonIcon,
  CloudIcon,
  RocketLaunchIcon,
  VideoCameraIcon,
  PlusIcon,
  TrashIcon,
  ClipboardDocumentCheckIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import { SunIcon as SunIconSolid, MoonIcon as MoonIconSolid } from '@heroicons/react/24/solid';

const Background: React.FC<{ isNight: boolean }> = ({ isNight }) => (
  <div className={`fixed inset-0 -z-10 transition-all duration-1000 ${isNight ? 'bg-gradient-to-b from-gray-900 via-[#1a0b2e] to-black' : 'bg-gradient-to-b from-sky-400 to-sky-100'}`}>
    {isNight ? (
      <>
        {/* Stars */}
        {[...Array(30)].map((_, i) => (
          <div key={i} className="absolute bg-white rounded-full animate-pulse" 
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              opacity: Math.random() * 0.7 + 0.3,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
        {/* Moon */}
        <MoonIconSolid className="absolute top-20 right-10 w-24 h-24 text-yellow-100 opacity-90 drop-shadow-[0_0_15px_rgba(255,255,200,0.5)]" />
        {/* Rocket */}
         <div className="absolute opacity-0" style={{ animation: 'rocketFly 20s linear infinite', top: '100%', left: '-10%' }}>
            <div className="relative transform rotate-45">
              <RocketLaunchIcon className="w-20 h-20 text-gray-200" />
              <div className="absolute top-16 left-4 w-4 h-12 bg-gradient-to-b from-orange-500 to-transparent blur-md rounded-full -z-10"></div>
              <div className="absolute top-16 left-12 w-4 h-12 bg-gradient-to-b from-orange-500 to-transparent blur-md rounded-full -z-10"></div>
            </div>
         </div>
         <style>{`
           @keyframes rocketFly {
             0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
             10% { opacity: 1; }
             90% { opacity: 1; }
             100% { transform: translate(120vw, -120vh) scale(1); opacity: 0; }
           }
         `}</style>
      </>
    ) : (
      <>
         {/* Sun */}
         <SunIconSolid className="absolute top-10 right-10 w-32 h-32 text-yellow-400 animate-[spin_60s_linear_infinite] drop-shadow-[0_0_30px_rgba(250,204,21,0.6)]" />
         {/* Clouds */}
         {[...Array(6)].map((_, i) => (
           <CloudIcon key={i} className="absolute text-white/90 drop-shadow-lg" 
             style={{
               top: `${Math.random() * 30 + 5}%`,
               left: `${Math.random() * 100}%`,
               width: `${Math.random() * 60 + 80}px`,
               animation: `float ${Math.random() * 20 + 20}s linear infinite alternate`
             }} 
           />
         ))}
         <style>{`
           @keyframes float {
             0% { transform: translateX(-30px); }
             100% { transform: translateX(30px); }
           }
         `}</style>
      </>
    )}
  </div>
);

const App: React.FC = () => {
  const [isNightMode, setIsNightMode] = useState<boolean>(true);
  const [mode, setMode] = useState<AppMode>(AppMode.HOME);
  const [language, setLanguage] = useState<Language>('id');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar toggle
  
  // Generic Input (Used for Reference in Product/Character and Sources in Blender)
  const [inputImages, setInputImages] = useState<ImageFile[]>([]);
  
  // Poster Mode Specific Inputs
  const [productImages, setProductImages] = useState<ImageFile[]>([]);
  const [logoImages, setLogoImages] = useState<ImageFile[]>([]); // Array for compat, max 1
  const [posterTheme, setPosterTheme] = useState<string>('');
  const [posterText, setPosterText] = useState<string>('');

  const [prompt, setPrompt] = useState<string>(''); // Generic prompt for Char/Blender
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  
  // Blender Pose State
  const [selectedPose, setSelectedPose] = useState<string>('none');
  const [customPose, setCustomPose] = useState<string>('');
  
  // Character Art Style State
  const [selectedArtStyle, setSelectedArtStyle] = useState<string>('none');
  const [customArtStyle, setCustomArtStyle] = useState<string>('');

  // Video Prompt Gen State
  const [videoData, setVideoData] = useState<VideoPromptData>({
    type: PROMPT_OPTIONS.types[0],
    duration: PROMPT_OPTIONS.durations[0],
    visualStyle: PROMPT_OPTIONS.visualStyles[0],
    audioStyle: PROMPT_OPTIONS.audioStyles[0],
    language: PROMPT_OPTIONS.languages[0],
    aspectRatio: "16:9",
    resolution: "1080p",
    reference: "",
    notes: "",
    characters: [],
    scene: {
      title: "",
      location: "",
      subjectAction: "",
      dialogs: [],
      supportingSubjects: "",
      visualDetails: "",
      emotion: PROMPT_OPTIONS.emotions[0],
      camera: PROMPT_OPTIONS.movements[0],
      effects: ""
    }
  });
  const [promptOutput, setPromptOutput] = useState<PromptGenOutput | null>(null);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const t = TRANSLATIONS[language];

  // Dynamic Styles
  const s = {
    bg: "bg-transparent", // Background handled by component
    textMain: isNightMode ? "text-gray-300" : "text-slate-700",
    textHeading: isNightMode ? "text-white" : "text-slate-900",
    textSub: isNightMode ? "text-gray-500" : "text-slate-500",
    cardBg: isNightMode ? "bg-cyber-dark/80" : "bg-white/80 backdrop-blur-md shadow-lg",
    cardBorder: isNightMode ? "border-cyber-gray" : "border-white/50",
    inputBg: isNightMode ? "bg-cyber-dark" : "bg-white",
    inputBorder: isNightMode ? "border-cyber-gray" : "border-slate-200",
    inputText: isNightMode ? "text-white" : "text-slate-900",
    headerBg: isNightMode ? "bg-cyber-dark/80" : "bg-white/80",
    headerBorder: isNightMode ? "border-cyber-gray/50" : "border-slate-200",
    sidebarBg: isNightMode ? "bg-black/40" : "bg-white/60",
    activeMode: isNightMode ? "bg-cyber-gray/50 text-white" : "bg-sky-100 text-sky-900",
    activeModeBorder: isNightMode ? "" : "border-sky-400",
  };

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    setInputImages([]);
    setProductImages([]);
    setLogoImages([]);
    setPosterTheme('');
    setPosterText('');
    setPrompt('');
    setResultImage(null);
    setPromptOutput(null);
    setError(null);
    setIsSidebarOpen(false); // Close mobile sidebar on select
    // Reset specific states
    setSelectedPose('none');
    setCustomPose('');
    setSelectedArtStyle('none');
    setCustomArtStyle('');
    setAspectRatio("1:1");
  };

  const getMaxImages = () => {
    switch (mode) {
      case AppMode.BLENDER: return 4;
      default: return 1;
    }
  };

  const getMinImages = () => {
     switch (mode) {
      case AppMode.BLENDER: return 2;
      case AppMode.CHARACTER: return 0; // Optional upload
      case AppMode.PRODUCT: return 0; // Reference is optional, check productImages separately
      default: return 1;
    }
  }

  // --- PROMPT GEN HELPERS ---
  const addCharacter = () => {
    const newChar: VideoCharacter = {
      id: Date.now().toString(),
      name: "", ageGender: "", physical: "", clothing: "", posture: "", expression: ""
    };
    setVideoData(prev => ({ ...prev, characters: [...prev.characters, newChar] }));
  };

  const removeCharacter = (id: string) => {
    setVideoData(prev => ({ ...prev, characters: prev.characters.filter(c => c.id !== id) }));
  };

  const updateCharacter = (id: string, field: keyof VideoCharacter, value: string) => {
    setVideoData(prev => ({
      ...prev,
      characters: prev.characters.map(c => c.id === id ? { ...c, [field]: value } : c)
    }));
  };

  const addDialog = () => {
     const newDialog = { id: Date.now().toString(), characterName: "", text: "" };
     setVideoData(prev => ({
       ...prev,
       scene: { ...prev.scene, dialogs: [...prev.scene.dialogs, newDialog] }
     }));
  };

  const removeDialog = (id: string) => {
    setVideoData(prev => ({
       ...prev,
       scene: { ...prev.scene, dialogs: prev.scene.dialogs.filter(d => d.id !== id) }
     }));
  };

  const updateDialog = (id: string, field: 'characterName' | 'text', value: string) => {
    setVideoData(prev => ({
       ...prev,
       scene: { 
         ...prev.scene, 
         dialogs: prev.scene.dialogs.map(d => d.id === id ? { ...d, [field]: value } : d) 
       }
     }));
  };

  const handleGeneratePrompt = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
       // Construct raw data string
       const rawData = JSON.stringify(videoData, null, 2);
       const instruction = `
         Analyze the following video production data:
         ${rawData}

         Based on this data, generate 4 distinct outputs in a single JSON object with these exact keys:
         1. "english": An optimized, highly detailed prompt for Google Veo 3 / Sora in English.
         2. "indonesian": The same optimized prompt translated to Indonesian.
         3. "json": A structured JSON representation of the prompt details (clean schema).
         4. "simple": A simplified, concise version of the prompt (1-2 sentences).

         The output MUST be valid JSON.
       `;

       const responseText = await generateTextResponse(instruction, t.prompts.system[AppMode.PROMPT_VIDEO]);
       // Attempt to parse JSON
       try {
         // Clean potential markdown code blocks
         const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
         const parsed = JSON.parse(cleaned);
         setPromptOutput({
           english: parsed.english || "Error parsing English",
           indonesian: parsed.indonesian || "Error parsing Indonesian",
           json: JSON.stringify(parsed.json, null, 2) || "{}",
           simple: parsed.simple || "Error parsing Simple"
         });
       } catch (e) {
         console.error("Parse error", e);
         // Fallback if not JSON
         setPromptOutput({
            english: responseText,
            indonesian: "Parsing Error",
            json: "Parsing Error",
            simple: "Parsing Error"
         });
       }

    } catch (err: any) {
      setError(err.message || "Failed to generate prompt");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = async () => {
    if (mode === AppMode.PROMPT_VIDEO) {
      await handleGeneratePrompt();
      return;
    }

    setError(null);
    let finalInputImages: ImageFile[] = [];
    let fullPrompt = "";

    // --- POSTER MAKER LOGIC ---
    if (mode === AppMode.PRODUCT) {
      if (productImages.length === 0) {
        setError(t.errors.missingProduct || "Missing product image");
        return;
      }
      if (!posterTheme.trim()) {
        setError(t.errors.missingTheme || "Missing theme");
        return;
      }

      const prodCount = productImages.length;
      const logoCount = logoImages.length;
      const refCount = inputImages.length;

      // Construct detailed prompt
      fullPrompt = `
        Main Theme: ${posterTheme}.
        Text Content to Include: "${posterText}".
        ${prompt ? `Additional Instructions: ${prompt}` : ''}
        
        Input Image Guide:
        - The first ${prodCount} image(s) are the PRODUCT(S) to feature.
        ${logoCount > 0 ? `- The next ${logoCount} image is the BRAND LOGO.` : ''}
        ${refCount > 0 ? `- The final ${refCount} image is a STYLE REFERENCE.` : ''}
      `;

      // Combine images in specific order
      finalInputImages = [...productImages, ...logoImages, ...inputImages];

    } else {
      // --- GENERIC LOGIC (Character / Blender) ---
      if (inputImages.length < getMinImages()) {
        setError(t.errors.minImages(getMinImages()));
        return;
      }

      // Determine if prompt is required
      let isPromptRequired = true;
      if (mode === AppMode.BLENDER && selectedPose !== 'none') isPromptRequired = false;
      
      if (isPromptRequired && !prompt.trim()) {
        if (mode === AppMode.CHARACTER && selectedArtStyle === 'custom' && customArtStyle.trim()) {
          // Allow custom style
        } else {
          setError(t.errors.noPrompt);
          return;
        }
      }

      fullPrompt = prompt;
      finalInputImages = inputImages;
    }

    // --- BLENDER SPECIFIC PROMPT APPENDS ---
    if (mode === AppMode.BLENDER) {
      let poseText = "";
      if (selectedPose === 'custom') {
        poseText = customPose;
      } else if (selectedPose !== 'none') {
        const poseMap: Record<string, string> = {
            standing_basic: "standing in a casual, confident fashion model pose",
            hands_hips: "standing with hands on hips in a power pose",
            leaning: "leaning casually against a wall or surface",
            walking_cam: "walking confidently towards the camera like a runway model",
            sitting_stool: "sitting elegantly on a high stool or chair",
            over_shoulder: "looking back over the shoulder",
            hand_face: "posing with a hand gently touching the face or chin",
            crossed_legs: "sitting with legs crossed elegantly"
        };
        if (poseMap[selectedPose]) {
           poseText = `The subject should be ${poseMap[selectedPose]}.`;
        }
      }
      if (poseText) {
        fullPrompt = `${fullPrompt}. ${poseText}`;
      }
    }

    // --- CHARACTER SPECIFIC PROMPT APPENDS ---
    if (mode === AppMode.CHARACTER) {
      let styleText = "";
      if (selectedArtStyle === 'custom') {
        styleText = customArtStyle;
      } else if (selectedArtStyle !== 'none') {
         const styleMap: Record<string, string> = {
            realistic: "Realistic / Photorealistic",
            cartoon: "Cartoon / Toon",
            comic: "Comic Book Style",
            anime: "Anime / Manga Style",
            render3d: "3D Render",
            pixel: "Pixel Art",
            oil: "Oil Painting",
            cyberpunk: "Cyberpunk Aesthetic"
         };
         if (styleMap[selectedArtStyle]) {
           styleText = styleMap[selectedArtStyle];
         }
      }
      if (styleText) {
        fullPrompt = `${fullPrompt}. Art Style: ${styleText}`;
      }
    }

    setIsGenerating(true);
    setResultImage(null);

    try {
      const systemInstruction = t.prompts.system[mode];
      
      let prefix = t.prompts.prefix[mode];
      if (mode === AppMode.CHARACTER && inputImages.length === 0) {
        prefix = (t.prompts.prefixNoImage && t.prompts.prefixNoImage[mode]) 
          ? t.prompts.prefixNoImage[mode] 
          : "Create a character based on these instructions: ";
      }

      const suffix = t.prompts.suffix[mode];
      const finalPromptString = `${prefix}${fullPrompt}.${suffix}`;

      const result = await generateAIImage(finalPromptString, finalInputImages, systemInstruction, aspectRatio);
      setResultImage(result);
    } catch (err: any) {
      setError(err.message || t.errors.generic);
    } finally {
      setIsGenerating(false);
    }
  };

  // ... helper options arrays ...
  const poses = [
    { key: 'none', label: t.config.poses.none },
    { key: 'standing_basic', label: t.config.poses.standing_basic },
    { key: 'hands_hips', label: t.config.poses.hands_hips },
    { key: 'leaning', label: t.config.poses.leaning },
    { key: 'walking_cam', label: t.config.poses.walking_cam },
    { key: 'sitting_stool', label: t.config.poses.sitting_stool },
    { key: 'over_shoulder', label: t.config.poses.over_shoulder },
    { key: 'hand_face', label: t.config.poses.hand_face },
    { key: 'crossed_legs', label: t.config.poses.crossed_legs },
    { key: 'custom', label: t.config.poses.custom },
  ];

  const styles = [
    { key: 'none', label: t.config.styles.none },
    { key: 'realistic', label: t.config.styles.realistic },
    { key: 'cartoon', label: t.config.styles.cartoon },
    { key: 'comic', label: t.config.styles.comic },
    { key: 'anime', label: t.config.styles.anime },
    { key: 'render3d', label: t.config.styles.render3d },
    { key: 'pixel', label: t.config.styles.pixel },
    { key: 'oil', label: t.config.styles.oil },
    { key: 'cyberpunk', label: t.config.styles.cyberpunk },
    { key: 'custom', label: t.config.styles.custom },
  ];

  // Helper component for Sidebar items
  const SidebarItem = ({ modeKey, icon: Icon, colorClass }: { modeKey: AppMode, icon: any, colorClass: string }) => (
    <button
      onClick={() => handleModeChange(modeKey)}
      className={`
        w-full flex items-center gap-3 p-3 rounded-lg text-sm font-bold font-display tracking-wide transition-all
        ${mode === modeKey 
          ? `${s.activeMode} border-l-4 ${colorClass.replace('text-', 'border-')}` 
          : `text-gray-400 hover:text-white hover:bg-white/5`
        }
      `}
    >
      <Icon className={`w-5 h-5 ${mode === modeKey ? '' : colorClass}`} />
      <span>{t.modules[modeKey].title}</span>
    </button>
  );

  return (
    <div className={`h-screen flex flex-col ${s.textMain} font-body selection:bg-cyber-pink selection:text-white overflow-hidden relative`}>
      <Background isNight={isNightMode} />
      
      {/* Header (Top Bar) */}
      <header className={`border-b ${s.headerBorder} ${s.headerBg} backdrop-blur-md z-50 transition-colors duration-500 flex-shrink-0`}>
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
               {isSidebarOpen ? <XMarkIcon className="w-6 h-6"/> : <Bars3Icon className="w-6 h-6"/>}
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleModeChange(AppMode.HOME)}>
              <div className="w-8 h-8 bg-cyber-cyan animate-pulse shadow-neon-cyan cyber-border"></div>
              <h1 className={`text-xl font-display font-bold ${s.textHeading} tracking-widest`}>
                {t.appTitle}<span className="text-cyber-cyan">{t.appTitleSuffix}</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Theme Toggle */}
             <button 
              onClick={() => setIsNightMode(!isNightMode)}
              className={`p-1.5 rounded-full border transition-all ${isNightMode ? 'bg-cyber-dark border-yellow-400 text-yellow-400' : 'bg-white border-orange-400 text-orange-500'}`}
              title="Toggle Day/Night Mode"
            >
              {isNightMode ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
            </button>

            <div className={`flex ${isNightMode ? 'bg-cyber-dark' : 'bg-white'} border ${s.headerBorder} rounded overflow-hidden`}>
              <button 
                onClick={() => setLanguage('id')}
                className={`px-2 py-1 text-xs font-bold transition-all ${language === 'id' ? 'bg-cyber-cyan text-black' : `${s.textSub} hover:${s.textHeading}`}`}
              >
                ID
              </button>
              <button 
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-xs font-bold transition-all ${language === 'en' ? 'bg-cyber-cyan text-black' : `${s.textSub} hover:${s.textHeading}`}`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Navigation Sidebar */}
        <aside className={`
          absolute lg:static inset-y-0 left-0 z-40 w-64 ${s.sidebarBg} border-r ${s.cardBorder} backdrop-blur-xl transform transition-transform duration-300 ease-in-out
          flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4 space-y-8 flex-1 overflow-y-auto">

            {/* Main Dashboard Group */}
            <div>
              <p className={`text-xs ${s.textSub} mb-3 uppercase tracking-widest font-bold border-b ${s.headerBorder} pb-1`}>
                {t.sections.catMain}
              </p>
              <SidebarItem modeKey={AppMode.HOME} icon={HomeIcon} colorClass="text-white" />
            </div>
            
            {/* Photo Generators Group */}
            <div>
              <p className={`text-xs ${s.textSub} mb-3 uppercase tracking-widest font-bold border-b ${s.headerBorder} pb-1`}>
                {t.sections.catPhoto}
              </p>
              <div className="space-y-1">
                <SidebarItem modeKey={AppMode.PRODUCT} icon={PhotoIcon} colorClass="text-cyber-cyan" />
                <SidebarItem modeKey={AppMode.CHARACTER} icon={UserIcon} colorClass="text-cyber-pink" />
                <SidebarItem modeKey={AppMode.BLENDER} icon={SwatchIcon} colorClass="text-cyber-green" />
              </div>
            </div>

            {/* Prompt Generators Group */}
            <div>
              <p className={`text-xs ${s.textSub} mb-3 uppercase tracking-widest font-bold border-b ${s.headerBorder} pb-1`}>
                {t.sections.catPrompt}
              </p>
              <div className="space-y-1">
                <SidebarItem modeKey={AppMode.PROMPT_VIDEO} icon={VideoCameraIcon} colorClass="text-cyber-yellow" />
              </div>
            </div>

          </div>
          
          <div className="p-4 border-t border-cyber-gray bg-black/20">
             <div className="text-[10px] font-mono text-center opacity-50">
               SYSTEM v1.0<br/>GEMINI NANO
             </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 scroll-smooth">
          <div className="max-w-[1920px] mx-auto h-full">
          
          {mode === AppMode.HOME ? (
            // --- HOME DASHBOARD ---
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyber-cyan blur-3xl opacity-20 animate-pulse"></div>
                  <h1 className="text-6xl md:text-8xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cyber-cyan to-cyber-pink relative z-10 cyber-glitch" data-text="FANNSTUDIO">
                      FANNSTUDIO
                  </h1>
                </div>
                <p className="text-xl md:text-3xl font-body font-light tracking-widest text-cyber-cyan/80 uppercase">
                  {t.home.slogan}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl w-full px-4">
                  <button onClick={() => handleModeChange(AppMode.PRODUCT)} className={`p-6 border ${s.cardBorder} ${s.cardBg} rounded-xl backdrop-blur-md hover:border-cyber-cyan transition-all group`}>
                      <PhotoIcon className="w-12 h-12 text-cyber-cyan mb-4 mx-auto group-hover:scale-110 transition-transform"/>
                      <h3 className="text-lg font-bold font-display text-white">AI Visuals</h3>
                      <p className={`text-sm ${s.textSub} mt-2`}>High-fidelity image generation & editing.</p>
                  </button>
                    <button onClick={() => handleModeChange(AppMode.CHARACTER)} className={`p-6 border ${s.cardBorder} ${s.cardBg} rounded-xl backdrop-blur-md hover:border-cyber-pink transition-all group`}>
                      <UserIcon className="w-12 h-12 text-cyber-pink mb-4 mx-auto group-hover:scale-110 transition-transform"/>
                      <h3 className="text-lg font-bold font-display text-white">Character Lab</h3>
                      <p className={`text-sm ${s.textSub} mt-2`}>Conceptualize unique avatars.</p>
                  </button>
                    <button onClick={() => handleModeChange(AppMode.PROMPT_VIDEO)} className={`p-6 border ${s.cardBorder} ${s.cardBg} rounded-xl backdrop-blur-md hover:border-cyber-yellow transition-all group`}>
                      <VideoCameraIcon className="w-12 h-12 text-cyber-yellow mb-4 mx-auto group-hover:scale-110 transition-transform"/>
                      <h3 className="text-lg font-bold font-display text-white">Video Prompts</h3>
                      <p className={`text-sm ${s.textSub} mt-2`}>Optimized for Sora & Veo.</p>
                  </button>
                </div>

                <div className="mt-12 text-xs font-mono text-gray-500 border border-gray-800 px-4 py-2 rounded-full">
                  {t.home.status} // {t.home.welcome}
                </div>
            </div>
          ) : mode === AppMode.PROMPT_VIDEO ? (
            // --- VIDEO PROMPT GENERATOR FORM (Full Width) ---
            <div className={`animate-in slide-in-from-bottom duration-500 max-w-4xl mx-auto`}>
              <div className={`p-6 rounded-xl ${s.cardBg} border ${s.cardBorder} space-y-8 mb-20`}>
                 <h2 className={`font-display text-xl font-bold text-center ${s.textHeading} border-b ${s.headerBorder} pb-4`}>
                   APLIKASI PROMPT GENERATOR BY FANNSTUDIO
                 </h2>

                 {/* Section 1: General Info */}
                 <div>
                   <h3 className="text-cyber-cyan font-display text-lg uppercase mb-4">Bagian 1: Informasi Umum Video</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {[
                       { label: 'Jenis Video', key: 'type', options: PROMPT_OPTIONS.types },
                       { label: 'Durasi', key: 'duration', options: PROMPT_OPTIONS.durations },
                       { label: 'Gaya Visual', key: 'visualStyle', options: PROMPT_OPTIONS.visualStyles },
                       { label: 'Gaya Audio', key: 'audioStyle', options: PROMPT_OPTIONS.audioStyles },
                       { label: 'Bahasa', key: 'language', options: PROMPT_OPTIONS.languages },
                       { label: 'Aspek Rasio', key: 'aspectRatio', options: ["16:9", "9:16", "4:3", "1:1"] },
                       { label: 'Resolusi', key: 'resolution', options: PROMPT_OPTIONS.resolutions },
                     ].map((field) => (
                       <div key={field.key}>
                         <label className={`block text-xs uppercase ${s.textSub} mb-1`}>{field.label}</label>
                         <select 
                           value={videoData[field.key as keyof VideoPromptData] as string}
                           onChange={(e) => setVideoData({...videoData, [field.key]: e.target.value})}
                           className={`w-full ${s.inputBg} border ${s.inputBorder} ${s.inputText} p-2 text-sm focus:border-cyber-cyan outline-none`}
                         >
                           {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                         </select>
                       </div>
                     ))}
                   </div>
                   <div className="mt-4 space-y-3">
                      <div>
                        <label className={`block text-xs uppercase ${s.textSub} mb-1`}>Referensi (Opsional)</label>
                        <input 
                           type="text" 
                           placeholder="Cth: Visual mirip 'Ada Apa Dengan Cinta?', tone seperti video musik 'Coldplay'"
                           value={videoData.reference}
                           onChange={(e) => setVideoData({...videoData, reference: e.target.value})}
                           className={`w-full ${s.inputBg} border ${s.inputBorder} ${s.inputText} p-2 text-sm focus:border-cyber-cyan outline-none`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs uppercase ${s.textSub} mb-1`}>Catatan Penting AI (Opsional)</label>
                        <textarea 
                           placeholder="Cth: Pastikan karakter konsisten. Dialog natural."
                           value={videoData.notes}
                           onChange={(e) => setVideoData({...videoData, notes: e.target.value})}
                           className={`w-full ${s.inputBg} border ${s.inputBorder} ${s.inputText} p-2 text-sm focus:border-cyber-cyan outline-none h-20`}
                        />
                      </div>
                   </div>
                 </div>

                 {/* Section 2: Character Profiles */}
                 <div>
                   <h3 className="text-cyber-pink font-display text-lg uppercase mb-4">Bagian 2: Profil Karakter Utama</h3>
                   <div className="space-y-6">
                     {videoData.characters.map((char, idx) => (
                       <div key={char.id} className={`p-4 border ${s.inputBorder} bg-black/20 rounded relative`}>
                          <button onClick={() => removeCharacter(char.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-400"><TrashIcon className="w-5 h-5"/></button>
                          <h4 className={`text-sm font-bold ${s.textHeading} mb-3`}>Karakter {idx + 1}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                             <input placeholder="Nama Karakter" value={char.name} onChange={e => updateCharacter(char.id, 'name', e.target.value)} className={`p-2 ${s.inputBg} border ${s.inputBorder} ${s.inputText} text-sm`} />
                             <input placeholder="Usia & Jenis Kelamin" value={char.ageGender} onChange={e => updateCharacter(char.id, 'ageGender', e.target.value)} className={`p-2 ${s.inputBg} border ${s.inputBorder} ${s.inputText} text-sm`} />
                             <input placeholder="Ciri Fisik Utama" value={char.physical} onChange={e => updateCharacter(char.id, 'physical', e.target.value)} className={`p-2 ${s.inputBg} border ${s.inputBorder} ${s.inputText} text-sm`} />
                             <input placeholder="Pakaian & Aksesori" value={char.clothing} onChange={e => updateCharacter(char.id, 'clothing', e.target.value)} className={`p-2 ${s.inputBg} border ${s.inputBorder} ${s.inputText} text-sm`} />
                             <input placeholder="Sikap/Postur" value={char.posture} onChange={e => updateCharacter(char.id, 'posture', e.target.value)} className={`p-2 ${s.inputBg} border ${s.inputBorder} ${s.inputText} text-sm`} />
                             <input placeholder="Ekspresi Wajah" value={char.expression} onChange={e => updateCharacter(char.id, 'expression', e.target.value)} className={`p-2 ${s.inputBg} border ${s.inputBorder} ${s.inputText} text-sm`} />
                          </div>
                       </div>
                     ))}
                     <button onClick={addCharacter} className={`flex items-center gap-2 text-xs font-bold ${s.textHeading} hover:text-cyber-pink border border-cyber-pink px-3 py-2 rounded`}>
                       <PlusIcon className="w-4 h-4" /> TAMBAH KARAKTER
                     </button>
                   </div>
                 </div>

                 {/* Section 3: Scene Details */}
                 <div>
                    <h3 className="text-cyber-green font-display text-lg uppercase mb-4">Bagian 3: Detail Adegan</h3>
                    <div className={`p-4 border ${s.inputBorder} bg-black/20 rounded space-y-4`}>
                       <input placeholder="Judul Adegan (Cth: Pagi di Dapur)" value={videoData.scene.title} onChange={e => setVideoData({...videoData, scene: {...videoData.scene, title: e.target.value}})} className={`w-full p-2 ${s.inputBg} border ${s.inputBorder} ${s.inputText} text-sm font-bold`} />
                       <textarea placeholder="Lokasi/Latar (Detail)" value={videoData.scene.location} onChange={e => setVideoData({...videoData, scene: {...videoData.scene, location: e.target.value}})} className={`w-full p-2 ${s.inputBg} border ${s.inputBorder} ${s.inputText} text-sm h-20`} />
                       <textarea placeholder="Subjek Utama & Tindakan" value={videoData.scene.subjectAction} onChange={e => setVideoData({...videoData, scene: {...videoData.scene, subjectAction: e.target.value}})} className={`w-full p-2 ${s.inputBg} border ${s.inputBorder} ${s.inputText} text-sm h-20`} />
                       
                       {/* Dialogs */}
                       <div className="space-y-2">
                         <label className={`block text-xs uppercase ${s.textSub}`}>Dialog</label>
                         {videoData.scene.dialogs.map((d, idx) => (
                           <div key={d.id} className="flex gap-2">
                              <input placeholder="Nama" value={d.characterName} onChange={e => updateDialog(d.id, 'characterName', e.target.value)} className={`w-1/3 p-2 ${s.inputBg} border ${s.inputBorder} ${s.inputText} text-sm`} />
                              <input placeholder="Isi Dialog" value={d.text} onChange={e => updateDialog(d.id, 'text', e.target.value)} className={`w-full p-2 ${s.inputBg} border ${s.inputBorder} ${s.inputText} text-sm`} />
                              <button onClick={() => removeDialog(d.id)} className="text-red-500"><TrashIcon className="w-4 h-4"/></button>
                           </div>
                         ))}
                         <button onClick={addDialog} className={`flex items-center gap-2 text-xs font-bold ${s.textHeading} hover:text-cyber-green border border-cyber-green px-2 py-1 rounded w-fit`}>
                           <PlusIcon className="w-3 h-3" /> Tambah Dialog
                         </button>
                       </div>

                       <textarea placeholder="Subjek Pendukung (Opsional)" value={videoData.scene.supportingSubjects} onChange={e => setVideoData({...videoData, scene: {...videoData.scene, supportingSubjects: e.target.value}})} className={`w-full p-2 ${s.inputBg} border ${s.inputBorder} ${s.inputText} text-sm`} />
                       <textarea placeholder="Detail Visual Tambahan" value={videoData.scene.visualDetails} onChange={e => setVideoData({...videoData, scene: {...videoData.scene, visualDetails: e.target.value}})} className={`w-full p-2 ${s.inputBg} border ${s.inputBorder} ${s.inputText} text-sm`} />
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                            <label className={`block text-xs uppercase ${s.textSub} mb-1`}>Emosi/Suasana</label>
                            <select value={videoData.scene.emotion} onChange={e => setVideoData({...videoData, scene: {...videoData.scene, emotion: e.target.value}})} className={`w-full ${s.inputBg} border ${s.inputBorder} ${s.inputText} p-2 text-sm`}>
                              {PROMPT_OPTIONS.emotions.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                         </div>
                         <div>
                            <label className={`block text-xs uppercase ${s.textSub} mb-1`}>Gerakan Kamera</label>
                            <select value={videoData.scene.camera} onChange={e => setVideoData({...videoData, scene: {...videoData.scene, camera: e.target.value}})} className={`w-full ${s.inputBg} border ${s.inputBorder} ${s.inputText} p-2 text-sm`}>
                              {PROMPT_OPTIONS.movements.map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                         </div>
                       </div>
                       
                       <input placeholder="Efek Tambahan (Opsional)" value={videoData.scene.effects} onChange={e => setVideoData({...videoData, scene: {...videoData.scene, effects: e.target.value}})} className={`w-full p-2 ${s.inputBg} border ${s.inputBorder} ${s.inputText} text-sm`} />

                    </div>
                 </div>

                 <CyberButton onClick={handleGenerate} disabled={isGenerating} className="w-full py-4 text-lg relative overflow-hidden" variant="green">
                    {isGenerating ? (
                      <>
                        <div className="absolute inset-0 z-0">
                           <div className="absolute bottom-0 left-0 w-full bg-green-500/50" style={{ animation: 'fillWater 2.5s ease-in-out infinite' }}>
                              <div className="absolute -top-3 left-[-10%] w-[120%] h-6 bg-green-500/50 rounded-[100%] animate-pulse"></div>
                           </div>
                        </div>
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                          {t.buttons.processing}
                        </span>
                        <style>{`
                          @keyframes fillWater {
                            0% { height: 0%; }
                            50% { height: 100%; }
                            100% { height: 100%; }
                          }
                        `}</style>
                      </>
                    ) : t.buttons.generatePrompt}
                 </CyberButton>
                 
                 {error && <div className="text-red-500 font-bold border border-red-500 p-2 bg-red-900/20">{error}</div>}

                 {/* Outputs */}
                 {promptOutput && (
                   <div className="space-y-6 pt-8 border-t border-cyber-gray">
                      {[
                        { label: "Optimized English Prompt (Veo 3)", val: promptOutput.english },
                        { label: "Optimized Indonesian Prompt", val: promptOutput.indonesian },
                        { label: "Simple Prompt", val: promptOutput.simple },
                        { label: "JSON Format", val: promptOutput.json, font: "font-mono text-xs" }
                      ].map((item, i) => (
                        <div key={i}>
                          <div className="flex justify-between items-center mb-2">
                             <label className="text-cyber-yellow font-display uppercase text-sm">{item.label}</label>
                             <button onClick={() => navigator.clipboard.writeText(item.val)} className="text-gray-400 hover:text-white"><ClipboardDocumentCheckIcon className="w-5 h-5"/></button>
                          </div>
                          <textarea 
                             readOnly={false}
                             value={item.val}
                             onChange={(e) => {
                               // Allow editing output locally
                               if (item.label.includes("English")) setPromptOutput({...promptOutput, english: e.target.value});
                               if (item.label.includes("Indonesian")) setPromptOutput({...promptOutput, indonesian: e.target.value});
                               if (item.label.includes("Simple")) setPromptOutput({...promptOutput, simple: e.target.value});
                               if (item.label.includes("JSON")) setPromptOutput({...promptOutput, json: e.target.value});
                             }}
                             className={`w-full h-32 ${s.inputBg} border ${s.inputBorder} p-3 ${s.inputText} focus:border-cyber-cyan outline-none ${item.font || "text-sm"}`}
                          />
                        </div>
                      ))}
                   </div>
                 )}

              </div>
            </div>
          ) : (
            // --- PHOTO GENERATOR LAYOUT (Split Screen) ---
            <div className={`flex flex-col xl:flex-row gap-6 pb-20`}>
               
               {/* Config/Input Panel */}
               <div className="w-full xl:w-[400px] flex-shrink-0 space-y-6">
                  {/* Upload Section - Dynamic based on Mode */}
                  <div className={`space-y-4 p-4 rounded-xl ${s.cardBg} border ${s.cardBorder}`}>
                    <h2 className="text-cyber-cyan font-display text-lg border-l-4 border-cyber-pink pl-3 uppercase">{t.sections.input}</h2>
                    
                    {mode === AppMode.PRODUCT ? (
                      // Poster Maker Specific Uploads
                      <div className="space-y-6">
                        {/* Product */}
                        <div>
                          <p className={`text-xs ${s.textSub} mb-2 uppercase`}>{t.poster.headers.products}</p>
                          <ImageUploader 
                            currentImages={productImages} 
                            onImagesSelected={setProductImages} 
                            maxImages={4} 
                            label="+"
                          />
                        </div>
                        {/* Logo */}
                        <div>
                          <p className={`text-xs ${s.textSub} mb-2 uppercase`}>{t.poster.headers.logo}</p>
                          <ImageUploader 
                            currentImages={logoImages} 
                            onImagesSelected={setLogoImages} 
                            maxImages={1} 
                            label="+"
                          />
                        </div>
                        {/* Reference (Optional) */}
                        <div>
                          <p className={`text-xs ${s.textSub} mb-2 uppercase`}>{t.poster.headers.reference}</p>
                          <ImageUploader 
                            currentImages={inputImages} 
                            onImagesSelected={setInputImages} 
                            maxImages={1} 
                            label="+"
                          />
                        </div>
                      </div>
                    ) : (
                      // Standard Upload (Character/Blender)
                      <>
                        <p className={`text-xs ${s.textSub} mb-2`}>
                          {mode === AppMode.BLENDER 
                            ? t.upload.multi 
                            : mode === AppMode.CHARACTER
                            ? t.upload.singleOptional
                            : t.upload.single}
                        </p>
                        <ImageUploader 
                          currentImages={inputImages} 
                          onImagesSelected={setInputImages} 
                          maxImages={getMaxImages()} 
                          label={t.upload.button}
                        />
                      </>
                    )}
                  </div>

                  {/* Configuration Section (Shared + Specifics) */}
                  <div className={`space-y-4 animate-in slide-in-from-left duration-300 p-4 rounded-xl ${s.cardBg} border ${s.cardBorder}`}>
                      {/* Poster Inputs */}
                      {mode === AppMode.PRODUCT && (
                        <>
                          <h2 className="text-cyber-cyan font-display text-lg border-l-4 border-cyber-green pl-3 uppercase">{t.poster.headers.details}</h2>
                          <div>
                            <label className={`text-xs ${s.textSub} uppercase tracking-widest block mb-2`}>{t.poster.labels.theme}</label>
                            <input 
                                type="text"
                                value={posterTheme}
                                onChange={(e) => setPosterTheme(e.target.value)}
                                placeholder={t.poster.labels.themePlaceholder}
                                className={`w-full ${s.inputBg} border ${s.inputBorder} p-3 ${s.inputText} focus:outline-none text-sm placeholder-gray-500 font-bold`}
                              />
                          </div>
                          <div>
                            <label className={`text-xs ${s.textSub} uppercase tracking-widest block mb-2`}>{t.poster.labels.text}</label>
                            <input 
                                type="text"
                                value={posterText}
                                onChange={(e) => setPosterText(e.target.value)}
                                placeholder={t.poster.labels.textPlaceholder}
                                className={`w-full ${s.inputBg} border ${s.inputBorder} p-3 ${s.inputText} focus:outline-none text-sm placeholder-gray-500 font-mono`}
                              />
                          </div>
                        </>
                      )}

                      {/* Blender/Character Config Header if applicable */}
                      {(mode === AppMode.BLENDER || mode === AppMode.CHARACTER) && (
                        <h2 className="text-cyber-cyan font-display text-lg border-l-4 border-cyber-green pl-3 uppercase">{t.sections.config}</h2>
                      )}

                      {/* Aspect Ratio (For ALL modes) */}
                      {(mode === AppMode.BLENDER || mode === AppMode.CHARACTER) && (
                      <div>
                        <label className={`text-xs ${s.textSub} uppercase tracking-widest block mb-2`}>{t.config.ratio}</label>
                        <select 
                          value={aspectRatio}
                          onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                          className={`w-full ${s.inputBg} border ${s.inputBorder} p-2 ${s.inputText} focus:border-cyber-cyan focus:outline-none text-sm`}
                        >
                          <option value="1:1">{t.config.ratios["1:1"]}</option>
                          <option value="16:9">{t.config.ratios["16:9"]}</option>
                          <option value="9:16">{t.config.ratios["9:16"]}</option>
                          <option value="4:3">{t.config.ratios["4:3"]}</option>
                          <option value="3:4">{t.config.ratios["3:4"]}</option>
                        </select>
                      </div>
                      )}
                      {mode === AppMode.PRODUCT && (
                        <div>
                        <label className={`text-xs ${s.textSub} uppercase tracking-widest block mb-2`}>{t.config.ratio}</label>
                        <select 
                          value={aspectRatio}
                          onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                          className={`w-full ${s.inputBg} border ${s.inputBorder} p-2 ${s.inputText} focus:border-cyber-cyan focus:outline-none text-sm`}
                        >
                          <option value="3:4">{t.config.ratios["3:4"]}</option>
                          <option value="9:16">{t.config.ratios["9:16"]}</option>
                          <option value="1:1">{t.config.ratios["1:1"]}</option>
                          <option value="4:3">{t.config.ratios["4:3"]}</option>
                          <option value="16:9">{t.config.ratios["16:9"]}</option>
                        </select>
                        </div>
                      )}

                      {/* Blender Poses */}
                      {mode === AppMode.BLENDER && (
                        <div>
                            <label className={`text-xs ${s.textSub} uppercase tracking-widest block mb-2`}>{t.config.pose}</label>
                            <div className="grid grid-cols-2 gap-2">
                              {poses.map((p) => (
                                <button
                                  key={p.key}
                                  onClick={() => setSelectedPose(p.key)}
                                  className={`text-xs p-2 border transition-all text-left truncate ${
                                    selectedPose === p.key 
                                    ? 'border-cyber-green bg-cyber-green/20 text-white' 
                                    : `${s.inputBorder} ${s.textSub} hover:border-cyber-green hover:text-white`
                                  }`}
                                >
                                  {p.label}
                                </button>
                              ))}
                            </div>
                            
                            {selectedPose === 'custom' && (
                              <input 
                                type="text"
                                value={customPose}
                                onChange={(e) => setCustomPose(e.target.value)}
                                placeholder={t.config.customPosePlaceholder}
                                className={`w-full mt-2 ${s.inputBg} border border-cyber-green p-2 ${s.inputText} focus:outline-none text-sm placeholder-gray-500`}
                              />
                            )}
                        </div>
                      )}

                      {/* Character Art Styles */}
                      {mode === AppMode.CHARACTER && (
                        <div>
                            <label className={`text-xs ${s.textSub} uppercase tracking-widest block mb-2`}>{t.config.artStyle}</label>
                            <div className="grid grid-cols-2 gap-2">
                              {styles.map((sItem) => (
                                <button
                                  key={sItem.key}
                                  onClick={() => setSelectedArtStyle(sItem.key)}
                                  className={`text-xs p-2 border transition-all text-left truncate ${
                                    selectedArtStyle === sItem.key 
                                    ? 'border-cyber-pink bg-cyber-pink/20 text-white' 
                                    : `${s.inputBorder} ${s.textSub} hover:border-cyber-pink hover:text-white`
                                  }`}
                                >
                                  {sItem.label}
                                </button>
                              ))}
                            </div>
                            
                            {selectedArtStyle === 'custom' && (
                              <input 
                                type="text"
                                value={customArtStyle}
                                onChange={(e) => setCustomArtStyle(e.target.value)}
                                placeholder={t.config.customStylePlaceholder}
                                className={`w-full mt-2 ${s.inputBg} border border-cyber-pink p-2 ${s.inputText} focus:outline-none text-sm placeholder-gray-500`}
                              />
                            )}
                        </div>
                      )}
                  </div>

                  {/* Directives Section */}
                  <div className={`space-y-4 p-4 rounded-xl ${s.cardBg} border ${s.cardBorder}`}>
                    
                      <>
                        <h2 className="text-cyber-cyan font-display text-lg border-l-4 border-cyber-pink pl-3 uppercase">{t.sections.directives}</h2>
                        <textarea
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder={t.placeholders[mode]}
                          className={`w-full h-32 ${s.inputBg} border ${s.inputBorder} p-4 ${s.inputText} focus:border-cyber-cyan focus:outline-none focus:ring-1 focus:ring-cyber-cyan font-mono text-sm`}
                        />
                        <div className="flex flex-wrap gap-2">
                          {t.presets[mode].map((preset, idx) => (
                            <button 
                              key={idx}
                              onClick={() => setPrompt(preset)}
                              className={`text-xs border ${s.inputBorder} px-2 py-1 hover:bg-cyber-gray ${s.textSub} hover:text-white transition-colors text-left`}
                            >
                              {preset}
                            </button>
                          ))}
                        </div>
                      </>
                    

                    {error && (
                      <div className="p-3 border border-red-500 bg-red-900/20 text-red-400 text-sm font-bold">
                        {t.status.error}: {error}
                      </div>
                    )}

                    <CyberButton 
                      onClick={handleGenerate} 
                      disabled={isGenerating}
                      className="w-full flex justify-center items-center gap-2 py-4 text-lg"
                      variant={mode === AppMode.CHARACTER ? 'pink' : mode === AppMode.BLENDER ? 'green' : 'cyan'}
                    >
                      {isGenerating ? (
                        <>
                          <span className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full"></span>
                          {t.buttons.processing}
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="w-5 h-5" />
                          {t.buttons.initialize} {mode}
                        </>
                      )}
                    </CyberButton>
                  </div>
               </div>

               {/* Output Section (Photo) */}
               <div className="flex-1">
                  <div className={`h-full min-h-[500px] border-2 ${s.cardBorder} ${s.cardBg} relative flex flex-col items-center justify-center p-4 cyber-border transition-colors duration-500`}>
                    
                    {/* Corner Accents */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyber-cyan"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyber-cyan"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyber-cyan"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyber-cyan"></div>

                    {resultImage ? (
                      <div className="w-full h-full flex flex-col items-center animate-in fade-in duration-700">
                        <img 
                          src={resultImage} 
                          alt="Generated Output" 
                          className={`max-h-[80vh] w-auto object-contain shadow-2xl shadow-cyber-cyan/20 border ${s.cardBorder}`}
                        />
                        <div className="mt-6 flex gap-4">
                          <a 
                            href={resultImage} 
                            download={`fannstudio-${mode.toLowerCase()}-${Date.now()}.png`}
                            className="flex items-center gap-2 px-6 py-2 bg-cyber-cyan text-black font-bold font-display uppercase hover:bg-white transition-colors"
                          >
                            <ArrowDownTrayIcon className="w-5 h-5" />
                            {t.buttons.save}
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-4 opacity-50">
                        {isGenerating ? (
                            <div className="flex flex-col items-center gap-4">
                              <div className="w-24 h-24 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin"></div>
                              <div className="text-2xl font-display text-cyber-cyan animate-pulse">{t.status.active}</div>
                              <div className="font-mono text-xs text-cyber-pink">{t.status.constructing}</div>
                            </div>
                        ) : (
                          <>
                            <div className={`w-20 h-20 border ${s.headerBorder} mx-auto flex items-center justify-center text-4xl ${s.textSub}`}>
                                ?
                            </div>
                            <p className={`font-display tracking-widest text-xl ${s.textHeading}`}>{t.status.awaiting}</p>
                            <p className={`text-sm font-mono ${s.textSub}`}>{t.status.awaitingDesc}</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
               </div>
            </div>
          )}

          </div>
        </main>
      </div>

    </div>
  );
};

export default App;
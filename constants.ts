import { AppMode, Language } from "./types";

export const TRANSLATIONS = {
  en: {
    appTitle: "FANN",
    appTitleSuffix: "STUDIO",
    subtitle: "GEMINI.NANO.BANANA",
    sections: {
      module: "Select Module",
      input: "Input Data",
      config: "Configuration",
      directives: "Directives",
      catPhoto: "Photo Generator",
      catPrompt: "Prompt Generator"
    },
    modules: {
      [AppMode.PRODUCT]: {
        title: "Poster Maker",
        desc: "Professional Design & Layout"
      },
      [AppMode.CHARACTER]: {
        title: "Character Lab",
        desc: "Avatar & Concept Gen"
      },
      [AppMode.BLENDER]: {
        title: "Fusion Drive",
        desc: "Multi-Image Blending (2-4)"
      },
      [AppMode.PROMPT_VIDEO]: {
        title: "Video Prompt Engine",
        desc: "For Veo 3, Sora & More"
      }
    },
    poster: {
      headers: {
        products: "Product Images (Max 4)",
        logo: "Brand Logo (Optional)",
        reference: "Style Reference (Optional)",
        details: "Poster Details"
      },
      labels: {
        theme: "Main Theme",
        text: "Text Content",
        themePlaceholder: "e.g., Summer Sale, Cyberpunk City Launch...",
        textPlaceholder: "e.g., '50% OFF', 'COMING SOON'..."
      }
    },
    upload: {
      single: "Upload a reference image.",
      singleOptional: "Upload reference (Optional).",
      multi: "Upload 2 to 4 images to blend.",
      button: "Upload Input",
      count: "({current}/{max})"
    },
    config: {
      ratio: "Aspect Ratio",
      pose: "Model Pose",
      artStyle: "Art Style",
      customPosePlaceholder: "Describe the custom pose...",
      customStylePlaceholder: "Describe art style...",
      ratios: {
        "1:1": "Square (1:1)",
        "16:9": "Landscape (16:9)",
        "9:16": "Portrait (9:16)",
        "4:3": "Standard (4:3)",
        "3:4": "Tall (3:4)"
      },
      poses: {
        none: "No Specific Pose",
        standing_basic: "Casual Standing",
        hands_hips: "Hands on Hips",
        leaning: "Leaning on Wall",
        walking_cam: "Walking to Camera",
        sitting_stool: "High Stool Sit",
        over_shoulder: "Over-the-Shoulder",
        hand_face: "Hand on Face",
        crossed_legs: "Crossed Legs Sit",
        custom: "Custom Pose..."
      },
      styles: {
        none: "No Specific Style",
        realistic: "Realistic / Photorealistic",
        cartoon: "Cartoon / Toon",
        comic: "Comic Book",
        anime: "Anime / Manga",
        render3d: "3D Render",
        pixel: "Pixel Art",
        oil: "Oil Painting",
        cyberpunk: "Cyberpunk Aesthetic",
        custom: "Custom Style..."
      }
    },
    placeholders: {
      [AppMode.PRODUCT]: "Describe the poster theme (e.g., sci-fi movie, concert event, minimalist ad)...",
      [AppMode.CHARACTER]: "Describe the character details (e.g., cyberpunk samurai)...",
      [AppMode.BLENDER]: "How should these images be combined? (Optional additional details)",
      [AppMode.PROMPT_VIDEO]: ""
    },
    buttons: {
      initialize: "INITIALIZE",
      processing: "PROCESSING...",
      save: "Save Artifact",
      generatePrompt: "GENERATE PROMPT"
    },
    status: {
      awaiting: "AWAITING INPUT",
      awaitingDesc: "Configure parameters and run the generation protocol.",
      active: "NEURAL NETWORK ACTIVE",
      constructing: "Constructing pixels...",
      error: "ERROR"
    },
    prompts: {
      system: {
        [AppMode.PRODUCT]: "You are an expert graphic designer and poster artist. Your task is to take a raw image and transform it into a stunning professional poster design with high visual impact.",
        [AppMode.CHARACTER]: "You are a concept artist and character designer.",
        [AppMode.BLENDER]: "You are a surrealist digital artist expert at photobashing and blending.",
        [AppMode.PROMPT_VIDEO]: "You are an expert AI Video Prompt Engineer specializing in Google Veo 3 and Sora. Your task is to take structured video production data and compile it into highly optimized prompts."
      },
      prefix: {
        [AppMode.PRODUCT]: "Create a professional poster design. ",
        [AppMode.CHARACTER]: "Turn the person in this photo into a character based on these instructions: ",
        [AppMode.BLENDER]: "Seamlessly blend these images into a single cohesive artwork. ",
        [AppMode.PROMPT_VIDEO]: ""
      },
      prefixNoImage: {
        [AppMode.CHARACTER]: "Create a high-quality character illustration based on these instructions: "
      },
      suffix: {
        [AppMode.PRODUCT]: " Ensure a striking composition, bold visual style, and professional poster aesthetic. Make it eye-catching and thematic, suitable for print or digital display.",
        [AppMode.CHARACTER]: " Keep facial features recognizable if provided. Apply the requested style extensively. High quality, detailed.",
        [AppMode.BLENDER]: " Ensure lighting and perspective match consistently across the blended result.",
        [AppMode.PROMPT_VIDEO]: ""
      }
    },
    presets: {
      [AppMode.PRODUCT]: ["Sci-fi Movie Poster", "Music Festival Poster", "Minimalist Product Ad", "Retro Travel Poster"],
      [AppMode.CHARACTER]: ["Cyborg Cyberpunk", "Fantasy Elf Warrior", "Noir Detective", "Space Marine"],
      [AppMode.BLENDER]: ["Merge into a surreal landscape", "Create a double exposure effect", "Combine into a movie poster", "Cybernetic fusion"],
      [AppMode.PROMPT_VIDEO]: []
    },
    errors: {
      minImages: (min: number) => `Please upload at least ${min} image${min > 1 ? 's' : ''}.`,
      noPrompt: "Please enter a prompt instruction.",
      generic: "Failed to generate image. Try again.",
      missingTheme: "Please enter the main theme for the poster.",
      missingProduct: "Please upload at least one product image."
    }
  },
  id: {
    appTitle: "FANN",
    appTitleSuffix: "STUDIO",
    subtitle: "GEMINI.NANO.BANANA",
    sections: {
      module: "Pilih Modul",
      input: "Data Input",
      config: "Konfigurasi",
      directives: "Instruksi",
      catPhoto: "Foto Generator",
      catPrompt: "Prompt Generator"
    },
    modules: {
      [AppMode.PRODUCT]: {
        title: "Pembuat Poster",
        desc: "Desain & Layout Profesional"
      },
      [AppMode.CHARACTER]: {
        title: "Lab Karakter",
        desc: "Avatar & Konsep"
      },
      [AppMode.BLENDER]: {
        title: "Mesin Fusi",
        desc: "Penggabungan Gambar (2-4)"
      },
      [AppMode.PROMPT_VIDEO]: {
        title: "Aplikasi Prompt Generator",
        desc: "Untuk Veo 3, Sora & Lainnya"
      }
    },
    poster: {
      headers: {
        products: "Gambar Produk (Max 4)",
        logo: "Logo Brand (Opsional)",
        reference: "Referensi Gaya (Opsional)",
        details: "Detail Poster"
      },
      labels: {
        theme: "Tema Besar",
        text: "Teks / Kata",
        themePlaceholder: "cth: Diskon Musim Panas, Peluncuran Teknologi...",
        textPlaceholder: "cth: 'Diskon 50%', 'Produk Baru'..."
      }
    },
    upload: {
      single: "Unggah gambar referensi.",
      singleOptional: "Unggah referensi (Opsional).",
      multi: "Unggah 2-4 gambar untuk digabung.",
      button: "Unggah Input",
      count: "({current}/{max})"
    },
    config: {
      ratio: "Ukuran Resolusi",
      pose: "Pose Model",
      artStyle: "Gaya Seni",
      customPosePlaceholder: "Jelaskan pose yang diinginkan...",
      customStylePlaceholder: "Jelaskan gaya seni...",
      ratios: {
        "1:1": "Kotak (1:1)",
        "16:9": "Lanskap (16:9)",
        "9:16": "Potret (9:16)",
        "4:3": "Standar (4:3)",
        "3:4": "Tinggi (3:4)"
      },
      poses: {
        none: "Tanpa Pose Khusus",
        standing_basic: "Berdiri Santai",
        hands_hips: "Tangan di Pinggang",
        leaning: "Bersandar",
        walking_cam: "Jalan ke Kamera",
        sitting_stool: "Duduk di Kursi",
        over_shoulder: "Menoleh Belakang",
        hand_face: "Tangan di Wajah",
        crossed_legs: "Duduk Menyilang",
        custom: "Pose Lainnya..."
      },
      styles: {
        none: "Tanpa Gaya Khusus",
        realistic: "Realistis / Fotorealistik",
        cartoon: "Kartun",
        comic: "Buku Komik",
        anime: "Anime / Manga",
        render3d: "Render 3D",
        pixel: "Pixel Art",
        oil: "Lukisan Minyak",
        cyberpunk: "Estetika Cyberpunk",
        custom: "Lainnya..."
      }
    },
    placeholders: {
      [AppMode.PRODUCT]: "Jelaskan tema poster (cth: film sci-fi, acara konser, iklan minimalis)...",
      [AppMode.CHARACTER]: "Jelaskan detail karakter (cth: samurai cyberpunk)...",
      [AppMode.BLENDER]: "Bagaimana gambar-gambar ini harus digabungkan? (Opsional detail tambahan)",
      [AppMode.PROMPT_VIDEO]: ""
    },
    buttons: {
      initialize: "INISIALISASI",
      processing: "MEMPROSES...",
      save: "Simpan Artefak",
      generatePrompt: "GENERATE PROMPT"
    },
    status: {
      awaiting: "MENUNGGU INPUT",
      awaitingDesc: "Konfigurasi parameter dan jalankan protokol.",
      active: "JARINGAN SARAF AKTIF",
      constructing: "Menyusun piksel...",
      error: "ERROR"
    },
    prompts: {
      system: {
        [AppMode.PRODUCT]: "Anda adalah desainer grafis dan seniman poster ahli. Tugas Anda adalah mengambil gambar mentah dan mengubahnya menjadi desain poster profesional yang menakjubkan dengan dampak visual yang tinggi.",
        [AppMode.CHARACTER]: "Anda adalah seniman konsep dan perancang karakter.",
        [AppMode.BLENDER]: "Anda adalah ahli seniman digital surealis dalam photobashing dan blending.",
        [AppMode.PROMPT_VIDEO]: "Anda adalah Ahli Prompt Video AI yang berspesialisasi dalam Google Veo 3 dan Sora. Tugas Anda adalah mengambil data produksi video terstruktur dan menyusunnya menjadi prompt yang sangat optimal."
      },
      prefix: {
        [AppMode.PRODUCT]: "Buat desain poster profesional. ",
        [AppMode.CHARACTER]: "Ubah orang dalam foto ini menjadi karakter berdasarkan instruksi ini: ",
        [AppMode.BLENDER]: "Gabungkan gambar-gambar ini dengan mulus menjadi satu karya seni yang padu. ",
        [AppMode.PROMPT_VIDEO]: ""
      },
      prefixNoImage: {
        [AppMode.CHARACTER]: "Buat ilustrasi karakter berkualitas tinggi berdasarkan instruksi ini: "
      },
      suffix: {
        [AppMode.PRODUCT]: " Pastikan komposisi yang mencolok, gaya visual yang berani, dan estetika poster profesional. Buatlah menarik perhatian dan tematik, cocok untuk cetak atau tampilan digital.",
        [AppMode.CHARACTER]: " Pertahankan fitur wajah agar tetap dapat dikenali jika foto disediakan. Terapkan gaya seni yang diminta secara ekstensif. Kualitas tinggi, detail.",
        [AppMode.BLENDER]: " Pastikan pencahayaan dan perspektif cocok secara konsisten di seluruh hasil gabungan.",
        [AppMode.PROMPT_VIDEO]: ""
      }
    },
    presets: {
      [AppMode.PRODUCT]: ["Poster Film Sci-fi", "Poster Festival Musik", "Iklan Produk Minimalis", "Poster Travel Retro"],
      [AppMode.CHARACTER]: ["Cyborg Cyberpunk", "Prajurit Elf Fantasi", "Detektif Noir", "Marinir Luar Angkasa"],
      [AppMode.BLENDER]: ["Gabungkan ke lanskap surealis", "Buat efek eksposur ganda", "Gabungkan menjadi poster film", "Fusi sibernetik"],
      [AppMode.PROMPT_VIDEO]: []
    },
    errors: {
      minImages: (min: number) => `Harap unggah setidaknya ${min} gambar.`,
      noPrompt: "Harap masukkan instruksi prompt.",
      generic: "Gagal menghasilkan gambar. Coba lagi.",
      missingTheme: "Harap masukkan tema utama poster.",
      missingProduct: "Harap unggah setidaknya satu gambar produk."
    }
  }
};

export const PROMPT_OPTIONS = {
  types: ["Cinematic Film", "Commercial/Ad", "Music Video", "Documentary", "Animation", "Social Media Reel", "Drone Footage", "Tutorial"],
  durations: ["5 Seconds", "10 Seconds", "15 Seconds", "30 Seconds", "60 Seconds"],
  visualStyles: ["Cyberpunk", "Realistic", "Anime", "Pixar/Disney 3D", "Noir", "Vintage 80s", "Futuristic", "Surreal", "Minimalist"],
  audioStyles: ["No Audio", "Cinematic Score", "Upbeat Pop", "Ambient Nature", "Voiceover Only", "Intense Action"],
  languages: ["Indonesian", "English", "Japanese", "Korean", "Javanese", "Sundanese"],
  emotions: ["Happy/Joyful", "Tense/Suspense", "Sad/Melancholic", "Energetic", "Calm/Peaceful", "Mysterious"],
  movements: ["Static", "Pan Left", "Pan Right", "Zoom In", "Zoom Out", "Tracking Shot", "Drone Flyover", "Handheld Shake"],
  resolutions: ["1080p", "4K"]
};

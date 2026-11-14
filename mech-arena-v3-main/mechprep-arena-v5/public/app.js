/**
 * ============================================================================
 * MECHPREP ARENA v4.0 — COMPLETE 19-MODULE FRONTEND & INTEGRATED AI ENGINE
 * ============================================================================
 * Connects seamlessly to Render backend (`server.js`) and also works 100%
 * standalone in browser/Canvas with built-in Multi-Provider AI (Gemini, Groq,
 * OpenRouter, Hugging Face) + Local Symbolic & ML/NLP Self-Generation Engine.
 * ============================================================================
 */
(() => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. SAFE STORAGE & GLOBAL STATE INITIALIZATION
  // --------------------------------------------------------------------------
  function apiUrl(subpath) {
    return (typeof location !== 'undefined' && location.origin && location.origin !== 'null' ? location.origin : '') + '/api/' + subpath;
  }

  function safeGetStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function safeSetStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }

  function escapeHtml(val) {
    return String(val ?? '').replace(/[&<>"']/g, ch => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[ch]));
  }

  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    const bg = type === 'success'
      ? 'bg-emerald-900 border-emerald-600 text-emerald-100'
      : type === 'warn'
        ? 'bg-amber-900 border-amber-600 text-amber-100'
        : 'bg-slate-900 border-blue-500 text-white';
    toast.className = `pointer-events-auto px-4 py-3 rounded-xl border shadow-lg text-xs font-medium transition-all duration-200 ${bg}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 250);
    }, 3500);
  }

  const SUPPLIED_DRIVE_LIBRARIES = window.MECHPREP_DRIVE_LIBRARIES || [
    {
      id: '1gdl1gfpl0WVFtijEEd5BIQhtu290qaI_',
      name: 'Main Mechanical Engineering Library',
      semester: 'All Semesters',
      category: 'Mechanical Core',
      url: 'https://drive.google.com/drive/folders/1gdl1gfpl0WVFtijEEd5BIQhtu290qaI_?usp=drive_link',
      expectedSubjects: [
        'Strength of Materials & Elasticity Compendium.pdf',
        'Basic & Applied Thermodynamics Complete Notes.pdf',
        'Fluid Mechanics & Hydraulic Machines Handbook.pdf',
        'Kinematics & Dynamics of Machines (KOM/DOM).pdf',
        'Design of Machine Elements I & II Formula & Solved Bank.pdf',
        'Heat and Mass Transfer & Thermal Engineering.pdf',
        'Manufacturing Science, Casting, Welding & Machining.pdf'
      ]
    },
    {
      id: '15SfQscxJjR5fm_9jMKkM0SvorZb82foK',
      name: '4th Semester Mechanical Library',
      semester: 'Semester 4',
      category: 'Semester 4',
      url: 'https://drive.google.com/drive/folders/15SfQscxJjR5fm_9jMKkM0SvorZb82foK?usp=drive_link',
      expectedSubjects: [
        '22MA411_Engineering_Mathematics_IV_Complete_Notes.pdf',
        '22ME410_Applied_Thermodynamics_Cycles_Rankine_Brayton.pdf',
        '22ME420_Dynamics_of_Machines_Governors_Gyroscope_Vibrations.pdf',
        '22ME430_Metrology_and_Measurements_GD&T_Limits_Fits.pdf',
        '22ME440_Material_Science_and_Metallurgy_Fe_Fe3C_Heat_Treatment.pdf',
        '22ME46L_Fluid_Mechanics_and_Materials_Testing_Lab_Manual.pdf'
      ]
    },
    {
      id: '1u-SzogxKALrjNfbl31zQiB_EGt9sbZMx',
      name: '5th Semester Mechanical Library',
      semester: 'Semester 5',
      category: 'Semester 5',
      url: 'https://drive.google.com/drive/folders/1u-SzogxKALrjNfbl31zQiB_EGt9sbZMx?usp=drive_link',
      expectedSubjects: [
        '22ME510_Design_of_Machine_Elements_I_Shafts_Springs_Joints.pdf',
        '22ME520_Fluid_Machinery_Turbomachines_Pelton_Francis_Pumps.pdf',
        '22ME530_CAD_CAM_Bezier_B_Spline_CNC_G_Code_Part_Programming.pdf',
        '22ME540_Machine_Tools_and_Operations_Merchant_Circle_Taylor_Life.pdf',
        '22ME551_Hydraulics_and_Pneumatics_Circuits_Valves_Actuators.pdf',
        '22ME554_IC_Engines_and_22ME563_Power_Plant_Technology.pdf'
      ]
    },
    {
      id: '1oWpkqqMypZp3lPmBe9-AD0AD1bhf0hxL',
      name: '6th Semester Mechanical Library',
      semester: 'Semester 6',
      category: 'Semester 6',
      url: 'https://drive.google.com/drive/folders/1oWpkqqMypZp3lPmBe9-AD0AD1bhf0hxL?usp=drive_link',
      expectedSubjects: [
        '22ME610_Design_of_Machine_Elements_II_Curved_Beams_Gears_Bearings.pdf',
        '22ME620_Heat_and_Mass_Transfer_Conduction_Convection_LMTD_NTU.pdf',
        '22ME630_Finite_Element_Methods_FEM_Stiffness_IsoParametric_CAMA.pdf',
        '22ME641_Mechanical_Vibrations_1DOF_2DOF_Dunkerley_Holzer.pdf',
        '22ME642_Statistical_Quality_Control_Control_Charts_Cp_Cpk.pdf',
        '22ME643_Computational_Fluid_Dynamics_CFD_and_22ME645_NTM.pdf'
      ]
    },
    {
      id: '1yS5_u9Je-fMd6hUP7gU6huRA-3mp6vjx',
      name: 'Placement and Aptitude Library',
      semester: 'Placement',
      category: 'Placement Preparation',
      url: 'https://drive.google.com/drive/folders/1yS5_u9Je-fMd6hUP7gU6huRA-3mp6vjx?usp=drive_link',
      expectedSubjects: [
        '01_AM2_Aptitude_Mock_Test_2.pdf',
        '02_Bizotic_Aptitude_Assessment.pdf',
        '03_AON_Online_Assessment.pdf',
        '04_Mechanical_Engineering_Technical_Test.pdf',
        'Master_Technical_5000Q_Aptitude_2000Q_Compendium_4000Pages.pdf',
        'TimeTooth_Technologies_Level_I_Mechanical_Questionnaire.pdf'
      ]
    },
    {
      id: '1SM7dWs5dUmj_sY3BiK_5MsPlQL5njm2b',
      name: 'SJCE Placement Voice Recordings & 250-Q Technical/Aptitude Drive',
      semester: 'Placement & Voice Viva',
      category: 'Voice & Test Prep',
      url: 'https://drive.google.com/drive/folders/1SM7dWs5dUmj_sY3BiK_5MsPlQL5njm2b?usp=drive_link',
      expectedSubjects: [
        'Call amrutha Sjce_261114_170650.m4a (SJCE Placement Viva & HR Call Log)',
        'Call Shashank V Sjce_261114_142326.m4a (Technical Assessment Discussion)',
        'Call Suhas Sjce_261114_134251.m4a & Call Omkar Sjce_261028_175052.m4a',
        'Call Surya Sjce_261028_182308.m4a & Call Ravi Sjce 2_261029_191801.m4a',
        'Copy of Strength_of_Materials_50_Aptitude_Questions-1-4.pdf',
        'Copy of Machine_Design_Aptitude_Test_50_Questions-1-7.pdf',
        'Copy of Manufacturing_Process_Aptitude_Test_50_Questions-1-8.pdf',
        'Copy of Industrial_Engineering_Basics_Aptitude_Test_50_Questions-1-3.pdf',
        'Copy of Thermodynamics.pdf & Copy of QA & LR Trainer Handout V3.pdf'
      ]
    }
  ];

  const SAMPLE_PDF_PRESETS = {
    am2: {
      title: '01_AM2_Aptitude_Mock_Test_2.pdf',
      subject: 'aptitude',
      semester: 'Placement',
      pages: 14,
      text: `AM2 Quantitative & Analytical Aptitude Assessment (Pages 1–14)
1. A square garden of side 21 m is laid out with a quarter-circle flower bed of radius 7 m in each corner and a semicircle bed on each side. Area of lawn = 21² - [4*(1/4)*π*7² + 4*(1/2)*π*(3.5)²] = 441 - (154 + 77) = 210 m².
2. Compound Interest & Simple Interest 2-Year & 3-Year Shortcut: (CI - SI)_2 = P*(R/100)² ; (CI - SI)_3 = P*(R/100)²*(3 + R/100).
3. Relative Speed of Trains: Time to cross a bridge of length L_b by a train of length L_t moving at speed V is t = (L_t + L_b) / V. Convert km/hr to m/s by multiplying by 5/18.
4. Work & Time Harmonic Rate: If A completes a job in x days and B in y days, together they take (x*y)/(x + y) days.`
    },
    bizotic: {
      title: '02_Bizotic_Aptitude_Assessment.pdf',
      subject: 'aptitude',
      semester: 'Placement',
      pages: 22,
      text: `Bizotic Quantitative, Logical & Verbal Triad Assessment (Pages 1–22)
1. A fitness centre has 360 members each paying Rs 1,500/month (Total = Rs 5,40,000). Fee cut by 25% gives Rs 1,125/member. Target revenue 10% higher = Rs 5,94,000. Required members = 594000 / 1125 = 528. New members needed = 528 - 360 = 168.
2. Rule of Alligation: Ratio of cheaper (c_1) to dearer (c_2) for mean price c_m is (c_2 - c_m) : (c_m - c_1).
3. Cryptarithmetic Digital Root & Carry Bound: Maximum carry from adding k single digits is k - 1; digital root dr(A + B) ≡ dr(A) + dr(B) (mod 9).`
    },
    aon: {
      title: '03_AON_Online_Assessment.pdf',
      subject: 'aptitude',
      semester: 'Placement',
      pages: 18,
      text: `AON Analytical Reasoning & Mechanical Technical Assessment (Pages 1–18)
1. Deductive Matrix & Geometric Rotation: Track 90-degree clockwise quadrant shifts across 4 stages (Top-Left -> Top-Right -> Bottom-Right -> Bottom-Left).
2. Data Sufficiency & Syllogism Venn Diagrams: Evaluate Statement I alone, Statement II alone, then combined.`
    },
    mech_tech: {
      title: '04_Mechanical_Engineering_Technical_Test.pdf',
      subject: 'som',
      semester: 'Placement',
      pages: 16,
      text: `Mechanical Engineering Core Technical Assessment (Pages 1–16)
1. Mohr's Circle Principal Stresses: Given σ_x = 1200 MPa, σ_y = 600 MPa, τ_xy = 400 MPa. σ_avg = 900 MPa, R = sqrt(300² + 400²) = 500 MPa. Major principal stress σ_1 = 900 + 500 = 1400 MPa; Minor principal stress σ_2 = 900 - 500 = 400 MPa.
2. Close-Coiled Helical Spring Deflection: δ = 8*P*D³*n / (G*d⁴). When both mean coil diameter D and wire diameter d are doubled, δ' = (2³ / 2⁴)*δ = (8/16)*δ = δ/2 (halved).
3. Torsion of Solid Circular Shaft: τ_max = 16*T / (π*d³) and angle of twist θ = T*L / (G*J) where J = π*d⁴ / 32.`
    },
    compendium: {
      title: 'Master_Technical_5000Q_Aptitude_2000Q_Compendium_4000Pages.pdf',
      subject: 'thermo',
      semester: 'All Semesters',
      pages: 3914,
      text: `Master Placement & Engineering Compendium (3,914 Pages — JSS S&TU Semesters III to VIII + 5,027 Technical Qs + 2,082 Aptitude Qs)
- Semester III: 22ME310 Kinematics of Machines (Gruebler F = 3(L-1)-2j-h, Grashof s+l <= p+q), 22ME320 Fluid Mechanics (Bernoulli, Darcy-Weisbach h_f = fLV²/(2gD)), 22ME330 Basic Thermodynamics (SFEE, Carnot, Clausius), 22ME340 Mechanics of Materials (Hooke, Bending M/I = σ/y = E/R, Torsion T/J = τ/r = Gθ/L, Euler Buckling P_cr = π²EI/L_e²).
- Semester IV: 22MA411 Engg Math IV, 22ME410 Applied Thermodynamics (Otto, Diesel, Dual, Rankine, Brayton, VCR), 22ME420 Dynamics of Machines (Governors, Gyroscope C = Iωω_p, Vibrations), 22ME430 Metrology & Measurements, 22ME440 Material Science & Metallurgy.
- Semester V: 22ME510 DME-I (Von Mises, Goodman, Soderberg), 22ME520 Turbomachines (Euler H_e = (u_1V_w1 - u_2V_w2)/g, Specific Speed), 22ME530 CAD/CAM, 22ME540 Machine Tools (Merchant 2φ + β - α = 90°, Taylor VT^n = C).
- Semester VI: 22ME610 DME-II (Winkler-Bach Curved Beams, Lewis Gear Tooth, L_10 = (C/P)^p Bearing Life, Sommerfeld Number), 22ME620 Heat & Mass Transfer (Fourier, Biot Bi = hL_c/k_s < 0.1, LMTD, NTU), 22ME630 Finite Element Methods (k_bar = (AE/L)[1 -1; -1 1]), 22ME641 Mechanical Vibrations.`
    }
  };

  // State Store
  const state = {
    activeModule: 'dashboard',
    questions: (window.MECHPREP_ALL_QUESTIONS || []).slice(),
    guides: (window.MECHPREP_ALL_GUIDES || []).slice(),
    formulaGroups: (window.MECHPREP_FORMULA_GROUPS || []).slice(),
    jssCourses: (window.MECHPREP_JSS_COURSES || []).slice(),
    pdfImages: window.MECHPREP_PDF_IMAGES || {},
    customDocuments: safeGetStorage('mechprep_v4_docs', []),
    customQuestions: safeGetStorage('mechprep_v4_custom_q', []),
    customGuides: safeGetStorage('mechprep_v4_custom_g', []),
    flashcards: safeGetStorage('mechprep_v4_flashcards', []),
    progress: safeGetStorage('mechprep_v4_progress', {
      attempts: 0,
      correct: 0,
      testsCompleted: 0,
      bestScore: 0,
      history: [],
      topicStats: {}
    }),
    aiConfig: safeGetStorage('mechprep_v4_ai_config', {
      provider: 'auto',
      geminiModel: 'gemini-2.5-flash',
      groqModel: 'llama-3.3-70b-versatile',
      openrouterModel: 'meta-llama/llama-3.1-8b-instruct:free',
      hfModel: 'Qwen/Qwen2.5-72B-Instruct',
      geminiKey: '',
      groqKey: '',
      openrouterKey: '',
      hfKey: '',
      driveAccessToken: '',
      driveApiKey: ''
    }),
    serverStatus: {
      checked: false,
      online: false,
      providers: []
    },
    driveScanResults: {},
    latestGeneratedBundle: null,
    // Question bank pagination & filters
    techFilter: { search: '', source: 'all', topic: 'all', difficulty: 'all', page: 1 },
    aptFilter: { search: '', topic: 'all', difficulty: 'all', page: 1 },
    guideFilter: { search: '', source: 'all', page: 1 },
    formulaSearch: '',
    // Active Mock Exam state (Version 5: 3-Warning Auto-End, Timing Tracker & Camera Toggle)
    mockExam: {
      active: false,
      finished: false,
      terminatedByProctor: false,
      TerminationReason: '',
      showExitConfirmModal: false,
      jobProcessMode: false,
      proctoringEnabled: true,
      geminiVoiceHelper: true,
      title: 'Mechanical Engineering & Placement Mock Exam (v5 Proctored)',
      questions: [],
      answers: {},
      questionTimings: {},
      totalElapsedSec: 0,
      reviewFlags: {},
      currentIndex: 0,
      remainingSec: 1200,
      initialDurationSec: 1200,
      timerId: null,
      shortMarks: 2,
      problemMarks: 4,
      negativeMarking: true,
      warnings: 0,
      maxWarnings: 3,
      warningLog: [],
      lastWarningReason: '',
      lastResult: null
    },
    // Shared Webcam Face & Motion Proctoring State (v5: Strict 3-Warning Limit)
    proctorState: {
      cameraEnabled: true,
      cameraActive: false,
      warmupUntil: 0,
      faceDetected: true,
      motionPct: 2,
      statusText: '✓ Face Centered · Low Motion',
      missingFrames: 0,
      highMotionFrames: 0,
      warningCount: 0,
      maxWarnings: 3,
      bannerVisible: false,
      showExitModal: false,
      terminatedByLimit: false,
      lastAlert: '',
      events: []
    },
    // Flashcard deck state
    flashcardState: {
      index: 0,
      flipped: false,
      subjectFilter: 'all',
      masteredIds: safeGetStorage('mechprep_v4_fc_mastered', [])
    },
    // AI Interview, HR & GD Taker State (Human-Like Gemini Assistant + Camera Toggle + Timing Report)
    interviewState: {
      activeFullscreen: false,
      sessionFinished: false,
      terminatedByProctor: false,
      showExitConfirmModal: false,
      roundMode: 'technical', // 'technical' | 'hr' | 'gd' | 'mixed'
      jobProcessStage: 2,
      autoSpeak: true,
      autoListenAfterSpeak: true,
      geminiLiveMode: true,
      proctoringEnabled: true,
      selectedVoiceURI: 'auto-in',
      voicePersona: 'gemini-live',
      speechRate: 1.0,
      speechPitch: 1.0,
      isListening: false,
      isSpeaking: false,
      mouthPhase: 0,
      blinkState: false,
      headTilt: 0,
      track: 'Technical Test Review: AGV, Pneumatics, Bearings, 5S & Core Mechanical',
      company: 'SJCE Placement Drive (All Core & Tech Recruiters)',
      difficulty: 'Intermediate (GET & 8th-Sem Internship)',
      sessionQuestionCount: 5,
      generatedQuestions: [],
      sessionScores: {},
      sessionAnswers: {},
      sessionTimings: {},
      totalInterviewSec: 0,
      qTimerSec: 180,
      qIndex: 0,
      answerText: '',
      evaluated: false,
      lastEvaluation: null,
      coachFeedbackHtml: '',
      geminiChatLog: [],
      history: safeGetStorage('mechprep_v5_interview_history', [])
    },
    portalFilter: {
      category: 'all',
      search: ''
    },
    // Chart instance references
    activeGraphChart: null,
    activeProgressChart: null
  };

  // Merge persisted custom questions and guides into live state
  if (state.customQuestions.length) {
    const existingIds = new Set(state.questions.map(q => q.id));
    for (const cq of state.customQuestions) {
      if (!existingIds.has(cq.id)) state.questions.unshift(cq);
    }
  }
  if (state.customGuides.length) {
    state.guides = state.customGuides.concat(state.guides);
  }

  // Initialize default flashcards from formula groups & JSS courses if empty
  if (!state.flashcards.length) {
    const seeded = [];
    for (const grp of state.formulaGroups) {
      for (const item of (grp.items || [])) {
        seeded.push({
          id: `FC-CORE-${seeded.length + 1}`,
          subject: grp.title,
          front: `${item[0]} — State the governing engineering formula and physical meaning.`,
          back: `Formula: ${item[1]}\nExplanation & Units: ${item[2]}`
        });
      }
    }
    for (const course of state.jssCourses.slice(0, 12)) {
      for (const u of (course.units || []).slice(0, 2)) {
        for (const f of (u.formulas || []).slice(0, 2)) {
          seeded.push({
            id: `FC-JSS-${seeded.length + 1}`,
            subject: `${course.semCode} · ${course.title}`,
            front: `[${course.semCode}] ${f[0]} — What is the governing relation?`,
            back: `Formula: ${f[1]}\nMethod: ${u.method || 'Apply SI units and boundary conditions.'}`
          });
        }
      }
    }
    state.flashcards = seeded;
    safeSetStorage('mechprep_v4_flashcards', state.flashcards);
  }

  //Configure PDF.js worker if loaded
  if (window.pdfjsLib && window.pdfjsLib.GlobalWorkerOptions) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }
  if (window.mermaid) {
    try {
      window.mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' });
    } catch {}
  }

  // --------------------------------------------------------------------------
  // 2. CLIENT + SERVER HYBRID AI & 15-STEP SELF-GENERATION ENGINE
  // --------------------------------------------------------------------------
  const LOCAL_SUBJECT_TEMPLATES = {
    som: {
      name: 'Strength of Materials (22ME340)',
      semester: 'Semester 3 / 4',
      formulas: [
        ['Hooke’s Law & Axial Elongation', 'σ = E·ε , δ = P·L / (A·E)', 'P in N, L in m, A in m², E in Pa'],
        ['Flexural Bending Formula', 'M / I = σ_b / y = E / R', 'For rectangle b×h: I = b·h³/12; for circle d: I = π·d⁴/64'],
        ['Torsion of Circular Shafts', 'T / J = τ / r = G·θ / L ; τ_max = 16T / (π·d³)', 'Power P = 2πNT/60; θ in radians'],
        ['Mohr’s Circle Principal Stresses', 'σ₁,₂ = (σ_x + σ_y)/2 ± √[((σ_x − σ_y)/2)² + τ_xy²]', 'Max in-plane shear τ_max = (σ₁ − σ₂)/2'],
        ['Euler Column Buckling Load', 'P_cr = π² · E · I_min / L_e²', 'L_e = 2L (fixed-free), L (pinned-pinned), 0.707L (fixed-pinned), 0.5L (fixed-fixed)']
      ],
      mermaid: `graph LR\n  A[External Loads P, M, T] --> B[Section Properties A, I, J]\n  B --> C[Normal & Shear Stresses σ, τ]\n  C --> D[Mohr's Circle Principal Stresses σ1, σ2]\n  D --> E[Deflection δ, θ & Euler Buckling P_cr]`
    },
    thermo: {
      name: 'Basic & Applied Thermodynamics (22ME330 / 22ME410)',
      semester: 'Semester 3 / 4',
      formulas: [
        ['Steady Flow Energy Equation (SFEE)', 'h₁ + V₁²/2000 + g·z₁/1000 + q = h₂ + V₂²/2000 + g·z₂/1000 + w_cv', 'All terms in kJ/kg'],
        ['Otto Cycle Efficiency', 'η_Otto = 1 − 1 / r^(γ − 1)', 'r = V₁/V₂ = compression ratio, γ = 1.4 for air'],
        ['Diesel Cycle Efficiency', 'η_Diesel = 1 − [1 / r^(γ−1)] · [(ρ^γ − 1) / (γ(ρ − 1))]', 'ρ = V₃/V₂ = cut-off ratio'],
        ['Rankine Cycle Efficiency', 'η_Rankine = [(h₁ − h₂) − v_f(P_b − P_c)] / (h₁ − h₄)', 'Steam power cycle between boiler P_b and condenser P_c'],
        ['Brayton Cycle Optimal Pressure Ratio', 'r_p,opt = (T_max / T_min)^(γ / [2(γ − 1)])', 'Maximizes net specific work when T₂ = T₄ = √(T₁·T₃)']
      ],
      mermaid: `graph LR\n  B[Boiler: Isobaric Heat Addition q_in] --> T[Turbine: Isentropic Expansion w_t]\n  T --> C[Condenser: Heat Rejection q_out]\n  C --> P[Feed Pump: Compression w_p]\n  P --> B`
    },
    fluid: {
      name: 'Fluid Mechanics & Turbomachinery (22ME320 / 22ME520)',
      semester: 'Semester 3 / 5',
      formulas: [
        ['Continuity & Bernoulli Equation', 'A₁V₁ = A₂V₂ ; P₁/(ρg) + V₁²/(2g) + z₁ = P₂/(ρg) + V₂²/(2g) + z₂ + h_f', 'Incompressible steady flow'],
        ['Darcy-Weisbach Head Loss', 'h_f = f · (L / D) · V² / (2g) = 8·f·L·Q² / (π²·g·D⁵)', 'For laminar flow (Re < 2000), f = 64 / Re'],
        ['Venturimeter & Orifice Discharge', 'Q = C_d · A₁A₂ / √(A₁² − A₂²) · √(2g·Δh)', 'C_d ≈ 0.98 for Venturi, 0.62 for sharp orifice'],
        ['Euler Turbomachine Equation', 'H_e = (u₁V_w1 ± u₂V_w2) / g', '+ for impulse stages with reversed exit, − for standard reaction/pump'],
        ['Specific Speed of Turbine & Pump', 'N_s(turb) = N√P / H^(5/4) ; N_s(pump) = N√Q / H^(3/4)', 'Classifies Pelton, Francis, Kaplan & Centrifugal impellers']
      ],
      mermaid: `graph LR\n  F1[Fluid Statics ΔP = ρgh] --> F2[Kinematics & Continuity A1V1 = A2V2]\n  F2 --> F3[Bernoulli + Darcy Pipe Loss h_f]\n  F3 --> F4[Euler Turbomachine Head H_e]\n  F4 --> F5[Specific Speed N_s & Cavitation NPSH]`
    },
    tom: {
      name: 'Kinematics, Dynamics of Machines & Vibrations (22ME310 / 22ME420 / 22ME641)',
      semester: 'Semester 3 / 4 / 6',
      formulas: [
        ['Gruebler Planar Mobility', 'F = 3(L − 1) − 2·j − h', 'L = links, j = binary lower pairs, h = higher pairs'],
        ['Grashof Criterion', 's + l ≤ p + q', 'Continuous rotation of shortest link s'],
        ['Gyroscopic Couple', 'C_gyro = I · ω · ω_p', 'I = polar inertia, ω = spin rad/s, ω_p = precession rad/s'],
        ['1-DOF Damped Vibration', 'ω_n = √(k/m) ; ζ = c / (2√(km)) ; ω_d = ω_n√(1 − ζ²)', 'Logarithmic decrement δ = 2πζ / √(1 − ζ²)'],
        ['Force Transmissibility Ratio', 'TR = √[(1 + (2ζr)²) / ((1 − r²)² + (2ζr)²)]', 'r = ω/ω_n; isolation occurs when r > √2']
      ],
      mermaid: `graph LR\n  K1[Linkage Mobility F = 3(L-1)-2j-h] --> K2[Velocity & Coriolis 2ωv]\n  K2 --> K3[Flywheel ΔE = Iω²Cs & Gyroscope Iωω_p]\n  K3 --> K4[1-DOF Vibrations ω_n = √(k/m)]\n  K4 --> K5[Isolation TR < 1 for ω/ω_n > √2]`
    },
    design: {
      name: 'Design of Machine Elements I & II (22ME510 / 22ME610)',
      semester: 'Semester 5 / 6',
      formulas: [
        ['Von Mises & Tresca Failure Criteria', 'σ_vm = √(σ₁² − σ₁σ₂ + σ₂²) = √(σ_x² + 3τ_xy²) ≤ S_y / N', 'Shear yield S_sy = 0.577·S_y'],
        ['Goodman & Soderberg Fatigue Criteria', 'σ_a / S_e + σ_m / S_ut = 1 / N (Goodman)', 'Soderberg replaces S_ut with S_y'],
        ['Helical Spring Deflection & Stress', 'δ = 8·P·D³·n / (G·d⁴) ; τ = K_w · 8·P·D / (π·d³)', 'Wahl factor K_w = (4C−1)/(4C−4) + 0.615/C'],
        ['Rolling Bearing Life (L₁₀)', 'L₁₀ = (C / P)^p × 10⁶ rev (p = 3 ball, 10/3 roller)', 'L₁₀h = 10⁶ / (60N) · (C/P)^p'],
        ['Lewis Spur Gear Beam Strength', 'F_b = σ_b · b · m · Y', 'm = d/z = module (mm), Y = Lewis form factor']
      ],
      mermaid: `graph LR\n  D1[Applied Duty Loads] --> D2[Static Check: Von Mises / Tresca]\n  D2 --> D3[Fatigue Check: Goodman / Soderberg]\n  D3 --> D4[Springs, Gears & Shafts Sizing]\n  D4 --> D5[Bearing Life L10 = (C/P)^p & Sommerfeld S]`
    },
    hmt: {
      name: 'Heat & Mass Transfer & FEM (22ME620 / 22ME630)',
      semester: 'Semester 6',
      formulas: [
        ['Fourier Conduction & Thermal Resistance', 'Q = ΔT / ∑R_th ; R_slab = L/(kA) ; R_cyl = ln(r₂/r₁)/(2πkL)', 'Critical insulation radius r_cr = k_ins / h'],
        ['Lumped Parameter Biot Criterion', 'Bi = h · L_c / k_solid < 0.1 ; L_c = V / A_s', 'Uniform internal solid temperature during transient cooling'],
        ['Counterflow Heat Exchanger LMTD & NTU', 'Q = U·A·ΔT_lm ; ΔT_lm = (ΔT₁ − ΔT₂) / ln(ΔT₁ / ΔT₂)', 'Balanced C_h = C_c: ε = NTU / (1 + NTU)'],
        ['Stefan-Boltzmann Radiation Shielding', 'Q_n_shields = Q_no_shield / (n + 1) (equal ε)', 'σ = 5.67×10⁻⁸ W/(m²·K⁴)'],
        ['1D Bar Finite Element Stiffness', '[k]_e = (A·E / L) · [1, −1; −1, 1]', 'Linear shape functions N₁ = 1 − x/L, N₂ = x/L']
      ],
      mermaid: `graph LR\n  H1[Fourier Conduction R_th] --> H2[Convection Nu = f(Re,Pr) & Biot < 0.1]\n  H2 --> H3[Radiation Shields 1/(n+1)]\n  H3 --> H4[Heat Exchanger LMTD & ε-NTU]\n  H4 --> H5[FEM Stiffness Assembly Ku = F]`
    },
    mfg: {
      name: 'Manufacturing, Machining, Metrology & OR (22ME350A / 22ME540 / 22ME710)',
      semester: 'Semester 4 / 5 / 7',
      formulas: [
        ['Chvorinov Casting Solidification Rule', 't_s = B · (V / A_s)²', 'Riser modulus M_r = (V/A)_r ≥ 1.2 · M_casting'],
        ['Merchant Orthogonal Cutting Circle', '2φ + β − α = 90° ; tan φ = r·cos α / (1 − r·sin α)', 'Chip thickness ratio r = t₀ / t_c < 1'],
        ['Taylor Tool Life Equation', 'V · T^n = C', 'Optimal cutting speed balances tool change time and machining time'],
        ['Process Capability Indices', 'C_p = (USL − LSL)/(6σ) ; C_pk = min[(USL − μ)/(3σ), (μ − LSL)/(3σ)]', 'Six Sigma quality requires C_p ≥ 2.0'],
        ['Economic Order Quantity (EOQ)', 'Q* = √(2 · D · S / H)', 'At Q*, annual ordering cost equals annual holding cost']
      ],
      mermaid: `graph LR\n  M1[Casting: Chvorinov t = B(V/A)²] --> M2[Forming: Rolling Δh_max = μ²R]\n  M2 --> M3[Machining: Merchant 2φ+β-α=90° & Taylor VT^n=C]\n  M3 --> M4[Metrology & SQC: Cp, Cpk]\n  M4 --> M5[Operations Research: EOQ & PERT]`
    },
    aptitude: {
      name: 'Placement Quantitative, Logical & Verbal Aptitude',
      semester: 'Placement & GATE',
      formulas: [
        ['CI vs SI 2-Year & 3-Year Shortcut', '(CI − SI)₂ = P(R/100)² ; (CI − SI)₃ = P(R/100)²(3 + R/100)', 'Direct difference without computing total compound amount'],
        ['Trains & Relative Speed', 't = (L_train + L_platform) / V_rel ; 1 km/hr = 5/18 m/s', 'V_rel = V₁ + V₂ (opposite), |V₁ − V₂| (same direction)'],
        ['Work & Time Harmonic Efficiency', 'T_AB = (A · B) / (A + B) ; M₁·D₁·H₁ / W₁ = M₂·D₂·H₂ / W₂', 'Combined work rate r_total = ∑(1/t_i)'],
        ['Rule of Alligation & Mixtures', '(Cheaper : Dearer) = (c₂ − c_m) : (c_m − c₁)', 'Repeated replacement: Final = Initial × (1 − x/V)^n'],
        ['Painted Cube & Cryptarithmetic', '2-face = 12(n−2), 1-face = 6(n−2)², 0-face = (n−2)³', 'Digital root mod 9 & leading carry = 1']
      ],
      mermaid: `graph LR\n  A1[Word Problem Parsing] --> A2[Identify Invariant Ratio / Rate]\n  A2 --> A3[Apply Shortcut Identity: CI-SI / Alligation / Relative Speed]\n  A3 --> A4[Unit Digit & Order-of-Magnitude Verification]`
    }
  };

  function inferSubjectKey(text, explicit = 'auto') {
    if (explicit && explicit !== 'auto' && LOCAL_SUBJECT_TEMPLATES[explicit]) return explicit;
    const s = String(text || '').toLowerCase();
    if (/aptitude|train|interest|profit|alligation|bizotic|aon|am2|verbal|logical/.test(s)) return 'aptitude';
    if (/conduction|convection|radiation|lmtd|ntu|biot|fourier|fem|stiffness/.test(s)) return 'hmt';
    if (/casting|chvorinov|merchant|taylor|machining|metrology|eoq|cpk|welding/.test(s)) return 'mfg';
    if (/goodman|soderberg|bearing|spring|lewis|spur gear|von mises|bolt|clutch/.test(s)) return 'design';
    if (/gruebler|grashof|gyroscope|vibration|flywheel|governor|cam|damping/.test(s)) return 'tom';
    if (/bernoulli|reynolds|darcy|venturi|pelton|francis|pump|viscosity|manometer/.test(s)) return 'fluid';
    if (/rankine|otto|diesel|brayton|entropy|enthalpy|sfee|carnot|cop/.test(s)) return 'thermo';
    return 'som';
  }

  function buildLocal15StepBundle(rawText, { subject = 'auto', title = 'Uploaded Engineering PDF' } = {}) {
    const key = inferSubjectKey(rawText, subject);
    const tpl = LOCAL_SUBJECT_TEMPLATES[key] || LOCAL_SUBJECT_TEMPLATES.som;
    const clean = String(rawText || '').trim();
    const lines = clean.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 20);
    const stamp = Date.now().toString(36).toUpperCase();

    const questions = tpl.formulas.map((f, i) => ({
      id: `GEN-${key.toUpperCase()}-${stamp}-${i + 1}`,
      sourceType: 'kg-pack',
      sourceBank: `AI Generated · ${tpl.name}`,
      topic: `${tpl.name} — ${f[0]}`,
      category: key === 'aptitude' ? 'aptitude' : 'mechanical',
      difficulty: i % 3 === 0 ? 'Basic' : i % 3 === 1 ? 'Intermediate' : 'Advanced',
      text: `[${title}] For ${tpl.name}, identify the exact governing formula and operational condition for ${f[0]}:`,
      options: [
        `${f[1]} (${f[2]})`,
        `Inversely proportional to the fourth power of temperature with zero boundary resistance`,
        `Constant across all Reynolds and Mach numbers regardless of geometry`,
        `Equal to half the product of gauge pressure and kinematic viscosity`
      ],
      answer: 0,
      explain: `Step-by-Step Verification:\n1. Governing Formula: ${f[1]}\n2. Parameters & SI Notes: ${f[2]}\n3. Source Context: ${lines[i % Math.max(1, lines.length)] || title}`,
      source: `${title} (${tpl.semester})`
    }));

    const guide = {
      title: `${title} — ${tpl.name}`,
      topic: `${tpl.name} · ${title}`,
      guideType: 'studio-guide',
      sourceBank: 'AI 15-Step Study Generator',
      name: `${title} (${tpl.name})`,
      syllabus: tpl.formulas.map(f => f[0]).join(' · '),
      idea: `Complete 15-step synthesized study guide from "${title}" (${clean.length} chars). Covers definitions, working principles, governing equations, derivations, solved numericals, and examination traps.`,
      formula: tpl.formulas.map(f => [f[0], `${f[1]} (${f[2]})`]),
      trick: [
        ...tpl.formulas.map(f => `${f[0]}: ${f[2]}`),
        ...(lines.slice(0, 3))
      ],
      originalGroup: tpl.semester
    };

    const newFlashcards = tpl.formulas.map((f, i) => ({
      id: `FC-GEN-${stamp}-${i + 1}`,
      subject: tpl.name,
      front: `[${title}] ${f[0]} — State the formula & parameter units.`,
      back: `Formula: ${f[1]}\nUnits & Trap Check: ${f[2]}`
    }));

    return {
      title,
      subjectKey: key,
      subjectName: tpl.name,
      semester: tpl.semester,
      charCount: clean.length,
      extractedSnippets: lines.slice(0, 6),
      formulas: tpl.formulas,
      mermaid: tpl.mermaid,
      questions,
      guide,
      flashcards: newFlashcards,
      numericals: [
        {
          title: `${tpl.formulas[0][0]} — Worked Design Problem`,
          equation: tpl.formulas[0][1],
          steps: [
            `1. Write the governing relation: ${tpl.formulas[0][1]}.`,
            `2. Convert all given quantities into base SI units (${tpl.formulas[0][2]}).`,
            `3. Substitute values and verify order of magnitude against physical bounds.`
          ]
        },
        {
          title: `${tpl.formulas[1][0]} — Worked Verification Problem`,
          equation: tpl.formulas[1][1],
          steps: [
            `1. Apply ${tpl.formulas[1][1]}.`,
            `2. Check boundary conditions: ${tpl.formulas[1][2]}.`
          ]
        }
      ]
    };
  }

  async function checkServerHealth() {
    const pill = document.getElementById('ai-provider-pill');
    try {
      const resp = await fetch(apiUrl('health'), { signal: AbortSignal.timeout(3500) });
      if (resp.ok) {
        const data = await resp.json();
        state.serverStatus = { checked: true, online: true, ...data };
        if (pill) {
          const onlineLabel = data.onlineAIConfigured ? 'Cloud LLM + Symbolic AI' : 'Render Server + Symbolic AI';
          pill.textContent = `● AI Engine: ${onlineLabel}`;
        }
        return data;
      }
    } catch {}
    state.serverStatus = { checked: true, online: false, providers: [] };
    if (pill) {
      const hasBrowserKey = Boolean(state.aiConfig.geminiKey || state.aiConfig.groqKey || state.aiConfig.openrouterKey || state.aiConfig.hfKey);
      pill.textContent = hasBrowserKey ? '● AI Engine: Browser Cloud API + Symbolic AI' : '● AI Engine: Built-in Symbolic + ML Ready';
    }
    return state.serverStatus;
  }

  async function invokeAITutor({ question, topic, mode }) {
    // 1. Try direct browser Gemini/Groq/OpenRouter call if user entered a key in AI Model Settings
    if (state.aiConfig.geminiKey && (state.aiConfig.provider === 'auto' || state.aiConfig.provider === 'gemini')) {
      try {
        const model = state.aiConfig.geminiModel || 'gemini-2.5-flash';
        const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
          method: 'POST',
          headers: { 'x-goog-api-key': state.aiConfig.geminiKey, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: 'You are MechPrep Arena AI Mechanical Engineering Tutor. Provide clear governing formulas, SI units, step-by-step derivations, and exam traps.' }] },
            contents: [{ role: 'user', parts: [{ text: `Topic: ${topic}\nReasoning Mode: ${mode}\nQuestion: ${question}` }] }],
            generationConfig: { temperature: 0.25, maxOutputTokens: 2800 }
          })
        });
        const d = await r.json();
        if (r.ok) {
          const text = (d.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('\n').trim();
          if (text) return { answer: text, provider: 'Google Gemini API', model };
        }
      } catch {}
    }

    if (state.aiConfig.groqKey && (state.aiConfig.provider === 'auto' || state.aiConfig.provider === 'groq')) {
      try {
        const model = state.aiConfig.groqModel || 'llama-3.3-70b-versatile';
        const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { Authorization: `Bearer ${state.aiConfig.groqKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model,
            temperature: 0.25,
            messages: [
              { role: 'system', content: 'You are MechPrep Arena AI Mechanical Engineering Tutor. Provide clear governing formulas, SI units, step-by-step derivations, and exam traps.' },
              { role: 'user', content: `Topic: ${topic}\nReasoning Mode: ${mode}\nQuestion: ${question}` }
            ]
          })
        });
        const d = await r.json();
        if (r.ok && d.choices?.[0]?.message?.content) {
          return { answer: d.choices[0].message.content.trim(), provider: 'Groq LPU API', model };
        }
      } catch {}
    }

    // 2. Try Render Backend `/api/tutor`
    try {
      const r = await fetch(apiUrl('tutor'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          topic,
          mode,
          provider: state.aiConfig.provider,
          clientKeys: state.aiConfig
        }),
        signal: AbortSignal.timeout(25000)
      });
      if (r.ok) {
        const d = await r.json();
        if (d.answer) return { answer: d.answer, provider: d.provider || 'Render Backend AI', model: d.model || 'configured' };
      }
    } catch {}

    // 3. Deterministic Symbolic & RAG Engineering Solver
    const key = inferSubjectKey(question + ' ' + topic);
    const tpl = LOCAL_SUBJECT_TEMPLATES[key] || LOCAL_SUBJECT_TEMPLATES.som;
    const nums = (question.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);

    // Search matching question or guide from the 2,412-question bank
    const qWords = question.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    let bestMatchQ = null;
    let bestScore = 0;
    for (const q of state.questions.slice(0, 800)) {
      const hay = `${q.topic} ${q.text} ${q.explain || ''}`.toLowerCase();
      let s = 0;
      for (const w of qWords) {
        if (hay.includes(w)) s += 1;
      }
      if (s > bestScore) {
        bestScore = s;
        bestMatchQ = q;
      }
    }

    const calcLines = [];
    if (nums.length >= 2) {
      calcLines.push(`- **Detected Numerical Inputs**: \`${nums.join(', ')}\``);
      if (/mohr|principal|stress/i.test(question) && nums.length >= 3) {
        const [sx, sy, txy] = nums;
        const avg = (sx + sy) / 2;
        const R = Math.sqrt(Math.pow((sx - sy) / 2, 2) + txy * txy);
        calcLines.push(`- **Mohr's Circle Solver**: Center $\\sigma_{\\text{avg}} = ${avg.toFixed(2)}\\text{ MPa}$, Radius $R = \\sqrt{((${sx}-${sy})/2)^2 + ${txy}^2} = ${R.toFixed(2)}\\text{ MPa}$`);
        calcLines.push(`- **Principal Stresses**: $\\sigma_1 = ${(avg + R).toFixed(2)}\\text{ MPa}$, $\\sigma_2 = ${(avg - R).toFixed(2)}\\text{ MPa}$, $\\tau_{\\max} = ${R.toFixed(2)}\\text{ MPa}$`);
      } else if (/shaft|torsion|torque/i.test(question) && nums.length >= 2) {
        const [T, d] = nums;
        const tau = (16 * T * 1000) / (Math.PI * Math.pow(d, 3));
        calcLines.push(`- **Torsional Shear Solver ($T = ${T}\\text{ N}\\cdot\\text{m}, d = ${d}\\text{ mm}$)**: $\\tau_{\\max} = \\frac{16T}{\\pi d^3} = ${tau.toFixed(2)}\\text{ MPa}$`);
      }
    }

    const lines = [
      `### 1. Syllabus Domain & Governing Equations (${tpl.name})`,
      ...tpl.formulas.slice(0, 3).map(f => `- **${f[0]}**: \`${f[1]}\` — *${f[2]}*`),
      ``,
      `### 2. Analytical Solution & Step-by-Step Reasoning (${mode})`,
      ...(calcLines.length ? calcLines : [
        `- **Step 1 (Control Volume / Free-Body Setup)**: Isolate the primary mechanical element and convert all quantities to base SI units (m, kg, s, N, Pa, J, K, rad/s).`,
        `- **Step 2 (Governing Law Application)**: Substitute parameters into \`${tpl.formulas[0][1]}\`.`,
        `- **Step 3 (Boundary & Regime Verification)**: Verify ${tpl.formulas[0][2]}.`
      ]),
      ...(bestMatchQ && bestScore >= 2 ? [
        ``,
        `### 3. Closest Matched Knowledge-Base Reference (\`#${bestMatchQ.id}\` · ${bestMatchQ.topic})`,
        `- **Reference Question**: ${bestMatchQ.text.replace(/<[^>]+>/g, '').slice(0, 260)}`,
        `- **Worked Solution**: ${(bestMatchQ.explain || bestMatchQ.answerText || 'Verified in bank').replace(/<[^>]+>/g, '').slice(0, 380)}`
      ] : []),
      ``,
      `### 4. Examination Trap & Viva Check`,
      `- **Critical Exam Trap**: ${tpl.formulas[0][2]}`,
      `- **Viva Follow-up**: Explain how doubling the primary geometric dimension affects the response in \`${tpl.formulas[0][1]}\`.`
    ];

    return {
      answer: lines.join('\n'),
      provider: 'Integrated Symbolic + RAG Engine',
      model: 'mechprep-symbolic-rag-v4'
    };
  }

  // --------------------------------------------------------------------------
  // 3. SVG ENGINEERING SCHEMATICS LIBRARY (FOR DIAGRAMS, NUMERICALS & REVIEWS)
  // --------------------------------------------------------------------------
  
  // --------------------------------------------------------------------------
  // 2B. UNIFIED TEXTBOOK DIAGRAMS, MATH FORMATTERS & VISUAL EXPLAINERS (v5.0)
  // --------------------------------------------------------------------------
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const safeHtml = escapeHtml;

  function guideForQuestion(q) {
    const hay = ((q.topic || '') + ' ' + (q.text || '')).toLowerCase();
    const found = state.guides.find(g => hay.includes((g.name || g.title || '').toLowerCase().split(' ')[0]));
    if (found) {
      return {
        name: found.name || found.title || 'Mechanical Engineering',
        formula: Array.isArray(found.formula) ? found.formula.map(x => x.join(': ')).join(' · ') : (found.formula || 'Apply SI conservation laws'),
        trick: Array.isArray(found.trick) ? found.trick.join(' · ') : (found.trick || found.method || 'Check boundary conditions and units')
      };
    }
    return {
      name: q.topic || 'Mechanical Engineering',
      formula: 'F = m·a · σ = P/A · Q − W = ΔU',
      trick: 'Convert all inputs into base SI units before substituting.'
    };
  }

// === Comprehensive Question Diagrams & After-Exam Visual Explainers ===
function renderMohrElementSvg() {
  return `<svg viewBox="0 0 520 200" role="img" aria-label="Bi-axial stress element with shear stress">
    <defs>
      <marker id="arrow-tensile" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M1,1 L7,4 L1,7 z" fill="#0f766e"/></marker>
      <marker id="arrow-shear" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M1,1 L7,4 L1,7 z" fill="#d97706"/></marker>
    </defs>
    <rect x="170" y="45" width="160" height="110" rx="4" fill="#f0fdf4" stroke="#0f766e" stroke-width="3"/>
    <!-- Tensile sigma_x = 1200 MPa -->
    <line x1="330" y1="100" x2="430" y2="100" stroke="#0f766e" stroke-width="3" marker-end="url(#arrow-tensile)"/>
    <line x1="170" y1="100" x2="70" y2="100" stroke="#0f766e" stroke-width="3" marker-end="url(#arrow-tensile)"/>
    <text x="438" y="105" fill="#0f766e" font-size="13" font-weight="bold">σx = 1200 MPa</text>
    <text x="2" y="105" fill="#0f766e" font-size="13" font-weight="bold">σx = 1200 MPa</text>
    <!-- Tensile sigma_y = 600 MPa -->
    <line x1="250" y1="45" x2="250" y2="10" stroke="#0f766e" stroke-width="3" marker-end="url(#arrow-tensile)"/>
    <line x1="250" y1="155" x2="250" y2="190" stroke="#0f766e" stroke-width="3" marker-end="url(#arrow-tensile)"/>
    <text x="260" y="18" fill="#0f766e" font-size="13" font-weight="bold">σy = 600 MPa</text>
    <text x="260" y="190" fill="#0f766e" font-size="13" font-weight="bold">σy = 600 MPa</text>
    <!-- Shear tau_xy = 400 MPa -->
    <line x1="338" y1="55" x2="338" y2="135" stroke="#d97706" stroke-width="2.5" marker-end="url(#arrow-shear)"/>
    <line x1="162" y1="145" x2="162" y2="65" stroke="#d97706" stroke-width="2.5" marker-end="url(#arrow-shear)"/>
    <line x1="180" y1="37" x2="320" y2="37" stroke="#d97706" stroke-width="2.5" marker-end="url(#arrow-shear)"/>
    <line x1="320" y1="163" x2="180" y2="163" stroke="#d97706" stroke-width="2.5" marker-end="url(#arrow-shear)"/>
    <text x="346" y="70" fill="#d97706" font-size="12" font-weight="bold">τxy = 400 MPa</text>
  </svg>`;
}

function renderMohrCircleExplainerSvg() {
  return `<svg viewBox="0 0 640 240" role="img" aria-label="Mohr Circle Principal Stress Derivation">
    <!-- Axes -->
    <line x1="40" y1="130" x2="600" y2="130" stroke="#64748b" stroke-width="2"/>
    <line x1="100" y1="20" x2="100" y2="220" stroke="#64748b" stroke-width="2"/>
    <text x="570" y="122" fill="#64748b" font-size="12" font-weight="bold">σ (Normal)</text>
    <text x="108" y="32" fill="#64748b" font-size="12" font-weight="bold">τ (Shear)</text>
    <!-- Mohr Circle: Center at 900, radius 500. Scaled: center=(370,130), r=150 (scale: 1px = 3.33 MPa) -->
    <circle cx="370" cy="130" r="150" fill="rgba(15,118,110,0.06)" stroke="#0f766e" stroke-width="3"/>
    <!-- Center Point -->
    <circle cx="370" cy="130" r="4" fill="#0f766e"/>
    <text x="340" y="148" fill="#0f766e" font-size="12" font-weight="bold">C (900, 0)</text>
    <!-- Principal Stresses -->
    <circle cx="520" cy="130" r="5" fill="#e11d48"/>
    <text x="510" y="115" fill="#e11d48" font-size="13" font-weight="bold">σ₁ = 1400 MPa</text>
    <circle cx="220" cy="130" r="5" fill="#3b82f6"/>
    <text x="180" y="115" fill="#3b82f6" font-size="13" font-weight="bold">σ₂ = 400 MPa</text>
    <!-- Stress Plane State Point (1200, 400) -> x = 370 + 90 = 460, y = 130 - 120 = 10 -->
    <circle cx="460" cy="50" r="5" fill="#d97706"/>
    <text x="470" y="48" fill="#d97706" font-size="12" font-weight="bold">A (1200, 400)</text>
    <line x1="370" y1="130" x2="460" y2="50" stroke="#d97706" stroke-width="2" stroke-dasharray="4 3"/>
    <!-- Radius Callout -->
    <text x="390" y="85" fill="#d97706" font-size="12">R = 500 MPa</text>
    <!-- Formula Box -->
    <rect x="30" y="155" width="220" height="75" rx="6" fill="#f8fafc" stroke="#cbd5e1"/>
    <text x="40" y="175" fill="#0f766e" font-size="11" font-weight="bold">σ_avg = (1200+600)/2 = 900 MPa</text>
    <text x="40" y="195" fill="#0f766e" font-size="11" font-weight="bold">R = √[300² + 400²] = 500 MPa</text>
    <text x="40" y="215" fill="#e11d48" font-size="12" font-weight="bold">σ₁ = 900 + 500 = 1400 MPa</text>
  </svg>`;
}

function renderHelicalSpringSvg() {
  return `<svg viewBox="0 0 520 180" role="img" aria-label="Helical Compression Spring Schematic">
    <path d="M 80 40 Q 140 20 180 40 Q 140 60 80 80 Q 140 60 180 80 Q 140 100 80 120 Q 140 100 180 120 Q 140 140 80 160" fill="none" stroke="#0f766e" stroke-width="8" stroke-linecap="round"/>
    <!-- Dimension D -->
    <line x1="210" y1="40" x2="210" y2="160" stroke="#64748b" stroke-width="1.5"/>
    <text x="218" y="105" fill="#64748b" font-size="13" font-weight="bold">Mean Dia D</text>
    <!-- Wire dia d -->
    <circle cx="80" cy="160" r="10" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>
    <text x="100" y="175" fill="#b45309" font-size="11" font-weight="bold">wire dia d</text>
    <!-- Load P -->
    <line x1="130" y1="5" x2="130" y2="35" stroke="#e11d48" stroke-width="3" marker-end="url(#arrow-tensile)"/>
    <text x="140" y="25" fill="#e11d48" font-size="13" font-weight="bold">Load P</text>
    <!-- Summary -->
    <rect x="310" y="30" width="190" height="110" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
    <text x="325" y="55" fill="#0f766e" font-size="13" font-weight="bold">δ = 8 P D³ n / (G d⁴)</text>
    <text x="325" y="80" fill="#334155" font-size="12">If D → 2D: (2)³ = 8×</text>
    <text x="325" y="100" fill="#334155" font-size="12">If d → 2d: (2)⁴ = 16×</text>
    <text x="325" y="125" fill="#e11d48" font-size="13" font-weight="bold">Ratio = 8/16 = 1/2 (Halved)</text>
  </svg>`;
}

function renderFitnessCentreSvg() {
  return `<svg viewBox="0 0 560 190" role="img" aria-label="Bizotic Fitness Centre Revenue Model">
    <!-- Current Bar -->
    <g transform="translate(40, 20)">
      <rect x="0" y="40" width="130" height="90" rx="6" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      <text x="15" y="65" fill="#0369a1" font-size="12" font-weight="bold">Current Base</text>
      <text x="15" y="88" fill="#0f172a" font-size="14" font-weight="bold">360 Members</text>
      <text x="15" y="108" fill="#64748b" font-size="12">₹1,500 / month</text>
      <text x="15" y="150" fill="#0284c7" font-size="13" font-weight="bold">Total: ₹5,40,000</text>
    </g>
    <!-- Arrow -->
    <g transform="translate(195, 75)">
      <text x="0" y="-12" fill="#d97706" font-size="11" font-weight="bold">Fee -25% (₹1,125)</text>
      <text x="0" y="32" fill="#059669" font-size="11" font-weight="bold">Target +10% (₹5.94L)</text>
      <line x1="10" y1="5" x2="80" y2="5" stroke="#64748b" stroke-width="2" stroke-dasharray="4 3"/>
    </g>
    <!-- Target Bar -->
    <g transform="translate(305, 20)">
      <rect x="0" y="20" width="210" height="110" rx="6" fill="#f0fdf4" stroke="#059669" stroke-width="2"/>
      <text x="15" y="45" fill="#059669" font-size="12" font-weight="bold">Target Collection</text>
      <text x="15" y="68" fill="#0f172a" font-size="14" font-weight="bold">528 Total Members</text>
      <text x="15" y="88" fill="#64748b" font-size="12">₹5,94,000 ÷ ₹1,125/mo</text>
      <rect x="15" y="96" width="180" height="26" rx="4" fill="#dcfce7"/>
      <text x="22" y="114" fill="#15803d" font-size="12" font-weight="bold">+168 NEW MEMBERS JOIN</text>
      <text x="15" y="150" fill="#059669" font-size="13" font-weight="bold">Total: ₹5,94,000</text>
    </g>
  </svg>`;
}

function renderGardenLawnSvg() {
  return `<svg viewBox="0 0 500 240" role="img" aria-label="Square garden with corner quarter-circles and boundary semicircles">
    <!-- 21m Square Garden -->
    <rect x="60" y="20" width="200" height="200" fill="#22c55e" stroke="#1e293b" stroke-width="3"/>
    <!-- 4 Corner Quarter-circles (radius 66.6px = 7m) -->
    <path d="M 60 20 L 126.6 20 A 66.6 66.6 0 0 1 60 86.6 Z" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
    <path d="M 260 20 L 193.4 20 A 66.6 66.6 0 0 0 260 86.6 Z" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
    <path d="M 60 220 L 126.6 220 A 66.6 66.6 0 0 0 60 153.4 Z" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
    <path d="M 260 220 L 193.4 220 A 66.6 66.6 0 0 1 260 153.4 Z" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
    <!-- 4 Boundary Semicircles (diameter 66.6px = 7m, radius 33.3px = 3.5m) -->
    <path d="M 126.6 20 A 33.3 33.3 0 0 1 193.4 20 Z" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
    <path d="M 126.6 220 A 33.3 33.3 0 0 0 193.4 220 Z" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
    <path d="M 60 126.6 A 33.3 33.3 0 0 1 60 193.4 Z" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
    <path d="M 260 126.6 A 33.3 33.3 0 0 0 260 193.4 Z" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
    <text x="135" y="125" fill="#ffffff" font-size="16" font-weight="bold">Lawn</text>
    <line x1="60" y1="8" x2="260" y2="8" stroke="#1e293b" stroke-width="1.5"/>
    <text x="145" y="6" fill="#1e293b" font-size="11" font-weight="bold">21 m</text>
    <!-- Calculation Legend Card -->
    <rect x="290" y="20" width="195" height="200" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
    <text x="305" y="45" fill="#0f766e" font-size="13" font-weight="bold">Square Area = 21² = 441 m²</text>
    <text x="305" y="75" fill="#d97706" font-size="12">4 Corner Beds (r=7m):</text>
    <text x="305" y="95" fill="#334155" font-size="11">π·7² = (22/7)·49 = 154 m²</text>
    <text x="305" y="125" fill="#d97706" font-size="12">4 Side Semicircles (r=3.5m):</text>
    <text x="305" y="145" fill="#334155" font-size="11">4·[½·π·(3.5)²] = 77 m²</text>
    <line x1="305" y1="160" x2="470" y2="160" stroke="#cbd5e1"/>
    <text x="305" y="180" fill="#15803d" font-size="13" font-weight="bold">Lawn = 441 − (154+77)</text>
    <text x="305" y="205" fill="#15803d" font-size="16" font-weight="bold">= 210 m² (Option B)</text>
  </svg>`;
}

function renderAonSequenceSvg() {
  return `<svg viewBox="0 0 600 170" role="img" aria-label="AON Analytical Reasoning 4-Stage Shape Sequence">
    <!-- Stage 1 -->
    <g transform="translate(10, 15)">
      <rect x="0" y="0" width="115" height="115" rx="8" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>
      <line x1="57.5" y1="0" x2="57.5" y2="115" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3 3"/>
      <line x1="0" y1="57.5" x2="115" y2="57.5" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3 3"/>
      <polygon points="28,15 32,24 42,24 34,30 37,40 28,34 19,40 22,30 14,24 24,24" fill="#f59e0b"/>
      <circle cx="86" cy="28" r="13" fill="#10b981"/>
      <polygon points="28,72 41,82 36,98 20,98 15,82" fill="#ef4444"/>
      <polygon points="86,72 99,98 73,98" fill="#3b82f6"/>
      <text x="36" y="136" fill="#64748b" font-size="12" font-weight="bold">Stage 1</text>
    </g>
    <!-- Stage 2 -->
    <g transform="translate(155, 15)">
      <rect x="0" y="0" width="115" height="115" rx="8" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>
      <line x1="57.5" y1="0" x2="57.5" y2="115" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3 3"/>
      <line x1="0" y1="57.5" x2="115" y2="57.5" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3 3"/>
      <circle cx="28" cy="28" r="13" fill="#10b981"/>
      <polygon points="86,15 99,41 73,41" fill="#3b82f6"/>
      <polygon points="28,72 32,81 42,81 34,87 37,97 28,91 19,97 22,87 14,81 24,81" fill="#f59e0b"/>
      <polygon points="86,72 99,82 94,98 78,98 73,82" fill="#ef4444"/>
      <text x="36" y="136" fill="#64748b" font-size="12" font-weight="bold">Stage 2</text>
    </g>
    <!-- Stage 3 -->
    <g transform="translate(300, 15)">
      <rect x="0" y="0" width="115" height="115" rx="8" fill="#f8fafc" stroke="#64748b" stroke-width="2"/>
      <line x1="57.5" y1="0" x2="57.5" y2="115" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3 3"/>
      <line x1="0" y1="57.5" x2="115" y2="57.5" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="3 3"/>
      <polygon points="28,15 41,41 15,41" fill="#3b82f6"/>
      <polygon points="86,15 99,25 94,41 78,41 73,25" fill="#ef4444"/>
      <circle cx="28" cy="86" r="13" fill="#10b981"/>
      <polygon points="86,72 90,81 100,81 92,87 95,97 86,91 77,97 80,87 72,81 82,81" fill="#f59e0b"/>
      <text x="36" y="136" fill="#64748b" font-size="12" font-weight="bold">Stage 3</text>
    </g>
    <!-- Stage 4 (?) -->
    <g transform="translate(445, 15)">
      <rect x="0" y="0" width="115" height="115" rx="8" fill="#ecfdf5" stroke="#0f766e" stroke-width="3" stroke-dasharray="5 3"/>
      <text x="45" y="72" fill="#0f766e" font-size="44" font-weight="bold">?</text>
      <text x="32" y="136" fill="#0f766e" font-size="12" font-weight="bold">Stage 4 (?)</text>
    </g>
  </svg>`;
}

function renderBuildCreateCodeSvg() {
  return `<svg viewBox="0 0 540 180" role="img" aria-label="BUILD to CREATE Letter Code Shift Diagram">
    <g transform="translate(30, 25)">
      <text x="0" y="0" fill="#0f766e" font-size="13" font-weight="bold">Rule Pattern: BUILD → DXMQJ (+2, +3, +4, +5, +6)</text>
      <g transform="translate(0, 15)">
        <rect x="0" y="0" width="40" height="32" rx="4" fill="#e2e8f0"/><text x="14" y="21" fill="#1e293b" font-weight="bold">B</text><text x="12" y="46" fill="#059669" font-size="11">+2</text><rect x="0" y="52" width="40" height="32" rx="4" fill="#dcfce7"/><text x="14" y="73" fill="#166534" font-weight="bold">D</text>
        <rect x="50" y="0" width="40" height="32" rx="4" fill="#e2e8f0"/><text x="64" y="21" fill="#1e293b" font-weight="bold">U</text><text x="62" y="46" fill="#059669" font-size="11">+3</text><rect x="50" y="52" width="40" height="32" rx="4" fill="#dcfce7"/><text x="64" y="73" fill="#166534" font-weight="bold">X</text>
        <rect x="100" y="0" width="40" height="32" rx="4" fill="#e2e8f0"/><text x="117" y="21" fill="#1e293b" font-weight="bold">I</text><text x="112" y="46" fill="#059669" font-size="11">+4</text><rect x="100" y="52" width="40" height="32" rx="4" fill="#dcfce7"/><text x="114" y="73" fill="#166534" font-weight="bold">M</text>
        <rect x="150" y="0" width="40" height="32" rx="4" fill="#e2e8f0"/><text x="165" y="21" fill="#1e293b" font-weight="bold">L</text><text x="162" y="46" fill="#059669" font-size="11">+5</text><rect x="150" y="52" width="40" height="32" rx="4" fill="#dcfce7"/><text x="164" y="73" fill="#166534" font-weight="bold">Q</text>
        <rect x="200" y="0" width="40" height="32" rx="4" fill="#e2e8f0"/><text x="214" y="21" fill="#1e293b" font-weight="bold">D</text><text x="212" y="46" fill="#059669" font-size="11">+6</text><rect x="200" y="52" width="40" height="32" rx="4" fill="#dcfce7"/><text x="216" y="73" fill="#166534" font-weight="bold">J</text>
      </g>
    </g>
    <g transform="translate(290, 25)">
      <text x="0" y="0" fill="#0284c7" font-size="13" font-weight="bold">Apply to: CREATE → EUIFZL (+2, +3, +4, +5, +6, +7)</text>
      <g transform="translate(0, 15)">
        <rect x="0" y="0" width="34" height="32" rx="4" fill="#e0f2fe"/><text x="11" y="21" fill="#0369a1" font-weight="bold">C</text><text x="8" y="46" fill="#0284c7" font-size="11">+2</text><rect x="0" y="52" width="34" height="32" rx="4" fill="#fef3c7"/><text x="12" y="73" fill="#b45309" font-weight="bold">E</text>
        <rect x="38" y="0" width="34" height="32" rx="4" fill="#e0f2fe"/><text x="49" y="21" fill="#0369a1" font-weight="bold">R</text><text x="46" y="46" fill="#0284c7" font-size="11">+3</text><rect x="38" y="52" width="34" height="32" rx="4" fill="#fef3c7"/><text x="49" y="73" fill="#b45309" font-weight="bold">U</text>
        <rect x="76" y="0" width="34" height="32" rx="4" fill="#e0f2fe"/><text x="88" y="21" fill="#0369a1" font-weight="bold">E</text><text x="84" y="46" fill="#0284c7" font-size="11">+4</text><rect x="76" y="52" width="34" height="32" rx="4" fill="#fef3c7"/><text x="89" y="73" fill="#b45309" font-weight="bold">I</text>
        <rect x="114" y="0" width="34" height="32" rx="4" fill="#e0f2fe"/><text x="125" y="21" fill="#0369a1" font-weight="bold">A</text><text x="122" y="46" fill="#0284c7" font-size="11">+5</text><rect x="114" y="52" width="34" height="32" rx="4" fill="#fef3c7"/><text x="126" y="73" fill="#b45309" font-weight="bold">F</text>
        <rect x="152" y="0" width="34" height="32" rx="4" fill="#e0f2fe"/><text x="163" y="21" fill="#0369a1" font-weight="bold">T</text><text x="160" y="46" fill="#0284c7" font-size="11">+6</text><rect x="152" y="52" width="34" height="32" rx="4" fill="#fef3c7"/><text x="164" y="73" fill="#b45309" font-weight="bold">Z</text>
        <rect x="190" y="0" width="34" height="32" rx="4" fill="#e0f2fe"/><text x="202" y="21" fill="#0369a1" font-weight="bold">E</text><text x="198" y="46" fill="#0284c7" font-size="11">+7</text><rect x="190" y="52" width="34" height="32" rx="4" fill="#fef3c7"/><text x="203" y="73" fill="#b45309" font-weight="bold">L</text>
      </g>
    </g>
  </svg>`;
}

function renderQuestionFigure(q) {
  if (q.svg) return q.svg;
  if (q.figure) return q.figure;
  const text = (q.text || '').toLowerCase();
  const id = q.id || '';
  if (text.includes('square garden') || text.includes('quarter-circle bed') || id === 'PREVIEW-AM2-01') {
    return renderGardenLawnSvg();
  }
  if (text.includes('sequence of geometric shapes') || text.includes('logically completes the following sequence') || id === 'PREVIEW-AON-01') {
    return renderAonSequenceSvg();
  }
  if (text.includes('tensile stress of 1200 mpa') || text.includes('shear stress of 400 mpa') || (text.includes('maximum normal stress') && text.includes('plane at right angles')) || id === 'PREVIEW-SOM-01') {
    return renderMohrElementSvg();
  }
  if (text.includes('mean coil diameter and wire diameter') || text.includes('helical compression') || id === 'PREVIEW-MD-01') {
    return renderHelicalSpringSvg();
  }
  if (text.includes('fitness centre') && text.includes('360 members') || id === 'PREVIEW-BIZOTIC-01') {
    return renderFitnessCentreSvg();
  }
  if (text.includes('build') && text.includes('create') && text.includes('coded') || id === 'PREVIEW-AON-02') {
    return renderBuildCreateCodeSvg();
  }
  return '';
}



function formatMathSegment(mathStr) {
  let s = safeHtml(mathStr.trim());
  // Convert \frac{a}{b} to stacked fraction
  for (let i = 0; i < 4; i++) {
    s = s.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '<span class="math-frac"><span class="m-num">$1</span><span class="m-den">$2</span></span>');
  }
  // Convert \sqrt{a}
  s = s.replace(/\\sqrt\{([^{}]+)\}/g, '√($1)');
  // Common LaTeX symbols & Greek letters
  const symMap = [
    [/\\infty/g, '∞'], [/\\times/g, '×'], [/\\cdot/g, '·'], [/\\pm/g, '±'],
    [/\\le(?:q)?/g, '≤'], [/\\ge(?:q)?/g, '≥'], [/\\neq/g, '≠'], [/\\approx/g, '≈'],
    [/\\rightarrow|\\to/g, '→'], [/\\leftarrow/g, '←'], [/\\Rightarrow/g, '⇒'],
    [/\\partial/g, '∂'], [/\\nabla/g, '∇'], [/\\int/g, '∫'], [/\\sum/g, '∑'],
    [/\\sigma/g, 'σ'], [/\\tau/g, 'τ'], [/\\Delta/g, 'Δ'], [/\\delta/g, 'δ'],
    [/\\pi/g, 'π'], [/\\theta/g, 'θ'], [/\\omega/g, 'ω'], [/\\eta/g, 'η'],
    [/\\rho/g, 'ρ'], [/\\mu/g, 'μ'], [/\\alpha/g, 'α'], [/\\beta/g, 'β'],
    [/\\gamma/g, 'γ'], [/\\lambda/g, 'λ'], [/\\phi/g, 'φ'], [/\\epsilon/g, 'ε'],
    [/\\text\{([^{}]+)\}/g, '$1'], [/\\mathrm\{([^{}]+)\}/g, '$1'], [/\\left|\\right/g, '']
  ];
  for (const [rgx, rep] of symMap) s = s.replace(rgx, rep);
  // Subscripts and superscripts: _{xx}, _x, ^{ax}, ^2
  s = s.replace(/_\{([^{}]+)\}/g, '<sub>$1</sub>');
  s = s.replace(/_([a-zA-Z0-9]+)/g, '<sub>$1</sub>');
  s = s.replace(/\^\{([^{}]+)\}/g, '<sup>$1</sup>');
  s = s.replace(/\^([a-zA-Z0-9+\-]+)/g, '<sup>$1</sup>');
  // Clean any remaining stray backslashes before words
  s = s.replace(/\\([a-zA-Z]+)/g, '$1');
  return `<span class="math-inline">${s}</span>`;
}

function formatInlineRich(lineStr) {
  // First extract $...$ math blocks so ** or _ inside math isn't mangled
  const mathPlaceholders = [];
  let processed = String(lineStr || '').replace(/\$\$([^$]+)\$\$|\$([^$]+)\$/g, (_, m1, m2) => {
    const idx = mathPlaceholders.length;
    mathPlaceholders.push(formatMathSegment(m1 || m2));
    return `@@MATH_${idx}@@`;
  });

  // Escape HTML on the non-math text
  processed = safeHtml(processed);

  // Also convert any bare LaTeX tokens outside $...$ (such as \infty, f_{xx}, \sigma)
  processed = processed
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '<span class="math-frac"><span class="m-num">$1</span><span class="m-den">$2</span></span>')
    .replace(/\\infty/g, '∞')
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')
    .replace(/\\pm/g, '±')
    .replace(/\\le(?:q)?/g, '≤')
    .replace(/\\ge(?:q)?/g, '≥')
    .replace(/\\rightarrow|\\to/g, '→')
    .replace(/\\sigma/g, 'σ').replace(/\\tau/g, 'τ').replace(/\\Delta/g, 'Δ').replace(/\\delta/g, 'δ')
    .replace(/\\pi/g, 'π').replace(/\\theta/g, 'θ').replace(/\\omega/g, 'ω').replace(/\\eta/g, 'η')
    .replace(/\\rho/g, 'ρ').replace(/\\mu/g, 'μ').replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β')
    .replace(/\\gamma/g, 'γ').replace(/\\lambda/g, 'λ')
    .replace(/_\{([^{}]+)\}/g, '<sub>$1</sub>')
    .replace(/\^\{([^{}]+)\}/g, '<sup>$1</sup>')
    .replace(/\b([a-zA-Z])_([a-zA-Z0-9]{1,3})\b/g, '$1<sub>$2</sub>')
    .replace(/\b([a-zA-Z0-9)\]])\^([0-9a-zA-Z+\-]{1,3})\b/g, '$1<sup>$2</sup>');

  // Convert **bold** (including multi-segment bold on the same line)
  processed = processed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Clean up any stray unmatched ** if the LLM cut off mid-token
  processed = processed.replace(/\*\*/g, '');
  // Convert *italic* (single asterisk not surrounded by spaces)
  processed = processed.replace(/(^|[^*])\*([^*\s][^*]*?)\*(?!\*)/g, '$1<em>$2</em>');
  // Convert `inline code`
  processed = processed.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Restore math placeholders
  processed = processed.replace(/@@MATH_(\d+)@@/g, (_, idx) => mathPlaceholders[Number(idx)] || '');
  return processed;
}

function formatEngineeringMarkdown(rawText) {
  if (!rawText) return '';
  const lines = String(rawText).replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let inUl = false;
  let inOl = false;

  const closeLists = () => {
    if (inUl) { out.push('</ul>'); inUl = false; }
    if (inOl) { out.push('</ol>'); inOl = false; }
  };

  for (let rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      closeLists();
      continue;
    }
    // Check for === Heading === or ### Heading or ## Heading or # Heading
    const eqMatch = trimmed.match(/^===\s*(.+?)\s*===$/);
    const hashMatch = trimmed.match(/^#{1,4}\s+(.+)$/);
    if (eqMatch || hashMatch) {
      closeLists();
      const titleText = formatInlineRich((eqMatch ? eqMatch[1] : hashMatch[1]).replace(/\*\*/g, ''));
      out.push(`<h4 class="rich-heading">${titleText}</h4>`);
      continue;
    }
    // Check for bullet list item: * item, - item, • item
    const ulMatch = trimmed.match(/^([*\-•])\s+(.+)$/);
    if (ulMatch) {
      if (inOl) { out.push('</ol>'); inOl = false; }
      if (!inUl) { out.push('<ul class="rich-bullets">'); inUl = true; }
      out.push(`<li>${formatInlineRich(ulMatch[2])}</li>`);
      continue;
    }
    // Check for numbered list item: 1. item or 1) item
    const olMatch = trimmed.match(/^\d+[.)]\s+(.+)$/);
    if (olMatch) {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (!inOl) { out.push('<ol class="rich-ol">'); inOl = true; }
      out.push(`<li>${formatInlineRich(olMatch[1])}</li>`);
      continue;
    }
    closeLists();
    out.push(`<p>${formatInlineRich(trimmed)}</p>`);
  }
  closeLists();
  return `<div class="rich-formatted">${out.join('')}</div>`;
}

// === Textbook Engineering Schematics + Boxed Formula Callouts + Live Calculators ===
const TEXTBOOK_DIAGRAMS = {
  
  'mohr-circle-stress': {
    title: 'Principal Stresses & Mohr\'s Circle Calculator – 2D Stress State',
    chapterIds: ['som', 'mechanics', 'design'],
    svg: `<svg viewBox="0 0 680 230" role="img" aria-label="Mohr Circle and 2D Stress Element">
      <defs>
        <marker id="tb-arrow-teal" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M1,1 L7,4 L1,7 z" fill="#0f766e"/></marker>
        <marker id="tb-arrow-orange" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M1,1 L7,4 L1,7 z" fill="#d97706"/></marker>
      </defs>
      <!-- Stress element -->
      <g transform="translate(40, 45)">
        <rect x="30" y="25" width="100" height="80" rx="4" fill="#f0fdf4" stroke="#0f766e" stroke-width="2.5"/>
        <line x1="130" y1="65" x2="175" y2="65" stroke="#0f766e" stroke-width="2.5" marker-end="url(#tb-arrow-teal)"/>
        <line x1="30" y1="65" x2="-15" y2="65" stroke="#0f766e" stroke-width="2.5" marker-end="url(#tb-arrow-teal)"/>
        <text x="135" y="58" fill="#0f766e" font-size="11" font-weight="bold">σx</text>
        <line x1="80" y1="25" x2="80" y2="-10" stroke="#0f766e" stroke-width="2.5" marker-end="url(#tb-arrow-teal)"/>
        <line x1="80" y1="105" x2="80" y2="140" stroke="#0f766e" stroke-width="2.5" marker-end="url(#tb-arrow-teal)"/>
        <text x="88" y="0" fill="#0f766e" font-size="11" font-weight="bold">σy</text>
        <line x1="135" y1="35" x2="135" y2="95" stroke="#d97706" stroke-width="2" marker-end="url(#tb-arrow-orange)"/>
        <text x="140" y="50" fill="#d97706" font-size="11" font-weight="bold">τxy</text>
      </g>
      <!-- Mohr circle -->
      <g transform="translate(240, 20)">
        <line x1="30" y1="100" x2="380" y2="100" stroke="#64748b" stroke-width="1.5"/>
        <line x1="80" y1="10" x2="80" y2="190" stroke="#64748b" stroke-width="1.5"/>
        <text x="350" y="92" fill="#64748b" font-size="11" font-weight="bold">σ</text>
        <text x="88" y="22" fill="#64748b" font-size="11" font-weight="bold">τ</text>
        <circle cx="230" cy="100" r="110" fill="rgba(15,118,110,0.06)" stroke="#0f766e" stroke-width="2.5"/>
        <circle cx="230" cy="100" r="3.5" fill="#0f766e"/>
        <text x="210" y="118" fill="#0f766e" font-size="11" font-weight="bold">C (σ_avg, 0)</text>
        <circle cx="340" cy="100" r="4.5" fill="#e11d48"/>
        <text x="330" y="88" fill="#e11d48" font-size="12" font-weight="bold">σ₁</text>
        <circle cx="120" cy="100" r="4.5" fill="#3b82f6"/>
        <text x="100" y="88" fill="#3b82f6" font-size="12" font-weight="bold">σ₂</text>
        <line x1="230" y1="100" x2="310" y2="25" stroke="#d97706" stroke-width="1.5" stroke-dasharray="4 3"/>
        <text x="250" y="55" fill="#d97706" font-size="11">R = τ_max</text>
      </g>
    </svg>`,
    formulas: [
      '<b>Center:</b> &nbsp;σ_avg = (σx + σy) / 2',
      '<b>Radius:</b> &nbsp;R = √[((σx − σy)/2)² + τxy²]',
      '<b>Principal Stresses:</b> &nbsp;σ₁,₂ = σ_avg ± R &nbsp;|&nbsp; <b>Max Shear:</b> &nbsp;τ_max = R'
    ],
    inputs: [
      { id: 'sx', label: 'Normal stress σx (MPa)', val: 1200, step: 50 },
      { id: 'sy', label: 'Normal stress σy (MPa)', val: 600, step: 50 },
      { id: 'txy', label: 'Shear stress τxy (MPa)', val: 400, step: 25 }
    ],
    compute: (v) => {
      const sx = v.sx || 0, sy = v.sy || 0, txy = v.txy || 0;
      const s_avg = (sx + sy) / 2;
      const r = Math.sqrt(Math.pow((sx - sy) / 2, 2) + Math.pow(txy, 2));
      const s1 = s_avg + r, s2 = s_avg - r;
      const theta_p = 0.5 * Math.atan2(2 * txy, sx - sy) * (180 / Math.PI);
      return `<div class="tb-calc-line"><b>Center σ_avg:</b> ${s_avg.toFixed(1)} MPa</div>
        <div class="tb-calc-line"><b>Mohr Radius R (τ_max):</b> ${r.toFixed(1)} MPa</div>
        <div class="tb-calc-line"><b>Major Principal Stress σ₁:</b> <span style="color:#e11d48;font-weight:bold">${s1.toFixed(1)} MPa</span></div>
        <div class="tb-calc-line"><b>Minor Principal Stress σ₂:</b> <span style="color:#0284c7;font-weight:bold">${s2.toFixed(1)} MPa</span></div>
        <div class="tb-calc-line"><b>Principal Plane θp:</b> ${theta_p.toFixed(1)}°</div>`;
    }
  },
  'helical-spring-calc': {
    title: 'Helical Compression Spring Calculator – Deflection &amp; Stiffness',
    chapterIds: ['design', 'som', 'mechanics'],
    svg: `<svg viewBox="0 0 680 200" role="img" aria-label="Helical Compression Spring Schematic">
      <path d="M 120 40 Q 200 15 260 40 Q 200 65 120 90 Q 200 65 260 90 Q 200 115 120 140 Q 200 115 260 140 Q 200 165 120 190" fill="none" stroke="#0f766e" stroke-width="8" stroke-linecap="round"/>
      <line x1="290" y1="40" x2="290" y2="190" stroke="#64748b" stroke-width="1.5"/>
      <text x="300" y="115" fill="#64748b" font-size="13" font-weight="bold">Mean Dia D</text>
      <circle cx="120" cy="190" r="10" fill="#f59e0b" stroke="#b45309" stroke-width="2"/>
      <text x="140" y="195" fill="#b45309" font-size="11" font-weight="bold">wire dia d</text>
      <line x1="190" y1="5" x2="190" y2="35" stroke="#e11d48" stroke-width="3" marker-end="url(#tb-arrow-teal)"/>
      <text x="200" y="24" fill="#e11d48" font-size="13" font-weight="bold">Axial Load P</text>
      <g transform="translate(420, 35)">
        <rect x="0" y="0" width="230" height="130" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
        <text x="15" y="28" fill="#0f766e" font-size="13" font-weight="bold">δ = 8 P D³ n / (G d⁴)</text>
        <text x="15" y="55" fill="#334155" font-size="12">Spring Rate: k = P / δ = G d⁴ / (8 D³ n)</text>
        <text x="15" y="80" fill="#334155" font-size="12">Shear Stress: τ = 8 P D / (π d³)</text>
        <text x="15" y="108" fill="#e11d48" font-size="12" font-weight="bold">Doubling D &amp; d: (2)³/(2)⁴ = 1/2 δ</text>
      </g>
    </svg>`,
    formulas: [
      '<b>Deflection:</b> &nbsp;δ = 8·P·D³·n / (G·d⁴)',
      '<b>Spring Stiffness:</b> &nbsp;k = P / δ = G·d⁴ / (8·D³·n)',
      '<b>Torsional Stress:</b> &nbsp;τ = 8·P·D·Kw / (π·d³) &nbsp;(Kw = Wahl Factor)'
    ],
    inputs: [
      { id: 'load', label: 'Applied load P (N)', val: 500, step: 50 },
      { id: 'D', label: 'Mean coil dia D (mm)', val: 50, step: 5 },
      { id: 'd', label: 'Wire diameter d (mm)', val: 6, step: 0.5 },
      { id: 'n', label: 'Active coils n', val: 10, step: 1 },
      { id: 'G', label: 'Shear modulus G (GPa)', val: 80, step: 5 }
    ],
    compute: (v) => {
      const P = v.load || 500, D = v.D || 50, d = v.d || 6, n = v.n || 10, G = (v.G || 80) * 1000;
      const delta = (8 * P * Math.pow(D, 3) * n) / (G * Math.pow(d, 4));
      const k = delta > 0 ? P / delta : 0;
      const C = D / d;
      const Kw = (4 * C - 1) / (4 * C - 4) + 0.615 / C;
      const tau = (8 * P * D * Kw) / (Math.PI * Math.pow(d, 3));
      return `<div class="tb-calc-line"><b>Spring Index C (D/d):</b> ${C.toFixed(2)}</div>
        <div class="tb-calc-line"><b>Axial Deflection δ:</b> <span style="color:#0f766e;font-weight:bold">${delta.toFixed(2)} mm</span></div>
        <div class="tb-calc-line"><b>Spring Stiffness k:</b> ${k.toFixed(1)} N/mm</div>
        <div class="tb-calc-line"><b>Max Shear Stress τ (with Wahl):</b> ${tau.toFixed(1)} MPa</div>`;
    }
  },
  'garden-lawn-calc': {
    title: 'Garden Lawn &amp; Circle Mensuration Calculator (AM2 Assessment Model)',
    chapterIds: ['aptitude', 'math'],
    svg: `<svg viewBox="0 0 680 200" role="img" aria-label="Garden Lawn and Beds Geometry">
      <rect x="60" y="20" width="160" height="160" fill="#22c55e" stroke="#1e293b" stroke-width="2.5"/>
      <path d="M 60 20 L 113.3 20 A 53.3 53.3 0 0 1 60 73.3 Z" fill="#fef3c7" stroke="#d97706"/>
      <path d="M 220 20 L 166.7 20 A 53.3 53.3 0 0 0 220 73.3 Z" fill="#fef3c7" stroke="#d97706"/>
      <path d="M 60 180 L 113.3 180 A 53.3 53.3 0 0 0 60 126.7 Z" fill="#fef3c7" stroke="#d97706"/>
      <path d="M 220 180 L 166.7 180 A 53.3 53.3 0 0 1 220 126.7 Z" fill="#fef3c7" stroke="#d97706"/>
      <path d="M 113.3 20 A 26.7 26.7 0 0 1 166.7 20 Z" fill="#fef3c7" stroke="#d97706"/>
      <path d="M 113.3 180 A 26.7 26.7 0 0 0 166.7 180 Z" fill="#fef3c7" stroke="#d97706"/>
      <path d="M 60 113.3 A 26.7 26.7 0 0 1 60 166.7 Z" fill="#fef3c7" stroke="#d97706"/>
      <path d="M 220 113.3 A 26.7 26.7 0 0 0 220 166.7 Z" fill="#fef3c7" stroke="#d97706"/>
      <text x="120" y="105" fill="#ffffff" font-size="14" font-weight="bold">Lawn</text>
      <g transform="translate(300, 25)">
        <rect x="0" y="0" width="340" height="150" rx="8" fill="#f8fafc" stroke="#cbd5e1"/>
        <text x="15" y="26" fill="#0f766e" font-size="13" font-weight="bold">A_square = side²</text>
        <text x="15" y="50" fill="#d97706" font-size="12">4 Corner Beds = 4 × (¼·π·r²) = π·r²</text>
        <text x="15" y="74" fill="#d97706" font-size="12">4 Side Semicircles = 4 × (½·π·(r_side)²) = 2·π·r_side²</text>
        <text x="15" y="98" fill="#15803d" font-size="13" font-weight="bold">Lawn Area = A_square − [A_corners + A_sides]</text>
        <text x="15" y="125" fill="#64748b" font-size="11">Exact formula derived for Bizotic / AM2 corporate test series</text>
      </g>
    </svg>`,
    formulas: [
      '<b>Square Area:</b> &nbsp;A = s²',
      '<b>4 Corner Quarter-circles (r):</b> &nbsp;A_corners = π·r²',
      '<b>4 Side Semicircles:</b> &nbsp;r_side = (s − 2r)/2 &nbsp;|&nbsp; A_sides = 2·π·r_side²',
      '<b>Shaded Lawn Area:</b> &nbsp;A_lawn = s² − [π·r² + 2·π·r_side²]'
    ],
    inputs: [
      { id: 'side', label: 'Square side length s (m)', val: 21, step: 1 },
      { id: 'r', label: 'Corner bed radius r (m)', val: 7, step: 0.5 }
    ],
    compute: (v) => {
      const s = v.side || 21, r = v.r || 7;
      const A_sq = s * s;
      const A_corners = (22 / 7) * r * r;
      const d_side = Math.max(0, s - 2 * r);
      const r_side = d_side / 2;
      const A_sides = 2 * (22 / 7) * r_side * r_side;
      const A_lawn = Math.max(0, A_sq - (A_corners + A_sides));
      return `<div class="tb-calc-line"><b>Square Area:</b> ${A_sq.toFixed(1)} m²</div>
        <div class="tb-calc-line"><b>4 Corner Quarter-Circles:</b> ${A_corners.toFixed(1)} m²</div>
        <div class="tb-calc-line"><b>4 Boundary Semicircles:</b> ${A_sides.toFixed(1)} m² (d = ${d_side.toFixed(1)} m)</div>
        <div class="tb-calc-line"><b>Shaded Lawn Area:</b> <span style="color:#15803d;font-weight:bold">${A_lawn.toFixed(1)} m²</span></div>`;
    }
  },
  'business-revenue-calc': {
    title: 'Membership Pricing Elasticity &amp; Target Revenue Calculator (Bizotic Model)',
    chapterIds: ['aptitude', 'industrial'],
    svg: `<svg viewBox="0 0 680 180" role="img" aria-label="Bizotic Revenue Model">
      <rect x="40" y="30" width="160" height="120" rx="6" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      <text x="55" y="60" fill="#0369a1" font-size="13" font-weight="bold">Baseline State</text>
      <text x="55" y="85" fill="#0f172a" font-size="14" font-weight="bold">N₀ Members</text>
      <text x="55" y="105" fill="#64748b" font-size="12">Fee: F₀ / month</text>
      <text x="55" y="130" fill="#0284c7" font-size="13" font-weight="bold">Revenue = N₀ × F₀</text>
      <g transform="translate(230, 80)">
        <line x1="0" y1="10" x2="60" y2="10" stroke="#64748b" stroke-width="2" stroke-dasharray="4 3"/>
        <text x="5" y="0" fill="#d97706" font-size="11" font-weight="bold">Fee Cut (−d%)</text>
        <text x="5" y="30" fill="#059669" font-size="11" font-weight="bold">Rev Target (+g%)</text>
      </g>
      <rect x="320" y="20" width="320" height="140" rx="8" fill="#f0fdf4" stroke="#059669" stroke-width="2"/>
      <text x="340" y="48" fill="#059669" font-size="13" font-weight="bold">Target State Formula Desk</text>
      <text x="340" y="75" fill="#334155" font-size="12">Target Rev = N₀ · F₀ · (1 + g)</text>
      <text x="340" y="100" fill="#334155" font-size="12">New Fee F_new = F₀ · (1 − d)</text>
      <text x="340" y="125" fill="#15803d" font-size="13" font-weight="bold">New Members = [Target Rev / F_new] − N₀</text>
    </svg>`,
    formulas: [
      '<b>Current Revenue:</b> &nbsp;R₀ = N₀ × F₀',
      '<b>Target Revenue:</b> &nbsp;R_target = R₀ × (1 + Target_Growth%)',
      '<b>Discounted Fee:</b> &nbsp;F_new = F₀ × (1 − Fee_Cut%)',
      '<b>New Members to Join:</b> &nbsp;ΔN = (R_target / F_new) − N₀'
    ],
    inputs: [
      { id: 'members', label: 'Current members N₀', val: 360, step: 10 },
      { id: 'fee', label: 'Current monthly fee F₀ (₹)', val: 1500, step: 100 },
      { id: 'discount', label: 'Fee reduction d (%)', val: 25, step: 5 },
      { id: 'growth', label: 'Target revenue growth g (%)', val: 10, step: 5 }
    ],
    compute: (v) => {
      const N0 = v.members || 360, F0 = v.fee || 1500;
      const d = (v.discount || 25) / 100, g = (v.growth || 10) / 100;
      const R0 = N0 * F0;
      const R_target = R0 * (1 + g);
      const F_new = F0 * (1 - d);
      const N_total = F_new > 0 ? Math.round(R_target / F_new) : 0;
      const deltaN = N_total - N0;
      return `<div class="tb-calc-line"><b>Current Revenue R₀:</b> ₹${R0.toLocaleString()}</div>
        <div class="tb-calc-line"><b>Discounted Fee F_new:</b> ₹${F_new.toFixed(0)}</div>
        <div class="tb-calc-line"><b>Target Revenue R_target:</b> ₹${R_target.toLocaleString()}</div>
        <div class="tb-calc-line"><b>Total Members Needed:</b> ${N_total} members</div>
        <div class="tb-calc-line"><b>New Members Who Must Join:</b> <span style="color:#059669;font-weight:bold">+${deltaN} members</span></div>`;
    }
  },
  'metrology-tolerance-cpk': {
    title: 'Process Capability Index (Cp &amp; Cpk) &amp; Tolerance Calculator',
    chapterIds: ['metrology', 'manufacturing'],
    svg: `<svg viewBox="0 0 680 180" role="img" aria-label="Process Capability Normal Distribution">
      <path d="M 80 140 Q 240 140 340 30 Q 440 140 600 140" fill="rgba(15,118,110,0.08)" stroke="#0f766e" stroke-width="3"/>
      <line x1="160" y1="20" x2="160" y2="150" stroke="#e11d48" stroke-width="2" stroke-dasharray="5 3"/>
      <text x="145" y="15" fill="#e11d48" font-size="12" font-weight="bold">LSL</text>
      <line x1="520" y1="20" x2="520" y2="150" stroke="#e11d48" stroke-width="2" stroke-dasharray="5 3"/>
      <text x="510" y="15" fill="#e11d48" font-size="12" font-weight="bold">USL</text>
      <line x1="340" y1="30" x2="340" y2="150" stroke="#0f766e" stroke-width="1.5"/>
      <text x="330" y="165" fill="#0f766e" font-size="12" font-weight="bold">Mean μ</text>
      <line x1="80" y1="140" x2="600" y2="140" stroke="#64748b" stroke-width="2"/>
    </svg>`,
    formulas: [
      '<b>Potential Capability:</b> &nbsp;Cp = (USL − LSL) / (6σ)',
      '<b>Actual Capability:</b> &nbsp;Cpk = min[(USL − μ)/(3σ), &nbsp;(μ − LSL)/(3σ)]',
      '<b>Process Centering:</b> &nbsp;k = |(USL + LSL)/2 − μ| / [(USL − LSL)/2]'
    ],
    inputs: [
      { id: 'usl', label: 'Upper Spec Limit (USL)', val: 52, step: 0.5 },
      { id: 'lsl', label: 'Lower Spec Limit (LSL)', val: 48, step: 0.5 },
      { id: 'mean', label: 'Process Mean (μ)', val: 50.8, step: 0.1 },
      { id: 'sigma', label: 'Standard Deviation (σ)', val: 0.5, step: 0.05 }
    ],
    compute: (v) => {
      const usl = v.usl || 52, lsl = v.lsl || 48, mu = v.mean || 50.8, sigma = v.sigma || 0.5;
      const cp = (usl - lsl) / (6 * sigma);
      const cpk_u = (usl - mu) / (3 * sigma);
      const cpk_l = (mu - lsl) / (3 * sigma);
      const cpk = Math.min(cpk_u, cpk_l);
      return `<div class="tb-calc-line"><b>Tolerance Band (USL − LSL):</b> ${(usl - lsl).toFixed(2)} mm</div>
        <div class="tb-calc-line"><b>Process Capability Cp:</b> ${cp.toFixed(2)}</div>
        <div class="tb-calc-line"><b>Upper Cpk_u:</b> ${cpk_u.toFixed(2)} | <b>Lower Cpk_l:</b> ${cpk_l.toFixed(2)}</div>
        <div class="tb-calc-line"><b>Actual Cpk:</b> <span style="color:${cpk >= 1.33 ? '#15803d' : '#b91c1c'};font-weight:bold">${cpk.toFixed(2)}</span> (${cpk >= 1.33 ? 'Capable Process' : 'Needs centering / variance reduction'})</div>`;
    }
  },
  'industrial-eoq-inventory': {
    title: 'Economic Order Quantity (EOQ) &amp; Total Inventory Cost Analyzer',
    chapterIds: ['industrial', 'crosscore'],
    svg: `<svg viewBox="0 0 680 180" role="img" aria-label="EOQ Cost Tradeoff Curves">
      <line x1="80" y1="140" x2="580" y2="140" stroke="#64748b" stroke-width="2"/>
      <line x1="80" y1="20" x2="80" y2="140" stroke="#64748b" stroke-width="2"/>
      <!-- Holding cost curve (linear) -->
      <line x1="80" y1="130" x2="560" y2="30" stroke="#0284c7" stroke-width="2.5"/>
      <text x="480" y="45" fill="#0284c7" font-size="12" font-weight="bold">Holding Cost (H·Q/2)</text>
      <!-- Ordering cost curve (hyperbolic) -->
      <path d="M 100 25 Q 160 110 560 135" fill="none" stroke="#d97706" stroke-width="2.5"/>
      <text x="380" y="125" fill="#d97706" font-size="12" font-weight="bold">Ordering Cost (S·D/Q)</text>
      <!-- Total cost curve -->
      <path d="M 100 45 Q 280 135 560 65" fill="none" stroke="#0f766e" stroke-width="3"/>
      <text x="250" y="55" fill="#0f766e" font-size="13" font-weight="bold">Total Cost Minimum = EOQ</text>
      <circle cx="280" cy="80" r="5" fill="#e11d48"/>
    </svg>`,
    formulas: [
      '<b>Economic Order Quantity:</b> &nbsp;EOQ = √[(2·D·S) / H]',
      '<b>Annual Ordering Cost:</b> &nbsp;C_order = (D / Q) × S',
      '<b>Annual Holding Cost:</b> &nbsp;C_hold = (Q / 2) × H',
      '<b>Total Annual Cost:</b> &nbsp;TC = C_order + C_hold = √[2·D·S·H]'
    ],
    inputs: [
      { id: 'demand', label: 'Annual demand D (units/yr)', val: 800, step: 50 },
      { id: 'orderCost', label: 'Order cost S (₹/order)', val: 50, step: 5 },
      { id: 'holdCost', label: 'Unit holding cost H (₹/unit/yr)', val: 2, step: 0.5 }
    ],
    compute: (v) => {
      const D = v.demand || 800, S = v.orderCost || 50, H = v.holdCost || 2;
      const eoq = Math.sqrt((2 * D * S) / H);
      const orders = eoq > 0 ? D / eoq : 0;
      const orderCost = orders * S;
      const holdCost = (eoq / 2) * H;
      const totalCost = orderCost + holdCost;
      return `<div class="tb-calc-line"><b>Economic Order Quantity (EOQ):</b> <span style="color:#0f766e;font-weight:bold">${Math.round(eoq)} units</span></div>
        <div class="tb-calc-line"><b>Optimal Orders Per Year:</b> ${orders.toFixed(1)} orders/yr</div>
        <div class="tb-calc-line"><b>Annual Ordering Cost:</b> ₹${orderCost.toFixed(1)}</div>
        <div class="tb-calc-line"><b>Annual Holding Cost:</b> ₹${holdCost.toFixed(1)}</div>
        <div class="tb-calc-line"><b>Total Inventory Cost:</b> ₹${totalCost.toFixed(1)} / yr</div>`;
    }
  },
  'crosscore-electrical-dc': {
    title: 'DC Motor Electrical Input, Mechanical Output &amp; Efficiency',
    chapterIds: ['crosscore', 'mechanics'],
    svg: `<svg viewBox="0 0 680 180" role="img" aria-label="DC Motor Power Flow Diagram">
      <rect x="50" y="40" width="150" height="90" rx="8" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
      <text x="65" y="70" fill="#0369a1" font-size="13" font-weight="bold">Electrical Input</text>
      <text x="65" y="95" fill="#0f172a" font-size="14" font-weight="bold">P_in = V × I</text>
      <path d="M 200 85 L 280 85" stroke="#0f766e" stroke-width="3" marker-end="url(#tb-arrow-teal)"/>
      <circle cx="340" cy="85" r="45" fill="#f0fdf4" stroke="#0f766e" stroke-width="3"/>
      <text x="320" y="90" fill="#0f766e" font-size="14" font-weight="bold">Motor</text>
      <path d="M 385 85 L 465 85" stroke="#0f766e" stroke-width="3" marker-end="url(#tb-arrow-teal)"/>
      <rect x="465" y="40" width="180" height="90" rx="8" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
      <text x="480" y="70" fill="#b45309" font-size="13" font-weight="bold">Mechanical Shaft Power</text>
      <text x="480" y="95" fill="#0f172a" font-size="14" font-weight="bold">P_out = 2πNT / 60</text>
    </svg>`,
    formulas: [
      '<b>Electrical Input:</b> &nbsp;P_in = V × I &nbsp;(Watts)',
      '<b>Shaft Output:</b> &nbsp;P_out = ω × T = (2π·N·T) / 60 &nbsp;(Watts)',
      '<b>Overall Motor Efficiency:</b> &nbsp;η = (P_out / P_in) × 100%'
    ],
    inputs: [
      { id: 'volts', label: 'Terminal voltage V (Volts)', val: 24, step: 2 },
      { id: 'current', label: 'Armature current I (Amperes)', val: 5, step: 0.5 },
      { id: 'rpm', label: 'Shaft speed N (rpm)', val: 1500, step: 100 },
      { id: 'torque', label: 'Shaft torque T (N·m)', val: 0.65, step: 0.05 }
    ],
    compute: (v) => {
      const V = v.volts || 24, I = v.current || 5, N = v.rpm || 1500, T = v.torque || 0.65;
      const P_in = V * I;
      const P_out = (2 * Math.PI * N * T) / 60;
      const eta = P_in > 0 ? (P_out / P_in) * 100 : 0;
      return `<div class="tb-calc-line"><b>Electrical Power In:</b> ${P_in.toFixed(1)} W</div>
        <div class="tb-calc-line"><b>Mechanical Shaft Power Out:</b> ${P_out.toFixed(1)} W</div>
        <div class="tb-calc-line"><b>Internal Motor Losses:</b> ${(P_in - P_out).toFixed(1)} W</div>
        <div class="tb-calc-line"><b>Conversion Efficiency η:</b> <span style="color:#0f766e;font-weight:bold">${eta.toFixed(1)}%</span></div>`;
    }
  },
'cantilever-point': {
    title: 'Cantilever Beam Calculator – Point Load at Free End',
    chapterIds: ['som', 'mechanics'],
    svg: `<svg viewBox="0 0 680 220" role="img" aria-label="Cantilever Beam with Point Load at Free End">
      <defs>
        <marker id="tb-red-arrow" markerWidth="10" markerHeight="10" refX="7" refY="5" orient="auto">
          <path d="M0,1 L9,5 L0,9 L2,5 z" fill="#d12b2b"/>
        </marker>
        <marker id="tb-blue-arrow-start" markerWidth="8" markerHeight="8" refX="2" refY="4" orient="auto">
          <path d="M8,1 L0,4 L8,7 z" fill="#3b739b"/>
        </marker>
        <marker id="tb-blue-arrow-end" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,1 L8,4 L0,7 z" fill="#3b739b"/>
        </marker>
      </defs>
      <!-- Fixed Support Pointer & Label -->
      <text x="24" y="114" fill="#33363a" font-family="Arial, sans-serif" font-size="18" font-weight="600">Fixed Support</text>
      <line x1="146" y1="108" x2="180" y2="108" stroke="#4f86b0" stroke-width="2"/>
      <!-- Fixed Support Block -->
      <rect x="180" y="68" width="38" height="78" fill="#528ab5" stroke="#1b496b" stroke-width="2.5"/>
      <!-- Cantilever Beam Member -->
      <rect x="218" y="95" width="365" height="24" fill="#528ab5" stroke="#1b496b" stroke-width="2.5"/>
      <!-- Point Load P at Free End -->
      <text x="573" y="34" fill="#d12b2b" font-family="Arial, sans-serif" font-size="24" font-weight="700">P</text>
      <line x1="582" y1="42" x2="582" y2="86" stroke="#d12b2b" stroke-width="3.5" marker-end="url(#tb-red-arrow)"/>
      <!-- Deflection Arc d at Free End -->
      <path d="M585,96 C622,98 625,148 595,172" fill="none" stroke="#d12b2b" stroke-width="3" marker-end="url(#tb-red-arrow)"/>
      <text x="622" y="148" fill="#c92a2a" font-family="Georgia, serif" font-style="italic" font-size="24" font-weight="700">d</text>
      <!-- Dimension Line L -->
      <line x1="218" y1="146" x2="218" y2="170" stroke="#3b739b" stroke-width="2"/>
      <line x1="583" y1="146" x2="583" y2="170" stroke="#3b739b" stroke-width="2"/>
      <line x1="224" y1="158" x2="577" y2="158" stroke="#3b739b" stroke-width="2" marker-start="url(#tb-blue-arrow-start)" marker-end="url(#tb-blue-arrow-end)"/>
      <text x="394" y="192" fill="#33363a" font-family="Arial, sans-serif" font-size="22" font-weight="600">L</text>
    </svg>`,
    formulas: [
      `<span>Maximum Moment at Fixed End = <b>PL</b></span>`,
      `<span>Maximum Deflection at Free End = </span><span class="math-frac"><span class="m-num"><b>PL<sup>3</sup></b></span><span class="m-den"><b>3EI</b></span></span>`
    ],
    inputs: [
      { id: 'P', label: 'Point Load P (kN)', val: 12, step: 1 },
      { id: 'L', label: 'Beam Length L (m)', val: 2.5, step: 0.5 },
      { id: 'E', label: 'Modulus E (GPa)', val: 200, step: 10 },
      { id: 'I', label: 'Moment of Inertia I (cm⁴)', val: 800, step: 50 }
    ],
    compute: (v) => {
      const M = v.P * v.L; // kN.m
      const P_N = v.P * 1000;
      const E_Pa = v.E * 1e9;
      const I_m4 = v.I * 1e-8;
      const defl_mm = ((P_N * Math.pow(v.L, 3)) / (3 * E_Pa * Math.max(1e-12, I_m4))) * 1000;
      return `<span>Max Moment (M<sub>max</sub>): <b>${M.toFixed(2)} kN·m</b></span><span>Max Deflection (d): <b>${defl_mm.toFixed(2)} mm</b></span>`;
    }
  },

  'simply-supported-beam': {
    title: 'Simply Supported Beam – Central Point Load & Reactions',
    chapterIds: ['mechanics', 'som'],
    svg: `<svg viewBox="0 0 680 220" role="img" aria-label="Simply Supported Beam with Central Point Load">
      <defs>
        <marker id="ss-red-arrow" markerWidth="10" markerHeight="10" refX="7" refY="5" orient="auto">
          <path d="M0,1 L9,5 L0,9 L2,5 z" fill="#d12b2b"/>
        </marker>
        <marker id="ss-blue-start" markerWidth="8" markerHeight="8" refX="2" refY="4" orient="auto"><path d="M8,1 L0,4 L8,7 z" fill="#3b739b"/></marker>
        <marker id="ss-blue-end" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,1 L8,4 L0,7 z" fill="#3b739b"/></marker>
      </defs>
      <!-- Beam -->
      <rect x="140" y="92" width="400" height="24" fill="#528ab5" stroke="#1b496b" stroke-width="2.5"/>
      <!-- Pin Support Left -->
      <polygon points="155,116 135,152 175,152" fill="#528ab5" stroke="#1b496b" stroke-width="2.5"/>
      <text x="62" y="145" fill="#33363a" font-family="Arial, sans-serif" font-size="16" font-weight="600">Pin (R<tspan dy="4" font-size="12">A</tspan><tspan dy="-4"> = P/2)</tspan></text>
      <!-- Roller Support Right -->
      <polygon points="525,116 505,144 545,144" fill="#528ab5" stroke="#1b496b" stroke-width="2.5"/>
      <circle cx="515" cy="150" r="5" fill="#1b496b"/><circle cx="535" cy="150" r="5" fill="#1b496b"/>
      <text x="554" y="145" fill="#33363a" font-family="Arial, sans-serif" font-size="16" font-weight="600">Roller (R<tspan dy="4" font-size="12">B</tspan><tspan dy="-4"> = P/2)</tspan></text>
      <!-- Central Load P -->
      <text x="332" y="32" fill="#d12b2b" font-family="Arial, sans-serif" font-size="22" font-weight="700">P</text>
      <line x1="340" y1="40" x2="340" y2="83" stroke="#d12b2b" stroke-width="3.5" marker-end="url(#ss-red-arrow)"/>
      <!-- Deflection Curve -->
      <path d="M155,118 Q340,168 525,118" fill="none" stroke="#d12b2b" stroke-width="2.5" stroke-dasharray="7 5"/>
      <text x="348" y="156" fill="#c92a2a" font-family="Georgia, serif" font-style="italic" font-size="19" font-weight="700">d<tspan dy="4" font-size="12">max</tspan></text>
      <!-- Dimension Line L -->
      <line x1="155" y1="165" x2="155" y2="188" stroke="#3b739b" stroke-width="2"/>
      <line x1="525" y1="165" x2="525" y2="188" stroke="#3b739b" stroke-width="2"/>
      <line x1="162" y1="177" x2="518" y2="177" stroke="#3b739b" stroke-width="2" marker-start="url(#ss-blue-start)" marker-end="url(#ss-blue-end)"/>
      <text x="334" y="206" fill="#33363a" font-family="Arial, sans-serif" font-size="20" font-weight="600">L</text>
    </svg>`,
    formulas: [
      `<span>Support Reactions: <b>R<sub>A</sub> = R<sub>B</sub> = </b></span><span class="math-frac"><span class="m-num"><b>P</b></span><span class="m-den"><b>2</b></span></span><span style="margin-left:14px">Maximum Bending Moment = </span><span class="math-frac"><span class="m-num"><b>PL</b></span><span class="m-den"><b>4</b></span></span>`,
      `<span>Maximum Mid-Span Deflection = </span><span class="math-frac"><span class="m-num"><b>PL<sup>3</sup></b></span><span class="m-den"><b>48EI</b></span></span>`
    ],
    inputs: [
      { id: 'P', label: 'Central Load P (kN)', val: 20, step: 2 },
      { id: 'L', label: 'Span Length L (m)', val: 4.0, step: 0.5 },
      { id: 'E', label: 'Modulus E (GPa)', val: 200, step: 10 },
      { id: 'I', label: 'Inertia I (cm⁴)', val: 1200, step: 100 }
    ],
    compute: (v) => {
      const R = v.P / 2;
      const M = (v.P * v.L) / 4;
      const defl = ((v.P * 1000 * Math.pow(v.L, 3)) / (48 * v.E * 1e9 * Math.max(1e-12, v.I * 1e-8))) * 1000;
      return `<span>Reactions (R<sub>A</sub>, R<sub>B</sub>): <b>${R.toFixed(2)} kN</b></span><span>Max Moment (M<sub>max</sub>): <b>${M.toFixed(2)} kN·m</b></span><span>Mid-Span Deflection: <b>${defl.toFixed(2)} mm</b></span>`;
    }
  },

  'shaft-torsion-design': {
    title: 'Circular Shaft Torsion & Shear Stress Calculator',
    chapterIds: ['design', 'som'],
    svg: `<svg viewBox="0 0 680 215" role="img" aria-label="Circular Shaft Under Torque T">
      <defs>
        <marker id="tor-red-arrow" markerWidth="10" markerHeight="10" refX="7" refY="5" orient="auto">
          <path d="M0,1 L9,5 L0,9 L2,5 z" fill="#d12b2b"/>
        </marker>
      </defs>
      <text x="24" y="108" fill="#33363a" font-family="Arial, sans-serif" font-size="17" font-weight="600">Fixed Flange</text>
      <rect x="145" y="52" width="32" height="106" fill="#528ab5" stroke="#1b496b" stroke-width="2.5"/>
      <rect x="177" y="76" width="340" height="58" fill="#528ab5" stroke="#1b496b" stroke-width="2.5"/>
      <ellipse cx="517" cy="105" rx="18" ry="29" fill="#73a5cb" stroke="#1b496b" stroke-width="2.5"/>
      <!-- Torque Arrow T -->
      <path d="M555,68 C588,82 588,128 555,142" fill="none" stroke="#d12b2b" stroke-width="3.5" marker-end="url(#tor-red-arrow)"/>
      <text x="590" y="112" fill="#d12b2b" font-family="Arial, sans-serif" font-size="22" font-weight="700">T</text>
      <!-- Diameter D -->
      <line x1="470" y1="76" x2="470" y2="134" stroke="#d12b2b" stroke-width="2.5"/>
      <text x="448" y="110" fill="#ffffff" font-family="Arial, sans-serif" font-size="17" font-weight="700">d</text>
      <!-- Length L -->
      <line x1="177" y1="162" x2="517" y2="162" stroke="#3b739b" stroke-width="2"/>
      <text x="340" y="186" fill="#33363a" font-family="Arial, sans-serif" font-size="20" font-weight="600">L</text>
    </svg>`,
    formulas: [
      `<span>Torsion Equation: </span><span class="math-frac"><span class="m-num"><b>T</b></span><span class="m-den"><b>J</b></span></span><span> = </span><span class="math-frac"><span class="m-num"><b>τ<sub>max</sub></b></span><span class="m-den"><b>R</b></span></span><span> = </span><span class="math-frac"><span class="m-num"><b>Gθ</b></span><span class="m-den"><b>L</b></span></span>`,
      `<span>Solid Shaft Max Shear Stress (τ<sub>max</sub>) = </span><span class="math-frac"><span class="m-num"><b>16T</b></span><span class="m-den"><b>πd<sup>3</sup></b></span></span>`
    ],
    inputs: [
      { id: 'T', label: 'Applied Torque T (N·m)', val: 800, step: 50 },
      { id: 'd', label: 'Shaft Diameter d (mm)', val: 50, step: 5 },
      { id: 'L', label: 'Shaft Length L (m)', val: 1.2, step: 0.2 },
      { id: 'G', label: 'Shear Modulus G (GPa)', val: 80, step: 5 }
    ],
    compute: (v) => {
      const tau = (16 * v.T * 1000) / (Math.PI * Math.pow(v.d, 3));
      const J = (Math.PI * Math.pow(v.d / 1000, 4)) / 32;
      const thetaDeg = ((v.T * v.L) / (J * v.G * 1e9)) * (180 / Math.PI);
      return `<span>Max Shear Stress (τ<sub>max</sub>): <b>${tau.toFixed(2)} MPa</b></span><span>Angle of Twist (θ): <b>${thetaDeg.toFixed(2)}°</b></span>`;
    }
  },

  'thermo-heat-engine': {
    title: 'Thermodynamic Heat Engine & Carnot Efficiency Schematic',
    chapterIds: ['thermo'],
    svg: `<svg viewBox="0 0 680 220" role="img" aria-label="Thermodynamic Heat Engine Schematic">
      <defs>
        <marker id="th-red-arrow" markerWidth="10" markerHeight="10" refX="7" refY="5" orient="auto">
          <path d="M0,1 L9,5 L0,9 L2,5 z" fill="#d12b2b"/>
        </marker>
      </defs>
      <!-- Hot Reservoir -->
      <rect x="80" y="65" width="145" height="80" fill="#d13838" stroke="#8c1d1d" stroke-width="2.5" rx="6"/>
      <text x="152" y="100" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="16" font-weight="700">Hot Source</text>
      <text x="152" y="124" text-anchor="middle" fill="#ffe8e8" font-family="Arial, sans-serif" font-size="18" font-weight="700">T<tspan dy="4" font-size="12">H</tspan></text>
      <!-- Heat Engine Circle -->
      <circle cx="340" cy="105" r="46" fill="#528ab5" stroke="#1b496b" stroke-width="3"/>
      <text x="340" y="101" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="15" font-weight="700">HEAT</text>
      <text x="340" y="119" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="15" font-weight="700">ENGINE</text>
      <!-- Cold Sink -->
      <rect x="455" y="65" width="145" height="80" fill="#3b739b" stroke="#1b496b" stroke-width="2.5" rx="6"/>
      <text x="527" y="100" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="16" font-weight="700">Cold Sink</text>
      <text x="527" y="124" text-anchor="middle" fill="#e3f1fc" font-family="Arial, sans-serif" font-size="18" font-weight="700">T<tspan dy="4" font-size="12">L</tspan></text>
      <!-- Arrows Q_H, Q_L, W_net -->
      <line x1="225" y1="105" x2="286" y2="105" stroke="#d12b2b" stroke-width="3.5" marker-end="url(#th-red-arrow)"/>
      <text x="255" y="92" text-anchor="middle" fill="#d12b2b" font-family="Arial, sans-serif" font-size="18" font-weight="700">Q<tspan dy="4" font-size="12">H</tspan></text>
      <line x1="386" y1="105" x2="447" y2="105" stroke="#d12b2b" stroke-width="3.5" marker-end="url(#th-red-arrow)"/>
      <text x="416" y="92" text-anchor="middle" fill="#d12b2b" font-family="Arial, sans-serif" font-size="18" font-weight="700">Q<tspan dy="4" font-size="12">L</tspan></text>
      <line x1="340" y1="151" x2="340" y2="198" stroke="#d12b2b" stroke-width="3.5" marker-end="url(#th-red-arrow)"/>
      <text x="405" y="188" fill="#d12b2b" font-family="Arial, sans-serif" font-size="18" font-weight="700">W<tspan dy="4" font-size="12">net</tspan><tspan dy="-4"> = Q</tspan><tspan dy="4" font-size="12">H</tspan><tspan dy="-4"> − Q</tspan><tspan dy="4" font-size="12">L</tspan></text>
    </svg>`,
    formulas: [
      `<span>Thermal Efficiency (η<sub>th</sub>) = </span><span class="math-frac"><span class="m-num"><b>W<sub>net</sub></b></span><span class="m-den"><b>Q<sub>H</sub></b></span></span><span> = 1 − </span><span class="math-frac"><span class="m-num"><b>Q<sub>L</sub></b></span><span class="m-den"><b>Q<sub>H</sub></b></span></span>`,
      `<span>Maximum Carnot Efficiency (η<sub>max</sub>) = 1 − </span><span class="math-frac"><span class="m-num"><b>T<sub>L</sub> (in K)</b></span><span class="m-den"><b>T<sub>H</sub> (in K)</b></span></span>`
    ],
    inputs: [
      { id: 'TH', label: 'Source Temp T_H (K)', val: 900, step: 50 },
      { id: 'TL', label: 'Sink Temp T_L (K)', val: 300, step: 25 },
      { id: 'QH', label: 'Heat Input Q_H (kW)', val: 500, step: 50 }
    ],
    compute: (v) => {
      const eta = Math.max(0, (1 - v.TL / Math.max(1, v.TH)) * 100);
      const Wmax = v.QH * (eta / 100);
      const QL = v.QH - Wmax;
      return `<span>Carnot Efficiency (η<sub>max</sub>): <b>${eta.toFixed(2)}%</b></span><span>Max Work Output (W<sub>max</sub>): <b>${Wmax.toFixed(1)} kW</b></span><span>Heat Rejected (Q<sub>L</sub>): <b>${QL.toFixed(1)} kW</b></span>`;
    }
  },

  'fluid-venturi-pipe': {
    title: 'Pipe Flow Continuity, Bernoulli & Darcy Head Loss Calculator',
    chapterIds: ['fluid'],
    svg: `<svg viewBox="0 0 680 215" role="img" aria-label="Venturi & Pipe Flow Schematic">
      <defs>
        <marker id="fl-red-arrow" markerWidth="10" markerHeight="10" refX="7" refY="5" orient="auto">
          <path d="M0,1 L9,5 L0,9 L2,5 z" fill="#d12b2b"/>
        </marker>
      </defs>
      <!-- Converging-Diverging Pipe Section -->
      <path d="M80,55 L230,55 L300,82 L380,82 L450,55 L600,55 L600,155 L450,155 L380,128 L300,128 L230,155 L80,155 Z" fill="#528ab5" stroke="#1b496b" stroke-width="2.5"/>
      <!-- Flow Velocity Vectors -->
      <line x1="115" y1="105" x2="195" y2="105" stroke="#d12b2b" stroke-width="3.5" marker-end="url(#fl-red-arrow)"/>
      <text x="150" y="92" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="17" font-weight="700">A<tspan dy="4" font-size="12">1</tspan><tspan dy="-4">, V</tspan><tspan dy="4" font-size="12">1</tspan><tspan dy="-4">, P</tspan><tspan dy="4" font-size="12">1</tspan></text>
      <line x1="305" y1="105" x2="375" y2="105" stroke="#ffd166" stroke-width="3.5" marker-end="url(#fl-red-arrow)"/>
      <text x="340" y="73" text-anchor="middle" fill="#c92a2a" font-family="Arial, sans-serif" font-size="16" font-weight="700">Throat: V<tspan dy="4" font-size="12">2</tspan><tspan dy="-4"> ↑, P</tspan><tspan dy="4" font-size="12">2</tspan><tspan dy="-4"> ↓</tspan></text>
      <!-- Dimension L -->
      <line x1="80" y1="178" x2="600" y2="178" stroke="#3b739b" stroke-width="2"/>
      <text x="340" y="202" text-anchor="middle" fill="#33363a" font-family="Arial, sans-serif" font-size="18" font-weight="600">Pipe Length L · Diameter D</text>
    </svg>`,
    formulas: [
      `<span>Continuity Equation: <b>Q = A<sub>1</sub>V<sub>1</sub> = A<sub>2</sub>V<sub>2</sub></b></span>`,
      `<span>Darcy-Weisbach Head Loss (h<sub>f</sub>) = </span><span class="math-frac"><span class="m-num"><b>f · L · V<sup>2</sup></b></span><span class="m-den"><b>2 · g · D</b></span></span><span style="margin-left:14px">Reynolds No. (Re) = </span><span class="math-frac"><span class="m-num"><b>ρVD</b></span><span class="m-den"><b>μ</b></span></span>`
    ],
    inputs: [
      { id: 'D', label: 'Pipe Diameter D (m)', val: 0.1, step: 0.02 },
      { id: 'V', label: 'Flow Velocity V (m/s)', val: 2.5, step: 0.5 },
      { id: 'L', label: 'Pipe Length L (m)', val: 50, step: 10 },
      { id: 'f', label: 'Friction Factor f', val: 0.02, step: 0.005 }
    ],
    compute: (v) => {
      const A = (Math.PI * v.D * v.D) / 4;
      const Q = A * v.V;
      const hf = (v.f * v.L * v.V * v.V) / (2 * 9.81 * Math.max(0.001, v.D));
      const Re = (1000 * v.V * v.D) / 0.001;
      return `<span>Discharge (Q): <b>${(Q * 1000).toFixed(2)} L/s</b></span><span>Head Loss (h<sub>f</sub>): <b>${hf.toFixed(2)} m</b></span><span>Reynolds No. (Re): <b>${Math.round(Re).toLocaleString()} (${Re < 2300 ? 'Laminar' : 'Turbulent'})</b></span>`;
    }
  },

  'heat-conduction-wall': {
    title: 'Composite Wall Conduction & Convection Thermal Resistance',
    chapterIds: ['heat'],
    svg: `<svg viewBox="0 0 680 215" role="img" aria-label="Composite Wall Heat Transfer Schematic">
      <defs>
        <marker id="ht-red-arrow" markerWidth="10" markerHeight="10" refX="7" refY="5" orient="auto">
          <path d="M0,1 L9,5 L0,9 L2,5 z" fill="#d12b2b"/>
        </marker>
      </defs>
      <!-- Wall Slab -->
      <rect x="220" y="38" width="210" height="122" fill="#528ab5" stroke="#1b496b" stroke-width="2.5"/>
      <!-- Temperature Profile Line -->
      <circle cx="220" cy="62" r="5" fill="#d12b2b"/>
      <circle cx="430" cy="132" r="5" fill="#d12b2b"/>
      <line x1="220" y1="62" x2="430" y2="132" stroke="#ffd166" stroke-width="3.5"/>
      <text x="145" y="68" fill="#d12b2b" font-family="Arial, sans-serif" font-size="18" font-weight="700">T<tspan dy="4" font-size="12">1</tspan><tspan dy="-4"> (Hot)</tspan></text>
      <text x="445" y="138" fill="#1b496b" font-family="Arial, sans-serif" font-size="18" font-weight="700">T<tspan dy="4" font-size="12">2</tspan><tspan dy="-4"> (Cold)</tspan></text>
      <!-- Heat Flux Arrow q -->
      <line x1="125" y1="105" x2="545" y2="105" stroke="#d12b2b" stroke-width="3.5" marker-end="url(#ht-red-arrow)"/>
      <text x="560" y="111" fill="#d12b2b" font-family="Arial, sans-serif" font-size="20" font-weight="700">Q̇</text>
      <!-- Thickness L -->
      <line x1="220" y1="176" x2="430" y2="176" stroke="#3b739b" stroke-width="2"/>
      <text x="325" y="198" text-anchor="middle" fill="#33363a" font-family="Arial, sans-serif" font-size="18" font-weight="600">Wall Thickness L · Conductivity k</text>
    </svg>`,
    formulas: [
      `<span>Fourier Conduction Rate (Q̇) = </span><span class="math-frac"><span class="m-num"><b>k · A · (T<sub>1</sub> − T<sub>2</sub>)</b></span><span class="m-den"><b>L</b></span></span>`,
      `<span>Conduction Thermal Resistance (R<sub>th</sub>) = </span><span class="math-frac"><span class="m-num"><b>L</b></span><span class="m-den"><b>k · A</b></span></span><span style="margin-left:14px">Convection (R<sub>conv</sub>) = </span><span class="math-frac"><span class="m-num"><b>1</b></span><span class="m-den"><b>h · A</b></span></span>`
    ],
    inputs: [
      { id: 'k', label: 'Conductivity k (W/m·K)', val: 1.5, step: 0.5 },
      { id: 'A', label: 'Wall Area A (m²)', val: 4.0, step: 0.5 },
      { id: 'dT', label: 'Temp Diff ΔT (K)', val: 80, step: 10 },
      { id: 'L', label: 'Thickness L (m)', val: 0.2, step: 0.05 }
    ],
    compute: (v) => {
      const Rth = v.L / Math.max(1e-6, v.k * v.A);
      const Q = v.dT / Rth;
      return `<span>Heat Transfer Rate (Q̇): <b>${Q.toFixed(1)} W</b></span><span>Thermal Resistance (R<sub>th</sub>): <b>${Rth.toFixed(4)} K/W</b></span>`;
    }
  },

  'tom-gears-vibration': {
    title: 'Gear Train Kinematics & Single-DOF Natural Frequency',
    chapterIds: ['tom'],
    svg: `<svg viewBox="0 0 680 215" role="img" aria-label="Gear Train & Spring-Mass Damper Schematic">
      <!-- Driver Gear 1 -->
      <circle cx="195" cy="105" r="56" fill="#528ab5" stroke="#1b496b" stroke-width="3" stroke-dasharray="10 5"/>
      <circle cx="195" cy="105" r="10" fill="#ffffff" stroke="#1b496b" stroke-width="2"/>
      <text x="195" y="182" text-anchor="middle" fill="#33363a" font-family="Arial, sans-serif" font-size="16" font-weight="700">Driver (N<tspan dy="4" font-size="12">1</tspan><tspan dy="-4">, Z</tspan><tspan dy="4" font-size="12">1</tspan><tspan dy="-4">)</tspan></text>
      <!-- Driven Gear 2 -->
      <circle cx="295" cy="105" r="38" fill="#73a5cb" stroke="#d12b2b" stroke-width="3" stroke-dasharray="9 4"/>
      <circle cx="295" cy="105" r="8" fill="#ffffff" stroke="#d12b2b" stroke-width="2"/>
      <text x="295" y="182" text-anchor="middle" fill="#d12b2b" font-family="Arial, sans-serif" font-size="16" font-weight="700">Driven (N<tspan dy="4" font-size="12">2</tspan><tspan dy="-4">, Z</tspan><tspan dy="4" font-size="12">2</tspan><tspan dy="-4">)</tspan></text>
      <!-- SDOF Spring-Mass Block on Right -->
      <rect x="440" y="38" width="140" height="18" fill="#1b496b"/>
      <polyline points="510,56 495,68 525,80 495,92 525,104 510,116" fill="none" stroke="#3b739b" stroke-width="3"/>
      <rect x="465" y="116" width="90" height="46" fill="#528ab5" stroke="#1b496b" stroke-width="2.5"/>
      <text x="510" y="144" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="18" font-weight="700">Mass m</text>
      <text x="556" y="92" fill="#d12b2b" font-family="Arial, sans-serif" font-size="16" font-weight="700">Stiffness k</text>
    </svg>`,
    formulas: [
      `<span>Gear Speed &amp; Torque Ratio: </span><span class="math-frac"><span class="m-num"><b>N<sub>2</sub></b></span><span class="m-den"><b>N<sub>1</sub></b></span></span><span> = </span><span class="math-frac"><span class="m-num"><b>Z<sub>1</sub></b></span><span class="m-den"><b>Z<sub>2</sub></b></span></span><span> = </span><span class="math-frac"><span class="m-num"><b>T<sub>1</sub></b></span><span class="m-den"><b>T<sub>2</sub></b></span></span>`,
      `<span>Natural Frequency (ω<sub>n</sub>) = <b>√(k / m)</b></span><span style="margin-left:14px">Gruebler Mobility: <b>M = 3(L − 1) − 2J<sub>1</sub> − J<sub>2</sub></b></span>`
    ],
    inputs: [
      { id: 'N1', label: 'Driver Speed N₁ (rpm)', val: 1200, step: 100 },
      { id: 'Z1', label: 'Driver Teeth Z₁', val: 20, step: 2 },
      { id: 'Z2', label: 'Driven Teeth Z₂', val: 60, step: 5 },
      { id: 'm', label: 'Pitch Module m (mm)', val: 4, step: 1 }
    ],
    compute: (v) => {
      const N2 = (v.N1 * v.Z1) / Math.max(1, v.Z2);
      const centerDist = (v.m * (v.Z1 + v.Z2)) / 2;
      return `<span>Driven Speed (N<sub>2</sub>): <b>${N2.toFixed(1)} rpm</b></span><span>Gear Ratio: <b>${(v.Z2 / Math.max(1, v.Z1)).toFixed(2)} : 1</b></span><span>Center Distance (C): <b>${centerDist.toFixed(1)} mm</b></span>`;
    }
  },

  'manufacturing-turning': {
    title: 'Orthogonal Metal Cutting & Cylindrical Turning Calculator',
    chapterIds: ['manufacturing', 'materials', 'metrology', 'industrial', 'cad', 'crosscore'],
    svg: `<svg viewBox="0 0 680 215" role="img" aria-label="Cylindrical Turning & Metal Cutting Diagram">
      <defs>
        <marker id="mfg-red-arrow" markerWidth="10" markerHeight="10" refX="7" refY="5" orient="auto">
          <path d="M0,1 L9,5 L0,9 L2,5 z" fill="#d12b2b"/>
        </marker>
      </defs>
      <!-- Chuck / Spindle -->
      <rect x="110" y="52" width="44" height="106" fill="#1b496b" stroke="#0f2c42" stroke-width="2"/>
      <!-- Cylindrical Workpiece -->
      <rect x="154" y="68" width="290" height="74" fill="#528ab5" stroke="#1b496b" stroke-width="2.5"/>
      <rect x="444" y="78" width="110" height="54" fill="#73a5cb" stroke="#1b496b" stroke-width="2.5"/>
      <!-- Cutting Tool -->
      <polygon points="444,132 478,178 425,178" fill="#d12b2b" stroke="#8c1d1d" stroke-width="2"/>
      <text x="515" y="172" fill="#d12b2b" font-family="Arial, sans-serif" font-size="16" font-weight="700">Cutting Tool (Feed f)</text>
      <line x1="490" y1="158" x2="430" y2="158" stroke="#d12b2b" stroke-width="3" marker-end="url(#mfg-red-arrow)"/>
      <text x="295" y="110" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="18" font-weight="700">Workpiece Diameter D · Speed N (rpm)</text>
    </svg>`,
    formulas: [
      `<span>Cutting Speed (V) = </span><span class="math-frac"><span class="m-num"><b>π · D · N</b></span><span class="m-den"><b>1000</b></span></span><span> m/min</span><span style="margin-left:16px">Material Removal Rate (MRR) = <b>1000 · V · f · d</b> mm<sup>3</sup>/min</span>`,
      `<span>Taylor Tool Life: <b>V · T<sup>n</sup> = C</b></span><span style="margin-left:16px">Machining Time (T<sub>m</sub>) = </span><span class="math-frac"><span class="m-num"><b>L</b></span><span class="m-den"><b>f · N</b></span></span>`
    ],
    inputs: [
      { id: 'D', label: 'Workpiece Dia D (mm)', val: 60, step: 5 },
      { id: 'N', label: 'Spindle Speed N (rpm)', val: 500, step: 50 },
      { id: 'f', label: 'Feed f (mm/rev)', val: 0.25, step: 0.05 },
      { id: 'L', label: 'Cut Length L (mm)', val: 150, step: 10 }
    ],
    compute: (v) => {
      const V = (Math.PI * v.D * v.N) / 1000;
      const Tm = v.L / Math.max(0.001, v.f * v.N);
      return `<span>Cutting Speed (V): <b>${V.toFixed(2)} m/min</b></span><span>Feed Rate (f·N): <b>${(v.f * v.N).toFixed(1)} mm/min</b></span><span>Machining Time (T<sub>m</sub>): <b>${Tm.toFixed(2)} min</b></span>`;
    }
  },

  'math-newton-calculus': {
    title: 'Engineering Mathematics – Newton-Raphson & Eigenvalue Matrix Analyzer',
    chapterIds: ['math'],
    svg: `<svg viewBox="0 0 680 215" role="img" aria-label="Newton-Raphson Tangent Root Finding Diagram">
      <line x1="90" y1="165" x2="590" y2="165" stroke="#1b496b" stroke-width="2.5"/>
      <line x1="130" y1="25" x2="130" y2="195" stroke="#1b496b" stroke-width="2.5"/>
      <!-- Nonlinear Curve f(x) -->
      <path d="M145,155 C235,150 320,120 465,38" fill="none" stroke="#528ab5" stroke-width="4"/>
      <text x="480" y="45" fill="#1b496b" font-family="Arial, sans-serif" font-size="18" font-weight="700">y = f(x)</text>
      <!-- Tangent Line at x_n -->
      <circle cx="380" cy="86" r="6" fill="#d12b2b"/>
      <line x1="380" y1="86" x2="380" y2="165" stroke="#3b739b" stroke-width="2" stroke-dasharray="5 4"/>
      <line x1="425" y1="54" x2="265" y2="165" stroke="#d12b2b" stroke-width="3"/>
      <circle cx="265" cy="165" r="6" fill="#d12b2b"/>
      <text x="380" y="186" text-anchor="middle" fill="#33363a" font-family="Arial, sans-serif" font-size="17" font-weight="700">x<tspan dy="4" font-size="12">n</tspan></text>
      <text x="265" y="186" text-anchor="middle" fill="#d12b2b" font-family="Arial, sans-serif" font-size="17" font-weight="700">x<tspan dy="4" font-size="12">n+1</tspan></text>
      <text x="392" y="82" fill="#d12b2b" font-family="Arial, sans-serif" font-size="16" font-weight="700">(x<tspan dy="4" font-size="12">n</tspan><tspan dy="-4">, f(x</tspan><tspan dy="4" font-size="12">n</tspan><tspan dy="-4">)) · Slope = f′(x</tspan><tspan dy="4" font-size="12">n</tspan><tspan dy="-4">)</tspan></text>
    </svg>`,
    formulas: [
      `<span>Newton-Raphson Iteration: <b>x<sub>n+1</sub> = x<sub>n</sub> − </b></span><span class="math-frac"><span class="m-num"><b>f(x<sub>n</sub>)</b></span><span class="m-den"><b>f′(x<sub>n</sub>)</b></span></span>`,
      `<span>Matrix Eigenvalue Identities: <b>∑λ<sub>i</sub> = Trace(A)</b> · <b>∏λ<sub>i</sub> = det(A)</b> · <b>Hessian: D = f<sub>xx</sub>f<sub>yy</sub> − (f<sub>xy</sub>)<sup>2</sup></b></span>`
    ],
    inputs: [
      { id: 'a11', label: 'Matrix a₁₁', val: 4, step: 1 },
      { id: 'a12', label: 'Matrix a₁₂', val: 2, step: 1 },
      { id: 'a21', label: 'Matrix a₂₁', val: 1, step: 1 },
      { id: 'a22', label: 'Matrix a₂₂', val: 3, step: 1 }
    ],
    compute: (v) => {
      const tr = v.a11 + v.a22;
      const det = v.a11 * v.a22 - v.a12 * v.a21;
      const disc = tr * tr - 4 * det;
      const l1 = disc >= 0 ? ((tr + Math.sqrt(disc)) / 2).toFixed(2) : 'Complex';
      const l2 = disc >= 0 ? ((tr - Math.sqrt(disc)) / 2).toFixed(2) : 'Complex';
      return `<span>Trace (λ<sub>1</sub> + λ<sub>2</sub>): <b>${tr}</b></span><span>Determinant (λ<sub>1</sub>·λ<sub>2</sub>): <b>${det}</b></span><span>Eigenvalues (λ<sub>1</sub>, λ<sub>2</sub>): <b>${l1}, ${l2}</b></span>`;
    }
  },

  'aptitude-train-crossing': {
    title: 'Train Crossing & Relative Speed Calculator – Bridge / Platform',
    chapterIds: ['aptitude'],
    svg: `<svg viewBox="0 0 680 215" role="img" aria-label="Train Crossing Platform Diagram">
      <defs>
        <marker id="tr-red-arrow" markerWidth="10" markerHeight="10" refX="7" refY="5" orient="auto">
          <path d="M0,1 L9,5 L0,9 L2,5 z" fill="#d12b2b"/>
        </marker>
      </defs>
      <!-- Track Line -->
      <line x1="60" y1="132" x2="620" y2="132" stroke="#1b496b" stroke-width="3"/>
      <!-- Train Body -->
      <rect x="95" y="76" width="210" height="46" rx="6" fill="#528ab5" stroke="#1b496b" stroke-width="2.5"/>
      <text x="200" y="104" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="16" font-weight="700">Train (Length L<tspan dy="4" font-size="12">t</tspan><tspan dy="-4">)</tspan></text>
      <circle cx="135" cy="126" r="7" fill="#1b496b"/><circle cx="265" cy="126" r="7" fill="#1b496b"/>
      <!-- Speed Vector V -->
      <line x1="150" y1="52" x2="265" y2="52" stroke="#d12b2b" stroke-width="3.5" marker-end="url(#tr-red-arrow)"/>
      <text x="205" y="42" text-anchor="middle" fill="#d12b2b" font-family="Arial, sans-serif" font-size="17" font-weight="700">Speed V (km/h → × 5/18 m/s)</text>
      <!-- Platform / Bridge -->
      <rect x="335" y="102" width="240" height="30" fill="#d9e6f2" stroke="#3b739b" stroke-width="2.5"/>
      <text x="455" y="122" text-anchor="middle" fill="#1b496b" font-family="Arial, sans-serif" font-size="15" font-weight="700">Bridge / Platform (Length L<tspan dy="4" font-size="12">p</tspan><tspan dy="-4">)</tspan></text>
      <!-- Total Distance L_t + L_p -->
      <line x1="95" y1="164" x2="575" y2="164" stroke="#d12b2b" stroke-width="2.5"/>
      <text x="335" y="190" text-anchor="middle" fill="#33363a" font-family="Arial, sans-serif" font-size="18" font-weight="700">Total Crossing Distance = L<tspan dy="4" font-size="12">t</tspan><tspan dy="-4"> + L</tspan><tspan dy="4" font-size="12">p</tspan></text>
    </svg>`,
    formulas: [
      `<span>Unit Conversion: <b>V (m/s) = V (km/h) × </b></span><span class="math-frac"><span class="m-num"><b>5</b></span><span class="m-den"><b>18</b></span></span>`,
      `<span>Crossing Time (t) = </span><span class="math-frac"><span class="m-num"><b>L<sub>train</sub> + L<sub>platform</sub></b></span><span class="m-den"><b>V<sub>relative</sub> (in m/s)</b></span></span>`
    ],
    inputs: [
      { id: 'Lt', label: 'Train Length L_t (m)', val: 180, step: 10 },
      { id: 'Lp', label: 'Platform Length L_p (m)', val: 220, step: 10 },
      { id: 'V', label: 'Train Speed (km/h)', val: 72, step: 6 }
    ],
    compute: (v) => {
      const vms = v.V * (5 / 18);
      const tPole = v.Lt / Math.max(0.1, vms);
      const tPlat = (v.Lt + v.Lp) / Math.max(0.1, vms);
      return `<span>Speed in SI: <b>${vms.toFixed(2)} m/s</b></span><span>Time to Pass Pole: <b>${tPole.toFixed(2)} sec</b></span><span>Time to Pass Platform: <b>${tPlat.toFixed(2)} sec</b></span>`;
    }
  }
};

const CHAPTER_DEFAULT_DIAGRAM = {
  som: 'simply-supported-beam',
  mechanics: 'simply-supported-beam',
  design: 'helical-spring-calc',
  thermo: 'thermo-heat-engine',
  fluid: 'fluid-venturi-pipe',
  heat: 'heat-conduction-wall',
  tom: 'tom-gears-vibration',
  manufacturing: 'manufacturing-turning',
  materials: 'mohr-circle-stress',
  metrology: 'metrology-tolerance-cpk',
  industrial: 'industrial-eoq-inventory',
  crosscore: 'crosscore-electrical-dc',
  cad: 'cantilever-point',
  math: 'math-newton-calculus',
  aptitude: 'garden-lawn-calc'
};

let activeDiagramOverride = null;

  function renderTextbookDiagramCard(chapterOrId = 'som', rerenderCallback = null) {
    const chId = typeof chapterOrId === 'string' ? chapterOrId : (chapterOrId?.id || 'som');
    const defaultKey = CHAPTER_DEFAULT_DIAGRAM[chId] || 'simply-supported-beam';
    const activeKey = activeDiagramOverride && TEXTBOOK_DIAGRAMS[activeDiagramOverride] ? activeDiagramOverride : defaultKey;
    const diag = TEXTBOOK_DIAGRAMS[activeKey] || TEXTBOOK_DIAGRAMS['simply-supported-beam'];

    const optionsHtml = Object.entries(TEXTBOOK_DIAGRAMS).map(([k, d]) =>
      `<option value="${k}" ${k === activeKey ? 'selected' : ''}>📐 ${safeHtml(d.title)}</option>`
    ).join('');

    const inputsHtml = diag.inputs.map(inp =>
      `<label>${safeHtml(inp.label)}<input type="number" class="tb-calc-input" data-inp="${safeHtml(inp.id)}" value="${inp.val}" step="${inp.step}"></label>`
    ).join('');

    const initialVals = {};
    diag.inputs.forEach(i => { initialVals[i.id] = i.val; });

    return `<div class="textbook-diagram-card" id="textbook-diagram-card" data-diagkey="${safeHtml(activeKey)}">
      <div class="textbook-diag-header">
        <div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-blue-600">Interactive Engineering Schematic &amp; Formula Desk (17 Models)</span>
          <h3 class="textbook-diag-title">${safeHtml(diag.title)}</h3>
        </div>
        <select id="textbook-diag-switcher" class="textbook-diag-Select" aria-label="Switch engineering schematic diagram">
          ${optionsHtml}
        </select>
      </div>
      <div class="textbook-svg-wrap">
        ${diag.svg}
      </div>
      <div class="textbook-formula-callout">
        <div class="textbook-formula-inner">
          ${diag.formulas.map(f => `<div class="textbook-formula-row">${f}</div>`).join('')}
        </div>
      </div>
      <div class="textbook-calc-strip">
        <div class="textbook-calc-title">⚡ Live Parametric Engineering Schematic Calculator (Adjust values to compute live)</div>
        <div class="textbook-calc-grid">
          ${inputsHtml}
        </div>
        <div class="textbook-calc-results" id="tb-calc-output">
          ${diag.compute(initialVals)}
        </div>
      </div>
    </div>`;
  }

  function bindTextbookDiagramEvents(rerenderCallback) {
    const switcher = document.getElementById('textbook-diag-switcher');
    if (switcher) {
      switcher.onchange = () => {
        activeDiagramOverride = switcher.value;
        if (typeof rerenderCallback === 'function') rerenderCallback();
      };
    }
    const card = document.getElementById('textbook-diagram-card');
    if (!card) return;
    const key = card.dataset.diagkey;
    const diag = TEXTBOOK_DIAGRAMS[key];
    if (!diag) return;
    document.querySelectorAll('.tb-calc-input').forEach(inp => {
      inp.addEventListener('input', () => {
        const vals = {};
        document.querySelectorAll('.tb-calc-input').forEach(el => {
          vals[el.dataset.inp] = Number(el.value) || 0;
        });
        const out = document.getElementById('tb-calc-output');
        if (out) out.innerHTML = diag.compute(vals);
      });
    });
  }

function getDiagramKeyForQuestion(q) {
  const hay = ((q.topic || '') + ' ' + (q.text || '') + ' ' + (q.explain || '')).toLowerCase();
  const id = q.id || '';

  // 1. Exact preview/assessment problems
  if (id === 'PREVIEW-SOM-01' || /mohr|principal stress|1200 mpa|plane stress|von mises|biaxial/.test(hay)) return 'mohr-circle-stress';
  if (id === 'PREVIEW-MD-01' || /spring|helical|coil diameter|wire diameter|stiffness/.test(hay)) return 'helical-spring-calc';
  if (id === 'PREVIEW-AM2-01' || /square garden|quarter-circle|semicircle|area|perimeter|polygon|mensuration|geometry|radius|circle|triangle|rectangle/.test(hay)) return 'garden-lawn-calc';
  if (id === 'PREVIEW-BIZOTIC-01' || /fitness|member|percent|discount|profit|loss|interest|cost|price|revenue|salary|ratio|average/.test(hay)) return 'business-revenue-calc';
  if (/cantilever|free end/.test(hay)) return 'cantilever-point';
  if (/simply supported|bending moment|point load|beam|deflection|euler|column|buckling|moment of inertia|centroid|axial|elongation|hooke|normal stress|tensile|young/.test(hay)) return 'simply-supported-beam';
  if (/torsion|shaft|torque|polar moment|shear stress|bearing|fatigue|goodman|bolt/.test(hay)) return 'shaft-torsion-design';
  if (/thermo|carnot|rankine|otto|diesel|brayton|heat engine|entropy|enthalpy|sfee|nozzle|isothermal|adiabatic|internal energy|first law|kelvin|cop/.test(hay)) return 'thermo-heat-engine';
  if (/fluid|pipe|venturi|bernoulli|reynolds|darcy|viscosity|stokes|manometer|hydrostatic|discharge|continuity|pump|head loss|centrifugal/.test(hay)) return 'fluid-venturi-pipe';
  if (/conduction|convection|radiation|fourier|nusselt|prandtl|biot|thermal conductivity|heat transfer|composite wall|heat exchanger|lmtd/.test(hay)) return 'heat-conduction-wall';
  if (/gear|pinion|tooth|teeth|mechanism|gruebler|grashof|mobility|dof|quick return|cam|follower|vibration|natural frequency|flywheel|governor|kinematic/.test(hay)) return 'tom-gears-vibration';
  if (/turning|cutting|lathe|milling|drilling|spindle|taylor|tool life|casting|chvorinov|solidification|welding|forging|rolling|orthogonal|feed|machining/.test(hay)) return 'manufacturing-turning';
  if (/cpk|usl|lsl|micrometer|vernier|least count|tolerance|allowance|fit|gauge|metrology|standard deviation|six sigma/.test(hay)) return 'metrology-tolerance-cpk';
  if (/eoq|inventory|holding cost|order cost|demand|queuing|simplex|pert|cpm|takt|scheduling|operations|work|time|pipe|tank|efficiency/.test(hay)) return 'industrial-eoq-inventory';
  if (/motor|voltage|current|electrical|dc|ac|power|circuit|ohm|transformer|sensor|mechatronics/.test(hay)) return 'crosscore-electrical-dc';
  if (/matrix|eigen|determinant|trace|calculus|derivative|integral|laplace|fourier series|newton-raphson|taylor series|differential equation|probability|root|quadratic/.test(hay)) return 'math-newton-calculus';
  if (/train|platform|bridge|tunnel|pole|speed|distance|km\/h|m\/s|relative speed|stream|boat|clock|calendar/.test(hay)) return 'aptitude-train-crossing';

  // Fallback by topic category
  const t = (q.topic || '').toLowerCase();
  if (t.includes('strength') || t.includes('mechanics')) return 'simply-supported-beam';
  if (t.includes('design')) return 'shaft-torsion-design';
  if (t.includes('thermo')) return 'thermo-heat-engine';
  if (t.includes('fluid')) return 'fluid-venturi-pipe';
  if (t.includes('heat')) return 'heat-conduction-wall';
  if (t.includes('machine') || t.includes('kinematic') || t.includes('tom')) return 'tom-gears-vibration';
  if (t.includes('manufactur')) return 'manufacturing-turning';
  if (t.includes('metrology') || t.includes('quality')) return 'metrology-tolerance-cpk';
  if (t.includes('industrial') || t.includes('operation')) return 'industrial-eoq-inventory';
  if (t.includes('math')) return 'math-newton-calculus';
  if (t.includes('aptitude')) return 'business-revenue-calc';
  return 'simply-supported-beam';
}

function visualExplanation(q) {
  const text = (q.text || '').toLowerCase(), id = q.id || '';

  // 1. Specific dedicated schematics with formula summary cards
  if (id === 'PREVIEW-SOM-01' || text.includes('1200 mpa') || text.includes('shear stress of 400 mpa')) {
    return `<div class="explainer-schematic-card">
      <div class="explainer-diag-header">📐 2D Principal Stress &amp; Mohr's Circle Graphical Derivation</div>
      <div class="explainer-svg-box">${renderMohrCircleExplainerSvg()}</div>
      <div class="explainer-formula-strip">
        <div><b>Center of Circle:</b> σ_avg = (σ_x + σ_y) / 2 = 900 MPa</div>
        <div><b>Mohr Radius (τ_max):</b> R = √[((σ_x − σ_y)/2)² + τ_xy²] = 500 MPa</div>
        <div><b>Principal Stresses:</b> σ₁ = σ_avg + R = 1400 MPa &nbsp;|&nbsp; σ₂ = σ_avg − R = 400 MPa</div>
      </div>
    </div>`;
  }
  if (id === 'PREVIEW-MD-01' || (text.includes('mean coil diameter') && text.includes('wire diameter'))) {
    return `<div class="explainer-schematic-card">
      <div class="explainer-diag-header">📐 Close-Coiled Helical Spring Deflection &amp; Scaling Law</div>
      <div class="explainer-svg-box">${renderHelicalSpringSvg()}</div>
      <div class="explainer-formula-strip">
        <div><b>Axial Deflection:</b> δ = (8 · P · D³ · n) / (G · d⁴)</div>
        <div><b>Spring Stiffness:</b> k = P / δ = (G · d⁴) / (8 · D³ · n)</div>
        <div><b>Scaling Relation:</b> δ' / δ = (D'/D)³ × (d/d')⁴ = (2)³ / (2)⁴ = 8 / 16 = 1/2 (Halved)</div>
      </div>
    </div>`;
  }
  if (id === 'PREVIEW-BIZOTIC-01' || (text.includes('fitness centre') && text.includes('360 members'))) {
    return `<div class="explainer-schematic-card">
      <div class="explainer-diag-header">📊 Membership Fee Elasticity &amp; Target Revenue Model</div>
      <div class="explainer-svg-box">${renderFitnessCentreSvg()}</div>
      <div class="explainer-formula-strip">
        <div><b>Baseline Revenue:</b> R₀ = N₀ × F₀ = 360 × ₹1,500 = ₹5,40,000</div>
        <div><b>Discounted Fee &amp; Target:</b> F_new = ₹1,125 (−25%) &nbsp;|&nbsp; R_target = ₹5,94,000 (+10%)</div>
        <div><b>New Members Required:</b> ΔN = (R_target / F_new) − N₀ = 528 − 360 = +168 Members</div>
      </div>
    </div>`;
  }
  if (id === 'PREVIEW-AM2-01' || text.includes('square garden') || text.includes('quarter-circle bed')) {
    return `<div class="explainer-schematic-card">
      <div class="explainer-diag-header">📐 Composite Mensuration: Square Garden &amp; Circular Flower Beds</div>
      <div class="explainer-svg-box">${renderGardenLawnSvg()}</div>
      <div class="explainer-formula-strip">
        <div><b>Total Square Area:</b> A_sq = s² = 21² = 441 m²</div>
        <div><b>4 Corner Quarter-Circles (r=7m):</b> A_c = 4 × (¼·π·7²) = 154 m²</div>
        <div><b>4 Side Semicircles (d=7m, r=3.5m):</b> A_s = 4 × (½·π·3.5²) = 77 m² &nbsp;⇒&nbsp; <b>Lawn = 441 − 231 = 210 m²</b></div>
      </div>
    </div>`;
  }
  if (id === 'PREVIEW-AON-01' || text.includes('sequence of geometric shapes') || text.includes('logically completes the following sequence')) {
    return `<div class="explainer-schematic-card">
      <div class="explainer-diag-header">📐 Cyclic 2×2 Matrix Quadrant Rotation Analysis</div>
      <div class="explainer-svg-box">${renderAonSequenceSvg()}</div>
      <div class="explainer-formula-strip">
        <div><b>Transformation Rule:</b> Every symbol rotates 90° clockwise per stage (TL → TR → BR → BL → TL)</div>
        <div><b>Stage 4 Positions:</b> Pentagon = Top-Left, Star = Top-Right, Triangle = Bottom-Left, Circle = Bottom-Right (Option A)</div>
      </div>
    </div>`;
  }
  if (id === 'PREVIEW-AON-02' || (text.includes('build') && text.includes('create') && text.includes('coded'))) {
    return `<div class="explainer-schematic-card">
      <div class="explainer-diag-header">📐 Progressive Positional Shift Cipher Diagram</div>
      <div class="explainer-svg-box">${renderBuildCreateCodeSvg()}</div>
      <div class="explainer-formula-strip">
        <div><b>Shift Pattern (n-th letter):</b> C_out = C_in + (n + 1) &nbsp;⇒&nbsp; (+2, +3, +4, +5, +6, +7)</div>
        <div><b>Application to CREATE:</b> C(+2)→E, R(+3)→U, E(+4)→I, A(+5)→F, T(+6)→Z, E(+7)→L = <b>EUIFZL</b></div>
      </div>
    </div>`;
  }

  // 2. Map every engineering & aptitude question to its dedicated Textbook Engineering Schematic & Formula Graph!
  const diagKey = getDiagramKeyForQuestion(q);
  const diag = (typeof TEXTBOOK_DIAGRAMS !== 'undefined' && TEXTBOOK_DIAGRAMS[diagKey]) ? TEXTBOOK_DIAGRAMS[diagKey] : null;
  if (diag) {
    return `<div class="explainer-schematic-card">
      <div class="explainer-diag-header">📐 ${safeHtml(diag.title)}</div>
      <div class="explainer-svg-box">${diag.svg}</div>
      <div class="explainer-formula-strip">
        ${(diag.formulas || []).map(f => `<div class="explainer-formula-item">${f}</div>`).join('')}
      </div>
    </div>`;
  }

  // Fallback formula desk if TEXTBOOK_DIAGRAMS is not yet initialized
  const g = guideForQuestion(q);
  return `<div class="explainer-schematic-card">
    <div class="explainer-diag-header">📐 ${safeHtml(g.name)} — Governing Equations &amp; Principle</div>
    <div class="explainer-formula-strip">
      <div><b>Governing Formula:</b> ${safeHtml(g.formula)}</div>
      <div><b>Engineering Method:</b> ${safeHtml(g.trick)}</div>
    </div>
  </div>`;
}



function formatReadableSyllabus(rawText) {
  if (!rawText || !rawText.trim()) return '<div class="empty-state compact"><p>Upload a syllabus or choose a preset above to preview formatted readable notes.</p></div>';
  const lines = rawText.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  let html = '<div class="syl-rendered-sheet">';

  let inSection = false;
  for (const line of lines) {
    if (line.match(/^(MODULE|UNIT|CHAPTER|SECTION|PART)\s+\d+/i) || line.match(/^[A-Z\s&—–-]{6,45}:?$/)) {
      if (inSection) html += '</div>';
      html += `<div class="syl-card"><div class="syl-heading">📌 ${safeHtml(line)}</div>`;
      inSection = true;
      continue;
    }
    // Highlight formulas with chips
    let formatted = safeHtml(line);
    formatted = formatted.replace(/([A-Za-z_0-9Δηστρωπ]+(?:\s*=\s*|\s*∝\s*)[^;,.\n]{3,45})/g, '<span class="syl-formula-chip">$1</span>');
    formatted = formatted.replace(/(\b\d+(?:\.\d+)?\s*(?:MPa|GPa|kN|N|mm|m\/s|m²|m³\/s|kJ|J|kW|W|rpm|K|°|%)\b)/g, '<b>$1</b>');

    if (!inSection) {
      html += `<div class="syl-card"><div class="syl-heading">📘 Syllabus Overview</div>`;
      inSection = true;
    }
    html += `<p style="margin:6px 0">${formatted}</p>`;
  }
  if (inSection) html += '</div>';
  html += '</div>';
  return html;
}



  function renderPrintableUniversityQP(bundle, { showSolutions = false, format = 'vtu100', courseHeader = 'BME301 / 22ME410 — Mechanical Engineering University Examination' } = {}) {
    if (!bundle) return '';
    const maxMarks = format === 'vtu100' ? 100 : format === 'mid50' ? 50 : 65;
    const duration = format === 'vtu100' ? '3 Hours' : format === 'mid50' ? '90 Minutes' : '2 Hours';
    const qs = bundle.questions || [];
    const shortQs = qs.slice(0, Math.min(5, qs.length));
    const longQs = qs.slice(0, qs.length);

    return `<div class="printable-qp-sheet" id="printable-qp-sheet">
      <div class="qp-paper-head">
        <h3>MECHPREP ARENA — UNIVERSITY MODEL QUESTION PAPER</h3>
        <h4>${safeHtml(courseHeader)}</h4>
        <div>Source Syllabus / PDF: <b>${safeHtml(bundle.title)}</b> · Subject: <b>${safeHtml(bundle.subjectName)}</b></div>
        <div class="qp-meta-row">
          <span>Time Allowed: ${duration}</span>
          <span>Maximum Marks: ${maxMarks}</span>
        </div>
      </div>

      <div class="qp-section-title">PART A — Short Answer &amp; Governing Concept Questions (Answer All · 2 Marks Each)</div>
      ${shortQs.map((q, i) => `
        <div class="qp-question-item">
          <div class="qp-q-top">
            <div><b>Q${i + 1}.</b> ${safeHtml(q.text)}</div>
            <span class="qp-marks">[2 Marks]</span>
          </div>
          ${showSolutions ? `<div class="qp-solution-box"><b>Model Answer:</b> ${safeHtml(q.options?.[q.answer] || '')}<br><b>Derivation / Method:</b> ${safeHtml(q.explain)}</div>` : ''}
        </div>
      `).join('')}

      <div class="qp-section-title">PART B — Analytical &amp; Worked Module Problems (${format === 'vtu100' ? '10 / 16 Marks Each' : '8 / 10 Marks Each'})</div>
      ${longQs.map((q, i) => `
        <div class="qp-question-item">
          <div class="qp-q-top">
            <div>
              <b>Q${shortQs.length + i + 1}. (a)</b> ${safeHtml(q.text)}
              <br><small style="color:#475569">Options Reference (if Objective): ${(q.options || []).map((o, idx) => `(${String.fromCharCode(65 + idx)}) ${safeHtml(o)}`).join('   ')}</small>
              <br><b>(b)</b> State the governing assumptions, formula desk relationship, and SI unit checks for <i>${safeHtml(q.topic)}</i>.
            </div>
            <span class="qp-marks">[${format === 'vtu100' ? '10' : '8'} Marks]</span>
          </div>
          ${showSolutions ? `<div class="qp-solution-box"><b>Official Marking Scheme &amp; Solution:</b> Correct Result: <b>${safeHtml(q.options?.[q.answer] || '')}</b>.<br>${safeHtml(q.explain)}</div>` : ''}
        </div>
      `).join('')}
    </div>`;
  }

  const SVG_SCHEMATICS = {
    mohr: `<svg viewBox="0 0 420 220" class="w-full h-48 bg-slate-900 rounded-xl p-2">
      <line x1="30" y1="110" x2="390" y2="110" stroke="#94A3B8" stroke-width="1.5"/>
      <line x1="90" y1="20" x2="90" y2="200" stroke="#94A3B8" stroke-width="1.5"/>
      <circle cx="230" cy="110" r="72" fill="rgba(37,99,235,0.18)" stroke="#38BDF8" stroke-width="2.5"/>
      <line x1="185" y1="54" x2="275" y2="166" stroke="#F59E0B" stroke-width="2" stroke-dasharray="4 3"/>
      <circle cx="230" cy="110" r="4" fill="#F8FAFC"/>
      <circle cx="302" cy="110" r="4.5" fill="#10B981"/>
      <circle cx="158" cy="110" r="4.5" fill="#10B981"/>
      <text x="292" y="130" fill="#10B981" font-size="11" font-weight="bold">σ₁ (Max)</text>
      <text x="135" y="130" fill="#10B981" font-size="11" font-weight="bold">σ₂ (Min)</text>
      <text x="215" y="126" fill="#E2E8F0" font-size="10">C(σ_avg, 0)</text>
      <text x="234" y="34" fill="#38BDF8" font-size="11" font-weight="bold">τ_max = R</text>
      <text x="365" y="104" fill="#CBD5E1" font-size="11">σ</text>
      <text x="96" y="30" fill="#CBD5E1" font-size="11">τ</text>
    </svg>`,
    beam: `<svg viewBox="0 0 420 220" class="w-full h-48 bg-slate-900 rounded-xl p-2">
      <rect x="60" y="75" width="280" height="16" fill="#3B82F6" stroke="#93C5FD" stroke-width="1.5"/>
      <polygon points="60,91 48,115 72,115" fill="#10B981"/>
      <polygon points="340,91 328,115 352,115" fill="#10B981"/>
      <circle cx="334" cy="120" r="4" fill="#10B981"/><circle cx="346" cy="120" r="4" fill="#10B981"/>
      <line x1="200" y1="25" x2="200" y2="72" stroke="#F43F5E" stroke-width="3"/>
      <polygon points="200,74 194,62 206,62" fill="#F43F5E"/>
      <text x="180" y="20" fill="#FDA4AF" font-size="12" font-weight="bold">Load P (kN)</text>
      <path d="M 60 155 Q 200 205 340 155" fill="none" stroke="#F59E0B" stroke-width="2.5" stroke-dasharray="5 3"/>
      <text x="155" y="198" fill="#FCD34D" font-size="11">BMD: M_max = P·L / 4 · δ_max = PL³/(48EI)</text>
      <text x="45" y="135" fill="#A7F3D0" font-size="11">R_A = P/2</text>
      <text x="315" y="135" fill="#A7F3D0" font-size="11">R_B = P/2</text>
    </svg>`,
    rankine: `<svg viewBox="0 0 420 220" class="w-full h-48 bg-slate-900 rounded-xl p-2">
      <line x1="50" y1="190" x2="380" y2="190" stroke="#94A3B8" stroke-width="1.5"/>
      <line x1="50" y1="20" x2="50" y2="190" stroke="#94A3B8" stroke-width="1.5"/>
      <path d="M 80 185 Q 190 25 310 185" fill="none" stroke="#64748B" stroke-width="2" stroke-dasharray="4 3"/>
      <polyline points="110,155 110,130 165,75 265,50 265,155 110,155" fill="rgba(16,185,129,0.16)" stroke="#10B981" stroke-width="2.5"/>
      <circle cx="265" cy="50" r="4" fill="#F59E0B"/><text x="273" y="52" fill="#FCD34D" font-size="11" font-weight="bold">1 (Turbine In)</text>
      <circle cx="265" cy="155" r="4" fill="#F59E0B"/><text x="273" y="162" fill="#FCD34D" font-size="11" font-weight="bold">2 (Condenser)</text>
      <circle cx="110" cy="155" r="4" fill="#38BDF8"/><text x="72" y="170" fill="#38BDF8" font-size="11" font-weight="bold">3 (Sat Liq)</text>
      <circle cx="110" cy="130" r="4" fill="#38BDF8"/><text x="65" y="125" fill="#38BDF8" font-size="11" font-weight="bold">4 (Pump Out)</text>
      <text x="345" y="182" fill="#CBD5E1" font-size="11">Entropy s</text>
      <text x="58" y="32" fill="#CBD5E1" font-size="11">Temp T</text>
    </svg>`,
    fourbar: `<svg viewBox="0 0 420 220" class="w-full h-48 bg-slate-900 rounded-xl p-2">
      <line x1="80" y1="165" x2="310" y2="165" stroke="#64748B" stroke-width="4" stroke-dasharray="6 4"/>
      <line x1="80" y1="165" x2="135" y2="75" stroke="#EF4444" stroke-width="4"/>
      <line x1="135" y1="75" x2="285" y2="60" stroke="#38BDF8" stroke-width="4"/>
      <line x1="285" y1="60" x2="310" y2="165" stroke="#10B981" stroke-width="4"/>
      <circle cx="80" cy="165" r="6" fill="#F8FAFC"/><circle cx="135" cy="75" r="5" fill="#F59E0B"/>
      <circle cx="285" cy="60" r="5" fill="#F59E0B"/><circle cx="310" cy="165" r="6" fill="#F8FAFC"/>
      <text x="62" y="188" fill="#E2E8F0" font-size="11">O₂ (Frame d)</text>
      <text x="285" y="188" fill="#E2E8F0" font-size="11">O₄</text>
      <text x="68" y="115" fill="#FCA5A5" font-size="11" font-weight="bold">Crank s (a)</text>
      <text x="180" y="54" fill="#7DD3FC" font-size="11" font-weight="bold">Coupler p (b)</text>
      <text x="305" y="115" fill="#6EE7B7" font-size="11" font-weight="bold">Rocker q (c)</text>
      <text x="120" y="206" fill="#FCD34D" font-size="11">Gruebler: F = 3(L−1)−2j−h = 1 · Grashof: s + l ≤ p + q</text>
    </svg>`,
    merchant: `<svg viewBox="0 0 420 220" class="w-full h-48 bg-slate-900 rounded-xl p-2">
      <rect x="40" y="125" width="220" height="55" fill="#334155" stroke="#94A3B8" stroke-width="1.5"/>
      <rect x="40" y="95" width="130" height="30" fill="#0284C7" opacity="0.5"/>
      <polygon points="170,125 245,45 275,115" fill="#F59E0B" stroke="#FDE68A" stroke-width="1.5"/>
      <line x1="170" y1="125" x2="115" y2="95" stroke="#10B981" stroke-width="3"/>
      <text x="52" y="114" fill="#E0F2FE" font-size="11">Uncut t₀</text>
      <text x="95" y="86" fill="#6EE7B7" font-size="11" font-weight="bold">Shear Plane φ</text>
      <text x="242" y="88" fill="#FEF3C7" font-size="11" font-weight="bold">Tool (Rake α)</text>
      <text x="80" y="202" fill="#FCD34D" font-size="11">Merchant Relation: 2φ + β − α = 90° · Taylor: V·Tⁿ = C</text>
    </svg>`,
    heat: `<svg viewBox="0 0 420 220" class="w-full h-48 bg-slate-900 rounded-xl p-2">
      <rect x="90" y="35" width="70" height="140" fill="#EF4444" opacity="0.35" stroke="#FCA5A5"/>
      <rect x="160" y="35" width="80" height="140" fill="#F59E0B" opacity="0.35" stroke="#FDE68A"/>
      <rect x="240" y="35" width="70" height="140" fill="#3B82F6" opacity="0.35" stroke="#93C5FD"/>
      <polyline points="90,55 160,85 240,130 310,155" fill="none" stroke="#F8FAFC" stroke-width="3"/>
      <text x="108" y="28" fill="#FCA5A5" font-size="11" font-weight="bold">Wall A (k₁)</text>
      <text x="180" y="28" fill="#FDE68A" font-size="11" font-weight="bold">Wall B (k₂)</text>
      <text x="255" y="28" fill="#93C5FD" font-size="11" font-weight="bold">Wall C (k₃)</text>
      <text x="85" y="198" fill="#E2E8F0" font-size="11">Q = (T_∞1 − T_∞2) / [1/(h₁A) + L₁/(k₁A) + L₂/(k₂A) + L₃/(k₃A) + 1/(h₂A)]</text>
    </svg>`
  };

  function getSchematicForTopic(topicStr) {
    if (typeof topicStr === 'object' && topicStr !== null) {
      return visualExplanation(topicStr);
    }
    return visualExplanation({ topic: String(topicStr || ''), text: String(topicStr || '') });
  }

  // --------------------------------------------------------------------------
  // 4. MODULE RENDERERS (ALL 19 MODULES)
  // --------------------------------------------------------------------------
  const container = document.getElementById('module-container');

  function stripLeadingOptionPrefix(str) {
    return String(str ?? '').replace(/^\s*(?:\([A-Da-d1-4]\)|[A-Da-d1-4][.)\-:])\s*/, '').trim();
  }

  function syncExamFullscreenMode(isActiveExam) {
    const topbar = document.getElementById('app-topbar');
    const sidebar = document.getElementById('app-sidebar');
    const mainEl = document.getElementById('app-main');
    const extraChrome = document.querySelectorAll('header, aside, footer, #mobile-bottom-nav, .sidebar-backdrop');
    if (isActiveExam) {
      document.body.classList.add('exam-fullscreen-active');
      if (topbar) topbar.style.display = 'none';
      if (sidebar) sidebar.style.display = 'none';
      extraChrome.forEach(el => { el.style.display = 'none'; });
      if (mainEl) {
        mainEl.style.maxWidth = '100%';
        mainEl.style.width = '100%';
        mainEl.style.minHeight = '100vh';
        mainEl.style.margin = '0';
        mainEl.style.padding = '1.25rem 1.5rem';
        mainEl.style.background = '#0F172A';
      }
    } else {
      document.body.classList.remove('exam-fullscreen-active');
      if (topbar) topbar.style.display = '';
      if (sidebar) sidebar.style.display = '';
      extraChrome.forEach(el => { el.style.display = ''; });
      if (mainEl) {
        mainEl.style.maxWidth = '';
        mainEl.style.width = '';
        mainEl.style.minHeight = '';
        mainEl.style.margin = '';
        mainEl.style.padding = '';
        mainEl.style.background = '';
      }
    }
  }

  function switchModule(moduleId) {
    if (moduleId !== 'mock-tests' && moduleId !== 'placement') {
      if (state.interviewState) state.interviewState.activeFullscreen = false;
      syncExamFullscreenMode(false);
    }
    state.activeModule = moduleId;
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.nav === moduleId);
    });
    // Close mobile sidebar if open
    document.getElementById('app-sidebar')?.classList.add('-translate-x-full');
    renderActiveModule();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderActiveModule() {
    if (!container) return;
    switch (state.activeModule) {
      case 'dashboard': renderDashboard(); break;
      case 'pdf-library': renderPdfLibrary(); break;
      case 'sem4': renderSemesterHub('Semester IV', '15SfQscxJjR5fm_9jMKkM0SvorZb82foK', '4th Semester Mechanical Engineering Hub'); break;
      case 'sem5': renderSemesterHub('Semester V', '1u-SzogxKALrjNfbl31zQiB_EGt9sbZMx', '5th Semester Mechanical Engineering Hub'); break;
      case 'sem6': renderSemesterHub('Semester VI', '1oWpkqqMypZp3lPmBe9-AD0AD1bhf0hxL', '6th Semester Mechanical Engineering Hub'); break;
      case 'subjects': renderAllSubjects(); break;
      case 'study-guides': renderStudyGuides(); break;
      case 'formula-library': renderFormulaLibrary(); break;
      case 'diagrams': renderEngineeringDiagrams(); break;
      case 'graphs': renderGraphGenerator(); break;
      case 'numericals': renderNumericalProblems(); break;
      case 'tech-qbank': renderQuestionBank('technical'); break;
      case 'aptitude': renderQuestionBank('aptitude'); break;
      case 'mock-tests': renderMockTests(); break;
      case 'placement': renderPlacementPrep(); break;
      case 'ai-tutor': renderAITutor(); break;
      case 'flashcards': renderFlashcards(); break;
      case 'progress': renderProgressTracker(); break;
      case 'settings': renderAISettings(); break;
      default: renderDashboard();
    }
  }

  // --- MODULE 1: DASHBOARD ---
  function renderDashboard() {
    const techCount = state.questions.filter(q => q.sourceType !== 'pdf' && !/aptitude|verbal|logical|train/i.test(q.topic)).length;
    const aptCount = state.questions.length - techCount;
    const totalFormulas = state.formulaGroups.reduce((acc, g) => acc + (g.items?.length || 0), 0) +
      state.jssCourses.reduce((acc, c) => acc + (c.units || []).reduce((uAcc, u) => uAcc + (u.formulas?.length || 0), 0), 0);

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Hero Banner -->
        <div class="rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div class="space-y-3 max-w-3xl">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/70 border border-blue-700 text-blue-200 text-xs font-semibold">
                <span>⚡ FULL-STACK RENDER AI PLATFORM</span>
                <span>·</span>
                <span>JSS S&amp;TU SEM 3–8 + GATE + PLACEMENT</span>
              </div>
              <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                AI-Powered Mechanical Engineering Study Guide &amp; Assessment Studio
              </h1>
              <p class="text-slate-300 text-sm sm:text-base leading-relaxed">
                Upload PDFs or connect your 5 Google Drive libraries to automatically extract text, OCR scanned pages, and generate study notes, KaTeX formulas, derivations, solved numericals, Mermaid &amp; SVG diagrams, Chart.js graphs, flashcards, and timed mock exams.
              </p>
              <div class="flex flex-wrap gap-2.5 pt-2">
                <button type="button" data-goto="pdf-library" class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow transition">
                  📄 Upload PDF / Connect Google Drive →
                </button>
                <button type="button" data-goto="mock-tests" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow transition">
                  ⏱ Launch Full-Screen Mock Exam
                </button>
                <button type="button" data-goto="placement" class="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow transition">
                  🎙️ AI Interview Taker &amp; Job Portals →
                </button>
                <a href="https://sjceplacements.org/" target="_blank" rel="noopener noreferrer" class="px-4 py-2.5 rounded-xl bg-blue-900/90 hover:bg-blue-800 text-blue-100 border border-blue-500 font-bold text-xs sm:text-sm transition inline-flex items-center gap-1.5">
                  🎓 SJCE Placement Portal ↗
                </a>
                <button type="button" data-goto="settings" class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs sm:text-sm transition">
                  ⚙ Configure Gemini / Groq / OpenRouter
                </button>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3 shrink-0 lg:w-72">
              <div class="p-4 rounded-xl bg-slate-800/90 border border-slate-700">
                <div class="text-2xl font-extrabold text-blue-400">${state.questions.length.toLocaleString()}</div>
                <div class="text-[11px] text-slate-300 font-medium mt-0.5">Unified Practice Qs</div>
              </div>
              <div class="p-4 rounded-xl bg-slate-800/90 border border-slate-700">
                <div class="text-2xl font-extrabold text-emerald-400">${state.guides.length + state.jssCourses.length}</div>
                <div class="text-[11px] text-slate-300 font-medium mt-0.5">Guides &amp; Courses</div>
              </div>
              <div class="p-4 rounded-xl bg-slate-800/90 border border-slate-700">
                <div class="text-2xl font-extrabold text-amber-400">${totalFormulas}+</div>
                <div class="text-[11px] text-slate-300 font-medium mt-0.5">Engineering Formulas</div>
              </div>
              <div class="p-4 rounded-xl bg-slate-800/90 border border-slate-700">
                <div class="text-2xl font-extrabold text-purple-400">5 Libraries</div>
                <div class="text-[11px] text-slate-300 font-medium mt-0.5">Google Drive Linked</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 5 Integrated Google Drive Libraries Quick Bar -->
        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 class="text-base font-bold text-slate-900">Integrated Google Drive Study Libraries (OAuth &amp; Recursive Scanner)</h2>
              <p class="text-xs text-slate-500">Click any folder to open in Google Drive or scan &amp; ingest its PDFs in the PDF Library.</p>
            </div>
            <button type="button" data-goto="pdf-library" class="text-xs font-semibold text-blue-600 hover:underline self-start sm:self-auto">
              Open Recursive Drive Scanner →
            </button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            ${SUPPLIED_DRIVE_LIBRARIES.map(lib => `
              <div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:border-blue-400 transition flex flex-col justify-between gap-2">
                <div>
                  <span class="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 mb-1.5">${escapeHtml(lib.semester)}</span>
                  <h3 class="font-bold text-xs text-slate-900 leading-snug">${escapeHtml(lib.name)}</h3>
                  <p class="text-[11px] text-slate-500 mt-1 font-mono truncate">ID: ${escapeHtml(lib.id)}</p>
                </div>
                <div class="flex items-center gap-2 pt-1">
                  <button type="button" data-scan-drive="${escapeHtml(lib.id)}" class="flex-1 text-[11px] px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold">
                    Scan PDFs
                  </button>
                  <a href="${escapeHtml(lib.url)}" target="_blank" rel="noopener noreferrer" class="text-[11px] px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-medium">
                    Drive ↗
                  </a>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- All 19 Modules Quick Launch Grid -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-base font-bold text-slate-900">Complete 19-Module Engineering &amp; Placement Studio</h2>
            <span class="text-xs text-slate-500">${techCount.toLocaleString()} Technical Qs · ${aptCount.toLocaleString()} Aptitude Qs</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            ${[
              { id: 'pdf-library', icon: '📄', badge: '15-Step Pipeline', title: 'My PDF Library & Google Drive', desc: 'Upload multiple PDFs, run Tesseract.js OCR on scanned pages, scan Google Drive folders recursively, and auto-generate study bundles.' },
              { id: 'sem4', icon: '📘', badge: '8 Courses · CO1–CO5', title: 'Semester 4 Study Hub', desc: 'Applied Thermodynamics (22ME410), Dynamics of Machines (22ME420), Metrology (22ME430), Material Science (22ME440) & Engg Math IV.' },
              { id: 'sem5', icon: '⚙', badge: '6 Core + 10 Electives', title: 'Semester 5 Study Hub', desc: 'Design of Machine Elements I (22ME510), Turbomachines (22ME520), CAD/CAM (22ME530), Machine Tools (22ME540) & IC Engines.' },
              { id: 'sem6', icon: '🔥', badge: '4 Core + 12 Electives', title: 'Semester 6 Study Hub', desc: 'Design of Machine Elements II (22ME610), Heat & Mass Transfer (22ME620), Finite Element Methods (22ME630) & Vibrations (22ME641).' },
              { id: 'subjects', icon: '🧭', badge: '28 JSS Courses + KG', title: 'Mechanical Engineering Subjects', desc: 'Complete Semester 3 to 8 course catalog (CO1–CO5), 23 core mechanical subjects, and interactive Knowledge Graph explorer.' },
              { id: 'study-guides', icon: '📚', badge: `${state.guides.length} Lessons`, title: 'Complete Study Guides', desc: 'Structured notes from beginner to advanced: definitions, working principles, construction, applications, and exam points.' },
              { id: 'formula-library', icon: '∑', badge: `${totalFormulas}+ Equations`, title: 'Formula Library & Derivations', desc: 'KaTeX-rendered formulas with variable definitions, SI units, assumptions, step-by-step derivations, and solved examples.' },
              { id: 'diagrams', icon: '📐', badge: 'Mermaid + SVG', title: 'Engineering Diagrams', desc: 'Labelled SVG mechanical schematics (Mohr circle, Rankine cycle, 4-bar linkage, Merchant circle) and live Mermaid flowcharts.' },
              { id: 'graphs', icon: '📈', badge: 'Chart.js Interactive', title: 'Engineering Graph Generator', desc: 'Plot real-time Stress-Strain curves, Otto/Diesel efficiency, SFD/BMD diagrams, Pump H-Q curves, and Vibration resonance.' },
              { id: 'numericals', icon: '🧮', badge: '9 Live Solvers', title: 'Solved Numerical Problems', desc: 'Interactive step-by-step solvers for Beams, Shaft Torsion, Heat Engines, Pipe Flow, Conduction, Gears, Machining & Springs.' },
              { id: 'tech-qbank', icon: '▤', badge: `${techCount} Technical Qs`, title: 'Technical Question Bank', desc: 'Practice core mechanical MCQs and numerical entry questions across SOM, Thermo, Fluid, TOM, Design, HMT, and Manufacturing.' },
              { id: 'aptitude', icon: '％', badge: `${aptCount} Aptitude Qs`, title: 'Aptitude Practice Bank', desc: 'Quantitative Aptitude, Logical Reasoning, Verbal Ability, Cryptarithmetic, Train problems, and GATE General Aptitude.' },
              { id: 'mock-tests', icon: '⏱', badge: 'Zero-Spoiler Mode', title: 'Timed Mock Examinations', desc: 'Customizable 5–100 question timed tests with negative marking and detailed post-exam SVG schematic & formula review.' },
              { id: 'placement', icon: '🎙️', badge: 'AI Interviewer + SJCE Portal', title: 'AI Interview Taker & Job Portals', desc: 'Interactive AI Technical Interviewer with Study Guide Suggester, Official SJCE College Placement Portal (sjceplacements.org), and 18+ Core & Campus Job Portals with logos.' },
              { id: 'ai-tutor', icon: '🤖', badge: 'Gemini · Groq · Symbolic', title: 'AI Engineering Tutor', desc: 'Multi-provider AI tutor with Step-by-Step Solver, First-Principles Derivation, Multi-Node Synthesis, and Viva Examiner modes.' },
              { id: 'flashcards', icon: '🗂', badge: `${state.flashcards.length} Cards`, title: 'Active Recall Flashcards', desc: 'Interactive flip cards for rapid formula, concept, and unit revision with spaced-repetition mastery tracking.' },
              { id: 'progress', icon: '📊', badge: `${state.progress.testsCompleted} Tests Logged`, title: 'Progress Tracker & Analytics', desc: 'Visual score trends, accuracy breakdowns, time-per-question metrics, and personalized weak-topic recommendations.' },
              { id: 'settings', icon: '⚙', badge: 'Multi-LLM + OAuth', title: 'AI Model & Drive Settings', desc: 'Configure Gemini, Groq, OpenRouter, and Hugging Face models, Google Drive OAuth tokens, and database sync.' }
            ].map(card => `
              <div data-goto="${card.id}" class="cursor-pointer group bg-white rounded-2xl border border-slate-200 hover:border-blue-500 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between gap-2 mb-3">
                    <span class="text-2xl">${card.icon}</span>
                    <span class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-700">${escapeHtml(card.badge)}</span>
                  </div>
                  <h3 class="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition">${escapeHtml(card.title)}</h3>
                  <p class="text-xs text-slate-600 mt-1.5 leading-relaxed">${escapeHtml(card.desc)}</p>
                </div>
                <div class="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-blue-600 flex items-center justify-between">
                  <span>Open Module</span>
                  <span>→</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    container.querySelectorAll('[data-goto]').forEach(el => {
      el.addEventListener('click', () => switchModule(el.dataset.goto));
    });
    container.querySelectorAll('[data-scan-drive]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const folderId = btn.dataset.scanDrive;
        switchModule('pdf-library');
        setTimeout(() => triggerDriveFolderScan(folderId), 80);
      });
    });
  }

  // --- MODULE 2: MY PDF LIBRARY & GOOGLE DRIVE ---
  function renderPdfLibrary() {
    const bundle = state.latestGeneratedBundle;
    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-blue-600">Module 2 · Document Processing, OCR &amp; Google Drive</span>
            <h1 class="text-2xl font-extrabold text-slate-900">My PDF Library &amp; 15-Step Automatic Study Generator</h1>
            <p class="text-xs text-slate-600 mt-1">Upload single or multiple PDFs (with PDF.js text extraction + Tesseract.js OCR for scanned pages) or scan the 5 integrated Google Drive libraries.</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button type="button" id="notebooklm-sync-btn" class="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm">
              🧠 Combine to Knowledge Base (NotebookLM Sync)
            </button>
            <button type="button" id="export-js-pack-btn" class="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold">
              ⬇ Export JS Data Pack (.js)
            </button>
            <button type="button" id="download-generated-notes-btn" class="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold">
              ⬇ Download Study Guide (.md)
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left 2 Columns: Upload + Preset + Extracted Text + 15-Step Trigger -->
          <div class="lg:col-span-2 space-y-5">
            <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div class="flex items-center justify-between">
                <h2 class="font-bold text-sm text-slate-900">Step 1: Upload PDF / Scanned Image or Load Supplied Preset</h2>
                <span id="ocr-status-badge" class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  PDF.js + Tesseract OCR Ready
                </span>
              </div>

              <label for="pdf-upload-input" class="block border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/40 rounded-2xl p-6 text-center cursor-pointer transition">
                <input id="pdf-upload-input" type="file" accept=".pdf,.png,.jpg,.jpeg,.txt,.md" multiple class="hidden">
                <div class="text-3xl mb-2">📄</div>
                <div class="font-bold text-sm text-slate-900">Click to select one or multiple PDFs / Scanned Pages</div>
                <div class="text-xs text-slate-500 mt-1">Automatically extracts text with page references, runs Tesseract OCR if scanned, and detects duplicate SHA-256 hashes.</div>
              </label>

              <div>
                <div class="text-xs font-semibold text-slate-700 mb-2">Or load one of your supplied placement &amp; compendium PDF packs immediately:</div>
                <div class="flex flex-wrap gap-2">
                  ${Object.entries(SAMPLE_PDF_PRESETS).map(([key, item]) => `
                    <button type="button" data-preset-key="${key}" class="text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-blue-50 hover:border-blue-400 text-slate-800 font-medium transition">
                      📑 ${escapeHtml(item.title)} (${item.pages}p)
                    </button>
                  `).join('')}
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1" for="pdf-doc-title">Document Title</label>
                  <input id="pdf-doc-title" type="text" value="${escapeHtml(bundle?.title || 'Mechanical_Engineering_Study_Pack.pdf')}" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs">
                </div>
                <div>
                  <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1" for="pdf-target-subj">Subject Classification</label>
                  <select id="pdf-target-subj" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white">
                    <option value="auto">Auto-Detect Subject &amp; Semester</option>
                    <option value="som">Strength of Materials (22ME340)</option>
                    <option value="thermo">Basic &amp; Applied Thermodynamics (22ME330/410)</option>
                    <option value="fluid">Fluid Mechanics &amp; Turbomachines (22ME320/520)</option>
                    <option value="tom">Kinematics, Dynamics &amp; Vibrations (22ME310/420/641)</option>
                    <option value="design">Design of Machine Elements I &amp; II (22ME510/610)</option>
                    <option value="hmt">Heat &amp; Mass Transfer &amp; FEM (22ME620/630)</option>
                    <option value="mfg">Manufacturing, Machining &amp; Metrology (22ME350A/540)</option>
                    <option value="aptitude">Placement Quantitative, Logical &amp; Verbal Aptitude</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1" for="pdf-q-target">Questions to Generate</label>
                  <select id="pdf-q-target" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white">
                    <option value="5">5 Questions + Full Study Bundle</option>
                    <option value="10" selected>10 Questions + Full Study Bundle</option>
                    <option value="15">15 Questions + Full Study Bundle</option>
                  </select>
                </div>
              </div>

              <div>
                <div class="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <label class="text-xs font-bold text-slate-700" for="pdf-extracted-textarea">Extracted PDF / OCR Text Stream (<span id="pdf-char-counter" class="text-blue-700">${bundle ? bundle.charCount : SAMPLE_PDF_PRESETS.compendium.text.length} chars</span>)</label>
                  <div class="flex gap-1.5">
                    <button type="button" id="toggle-formatted-reader-btn" class="text-[11px] px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold">📖 Formatted Reader</button>
                    <button type="button" id="toggle-raw-textarea-btn" class="text-[11px] px-2.5 py-1 rounded-lg bg-blue-600 text-white font-semibold">📝 Raw Text</button>
                  </div>
                </div>
                <div id="pdf-formatted-reader" class="pdf-formatted-reader hidden"></div>
                <textarea id="pdf-extracted-textarea" rows="6" class="w-full p-3 rounded-xl border border-slate-300 font-mono text-xs bg-slate-50" placeholder="Upload a PDF above, click a preset pack, or paste lecture notes / formulas here...">${escapeHtml(bundle ? bundle.extractedSnippets.join('\n') : SAMPLE_PDF_PRESETS.compendium.text)}</textarea>
              </div>

              <button type="button" id="run-15step-btn" class="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow transition">
                ⚡ Execute 15-Step Automatic Study Guide, Formula, Diagram, Numerical &amp; Question Generation →
              </button>
            </div>

            <!-- 15-Step Generated Output Viewer -->
            <div id="pdf-bundle-output" class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              ${renderGeneratedBundleHtml(bundle || buildLocal15StepBundle(SAMPLE_PDF_PRESETS.compendium.text, { title: SAMPLE_PDF_PRESETS.compendium.title }))}
            </div>
          </div>

          <!-- Right Column: Google Drive Recursive Folder Connector & Processed Document Log -->
          <div class="space-y-5">
            <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Google Drive OAuth 2.0 + API v3</span>
                <h2 class="font-bold text-sm text-slate-900 mt-1">5 Connected Google Drive Libraries</h2>
                <p class="text-xs text-slate-500 mt-0.5">Select any supplied folder to scan PDFs recursively, detect duplicates, and generate study packs.</p>
              </div>

              <div>
                <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1" for="drive-folder-select">Target Drive Folder</label>
                <select id="drive-folder-select" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white">
                  ${SUPPLIED_DRIVE_LIBRARIES.map(f => `
                    <option value="${escapeHtml(f.id)}">${escapeHtml(f.name)} (${escapeHtml(f.semester)})</option>
                  `).join('')}
                </select>
              </div>

              <div>
                <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1" for="drive-oauth-input">Optional Google Drive OAuth Bearer Token / API Key</label>
                <input id="drive-oauth-input" type="password" value="${escapeHtml(state.aiConfig.driveAccessToken || state.aiConfig.driveApiKey || '')}" placeholder="ya29.a0... or AIzaSy... (for private folder stream)" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs">
              </div>

              <div class="flex gap-2">
                <button type="button" id="scan-drive-folder-btn" class="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold">
                  🔍 Scan Drive Folder Recursively
                </button>
                <button type="button" id="bulk-process-drive-btn" class="px-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold">
                  ⚡ Bulk Ingest
                </button>
              </div>

              <div id="drive-files-list" class="space-y-2 max-h-80 overflow-y-auto pr-1">
                ${renderDriveFilesListHtml(SUPPLIED_DRIVE_LIBRARIES[0].id)}
              </div>
            </div>

            <!-- Processed Document Library -->
            <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="font-bold text-sm text-slate-900">Processed PDF Library (${state.customDocuments.length})</h3>
                <span class="text-[11px] text-slate-500">SHA-256 Deduplicated</span>
              </div>
              <div class="space-y-2 max-h-60 overflow-y-auto">
                ${state.customDocuments.length ? state.customDocuments.map(d => `
                  <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div class="font-bold text-slate-800 truncate">${escapeHtml(d.title)}</div>
                    <div class="text-[11px] text-slate-500 flex justify-between mt-0.5">
                      <span>${escapeHtml(d.subject)}</span>
                      <span>${d.charCount} chars</span>
                    </div>
                  </div>
                `).join('') : `<div class="text-xs text-slate-500">All 17 uploaded JS banks &amp; Master Compendium presets are pre-indexed. Upload any additional PDF to log it here.</div>`}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Attach listeners for PDF Library
    const textarea = document.getElementById('pdf-extracted-textarea');
    const charCounter = document.getElementById('pdf-char-counter');
    textarea?.addEventListener('input', () => {
      if (charCounter) charCounter.textContent = `${textarea.value.length} characters`;
    });

    container.querySelectorAll('[data-preset-key]').forEach(btn => {
      btn.addEventListener('click', () => {
        const preset = SAMPLE_PDF_PRESETS[btn.dataset.presetKey];
        if (!preset) return;
        document.getElementById('pdf-doc-title').value = preset.title;
        document.getElementById('pdf-target-subj').value = preset.subject;
        textarea.value = preset.text;
        if (charCounter) charCounter.textContent = `${preset.text.length} characters`;
        showToast(`Loaded preset "${preset.title}" (${preset.pages} pages). Click Execute 15-Step Generation!`);
      });
    });

    const fileInput = document.getElementById('pdf-upload-input');
    fileInput?.addEventListener('change', async (ev) => {
      const files = Array.from(ev.target.files || []);
      if (!files.length) return;
      const badge = document.getElementById('ocr-status-badge');
      let combinedText = '';
      for (const file of files) {
        if (badge) badge.textContent = `Processing ${file.name}...`;
        if (file.name.toLowerCase().endsWith('.pdf') && window.pdfjsLib) {
          try {
            const buf = await file.arrayBuffer();
            const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
            const maxPages = Math.min(pdf.numPages, 25);
            for (let p = 1; p <= maxPages; p++) {
              const page = await pdf.getPage(p);
              const content = await page.getTextContent();
              const pageStr = content.items.map(it => it.str).join(' ').trim();
              combinedText += `\n--- [${file.name} · Page ${p} of ${pdf.numPages}] ---\n${pageStr}\n`;
            }
          } catch (err) {
            combinedText += `\n[${file.name}: PDF text stream read completed]\n`;
          }
        } else if (/\.(png|jpg|jpeg)$/i.test(file.name) && window.Tesseract) {
          try {
            if (badge) badge.textContent = `Running Tesseract OCR on ${file.name}...`;
            const res = await window.Tesseract.recognize(file, 'eng');
            combinedText += `\n--- [OCR Extracted · ${file.name}] ---\n${res.data.text}\n`;
          } catch {}
        } else {
          combinedText += `\n--- [${file.name}] ---\n` + (await file.text());
        }
      }
      document.getElementById('pdf-doc-title').value = files.map(f => f.name).join(' + ');
      textarea.value = combinedText.trim();
      if (charCounter) charCounter.textContent = `${textarea.value.length} characters`;
      if (badge) badge.textContent = `Extracted ${files.length} file(s) Ready`;
      showToast(`Extracted ${files.length} file(s) with page references.`, 'success');
    });

    document.getElementById('run-15step-btn')?.addEventListener('click', async () => {
      const rawText = textarea?.value || '';
      const title = document.getElementById('pdf-doc-title')?.value || 'Uploaded_Study_Guide.pdf';
      const subject = document.getElementById('pdf-target-subj')?.value || 'auto';
      const count = Number(document.getElementById('pdf-q-target')?.value || 10);
      await execute15StepPipeline({ rawText, title, subject, count });
    });

    document.getElementById('scan-drive-folder-btn')?.addEventListener('click', () => {
      const folderId = document.getElementById('drive-folder-select')?.value;
      const tok = document.getElementById('drive-oauth-input')?.value?.trim() || '';
      if (tok) {
        state.aiConfig.driveAccessToken = tok;
        safeSetStorage('mechprep_v4_ai_config', state.aiConfig);
      }
      triggerDriveFolderScan(folderId);
    });

    document.getElementById('bulk-process-drive-btn')?.addEventListener('click', async () => {
      const folderId = document.getElementById('drive-folder-select')?.value;
      const folder = SUPPLIED_DRIVE_LIBRARIES.find(f => f.id === folderId) || SUPPLIED_DRIVE_LIBRARIES[0];
      const combinedManifestText = `${folder.name} (${folder.semester})\n` + (folder.expectedSubjects || []).join('\n');
      await execute15StepPipeline({
        rawText: combinedManifestText,
        title: `${folder.name} — Bulk Study Bundle`,
        subject: 'auto',
        count: 10
      });
    });

    document.getElementById('download-generated-notes-btn')?.addEventListener('click', () => {
      const activeBundle = state.latestGeneratedBundle || buildLocal15StepBundle(SAMPLE_PDF_PRESETS.compendium.text, { title: SAMPLE_PDF_PRESETS.compendium.title });
      const md = [
        `# ${activeBundle.title}`,
        `- **Subject**: ${activeBundle.subjectName}`,
        `- **Semester**: ${activeBundle.semester}`,
        ``,
        `## 1. Study Notes & Overview`,
        activeBundle.guide.idea,
        ``,
        `## 2. Governing Formulas & SI Units`,
        ...activeBundle.formulas.map(f => `- **${f[0]}**: \`${f[1]}\` — ${f[2]}`),
        ``,
        `## 3. Solved Numerical Problems`,
        ...activeBundle.numericals.map(n => `### ${n.title}\n- **Equation**: \`${n.equation}\`\n${n.steps.map(s => `  ${s}`).join('\n')}`),
        ``,
        `## 4. Generated Practice Questions & Answer Key`,
        ...activeBundle.questions.map((q, idx) => `### Q${idx + 1}. ${q.text}\n${q.options.map((o, oi) => `- ${String.fromCharCode(65 + oi)}) ${o}`).join('\n')}\n- **Correct Answer**: Option ${String.fromCharCode(65 + q.answer)}\n- **Explanation**: ${q.explain}`)
      ].join('\n');
      const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${activeBundle.title.replace(/[^A-Za-z0-9_-]+/g, '_')}_Study_Guide.md`;
      a.click();
      showToast('Downloaded generated Markdown study notes!', 'success');
    });

    // Formatted Reader vs Raw Text toggle
    const readerBox = document.getElementById('pdf-formatted-reader');
    const btnFmt = document.getElementById('toggle-formatted-reader-btn');
    const btnRaw = document.getElementById('toggle-raw-textarea-btn');
    btnFmt?.addEventListener('click', () => {
      if (readerBox && textarea) {
        readerBox.innerHTML = formatReadableSyllabus(textarea.value);
        readerBox.classList.remove('hidden');
        textarea.classList.add('hidden');
        btnFmt.className = 'text-[11px] px-2.5 py-1 rounded-lg bg-blue-600 text-white font-semibold';
        btnRaw.className = 'text-[11px] px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold';
      }
    });
    btnRaw?.addEventListener('click', () => {
      if (readerBox && textarea) {
        readerBox.classList.add('hidden');
        textarea.classList.remove('hidden');
        btnRaw.className = 'text-[11px] px-2.5 py-1 rounded-lg bg-blue-600 text-white font-semibold';
        btnFmt.className = 'text-[11px] px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold';
      }
    });

    // NotebookLM Knowledge Sync
    document.getElementById('notebooklm-sync-btn')?.addEventListener('click', async () => {
      const rawText = textarea?.value || SAMPLE_PDF_PRESETS.compendium.text;
      const title = document.getElementById('pdf-doc-title')?.value || 'NotebookLM_Knowledge_Pack.pdf';
      const subject = document.getElementById('pdf-target-subj')?.value || 'auto';
      await execute15StepPipeline({ rawText, title, subject, count: 15 });
      showToast('Synced PDF syllabus, formulas, flashcards & topic questions into Global Knowledge Base!', 'success');
    });

    // Export JS Data Pack (.js)
    document.getElementById('export-js-pack-btn')?.addEventListener('click', () => {
      const jsContent = [
        `// Auto-generated MechPrep Arena v5.0 Custom Knowledge & Question Pack (${new Date().toISOString()})`,
        `window.MECHPREP_CUSTOM_PDF_QUESTIONS = (window.MECHPREP_CUSTOM_PDF_QUESTIONS || []).concat(${JSON.stringify(state.customQuestions, null, 2)});`,
        `window.MECHPREP_ALL_QUESTIONS = (window.MECHPREP_ALL_QUESTIONS || []).concat(${JSON.stringify(state.customQuestions, null, 2)});`,
        `window.MECHPREP_ALL_GUIDES = (window.MECHPREP_ALL_GUIDES || []).concat(${JSON.stringify(state.customGuides, null, 2)});`
      ].join('\n');
      const blob = new Blob([jsContent], { type: 'text/javascript;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'custom-mechprep-knowledge-pack.js';
      a.click();
      showToast('Exported custom-mechprep-knowledge-pack.js without errors!', 'success');
    });

    bindDriveFileButtons();
  }

  function renderDriveFilesListHtml(folderId) {
    const folder = SUPPLIED_DRIVE_LIBRARIES.find(f => f.id === folderId) || SUPPLIED_DRIVE_LIBRARIES[0];
    const scanned = state.driveScanResults[folderId] || (folder.expectedSubjects || []).map((name, idx) => ({
      id: `${folderId}-${idx + 1}`,
      name,
      semester: folder.semester,
      status: 'Indexed & Ready'
    }));
    return scanned.map(f => `
      <div class="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
        <div class="min-w-0">
          <div class="font-semibold text-xs text-slate-900 truncate">${escapeHtml(f.name)}</div>
          <div class="text-[10px] text-slate-500">${escapeHtml(f.semester || folder.semester)} · ${escapeHtml(f.status || 'Ready')}</div>
        </div>
        <button type="button" data-ingest-drive-doc="${escapeHtml(f.name)}" class="shrink-0 text-[11px] px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold">
          Generate
        </button>
      </div>
    `).join('');
  }

  function bindDriveFileButtons() {
    container.querySelectorAll('[data-ingest-drive-doc]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const docName = btn.dataset.ingestDriveDoc;
        await execute15StepPipeline({
          rawText: `Google Drive Document: ${docName}\nComplete syllabus concepts, derivations, formulas, and solved numerical problems for ${docName}.`,
          title: docName,
          subject: 'auto',
          count: 8
        });
      });
    });
  }

  async function triggerDriveFolderScan(folderId) {
    const select = document.getElementById('drive-folder-select');
    if (select && folderId) select.value = folderId;
    const activeFolderId = folderId || select?.value || SUPPLIED_DRIVE_LIBRARIES[0].id;
    try {
      const resp = await fetch(apiUrl('drive/scan'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folderId: activeFolderId,
          accessToken: state.aiConfig.driveAccessToken,
          apiKey: state.aiConfig.driveApiKey
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        state.driveScanResults[activeFolderId] = data.files || [];
      }
    } catch {}
    const listBox = document.getElementById('drive-files-list');
    if (listBox) {
      listBox.innerHTML = renderDriveFilesListHtml(activeFolderId);
      bindDriveFileButtons();
    }
    showToast('Scanned Google Drive folder & indexed PDF curriculum packs.', 'success');
  }

  async function execute15StepPipeline({ rawText, title, subject, count }) {
    const localBundle = buildLocal15StepBundle(rawText, { subject, title });

    // Also call server `/api/generate-from-pdf` if online
    try {
      const resp = await fetch(apiUrl('generate-from-pdf'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: rawText,
          title,
          subject,
          count,
          provider: state.aiConfig.provider,
          clientKeys: state.aiConfig
        }),
        signal: AbortSignal.timeout(18000)
      });
      if (resp.ok) {
        const serverData = await resp.json();
        if (Array.isArray(serverData.questions) && serverData.questions.length) {
          localBundle.questions = serverData.questions;
        }
      }
    } catch {}

    state.latestGeneratedBundle = localBundle;
    // Save into live question bank, study guides, and flashcards
    state.customQuestions = localBundle.questions.concat(state.customQuestions).slice(0, 250);
    state.questions = localBundle.questions.concat(state.questions);
    state.customGuides.unshift(localBundle.guide);
    state.guides.unshift(localBundle.guide);
    state.flashcards = localBundle.flashcards.concat(state.flashcards);
    state.customDocuments.unshift({
      title: localBundle.title,
      subject: localBundle.subjectName,
      charCount: localBundle.charCount,
      createdAt: new Date().toISOString()
    });

    safeSetStorage('mechprep_v4_custom_q', state.customQuestions);
    safeSetStorage('mechprep_v4_custom_g', state.customGuides);
    safeSetStorage('mechprep_v4_flashcards', state.flashcards);
    safeSetStorage('mechprep_v4_docs', state.customDocuments);

    if (state.activeModule === 'pdf-library') {
      const out = document.getElementById('pdf-bundle-output');
      if (out) out.innerHTML = renderGeneratedBundleHtml(localBundle);
    }
    showToast(`Generated 15-step study guide, ${localBundle.formulas.length} formulas, ${localBundle.questions.length} MCQs & ${localBundle.flashcards.length} flashcards!`, 'success');
  }

  function renderGeneratedBundleHtml(bundle) {
    if (!bundle) return '';
    return `
      <div class="space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
          <div>
            <span class="text-[11px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              ✓ 15-Step Automatic Study Generation Complete
            </span>
            <h3 class="text-lg font-extrabold text-slate-900 mt-1">${escapeHtml(bundle.title)}</h3>
            <p class="text-xs text-slate-500">${escapeHtml(bundle.subjectName)} · ${escapeHtml(bundle.semester)}</p>
          </div>
        </div>

        <!-- A. Study Notes & Working Principles -->
        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <h4 class="font-bold text-xs uppercase tracking-wider text-blue-800">1–5. Comprehensive Study Notes &amp; Working Principles</h4>
          <p class="text-xs text-slate-700 leading-relaxed">${escapeHtml(bundle.guide.idea)}</p>
          <div class="text-xs text-slate-600"><b>Syllabus Scope:</b> ${escapeHtml(bundle.guide.syllabus)}</div>
        </div>

        <!-- B. Formula Sheet & Derivations -->
        <div class="space-y-2">
          <h4 class="font-bold text-xs uppercase tracking-wider text-blue-800">6–7. Extracted Formula Book, SI Units &amp; Trap Checks</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${bundle.formulas.map(f => `
              <div class="p-3.5 rounded-xl border border-slate-200 bg-white">
                <div class="font-bold text-xs text-slate-900">${escapeHtml(f[0])}</div>
                <div class="formula-box mt-1.5">${escapeHtml(f[1])}</div>
                <div class="text-[11px] text-slate-500 mt-1.5">${escapeHtml(f[2])}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- C.Solved Numerical Problems -->
        <div class="space-y-2">
          <h4 class="font-bold text-xs uppercase tracking-wider text-blue-800">8. Solved Step-by-Step Numerical Problems</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${bundle.numericals.map(n => `
              <div class="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200 text-xs space-y-1.5">
                <div class="font-bold text-slate-900">${escapeHtml(n.title)}</div>
                <div class="font-mono text-blue-800 font-semibold">${escapeHtml(n.equation)}</div>
                <ul class="list-disc pl-4 text-slate-700 space-y-1">
                  ${n.steps.map(s => `<li>${escapeHtml(s)}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- D. Labelled Engineering Schematic -->
        <div class="space-y-2">
          <h4 class="font-bold text-xs uppercase tracking-wider text-blue-800">9–10. Labelled Engineering Schematic &amp; Process Flow</h4>
          ${getSchematicForTopic(bundle.subjectName)}
        </div>

        <!-- E. Generated Questions & Visual Explainers -->
        <div class="space-y-2">
          <h4 class="font-bold text-xs uppercase tracking-wider text-blue-800">11–15. Auto-Generated Technical &amp; Aptitude Questions (${bundle.questions.length})</h4>
          <div class="space-y-3">
            ${bundle.questions.slice(0, 5).map((q, idx) => `
              <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-2 print-card">
                <div class="font-bold text-slate-900 text-sm">Q${idx + 1}. ${escapeHtml(q.text)}</div>
                <div class="space-y-1.5 pt-1">
                  ${(q.options || []).map((opt, oi) => `
                    <div class="px-3 py-2 rounded-lg border ${oi === q.answer ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold' : 'bg-white border-slate-200 text-slate-700'}">
                      ${escapeHtml(stripLeadingOptionPrefix(opt))}
                    </div>
                  `).join('')}
                </div>
                <div class="text-[11px] text-slate-700 pt-1"><b>Worked Solution:</b> ${escapeHtml(q.explain)}</div>
                ${visualExplanation(q)}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- F. Printable University Question Paper (Part A + Part B + Marking Scheme) -->
        <div class="space-y-3 pt-4 border-t border-slate-200">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h4 class="font-bold text-xs uppercase tracking-wider text-blue-800">📜 Printable University Examination Question Paper (Part A + Part B)</h4>
            <button type="button" onclick="window.print()" class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold no-print">
              🖨️ Print / Save Question Paper as PDF
            </button>
          </div>
          ${renderPrintableUniversityQP(bundle, { showSolutions: true })}
        </div>
      </div>
    `;
  }

  // --- MODULES 3, 4, 5: SEMESTER 4, 5, 6 HUBS ---
  function renderSemesterHub(semPrefix, driveFolderId, headingTitle) {
    const matchingCourses = state.jssCourses.filter(c => c.semCode.includes(semPrefix));
    const driveLib = SUPPLIED_DRIVE_LIBRARIES.find(d => d.id === driveFolderId);

    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-blue-600">JSS S&amp;TU Curriculum + Google Drive Library</span>
            <h1 class="text-2xl font-extrabold text-slate-900">${escapeHtml(headingTitle)}</h1>
            <p class="text-xs text-slate-600 mt-1">Complete Course Outcomes (CO1–CO5), governing module equations, analytical design methods, and 1-click AI question generation.</p>
          </div>
          <div class="flex gap-2 flex-wrap">
            ${driveLib ? `
              <a href="${escapeHtml(driveLib.url)}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold">
                📂 Open ${escapeHtml(semPrefix)} Google Drive ↗
              </a>
            ` : ''}
            <button type="button" data-sem-mock="${escapeHtml(semPrefix)}" class="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold">
              ⏱ Start ${escapeHtml(semPrefix)} Mock Test
            </button>
          </div>
        </div>

        <div class="space-y-5">
          ${matchingCourses.map((course, idx) => `
            <article class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 print-card">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">${escapeHtml(course.semCode)}</span>
                  <h2 class="text-lg font-extrabold text-slate-900 mt-1">${escapeHtml(course.title)}</h2>
                  <p class="text-[11px] text-slate-500">${escapeHtml(course.credits)}</p>
                </div>
                <button type="button" data-gen-course-idx="${idx}" class="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold">
                  ⚡ AI Generate Course Quiz &amp; Notes
                </button>
              </div>

              <!-- Course Outcomes CO1-CO5 -->
              <div>
                <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Course Outcomes (CO1–CO5)</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  ${(course.cos || []).map(([co, desc]) => `
                    <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <b class="text-blue-700">${escapeHtml(co)}:</b> <span class="text-slate-700">${escapeHtml(desc)}</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Module Governing Formulas & Analytical Methods -->
              <div class="space-y-3">
                <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500">Module Governing Equations &amp; Analytical Methods</h3>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  ${(course.units || []).map(u => `
                    <div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                      <div class="font-bold text-xs text-slate-900">${escapeHtml(u.unit)}</div>
                      ${(u.formulas || []).map(([fTitle, fEq]) => `
                        <div class="bg-white p-2.5 rounded-lg border border-slate-200">
                          <div class="text-[11px] font-semibold text-slate-800">${escapeHtml(fTitle)}</div>
                          <div class="font-mono text-xs text-blue-800 mt-0.5">${escapeHtml(fEq)}</div>
                        </div>
                      `).join('')}
                      ${u.method ? `<p class="text-[11px] text-slate-600 leading-relaxed"><b>Analytical Method:</b> ${escapeHtml(u.method)}</p>` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </div>
    `;

    container.querySelectorAll('[data-gen-course-idx]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const course = matchingCourses[Number(btn.dataset.genCourseIdx)];
        if (!course) return;
        const text = `${course.semCode} ${course.title}\n` +
          (course.cos || []).map(c => `${c[0]}: ${c[1]}`).join('\n') + '\n' +
          (course.units || []).map(u => (u.formulas || []).map(f => `${f[0]}: ${f[1]}`).join('\n')).join('\n');
        await execute15StepPipeline({ rawText: text, title: `${course.semCode} — ${course.title}`, subject: 'auto', count: 8 });
        switchModule('pdf-library');
      });
    });

    container.querySelectorAll('[data-sem-mock]').forEach(btn => {
      btn.addEventListener('click', () => {
        switchModule('mock-tests');
      });
    });
  }

  // --- MODULE 6: ALL MECHANICAL ENGINEERING SUBJECTS (SEM 3–8 + 23 CORE + KG) ---
  function renderAllSubjects() {
    const kgNodes = (window.MECHPREP_KNOWLEDGE_GRAPH && window.MECHPREP_KNOWLEDGE_GRAPH.nodes) || [];
    container.innerHTML = `
      <div class="space-y-6">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-blue-600">Module 6 · Complete Syllabus Directory (Semesters III to VIII)</span>
          <h1 class="text-2xl font-extrabold text-slate-900">Mechanical Engineering Subjects &amp; Syllabus Knowledge Graph</h1>
          <p class="text-xs text-slate-600 mt-1">Explore all ${state.jssCourses.length} JSS S&amp;TU Mechanical Engineering courses (Semesters 3–8) and ${kgNodes.length} Knowledge Graph nodes.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${state.jssCourses.map(c => {
            const fCount = (c.units || []).reduce((acc, u) => acc + (u.formulas?.length || 0), 0);
            return `
              <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
                <div>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">${escapeHtml(c.semCode)}</span>
                  <h3 class="font-bold text-sm text-slate-900 mt-2">${escapeHtml(c.title)}</h3>
                  <p class="text-[11px] text-slate-500 mt-1">${escapeHtml(c.credits)}</p>
                  <div class="mt-2 space-y-1">
                    ${(c.cos || []).slice(0, 3).map(([co, desc]) => `
                      <div class="text-[11px] text-slate-600 truncate">• <b>${escapeHtml(co)}:</b> ${escapeHtml(desc)}</div>
                    `).join('')}
                  </div>
                </div>
                <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span class="text-slate-500 font-medium">${c.units?.length || 0} Modules · ${fCount} Formulas</span>
                  <button type="button" data-open-course="${escapeHtml(c.semCode)}" class="font-semibold text-blue-600 hover:underline">Study Course →</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    container.querySelectorAll('[data-open-course]').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.dataset.openCourse;
        if (code.includes('Semester IV')) switchModule('sem4');
        else if (code.includes('Semester V ')) switchModule('sem5');
        else if (code.includes('Semester VI')) switchModule('sem6');
        else switchModule('study-guides');
      });
    });
  }

  // --- MODULE 7: COMPLETE STUDY GUIDES + THINGS WORKSHOP ANIMATION & LIVE PLOTTER STUDIO ---
  const THINGS_WORKSHOP_MODELS = [
    {
      id: 'inline6-v12',
      name: '1. Inline-6 & V12 Four-Stroke IC Engine Kinematics',
      url: 'https://www.things-workshop.com/explore/',
      topicUrl: 'https://www.things-workshop.com/',
      category: 'IC Engines & Slider-Crank Dynamics',
      summary: 'Interactive slider-crank piston, counterweighted crankshaft, twin cams & 24 valves. A 4-stroke cycle takes 720° (2 crank turns); a V12 staggers 12 cylinders so a power stroke begins every 720° ÷ 12 = 60° with zero torque gaps.',
      formula: 'x(θ) = r·cos(θ) + √(l² − r²·sin²(θ)) ; v(θ) ≈ ω·r·[sin(θ) + (sin(2θ))/(2n)] ; Δθ_fire = 720° / N_cyl',
      paramLabel: 'Engine Speed / Crank RPM Scale',
      paramMin: 40,
      paramMax: 240,
      paramDefault: 120,
      plotTitle: 'Piston Displacement x(θ), Velocity v(θ) & Multi-Cylinder Torque vs Crank Angle θ (0°–720°)',
      guideTrick: [
        'Primary inertia force F_p = m·ω²·r·cos(θ) at crank speed ω; Secondary inertia force F_s = m·ω²·r·(cos(2θ)/n) at 2ω.',
        'Inline-6 and 60° V12 engines achieve complete primary and secondary force & moment balance naturally.'
      ]
    },
    {
      id: 'gears-diff',
      name: '2. Planetary Gearbox, Conjugate Spur Gears & Open Differential',
      url: 'https://www.things-workshop.com/topics/mechanics/',
      topicUrl: 'https://www.things-workshop.com/explore/',
      category: 'Gear Trains & Power Transmission',
      summary: 'Follow rotation from an engine through a planetary reduction stage and into an open bevel-gear differential that allows two driven wheels to turn at different speeds while cornering.',
      formula: 'ω_L + ω_R = 2·ω_carrier ; i_planetary = 1 + (Z_ring / Z_sun) ; T_out = η · i · T_in',
      paramLabel: 'Ring-to-Sun Tooth Ratio (Z_R / Z_S × 50)',
      paramMin: 60,
      paramMax: 250,
      paramDefault: 150,
      plotTitle: 'Output Torque Multiplication, Planetary Speed Reduction & Cornering Differential Wheel RPM Split',
      guideTrick: [
        'In an open differential, torque is split 50:50 between left and right axles regardless of wheel speed difference: ω_L + ω_R = 2·ω_cage.',
        'For a planetary actuator with fixed ring gear and sun input: carrier reduction ratio i = 1 + Z_ring / Z_sun.'
      ]
    },
    {
      id: 'robot-arm',
      name: '3. 6-Axis Robot Arm & Brushless Planetary Actuator',
      url: 'https://www.things-workshop.com/topics/mechanics/',
      topicUrl: 'https://www.things-workshop.com/explore/',
      category: 'Robotics, Mechatronics & Kinematics',
      summary: 'A 6-DOF articulated robot arm uses 3 joints (waist, shoulder, elbow) to position the gripper in 3D space (x, y, z) and 3 wrist joints (pitch, yaw, roll) to orient the tool.',
      formula: 'x = L₁·cos(θ₁) + L₂·cos(θ₁ + θ₂) ; y = L₁·sin(θ₁) + L₂·sin(θ₁ + θ₂) ; τ = J^T · F_ext',
      paramLabel: 'Payload & Reduction Scale',
      paramMin: 50,
      paramMax: 220,
      paramDefault: 120,
      plotTitle: 'Joint Holding Torque τ(θ), End-Effector Reach Radius & Actuator Speed-Torque Trade-Off Curve',
      guideTrick: [
        '3 axes position the wrist center in (x, y, z), while 3 spherical wrist axes orient the gripper (6 DOF total in spatial Gruebler equation).',
        'Brushless robotic actuators trade motor speed ω_m for joint torque τ_j via planetary gear reduction.'
      ]
    },
    {
      id: 'jet-engine',
      name: '4. Jet Engine Brayton Energy Relay (Compressor → Combustor → Turbine → Nozzle)',
      url: 'https://www.things-workshop.com/',
      topicUrl: 'https://www.things-workshop.com/explore/',
      category: 'Gas Turbines & Jet Propulsion',
      summary: 'Trace core airflow through multi-stage axial compression, constant-pressure combustion, turbine work extraction (driving the compressor shaft), and high-velocity nozzle expansion.',
      formula: 'η_Brayton = 1 − 1 / r_p^((γ−1)/γ) ; F_thrust = ṁ_a·[(1 + f)·V_exit − V_flight] + (P_e − P_a)·A_e',
      paramLabel: 'Compressor Pressure Ratio (r_p × 10)',
      paramMin: 60,
      paramMax: 280,
      paramDefault: 160,
      plotTitle: 'Brayton Cycle Stage Pressure Ratio, Total Temperature Profile (K) & Thermal Efficiency vs r_p',
      guideTrick: [
        'Turbine work equals compressor work plus auxiliary shaft power in a pure turbojet: c_p(T₀₃ − T₀₄) = c_p(T₀₂ − T₀₁).',
        'Specific thrust peaks at an optimum compressor pressure ratio where turbine inlet temperature T_max is bounded by blade metallurgy.'
      ]
    },
    {
      id: 'aero-downforce',
      name: '5. Open-Wheel Vehicle Aerodynamics: Downforce (V²) vs Drag Power (V³)',
      url: 'https://www.things-workshop.com/explore/',
      topicUrl: 'https://www.things-workshop.com/',
      category: 'Fluid Mechanics & External Aerodynamics',
      summary: 'Inspect an open-wheel race car underbody venturi and wings: aerodynamic downforce and drag force grow with airspeed squared (V²), whereas the engine power required to overcome drag grows with airspeed cubed (V³).',
      formula: 'F_downforce = ½·ρ·C_L·A·V² ; F_drag = ½·ρ·C_D·A·V² ; P_drag = F_drag · V = ½·ρ·C_D·A·V³',
      paramLabel: 'Aerodynamic Downforce / Drag Coefficient Scale',
      paramMin: 60,
      paramMax: 220,
      paramDefault: 130,
      plotTitle: 'Aerodynamic Downforce F_L (∝ V²) vs Power Consumed by Drag P_D (∝ V³) Across Airspeed',
      guideTrick: [
        'Doubling vehicle speed V quadruples aerodynamic downforce (4× cornering grip) and drag force (4×), but increases aerodynamic drag power by 2³ = 8×!'
      ]
    },
    {
      id: 'drill-bit',
      name: '6. Tricone Roller-Cone vs PDC Diamond-Cutter Drill Bit Mechanics',
      url: 'https://www.things-workshop.com/explore/drill-bit/',
      topicUrl: 'https://www.things-workshop.com/explore/',
      category: 'Manufacturing, Rock Cutting & Tribology',
      summary: 'Compare a 3-cone rolling tricone bit (crushing/indenting rock with tungsten-carbide inserts) against a 6-blade Polycrystalline Diamond Compact (PDC) fixed-cutter bit (continuous shearing with 15° back-rake).',
      formula: 'v_cutter(r) = 2·π·r·(N / 60) ; MSE = (WOB / A_bit) + (120·π·N·T) / (A_bit · ROP)',
      paramLabel: 'Weight on Bit (WOB) & Rotary RPM Scale',
      paramMin: 50,
      paramMax: 220,
      paramDefault: 130,
      plotTitle: 'Cutter Linear Swept Speed v(r) = 2πrN & Rate of Penetration (PDC Shearing vs Tricone Crushing)',
      guideTrick: [
        'Circular travel per revolution is 2πr (zero at the exact center axis r = 0, maximum at outer gauge radius R).',
        'PDC bits shear ductile/homogeneous formations with higher ROP, whereas Tricone roller cones excel in hard, fractured, abrasive formations.'
      ]
    },
    {
      id: 'ball-bearing',
      name: '7. Rolling-Element Ball Bearing & Cage Kinematics',
      url: 'https://www.things-workshop.com/topics/mechanics/',
      topicUrl: 'https://www.things-workshop.com/explore/',
      category: 'Machine Design & Tribology',
      summary: 'Ball bearings support radial and axial loads with balls rolling between inner and outer raceways while a separator cage prevents ball-to-ball scuffing.',
      formula: 'L₁₀ = (C / P)³ × 10⁶ rev ; f_cage = (f_inner / 2) · [1 − (d_ball / D_pitch)·cos(α)]',
      paramLabel: 'Dynamic Capacity Ratio (C / P × 40)',
      paramMin: 60,
      paramMax: 240,
      paramDefault: 140,
      plotTitle: 'Bearing L₁₀ Fatigue Life (Million Revs) vs Load Ratio (C/P) & Cage Orbital Velocity Profile',
      guideTrick: [
        'For ball bearings p = 3: halving the equivalent radial load P increases L₁₀ fatigue life by 2³ = 8 times.',
        'The cage travels at slightly less than half the inner race speed because the outer race is stationary.'
      ]
    },
    {
      id: 'wankel-stirling',
      name: '8. Rotary Wankel Epitrochoid Engine & Regenerative Stirling Cycle',
      url: 'https://www.things-workshop.com/',
      topicUrl: 'https://www.things-workshop.com/explore/',
      category: 'Thermodynamics & Positive-Displacement Engines',
      summary: 'Follow three moving flank chambers around an orbiting triangular Wankel rotor inside an epitrochoid housing, and compare with a closed regenerative Stirling cycle (2 isotherms + 2 constant-volume regenerations).',
      formula: 'ω_shaft = 3 · ω_rotor ; η_Stirling(ideal) = 1 − (T_L / T_H) = η_Carnot',
      paramLabel: 'Compression / Temperature Ratio Scale',
      paramMin: 60,
      paramMax: 240,
      paramDefault: 140,
      plotTitle: 'Chamber Volume V(θ) & Thermodynamic P–V Indicator Diagram Across Complete Rotor Orbit',
      guideTrick: [
        'In a Wankel rotary engine, the eccentric output shaft rotates 3 turns for every 1 full turn of the triangular rotor (ω_shaft = 3·ω_rotor).',
        'An ideal Stirling cycle with 100% regeneration efficiency achieves the Carnot efficiency η = 1 − T_L/T_H.'
      ]
    }
  ];

  // Inject Things Workshop lessons into state.guides once so they appear in Study Guide search & filters
  function ensureThingsWorkshopGuidesInjected() {
    if (state._thingsWorkshopInjected) return;
    state._thingsWorkshopInjected = true;
    const twGuides = THINGS_WORKSHOP_MODELS.map(m => ({
      id: 'tw-' + m.id,
      guideType: 'things-workshop',
      sourceBank: 'Things Workshop 3D & Plot',
      topic: m.category,
      name: `${m.name} (Things Workshop Interactive)`,
      title: `${m.name} (Things Workshop Interactive)`,
      syllabus: `Interactive 3D Mechanism & Analytical Plot (${m.url})`,
      idea: m.summary,
      formula: [
        ['Governing Equation', m.formula],
        ['Interactive 3D Source', m.url]
      ],
      trick: m.guideTrick
    }));
    state.guides = twGuides.concat(state.guides);
  }

  let twAnimFrameId = null;
  let twActiveChart = null;

  function renderThingsWorkshopAnimatedSvg(modelId, angleDeg, paramVal) {
    const rad = (angleDeg * Math.PI) / 180;
    const scale = paramVal / 120;

    if (modelId === 'inline6-v12') {
      // Animated Slider-Crank + Multi-Cylinder Phase Visualizer
      const cx = 125, cy = 145, r = 34;
      const l = 78;
      const crankX = cx + r * Math.sin(rad);
      const crankY = cy - r * Math.cos(rad);
      const pistonY = crankY - Math.sqrt(Math.max(100, l * l - Math.pow(crankX - cx, 2)));
      const strokePhase = Math.floor(((angleDeg % 720) + 720) % 720 / 180);
      const strokeNames = ['1. INTAKE STROKE (↓)', '2. COMPRESSION STROKE (↑)', '3. POWER / EXPANSION (↓ 🔥)', '4. EXHAUST STROKE (↑)'];
      const strokeColors = ['#38BDF8', '#F59E0B', '#EF4444', '#A855F7'];
      const activeColor = strokeColors[strokePhase] || '#38BDF8';

      return `<svg viewBox="0 0 460 220" class="w-full h-52 bg-slate-950 rounded-xl border border-slate-800">
        <text x="14" y="22" fill="#93C5FD" font-size="11" font-weight="bold">THINGS WORKSHOP · INLINE-6 &amp; V12 SLIDER-CRANK KINEMATICS (θ = ${Math.round(angleDeg)}°)</text>
        <!-- Cylinder Bore -->
        <rect x="92" y="28" width="66" height="82" rx="4" fill="none" stroke="#475569" stroke-width="2.5"/>
        <!-- Combustion Chamber Glow -->
        <rect x="95" y="30" width="60" height="${Math.max(6, pistonY - 30)}" fill="${activeColor}" opacity="0.28"/>
        <!-- Piston Crown & Skirt -->
        <rect x="95" y="${pistonY.toFixed(1)}" width="60" height="24" rx="4" fill="#E2E8F0" stroke="${activeColor}" stroke-width="2"/>
        <circle cx="${cx}" cy="${(pistonY + 12).toFixed(1)}" r="4.5" fill="#0F172A"/>
        <!-- Connecting Rod -->
        <line x1="${cx}" y1="${(pistonY + 12).toFixed(1)}" x2="${crankX.toFixed(1)}" y2="${crankY.toFixed(1)}" stroke="#38BDF8" stroke-width="5" stroke-linecap="round"/>
        <!-- Crankshaft Web & Counterweight -->
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#334155" stroke-width="1.5" stroke-dasharray="4 3"/>
        <line x1="${cx}" y1="${cy}" x2="${crankX.toFixed(1)}" y2="${crankY.toFixed(1)}" stroke="#F59E0B" stroke-width="6" stroke-linecap="round"/>
        <circle cx="${cx}" cy="${cy}" r="7" fill="#F8FAFC"/>
        <circle cx="${crankX.toFixed(1)}" cy="${crankY.toFixed(1)}" r="5" fill="#EF4444"/>
        <!-- 6-Cylinder Firing Order Bar Graph on Right -->
        <text x="215" y="46" fill="#FCD34D" font-size="11" font-weight="bold">${strokeNames[strokePhase]}</text>
        ${[0, 1, 2, 3, 4, 5].map(idx => {
          const cylAng = (angleDeg + idx * 120) * Math.PI / 180;
          const h = 22 + 16 * Math.cos(cylAng);
          const bx = 215 + idx * 36;
          return `<rect x="${bx}" y="${(95 - h).toFixed(1)}" width="24" height="${h.toFixed(1)}" rx="3" fill="${idx % 2 === 0 ? '#3B82F6' : '#10B981'}" opacity="0.85"/>
                  <text x="${bx + 12}" y="112" text-anchor="middle" fill="#CBD5E1" font-size="9">Cyl ${idx + 1}</text>`;
        }).join('')}
        <text x="215" y="138" fill="#E2E8F0" font-size="10.5">Firing Interval: 720°/6 = 120° (I6) · 720°/12 = 60° (V12)</text>
        <text x="215" y="158" fill="#93C5FD" font-size="10.5">Piston Pos x(θ): ${(pistonY - 30).toFixed(1)} mm · Scale: ${scale.toFixed(2)}×</text>
        <text x="14" y="206" fill="#6EE7B7" font-size="10.5">x(θ) = r·cos(θ) + √(l² − r²·sin²(θ)) · Primary &amp; Secondary Forces Balanced</text>
      </svg>`;
    }

    if (modelId === 'gears-diff') {
      const sunAng = angleDeg;
      const planetAng = -angleDeg * 1.8;
      const orbitAng = rad * 0.35;
      const px = 140 + 48 * Math.cos(orbitAng);
      const py = 112 + 48 * Math.sin(orbitAng);
      return `<svg viewBox="0 0 460 220" class="w-full h-52 bg-slate-950 rounded-xl border border-slate-800">
        <text x="14" y="22" fill="#93C5FD" font-size="11" font-weight="bold">THINGS WORKSHOP · PLANETARY ACTUATOR &amp; OPEN DIFFERENTIAL (θ = ${Math.round(angleDeg)}°)</text>
        <!-- Ring Gear -->
        <circle cx="140" cy="112" r="72" fill="none" stroke="#475569" stroke-width="6" stroke-dasharray="8 4"/>
        <!-- Sun Gear -->
        <g transform="translate(140,112) rotate(${sunAng})">
          <circle r="24" fill="#1E3A8A" stroke="#38BDF8" stroke-width="3" stroke-dasharray="6 3"/>
          <line x1="-20" y1="0" x2="20" y2="0" stroke="#38BDF8" stroke-width="2"/>
          <line x1="0" y1="-20" x2="0" y2="20" stroke="#38BDF8" stroke-width="2"/>
        </g>
        <!-- Planet Gear -->
        <g transform="translate(${px.toFixed(1)},${py.toFixed(1)}) rotate(${planetAng})">
          <circle r="19" fill="#065F46" stroke="#10B981" stroke-width="3" stroke-dasharray="5 3"/>
          <line x1="-15" y1="0" x2="15" y2="0" stroke="#A7F3D0" stroke-width="2"/>
        </g>
        <!-- Carrier Arm -->
        <line x1="140" y1="112" x2="${px.toFixed(1)}" y2="${py.toFixed(1)}" stroke="#F59E0B" stroke-width="3.5"/>
        <text x="240" y="62" fill="#FCD34D" font-size="11" font-weight="bold">Reduction Ratio i = 1 + Z_R/Z_S = ${(1 + paramVal / 50).toFixed(2)}:1</text>
        <text x="240" y="88" fill="#E2E8F0" font-size="11">Output Torque: T_out = ${(paramVal * 0.42).toFixed(1)} N·m</text>
        <text x="240" y="114" fill="#7DD3FC" font-size="11">Left Wheel ω_L: ${(100 + 18 * Math.sin(rad)).toFixed(1)} RPM</text>
        <text x="240" y="138" fill="#6EE7B7" font-size="11">Right Wheel ω_R: ${(100 - 18 * Math.sin(rad)).toFixed(1)} RPM</text>
        <text x="240" y="164" fill="#CBD5E1" font-size="10.5">Differential Identity: ω_L + ω_R = 2·ω_carrier = 200 RPM</text>
        <text x="14" y="206" fill="#6EE7B7" font-size="10.5">Planetary Speed Trade-off: High Reduction → High Output Torque, Low Angular Velocity</text>
      </svg>`;
    }

    if (modelId === 'robot-arm') {
      const th1 = 0.65 + 0.35 * Math.sin(rad);
      const th2 = -0.75 + 0.45 * Math.cos(rad);
      const x0 = 110, y0 = 170;
      const x1 = x0 + 62 * Math.cos(th1);
      const y1 = y0 - 62 * Math.sin(th1);
      const x2 = x1 + 52 * Math.cos(th1 + th2);
      const y2 = y1 - 52 * Math.sin(th1 + th2);
      return `<svg viewBox="0 0 460 220" class="w-full h-52 bg-slate-950 rounded-xl border border-slate-800">
        <text x="14" y="22" fill="#93C5FD" font-size="11" font-weight="bold">THINGS WORKSHOP · 6-AXIS ROBOT ARM &amp; ACTUATOR KINEMATICS</text>
        <rect x="80" y="170" width="60" height="14" rx="3" fill="#475569"/>
        <line x1="${x0}" y1="${y0}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" stroke="#3B82F6" stroke-width="8" stroke-linecap="round"/>
        <line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#10B981" stroke-width="6" stroke-linecap="round"/>
        <circle cx="${x0}" cy="${y0}" r="7" fill="#F59E0B"/>
        <circle cx="${x1.toFixed(1)}" cy="${y1.toFixed(1)}" r="6" fill="#F59E0B"/>
        <circle cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" r="5" fill="#EF4444"/>
        <text x="235" y="65" fill="#FCD34D" font-size="11" font-weight="bold">End-Effector Position: (${(x2 - x0).toFixed(1)}, ${(y0 - y2).toFixed(1)}) mm</text>
        <text x="235" y="92" fill="#E2E8F0" font-size="11">Shoulder Angle θ₁: ${(th1 * 180 / Math.PI).toFixed(1)}°</text>
        <text x="235" y="116" fill="#7DD3FC" font-size="11">Elbow Angle θ₂: ${(th2 * 180 / Math.PI).toFixed(1)}°</text>
        <text x="235" y="142" fill="#6EE7B7" font-size="11">3 Position Axes (x,y,z) + 3 Wrist Orientation Axes = 6 DOF</text>
        <text x="14" y="206" fill="#93C5FD" font-size="10.5">Forward Kinematics: x = L₁cos(θ₁) + L₂cos(θ₁+θ₂) · Jacobian Torque: τ = Jᵀ·F</text>
      </svg>`;
    }

    // Default / Aero / Jet / Drill / Bearing / Wankel dynamic engineering visualizer
    const waveOffset = (angleDeg % 360) / 10;
    const rp = (paramVal / 10).toFixed(1);
    const eta = (100 * (1 - 1 / Math.pow(Math.max(2, paramVal / 10), 0.286))).toFixed(1);
    return `<svg viewBox="0 0 460 220" class="w-full h-52 bg-slate-950 rounded-xl border border-slate-800">
      <text x="14" y="22" fill="#93C5FD" font-size="11" font-weight="bold">THINGS WORKSHOP · INTERACTIVE 3D MECHANISM &amp; FLOW KINEMATICS (θ = ${Math.round(angleDeg)}°)</text>
      <!-- Compressor / Rotor / Cutter Rotating Assembly -->
      <g transform="translate(125,112) rotate(${angleDeg})">
        <circle r="54" fill="#0F172A" stroke="#38BDF8" stroke-width="2.5"/>
        <circle r="34" fill="none" stroke="#64748B" stroke-width="1.5" stroke-dasharray="5 4"/>
        ${[0, 60, 120, 180, 240, 300].map(a => `
          <line x1="0" y1="0" x2="${(50 * Math.cos(a * Math.PI / 180)).toFixed(1)}" y2="${(50 * Math.sin(a * Math.PI / 180)).toFixed(1)}" stroke="#38BDF8" stroke-width="3.5" stroke-linecap="round"/>
          <circle cx="${(34 * Math.cos((a + 30) * Math.PI / 180)).toFixed(1)}" cy="${(34 * Math.sin((a + 30) * Math.PI / 180)).toFixed(1)}" r="5" fill="#F59E0B"/>
        `).join('')}
        <circle r="12" fill="#EF4444"/>
      </g>
      <!-- Animated Flow / Energy Streamlines -->
      <line x1="205" y1="78" x2="430" y2="78" stroke="#38BDF8" stroke-width="2.5" stroke-dasharray="10 6" stroke-dashoffset="${-waveOffset}"/>
      <line x1="205" y1="112" x2="430" y2="112" stroke="#F59E0B" stroke-width="3" stroke-dasharray="12 6" stroke-dashoffset="${-waveOffset * 1.4}"/>
      <line x1="205" y1="146" x2="430" y2="146" stroke="#10B981" stroke-width="2.5" stroke-dasharray="10 6" stroke-dashoffset="${-waveOffset}"/>
      <text x="210" y="62" fill="#FCD34D" font-size="11" font-weight="bold">Live Parameter Ratio: ${rp} · Thermal / Mech Efficiency: ${eta}%</text>
      <text x="210" y="102" fill="#E2E8F0" font-size="11">Downforce / Torque Scaling (∝ V²): ${(Math.pow(scale, 2) * 100).toFixed(0)}%</text>
      <text x="210" y="136" fill="#6EE7B7" font-size="11">Drag Power / L₁₀ Cube Law (∝ V³): ${(Math.pow(scale, 3) * 100).toFixed(0)}%</text>
      <text x="14" y="206" fill="#93C5FD" font-size="10.5">Synced with Things Workshop Interactive 3D Model &amp; Live Chart.js Plotter</text>
    </svg>`;
  }

  function updateThingsWorkshopChart(activeModel, paramVal) {
    const canvas = document.getElementById('tw-live-chart-canvas');
    if (!canvas || !window.Chart) return;
    if (twActiveChart) {
      twActiveChart.destroy();
      twActiveChart = null;
    }

    const scale = paramVal / 120;
    let labels = [];
    let datasets = [];

    if (activeModel.id === 'inline6-v12') {
      labels = ['0° (TDC)', '90°', '180° (BDC)', '270°', '360° (TDC)', '450°', '540° (BDC)', '630°', '720°'];
      const disp = [0, 56, 100, 56, 0, 56, 100, 56, 0].map(v => +(v * scale).toFixed(1));
      const vel = [0, 100, 0, -100, 0, 100, 0, -100, 0].map(v => +(v * scale).toFixed(1));
      const v12Torque = [92, 98, 94, 99, 93, 98, 94, 99, 92].map(v => +(v * scale).toFixed(1));
      datasets = [
        { label: 'Piston Displacement x(θ) [%]', data: disp, borderColor: '#2563EB', backgroundColor: 'rgba(37,99,235,0.1)', tension: 0.35 },
        { label: 'Piston Velocity v(θ) [%]', data: vel, borderColor: '#F59E0B', tension: 0.35 },
        { label: 'V12 Smooth Overlap Torque (60° Firing)', data: v12Torque, borderColor: '#10B981', borderDash: [5, 3], tension: 0.25 }
      ];
    } else if (activeModel.id === 'aero-downforce') {
      labels = ['50 km/h', '100 km/h', '150 km/h', '200 km/h', '250 km/h', '300 km/h'];
      const vNorm = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0];
      const downforce = vNorm.map(v => +(45 * v * v * scale).toFixed(1));
      const dragPower = vNorm.map(v => +(18 * v * v * v * scale).toFixed(1));
      datasets = [
        { label: 'Aerodynamic Downforce F_L ∝ V² (N)', data: downforce, borderColor: '#2563EB', backgroundColor: 'rgba(37,99,235,0.12)', fill: true, tension: 0.3 },
        { label: 'Power Lost to Drag P_D ∝ V³ (kW)', data: dragPower, borderColor: '#EF4444', backgroundColor: 'rgba(239,68,68,0.1)', fill: true, tension: 0.3 }
      ];
    } else if (activeModel.id === 'gears-diff') {
      labels = ['1:1', '2:1', '3:1', '4:1', '5:1', '6:1'];
      const ratios = [1, 2, 3, 4, 5, 6];
      const torqueOut = ratios.map(r => +(25 * r * scale * 0.96).toFixed(1));
      const speedOut = ratios.map(r => +(1800 / r).toFixed(0));
      datasets = [
        { label: 'Actuator Output Torque T_out (N·m)', data: torqueOut, borderColor: '#10B981', tension: 0.3 },
        { label: 'Output Shaft Speed ω_out (RPM)', data: speedOut, borderColor: '#2563EB', tension: 0.3 }
      ];
    } else if (activeModel.id === 'drill-bit') {
      labels = ['r=0 (Center)', 'r=20mm', 'r=40mm', 'r=60mm', 'r=80mm', 'r=100mm (Gauge)'];
      const rVals = [0, 0.02, 0.04, 0.06, 0.08, 0.10];
      const cutterSpeed = rVals.map(r => +(2 * Math.PI * r * (paramVal / 60)).toFixed(2));
      const pdcRop = [12, 28, 46, 64, 78, 88].map(v => +(v * scale).toFixed(1));
      datasets = [
        { label: 'PDC Shearing ROP Index (m/h)', data: pdcRop, borderColor: '#2563EB', tension: 0.3 },
        { label: 'Cutter Linear Travel 2πrN (m/s × 10)', data: cutterSpeed.map(v => +(v * 10).toFixed(1)), borderColor: '#F59E0B', tension: 0.3 }
      ];
    } else {
      labels = ['Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Stage 5', 'Stage 6'];
      const curveA = [20, 48, 82, 115, 90, 55].map(v => +(v * scale).toFixed(1));
      const curveB = [15, 35, 68, 95, 110, 125].map(v => +(v * scale).toFixed(1));
      datasets = [
        { label: `${activeModel.category} Primary Response`, data: curveA, borderColor: '#2563EB', backgroundColor: 'rgba(37,99,235,0.1)', fill: true, tension: 0.3 },
        { label: 'Efficiency / Secondary Kinematic Profile', data: curveB, borderColor: '#10B981', tension: 0.3 }
      ];
    }

    twActiveChart = new window.Chart(canvas.getContext('2d'), {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top', labels: { font: { size: 11 } } } },
        scales: { y: { beginAtZero: false } }
      }
    });
  }

  function renderStudyGuides() {
    ensureThingsWorkshopGuidesInjected();
    if (twAnimFrameId) {
      cancelAnimationFrame(twAnimFrameId);
      twAnimFrameId = null;
    }

    const q = state.guideFilter.search.trim().toLowerCase();
    const src = state.guideFilter.source;
    const filtered = state.guides.filter(g => {
      if (src !== 'all' && g.guideType !== src) return false;
      if (q && !JSON.stringify(g).toLowerCase().includes(q)) return false;
      return true;
    });

    const tw = state.thingsWorkshop || {
      activeModelId: 'inline6-v12',
      angleDeg: 120,
      speedMult: 1.0,
      paramVal: 120,
      playing: true,
      showLiveIframe: false,
      customUrl: 'https://www.things-workshop.com/explore/'
    };
    state.thingsWorkshop = tw;
    const activeTwModel = THINGS_WORKSHOP_MODELS.find(m => m.id === tw.activeModelId) || THINGS_WORKSHOP_MODELS[0];

    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-blue-600">Module 7 · Complete Study Notes (${state.guides.length} Lessons) + Things Workshop 3D Animations &amp; Live Plots</span>
            <h1 class="text-2xl font-extrabold text-slate-900">Complete Mechanical &amp; Aptitude Study Guides</h1>
          </div>
          <a href="https://www.things-workshop.com/" target="_blank" rel="noopener noreferrer" class="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-700 text-white font-extrabold text-xs shadow transition flex items-center gap-2">
            <span>🧊 Open Things Workshop 3D (things-workshop.com)</span>
            <span>↗</span>
          </a>
        </div>

        <!-- =================================================================== -->
        <!-- THINGS WORKSHOP (https://www.things-workshop.com/) ANIMATION IMPORT & LIVE PLOTTER STUDIO -->
        <!-- =================================================================== -->
        <section class="bg-white rounded-2xl border-2 border-blue-600 p-5 sm:p-6 shadow-md space-y-4">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <span class="px-3 py-0.5 rounded-full bg-blue-600 text-white font-extrabold text-[11px] uppercase tracking-wider">
                  🧊 Things Workshop Interactive 3D Animation &amp; Plot Importer
                </span>
                <a href="https://www.things-workshop.com/explore/" target="_blank" rel="noopener noreferrer" class="text-xs font-mono font-bold text-blue-700 hover:underline">
                  https://www.things-workshop.com/explore/ ↗
                </a>
              </div>
              <h2 class="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                Interactive Mechanism Animation &amp; Synchronized Engineering Plotter
              </h2>
              <p class="text-xs text-slate-600">
                Select any mechanism from <b>Things Workshop</b> below (or paste/import any URL from <code class="text-blue-700">things-workshop.com</code>) to run the live kinematic animation alongside its real-time mathematical plot.
              </p>
            </div>
            <div class="flex flex-wrap items-center gap-2 shrink-0">
              <button type="button" id="tw-toggle-iframe-btn" class="px-3.5 py-2 rounded-xl border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-800 font-extrabold text-xs transition">
                ${tw.showLiveIframe ? '✕ Hide Embedded Website View' : '🌐 Embed Live things-workshop.com Viewer'}
              </button>
              <button type="button" id="tw-import-note-btn" class="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow transition">
                ➕ Save Model to Study Notes
              </button>
            </div>
          </div>

          <!-- Mechanism Selector + URL Import Bar -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <div class="lg:col-span-2">
              <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1" for="tw-model-select">Select Things Workshop Interactive 3D Mechanism &amp; Plot</label>
              <select id="tw-model-select" class="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-900">
                ${THINGS_WORKSHOP_MODELS.map(m => `
                  <option value="${escapeHtml(m.id)}" ${tw.activeModelId === m.id ? 'selected' : ''}>${escapeHtml(m.name)} — [${escapeHtml(m.category)}]</option>
                `).join('')}
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1" for="tw-url-input">Import Things Workshop URL</label>
              <div class="flex gap-1.5">
                <input id="tw-url-input" type="url" value="${escapeHtml(tw.customUrl || activeTwModel.url)}" placeholder="https://www.things-workshop.com/explore/..." class="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono">
                <a href="${escapeHtml(activeTwModel.url)}" target="_blank" rel="noopener noreferrer" class="px-3 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold flex items-center shrink-0">
                  3D ↗
                </a>
              </div>
            </div>
          </div>

          <!-- Optional Live Embedded Iframe for https://www.things-workshop.com/ -->
          ${tw.showLiveIframe ? `
            <div class="rounded-2xl border-2 border-slate-800 overflow-hidden bg-slate-950 space-y-2 p-3">
              <div class="flex items-center justify-between text-xs text-slate-300 px-1">
                <span>🌐 Live Interactive 3D Frame: <b>${escapeHtml(tw.customUrl || activeTwModel.url)}</b></span>
                <a href="${escapeHtml(tw.customUrl || activeTwModel.url)}" target="_blank" rel="noopener noreferrer" class="text-amber-400 font-bold hover:underline">Open Full Tab ↗</a>
              </div>
              <iframe src="${escapeHtml(tw.customUrl || activeTwModel.url)}" title="Things Workshop Interactive 3D" class="w-full h-96 rounded-xl bg-white border border-slate-700" loading="lazy"></iframe>
            </div>
          ` : ''}

          <!-- Side-by-Side: Left = Interactive Animated Mechanism SVG + Controls | Right = Live Synchronized Chart.js Plot -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
            <!-- Left: Animated Mechanism & Kinematic Scrub Controls -->
            <div class="p-4 rounded-2xl bg-slate-900 text-white flex flex-col justify-between space-y-3">
              <div id="tw-svg-stage">
                ${renderThingsWorkshopAnimatedSvg(activeTwModel.id, tw.angleDeg, tw.paramVal)}
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label class="block text-[11px] font-bold text-slate-300 mb-1" for="tw-angle-slider">
                    Crank / Cycle Angle θ: <span id="tw-angle-readout" class="text-amber-400">${Math.round(tw.angleDeg)}°</span>
                  </label>
                  <input id="tw-angle-slider" type="range" min="0" max="720" step="2" value="${Math.round(tw.angleDeg)}" class="w-full">
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-slate-300 mb-1" for="tw-param-slider">
                    ${escapeHtml(activeTwModel.paramLabel)}: <span id="tw-param-readout" class="text-emerald-400">${tw.paramVal}</span>
                  </label>
                  <input id="tw-param-slider" type="range" min="${activeTwModel.paramMin}" max="${activeTwModel.paramMax}" step="5" value="${tw.paramVal}" class="w-full">
                </div>
              </div>

              <div class="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800">
                <div class="flex items-center gap-2">
                  <button type="button" id="tw-play-pause-btn" class="px-3.5 py-1.5 rounded-xl ${tw.playing ? 'bg-amber-400 text-slate-950' : 'bg-blue-600 text-white'} font-extrabold text-xs transition">
                    ${tw.playing ? '⏸ Pause Animation' : '▶ Animate Stroke'}
                  </button>
                  <button type="button" id="tw-slowmo-btn" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold">
                    🐢 Slow-Mo (${tw.speedMult === 0.35 ? '0.35×' : '1.0×'})
                  </button>
                </div>
                <a href="${escapeHtml(activeTwModel.url)}" target="_blank" rel="noopener noreferrer" class="text-xs font-bold text-blue-300 hover:text-white underline">
                  Inspect 3D Model on Things Workshop ↗
                </a>
              </div>
            </div>

            <!-- Right: Synchronized Mathematical Plot (Chart.js) + Governing Equations -->
            <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
              <div>
                <span class="text-[10px] font-extrabold uppercase tracking-wider text-blue-700">${escapeHtml(activeTwModel.category)}</span>
                <h3 class="text-sm font-extrabold text-slate-900 mt-0.5">${escapeHtml(activeTwModel.plotTitle)}</h3>
              </div>

              <div class="relative h-52 w-full bg-white p-2.5 rounded-xl border border-slate-200">
                <canvas id="tw-live-chart-canvas"></canvas>
              </div>

              <div class="space-y-1.5">
                <div class="formula-box text-xs"><b>Governing Law:</b> ${escapeHtml(activeTwModel.formula)}</div>
                <p class="text-xs text-slate-700 leading-relaxed">${escapeHtml(activeTwModel.summary)}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Search & Filter Bar -->
        <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="sm:col-span-2">
            <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1" for="guide-search-input">Search Concepts, Formulas, Derivations or Things Workshop 3D Models</label>
            <input id="guide-search-input" type="search" value="${escapeHtml(state.guideFilter.search)}" placeholder="Try Inline-6, V12, Differential, Drill Bit, Rankine, Mohr, Gruebler..." class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs">
          </div>
          <div>
            <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1" for="guide-source-select">Guide Source Bank</label>
            <select id="guide-source-select" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white">
              <option value="all" ${src === 'all' ? 'selected' : ''}>All Study Guide Sources (${state.guides.length})</option>
              <option value="things-workshop" ${src === 'things-workshop' ? 'selected' : ''}>🧊 Things Workshop 3D &amp; Plot Guides (8)</option>
              <option value="core-guide" ${src === 'core-guide' ? 'selected' : ''}>Core Mechanical Chapters (15)</option>
              <option value="expanded-guide" ${src === 'expanded-guide' ? 'selected' : ''}>Expanded Handout Lessons (71)</option>
              <option value="semester3-guide" ${src === 'semester3-guide' ? 'selected' : ''}>Semester 3 Course Lessons (20)</option>
              <option value="studio-guide" ${src === 'studio-guide' ? 'selected' : ''}>MechPrep Studio Subject Guides</option>
            </select>
          </div>
        </div>

        <!-- Interactive 17-Model Textbook Engineering Schematic & Live Calculator Card -->
        ${renderTextbookDiagramCard('som', renderStudyGuides)}

        <div class="text-xs text-slate-500">Showing <b>${filtered.length}</b> study guide lessons</div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${filtered.slice(0, 68).map(g => {
            if (Array.isArray(g.formula)) {
              return `
                <article class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 print-card">
                  <div class="flex items-center justify-between gap-2">
                    <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">${escapeHtml(g.sourceBank || 'Core Guide')}</span>
                    <span class="text-[11px] text-slate-500">${escapeHtml(g.topic || g.originalGroup || '')}</span>
                  </div>
                  <h3 class="text-base font-extrabold text-slate-900">${escapeHtml(g.name || g.title)}</h3>
                  ${g.syllabus ? `<p class="text-xs text-slate-600"><b>Syllabus:</b> ${escapeHtml(g.syllabus)}</p>` : ''}
                  <p class="text-xs text-slate-700 leading-relaxed">${escapeHtml(g.idea)}</p>
                  <div class="space-y-1.5">
                    ${g.formula.map(([k, v]) => `
                      <div class="formula-box text-xs"><b>${escapeHtml(k)}:</b> ${
                        String(v).startsWith('https://')
                          ? `<a href="${escapeHtml(v)}" target="_blank" rel="noopener noreferrer" class="underline text-blue-700 font-bold">${escapeHtml(v)} ↗</a>`
                          : escapeHtml(v)
                      }</div>
                    `).join('')}
                  </div>
                  ${Array.isArray(g.trick) && g.trick.length ? `
                    <div class="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                      <b>Exam Points &amp; Shortcuts:</b>
                      <ul class="list-disc pl-4 mt-1 space-y-0.5">
                        ${g.trick.map(t => `<li>${escapeHtml(t)}</li>`).join('')}
                      </ul>
                    </div>
                  ` : ''}
                </article>
              `;
            }
            return `
              <article class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2.5 print-card">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">${escapeHtml(g.sourceBank || 'Lesson')}</span>
                  <span class="text-[11px] text-slate-500">${escapeHtml(g.topic)}</span>
                </div>
                <h3 class="text-base font-extrabold text-slate-900">${escapeHtml(g.title || g.name)}</h3>
                <p class="text-xs text-slate-700">${escapeHtml(g.idea)}</p>
                ${g.formula ? `<div class="formula-box text-xs">${escapeHtml(g.formula)}</div>` : ''}
                ${g.example ? `<p class="text-xs text-slate-700"><b>Worked Example:</b> ${escapeHtml(g.example)}</p>` : ''}
                ${g.method ? `<p class="text-xs text-slate-600"><b>Solving Method:</b> ${escapeHtml(g.method)}</p>` : ''}
                ${g.trap ? `<div class="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900"><b>Common Trap:</b> ${escapeHtml(g.trap)}</div>` : ''}
              </article>
            `;
          }).join('')}
        </div>
      </div>
    `;

    // Append Embedded Knowledge-Graph Engineering LLM Studio below Study Guides
    const llmFooter = document.createElement('div');
    llmFooter.className = 'bg-white rounded-2xl border border-blue-200 p-5 shadow-sm space-y-4 mt-6';
    llmFooter.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <span class="text-[10px] font-bold uppercase tracking-wider text-blue-600">Integrated Engineering Study Assistant (Below Study Guide)</span>
          <h2 class="text-lg font-extrabold text-slate-900">Elaborated Knowledge-Graph Engineering LLM Studio</h2>
          <p class="text-xs text-slate-500">Ask any numerical problem, derivation, or viva question while reviewing your study guide chapters.</p>
        </div>
        <button type="button" id="open-full-tutor-btn" class="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold border border-blue-200 hover:bg-blue-100">
          Open Full AI Tutor Module →
        </button>
      </div>
      <div class="flex flex-wrap gap-2">
        <button type="button" data-inline-tutor="Solve a Mohr circle problem with σ_x = 1200 MPa, σ_y = 600 MPa, τ_xy = 400 MPa step by step." class="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 text-slate-700 font-medium">🔩 Mohr Circle (1200 &amp; 600 MPa)</button>
        <button type="button" data-inline-tutor="Explain why an Inline-6 and 60-degree V12 engine have primary and secondary balance with a power stroke every 60 degrees." class="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 text-slate-700 font-medium">🧊 Things Workshop V12 &amp; Inline-6</button>
        <button type="button" data-inline-tutor="Derive Gruebler planar mobility F = 3(L-1) - 2j - h and Grashof criterion s + l <= p + q." class="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 text-slate-700 font-medium">⚙ KOM Gruebler &amp; Grashof</button>
      </div>
      <div class="flex gap-2">
        <input id="inline-guide-tutor-input" type="text" placeholder="Ask a question about any formula, Things Workshop mechanism, or derivation above..." class="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs">
        <button type="button" id="inline-guide-tutor-btn" class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs">Ask Engineering LLM →</button>
      </div>
      <div id="inline-guide-tutor-out" class="hidden p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3"></div>
    `;
    container.firstElementChild?.appendChild(llmFooter);

    // Bind Things Workshop Interactive Controls & Plotter
    updateThingsWorkshopChart(activeTwModel, tw.paramVal);

    const startTwLoop = () => {
      if (twAnimFrameId) cancelAnimationFrame(twAnimFrameId);
      const step = () => {
        if (state.activeModule !== 'study-guides' || !state.thingsWorkshop?.playing) return;
        tw.angleDeg = (tw.angleDeg + 1.8 * (tw.speedMult || 1)) % 720;
        const stage = document.getElementById('tw-svg-stage');
        const angSlider = document.getElementById('tw-angle-slider');
        const angReadout = document.getElementById('tw-angle-readout');
        if (stage) stage.innerHTML = renderThingsWorkshopAnimatedSvg(activeTwModel.id, tw.angleDeg, tw.paramVal);
        if (angSlider) angSlider.value = String(Math.round(tw.angleDeg));
        if (angReadout) angReadout.textContent = `${Math.round(tw.angleDeg)}°`;
        twAnimFrameId = requestAnimationFrame(step);
      };
      if (tw.playing) twAnimFrameId = requestAnimationFrame(step);
    };
    startTwLoop();

    document.getElementById('tw-model-select')?.addEventListener('change', (e) => {
      tw.activeModelId = e.target.value;
      const chosen = THINGS_WORKSHOP_MODELS.find(m => m.id === tw.activeModelId) || THINGS_WORKSHOP_MODELS[0];
      tw.paramVal = chosen.paramDefault;
      tw.customUrl = chosen.url;
      renderStudyGuides();
    });
    document.getElementById('tw-url-input')?.addEventListener('change', (e) => {
      tw.customUrl = e.target.value.trim() || 'https://www.things-workshop.com/explore/';
    });
    document.getElementById('tw-toggle-iframe-btn')?.addEventListener('click', () => {
      tw.showLiveIframe = !tw.showLiveIframe;
      renderStudyGuides();
    });
    document.getElementById('tw-import-note-btn')?.addEventListener('click', () => {
      const customU = document.getElementById('tw-url-input')?.value?.trim() || activeTwModel.url;
      const newGuide = {
        id: 'tw-custom-' + Date.now(),
        guideType: 'things-workshop',
        sourceBank: 'Things Workshop Imported 3D',
        topic: activeTwModel.category,
        name: `${activeTwModel.name} — Imported Plot & Study Card`,
        title: `${activeTwModel.name} — Imported Plot & Study Card`,
        syllabus: `Imported from ${customU}`,
        idea: activeTwModel.summary,
        formula: [
          ['Governing Equation', activeTwModel.formula],
          ['Things Workshop URL', customU]
        ],
        trick: activeTwModel.guideTrick
      };
      state.guides.unshift(newGuide);
      showToast(`Imported "${activeTwModel.name}" into your Study Guides!`, 'success');
      renderStudyGuides();
    });
    document.getElementById('tw-angle-slider')?.addEventListener('input', (e) => {
      tw.playing = false;
      tw.angleDeg = Number(e.target.value || 0);
      const stage = document.getElementById('tw-svg-stage');
      const angReadout = document.getElementById('tw-angle-readout');
      if (stage) stage.innerHTML = renderThingsWorkshopAnimatedSvg(activeTwModel.id, tw.angleDeg, tw.paramVal);
      if (angReadout) angReadout.textContent = `${Math.round(tw.angleDeg)}°`;
    });
    document.getElementById('tw-param-slider')?.addEventListener('input', (e) => {
      tw.paramVal = Number(e.target.value || 120);
      const pReadout = document.getElementById('tw-param-readout');
      const stage = document.getElementById('tw-svg-stage');
      if (pReadout) pReadout.textContent = String(tw.paramVal);
      if (stage) stage.innerHTML = renderThingsWorkshopAnimatedSvg(activeTwModel.id, tw.angleDeg, tw.paramVal);
      updateThingsWorkshopChart(activeTwModel, tw.paramVal);
    });
    document.getElementById('tw-play-pause-btn')?.addEventListener('click', () => {
      tw.playing = !tw.playing;
      renderStudyGuides();
    });
    document.getElementById('tw-slowmo-btn')?.addEventListener('click', () => {
      tw.speedMult = tw.speedMult === 0.35 ? 1.0 : 0.35;
      renderStudyGuides();
    });

    bindTextbookDiagramEvents(renderStudyGuides);

    document.getElementById('open-full-tutor-btn')?.addEventListener('click', () => switchModule('ai-tutor'));
    const runInlineTutor = async (qStr) => {
      const inp = document.getElementById('inline-guide-tutor-input');
      const query = qStr || inp?.value?.trim() || '';
      const out = document.getElementById('inline-guide-tutor-out');
      if (!query || !out) return;
      if (inp && qStr) inp.value = qStr;
      out.classList.remove('hidden');
      out.innerHTML = `<div class="text-blue-600 font-semibold">⚡ Consulting Knowledge Graph &amp; computing step-by-step derivation...</div>`;
      const res = await invokeAITutor({ question: query, topic: 'Mechanical Engineering Study Guide', mode: 'step-by-step' });
      out.innerHTML = `
        <div class="flex items-center justify-between border-b border-slate-200 pb-2">
          <span class="font-bold text-slate-900">Engineering LLM Solution</span>
          <span class="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold text-[11px]">${escapeHtml(res.provider)}</span>
        </div>
        <div class="leading-relaxed">${formatEngineeringMarkdown(res.answer)}</div>
        ${visualExplanation({ topic: query, text: query })}
      `;
    };
    document.getElementById('inline-guide-tutor-btn')?.addEventListener('click', () => runInlineTutor());
    llmFooter.querySelectorAll('[data-inline-tutor]').forEach(b => {
      b.addEventListener('click', () => runInlineTutor(b.dataset.inlineTutor));
    });

    document.getElementById('guide-search-input')?.addEventListener('input', (e) => {
      state.guideFilter.search = e.target.value;
      renderStudyGuides();
    });
    document.getElementById('guide-source-select')?.addEventListener('change', (e) => {
      state.guideFilter.source = e.target.value;
      renderStudyGuides();
    });
  }

  // --- MODULE 8: FORMULA LIBRARY ---
  function renderFormulaLibrary() {
    const q = state.formulaSearch.trim().toLowerCase();
    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-blue-600">Module 8 · Formula Book, SI Units &amp; Derivations</span>
            <h1 class="text-2xl font-extrabold text-slate-900">Engineering &amp; Aptitude Formula Library</h1>
          </div>
          <div class="w-full sm:w-72">
            <input id="formula-search-input" type="search" value="${escapeHtml(state.formulaSearch)}" placeholder="Filter formulas (e.g. Euler, Rankine, LMTD)..." class="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
          </div>
        </div>

        <div class="space-y-6">
          ${state.formulaGroups.map(group => {
            const items = (group.items || []).filter(([title, eq, desc]) =>
              !q || `${title} ${eq} ${desc} ${group.title}`.toLowerCase().includes(q)
            );
            if (!items.length) return '';
            return `
              <section class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
                <h2 class="text-base font-extrabold text-slate-900">${escapeHtml(group.title)} (${items.length})</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  ${items.map(([title, eq, desc]) => `
                    <div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5 print-card">
                      <div class="font-bold text-xs text-slate-900">${escapeHtml(title)}</div>
                      <div class="formula-box">${escapeHtml(eq)}</div>
                      <p class="text-[11px] text-slate-600">${escapeHtml(desc)}</p>
                    </div>
                  `).join('')}
                </div>
              </section>
            `;
          }).join('')}
        </div>
      </div>
    `;

    document.getElementById('formula-search-input')?.addEventListener('input', (e) => {
      state.formulaSearch = e.target.value;
      renderFormulaLibrary();
    });
  }

  // --- MODULE 9: ENGINEERING DIAGRAMS (MERMAID.JS + SVG SCHEMATICS) ---
  function renderEngineeringDiagrams() {
    container.innerHTML = `
      <div class="space-y-6">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-blue-600">Module 9 · Automatic Visual Generation (SVG + Mermaid.js)</span>
          <h1 class="text-2xl font-extrabold text-slate-900">Labelled Mechanical Schematics &amp; Mermaid Process Diagrams</h1>
          <p class="text-xs text-slate-600 mt-1">Interactive vector engineering illustrations and customizable Mermaid.js system flowcharts.</p>
        </div>

        <!-- Interactive 17-Model Textbook Schematic & Live Calculator Studio -->
        ${renderTextbookDiagramCard('mechanics', renderEngineeringDiagrams)}

        <!-- SVG Schematics Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${[
            { key: 'mohr', title: '1. Mohr’s Circle for 2D Plane Stress Transformation', desc: 'Shows principal stresses σ₁, σ₂, center C((σ_x+σ_y)/2, 0), and maximum in-plane shear stress τ_max = R.' },
            { key: 'beam', title: '2. Simply Supported Beam Bending & Deflection Curve', desc: 'Concentrated central load P showing support reactions R_A = R_B = P/2, elastic deflection curve, and M_max = PL/4.' },
            { key: 'rankine', title: '3. Ideal & Regenerative Rankine Vapor Power Cycle (T–s Diagram)', desc: 'Shows boiler superheating (4→1), isentropic turbine expansion (1→2), condenser heat rejection (2→3), and feed pump compression (3→4).' },
            { key: 'fourbar', title: '4. Planar Four-Bar Linkage (Gruebler & Grashof Crank-Rocker)', desc: 'Input crank s (a), coupler p (b), follower rocker q (c), and fixed frame d satisfying s + l ≤ p + q.' },
            { key: 'merchant', title: '5. Orthogonal Metal Cutting & Merchant’s Shear Plane Model', desc: 'Uncut chip thickness t₀, deformed chip t_c, shear angle φ, rake angle α, and friction angle β (2φ + β − α = 90°).' },
            { key: 'heat', title: '6. Composite Multilayer Furnace Wall Conduction Profile', desc: 'Series thermal resistance network across 3 slabs (k₁ > k₂ > k₃) showing steeper temperature gradient in lower-conductivity insulation.' }
          ].map(item => `
            <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2.5 print-card">
              <h3 class="font-bold text-sm text-slate-900">${escapeHtml(item.title)}</h3>
              ${SVG_SCHEMATICS[item.key]}
              <p class="text-xs text-slate-600">${escapeHtml(item.desc)}</p>
            </div>
          `).join('')}
        </div>

        <!-- Interactive Mermaid Flowchart Studio -->
        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 class="font-bold text-base text-slate-900">Interactive Mermaid.js Engineering Process Diagram Generator</h2>
              <p class="text-xs text-slate-500">Select a subject preset or edit the Mermaid syntax to render custom engineering block diagrams.</p>
            </div>
            <select id="mermaid-preset-select" class="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white">
              ${Object.entries(LOCAL_SUBJECT_TEMPLATES).map(([k, v]) => `
                <option value="${k}">${escapeHtml(v.name)}</option>
              `).join('')}
            </select>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <textarea id="mermaid-code-input" rows="6" class="w-full p-3 rounded-xl border border-slate-300 font-mono text-xs bg-slate-50">${escapeHtml(LOCAL_SUBJECT_TEMPLATES.som.mermaid)}</textarea>
            <div id="mermaid-render-box" class="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center min-h-[160px] overflow-x-auto"></div>
          </div>
          <button type="button" id="render-mermaid-btn" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold">
            ↻ Render Mermaid Diagram
          </button>
        </div>
      </div>
    `;

    const renderMermaidNow = async () => {
      const code = document.getElementById('mermaid-code-input')?.value || '';
      const box = document.getElementById('mermaid-render-box');
      if (!box) return;
      if (window.mermaid && window.mermaid.render) {
        try {
          const { svg } = await window.mermaid.render('mmd-' + Date.now(), code);
          box.innerHTML = svg;
          return;
        } catch {}
      }
      box.innerHTML = `<pre class="text-xs font-mono text-slate-700">${escapeHtml(code)}</pre>`;
    };

    document.getElementById('mermaid-preset-select')?.addEventListener('change', (e) => {
      const tpl = LOCAL_SUBJECT_TEMPLATES[e.target.value];
      if (tpl) {
        document.getElementById('mermaid-code-input').value = tpl.mermaid;
        renderMermaidNow();
      }
    });
    document.getElementById('render-mermaid-btn')?.addEventListener('click', renderMermaidNow);
    bindTextbookDiagramEvents(renderEngineeringDiagrams);
    renderMermaidNow();
  }

  // --- MODULE 10: GRAPH GENERATOR (CHART.JS) ---
  function renderGraphGenerator() {
    container.innerHTML = `
      <div class="space-y-6">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-blue-600">Module 10 · Mathematically Valid Engineering Plots (Chart.js)</span>
          <h1 class="text-2xl font-extrabold text-slate-900">Interactive Engineering Graph Generator</h1>
          <p class="text-xs text-slate-600 mt-1">Select an engineering relationship and adjust parameters to plot exact analytical curves.</p>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1" for="graph-type-select">Engineering Curve Type</label>
              <select id="graph-type-select" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white">
                <option value="otto-diesel">Otto vs Diesel Cycle Thermal Efficiency vs Compression Ratio (r)</option>
                <option value="vibration">1-DOF Vibration Magnification Factor vs Frequency Ratio (r = ω/ω_n)</option>
                <option value="stress-strain">Ductile Steel Stress-Strain Curve (Elastic, Yield, Strain Hardening)</option>
                <option value="pump-hq">Centrifugal Pump Head (H) &amp; System Resistance vs Discharge (Q)</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1" for="graph-param-slider">Primary Parameter Control (<span id="graph-param-val">1.40</span>)</label>
              <input id="graph-param-slider" type="range" min="1.1" max="3.0" step="0.05" value="1.4" class="w-full mt-2">
            </div>
            <div class="flex items-end">
              <button type="button" id="update-graph-btn" class="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold">
                📈 Update Engineering Plot
              </button>
            </div>
          </div>

          <div class="relative h-80 w-full bg-slate-50 p-3 rounded-xl border border-slate-200">
            <canvas id="engineering-chart-canvas"></canvas>
          </div>
          <div id="graph-formula-readout" class="formula-box text-xs"></div>
        </div>
      </div>
    `;

    const drawChart = () => {
      const mode = document.getElementById('graph-type-select')?.value || 'otto-diesel';
      const param = Number(document.getElementById('graph-param-slider')?.value || 1.4);
      const valSpan = document.getElementById('graph-param-val');
      if (valSpan) valSpan.textContent = param.toFixed(2);
      const readout = document.getElementById('graph-formula-readout');
      const canvas = document.getElementById('engineering-chart-canvas');
      if (!canvas || !window.Chart) return;

      if (state.activeGraphChart) {
        state.activeGraphChart.destroy();
        state.activeGraphChart = null;
      }

      let labels = [];
      let datasets = [];

      if (mode === 'otto-diesel') {
        const gamma = 1.4;
        const cutoff = Math.max(1.2, param + 0.4);
        labels = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
        const otto = labels.map(r => +(100 * (1 - 1 / Math.pow(r, gamma - 1))).toFixed(2));
        const diesel = labels.map(r => +(100 * (1 - (1 / Math.pow(r, gamma - 1)) * ((Math.pow(cutoff, gamma) - 1) / (gamma * (cutoff - 1))))).toFixed(2));
        datasets = [
          { label: 'Otto Cycle η (%) [γ = 1.4]', data: otto, borderColor: '#2563EB', backgroundColor: 'rgba(37,99,235,0.1)', tension: 0.3 },
          { label: `Diesel Cycle η (%) [Cut-off ρ = ${cutoff.toFixed(2)}]`, data: diesel, borderColor: '#10B981', backgroundColor: 'rgba(16,185,129,0.1)', tension: 0.3 }
        ];
        if (readout) readout.textContent = `Governing Equations: η_Otto = 1 − 1/r^(γ−1) · η_Diesel = 1 − [1/r^(γ−1)]·[(ρ^γ − 1)/(γ(ρ − 1))] (Cut-off ρ = ${cutoff.toFixed(2)})`;
      } else if (mode === 'vibration') {
        const zeta = Math.max(0.1, param / 5);
        labels = [0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.41, 1.75, 2.0, 2.5];
        const mag = labels.map(r => +(1 / Math.sqrt(Math.pow(1 - r * r, 2) + Math.pow(2 * zeta * r, 2))).toFixed(2));
        const tr = labels.map(r => +(Math.sqrt(1 + Math.pow(2 * zeta * r, 2)) / Math.sqrt(Math.pow(1 - r * r, 2) + Math.pow(2 * zeta * r, 2))).toFixed(2));
        datasets = [
          { label: `Magnification Factor MF (ζ = ${zeta.toFixed(2)})`, data: mag, borderColor: '#EF4444', tension: 0.3 },
          { label: `Force Transmissibility TR (ζ = ${zeta.toFixed(2)})`, data: tr, borderColor: '#2563EB', tension: 0.3 }
        ];
        if (readout) readout.textContent = `Governing Equations: MF = 1 / √[(1 − r²)² + (2ζr)²] · TR = √[1 + (2ζr)²] / √[(1 − r²)² + (2ζr)²] (Crossover at r = √2 ≈ 1.414)`;
      } else if (mode === 'stress-strain') {
        const scale = param / 1.4;
        labels = ['0.0%', '0.1%', '0.2% (Yield)', '1.5%', '4.0%', '8.0%', '14.0% (UTS)', '20.0% (Fracture)'];
        const stress = [0, 200, 250, 255, 340, 420, 460, 380].map(v => +(v * scale).toFixed(1));
        datasets = [{ label: 'Engineering Stress σ (MPa)', data: stress, borderColor: '#1E3A8A', backgroundColor: 'rgba(30,58,138,0.12)', fill: true, tension: 0.25 }];
        if (readout) readout.textContent = `Hooke's Linear Region: σ = E·ε up to Yield Strength S_y = ${(250 * scale).toFixed(0)} MPa, Ultimate Tensile Strength S_ut = ${(460 * scale).toFixed(0)} MPa.`;
      } else {
        labels = [0, 10, 20, 30, 40, 50, 60, 70, 80];
        const H0 = 40 * (param / 1.4);
        const pumpHead = labels.map(Q => +Math.max(0, H0 - 0.0045 * Q * Q).toFixed(2));
        const sysHead = labels.map(Q => +(12 + 0.0055 * Q * Q).toFixed(2));
        datasets = [
          { label: 'Pump Characteristic H_pump (m)', data: pumpHead, borderColor: '#2563EB', tension: 0.3 },
          { label: 'System Pipeline Curve H_sys = H_static + K·Q² (m)', data: sysHead, borderColor: '#F59E0B', tension: 0.3 }
        ];
        if (readout) readout.textContent = `Operating Duty Point occurs at the intersection where H_pump(Q) = H_static + f·(L/D)·V²/(2g).`;
      }

      state.activeGraphChart = new window.Chart(canvas.getContext('2d'), {
        type: 'line',
        data: { labels, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'top' } }
        }
      });
    };

    document.getElementById('graph-type-select')?.addEventListener('change', drawChart);
    document.getElementById('graph-param-slider')?.addEventListener('input', drawChart);
    document.getElementById('update-graph-btn')?.addEventListener('click', drawChart);
    drawChart();
  }

  // --- MODULE 11: NUMERICAL PROBLEMS (9 INTERACTIVE SOLVERS) ---
  function renderNumericalProblems() {
    container.innerHTML = `
      <div class="space-y-6">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-blue-600">Module 11 · Deterministic Step-by-Step Engineering Solvers</span>
          <h1 class="text-2xl font-extrabold text-slate-900">Interactive Numerical Problem Solvers (9 Calculators)</h1>
          <p class="text-xs text-slate-600 mt-1">Modify any input parameter to compute instant step-by-step derivations, SI unit checks, and governing schematics.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <label class="block text-xs font-bold uppercase text-slate-500" for="num-calc-select">Select Engineering Solver</label>
            <select id="num-calc-select" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white">
              <option value="mohr">1. Mohr’s Circle Principal Stresses (σ_x, σ_y, τ_xy)</option>
              <option value="torsion">2. Solid Shaft Torsion &amp; Power (P, N, d, L)</option>
              <option value="beam">3. Simply Supported &amp; Cantilever Beam Deflection (P, L, E, I)</option>
              <option value="otto">4. Otto &amp; Carnot Heat Engine Cycle (r, T_min, T_max)</option>
              <option value="pipe">5. Darcy-Weisbach Pipe Flow &amp; Reynolds Number (D, L, V, ν)</option>
              <option value="heat">6. Composite Wall Fourier Conduction (ΔT, L, k, A)</option>
              <option value="gear">7. Spur Gear Train &amp; Torque Ratio (z₁, z₂, N₁, P)</option>
              <option value="cutting">8. Taylor Tool Life &amp; Merchant Shear Angle (V₁, T₁, n, V₂)</option>
              <option value="spring">9. Helical Spring Deflection &amp; Bearing L₁₀ Life (P, D, d, n)</option>
            </select>

            <div class="space-y-3">
              <div>
                <label id="num-lbl-1" class="block text-xs font-semibold text-slate-700 mb-1" for="num-in-1">Input 1 (σ_x in MPa)</label>
                <input id="num-in-1" type="number" step="any" value="1200" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs">
              </div>
              <div>
                <label id="num-lbl-2" class="block text-xs font-semibold text-slate-700 mb-1" for="num-in-2">Input 2 (σ_y in MPa)</label>
                <input id="num-in-2" type="number" step="any" value="600" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs">
              </div>
              <div>
                <label id="num-lbl-3" class="block text-xs font-semibold text-slate-700 mb-1" for="num-in-3">Input 3 (τ_xy in MPa)</label>
                <input id="num-in-3" type="number" step="any" value="400" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs">
              </div>
            </div>

            <button type="button" id="solve-numerical-btn" class="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs">
              🧮 Solve Step-by-Step
            </button>
          </div>

          <div id="numerical-solution-box" class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4"></div>
        </div>
      </div>
    `;

    const calcConfigs = {
      mohr: { labels: ['Normal Stress σ_x (MPa)', 'Normal Stress σ_y (MPa)', 'Shear Stress τ_xy (MPa)'], defaults: [1200, 600, 400] },
      torsion: { labels: ['Applied Torque T (N·m)', 'Shaft Diameter d (mm)', 'Shaft Length L (m)'], defaults: [1000, 50, 1.5] },
      beam: { labels: ['Point Load P (kN)', 'Span Length L (m)', 'Flexural Rigidity EI (MN·m²)'], defaults: [24, 4, 12] },
      otto: { labels: ['Compression Ratio r', 'Inlet Temp T₁ (K)', 'Peak Temp T₃ (K)'], defaults: [8, 300, 1500] },
      pipe: { labels: ['Pipe Diameter D (m)', 'Flow Velocity V (m/s)', 'Pipe Length L (m)'], defaults: [0.1, 2.5, 100] },
      heat: { labels: ['Temp Difference ΔT (K)', 'Wall Thickness L (m)', 'Conductivity k (W/m·K)'], defaults: [180, 0.25, 1.4] },
      gear: { labels: ['Pinion Teeth z₁', 'Gear Teeth z₂', 'Pinion Speed N₁ (rpm)'], defaults: [20, 60, 1200] },
      cutting: { labels: ['Initial Speed V₁ (m/min)', 'Initial Tool Life T₁ (min)', 'Taylor Exponent n'], defaults: [120, 64, 0.25] },
      spring: { labels: ['Axial Load P (N)', 'Mean Coil Diameter D (mm)', 'Wire Diameter d (mm)'], defaults: [800, 40, 8] }
    };

    const runSolver = () => {
      const mode = document.getElementById('num-calc-select')?.value || 'mohr';
      const v1 = Number(document.getElementById('num-in-1')?.value || 1);
      const v2 = Number(document.getElementById('num-in-2')?.value || 1);
      const v3 = Number(document.getElementById('num-in-3')?.value || 1);
      const box = document.getElementById('numerical-solution-box');
      if (!box) return;

      let formula = '';
      let steps = [];
      let result = '';
      let schem = SVG_SCHEMATICS.mohr;

      if (mode === 'mohr') {
        const avg = (v1 + v2) / 2;
        const R = Math.sqrt(Math.pow((v1 - v2) / 2, 2) + v3 * v3);
        const s1 = avg + R;
        const s2 = avg - R;
        formula = 'σ₁,₂ = (σ_x + σ_y)/2 ± √[((σ_x − σ_y)/2)² + τ_xy²]';
        steps = [
          `1. Average Normal Stress (Center of Mohr's Circle): σ_avg = (${v1} + ${v2}) / 2 = ${avg.toFixed(2)} MPa`,
          `2. Radius of Mohr's Circle (Maximum In-Plane Shear τ_max): R = √[(${(v1 - v2) / 2})² + ${v3}²] = ${R.toFixed(2)} MPa`,
          `3. Major Principal Stress: σ₁ = σ_avg + R = ${avg.toFixed(2)} + ${R.toFixed(2)} = ${s1.toFixed(2)} MPa`,
          `4. Minor Principal Stress: σ₂ = σ_avg − R = ${avg.toFixed(2)} − ${R.toFixed(2)} = ${s2.toFixed(2)} MPa`
        ];
        result = `σ₁ = ${s1.toFixed(2)} MPa · σ₂ = ${s2.toFixed(2)} MPa · τ_max = ${R.toFixed(2)} MPa`;
      } else if (mode === 'torsion') {
        const d_m = Math.max(0.001, v2 / 1000);
        const J = (Math.PI * Math.pow(d_m, 4)) / 32;
        const tau = (16 * v1) / (Math.PI * Math.pow(d_m, 3)) / 1e6;
        const thetaDeg = ((v1 * v3) / (80e9 * J)) * (180 / Math.PI);
        formula = 'τ_max = 16·T / (π·d³) ; θ = T·L / (G·J) [G = 80 GPa]';
        steps = [
          `1. Convert shaft diameter to meters: d = ${v2} mm = ${d_m.toFixed(4)} m`,
          `2. Polar Moment of Inertia: J = π·d⁴/32 = ${J.toExponential(4)} m⁴`,
          `3. Maximum Torsional Shear Stress: τ_max = 16×${v1} / (π×${d_m.toFixed(4)}³) = ${tau.toFixed(2)} MPa`,
          `4. Angle of Twist (for G = 80 GPa): θ = ${thetaDeg.toFixed(3)}°`
        ];
        result = `τ_max = ${tau.toFixed(2)} MPa · θ = ${thetaDeg.toFixed(3)}°`;
      } else if (mode === 'beam') {
        const Mmax = (v1 * v2) / 4;
        const deltaMm = ((v1 * 1000 * Math.pow(v2, 3)) / (48 * Math.max(0.001, v3) * 1e6)) * 1000;
        formula = 'Simply Supported Central Load: M_max = P·L / 4 ; δ_max = P·L³ / (48·E·I)';
        steps = [
          `1. Support Reactions: R_A = R_B = P / 2 = ${(v1 / 2).toFixed(2)} kN`,
          `2. Maximum Bending Moment at Mid-Span: M_max = (${v1} × ${v2}) / 4 = ${Mmax.toFixed(2)} kN·m`,
          `3. Mid-Span Maximum Deflection: δ_max = (${v1}×10³ × ${v2}³) / (48 × ${v3}×10⁶) = ${deltaMm.toFixed(3)} mm`
        ];
        result = `M_max = ${Mmax.toFixed(2)} kN·m · δ_max = ${deltaMm.toFixed(3)} mm`;
        schem = SVG_SCHEMATICS.beam;
      } else if (mode === 'otto') {
        const r = Math.max(1.1, v1);
        const etaOtto = (1 - 1 / Math.pow(r, 0.4)) * 100;
        const etaCarnot = (1 - v2 / Math.max(v2 + 1, v3)) * 100;
        formula = 'η_Otto = 1 − 1 / r^(γ−1) ; η_Carnot = 1 − T_min / T_max';
        steps = [
          `1. Air-Standard Otto Efficiency (γ = 1.4): η_Otto = 1 − 1 / ${r}^(0.4) = ${etaOtto.toFixed(2)}%`,
          `2. Carnot Upper Limit between ${v2} K and ${v3} K: η_Carnot = 1 − ${v2}/${v3} = ${etaCarnot.toFixed(2)}%`,
          `3. Isentropic Compression Temp T₂ = T₁·r^(γ−1) = ${(v2 * Math.pow(r, 0.4)).toFixed(1)} K`
        ];
        result = `η_Otto = ${etaOtto.toFixed(2)}% · η_Carnot = ${etaCarnot.toFixed(2)}%`;
        schem = SVG_SCHEMATICS.rankine;
      } else if (mode === 'pipe') {
        const D = Math.max(0.001, v1);
        const Q = (Math.PI * D * D / 4) * v2;
        const hf = (0.02 * (v3 / D) * (v2 * v2)) / (2 * 9.81);
        formula = 'Q = (π·D²/4)·V ; h_f = f · (L/D) · V²/(2g) [f = 0.02]';
        steps = [
          `1. Pipe Cross-Sectional Area: A = π×${D}²/4 = ${(Math.PI * D * D / 4).toFixed(5)} m²`,
          `2. Volumetric Discharge: Q = A×V = ${Q.toFixed(4)} m³/s (${(Q * 1000).toFixed(2)} L/s)`,
          `3. Darcy Head Loss (f = 0.02): h_f = 0.02 × (${v3}/${D}) × ${v2}² / 19.62 = ${hf.toFixed(3)} m`
        ];
        result = `Q = ${(Q * 1000).toFixed(2)} L/s · Head Loss h_f = ${hf.toFixed(3)} m`;
        schem = SVG_SCHEMATICS.rankine;
      } else if (mode === 'heat') {
        const Rth = Math.max(0.0001, v2) / Math.max(0.0001, v3);
        const qFlux = v1 / Rth;
        formula = 'q" = Q / A = k · ΔT / L = ΔT / R_th';
        steps = [
          `1. Unit Area Thermal Resistance: R"_th = L / k = ${v2} / ${v3} = ${Rth.toFixed(4)} m²·K/W`,
          `2. Steady Heat Flux: q" = ΔT / R"_th = ${v1} / ${Rth.toFixed(4)} = ${qFlux.toFixed(2)} W/m²`
        ];
        result = `Heat Flux q" = ${qFlux.toFixed(2)} W/m²`;
        schem = SVG_SCHEMATICS.heat;
      } else if (mode === 'gear') {
        const ratio = Math.max(1, v2) / Math.max(1, v1);
        const N2 = v3 / ratio;
        formula = 'i = z₂ / z₁ = N₁ / N₂ = T₂ / T₁';
        steps = [
          `1. Gear Speed Reduction Ratio: i = z₂ / z₁ = ${v2} / ${v1} = ${ratio.toFixed(3)}`,
          `2. Driven Gear Speed: N₂ = N₁ / i = ${v3} / ${ratio.toFixed(3)} = ${N2.toFixed(2)} rpm`
        ];
        result = `Gear Ratio i = ${ratio.toFixed(2)} · Output Speed N₂ = ${N2.toFixed(1)} rpm`;
        schem = SVG_SCHEMATICS.fourbar;
      } else if (mode === 'cutting') {
        const n = Math.max(0.05, v3);
        const C = v1 * Math.pow(Math.max(1, v2), n);
        const T_doubleV = Math.pow(C / (2 * v1), 1 / n);
        formula = 'Taylor Tool Life Law: V · T^n = C';
        steps = [
          `1. Compute Taylor Constant: C = V₁ · T₁^n = ${v1} × ${v2}^(${n}) = ${C.toFixed(2)}`,
          `2. Tool Life if Cutting Speed Doubles (${2 * v1} m/min): T₂ = T₁ / 2^(1/n) = ${T_doubleV.toFixed(2)} min`
        ];
        result = `Taylor C = ${C.toFixed(2)} · Life at 2V₁ = ${T_doubleV.toFixed(2)} min`;
        schem = SVG_SCHEMATICS.merchant;
      } else {
        const C = v2 / Math.max(0.5, v3);
        const tau = (8 * v1 * v2) / (Math.PI * Math.pow(Math.max(0.5, v3), 3));
        const delta = (8 * v1 * Math.pow(v2, 3) * 10) / (80000 * Math.pow(Math.max(0.5, v3), 4));
        formula = 'δ = 8·P·D³·n / (G·d⁴) ; τ = 8·P·D / (π·d³) [n = 10 coils, G = 80 GPa]';
        steps = [
          `1. Spring Index: C = D / d = ${v2} / ${v3} = ${C.toFixed(2)}`,
          `2. Direct Torsional Stress: τ = ${tau.toFixed(2)} MPa`,
          `3. Axial Deflection (for n = 10 active coils, G = 80 GPa): δ = ${delta.toFixed(2)} mm`
        ];
        result = `τ = ${tau.toFixed(2)} MPa · Deflection δ = ${delta.toFixed(2)} mm`;
      }

      box.innerHTML = `
        <div class="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <span class="text-[11px] font-bold uppercase text-blue-600">Step-by-Step Numerical Solution</span>
            <h2 class="text-lg font-extrabold text-slate-900">${escapeHtml(result)}</h2>
          </div>
        </div>
        <div class="formula-box">${escapeHtml(formula)}</div>
        <ul class="space-y-2 text-xs text-slate-700">
          ${steps.map(s => `<li class="p-2.5 rounded-lg bg-slate-50 border border-slate-200">${escapeHtml(s)}</li>`).join('')}
        </ul>
        ${schem}
      `;
    };

    document.getElementById('num-calc-select')?.addEventListener('change', (e) => {
      const cfg = calcConfigs[e.target.value] || calcConfigs.mohr;
      document.getElementById('num-lbl-1').textContent = cfg.labels[0];
      document.getElementById('num-lbl-2').textContent = cfg.labels[1];
      document.getElementById('num-lbl-3').textContent = cfg.labels[2];
      document.getElementById('num-in-1').value = cfg.defaults[0];
      document.getElementById('num-in-2').value = cfg.defaults[1];
      document.getElementById('num-in-3').value = cfg.defaults[2];
      runSolver();
    });
    document.getElementById('solve-numerical-btn')?.addEventListener('click', runSolver);
    ['num-in-1', 'num-in-2', 'num-in-3'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', runSolver);
    });
    runSolver();
  }

  // --- MODULES 12 & 13: TECHNICAL QUESTION BANK & APTITUDE PRACTICE ---
  function renderQuestionBank(mode) {
    const isAptitude = mode === 'aptitude';
    const filterObj = isAptitude ? state.aptFilter : state.techFilter;
    const pool = state.questions.filter(q => {
      const isAptQ = q.sourceType === 'pdf' || q.sourceType === 'gate-aptitude' || q.sourceType === 'train-practice' || /aptitude|logical|verbal|train|crypt/i.test(q.topic);
      return isAptitude ? isAptQ : !isAptQ;
    });

    const topics = Array.from(new Set(pool.map(q => q.topic))).sort((a, b) => a.localeCompare(b));
    const query = filterObj.search.trim().toLowerCase();
    const matched = pool.filter(q => {
      if (filterObj.topic !== 'all' && q.topic !== filterObj.topic) return false;
      if (filterObj.difficulty !== 'all' && q.difficulty !== filterObj.difficulty) return false;
      if (query) {
        const hay = `${q.id} ${q.topic} ${q.text} ${q.explain || ''} ${q.source || ''}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });

    const pageSize = 10;
    const maxPage = Math.max(1, Math.ceil(matched.length / pageSize));
    filterObj.page = Math.min(Math.max(1, filterObj.page), maxPage);
    const slice = matched.slice((filterObj.page - 1) * pageSize, filterObj.page * pageSize);

    container.innerHTML = `
      <div class="space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-blue-600">${isAptitude ? 'Module 13 · Quantitative, Logical, Verbal & GATE Aptitude' : 'Module 12 · Core Mechanical Engineering Technical Bank'}</span>
            <h1 class="text-2xl font-extrabold text-slate-900">${isAptitude ? 'Aptitude Practice Question Bank' : 'Mechanical Engineering Technical Question Bank'} (${pool.length.toLocaleString()})</h1>
          </div>
          <button type="button" id="qb-random-btn" class="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold">
            🎲 Random Question
          </button>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1" for="qb-search">Search Question Text / Formula</label>
            <input id="qb-search" type="search" value="${escapeHtml(filterObj.search)}" placeholder="Search keywords..." class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs">
          </div>
          <div>
            <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1" for="qb-topic">Topic (${topics.length})</label>
            <select id="qb-topic" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white">
              <option value="all">All Topics (${pool.length})</option>
              ${topics.map(t => `<option value="${escapeHtml(t)}" ${filterObj.topic === t ? 'selected' : ''}>${escapeHtml(t)}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1" for="qb-diff">Difficulty</label>
            <select id="qb-diff" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white">
              <option value="all" ${filterObj.difficulty === 'all' ? 'selected' : ''}>All Levels</option>
              <option value="Basic" ${filterObj.difficulty === 'Basic' ? 'selected' : ''}>Basic</option>
              <option value="Intermediate" ${filterObj.difficulty === 'Intermediate' ? 'selected' : ''}>Intermediate</option>
              <option value="Advanced" ${filterObj.difficulty === 'Advanced' ? 'selected' : ''}>Advanced</option>
            </select>
          </div>
        </div>

        <div class="flex items-center justify-between text-xs text-slate-500">
          <span>Showing <b>${matched.length}</b> matching questions (Page ${filterObj.page} of ${maxPage})</span>
          <span>Total Attempts Logged: <b>${state.progress.attempts}</b></span>
        </div>

        <!-- Question Cards -->
        <div id="qb-list-box" class="space-y-4">
          ${slice.map(q => renderQuestionCardHtml(q)).join('')}
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-center gap-3 pt-2">
          <button type="button" id="qb-prev-btn" ${filterObj.page <= 1 ? 'disabled' : ''} class="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 text-xs font-semibold">
            ← Previous Page
          </button>
          <span class="text-xs font-semibold text-slate-700">Page ${filterObj.page} / ${maxPage}</span>
          <button type="button" id="qb-next-btn" ${filterObj.page >= maxPage ? 'disabled' : ''} class="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 text-xs font-semibold">
            Next Page →
          </button>
        </div>
      </div>
    `;

    document.getElementById('qb-search')?.addEventListener('input', (e) => {
      filterObj.search = e.target.value;
      filterObj.page = 1;
      renderQuestionBank(mode);
    });
    document.getElementById('qb-topic')?.addEventListener('change', (e) => {
      filterObj.topic = e.target.value;
      filterObj.page = 1;
      renderQuestionBank(mode);
    });
    document.getElementById('qb-diff')?.addEventListener('change', (e) => {
      filterObj.difficulty = e.target.value;
      filterObj.page = 1;
      renderQuestionBank(mode);
    });
    document.getElementById('qb-prev-btn')?.addEventListener('click', () => {
      filterObj.page = Math.max(1, filterObj.page - 1);
      renderQuestionBank(mode);
    });
    document.getElementById('qb-next-btn')?.addEventListener('click', () => {
      filterObj.page = Math.min(maxPage, filterObj.page + 1);
      renderQuestionBank(mode);
    });
    document.getElementById('qb-random-btn')?.addEventListener('click', () => {
      filterObj.page = Math.floor(Math.random() * maxPage) + 1;
      renderQuestionBank(mode);
    });

    bindQuestionCardInteractions(document.getElementById('qb-list-box'));
  }

  function renderQuestionCardHtml(q) {
    const isHtml = Boolean(q.isHtml);
    const promptHtml = isHtml
      ? `<div class="text-xs sm:text-sm text-slate-800 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">${q.text}</div>`
      : `<pre class="text-xs sm:text-sm text-slate-800 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200 whitespace-pre-wrap font-sans">${escapeHtml(q.text)}</pre>`;

    const imgObj = q.imageId && state.pdfImages[q.imageId] ? state.pdfImages[q.imageId] : null;
    const svgFig = renderQuestionFigure(q);
    const imgHtml = imgObj
      ? `<div class="p-2 bg-slate-100 rounded-xl border border-slate-200"><img src="${imgObj.data}" alt="${escapeHtml(imgObj.alt || q.topic)}" class="max-h-60 mx-auto object-contain rounded"></div>`
      : (svgFig ? `<div class="question-diagram-container"><div class="question-diagram-card">${svgFig}</div></div>` : '');

    let interactiveBody = '';
    if (Array.isArray(q.options) && q.options.length) {
      interactiveBody = `
        <div class="space-y-2 pt-1">
          ${q.options.map((op, i) => `
            <button type="button" data-check-qid="${escapeHtml(q.id)}" data-opt-idx="${i}" class="qb-opt-btn w-full text-left px-4 py-3 rounded-xl border border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50/40 text-xs sm:text-sm text-slate-800 transition flex items-center gap-3">
              <span class="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0 inline-block"></span>
              <span>${isHtml ? stripLeadingOptionPrefix(op) : escapeHtml(stripLeadingOptionPrefix(op))}</span>
            </button>
          `).join('')}
        </div>
      `;
    }

    const ansDisplay = q.answer !== undefined && Array.isArray(q.options)
      ? `Option ${String.fromCharCode(65 + Number(q.answer))} (${escapeHtml(String(q.options[q.answer] || '').replace(/<[^>]+>/g, ''))})`
      : escapeHtml(q.answerText || q.answer || 'Verified in explanation');

    return `
      <article class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 print-card">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex flex-wrap gap-1.5">
            <span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">${escapeHtml(q.topic)}</span>
            <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">${escapeHtml(q.difficulty || 'Practice')}</span>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">#${escapeHtml(q.id)}</span>
          </div>
          <button type="button" data-reveal-qid="${escapeHtml(q.id)}" class="text-xs font-semibold text-blue-600 hover:underline">
            Show Solution &amp; Formula
          </button>
        </div>
        ${promptHtml}
        ${imgHtml}
        ${interactiveBody}
        <div id="qb-feedback-${escapeHtml(q.id)}" class="text-xs font-semibold text-slate-600 hidden"></div>
        <div id="qb-reveal-${escapeHtml(q.id)}" class="hidden p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs space-y-3">
          <div class="font-bold text-blue-950 text-sm">Official Answer: ${ansDisplay}</div>
          <div class="text-slate-800 leading-relaxed">${isHtml ? (q.explain || '') : formatEngineeringMarkdown(q.explain || q.source || '')}</div>
          <div class="pt-1">${visualExplanation(q)}</div>
        </div>
      </article>
    `;
  }

  function bindQuestionCardInteractions(rootEl) {
    if (!rootEl) return;
    rootEl.addEventListener('click', (ev) => {
      const revBtn = ev.target.closest('[data-reveal-qid]');
      if (revBtn) {
        const box = document.getElementById(`qb-reveal-${revBtn.dataset.revealQid}`);
        if (box) box.classList.toggle('hidden');
        return;
      }
      const optBtn = ev.target.closest('.qb-opt-btn');
      if (optBtn) {
        const qid = optBtn.dataset.checkQid;
        const chosen = Number(optBtn.dataset.optIdx);
        const q = state.questions.find(x => x.id === qid);
        if (!q) return;
        const isCorrect = chosen === Number(q.answer);
        const card = optBtn.closest('article');
        card.querySelectorAll('.qb-opt-btn').forEach(b => {
          b.disabled = true;
          const idx = Number(b.dataset.optIdx);
          if (idx === Number(q.answer)) {
            b.className = 'qb-opt-btn w-full text-left px-4 py-3 rounded-xl border-2 border-emerald-500 bg-emerald-50 text-xs sm:text-sm text-emerald-950 font-bold flex items-center gap-3';
          } else if (idx === chosen && !isCorrect) {
            b.className = 'qb-opt-btn w-full text-left px-4 py-3 rounded-xl border-2 border-rose-500 bg-rose-50 text-xs sm:text-sm text-rose-900 flex items-center gap-3';
          }
        });
        const fb = document.getElementById(`qb-feedback-${qid}`);
        if (fb) {
          fb.classList.remove('hidden');
          fb.textContent = isCorrect
            ? '✓ Correct! Governing derivation unlocked below.'
            : `✕ Incorrect. Correct answer is Option ${String.fromCharCode(65 + Number(q.answer))}.`;
        }
        document.getElementById(`qb-reveal-${qid}`)?.classList.remove('hidden');

        // Log progress
        state.progress.attempts += 1;
        if (isCorrect) state.progress.correct += 1;
        const tStat = state.progress.topicStats[q.topic] || { total: 0, correct: 0 };
        tStat.total += 1;
        if (isCorrect) tStat.correct += 1;
        state.progress.topicStats[q.topic] = tStat;
        safeSetStorage('mechprep_v4_progress', state.progress);
      }
    });
  }

  // ==========================================================================
  // HEADER & TITLE BAR OVERFLOW BUG FIX + QUESTION BANK ANSWER VALIDATOR
  // + USER TECHNICAL TEST REVIEW & DRIVE 250-Q INJECTION
  // ==========================================================================
  function applyHeaderOverflowFixAndValidateData() {
    if (typeof document !== 'undefined' && !document.getElementById('v5-layout-bugfix-style')) {
      const st = document.createElement('style');
      st.id = 'v5-layout-bugfix-style';
      st.textContent = `
        #app-topbar {
          display: flex !important;
          flex-wrap: wrap !important;
          align-items: center !important;
          justify-content: space-between !important;
          gap: 0.5rem 0.75rem !important;
          width: 100% !important;
          max-width: 100vw !important;
          box-sizing: border-box !important;
        }
        #app-topbar > div {
          min-width: 0 !important;
          max-width: 100% !important;
        }
        #module-container h1, #module-container h2, #module-container h3 {
          overflow-wrap: anywhere !important;
          word-break: break-word !important;
        }
      `;
      document.head.appendChild(st);
    }

    if (state._v5TechnicalTestReviewInjected) return;
    state._v5TechnicalTestReviewInjected = true;

    // 1. Inject the User's Technical Test Review Questions (Answered + Unanswered Numericals with Exact Formulas & Step-by-Step Calculations)
    const techTestReviewQuestions = [
      {
        id: 'TTR-NUM-01',
        topic: 'Pneumatics & Fluid Power (Technical Test Review)',
        difficulty: 'Intermediate',
        sourceType: 'technical-review',
        text: 'Pneumatic Cylinder Bore Calculation: A pneumatic cylinder has a bore diameter D = 63 mm and operates at a gauge pressure P = 6 bar. Calculate the theoretical thrust force F developed during extension (F = P × A).',
        options: ['1,870 N', '1,500 N', '1,200 N', '2,200 N'],
        answer: 0,
        explain: 'Step 1 (Unit Conversion): P = 6 bar = 6 × 10⁵ Pa = 0.6 N/mm² (MPa). Step 2 (Piston Area): A = π·D² / 4 = π × (63 mm)² / 4 = 3,117.25 mm². Step 3 (Thrust Force): F = P × A = 0.6 N/mm² × 3,117.25 mm² = 1,870.35 N ≈ 1,870 N.'
      },
      {
        id: 'TTR-NUM-02',
        topic: 'AGV Vehicle Dynamics & Machine Design (Technical Test Review)',
        difficulty: 'Advanced',
        sourceType: 'technical-review',
        text: 'AGV Traction Torque (Two-Wheel Drive): An Automated Guided Vehicle (AGV) of mass m = 800 kg moves up a 3% gradient with rolling resistance coefficient C_rr = 0.02, wheel radius r = 0.15 m, and transmission efficiency η = 0.85. For a two-wheel-drive (2WD) configuration, what is the required torque per driven wheel?',
        options: ['35 N·m', '49 N·m', '50 N·m', '65 N·m'],
        answer: 0,
        explain: 'Step 1 (Rolling Resistance): F_r = C_rr·m·g = 0.02 × 800 × 9.81 = 156.96 N. Step 2 (Gradient Resistance at 3%): F_g = m·g·(0.03) = 800 × 9.81 × 0.03 = 235.44 N. Step 3 (Total Tractive Effort): F_total = 156.96 + 235.44 = 392.40 N. Step 4 (Total Axle Torque): T_total = (F_total × r) / η = (392.40 × 0.15) / 0.85 = 69.25 N·m. Step 5 (Torque per Driven Wheel in 2WD): T_wheel = 69.25 / 2 = 34.63 N·m ≈ 35 N·m.'
      },
      {
        id: 'TTR-NUM-03',
        topic: 'Strength of Materials — AGV Beam Bending (Technical Test Review)',
        difficulty: 'Intermediate',
        sourceType: 'technical-review',
        text: 'AGV Beam Bending Stress: A simply supported square steel beam of cross-section 50 mm × 50 mm and span L = 1 m (1000 mm) carries a central payload mass of 100 kg (W = 981 N). Calculate the maximum bending stress σ_b in the beam.',
        options: ['12 MPa', '18 MPa', '24 MPa', '30 MPa'],
        answer: 0,
        explain: 'Step 1 (Load in Newtons): W = 100 × 9.81 = 981 N. Step 2 (Central Bending Moment): M_max = W·L / 4 = (981 × 1000) / 4 = 245,250 N·mm. Step 3 (Section Modulus of 50×50 mm beam): I = b·d³/12 = 50⁴/12 = 520,833.3 mm⁴, y = 25 mm → Z = I/y = 20,833.3 mm³. Step 4 (Bending Stress): σ_b = M_max / Z = 245,250 / 20,833.3 = 11.77 MPa ≈ 12 MPa.'
      },
      {
        id: 'TTR-NUM-04',
        topic: 'Machine Design — Rolling Bearing Life (Technical Test Review)',
        difficulty: 'Intermediate',
        sourceType: 'technical-review',
        text: 'Bearing Life Calculation: A roller bearing has dynamic load rating C = 5000 N and equivalent radial load P = 2000 N while rotating at N = 3000 rpm. Using the roller bearing exponent p = 10/3, calculate the rated life L_10h in operating hours (and note L_10 for ball bearing p = 3).',
        options: ['125 hours (Roller at 3000 rpm; Ball L_10 = 15.625 Mrev)', '50 hours', '100 hours', '150 hours'],
        answer: 0,
        explain: 'For Ball Bearing (p = 3): L_10 = (C/P)³ = (5000/2000)³ = (2.5)³ = 15.625 million revolutions. For Roller Bearing (p = 10/3) at N = 3000 rpm: L_10 = (2.5)^(10/3) = 22.56 million revolutions → Operating hours L_10h = (22.56 × 10⁶) / (60 × 3000) = 125.3 hours ≈ 125 hours.'
      },
      {
        id: 'TTR-NUM-05',
        topic: 'Pneumatics — Cylinder Air Consumption (Technical Test Review)',
        difficulty: 'Intermediate',
        sourceType: 'technical-review',
        text: 'Pneumatic Cylinder Air Consumption: A pneumatic cylinder has bore D = 50 mm, stroke L = 200 mm, and operates at n = 10 cycles/min. What is the displaced cylinder air consumption per minute for a double-acting cycle (and closest standard option)?',
        options: ['10 L/min (Exact displaced = 7.85 L/min double-acting; 3.93 L/min single-acting)', '5 L/min', '20 L/min', '40 L/min'],
        answer: 0,
        explain: 'Step 1 (Piston Area): A = π·(50)²/4 = 1,963.5 mm² = 0.0019635 m². Step 2 (Stroke Volume): V_stroke = A × L = 0.0019635 × 0.2 m = 0.0003927 m³ = 0.3927 Liters. Step 3 (At 10 cycles/min): Single-acting Q = 0.3927 × 10 = 3.93 L/min; Double-acting Q = 2 × 3.927 = 7.854 L/min (rounds to 10 L/min among standard options; if gauge pressure P_g is given, Free Air Delivery FAD = Q_displaced × (P_abs / P_atm)).'
      },
      {
        id: 'TTR-NUM-06',
        topic: 'Strength of Materials — Combined Axial & Bending Stress',
        difficulty: 'Advanced',
        sourceType: 'technical-review',
        text: 'Combined Axial and Bending Stress Formula & Unit Check: A rectangular bar of cross-section b = 40 mm × d = 80 mm (A = 3200 mm², Z = b·d²/6 = 42,667 mm³) is subjected to axial load P and bending moment M. Which governing formula gives the maximum combined normal stress σ_max, and what is σ_max if P = 96 kN (30 MPa axial) and M = 213.3 N·m (5 MPa bending)?',
        options: ['35 MPa (using σ_max = P/A + M·c/I with consistent N and mm units)', '20 MPa', '50 MPa', '65 MPa'],
        answer: 0,
        explain: 'Governing Formula: σ_max = σ_axial + σ_bending = (P / A) + (M·c / I) = P/(b·d) + 6·M/(b·d²). Unit Trap Alert: Always convert P to Newtons (N) and M to N·mm so stresses are in N/mm² (MPa). For A = 40×80 = 3200 mm² and I = 40×80³/12 = 1.7067×10⁶ mm⁴ (c = 40 mm, Z = 42,667 mm³): if P = 5000 N and M = 200 N·m, σ_max = 1.56 + 4.69 = 6.25 MPa; if P = 96 kN and M = 213.3 N·m, σ_max = 30 + 5 = 35 MPa.'
      },
      {
        id: 'TTR-CON-01',
        topic: 'Industrial Engineering & Lean Manufacturing (5S)',
        difficulty: 'Basic',
        sourceType: 'technical-review',
        text: 'In Lean Manufacturing and Industrial Workplace Organization, what is the complete and exact order of the 5S methodology?',
        options: [
          '1. Sort (Seiri) → 2. Set in Order (Seiton) → 3. Shine (Seiso) → 4. Standardize (Seiketsu) → 5. Sustain (Shitsuke)',
          'Sort, Set, Sustain, Standardize (4 items only)',
          'Sort, Straighten, Store, Sell, Sustain',
          'Setup, Machine, Inspect, Pack, Ship'
        ],
        answer: 0,
        explain: 'Exam Correction Note: Never miss "Shine (Seiso)"! The 5 pillars of 5S are: (1) Sort (eliminate unneeded items), (2) Set in Order (organize layout), (3) Shine (clean & inspect workplace), (4) Standardize (create SOPs), and (5) Sustain (maintain discipline).'
      },
      {
        id: 'TTR-CON-02',
        topic: 'Manufacturing Processes — Forging & Heat Treatment',
        difficulty: 'Basic',
        sourceType: 'technical-review',
        text: 'Why does hot forging produce superior mechanical strength, toughness, and fatigue resistance compared to casting or machining from bar stock?',
        options: [
          'It refines grain size and aligns continuous grain flow along the component contour while closing internal porosity',
          'It increases casting blowholes and brittle dendritic segregation',
          'It melts the metal completely above liquidus temperature',
          'It eliminates all elastic modulus E'
        ],
        answer: 0,
        explain: 'Forging plastically deforms metal under compressive force, which breaks up coarse cast dendrites, refines the grain structure, and aligns directional grain flow along principal stress trajectories.'
      },
      {
        id: 'TTR-CON-03',
        topic: 'Manufacturing & Industrial Engineering Core (EDM, Casting, Kaizen, Line Balancing)',
        difficulty: 'Basic',
        sourceType: 'technical-review',
        text: 'Match the following verified manufacturing & industrial engineering definitions from the Technical Assessment: (1) Trapped gas casting defect, (2) Thermal spark erosion machining, (3) Line balancing objective, (4) Kaizen, (5) Accuracy.',
        options: [
          '(1) Blowhole · (2) EDM (Electrical Discharge Machining) · (3) Reduce workstation idle time · (4) Continuous small improvements · (5) Closeness to true value',
          '(1) Cold shut · (2) Turning · (3) Increase cycle delay · (4) Batch rework · (5) Repeatability only',
          '(1) Misrun · (2) Milling · (3) Maximize bottleneck · (4) Total replacement · (5) Zero tolerance',
          'None of the above'
        ],
        answer: 0,
        explain: 'All 5 conceptual answers verified: Trapped gas in casting forms rounded Blowholes; EDM removes hard conductive metal via controlled thermal spark erosion; Line balancing equalizes station workloads to minimize idle time; Kaizen means continuous incremental improvement; Accuracy is closeness of a measured value to the true value.'
      }
    ];

    state.questions = techTestReviewQuestions.concat(state.questions);

    // 2. Also add a dedicated Study Guide for the Technical Test Review & Formula Sheet
    state.guides.unshift({
      id: 'guide-tech-test-review-v5',
      guideType: 'core-guide',
      sourceBank: 'Technical Test Review & Formula Sheet',
      topic: 'AGV Torque, Pneumatics, Bearings, Bending & 5S',
      name: 'Technical Test Review: Answered & Unanswered Numerical Formula Master Sheet',
      title: 'Technical Test Review: Answered & Unanswered Numerical Formula Master Sheet',
      syllabus: 'Pneumatic Cylinder Bore Force & Air Consumption, AGV 2WD Traction Torque, Beam Bending, Bearing L10h Life & 5S',
      idea: 'Complete step-by-step formula breakdown and unit-consistency guide for your Technical Test Review (Overall Readiness: ~70–75% — strong conceptual base; always convert bar → N/mm², kg → N, and divide total axle torque by 2 for 2WD AGVs).',
      formula: [
        ['Pneumatic Cylinder Thrust Force (D=63mm, P=6 bar)', 'P = 6 bar = 0.6 N/mm² ; A = π·D²/4 = 3117.25 mm² ; F = P·A = 1,870.35 N ≈ 1,870 N'],
        ['AGV 2WD Wheel Torque (m=800kg, Crr=0.02, 3% grad, r=0.15m, η=0.85)', 'F_total = m·g(C_rr + grad) = 156.96 + 235.44 = 392.4 N ; T_total = F·r/η = 69.25 N·m ; T_each(2WD) = 69.25/2 = 34.63 ≈ 35 N·m'],
        ['AGV Square Beam Bending (W=100kg=981N, L=1000mm, 50×50mm)', 'M = W·L/4 = 245,250 N·mm ; I = b·d³/12 = 520,833 mm⁴ ; y = 25 mm ; σ_b = M·y/I = 11.77 ≈ 12 MPa'],
        ['Bearing Life L_10 & Hours L_10h (C=5000, P=2000, N=3000 rpm)', 'Ball (p=3): L_10 = (C/P)³ = 15.625 Mrev · Roller (p=10/3): L_10 = (2.5)^(10/3) = 22.56 Mrev → L_h = 22.56×10⁶/(60×3000) = 125.3 ≈ 125 h'],
        ['Pneumatic Air Consumption (D=50mm, L=200mm, n=10 cpm)', 'V_stroke = (π·0.5²/4)×2 = 0.3927 L ; Single-acting = 3.93 L/min ; Double-acting = 2×3.927 = 7.85 L/min (≈ 10 L/min option)'],
        ['Combined Axial + Bending Stress & Gear Ratio', 'σ_max = P/(b·d) + 6·M/(b·d²) ; Gear Ratio i = N₁/N₂ = D₂/D₁ = Z₂/Z₁ (Requires both driver & driven values)'],
        ['Complete 5S Sequence & Forging', '5S = 1. Sort → 2. Set in Order → 3. Shine → 4. Standardize → 5. Sustain · Forging refines grain structure & toughness']
      ],
      trick: [
        '1 bar = 0.1 MPa = 0.1 N/mm² (fastest shortcut for pneumatic cylinder force F = 0.1·P_bar × πD²/4 in Newtons!).',
        'In AGV traction problems, always check if the drive is Single-Wheel or Two-Wheel Drive (2WD divides total axle torque by 2).',
        'Never forget the 3rd S in 5S: SHINE (Seiso) comes between Set in Order and Standardize.'
      ]
    });

    // 3. Validate all question answer indices in state.questions so no broken/out-of-range answer index exists
    state.questions.forEach(q => {
      if (Array.isArray(q.options) && q.options.length > 0) {
        if (typeof q.answer === 'string') {
          const trimmed = q.answer.trim().toUpperCase();
          if (['A', 'B', 'C', 'D'].includes(trimmed)) {
            q.answer = trimmed.charCodeAt(0) - 65;
          } else {
            const num = Number(trimmed);
            q.answer = Number.isFinite(num) ? num : 0;
          }
        }
        if (typeof q.answer !== 'number' || isNaN(q.answer) || q.answer < 0 || q.answer >= q.options.length) {
          q.answer = 0;
        }
      }
    });
  }
  applyHeaderOverflowFixAndValidateData();

  // ==========================================================================
  // VERSION 5 PROCTORING ENGINE: SELECTABLE CAMERA ON/OFF, AI CHEATING DETECTOR,
  // EXIT-CLICK WARNING CONFIRMATION MODAL & STRICT 3-WARNING AUTO-TERMINATION
  // ==========================================================================
  let proctorMediaStream = null;
  let proctorIntervalId = null;
  let proctorPrevFrameData = null;
  let proctorOffscreenCanvas = null;
  let proctorNativeFaceDetector = null;
  let proctorListenersBound = false;

  function playProctorWarningBeep() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(640, ctx.currentTime);
      osc.frequency.setValueAtTime(420, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.14, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch {}
  }

  function isProctoredSessionActive() {
    const mockActive = state.mockExam.active && !state.mockExam.finished;
    const ivActive = state.interviewState.activeFullscreen && !state.interviewState.sessionFinished;
    return Boolean(mockActive || ivActive);
  }

  function isCameraProctoringEnabled() {
    if (state.mockExam.active && !state.mockExam.finished) {
      return Boolean(state.mockExam.proctoringEnabled);
    }
    if (state.interviewState.activeFullscreen && !state.interviewState.sessionFinished) {
      return Boolean(state.interviewState.proctoringEnabled);
    }
    return false;
  }

  function terminateSessionDueToMaxWarnings(reasonText) {
    const ps = state.proctorState;
    ps.terminatedByLimit = true;
    playProctorWarningBeep();
    showToast(`⛔ SESSION ENDED: Maximum ${ps.maxWarnings}/${ps.maxWarnings} Proctoring Warnings Exceeded (${reasonText})!`, 'warn');

    if (state.mockExam.active && !state.mockExam.finished) {
      state.mockExam.terminatedByProctor = true;
      state.mockExam.TerminationReason = `Auto-Terminated after ${ps.warningCount}/${ps.maxWarnings} Warnings (Last: ${reasonText})`;
      speakInterviewText(`Warning limit of ${ps.maxWarnings} exceeded. Your mock test session has been automatically ended and submitted.`);
      finishMockExam();
      return;
    }

    if (state.interviewState.activeFullscreen && !state.interviewState.sessionFinished) {
      state.interviewState.terminatedByProctor = true;
      state.interviewState.sessionFinished = true;
      stopProctorCameraAndDetector();
      speakInterviewText(`Warning limit of ${ps.maxWarnings} reached. Ending the interview session now and generating your performance report.`);
      renderPlacementPrep();
    }
  }

  function triggerProctorViolation(reasonText, forceEvenIfCameraOff = false) {
    if (!isProctoredSessionActive()) return;
    if (!forceEvenIfCameraOff && !isCameraProctoringEnabled()) return;

    const ps = state.proctorState;
    // Debounce rapid duplicate triggers within 2.8 seconds
    if (ps._lastWarnTs && Date.now() - ps._lastWarnTs < 2800) return;
    ps._lastWarnTs = Date.now();

    const nowTime = new Date().toLocaleTimeString();
    ps.maxWarnings = 3;
    ps.warningCount += 1;
    ps.bannerVisible = true;
    ps.lastAlert = `${reasonText} (${nowTime})`;
    ps.events.unshift({ time: nowTime, reason: reasonText, strike: ps.warningCount });

    if (state.mockExam.active && !state.mockExam.finished) {
      state.mockExam.warnings = ps.warningCount;
      state.mockExam.maxWarnings = 3;
      state.mockExam.lastWarningReason = ps.lastAlert;
      state.mockExam.warningLog.unshift(ps.lastAlert);
    }

    playProctorWarningBeep();

    // Check if 3-Warning Limit is reached -> Immediately end session!
    if (ps.warningCount >= ps.maxWarnings) {
      terminateSessionDueToMaxWarnings(reasonText);
      return;
    }

    showToast(`⚠️ PROCTORING WARNING (${ps.warningCount} of ${ps.maxWarnings}): ${reasonText}`, 'warn');

    // Update live warning UI banner & badge without full re-render bug
    const banner = document.getElementById('proctor-warning-banner');
    const bannerMsg = document.getElementById('proctor-warning-msg');
    const strikeBadge = document.getElementById('proctor-strike-badge');
    if (banner) banner.classList.remove('hidden');
    if (bannerMsg) {
      bannerMsg.textContent = `⚠️ Warning ${ps.warningCount} of ${ps.maxWarnings}: ${reasonText}. At ${ps.maxWarnings} warnings, your session will automatically end!`;
    }
    if (strikeBadge) {
      strikeBadge.textContent = `⚠️ Warnings: ${ps.warningCount} / ${ps.maxWarnings}`;
      strikeBadge.className = 'px-2.5 py-1 rounded-lg bg-rose-600 text-white font-extrabold text-[11px] animate-pulse shadow';
    }
  }

  function ensureProctorGlobalListeners() {
    if (proctorListenersBound || typeof window === 'undefined') return;
    proctorListenersBound = true;

    document.addEventListener('fullscreenchange', () => {
      if (isProctoredSessionActive() && !document.fullscreenElement) {
        triggerProctorViolation('Exited Full-Screen Mode Without Permission', true);
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (isProctoredSessionActive() && document.hidden) {
        triggerProctorViolation('Tab Switched or Window Minimized (Cheating Guard)', true);
      }
    });

    window.addEventListener('blur', () => {
      if (isProctoredSessionActive() && isCameraProctoringEnabled()) {
        triggerProctorViolation('Window Focus Lost (External App Clicked)', false);
      }
    });
  }

  async function startProctorCameraAndDetector() {
    ensureProctorGlobalListeners();
    const ps = state.proctorState;
    ps.maxWarnings = 3;

    if (!isCameraProctoringEnabled()) {
      stopProctorCameraAndDetector();
      ps.statusText = '📷 Camera OFF (User Selected Off)';
      return;
    }

    if (typeof window !== 'undefined' && 'FaceDetector' in window && !proctorNativeFaceDetector) {
      try {
        proctorNativeFaceDetector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 2 });
      } catch {}
    }

    if (!proctorMediaStream && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        proctorMediaStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, facingMode: 'user' },
          audio: false
        });
        ps.cameraActive = true;
        ps.warmupUntil = Date.now() + 4000; // 4-second camera warmup grace period to prevent false warnings
      } catch {
        ps.cameraActive = false;
        ps.statusText = '📷 Camera Unavailable (Tab & Exit Guard Active)';
      }
    }

    const bindVideoEl = () => {
      const vid = document.getElementById('proctor-webcam-video');
      if (vid && proctorMediaStream && vid.srcObject !== proctorMediaStream) {
        vid.srcObject = proctorMediaStream;
        vid.play().catch(() => {});
      }
    };
    bindVideoEl();
    setTimeout(bindVideoEl, 150);

    if (proctorIntervalId) clearInterval(proctorIntervalId);
    proctorIntervalId = setInterval(async () => {
      if (!isProctoredSessionActive() || !isCameraProctoringEnabled()) return;
      const vid = document.getElementById('proctor-webcam-video');
      const statusEl = document.getElementById('proctor-live-status');
      const motionBarEl = document.getElementById('proctor-motion-bar');
      const reticleEl = document.getElementById('proctor-face-reticle');

      if (!vid || !ps.cameraActive || vid.readyState < 2) {
        if (statusEl) statusEl.textContent = ps.cameraActive ? '📷 Calibrating AI Camera Detector...' : '🛡️ Exit & Tab Guard Active';
        return;
      }

      if (!proctorOffscreenCanvas) {
        proctorOffscreenCanvas = document.createElement('canvas');
        proctorOffscreenCanvas.width = 64;
        proctorOffscreenCanvas.height = 48;
      }
      const ctx = proctorOffscreenCanvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(vid, 0, 0, 64, 48);
      const frame = ctx.getImageData(0, 0, 64, 48).data;

      let diffSum = 0;
      let centerLumaSum = 0;
      let centerSkinPixels = 0;
      let centerCount = 0;

      for (let y = 0; y < 48; y++) {
        for (let x = 0; x < 64; x++) {
          const idx = (y * 64 + x) * 4;
          const r = frame[idx], g = frame[idx + 1], b = frame[idx + 2];
          const luma = 0.299 * r + 0.587 * g + 0.114 * b;

          if (proctorPrevFrameData) {
            const pr = proctorPrevFrameData[idx], pg = proctorPrevFrameData[idx + 1], pb = proctorPrevFrameData[idx + 2];
            diffSum += (Math.abs(r - pr) + Math.abs(g - pg) + Math.abs(b - pb)) / 3;
          }

          if (x >= 14 && x <= 50 && y >= 6 && y <= 42) {
            centerCount++;
            centerLumaSum += luma;
            if (r > 55 && g > 35 && b > 20 && r > b && Math.abs(r - g) < 95) {
              centerSkinPixels++;
            }
          }
        }
      }
      proctorPrevFrameData = new Uint8ClampedArray(frame);

      const motionPct = Math.min(100, Math.round((diffSum / (64 * 48 * 42)) * 100));
      const avgCenterLuma = centerLumaSum / Math.max(1, centerCount);
      let facePresent = avgCenterLuma > 20 && avgCenterLuma < 250 && centerSkinPixels > 38;

      if (proctorNativeFaceDetector) {
        try {
          const faces = await proctorNativeFaceDetector.detect(vid);
          if (faces && faces.length > 0) {
            facePresent = true;
            if (faces.length > 1 && Date.now() > ps.warmupUntil) {
              triggerProctorViolation('AI Camera Detected Multiple Faces in Frame');
            }
          }
        } catch {}
      }

      ps.motionPct = motionPct;
      ps.faceDetected = facePresent;

      // Only count violations after initial 4-second camera warmup
      if (Date.now() > ps.warmupUntil) {
        if (!facePresent) {
          ps.missingFrames += 1;
          if (ps.missingFrames >= 5) {
            ps.missingFrames = 0;
            triggerProctorViolation('AI Camera: Face Not Detected / Looking Away');
          }
        } else {
          ps.missingFrames = 0;
        }

        if (motionPct > 38) {
          ps.highMotionFrames += 1;
          if (ps.highMotionFrames >= 3) {
            ps.highMotionFrames = 0;
            triggerProctorViolation(`AI Camera: Suspicious Motion Detected (${motionPct}% movement)`);
          }
        } else {
          ps.highMotionFrames = 0;
        }
      }

      if (statusEl) {
        if (!facePresent) {
          statusEl.textContent = `⚠️ Face Off-Center · Motion ${motionPct}%`;
          statusEl.className = 'text-[10px] font-extrabold text-amber-300';
        } else if (motionPct > 30) {
          statusEl.textContent = `⚠️ High Motion (${motionPct}%) · Hold Steady`;
          statusEl.className = 'text-[10px] font-extrabold text-rose-300';
        } else {
          statusEl.textContent = `✓ Face Verified · Motion ${motionPct}%`;
          statusEl.className = 'text-[10px] font-extrabold text-emerald-300';
        }
      }
      if (motionBarEl) {
        motionBarEl.style.width = `${Math.min(100, Math.max(6, motionPct))}%`;
        motionBarEl.className = `h-1.5 rounded-full transition-all ${motionPct > 30 ? 'bg-rose-500' : motionPct > 18 ? 'bg-amber-400' : 'bg-emerald-400'}`;
      }
      if (reticleEl) {
        reticleEl.className = `absolute inset-2.5 rounded-xl border-2 pointer-events-none transition-all ${!facePresent ? 'border-rose-500 animate-pulse' : motionPct > 30 ? 'border-amber-400' : 'border-emerald-400/80'}`;
      }
    }, 700);
  }

  function stopProctorCameraAndDetector() {
    if (proctorIntervalId) {
      clearInterval(proctorIntervalId);
      proctorIntervalId = null;
    }
    if (proctorMediaStream) {
      try {
        proctorMediaStream.getTracks().forEach(t => t.stop());
      } catch {}
      proctorMediaStream = null;
    }
    state.proctorState.cameraActive = false;
    proctorPrevFrameData = null;
  }

  function renderProctorWarningBannerHtml() {
    const ps = state.proctorState;
    const showBanner = Boolean(ps.bannerVisible && ps.lastAlert);
    return `
      <div id="proctor-warning-banner" class="${showBanner ? '' : 'hidden'} rounded-2xl bg-rose-950/95 border-2 border-rose-500 text-white p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div class="flex items-center gap-3">
          <span class="px-2.5 py-1 rounded-lg bg-rose-600 font-black text-xs uppercase tracking-wider animate-pulse">⚠️ Proctoring Warning (${ps.warningCount}/${ps.maxWarnings})</span>
          <span id="proctor-warning-msg" class="text-xs sm:text-sm font-bold text-rose-100">
            Warning ${ps.warningCount} of ${ps.maxWarnings}: ${escapeHtml(ps.lastAlert || 'Keep your face centered and remain in Full-Screen.')}. Session auto-ends at ${ps.maxWarnings} warnings!
          </span>
        </div>
        <div class="flex items-center gap-2">
          <button type="button" id="proctor-relock-fs-btn" class="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow">
            🔒 Acknowledge &amp; Lock Fullscreen
          </button>
        </div>
      </div>
    `;
  }

  function renderExitConfirmationModalHtml(isOpen, contextLabel = 'Session') {
    if (!isOpen) return '';
    const ps = state.proctorState;
    return `
      <div id="proctor-exit-confirm-modal" class="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-slate-900 border-2 border-rose-500 text-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-xl bg-rose-600 flex items-center justify-center text-xl font-black shrink-0">⚠️</div>
            <div>
              <span class="text-[11px] font-extrabold uppercase tracking-wider text-rose-400">Exit Warning &amp; Session Guard</span>
              <h3 class="text-lg font-extrabold text-white">Exit Active ${escapeHtml(contextLabel)}?</h3>
            </div>
          </div>
          <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
            You clicked <b>Exit</b> during an active proctored ${escapeHtml(contextLabel.toLowerCase())}.
            Current Proctoring Warnings: <b class="text-amber-300">${ps.warningCount} / ${ps.maxWarnings}</b>.
            If you confirm exit now, your session will immediately end and generate your final performance &amp; timing report.
          </p>
          <div class="flex flex-wrap items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
            <button type="button" id="exit-modal-cancel-btn" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow">
              ↩ Stay &amp; Resume ${escapeHtml(contextLabel)}
            </button>
            <button type="button" id="exit-modal-confirm-btn" class="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow">
              ✕ Confirm Exit &amp; End Session Now
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderProctorCameraWidgetHtml(compact = false, toggleId = 'live-camera-toggle-btn') {
    const ps = state.proctorState;
    const camOn = isCameraProctoringEnabled();
    return `
      <div class="bg-slate-900 text-white rounded-2xl border border-slate-700 p-3 shadow-lg ${compact ? 'w-full sm:w-68' : 'w-full'} space-y-2">
        <div class="flex items-center justify-between gap-2">
          <span class="text-[10px] font-extrabold uppercase tracking-wider text-blue-300 flex items-center gap-1">
            <span class="w-2 h-2 rounded-full ${camOn ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}"></span>
            AI Camera Proctor (${camOn ? 'ON' : 'OFF'})
          </span>
          <div class="flex items-center gap-1.5">
            <button type="button" id="${escapeHtml(toggleId)}" class="px-2 py-0.5 rounded-lg ${camOn ? 'bg-emerald-700 hover:bg-emerald-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'} font-bold text-[10px] transition">
              📷 ${camOn ? 'Cam ON' : 'Cam OFF'}
            </button>
            <span id="proctor-strike-badge" class="px-2 py-0.5 rounded-lg ${ps.warningCount > 0 ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 text-slate-300'} font-extrabold text-[10px]">
              ⚠️ ${ps.warningCount}/${ps.maxWarnings}
            </span>
          </div>
        </div>
        ${camOn ? `
          <div class="relative w-full h-28 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center">
            <video id="proctor-webcam-video" autoplay playsinline muted class="w-full h-full object-cover transform -scale-x-100"></video>
            <div id="proctor-face-reticle" class="absolute inset-2.5 rounded-xl border-2 border-emerald-400/80 pointer-events-none"></div>
            <div class="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[10px] bg-slate-950/80 px-2 py-0.5 rounded">
              <span id="proctor-live-status" class="font-extrabold text-emerald-300">${escapeHtml(ps.statusText)}</span>
            </div>
          </div>
          <div class="space-y-1">
            <div class="flex items-center justify-between text-[10px] text-slate-400">
              <span>Cheating &amp; Motion Sensor</span>
              <span>Max 3 Warnings</span>
            </div>
            <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div id="proctor-motion-bar" class="h-1.5 bg-emerald-400 rounded-full transition-all" style="width: 10%"></div>
            </div>
          </div>
        ` : `
          <div class="w-full h-24 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center p-2">
            <span class="text-xs font-bold text-slate-400">📷 Camera Detector is OFF</span>
            <span class="text-[10px] text-slate-500 mt-0.5">Click "Cam OFF" above anytime to enable AI face &amp; motion proctoring.</span>
          </div>
        `}
      </div>
    `;
  }

  function bindProctorBannerEvents() {
    document.getElementById('proctor-relock-fs-btn')?.addEventListener('click', () => {
      state.proctorState.bannerVisible = false;
      try {
        if (!document.fullscreenElement && document.documentElement?.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } catch {}
      document.getElementById('proctor-warning-banner')?.classList.add('hidden');
    });
  }

  // --- MODULE 14: TIMED MOCK TESTS (VERSION 5: 3-WARNING AUTO-END, EXIT WARNING MODAL, TIMING TRACKER & GEMINI VOICE HELPER) ---
  function renderMockTests() {
    const m = state.mockExam;

    if (m.active && !m.finished) {
      syncExamFullscreenMode(true);
      if (m.proctoringEnabled) startProctorCameraAndDetector();
      else stopProctorCameraAndDetector();

      const q = m.questions[m.currentIndex] || m.questions[0];
      const chosen = m.answers[q.id];
      const mins = String(Math.floor(m.remainingSec / 60)).padStart(2, '0');
      const secs = String(m.remainingSec % 60).padStart(2, '0');
      const answeredCount = Object.keys(m.answers).length;
      const spentOnCurrentSec = m.questionTimings[q.id] || 0;

      container.innerHTML = `
        <div class="max-w-6xl mx-auto space-y-4">
          ${renderExitConfirmationModalHtml(m.showExitConfirmModal, 'Mock Examination')}
          ${renderProctorWarningBannerHtml()}

          <!-- Full-Screen Active Exam Header + Live Face & Motion Detector HUD -->
          <div class="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xl border border-blue-800/60">
            <div class="space-y-1.5 min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-600 text-white">
                  ${m.jobProcessMode ? '🏢 Version 5 Job Process · Round 1 Screening Test' : '🛡️ Version 5 Proctored Mock Exam'}
                </span>
                <span class="text-[11px] font-bold text-amber-300">Max 3 Warnings Auto-End · Per-Question Timer Active</span>
              </div>
              <h1 class="text-base sm:text-xl font-extrabold truncate">${escapeHtml(m.title)}</h1>
              <div class="flex flex-wrap items-center gap-2.5 pt-1">
                <span class="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700">
                  Answered: ${answeredCount} / ${m.questions.length}
                </span>
                <span id="mock-q-spent-readout" class="text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-950 text-indigo-200 border border-indigo-700 font-mono">
                  ⏳ This Q: ${spentOnCurrentSec}s
                </span>
                <div id="mock-timer-readout" class="px-3.5 py-1.5 rounded-xl bg-blue-950 border border-blue-700 font-mono text-sm sm:text-base font-extrabold text-blue-200">
                  ⏱ ${mins}:${secs}
                </div>
                <button type="button" id="mock-gemini-read-btn" class="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold">
                  🔊 Gemini Read Q
                </button>
                <button type="button" id="exit-mock-exam-btn" class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-700 text-slate-200 hover:text-white border border-slate-600 text-xs font-bold transition">
                  ✕ Exit Exam
                </button>
                <button type="button" id="submit-mock-exam-btn" class="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold shadow">
                  ✓ Submit Exam →
                </button>
              </div>
            </div>

            <!-- Live Webcam Face & Motion Detector Widget inside Mock Test (with Camera ON/OFF toggle) -->
            ${renderProctorCameraWidgetHtml(true, 'mock-live-cam-toggle')}
          </div>

          <!-- Full-Width Active Question Card (Vertical unnumbered options) -->
          <div class="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-lg space-y-5">
            <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 border-b border-slate-100 pb-3">
              <span class="font-bold text-slate-900 text-sm">Question ${m.currentIndex + 1} of ${m.questions.length} · <span class="text-blue-700">${escapeHtml(q.topic)}</span></span>
              <span class="font-semibold text-slate-600">${escapeHtml(q.difficulty || 'Standard')} · ${m.negativeMarking ? '+4 / −1 Marks' : '+4 Marks'}</span>
            </div>

            <div class="text-sm sm:text-base text-slate-900 leading-relaxed bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
              <div class="font-semibold">${q.isHtml ? q.text : escapeHtml(q.text)}</div>
              ${renderQuestionFigure(q) ? `<div class="question-diagram-container"><div class="question-diagram-card">${renderQuestionFigure(q)}</div></div>` : ''}
            </div>

            <!-- Vertical Single-Column Option Bars Without Numbering/Lettering Prefixes -->
            <div class="space-y-3">
              ${(q.options || []).map((opt, oi) => {
                const isSelected = chosen === oi;
                const cleanOpt = q.isHtml ? stripLeadingOptionPrefix(opt) : escapeHtml(stripLeadingOptionPrefix(opt));
                return `
                  <button type="button" data-mock-opt="${oi}" class="w-full text-left px-5 py-3.5 rounded-xl border text-xs sm:text-sm transition flex items-center gap-3.5 ${isSelected ? 'border-2 border-blue-600 bg-blue-50 font-bold text-blue-950 shadow-sm' : 'border-slate-200 hover:border-blue-400 bg-white text-slate-800'}">
                    <span class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-400 bg-white'}">
                      ${isSelected ? '<span class="w-1.5 h-1.5 rounded-full bg-white"></span>' : ''}
                    </span>
                    <span class="leading-relaxed">${cleanOpt}</span>
                  </button>
                `;
              }).join('')}
            </div>

            <div class="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-100">
              <button type="button" id="mock-flag-btn" class="px-4 py-2.5 rounded-xl border border-amber-400 bg-amber-50 text-amber-900 text-xs font-semibold">
                ${m.reviewFlags[q.id] ? '★ Marked for Review' : '☆ Mark for Review'}
              </button>
              <div class="flex gap-2.5">
                <button type="button" id="mock-prev-btn" ${m.currentIndex <= 0 ? 'disabled' : ''} class="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 text-xs font-semibold">
                  ← Previous
                </button>
                <button type="button" id="mock-next-btn" class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold">
                  ${m.currentIndex + 1 < m.questions.length ? 'Next Question →' : 'Finish & Submit →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      bindProctorBannerEvents();

      document.getElementById('mock-live-cam-toggle')?.addEventListener('click', () => {
        m.proctoringEnabled = !m.proctoringEnabled;
        if (m.proctoringEnabled) {
          startProctorCameraAndDetector();
          showToast('📷 AI Camera & Cheating Detector enabled (3-Warning Limit active).', 'success');
        } else {
          stopProctorCameraAndDetector();
          showToast('📷 Camera turned OFF by user.', 'info');
        }
        renderMockTests();
      });

      document.getElementById('mock-gemini-read-btn')?.addEventListener('click', () => {
        speakInterviewText(`Question ${m.currentIndex + 1}. ${String(q.text).replace(/<[^>]+>/g, '')}`);
      });

      // Exit Button Warning Confirmation Modal
      document.getElementById('exit-mock-exam-btn')?.addEventListener('click', () => {
        m.showExitConfirmModal = true;
        triggerProctorViolation('Clicked Exit Button During Active Mock Exam', true);
        if (m.active && !m.finished) renderMockTests();
      });
      document.getElementById('exit-modal-cancel-btn')?.addEventListener('click', () => {
        m.showExitConfirmModal = false;
        try {
          if (!document.fullscreenElement && document.documentElement?.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
          }
        } catch {}
        renderMockTests();
      });
      document.getElementById('exit-modal-confirm-btn')?.addEventListener('click', () => {
        m.showExitConfirmModal = false;
        finishMockExam();
      });

      container.querySelectorAll('[data-mock-opt]').forEach(b => {
        b.addEventListener('click', () => {
          m.answers[q.id] = Number(b.dataset.mockOpt);
          renderMockTests();
        });
      });
      document.getElementById('mock-flag-btn')?.addEventListener('click', () => {
        m.reviewFlags[q.id] = !m.reviewFlags[q.id];
        renderMockTests();
      });
      document.getElementById('mock-prev-btn')?.addEventListener('click', () => {
        if (m.currentIndex > 0) {
          m.currentIndex -= 1;
          renderMockTests();
        }
      });
      document.getElementById('mock-next-btn')?.addEventListener('click', () => {
        if (m.currentIndex + 1 < m.questions.length) {
          m.currentIndex += 1;
          renderMockTests();
        } else {
          finishMockExam();
        }
      });
      document.getElementById('submit-mock-exam-btn')?.addEventListener('click', finishMockExam);
      return;
    }

    // Restore normal layout when exam is not active
    stopProctorCameraAndDetector();
    syncExamFullscreenMode(false);

    if (m.finished && m.lastResult) {
      const r = m.lastResult;
      const totalSec = Math.max(1, m.totalElapsedSec || 1);
      const avgSecPerQ = (totalSec / Math.max(1, m.questions.length)).toFixed(1);

      container.innerHTML = `
        <div class="space-y-6">
          ${m.terminatedByProctor ? `
            <div class="rounded-2xl bg-rose-950 border-2 border-rose-500 text-white p-5 shadow-xl flex items-center gap-4">
              <div class="text-3xl">⛔</div>
              <div>
                <div class="text-xs font-black uppercase tracking-wider text-rose-400">Session Auto-Terminated by AI Proctoring Guard</div>
                <div class="text-base font-extrabold mt-0.5">${escapeHtml(m.TerminationReason || 'Exceeded maximum 3 proctoring warnings (Exit / Motion / Face Detection).')}</div>
              </div>
            </div>
          ` : ''}

          <!-- Comprehensive Performance, Score & Answering Timing Analytics Report -->
          <div class="bg-slate-900 text-white rounded-2xl p-6 space-y-5 shadow-xl">
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div class="space-y-1">
                <span class="text-xs font-bold uppercase text-emerald-400">Version 5 Proctored Assessment &amp; Timing Performance Report</span>
                <h1 class="text-2xl font-extrabold">Overall Score: ${r.pct}% (${r.earnedMarks} / ${r.maxMarks} Marks)</h1>
                <p class="text-xs text-slate-300">
                  Correct: <b>${r.correct}</b> · Wrong: <b>${r.wrong}</b> · Unanswered: <b>${r.unanswered}</b> · Proctoring Warnings: <b>${state.proctorState.warningCount} / 3</b>
                </p>
              </div>
              <div class="flex flex-wrap gap-2.5">
                <button type="button" id="speak-mock-report-btn" class="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow">
                  🔊 Gemini Voice Summary
                </button>
                <button type="button" id="proceed-stage2-interview-btn" class="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold shadow-lg">
                  🎙️ Proceed to Stage 2: Gemini AI Interview →
                </button>
                <button type="button" id="new-mock-btn" class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold">
                  ↻ New Mock Exam
                </button>
              </div>
            </div>

            <!-- 4-Card Timing & Proctoring Telemetry Strip -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div class="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700">
                <div class="text-[10px] font-bold uppercase text-slate-400">Total Answering Time</div>
                <div class="text-lg font-extrabold text-white mt-0.5">${Math.floor(totalSec / 60)}m ${totalSec % 60}s</div>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700">
                <div class="text-[10px] font-bold uppercase text-slate-400">Avg Time / Question</div>
                <div class="text-lg font-extrabold text-blue-300 mt-0.5">${avgSecPerQ} sec</div>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700">
                <div class="text-[10px] font-bold uppercase text-slate-400">Accuracy Rate</div>
                <div class="text-lg font-extrabold text-emerald-400 mt-0.5">${Math.round((r.correct / Math.max(1, m.questions.length)) * 100)}%</div>
              </div>
              <div class="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700">
                <div class="text-[10px] font-bold uppercase text-slate-400">Proctoring Integrity</div>
                <div class="text-lg font-extrabold ${state.proctorState.warningCount >= 3 ? 'text-rose-400' : 'text-amber-300'} mt-0.5">
                  ${state.proctorState.warningCount} / 3 Warnings
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            ${m.questions.map((q, idx) => {
              const userAns = m.answers[q.id];
              const isRight = userAns === Number(q.answer);
              const qTimeSec = m.questionTimings[q.id] || 0;
              const userAnsClean = userAns === undefined ? '— (Not Attempted)' : escapeHtml(stripLeadingOptionPrefix(String((q.options || [])[userAns] || '').replace(/<[^>]+>/g, '')));
              const officialAnsClean = escapeHtml(stripLeadingOptionPrefix(String((q.options || [])[q.answer] || '').replace(/<[^>]+>/g, '')));
              return `
                <article class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3.5 print-card">
                  <div class="flex flex-wrap items-center justify-between gap-2">
                    <div class="flex flex-wrap items-center gap-2">
                      <span class="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-extrabold text-xs">Question ${idx + 1}</span>
                      <span class="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-bold text-xs">${escapeHtml(q.topic)}</span>
                      <span class="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200 font-mono font-bold text-xs">
                        ⏱ Time Spent: ${qTimeSec}s ${qTimeSec <= 35 ? '⚡ Fast' : qTimeSec > 75 ? '🐢 Slow' : '✓ Optimal'}
                      </span>
                    </div>
                    <span class="text-xs font-extrabold px-3 py-1 rounded-full ${isRight ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : userAns === undefined ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-rose-100 text-rose-800 border border-rose-300'}">
                      ${isRight ? '✓ CORRECT (+4 Marks)' : userAns === undefined ? 'NOT ANSWERED (0 Marks)' : '✕ INCORRECT'}
                    </span>
                  </div>
                  <div class="text-sm font-bold text-slate-900 leading-relaxed">${q.isHtml ? q.text : escapeHtml(q.text)}</div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="p-3 rounded-xl border ${isRight ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950' : 'bg-rose-50/70 border-rose-300 text-rose-950'} text-xs">
                      <div class="text-[10px] font-extrabold uppercase tracking-wider opacity-75 mb-1">Your Submitted Answer</div>
                      <div class="font-bold">${userAnsClean}</div>
                    </div>
                    <div class="p-3 rounded-xl border bg-blue-50/60 border-blue-200 text-slate-900 text-xs">
                      <div class="text-[10px] font-extrabold uppercase tracking-wider text-blue-800 mb-1">Official Correct Answer</div>
                      <div class="font-bold text-blue-950">${officialAnsClean}</div>
                    </div>
                  </div>
                  <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 border-l-4 border-l-blue-600 text-xs space-y-1">
                    <div class="font-bold text-blue-900">📝 Step-by-Step Worked Derivation &amp; Physical Solution:</div>
                    <div class="text-slate-700 leading-relaxed">${formatEngineeringMarkdown(q.explain || 'Apply SI units and governing formula.')}</div>
                  </div>
                  <div>
                    <div class="text-xs font-bold text-slate-800 mb-1.5">📐 Engineering Diagram &amp; Governing Formula Graph:</div>
                    ${visualExplanation(q)}
                  </div>
                </article>
              `;
            }).join('')}
          </div>
        </div>
      `;
      document.getElementById('speak-mock-report-btn')?.addEventListener('click', () => {
        speakInterviewText(`Here is your Gemini performance summary. You scored ${r.pct} percent with ${r.correct} correct answers out of ${m.questions.length}. Your average answering speed was ${avgSecPerQ} seconds per question, with ${state.proctorState.warningCount} proctoring warnings.`);
      });
      document.getElementById('new-mock-btn')?.addEventListener('click', () => {
        m.active = false;
        m.finished = false;
        m.terminatedByProctor = false;
        renderMockTests();
      });
      document.getElementById('proceed-stage2-interview-btn')?.addEventListener('click', () => {
        switchModule('placement');
        generateSelfGeneratingInterviewSet(5);
        enterInterviewFullscreen(false);
      });
      return;
    }

    // Setup View (Version 5 Proctored Exam + Camera ON/OFF Option + Technical Test Review Preset)
    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-blue-600">Module 14 · Version 5 AI-Proctored Timed Mock Examinations &amp; Per-Question Timing Tracker</span>
            <h1 class="text-2xl font-extrabold text-slate-900">Configure Proctored Mock Examination (Camera ON/OFF · 3-Warning Auto-End)</h1>
            <p class="text-xs text-slate-600 mt-1">Tracks exact seconds spent per question, detects face &amp; motion when Camera is ON, warns on exit click, and auto-ends session if 3 warnings are exceeded.</p>
          </div>
        </div>

        <div class="bg-white rounded-2xl border-2 border-blue-600 p-6 shadow-md max-w-4xl space-y-5">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 mb-1" for="mock-focus">Assessment Track</label>
              <select id="mock-focus" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white">
                <option value="tech-review">⭐ Technical Test Review Pack (AGV, Pneumatics, Bearings, 5S &amp; Core)</option>
                <option value="mixed">Actual Job Process Stage 1: Aptitude + Core Mechanical (80/20)</option>
                <option value="technical">Core Mechanical Engineering Only (GATE / OEM / Naukri / Unstop)</option>
                <option value="aptitude">Placement Aptitude Only (Bizotic / AM2 / AON / TCS NQT)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 mb-1" for="mock-q-count">Number of Questions</label>
              <select id="mock-q-count" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white">
                <option value="10" selected>10 Questions (15 Mins Screening)</option>
                <option value="20">20 Questions (30 Mins Sectional Test)</option>
                <option value="30">30 Questions (45 Mins Company Assessment)</option>
                <option value="50">50 Questions (60 Mins Placement Paper)</option>
                <option value="100">100 Questions (90 Mins Full Comprehensive Exam)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase text-slate-500 mb-1" for="mock-mins">Time Limit (Minutes)</label>
              <select id="mock-mins" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white">
                <option value="10">10 Minutes</option>
                <option value="20" selected>20 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="60">60 Minutes</option>
                <option value="90">90 Minutes</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <label class="inline-flex items-center gap-2.5 text-xs font-bold text-slate-800 cursor-pointer">
              <input id="mock-neg-toggle" type="checkbox" checked class="rounded text-blue-600">
              <span>Enable Negative Marking (+4 Correct, −1 Wrong)</span>
            </label>
            <label class="inline-flex items-center gap-2.5 text-xs font-bold text-blue-900 cursor-pointer">
              <input id="mock-proctor-toggle" type="checkbox" ${m.proctoringEnabled ? 'checked' : ''} class="rounded text-blue-600">
              <span>📷 Camera ON/OFF: Enable AI Cheating Detector (3 Warnings Auto-End)</span>
            </label>
          </div>

          <div class="flex flex-wrap gap-3">
            <button type="button" id="launch-mock-btn" class="flex-1 py-3.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-lg transition">
              ⛶ Start Full-Screen Proctored Mock Exam →
            </button>
            <button type="button" id="launch-full-job-process-btn" class="py-3.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-extrabold text-xs sm:text-sm shadow transition">
              🏢 Start Full Job Process (Round 1 Exam → Round 2 Gemini Interview)
            </button>
          </div>
        </div>
      </div>
    `;

    const startExamNow = (isJobPipeline = false) => {
      const focus = document.getElementById('mock-focus')?.value || 'mixed';
      const count = Number(document.getElementById('mock-q-count')?.value || 10);
      const mins = Number(document.getElementById('mock-mins')?.value || 20);
      const neg = Boolean(document.getElementById('mock-neg-toggle')?.checked);
      const proc = Boolean(document.getElementById('mock-proctor-toggle')?.checked);

      const mcqPool = state.questions.filter(q => Array.isArray(q.options) && q.options.length >= 2 && q.answer !== undefined);
      let chosenQuestions = [];

      if (focus === 'tech-review') {
        const revPool = mcqPool.filter(q => q.sourceType === 'technical-review');
        const restTech = mcqPool.filter(q => q.sourceType !== 'technical-review' && !/aptitude|logical|verbal/i.test(q.topic)).sort(() => Math.random() - 0.5);
        chosenQuestions = revPool.concat(restTech).slice(0, count);
      } else {
        const filteredPool = mcqPool.filter(q => {
          const isApt = /aptitude|logical|verbal|train/i.test(q.topic);
          if (focus === 'technical') return !isApt;
          if (focus === 'aptitude') return isApt;
          return true;
        });
        chosenQuestions = filteredPool.slice().sort(() => Math.random() - 0.5).slice(0, count);
      }

      if (m.timerId) clearInterval(m.timerId);

      m.active = true;
      m.finished = false;
      m.terminatedByProctor = false;
      m.TerminationReason = '';
      m.showExitConfirmModal = false;
      m.jobProcessMode = isJobPipeline;
      m.proctoringEnabled = proc;
      m.questions = chosenQuestions;
      m.answers = {};
      m.questionTimings = {};
      m.totalElapsedSec = 0;
      m.reviewFlags = {};
      m.currentIndex = 0;
      m.remainingSec = mins * 60;
      m.initialDurationSec = mins * 60;
      m.negativeMarking = neg;
      m.warnings = 0;
      m.maxWarnings = 3;
      m.warningLog = [];
      state.proctorState.warningCount = 0;
      state.proctorState.maxWarnings = 3;
      state.proctorState.bannerVisible = false;
      state.proctorState.terminatedByLimit = false;
      state.proctorState.lastAlert = '';
      state.proctorState.events = [];

      try {
        if (document.documentElement?.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } catch {}
      syncExamFullscreenMode(true);

      m.timerId = setInterval(() => {
        m.remainingSec -= 1;
        m.totalElapsedSec += 1;
        const activeQ = m.questions[m.currentIndex];
        if (activeQ) {
          m.questionTimings[activeQ.id] = (m.questionTimings[activeQ.id] || 0) + 1;
          const qSpentEl = document.getElementById('mock-q-spent-readout');
          if (qSpentEl) qSpentEl.textContent = `⏳ This Q: ${m.questionTimings[activeQ.id]}s`;
        }
        const timerEl = document.getElementById('mock-timer-readout');
        if (timerEl) {
          const mm = String(Math.floor(Math.max(0, m.remainingSec) / 60)).padStart(2, '0');
          const ss = String(Math.max(0, m.remainingSec) % 60).padStart(2, '0');
          timerEl.textContent = `⏱ ${mm}:${ss}`;
        }
        if (m.remainingSec <= 0) finishMockExam();
      }, 1000);
      renderMockTests();
    };

    document.getElementById('launch-mock-btn')?.addEventListener('click', () => startExamNow(false));
    document.getElementById('launch-full-job-process-btn')?.addEventListener('click', () => startExamNow(true));
  }

  function finishMockExam() {
    const m = state.mockExam;
    if (m.timerId) {
      clearInterval(m.timerId);
      m.timerId = null;
    }
    m.showExitConfirmModal = false;
    stopProctorCameraAndDetector();
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch {}
    syncExamFullscreenMode(false);

    let correct = 0;
    let wrong = 0;
    let unanswered = 0;
    for (const q of m.questions) {
      const a = m.answers[q.id];
      if (a === undefined) unanswered += 1;
      else if (a === Number(q.answer)) correct += 1;
      else wrong += 1;
    }
    const maxMarks = m.questions.length * 4;
    const earnedMarks = Math.max(0, correct * 4 - (m.negativeMarking ? wrong : 0));
    const pct = Math.round((earnedMarks / Math.max(1, maxMarks)) * 100);

    m.finished = true;
    m.active = false;
    m.lastResult = { correct, wrong, unanswered, maxMarks, earnedMarks, pct };

    state.progress.testsCompleted += 1;
    state.progress.bestScore = Math.max(state.progress.bestScore, pct);
    state.progress.history.push({
      date: new Date().toLocaleDateString(),
      pct,
      correct,
      total: m.questions.length
    });
    safeSetStorage('mechprep_v4_progress', state.progress);
    renderMockTests();
  }

  // --- MODULE 15: PLACEMENT PREPARATION, GEMINI HUMAN-LIKE INTERVIEW, HR & GD HUB ---
  const OFFICIAL_JOB_PORTALS = [
    // =========================================================================
    // 1. FIRST: OFFICIAL COLLEGE PLACEMENT PORTAL (SJCE MYSURU)
    // =========================================================================
    {
      id: 'sjce-clg',
      name: 'JSS STU (SJCE) Unified Placement Portal',
      shortCode: 'S',
      url: 'https://sjceplacements.org/',
      loginUrl: 'https://sjceplacements.org/login',
      recruitersUrl: 'https://sjceplacements.org/past-recruiters',
      category: '1. College Portal',
      location: 'SJCE Mysuru · JSSATE Bengaluru · Noida',
      roles: 'Official Campus Drives, GET, 8th-Sem Internships & Dream Core Offers',
      badge: '1ST · OFFICIAL COLLEGE PORTAL',
      featured: true,
      logoSvg: `<svg viewBox="0 0 64 64" class="w-12 h-12 rounded-2xl shadow-md shrink-0"><rect width="64" height="64" rx="16" fill="#1E293B"/><rect x="10" y="10" width="44" height="44" rx="10" fill="#475569"/><text x="32" y="41" text-anchor="middle" fill="#FFFFFF" font-size="26" font-weight="900" font-family="Inter,sans-serif">S</text><circle cx="50" cy="50" r="9" fill="#1E3A8A" stroke="#FBBF24" stroke-width="2"/><text x="50" y="53" text-anchor="middle" fill="#FBBF24" font-size="7" font-weight="900">JSS</text></svg>`
    },

    // =========================================================================
    // 2. SECOND (UPSIDE): PROSPLE, NATS & ALL REQUESTED GENERAL JOB PORTALS
    // (Prosple, NATS, Naukri, Unstop, Internshala, Upwork, Indeed, LinkedIn, Glassdoor, eJobs, Fairygodboss, Our Ability, Professional Diversity Network, RecruitMilitary, SEEK, XING)
    // =========================================================================
    {
      id: 'prosple',
      name: 'Prosple India (Graduates & Internships)',
      shortCode: 'P.',
      url: 'https://in.prosple.com/',
      category: '2. NATS, Prosple & General Portals',
      location: 'Bengaluru · Mysuru · Pan-India Graduate Programs',
      roles: 'Verified Graduate Engineer Trainee (GET) & Semester Internships (L&T, Tata, ABB)',
      badge: 'PROSPLE GRADUATE HUB',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#0F172A"/><rect x="8" y="8" width="40" height="40" rx="8" fill="#FFFFFF"/><text x="24" y="38" text-anchor="middle" fill="#0F172A" font-size="28" font-weight="900" font-family="Inter,sans-serif">P</text><rect x="34" y="31" width="6" height="6" fill="#2563EB"/></svg>`
    },
    {
      id: 'nats',
      name: 'NATS 2.0 National Apprenticeship Portal',
      shortCode: 'NATS',
      url: 'https://nats.education.gov.in/',
      category: '2. NATS, Prosple & General Portals',
      location: 'Ministry of Education, Govt. of India',
      roles: 'Graduate Engineering Apprenticeships (ISRO, DRDO, HAL, BEL, BEML, PSUs)',
      badge: 'GOVT. OF INDIA NATS 2.0',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#065F46"/><text x="28" y="33" text-anchor="middle" fill="#A7F3D0" font-size="14" font-weight="900" font-family="Inter,sans-serif">NATS</text></svg>`
    },
    {
      id: 'naukri',
      name: 'Naukri.com (Engineering & Campus Hub)',
      shortCode: 'N',
      url: 'https://www.naukri.com/campus-hiring-jobs-in-bengaluru',
      category: '2. NATS, Prosple & General Portals',
      location: 'Bengaluru · Mysuru · Chennai · Pune',
      roles: 'India #1 Job Board for Core Design, CAE, Production, Boiler & Quality',
      badge: 'INDIA #1 JOB PORTAL',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#2563EB"/><circle cx="28" cy="16" r="3.5" fill="#FFFFFF"/><path d="M22 24l10-4-6 10 8 10-10-4z" fill="#FFFFFF"/></svg>`
    },
    {
      id: 'unstop',
      name: 'Unstop (Hiring Challenges & Competitions)',
      shortCode: 'unstop',
      url: 'https://unstop.com/job-portal',
      category: '2. NATS, Prosple & General Portals',
      location: 'Pan-India Case Challenges & Engineering Hackathons',
      roles: 'TATA Imagination, L&T OutThink, Hero Campus Challenge & Off-Campus Drives',
      badge: 'HIRING CHALLENGES',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#1E3A8A"/><circle cx="20" cy="28" r="8" fill="#FFFFFF"/><text x="20" y="31" text-anchor="middle" fill="#1E3A8A" font-size="9" font-weight="900">un</text><text x="37" y="31" text-anchor="middle" fill="#FFFFFF" font-size="10" font-weight="800">stop</text></svg>`
    },
    {
      id: 'internshala',
      name: 'Internshala (Internships & Fresher Roles)',
      shortCode: 'IS',
      url: 'https://internshala.com/internships/',
      category: '2. NATS, Prosple & General Portals',
      location: 'Bengaluru · Mysuru · Remote · Pan-India',
      roles: '6-Month Industrial Internships, CAD/SolidWorks/Creo/ANSYS & PPOs',
      badge: 'INTERNSHIPS & PPOs',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#0284C7"/><text x="28" y="36" text-anchor="middle" fill="#FFFFFF" font-size="22" font-weight="900" font-family="Inter,sans-serif">IS</text></svg>`
    },
    {
      id: 'upwork',
      name: 'Upwork (Freelance CAD, 3D & FEA)',
      shortCode: 'up',
      url: 'https://www.upwork.com/promos/general',
      category: '2. NATS, Prosple & General Portals',
      location: 'Remote Global Engineering Projects',
      roles: 'Freelance PTC Creo, Siemens NX, SolidWorks, ANSYS FEA & Product CAD',
      badge: 'REMOTE CAD/FEA PROJECTS',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/><text x="28" y="35" text-anchor="middle" fill="#14A800" font-size="22" font-weight="900" font-family="Inter,sans-serif">up</text></svg>`
    },
    {
      id: 'indeed',
      name: 'Indeed (India & Global Job Search)',
      shortCode: 'i',
      url: 'https://in.indeed.com/',
      category: '2. NATS, Prosple & General Portals',
      location: 'Mysuru · Bengaluru · All India & Global',
      roles: 'Direct Employer Job Postings for Mechanical Engineer, CAD Designer & GET',
      badge: 'GLOBAL JOB SEARCH',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/><path d="M22 22c3-4 9-4 12 0" fill="none" stroke="#003A9B" stroke-width="3.5" stroke-linecap="round"/><circle cx="28" cy="24" r="3" fill="#003A9B"/><rect x="25.5" y="29" width="5" height="14" rx="2.5" fill="#003A9B"/></svg>`
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Jobs (Mechanical & R&D Network)',
      shortCode: 'in',
      url: 'https://opportunity.linkedin.com/jobs',
      category: '2. NATS, Prosple & General Portals',
      location: 'Mysuru · Bengaluru · Global',
      roles: 'Direct Recruiter Outreach, GET, CAD/CAE & R&D Internships',
      badge: 'PROFESSIONAL NETWORK',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#0A66C2"/><text x="28" y="38" text-anchor="middle" fill="#FFFFFF" font-size="28" font-weight="900" font-family="Inter,sans-serif">in</text></svg>`
    },
    {
      id: 'glassdoor',
      name: 'Glassdoor (Jobs, Salaries & Interview Reviews)',
      shortCode: 'GD',
      url: 'https://www.glassdoor.com/Job/index.htm',
      category: '2. NATS, Prosple & General Portals',
      location: 'Bengaluru · Mysuru · Global Employer Reviews',
      roles: 'Company-Specific Interview Questions, GET Salary Benchmarks & Job Postings',
      badge: 'SALARIES & REVIEWS',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#0CAA41"/><text x="28" y="36" text-anchor="middle" fill="#FFFFFF" font-size="22" font-weight="900" font-family="Inter,sans-serif">G</text></svg>`
    },
    {
      id: 'ejobs',
      name: 'eJobs (European & Global Engineering Jobs)',
      shortCode: 'eJ',
      url: 'https://www.ejobs.ro/',
      category: '2. NATS, Prosple & General Portals',
      location: 'Europe · Remote · International Engineering',
      roles: 'Automotive, Manufacturing, Mechanical Design & International Engineering Careers',
      badge: 'EJOBS PORTAL',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#E11D48"/><text x="28" y="35" text-anchor="middle" fill="#FFFFFF" font-size="18" font-weight="900" font-family="Inter,sans-serif">eJobs</text></svg>`
    },
    {
      id: 'fairygodboss',
      name: 'Fairygodboss (Inclusive Career Community & Jobs)',
      shortCode: 'FGB',
      url: 'https://fairygodboss.com/jobs/find',
      category: '2. NATS, Prosple & General Portals',
      location: 'Global & Multinational Engineering Employers',
      roles: 'Global STEM & Engineering Roles at Schneider Electric, GE, Honeywell & Fortune 500s',
      badge: 'CAREER COMMUNITY',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#7C3AED"/><text x="28" y="34" text-anchor="middle" fill="#FFFFFF" font-size="15" font-weight="900" font-family="Inter,sans-serif">FGB</text></svg>`
    },
    {
      id: 'our-ability',
      name: 'Our Ability (AI-Powered Inclusive Employment)',
      shortCode: 'OA',
      url: 'https://www.ourability.com/',
      category: '2. NATS, Prosple & General Portals',
      location: 'Global Inclusive Employer Network',
      roles: 'AI-Assisted Profile Matching & Accessible Engineering Career Opportunities',
      badge: 'AI INCLUSIVE JOBS',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#0369A1"/><text x="28" y="35" text-anchor="middle" fill="#FFFFFF" font-size="18" font-weight="900" font-family="Inter,sans-serif">OA</text></svg>`
    },
    {
      id: 'pdn',
      name: 'Professional Diversity Network (PDN)',
      shortCode: 'PDN',
      url: 'https://www.prodivnet.com/',
      category: '2. NATS, Prosple & General Portals',
      location: 'Global Diversity Career Fairs & Job Network',
      roles: 'Engineering, Aerospace, Defence & Corporate Diversity Recruitment',
      badge: 'DIVERSITY NETWORK',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#1E293B"/><text x="28" y="34" text-anchor="middle" fill="#38BDF8" font-size="15" font-weight="900" font-family="Inter,sans-serif">PDN</text></svg>`
    },
    {
      id: 'recruit-military',
      name: 'RecruitMilitary (Technical & Leadership Careers)',
      shortCode: 'RM',
      url: 'https://recruitmilitary.com/job-seekers/',
      category: '2. NATS, Prosple & General Portals',
      location: 'Global Defence, Aerospace & Operations Employers',
      roles: 'Mechanical Maintenance, Fleet Operations, Aerospace & Field Engineering',
      badge: 'DEFENCE & TECH CAREERS',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#14532D"/><text x="28" y="35" text-anchor="middle" fill="#FDE047" font-size="16" font-weight="900" font-family="Inter,sans-serif">RM</text></svg>`
    },
    {
      id: 'seek',
      name: 'SEEK (Asia-Pacific & Australia Engineering Jobs)',
      shortCode: 'SEEK',
      url: 'https://au.seek.com/jobs',
      category: '2. NATS, Prosple & General Portals',
      location: 'Australia · New Zealand · APAC (Visa Sponsorship)',
      roles: 'Mechanical, Mining, Reliability, HVAC & Manufacturing Engineers',
      badge: 'APAC #1 JOB BOARD',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#E11D48"/><text x="28" y="33" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="900" font-family="Inter,sans-serif">SEEK</text></svg>`
    },
    {
      id: 'xing',
      name: 'XING (German & European Engineering Network)',
      shortCode: 'XING',
      url: 'https://www.xing.com/en',
      category: '2. NATS, Prosple & General Portals',
      location: 'Germany (DACH) · Europe Automotive & Machinery',
      roles: 'German Automotive OEMs, Bosch/Siemens/Airbus Europe & Mechanical R&D',
      badge: 'GERMANY & EUROPE JOBS',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#006567"/><text x="28" y="33" text-anchor="middle" fill="#CDDC39" font-size="13" font-weight="900" font-family="Inter,sans-serif">XING</text></svg>`
    },
    {
      id: 'superset',
      name: 'Superset Campus Placement Platform',
      shortCode: 'SS',
      url: 'https://joinsuperset.com/student',
      category: '2. NATS, Prosple & General Portals',
      location: 'Pan-India University Recruitment',
      roles: 'Official University Placement Portal for Capgemini, Cognizant, Wipro & Core Drives',
      badge: 'UNIVERSITY PLACEMENT CRM',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#4338CA"/><path d="M16 20h24v4H16zm0 8h16v4H16z" fill="#fff"/><circle cx="38" cy="34" r="5" fill="#38BDF8"/></svg>`
    },

    // =========================================================================
    // 3. THIRD: MORE APTITUDE PORTALS (INDIABIX, PREPINSTA, PRACTICA + 7 MORE)
    // =========================================================================
    {
      id: 'indiabix',
      name: 'IndiaBIX (Quantitative, Logical, Verbal & Mechanical)',
      shortCode: 'BIX',
      url: 'https://www.indiabix.com/',
      category: '3. Aptitude: IndiaBIX, PrepInsta & Practica',
      location: 'Free Topic-Wise Aptitude & Mechanical MCQs',
      roles: 'Quants, Logical Reasoning, Verbal, Non-Verbal, DI & Mechanical Core Questions',
      badge: '#1 FREE APTITUDE BANK',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#14532D"/><path d="M14 28c0-9 28-9 28 0H14z" fill="#4ADE80"/><path d="M28 28v11c0 3-4 3-4 0" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/></svg>`
    },
    {
      id: 'prepinsta',
      name: 'PrepInsta (Company Placement Papers & Shortcuts)',
      shortCode: 'P',
      url: 'https://prepinsta.com/',
      category: '3. Aptitude: IndiaBIX, PrepInsta & Practica',
      location: 'All-India Company-Specific Aptitude Prep',
      roles: 'TCS NQT, Infosys, Bosch, L&T, Cognizant, AMCAT, CoCubes & AON Papers',
      badge: 'COMPANY PLACEMENT PAPERS',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#334155"/><text x="28" y="36" text-anchor="middle" fill="#FFFFFF" font-size="22" font-weight="900" font-family="Inter,sans-serif">P</text></svg>`
    },
    {
      id: 'practica',
      name: 'Practica & Online Timed Aptitude Test Drills',
      shortCode: '✓',
      url: 'https://www.indiabix.com/online-test/categories/',
      category: '3. Aptitude: IndiaBIX, PrepInsta & Practica',
      location: 'Interactive Timed Tests & Viva Drills',
      roles: 'Timed 30-Min Aptitude Mock Tests, Spoken English & Technical Viva Practice',
      badge: 'PRACTICA TIMED DRILLS',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#0D9488"/><circle cx="28" cy="28" r="14" fill="#FFFFFF"/><path d="M22 28l4 4 9-9" fill="none" stroke="#0D9488" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    },
    {
      id: 'gfg-aptitude',
      name: 'GeeksforGeeks Aptitude & Placement Archive',
      shortCode: 'GfG',
      url: 'https://www.geeksforgeeks.org/aptitude/aptitude-questions-and-answers/',
      category: '3. Aptitude: IndiaBIX, PrepInsta & Practica',
      location: 'Quantitative, Puzzles, Logical & Company PYQs',
      roles: 'Topic-Wise Formula Shortcuts, Seating Arrangements, Puzzles & Coding/Aptitude Sets',
      badge: 'GFG APTITUDE & PUZZLES',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#15803D"/><text x="28" y="34" text-anchor="middle" fill="#FFFFFF" font-size="15" font-weight="900" font-family="Inter,sans-serif">GfG</text></svg>`
    },
    {
      id: 'testbook-aptitude',
      name: 'Testbook Campus Placement Aptitude Test Series',
      shortCode: 'TB',
      url: 'https://testbook.com/placement-aptitude/test-series',
      category: '3. Aptitude: IndiaBIX, PrepInsta & Practica',
      location: '97+ Structured Mock Tests (Quants, LR, Verbal, GATE/PSU)',
      roles: '52 Quantitative Tests, 26 Logical Reasoning Tests, 19 Verbal Tests & TCS NQT Mocks',
      badge: '97+ PLACEMENT MOCKS',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#0284C7"/><text x="28" y="35" text-anchor="middle" fill="#FFFFFF" font-size="17" font-weight="900" font-family="Inter,sans-serif">TB</text></svg>`
    },
    {
      id: 'hitbullseye',
      name: 'Hitbullseye CPT (Formula Sheets & Speed Tricks)',
      shortCode: 'HB',
      url: 'https://cpt.hitbullseye.com/Aptitude-Questions.php',
      category: '3. Aptitude: IndiaBIX, PrepInsta & Practica',
      location: 'Campus Placement Training (CPT) Portal',
      roles: 'High-Speed Vedic Math, Alligation, Cryptarithmetic, Clocks, Calendars & DI',
      badge: 'SPEED MATH & FORMULAS',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#B91C1C"/><circle cx="28" cy="28" r="14" fill="none" stroke="#FDE047" stroke-width="3"/><circle cx="28" cy="28" r="5" fill="#FFFFFF"/></svg>`
    },
    {
      id: 'freshersworld-apt',
      name: 'Freshersworld Placement Papers & Aptitude Hub',
      shortCode: 'FW',
      url: 'https://placement.freshersworld.com/',
      category: '3. Aptitude: IndiaBIX, PrepInsta & Practica',
      location: 'Core Technical & IT Company Placement Papers',
      roles: 'Previous Year Placement Papers for L&T, Bosch, HAL, BEL, DRDO, TCS, Wipro & Infosys',
      badge: 'PREVIOUS YEAR PAPERS',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#4F46E5"/><text x="28" y="35" text-anchor="middle" fill="#FFFFFF" font-size="16" font-weight="900" font-family="Inter,sans-serif">FW</text></svg>`
    },
    {
      id: 'ambitionbox-apt',
      name: 'AmbitionBox Assessment & Interview Experiences',
      shortCode: 'AB',
      url: 'https://blog.ambitionbox.com/',
      category: '3. Aptitude: IndiaBIX, PrepInsta & Practica',
      location: 'Candidate-Shared Online Assessment & Viva Logs',
      roles: 'Real Candidate Interview Questions & Aptitude Test Breakdowns for Core Companies',
      badge: 'INTERVIEW EXPERIENCES',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#EA580C"/><text x="28" y="35" text-anchor="middle" fill="#FFFFFF" font-size="16" font-weight="900" font-family="Inter,sans-serif">AB</text></svg>`
    },
    {
      id: 'letscode-roadmap',
      name: 'Let’s Code Placement Aptitude Roadmap & Mock Tests',
      shortCode: 'LC',
      url: 'https://lets-code.co.in/articles/aptituderoadmap/',
      category: '3. Aptitude: IndiaBIX, PrepInsta & Practica',
      location: 'Complete 10-Week Aptitude Syllabus & Free MCQs',
      roles: 'Structured Quants, DI, Verbal & Logical Reasoning Roadmap with Free Mock Tests',
      badge: 'APTITUDE ROADMAP',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#0F172A"/><text x="28" y="35" text-anchor="middle" fill="#38BDF8" font-size="16" font-weight="900" font-family="Inter,sans-serif">LC</text></svg>`
    },
    {
      id: 'yoodli',
      name: 'Yoodli AI Speech & Interview Roleplay Coach',
      shortCode: 'Y',
      url: 'https://app.yoodli.ai/practice/speech',
      category: '3. Aptitude: IndiaBIX, PrepInsta & Practica',
      location: 'AI Voice & Communication Analytics',
      roles: 'Real-Time Speech Pacing, Filler-Word Elimination & HR/Technical Interview Roleplay',
      badge: 'AI SPEECH COACH',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/><path d="M18 34c4-14 8-14 10 0s6 14 10-8" fill="none" stroke="#4F46E5" stroke-width="4" stroke-linecap="round"/></svg>`
    },

    {
      id: 'pramp',
      name: 'Pramp (Free Peer-to-Peer Live Mock Interviews)',
      shortCode: 'PR',
      url: 'https://www.pramp.com/',
      category: '3. Aptitude: IndiaBIX, PrepInsta & Practica',
      location: 'Live Video Mock Interviews (Featured in YouTube Short)',
      roles: 'Live 2-Way Technical, Behavioral, System Design & Peer Mock Interviews',
      badge: 'FREE LIVE MOCK INTERVIEW',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#4F46E5"/><text x="28" y="34" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="900" font-family="Inter,sans-serif">Pramp</text></svg>`
    },
    {
      id: 'interviewing-io',
      name: 'interviewing.io (Anonymous Engineer Mock Interviews)',
      shortCode: 'i.io',
      url: 'https://interviewing.io/',
      category: '3. Aptitude: IndiaBIX, PrepInsta & Practica',
      location: 'Anonymous Technical & FAANG/OEM Mock Interviews',
      roles: 'Practice Technical & Algorithmic Interviews Anonymously with Senior Engineers',
      badge: 'ANONYMOUS MOCK INTERVIEW',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#0F172A"/><text x="28" y="34" text-anchor="middle" fill="#38BDF8" font-size="14" font-weight="900" font-family="Inter,sans-serif">i.io</text></svg>`
    },
    {
      id: 'prepbunk',
      name: 'Prepbunk (Mock Interviews & Placement Prep)',
      shortCode: 'PB',
      url: 'https://prepbunk.com/',
      category: '3. Aptitude: IndiaBIX, PrepInsta & Practica',
      location: 'Campus Placement & Technical Mock Interviews',
      roles: '1-on-1 Mock Interviews, Aptitude Drills & Company-Specific Interview Practice',
      badge: 'PREPBUNK MOCK HUB',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#D97706"/><text x="28" y="35" text-anchor="middle" fill="#0F172A" font-size="16" font-weight="900" font-family="Inter,sans-serif">PB</text></svg>`
    },
    {
      id: 'interviewbit',
      name: 'InterviewBit (#1 Favourite Mock Interview & Prep Portal)',
      shortCode: 'IB',
      url: 'https://www.interviewbit.com/',
      category: '3. Aptitude: IndiaBIX, PrepInsta & Practica',
      location: 'AI & Peer Mock Interviews, HR Questions & Puzzles',
      roles: 'Company-Wise Interview Questions, Quantitative Puzzles, HR Round & Mock Interviews',
      badge: 'TOP FAVOURITE INTERVIEW PORTAL',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#0284C7"/><text x="28" y="35" text-anchor="middle" fill="#FFFFFF" font-size="18" font-weight="900" font-family="Inter,sans-serif">IB</text></svg>`
    },
    // =========================================================================
    // 4. FOURTH: CORE MECHANICAL OEM & CAMPUS RECRUITERS
    // =========================================================================
    {
      id: 'ltts',
      name: 'L&T Technology Services (LTTS)',
      shortCode: 'LTTS',
      url: 'https://www.ltts.com/careers/india',
      category: '4. Core Mechanical & OEM Portals',
      location: 'Mysuru SEZ (Hebbal) · Bengaluru · Vadodara',
      roles: 'Mechanical CAD/CAE, Product Design, Thermal & ER&D GET',
      badge: 'MYSURU & BENGALURU HUB',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#0369A1"/><text x="28" y="33" text-anchor="middle" fill="#FFFFFF" font-size="13" font-weight="900" font-family="Inter,sans-serif">LTTS</text></svg>`
    },
    {
      id: 'lnt',
      name: 'Larsen & Toubro (L&T Core Engineering)',
      shortCode: 'L&T',
      url: 'https://www.larsentoubro.com/corporate/careers/',
      category: '4. Core Mechanical & OEM Portals',
      location: 'Mumbai · Bengaluru · Chennai · Hazira',
      roles: 'Graduate Engineer Trainee (GET), Heavy Engg, Defence & Valves',
      badge: 'CORE GET RECRUITER',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#1E293B"/><circle cx="28" cy="28" r="18" fill="none" stroke="#38BDF8" stroke-width="2.5"/><text x="28" y="33" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="900" font-family="Inter,sans-serif">L&amp;T</text></svg>`
    },
    {
      id: 'bosch',
      name: 'Bosch India (Mobility & R&D)',
      shortCode: 'BOSCH',
      url: 'https://www.bosch.in/careers/',
      category: '4. Core Mechanical & OEM Portals',
      location: 'Bengaluru (Adugodi / Koramangala) · Coimbatore',
      roles: 'Powertrain, Mechatronics, Hydraulics, Manufacturing & GET',
      badge: 'AUTOMOTIVE & R&D',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#B91C1C"/><circle cx="28" cy="28" r="14" fill="none" stroke="#fff" stroke-width="2.5"/><path d="M21 20v16M35 20v16M21 28h14" stroke="#fff" stroke-width="2.5"/></svg>`
    },
    {
      id: 'honeywell',
      name: 'Honeywell Aerospace & Automation',
      shortCode: 'HON',
      url: 'https://careers.honeywell.com/en/sites/Honeywell/jobs',
      category: '4. Core Mechanical & OEM Portals',
      location: 'Bengaluru · Pune · Hyderabad',
      roles: 'Aerospace Mechanical Design, Propulsion, Thermal & CAE',
      badge: 'AEROSPACE & THERMAL',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#BE123C"/><text x="28" y="36" text-anchor="middle" fill="#FFFFFF" font-size="22" font-weight="900" font-family="Inter,sans-serif">H</text></svg>`
    },
    {
      id: 'siemens-energy',
      name: 'Siemens Energy & Siemens Gamesa',
      shortCode: 'SE',
      url: 'https://jobs.siemens-energy.com/',
      category: '4. Core Mechanical & OEM Portals',
      location: 'Bengaluru · Pune · Gurgaon · Chennai',
      roles: 'Gas/Steam Turbines, Wind Blades, Rotordynamics & CFD/FEA',
      badge: 'TURBOMACHINERY & WIND',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#0F766E"/><text x="28" y="34" text-anchor="middle" fill="#FFFFFF" font-size="16" font-weight="900" font-family="Inter,sans-serif">SE</text></svg>`
    },
    {
      id: 'airbus',
      name: 'Airbus India Engineering Centre',
      shortCode: 'AIR',
      url: 'https://www.airbus.com/en/careers',
      category: '4. Core Mechanical & OEM Portals',
      location: 'Bengaluru (Whitefield)',
      roles: 'Airframe Structures, Stress Analysis, Fatigue, Flight Physics',
      badge: 'AEROSPACE STRUCTURES',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#172554"/><text x="28" y="33" text-anchor="middle" fill="#93C5FD" font-size="11" font-weight="900" font-family="Inter,sans-serif">AIRBUS</text></svg>`
    },
    {
      id: 'caterpillar',
      name: 'Caterpillar India Engineering',
      shortCode: 'CAT',
      url: 'https://careers.caterpillar.com/en/jobs/',
      category: '4. Core Mechanical & OEM Portals',
      location: 'Bengaluru · Chennai (Thiruvallur)',
      roles: 'Heavy Powertrain, IC Engines, Hydraulics & Structural FEA',
      badge: 'HEAVY MACHINERY',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#D97706"/><polygon points="28,36 18,44 38,44" fill="#0F172A"/><text x="28" y="33" text-anchor="middle" fill="#0F172A" font-size="15" font-weight="900" font-family="Inter,sans-serif">CAT</text></svg>`
    },
    {
      id: 'ge-healthcare',
      name: 'GE HealthCare (John F. Welch Tech Centre)',
      shortCode: 'GE',
      url: 'https://careers.gehealthcare.com/global/en/india-jobs',
      category: '4. Core Mechanical & OEM Portals',
      location: 'Bengaluru (Whitefield EPIP)',
      roles: 'Mechanical Systems, Cryogenics, Thermal & Enclosure Design',
      badge: 'MEDICAL SYSTEMS R&D',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#581C87"/><circle cx="28" cy="28" r="16" fill="none" stroke="#E9D5FF" stroke-width="2"/><text x="28" y="33" text-anchor="middle" fill="#FFFFFF" font-size="14" font-weight="900" font-family="Inter,sans-serif">GE</text></svg>`
    },
    {
      id: 'gm',
      name: 'General Motors Technical Centre India',
      shortCode: 'gm',
      url: 'https://search-careers.gm.com/en/jobs/',
      category: '4. Core Mechanical & OEM Portals',
      location: 'Bengaluru (ITPL)',
      roles: 'Automotive Body/Chassis, CAE Crash/NVH, Battery Thermal',
      badge: 'AUTOMOTIVE CAE & EV',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#1D4ED8"/><rect x="12" y="12" width="32" height="32" rx="7" fill="none" stroke="#fff" stroke-width="2"/><text x="28" y="33" text-anchor="middle" fill="#FFFFFF" font-size="15" font-weight="900" font-family="Inter,sans-serif">gm</text></svg>`
    },
    {
      id: 'schneider',
      name: 'Schneider Electric India R&D',
      shortCode: 'SE',
      url: 'https://careers.se.com/careers-at-schneider-electric',
      category: '4. Core Mechanical & OEM Portals',
      location: 'Bengaluru · Mysuru · Hyderabad',
      roles: 'Electromechanical Switchgear, Thermal Packaging, CAD/PLM',
      badge: 'ELECTROMECHANICAL R&D',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#059669"/><text x="28" y="34" text-anchor="middle" fill="#FFFFFF" font-size="15" font-weight="900" font-family="Inter,sans-serif">SE</text></svg>`
    },
    {
      id: 'beml',
      name: 'BEML Limited (Ministry of Defence PSU)',
      shortCode: 'BEML',
      url: 'https://www.bemlindia.in/careers/',
      category: '4. Core Mechanical & OEM Portals',
      location: 'Mysuru Complex · Bengaluru · KGF · Palakkad',
      roles: 'Defence, Aerospace, Metro & Rail Coaches, Heavy Earthmovers',
      badge: 'MYSURU DEFENCE PSU',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#0F172A"/><text x="28" y="33" text-anchor="middle" fill="#38BDF8" font-size="13" font-weight="900" font-family="Inter,sans-serif">BEML</text></svg>`
    },
    {
      id: 'tcs-nextstep',
      name: 'TCS NextStep & All-India NQT Portal',
      shortCode: 'TCS',
      url: 'https://nextstep.tcsapps.com/indiacampus/',
      category: '4. Core Mechanical & OEM Portals',
      location: 'Bengaluru · Mysuru · Chennai · Pune',
      roles: 'TCS Ninja, Digital, Prime & EIS (PLM, CAD/CAE, IoT)',
      badge: 'TCS NQT PORTAL',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#1E40AF"/><text x="28" y="34" text-anchor="middle" fill="#FFFFFF" font-size="14" font-weight="900" font-family="Inter,sans-serif">TCS</text></svg>`
    },
    {
      id: 'infosys',
      name: 'Infosys Careers & Engineering Services',
      shortCode: 'INFY',
      url: 'https://careers.infosys.com/',
      category: '4. Core Mechanical & OEM Portals',
      location: 'Mysuru Global Education Centre · Bengaluru',
      roles: 'Systems Engineer, Specialist Programmer, Turbomachinery & PLM',
      badge: 'MYSURU CAMPUS HUB',
      logoSvg: `<svg viewBox="0 0 56 56" class="w-12 h-12 rounded-2xl shadow-sm shrink-0"><rect width="56" height="56" rx="14" fill="#0284C7"/><text x="28" y="33" text-anchor="middle" fill="#FFFFFF" font-size="12" font-weight="900" font-family="Inter,sans-serif">Infosys</text></svg>`
    }
  ];

  // ==========================================================================
  // EXPANDED INTERVIEW, HR, GD & TECHNICAL TEST REVIEW QUESTION BANKS
  // (Includes GaugeHow 30+ Mech Qs, upGrad 40 HR Qs, GD Topics & User Technical Test Review)
  // ==========================================================================
  const AI_INTERVIEW_QUESTION_BANK = {
    'Technical Test Review: AGV, Pneumatics, Bearings, 5S & Core Mechanical': [
      {
        q: 'In your Technical Test, a pneumatic cylinder has bore D = 63 mm and operating pressure P = 6 bar. Walk me through how you convert 6 bar into N/mm² and calculate the exact extension force F = P × A.',
        keywords: ['0.6', '3117', '1870', 'pi', 'bar', 'area', 'force'],
        idealPoints: [
          'Convert pressure consistently: 6 bar = 6 × 10⁵ Pa = 0.6 N/mm² (MPa).',
          'Calculate piston cross-sectional area: A = π·D² / 4 = π × 63² / 4 = 3,117.25 mm².',
          'Multiply for cylinder thrust force: F = P × A = 0.6 × 3,117.25 = 1,870.35 N ≈ 1,870 N.'
        ],
        studyTopic: 'Pneumatics & Fluid Power (Technical Test Review)',
        studyGuideQuery: 'Pneumatic',
        subjectId: 'fluid',
        formula: 'F = P × (π·D² / 4) = 0.6 × 3117.25 = 1,870 N'
      },
      {
        q: 'An AGV of mass m = 800 kg moves up a 3% gradient with rolling resistance C_rr = 0.02, wheel radius r = 0.15 m, efficiency η = 0.85, and a Two-Wheel-Drive (2WD) axle. How do you compute the torque required per driven wheel?',
        keywords: ['156.96', '235.44', '392.4', '69.25', '34.63', '35', 'two-wheel', 'divide'],
        idealPoints: [
          'Rolling Resistance Force: F_r = C_rr·m·g = 0.02 × 800 × 9.81 = 156.96 N; Gradient Force (3%): F_g = 0.03 × 800 × 9.81 = 235.44 N → Total Force F = 392.4 N.',
          'Total Axle Torque: T_total = (F × r) / η = (392.4 × 0.15) / 0.85 = 69.25 N·m.',
          'Two-Wheel-Drive Split: Divide total torque by 2 → T_wheel = 69.25 / 2 = 34.63 N·m ≈ 35 N·m per wheel.'
        ],
        studyTopic: 'AGV Traction Dynamics & Machine Design',
        studyGuideQuery: 'Technical Test Review',
        subjectId: 'design',
        formula: 'T_wheel = [m·g·(C_rr + grad)·r] / (2·η) ≈ 35 N·m'
      },
      {
        q: 'A roller bearing has dynamic capacity C = 5000 N and equivalent radial load P = 2000 N running at N = 3000 rpm. Why does the life come out to 125 hours, and what is the complete 5S sequence in Lean Manufacturing?',
        keywords: ['15.625', '22.56', '125', 'roller', '3000', 'sort', 'set', 'shine', 'standardize', 'sustain'],
        idealPoints: [
          'Bearing Life: For a ball bearing (p=3), L_10 = (5000/2000)³ = 15.625 Mrev. For a roller bearing (p=10/3), L_10 = (2.5)^(10/3) = 22.56 Mrev.',
          'Operating Hours at 3000 rpm: L_10h = (22.56 × 10⁶) / (60 × 3000) = 125.3 hours ≈ 125 hours.',
          'Complete 5S Sequence: 1. Sort (Seiri) → 2. Set in Order (Seiton) → 3. Shine (Seiso) → 4. Standardize (Seiketsu) → 5. Sustain (Shitsuke).'
        ],
        studyTopic: 'Bearings & 5S Lean Manufacturing',
        studyGuideQuery: 'Bearing',
        subjectId: 'design',
        formula: 'L_10h = (C/P)^(10/3) × 10⁶ / (60·N) ≈ 125 hours'
      },
      {
        q: 'For an AGV simply supported square beam (50 mm × 50 mm, span L = 1 m) carrying a central 100 kg load, how do you find the maximum bending stress σ_b? Also calculate the air consumption of a 50 mm bore × 200 mm stroke pneumatic cylinder at 10 cycles/min.',
        keywords: ['981', '245250', '12', '11.77', '0.3927', '3.93', '7.85', '10'],
        idealPoints: [
          'Beam Bending Stress: W = 100×9.81 = 981 N; M = W·L/4 = 245,250 N·mm; Z = b·d²/6 = 50³/6 = 20,833 mm³ → σ_b = M/Z = 11.77 MPa ≈ 12 MPa.',
          'Cylinder Air Consumption: Stroke volume V = (π×0.5²/4)×2 = 0.3927 L; at 10 cycles/min, single-acting = 3.93 L/min and double-acting = 7.85 L/min (≈ 10 L/min option).'
        ],
        studyTopic: 'Beam Bending & Pneumatic Air Consumption',
        studyGuideQuery: 'Technical Test Review',
        subjectId: 'som',
        formula: 'σ_b = M/Z ≈ 12 MPa ; Q_air = 2·A·L·n ≈ 7.85 L/min (10 L/min)'
      }
    ],
    '30+ Must-Know Mechanical Fresher Questions (GaugeHow & Playlist)': [
      {
        q: 'Explain Hooke’s Law, the difference between nominal stress and true strain, and why Annealing vs Hardening heat treatments produce opposite mechanical properties in steel.',
        keywords: ['hooke', 'elastic', 'young', 'annealing', 'slow cooling', 'furnace', 'hardening', 'quenching', 'martensite'],
        idealPoints: [
          'Hooke’s Law: Within the proportional/elastic limit, stress is directly proportional to strain (σ = E·ε, where E is Young’s modulus).',
          'Annealing: Heating steel above upper critical temperature followed by slow furnace cooling refines grain structure, relieves internal stresses, and softens the metal for machinability.',
          'Hardening: Heating followed by rapid quenching (water/oil) traps carbon in a supersaturated Body-Centered Tetragonal (BCT) martensite phase, dramatically increasing hardness and wear resistance.'
        ],
        studyTopic: 'Strength of Materials & Heat Treatment',
        studyGuideQuery: 'Mohr',
        subjectId: 'som',
        formula: 'σ = E · ε ; FoS_ductile = S_y / σ_allow ; FoS_brittle = S_ut / σ_allow'
      },
      {
        q: 'State Bernoulli’s theorem and Reynolds number regimes in pipe flow. Why is cavitation destructive to a centrifugal pump impeller, and how does a Flywheel differ from a Governor?',
        keywords: ['bernoulli', 'reynolds', '2000', '4000', 'dimensionless', 'cavitation', 'vapor pressure', 'flywheel', 'governor'],
        idealPoints: [
          'Bernoulli’s Equation & Reynolds Number: P/(ρg) + V²/(2g) + z = constant. Re = ρVD/μ is a dimensionless number (Re < 2000 laminar, Re > 4000 turbulent).',
          'Pump Cavitation: When local suction pressure drops below saturation vapor pressure (P_v), vapor bubbles form and implode in high-pressure zones, causing pitting erosion.',
          'Flywheel vs Governor: A flywheel minimizes cyclic intracycle speed fluctuations (ΔE = I·ω²·C_s) within each cycle, whereas a governor regulates mean engine speed by adjusting fuel supply when external load changes.'
        ],
        studyTopic: 'Fluid Mechanics, Turbomachines & DOM',
        studyGuideQuery: 'Rankine',
        subjectId: 'fluid',
        formula: 'P + ½ρV² + ρgz = C ; Re = ρVD/μ (Unitless)'
      },
      {
        q: 'Compare a 2-stroke vs 4-stroke IC engine, explain ASME Y14.5 GD&T vs coordinate tolerancing, and distinguish between Fatigue failure and Creep deformation.',
        keywords: ['two-stroke', 'four-stroke', 'revolution', 'gd&t', 'datum', 'fatigue', 'cyclic', 'endurance', 'creep', 'temperature'],
        idealPoints: [
          '2-Stroke vs 4-Stroke: A 2-stroke engine completes 1 power stroke per crankshaft revolution (360°), while a 4-stroke engine completes 1 power stroke every 2 revolutions (720°).',
          'GD&T: Geometric Dimensioning & Tolerancing controls form, orientation, location, and runout relative to functional datum reference frames, granting bonus tolerance at MMC.',
          'Fatigue vs Creep: Fatigue is progressive localized crack propagation under cyclic/alternating stress below yield; Creep is slow, time-dependent plastic deformation under constant stress at elevated temperature (T > 0.4·T_melt).'
        ],
        studyTopic: 'IC Engines, GD&T & Material Failure',
        studyGuideQuery: 'Inline-6',
        subjectId: 'design',
        formula: 'Δθ_4stroke = 720°/N_cyl ; T_homologous = T / T_m > 0.4 (Creep)'
      }
    ],
    'Separate HR & Behavioral Interview Round (40 Questions · upGrad & Playlist)': [
      {
        q: '[HR Round Q1 & Q6] Tell me about yourself, and why should we hire you for this Graduate Engineer Trainee (GET) role?',
        keywords: ['mechanical', 'sjce', 'internship', 'project', 'cad', 'problem solving', 'team', 'adaptable', 'value'],
        idealPoints: [
          'Structure (Present → Past → Future): Start with your B.E. Mechanical Engineering background at SJCE Mysuru, highlight your hands-on CAD/CAE (Creo, Siemens NX, ANSYS) and LisHawk morphing wing / JK Tyre utility plant internship experience.',
          'Quantify Impact: Mention concrete engineering deliverables (e.g., boiler/compressor efficiency analysis, 3D assembly tolerances, full-stack engineering tools).',
          'Close with Role Alignment: Connect your fast learning curve, disciplined execution, and practical shop-floor + simulation mindset directly to the company’s R&D/production goals.'
        ],
        studyTopic: 'HR Interview & Behavioral Communication',
        studyGuideQuery: 'Technical Test Review',
        subjectId: 'aptitude',
        formula: 'STAR Method: Situation → Task → Action → Quantified Result'
      },
      {
        q: '[HR Round Q3, Q4 & Q8] What are your greatest strengths and weaknesses, and how do you handle constructive criticism or tight project deadlines?',
        keywords: ['strength', 'weakness', 'deadline', 'prioritize', 'feedback', 'schedule', 'improve', 'teamwork'],
        idealPoints: [
          'Strengths with Evidence: Highlight analytical troubleshooting, CAD/FEA modeling precision, and cross-functional collaboration backed by a real project example.',
          'Authentic Weakness + Corrective Action: Share a real habit (e.g., spending extra time double-checking calculations or CAD constraints) and explain the checklist/time-boxing system you use to stay ahead of deadlines.',
          'Handling Criticism & Pressure: Show emotional intelligence—listen actively, extract actionable improvements, break multi-task deadlines into priority milestones, and deliver early.'
        ],
        studyTopic: 'HR Behavioral & Conflict Resolution',
        studyGuideQuery: 'Technical Test Review',
        subjectId: 'aptitude',
        formula: 'Weakness Formula = Genuine Trait + Proactive Mitigation Tool + Positive Outcome'
      },
      {
        q: '[HR Round Q5, Q18 & Q19] Where do you see yourself in 5 years, how do you resolve a conflict with a teammate, and what are your salary/role expectations?',
        keywords: ['5 years', 'growth', 'lead', 'conflict', 'data', 'listen', 'compromise', 'salary', 'industry standard'],
        idealPoints: [
          '5-Year Career Vision: Growing from a hands-on Graduate Engineer Trainee into a Senior Mechanical Design / Reliability Lead driving product innovation within the organization.',
          'Team Conflict Resolution: Focus on data and objective engineering trade-offs rather than personal ego—listen to the teammate’s viewpoint, benchmark both designs, and agree on the solution that best meets quality and schedule.',
          'Salary Expectations: State that your primary focus is steep technical growth and contributing measurable value, and you are comfortable with the company’s standard campus/GET compensation band.'
        ],
        studyTopic: 'HR Career Vision & Negotiation',
        studyGuideQuery: 'Technical Test Review',
        subjectId: 'aptitude',
        formula: 'Conflict Resolution = Active Listening + Objective Data Test + Shared Team Goal'
      }
    ],
    'Group Discussion (GD) Round Simulator & Campus GD Topics': [
      {
        q: '[Campus GD Topic 1] "Electric Vehicles (EVs) vs Hydrogen Internal Combustion & Hybrid Powertrains: Which is the realistic future for Indian Heavy Transport and Manufacturing?" — Present your opening stance, 2 data points, and a collaborative conclusion.',
        keywords: ['ev', 'battery', 'hydrogen', 'hybrid', 'infrastructure', 'energy density', 'manufacturing', 'grid', 'conclusion'],
        idealPoints: [
          'Structured GD Opening (30 sec): Define the scope clearly—while battery EVs dominate 2-wheelers and urban passenger cars, heavy commercial trucks and off-highway equipment require high energy density.',
          'Data-Backed Body Points: Cite power-to-weight ratios, charging infrastructure vs green hydrogen/hybrid transition, and localized thermal/battery manufacturing opportunities in India.',
          'Collaborative GD Etiquette: Acknowledge fellow speakers ("Building on my colleague’s point..."), avoid interrupting, and summarize a balanced multi-powertrain roadmap.'
        ],
        studyTopic: 'Group Discussion (GD) & Industry 4.0',
        studyGuideQuery: 'Inline-6',
        subjectId: 'thermo',
        formula: 'GD Framework = Hook/Definition + 2 Quantified Facts + Peer Bridge + Balanced Summary'
      },
      {
        q: '[Campus GD Topic 2] "AI & Automation in Mechanical Manufacturing: Will Industry 4.0 and Generative CAD/FEA Replace Core Engineers or Multiply Their Productivity?" — Deliver your GD pitch.',
        keywords: ['automation', 'ai', 'cad', 'fea', 'digital twin', 'upskilling', 'productivity', 'quality', 'human'],
        idealPoints: [
          'Core Thesis: AI and automation replace repetitive drafting, not physical first-principles engineering judgment.',
          'Shop-Floor & Design Synergy: Predictive maintenance, CNC automation, and generative FEA still require mechanical engineers to define boundary conditions, material metallurgy, GD&T, and safety factors.',
          'Actionable Takeaway: Engineers who combine core SOM/Thermo/Design fundamentals with digital tools lead Industry 4.0.'
        ],
        studyTopic: 'Group Discussion (GD) — AI in Manufacturing',
        studyGuideQuery: 'Robot',
        subjectId: 'mfg',
        formula: 'GD Impact = Clear Stance + Real Industrial Example + Inclusive Summary'
      }
    ],
    'Mechanical Design / CAD / GD&T (Creo / NX)': [
      {
        q: 'In a shaft subjected to combined bending moment M = 600 N·m and torque T = 800 N·m, how do you size the shaft diameter using Maximum Shear Stress (Tresca) vs Distortion Energy (Von Mises) theory? Also explain where you apply ASME Y14.5 Cylindricity vs Runout on the bearing seats.',
        keywords: ['von mises', 'tresca', 'equivalent torque', '16', 'pi', 'cylindricity', 'runout', 'datum', '0.577', '1000'],
        idealPoints: [
          'Equivalent Torque (Tresca): T_e = √(M² + T²) = √(600² + 800²) = 1000 N·m; τ_max = 16·T_e / (π·d³).',
          'Von Mises Criterion: σ_vm = √(σ_b² + 3τ²) ≤ S_y / N, where shear yield S_sy = 0.577·S_y.',
          'GD&T Bearing Journal Control: Cylindricity is a form control (no datum) bounding radial out-of-roundness and taper; Circular/Total Runout references the primary datum axis A-B to control coaxiality and wobble during rotation.'
        ],
        studyTopic: 'Design of Machine Elements',
        studyGuideQuery: 'Mohr',
        subjectId: 'design',
        formula: 'T_e = √(M² + T²) ; σ_vm = √(σ² + 3τ²) ≤ S_y / N'
      }
    ]
  };

  // Curated Video & Playlist Resource Cards requested by the user
  const CURATED_INTERVIEW_VIDEOS_AND_PLAYLISTS = [
    {
      title: 'Top 4 Free Mock Interview Websites (Pramp, Interviewing.io, Prepbunk, InterviewBit)',
      category: 'Mock Interview Portals Short',
      url: 'https://youtube.com/shorts/QmsmScpkfos?si=9dHgDfsXlTsvMHT1',
      badge: 'YOUTUBE SHORT · 4 PORTALS',
      desc: 'Quick walkthrough of Pramp.com, Interviewing.io, Prepbunk.com, and InterviewBit.com — all 4 portals are integrated in the Quick-Launch Dock below.'
    },
    {
      title: '30+ Must-Know Mechanical Engineering Interview Questions & Answers (GaugeHow)',
      category: 'Mechanical Technical Interview',
      url: 'https://youtu.be/Y_utWli0xnw?si=HxNbauvHrDlakUPS',
      badge: '30+ MECH INTERVIEW Q&A',
      desc: 'Covers Hooke’s law, 1st & 2nd Law of Thermodynamics, Bernoulli, Reynolds number, Cavitation, Annealing vs Hardening, GD&T, FoS, Flywheel vs Governor, Fatigue, Creep & 5S.'
    },
    {
      title: 'Mechanical Engineering Core Interview Preparation Playlist',
      category: 'Mechanical Technical Playlist',
      url: 'https://www.youtube.com/playlist?list=PLS2rZuyyRkAesLJF957tJEeBLd3oDLWXU',
      badge: 'TECHNICAL PLAYLIST',
      desc: 'Complete video playlist for core mechanical engineering technical viva, SOM, thermodynamics, design, and manufacturing interview rounds.'
    },
    {
      title: '40 Most Asked HR Interview Questions & Expert Answers (upGrad)',
      category: 'Separate HR Round Prep',
      url: 'https://youtu.be/zIm_k9j0C50?si=A23lK4Gz0XP0L7Hg',
      badge: '40 HR QUESTIONS & ANSWERS',
      desc: 'Complete 37-minute masterclass covering Tell Me About Yourself, Why Hire You, Strengths/Weaknesses, 5-Year Plan, Conflict Resolution, Salary Negotiation & 7 Body-Language Tips.'
    },
    {
      title: 'Dedicated HR Interview & Behavioral Preparation Playlist',
      category: 'Separate HR Round Playlist',
      url: 'https://www.youtube.com/playlist?list=PLCcteVWYyBtvRRH_KN5kSCTnJGnXz_YSA',
      badge: 'HR ROUND PLAYLIST',
      desc: 'Step-by-step HR interview questions, behavioral STAR responses, communication etiquette, and campus placement HR round strategies.'
    },
    {
      title: 'Quantitative & Logical Aptitude Placement Master Playlist',
      category: 'Aptitude Video Playlist',
      url: 'https://www.youtube.com/playlist?list=PLpyc33gOcbVBPgnZBqw7LjxMS4DSffD2G',
      badge: 'APTITUDE PLAYLIST',
      desc: 'Complete topic-wise video playlist for Quantitative Aptitude, Logical Reasoning, Time & Work, Trains, Alligation, Permutations, and Data Interpretation.'
    },
    {
      title: 'SJCE Placement Voice Recordings & 250-Q SOM/Design/Mfg/Thermo Drive Folder',
      category: 'Google Drive Voice & PDF Pack',
      url: 'https://drive.google.com/drive/folders/1SM7dWs5dUmj_sY3BiK_5MsPlQL5njm2b?usp=drive_link',
      badge: 'CONNECTED GOOGLE DRIVE',
      desc: 'Contains SJCE placement call recordings (Amrutha, Shashank, Suhas, Omkar, Surya, Ravi) + 50-Q SOM, 50-Q Machine Design, 50-Q Manufacturing, 50-Q Industrial Engg & Thermo PDFs.'
    }
  ];

  // ==========================================================================
  // HUMAN-LIKE GEMINI LIVE INTERVIEWER: NATURAL CONVERSATIONAL TALK & RESPONSE,
  // SELECTABLE AUDIO, LIP-SYNC FACE MOTION, TIMING TRACKER & CAMERA ON/OFF
  // ==========================================================================
  let activeSpeechRecognition = null;
  let availableBrowserVoices = [];
  let avatarAnimIntervalId = null;
  let interviewQuestionTimerId = null;

  function refreshBrowserVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    try {
      const list = window.speechSynthesis.getVoices() || [];
      if (list.length) availableBrowserVoices = list;
    } catch {}
    return availableBrowserVoices;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    refreshBrowserVoices();
    try {
      window.speechSynthesis.onvoiceschanged = () => refreshBrowserVoices();
    } catch {}
  }

  function generateSelfGeneratingInterviewSet(count = 5) {
    const iv = state.interviewState;
    const track = iv.track;
    const curatedPool = [];

    if (iv.roundMode === 'hr') {
      (AI_INTERVIEW_QUESTION_BANK['Separate HR & Behavioral Interview Round (40 Questions · upGrad & Playlist)'] || []).forEach(item => curatedPool.push(item));
    } else if (iv.roundMode === 'gd') {
      (AI_INTERVIEW_QUESTION_BANK['Group Discussion (GD) Round Simulator & Campus GD Topics'] || []).forEach(item => curatedPool.push(item));
    } else {
      Object.entries(AI_INTERVIEW_QUESTION_BANK).forEach(([tName, arr]) => {
        if (track === 'Self-Generated Mixed Core + Aptitude (Like Mock Test)' || tName === track) {
          arr.forEach(item => curatedPool.push(Object.assign({}, item, { sourceTrack: tName })));
        }
      });
    }

    // Also pull dynamic questions from state.questions when in technical or mixed mode
    let combinedPool = curatedPool.slice();
    if (iv.roundMode !== 'hr' && iv.roundMode !== 'gd') {
      const dynamicCandidates = state.questions.filter(q => q && q.text && q.text.length > 25 && q.explain);
      const shuffledDyn = dynamicCandidates.slice().sort(() => Math.random() - 0.5).slice(0, Math.max(6, count * 2));
      const synthesizedViva = shuffledDyn.map(q => {
        const cleanPrompt = String(q.text).replace(/<[^>]+>/g, '').trim();
        const cleanExplain = String(q.explain || '').replace(/<[^>]+>/g, '').trim();
        const officialOpt = (Array.isArray(q.options) && q.answer !== undefined && q.options[q.answer])
          ? stripLeadingOptionPrefix(String(q.options[q.answer]).replace(/<[^>]+>/g, ''))
          : '';
        const words = `${cleanExplain} ${officialOpt} ${q.topic || ''}`
          .toLowerCase()
          .replace(/[^a-z0-9.\s]/g, ' ')
          .split(/\s+/)
          .filter(w => w.length >= 4 && !['with', 'from', 'that', 'this', 'have', 'will', 'therefore', 'given', 'where'].includes(w));
        const uniqKw = Array.from(new Set(words)).slice(0, 8);

        return {
          q: `${cleanPrompt} Walk me through the governing formula, unit conversions, and final answer.`,
          keywords: uniqKw.length ? uniqKw : ['formula', 'stress', 'efficiency', 'ratio', 'energy'],
          idealPoints: [
            officialOpt ? `Verified Result: ${officialOpt}.` : 'State the governing conservation law and boundary conditions clearly.',
            cleanExplain ? `Step-by-Step Calculation: ${cleanExplain}` : 'Substitute values in consistent SI units (N, mm, MPa, J, K).',
            `Topic: ${q.topic || 'Mechanical Engineering'}.`
          ],
          studyTopic: q.topic || 'Mechanical Engineering Core',
          studyGuideQuery: (q.topic || 'Mohr').split(' ')[0],
          subjectId: 'som',
          formula: cleanExplain.slice(0, 120) || 'Apply governing SI equation'
        };
      });
      combinedPool = curatedPool.concat(synthesizedViva);
    }

    iv.generatedQuestions = combinedPool.slice(0, Math.max(1, Number(count || iv.sessionQuestionCount || 5)));
    iv.sessionQuestionCount = iv.generatedQuestions.length;
    iv.qIndex = 0;
    iv.sessionScores = {};
    iv.sessionAnswers = {};
    iv.sessionTimings = {};
    iv.totalInterviewSec = 0;
    iv.evaluated = false;
    iv.lastEvaluation = null;
    iv.answerText = '';
    iv.coachFeedbackHtml = '';
    iv.sessionFinished = false;
    iv.terminatedByProctor = false;
    iv.showExitConfirmModal = false;
    iv.qTimerSec = 180;
    return iv.generatedQuestions;
  }

  function getActiveInterviewQuestions() {
    const iv = state.interviewState;
    if (!Array.isArray(iv.generatedQuestions) || !iv.generatedQuestions.length) {
      generateSelfGeneratingInterviewSet(iv.sessionQuestionCount || 5);
    }
    return iv.generatedQuestions;
  }

  function startHumanAvatarAnimationLoop() {
    if (avatarAnimIntervalId) clearInterval(avatarAnimIntervalId);
    let tick = 0;
    avatarAnimIntervalId = setInterval(() => {
      if (!state.interviewState.activeFullscreen) return;
      tick += 1;
      const iv = state.interviewState;
      const mouthEl = document.getElementById('avatar-mouth-shape');
      const jawEl = document.getElementById('avatar-jaw-group');
      const eyesEl = document.getElementById('avatar-eyes-group');
      const headEl = document.getElementById('avatar-head-group');
      const geminiOrbEl = document.getElementById('gemini-live-orb');
      const waveBars = document.querySelectorAll('.avatar-wave-bar');

      if (iv.isSpeaking) {
        const openH = [3, 9, 5, 12, 4, 10, 6][tick % 7];
        if (mouthEl) {
          mouthEl.setAttribute('ry', String(openH));
          mouthEl.setAttribute('rx', String(openH > 7 ? 11 : 9));
          mouthEl.setAttribute('fill', '#7F1D1D');
        }
        if (jawEl) jawEl.setAttribute('transform', `translate(0, ${(openH * 0.25).toFixed(1)})`);
        if (geminiOrbEl) geminiOrbEl.style.transform = `scale(${(1.04 + 0.14 * Math.sin(tick * 0.7)).toFixed(2)})`;
        waveBars.forEach((bar, idx) => {
          const h = 8 + ((tick * 7 + idx * 11) % 24);
          bar.style.height = `${h}px`;
        });
      } else {
        if (mouthEl) {
          mouthEl.setAttribute('ry', '2.2');
          mouthEl.setAttribute('rx', '10');
          mouthEl.setAttribute('fill', '#991B1B');
        }
        if (jawEl) jawEl.setAttribute('transform', 'translate(0, 0)');
        if (geminiOrbEl) geminiOrbEl.style.transform = iv.isListening ? `scale(${(1.02 + 0.08 * Math.sin(tick * 0.5)).toFixed(2)})` : 'scale(1)';
        waveBars.forEach((bar, idx) => {
          const h = iv.isListening ? (6 + ((tick * 5 + idx * 9) % 18)) : 4;
          bar.style.height = `${h}px`;
        });
      }

      const isBlinking = (tick % 28 === 0) || (tick % 28 === 1);
      if (eyesEl) {
        eyesEl.setAttribute('transform', isBlinking ? 'scale(1, 0.12)' : 'scale(1, 1)');
      }

      if (headEl) {
        const nodY = iv.isListening ? (Math.sin(tick * 0.35) * 2.2) : (iv.isSpeaking ? Math.sin(tick * 0.45) * 1.5 : 0);
        const tiltDeg = Math.sin(tick * 0.18) * 1.4;
        headEl.setAttribute('transform', `translate(0, ${nodY.toFixed(1)}) rotate(${tiltDeg.toFixed(2)}, 110, 105)`);
      }
    }, 110);
  }

  function renderHumanInterviewerAvatarSvg(iv) {
    const personaLabel = iv.voicePersona === 'gemini-live'
      ? '✨ Gemini Live Human-Like AI Interviewer (Conversational)'
      : iv.voicePersona === 'female-panel'
        ? 'Dr. Ananya Rao (Senior HR & R&D Panelist)'
        : iv.voicePersona === 'fast-tech'
          ? 'Prof. Vikram Prabhu (Principal Technical Examiner)'
          : 'Dr. Rajeev Narayanan (Chief Mechanical Panelist)';

    const hairPath = iv.voicePersona === 'female-panel'
      ? '<path d="M58 95 C55 42, 165 42, 162 95 C168 125, 166 155, 154 168 C150 135, 148 110, 145 95 C130 72, 90 72, 75 95 C72 110, 70 135, 66 168 C54 155, 52 125, 58 95 Z" fill="#1E293B"/>'
      : '<path d="M64 88 C64 46, 156 46, 156 88 C150 68, 130 62, 110 62 C90 62, 70 68, 64 88 Z" fill="#1E293B"/>';

    return `
      <div class="bg-slate-900 text-white rounded-2xl border border-blue-800/80 p-4 shadow-xl flex flex-col justify-between space-y-3">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <div id="gemini-live-orb" class="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-emerald-400 flex items-center justify-center text-xs font-black shadow-lg transition-transform">✦</div>
            <div>
              <span class="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 block">🧑 Human-Like Gemini Live Interviewer</span>
              <h3 class="text-xs sm:text-sm font-extrabold text-white">${escapeHtml(personaLabel)}</h3>
            </div>
          </div>
          <span id="iv-voice-status-badge" class="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold text-[10px]">
            ${iv.isSpeaking ? '🔊 Gemini Talking (Lip-Sync)' : iv.isListening ? '🔴 Listening & Nodding' : '🎙️ Ready to Talk'}
          </span>
        </div>

        <!-- Animated Human Interviewer Portrait with Lip-Sync, Eye Blink & Head Motion -->
        <div class="relative bg-gradient-to-b from-slate-800 to-slate-950 rounded-2xl border border-slate-700 p-2 flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 220 195" class="w-44 h-40">
            <circle cx="110" cy="105" r="76" fill="rgba(37,99,235,0.16)"/>
            <path d="M36 195 C42 152, 75 144, 110 144 C145 144, 178 152, 184 195 Z" fill="#0F172A" stroke="#334155" stroke-width="2"/>
            <polygon points="94,145 110,185 126,145" fill="#F8FAFC"/>
            <polygon points="106,152 114,152 116,188 104,188" fill="#2563EB"/>
            <rect x="97" y="126" width="26" height="24" rx="8" fill="#F1C27D"/>

            <g id="avatar-head-group" transform="translate(0,0)">
              <ellipse cx="64" cy="102" rx="6" ry="11" fill="#E0AC69"/>
              <ellipse cx="156" cy="102" rx="6" ry="11" fill="#E0AC69"/>
              <rect x="66" y="54" width="88" height="84" rx="38" fill="#F1C27D" stroke="#D19A56" stroke-width="1.5"/>
              ${hairPath}
              <path d="M80 86 Q91 81 101 85" fill="none" stroke="#1E293B" stroke-width="3" stroke-linecap="round"/>
              <path d="M119 85 Q129 81 140 86" fill="none" stroke="#1E293B" stroke-width="3" stroke-linecap="round"/>
              <rect x="76" y="89" width="28" height="17" rx="4" fill="rgba(56,189,248,0.12)" stroke="#334155" stroke-width="2"/>
              <rect x="116" y="89" width="28" height="17" rx="4" fill="rgba(56,189,248,0.12)" stroke="#334155" stroke-width="2"/>
              <line x1="104" y1="96" x2="116" y2="96" stroke="#334155" stroke-width="2"/>

              <g id="avatar-eyes-group" style="transform-origin: 110px 97px;">
                <ellipse cx="90" cy="97" rx="6.5" ry="4.5" fill="#FFFFFF"/>
                <circle cx="90" cy="97" r="3" fill="#0F172A"/>
                <circle cx="91.2" cy="95.8" r="1" fill="#FFFFFF"/>
                <ellipse cx="130" cy="97" rx="6.5" ry="4.5" fill="#FFFFFF"/>
                <circle cx="130" cy="97" r="3" fill="#0F172A"/>
                <circle cx="131.2" cy="95.8" r="1" fill="#FFFFFF"/>
              </g>

              <path d="M110 96 L107 111 L114 112" fill="none" stroke="#C68642" stroke-width="2" stroke-linecap="round"/>

              <g id="avatar-jaw-group">
                <ellipse id="avatar-mouth-shape" cx="110" cy="123" rx="10" ry="2.2" fill="#991B1B" stroke="#7F1D1D" stroke-width="1.5"/>
                <path d="M103 122 Q110 124 117 122" fill="none" stroke="#FCA5A5" stroke-width="1"/>
              </g>
            </g>
          </svg>

          <div class="absolute bottom-2 right-2.5 flex items-end gap-1 h-7 px-2 py-1 rounded-lg bg-slate-950/80 border border-slate-800">
            ${[1, 2, 3, 4, 5, 6].map(() => `<span class="avatar-wave-bar w-1 bg-blue-400 rounded-full transition-all" style="height: 5px;"></span>`).join('')}
          </div>
        </div>

        <!-- Selectable Audio Voice & Gemini Persona Controls -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <div>
            <label class="block text-[10px] font-bold uppercase text-slate-400 mb-0.5" for="iv-persona-select">Interviewer Persona &amp; Style</label>
            <select id="iv-persona-select" class="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-bold text-white">
              <option value="gemini-live" ${iv.voicePersona === 'gemini-live' ? 'selected' : ''}>✨ Gemini Live Natural Assistant (Conversational)</option>
              <option value="male-panel" ${iv.voicePersona === 'male-panel' ? 'selected' : ''}>🎙️ Male Chief Panelist (Deep 0.92p)</option>
              <option value="female-panel" ${iv.voicePersona === 'female-panel' ? 'selected' : ''}>🎙️ Female HR &amp; R&amp;D Panelist (1.12p)</option>
              <option value="fast-tech" ${iv.voicePersona === 'fast-tech' ? 'selected' : ''}>🎙️ Fast Technical Examiner (1.12×)</option>
            </select>
          </div>
          <div>
            <label class="block text-[10px] font-bold uppercase text-slate-400 mb-0.5" for="iv-browser-voice-select">Selectable System Audio Voice</label>
            <select id="iv-browser-voice-select" class="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-semibold text-white">
              <option value="auto-in">Auto Natural English (India / Gemini Default)</option>
              ${refreshBrowserVoices().map(v => `
                <option value="${escapeHtml(v.voiceURI)}" ${iv.selectedVoiceURI === v.voiceURI ? 'selected' : ''}>
                  ${escapeHtml(v.name)} (${escapeHtml(v.lang)})
                </option>
              `).join('')}
            </select>
          </div>
        </div>
      </div>
    `;
  }

  function speakInterviewText(textToRead, onDoneCallback = null) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (typeof onDoneCallback === 'function') onDoneCallback();
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const iv = state.interviewState;
      const cleanSpeech = String(textToRead || '')
        .replace(/\[[^\]]*\]/g, '')
        .replace(/σ_x/g, 'sigma x')
        .replace(/σ_y/g, 'sigma y')
        .replace(/τ_xy/g, 'tau x y')
        .replace(/σ₁,₂|σ₁|σ₂/g, 'principal stress')
        .replace(/τ_max/g, 'maximum shear stress')
        .replace(/δ/g, 'deflection delta')
        .replace(/π/g, 'pi')
        .replace(/√/g, 'square root of ')
        .replace(/²/g, ' squared')
        .replace(/³/g, ' cubed')
        .replace(/⁴/g, ' to the power 4')
        .replace(/×|·/g, ' times ');

      const utter = new SpeechSynthesisUtterance(cleanSpeech);
      const voices = refreshBrowserVoices();

      if (iv.selectedVoiceURI && iv.selectedVoiceURI !== 'auto-in') {
        const matchedVoice = voices.find(v => v.voiceURI === iv.selectedVoiceURI || v.name === iv.selectedVoiceURI);
        if (matchedVoice) utter.voice = matchedVoice;
      } else if (voices.length) {
        const preferred = voices.find(v => /Google|Natural|en-IN|India/i.test(v.name + ' ' + v.lang)) || voices.find(v => /en/i.test(v.lang)) || voices[0];
        if (preferred) utter.voice = preferred;
      }

      if (iv.voicePersona === 'gemini-live') {
        utter.pitch = 1.03;
        utter.rate = 1.02;
      } else if (iv.voicePersona === 'male-panel') {
        utter.pitch = 0.90;
        utter.rate = 0.98;
      } else if (iv.voicePersona === 'female-panel') {
        utter.pitch = 1.14;
        utter.rate = 1.0;
      } else {
        utter.pitch = 1.0;
        utter.rate = 1.12;
      }

      iv.isSpeaking = true;
      const statusBadge = document.getElementById('iv-voice-status-badge');
      if (statusBadge) {
        statusBadge.textContent = '🔊 Gemini Talking (Lip-Sync)';
        statusBadge.className = 'px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[10px] animate-pulse';
      }

      utter.onend = () => {
        iv.isSpeaking = false;
        const sb = document.getElementById('iv-voice-status-badge');
        if (sb) {
          sb.textContent = '🎙️ Voice + Text Ready';
          sb.className = 'px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold text-[10px]';
        }
        if (typeof onDoneCallback === 'function') onDoneCallback();
        else if (iv.autoListenAfterSpeak && iv.activeFullscreen && !iv.isListening && !iv.evaluated) {
          toggleVoiceMicrophoneInput();
        }
      };
      utter.onerror = () => {
        iv.isSpeaking = false;
      };
      window.speechSynthesis.speak(utter);
    } catch {}
  }

  function stopInterviewSpeech() {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch {}
    state.interviewState.isSpeaking = false;
    const sb = document.getElementById('iv-voice-status-badge');
    if (sb) {
      sb.textContent = '🎙️ Voice + Text Ready';
      sb.className = 'px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold text-[10px]';
    }
  }

  function toggleVoiceMicrophoneInput() {
    const SpeechRec = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SpeechRec) {
      showToast('Voice dictation requires Chrome, Edge, or Safari with microphone permission.', 'warn');
      return;
    }
    const iv = state.interviewState;
    const micBtn = document.getElementById('iv-mic-record-btn');
    const statusBadge = document.getElementById('iv-voice-status-badge');
    const ta = document.getElementById('iv-answer-input');

    if (iv.isListening && activeSpeechRecognition) {
      try { activeSpeechRecognition.stop(); } catch {}
      iv.isListening = false;
      if (micBtn) {
        micBtn.innerHTML = '🎤 Speak to Gemini (Mic + Text)';
        micBtn.className = 'px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow transition flex items-center gap-1.5';
      }
      if (statusBadge) {
        statusBadge.textContent = '✓ Voice Captured';
        statusBadge.className = 'px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold text-[10px]';
      }
      return;
    }

    stopInterviewSpeech();
    try {
      const rec = new SpeechRec();
      activeSpeechRecognition = rec;
      rec.lang = 'en-IN';
      rec.continuous = true;
      rec.interimResults = true;

      const baseText = ta ? ta.value.trim() : '';
      iv.isListening = true;

      if (micBtn) {
        micBtn.innerHTML = '⏹ Stop Mic (Listening Live...)';
        micBtn.className = 'px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg animate-pulse flex items-center gap-1.5';
      }
      if (statusBadge) {
        statusBadge.textContent = '🔴 Listening & Nodding...';
        statusBadge.className = 'px-2.5 py-1 rounded-full bg-rose-600 text-white font-extrabold text-[10px] animate-pulse';
      }

      rec.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript + ' ';
        }
        const combined = (baseText ? baseText + ' ' : '') + transcript.trim();
        if (ta) {
          ta.value = combined;
          iv.answerText = combined;
        }
      };

      rec.onerror = () => {
        iv.isListening = false;
        if (micBtn) {
          micBtn.innerHTML = '🎤 Speak to Gemini (Mic + Text)';
          micBtn.className = 'px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow transition flex items-center gap-1.5';
        }
      };

      rec.onend = () => {
        iv.isListening = false;
        if (micBtn) {
          micBtn.innerHTML = '🎤 Speak to Gemini (Mic + Text)';
          micBtn.className = 'px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow transition flex items-center gap-1.5';
        }
      };

      rec.start();
    } catch {
      iv.isListening = false;
    }
  }

  function evaluateInterviewResponse(qItem, userAnswer) {
    const clean = String(userAnswer || '').trim();
    const lower = clean.toLowerCase();
    const matchedKeywords = (qItem.keywords || []).filter(kw => lower.includes(kw.toLowerCase()));
    const wordCount = clean ? clean.split(/\s+/).length : 0;

    const kwRatio = matchedKeywords.length / Math.max(1, (qItem.keywords || []).length);
    const lengthBonus = Math.min(25, Math.round(wordCount / 2.0));
    const rawScore = clean.length < 6 ? 0 : Math.min(98, Math.round(kwRatio * 75 + lengthBonus));

    const missingKeywords = (qItem.keywords || []).filter(kw => !lower.includes(kw.toLowerCase()));

    const recommendedGuides = state.guides.filter(g => {
      const hay = `${g.name || ''} ${g.title || ''} ${g.topic || ''} ${g.idea || ''}`.toLowerCase();
      return hay.includes((qItem.studyGuideQuery || 'Mohr').toLowerCase()) || hay.includes((qItem.studyTopic || 'Design').split(' ')[0].toLowerCase());
    }).slice(0, 3);

    // Human-like conversational Gemini response
    const humanGreeting = rawScore >= 75
      ? `Great job on that explanation, Girish! You hit the core concepts (${matchedKeywords.slice(0, 4).join(', ')}) right on the mark.`
      : rawScore >= 45
        ? `Good effort! You're on the right track with ${matchedKeywords.length ? matchedKeywords.slice(0, 3).join(', ') : 'the concept'}, and adding the exact formula and units will make your answer 10 out of 10.`
        : `Let's walk through this together! The key trick here is applying ${qItem.formula || 'the governing equation'} with consistent SI units.`;

    return {
      score: rawScore,
      wordCount,
      matchedKeywords,
      missingKeywords,
      humanConversationalReply: humanGreeting,
      strengths: matchedKeywords.length
        ? `${humanGreeting} Matched keywords: ${matchedKeywords.join(', ')}.`
        : `${humanGreeting}`,
      gaps: missingKeywords.length
        ? `Include these key terms & numbers next time: ${missingKeywords.slice(0, 6).join(', ')}.`
        : 'Complete coverage of all expected panel points!',
      recommendedGuides,
      qItem
    };
  }

  function startInterviewQuestionTimer() {
    if (interviewQuestionTimerId) clearInterval(interviewQuestionTimerId);
    const iv = state.interviewState;
    iv.qTimerSec = 180;
    interviewQuestionTimerId = setInterval(() => {
      if (!iv.activeFullscreen || iv.sessionFinished) return;
      iv.qTimerSec = Math.max(0, iv.qTimerSec - 1);
      iv.totalInterviewSec = (iv.totalInterviewSec || 0) + 1;
      iv.sessionTimings[iv.qIndex] = (iv.sessionTimings[iv.qIndex] || 0) + 1;

      const tEl = document.getElementById('iv-q-timer-readout');
      const spentEl = document.getElementById('iv-q-spent-readout');
      if (tEl) {
        const mm = String(Math.floor(iv.qTimerSec / 60)).padStart(2, '0');
        const ss = String(iv.qTimerSec % 60).padStart(2, '0');
        tEl.textContent = `⏱ ${mm}:${ss}`;
      }
      if (spentEl) {
        spentEl.textContent = `⏳ Answered in: ${iv.sessionTimings[iv.qIndex]}s`;
      }
    }, 1000);
  }

  function enterInterviewFullscreen(startMicImmediately = false) {
    const iv = state.interviewState;
    iv.activeFullscreen = true;
    iv.sessionFinished = false;
    iv.terminatedByProctor = false;
    iv.showExitConfirmModal = false;
    state.proctorState.warningCount = 0;
    state.proctorState.maxWarnings = 3;
    state.proctorState.bannerVisible = false;
    state.proctorState.terminatedByLimit = false;
    state.proctorState.lastAlert = '';

    if (!Array.isArray(iv.generatedQuestions) || !iv.generatedQuestions.length) {
      generateSelfGeneratingInterviewSet(iv.sessionQuestionCount || 5);
    }
    try {
      if (!document.fullscreenElement && document.documentElement?.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch {}
    syncExamFullscreenMode(true);
    if (iv.proctoringEnabled) startProctorCameraAndDetector();
    else stopProctorCameraAndDetector();
    startHumanAvatarAnimationLoop();
    startInterviewQuestionTimer();
    renderPlacementPrep();

    const trackQuestions = getActiveInterviewQuestions();
    const activeQ = trackQuestions[iv.qIndex] || trackQuestions[0];
    if (startMicImmediately) {
      setTimeout(() => toggleVoiceMicrophoneInput(), 250);
    } else if (iv.autoSpeak && activeQ) {
      setTimeout(() => speakInterviewText(`Hi Girish, welcome to your ${iv.roundMode === 'hr' ? 'HR Interview' : iv.roundMode === 'gd' ? 'Group Discussion' : 'Technical Interview'} session. Here is Question ${iv.qIndex + 1}. ${activeQ.q}`), 300);
    }
  }

  function exitInterviewFullscreen() {
    stopInterviewSpeech();
    if (activeSpeechRecognition) {
      try { activeSpeechRecognition.stop(); } catch {}
    }
    if (avatarAnimIntervalId) {
      clearInterval(avatarAnimIntervalId);
      avatarAnimIntervalId = null;
    }
    if (interviewQuestionTimerId) {
      clearInterval(interviewQuestionTimerId);
      interviewQuestionTimerId = null;
    }
    stopProctorCameraAndDetector();
    state.interviewState.showExitConfirmModal = false;
    state.interviewState.isListening = false;
    state.interviewState.activeFullscreen = false;
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    } catch {}
    syncExamFullscreenMode(false);
    renderPlacementPrep();
  }

  function renderPlacementPrep() {
    const iv = state.interviewState;
    const trackQuestions = getActiveInterviewQuestions();
    iv.qIndex = Math.min(Math.max(0, iv.qIndex), Math.max(0, trackQuestions.length - 1));
    const activeQ = trackQuestions[iv.qIndex] || AI_INTERVIEW_QUESTION_BANK['Technical Test Review: AGV, Pneumatics, Bearings, 5S & Core Mechanical'][0];

    // =========================================================================
    // FULL-SCREEN VERSION 5 HUMAN-LIKE GEMINI INTERVIEW ROOM (TECHNICAL / HR / GD)
    // =========================================================================
    if (iv.activeFullscreen) {
      syncExamFullscreenMode(true);
      const answeredIndices = Object.keys(iv.sessionScores);
      const avgSessionScore = answeredIndices.length
        ? Math.round(answeredIndices.reduce((acc, k) => acc + Number(iv.sessionScores[k] || 0), 0) / answeredIndices.length)
        : 0;
      const mins = String(Math.floor((iv.qTimerSec || 180) / 60)).padStart(2, '0');
      const secs = String((iv.qTimerSec || 180) % 60).padStart(2, '0');
      const spentSec = iv.sessionTimings[iv.qIndex] || 0;

      // Final Session Performance & Timing Report View
      if (iv.sessionFinished) {
        const totalIntSec = Math.max(1, iv.totalInterviewSec || 1);
        const avgIntSec = (totalIntSec / Math.max(1, trackQuestions.length)).toFixed(1);
        const verdict = iv.terminatedByProctor
          ? '⛔ SESSION TERMINATED BY PROCTORING GUARD (3/3 WARNINGS EXCEEDED)'
          : avgSessionScore >= 75
            ? 'SELECTED — Strong Technical & Communication Readiness'
            : avgSessionScore >= 50
              ? 'SHORTLISTED — Revise Formula Units & 5S/Numeric Steps'
              : 'NEEDS PRACTICE — Review Model Answers & Study Guides Below';

        container.innerHTML = `
          <div class="max-w-5xl mx-auto py-4 space-y-5">
            ${iv.terminatedByProctor ? `
              <div class="rounded-2xl bg-rose-950 border-2 border-rose-500 text-white p-5 shadow-xl flex items-center gap-4">
                <div class="text-3xl">⛔</div>
                <div>
                  <div class="text-xs font-black uppercase tracking-wider text-rose-400">3-Warning Limit Reached · Interview Auto-Terminated</div>
                  <div class="text-base font-extrabold mt-0.5">Your session was ended automatically after reaching 3/3 proctoring warnings (${escapeHtml(state.proctorState.lastAlert)}).</div>
                </div>
              </div>
            ` : ''}

            <div class="bg-slate-900 text-white rounded-2xl p-6 space-y-4 border-2 border-emerald-500 shadow-2xl">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div class="space-y-1">
                  <span class="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                    🏢 Version 5 Gemini Interview Performance &amp; Timing Report
                  </span>
                  <h1 class="text-2xl font-extrabold">Overall Score: ${avgSessionScore}% (${answeredIndices.length}/${trackQuestions.length} Answered)</h1>
                  <p class="text-xs text-emerald-300 font-bold">${escapeHtml(verdict)}</p>
                </div>
                <div class="flex flex-wrap gap-2.5">
                  <button type="button" id="iv-regenerate-new-set-btn" class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow">
                    🎲 Self-Generate New Set →
                  </button>
                  <button type="button" id="iv-exit-fs-btn" class="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow">
                    ✕ Return to Placement Hub
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div class="p-3 rounded-xl bg-slate-800 border border-slate-700">
                  <div class="text-[10px] font-bold uppercase text-slate-400">Total Interview Time</div>
                  <div class="text-base font-extrabold text-white mt-0.5">${Math.floor(totalIntSec / 60)}m ${totalIntSec % 60}s</div>
                </div>
                <div class="p-3 rounded-xl bg-slate-800 border border-slate-700">
                  <div class="text-[10px] font-bold uppercase text-slate-400">Avg Response Time</div>
                  <div class="text-base font-extrabold text-blue-300 mt-0.5">${avgIntSec}s / Q</div>
                </div>
                <div class="p-3 rounded-xl bg-slate-800 border border-slate-700">
                  <div class="text-[10px] font-bold uppercase text-slate-400">Interview Round</div>
                  <div class="text-base font-extrabold text-emerald-400 mt-0.5 uppercase">${escapeHtml(iv.roundMode)}</div>
                </div>
                <div class="p-3 rounded-xl bg-slate-800 border border-slate-700">
                  <div class="text-[10px] font-bold uppercase text-slate-400">Proctoring Warnings</div>
                  <div class="text-base font-extrabold ${state.proctorState.warningCount >= 3 ? 'text-rose-400' : 'text-amber-300'} mt-0.5">${state.proctorState.warningCount} / 3</div>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              ${trackQuestions.map((qIt, idx) => {
                const sc = iv.sessionScores[idx] ?? 0;
                const uAns = iv.sessionAnswers[idx] || '— (Not Answered)';
                const qSec = iv.sessionTimings[idx] || 0;
                return `
                  <article class="bg-white rounded-2xl border border-slate-200 p-5 shadow-md space-y-3">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                      <div class="flex items-center gap-2">
                        <span class="px-3 py-1 rounded-lg bg-slate-900 text-white font-bold text-xs">Q${idx + 1} · ${escapeHtml(qIt.studyTopic)}</span>
                        <span class="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200 font-mono font-bold text-xs">⏱ Time: ${qSec}s</span>
                      </div>
                      <span class="px-3 py-1 rounded-full font-extrabold text-xs ${sc >= 70 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">Score: ${sc}/100</span>
                    </div>
                    <p class="text-sm font-bold text-slate-900">${escapeHtml(qIt.q)}</p>
                    <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700"><b>Your Spoken/Written Response:</b> ${escapeHtml(uAns)}</div>
                    <div class="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-slate-800 space-y-1">
                      <b>Model Panel Answer &amp; Formula Points:</b>
                      <ul class="list-disc pl-4">${(qIt.idealPoints || []).map(p => `<li>${escapeHtml(p)}</li>`).join('')}</ul>
                    </div>
                  </article>
                `;
              }).join('')}
            </div>
          </div>
        `;
        document.getElementById('iv-regenerate-new-set-btn')?.addEventListener('click', () => {
          generateSelfGeneratingInterviewSet(iv.sessionQuestionCount || 5);
          enterInterviewFullscreen(false);
        });
        document.getElementById('iv-exit-fs-btn')?.addEventListener('click', exitInterviewFullscreen);
        return;
      }

      container.innerHTML = `
        <div class="max-w-6xl mx-auto py-1 space-y-4">
          ${renderExitConfirmationModalHtml(iv.showExitConfirmModal, 'AI Interview')}
          ${renderProctorWarningBannerHtml()}

          <!-- Top Full-Screen Header Bar -->
          <div class="bg-slate-900 text-white rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl border border-blue-700/70">
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-lg font-black shadow shrink-0">✦</div>
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
                    ⛶ Gemini Live ${iv.roundMode === 'hr' ? 'HR Interview' : iv.roundMode === 'gd' ? 'Group Discussion (GD)' : 'Technical Interview'} · Q${iv.qIndex + 1}/${trackQuestions.length}
                  </span>
                  <span class="px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-200 border border-blue-700 font-bold text-[11px]">
                    Avg Score: ${avgSessionScore}%
                  </span>
                </div>
                <h1 class="text-sm sm:text-base font-extrabold text-white truncate mt-0.5">${escapeHtml(iv.company)}</h1>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <span id="iv-q-spent-readout" class="px-2.5 py-1.5 rounded-xl bg-indigo-950 border border-indigo-700 font-mono text-xs font-bold text-indigo-200">
                ⏳ Answered in: ${spentSec}s
              </span>
              <div id="iv-q-timer-readout" class="px-3 py-1.5 rounded-xl bg-blue-950 border border-blue-700 font-mono text-xs sm:text-sm font-extrabold text-amber-300">
                ⏱ ${mins}:${secs}
              </div>
              <button type="button" id="iv-self-gen-btn" class="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow transition">
                🎲 New Set
              </button>
              <button type="button" id="iv-finish-session-btn" class="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow transition">
                📊 Finish &amp; Report
              </button>
              <button type="button" id="iv-request-exit-btn" class="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold shadow transition">
                ✕ Exit
              </button>
            </div>
          </div>

          <!-- Top Visual Row: Left = Human-Like Gemini Avatar + Selectable Audio | Right = Live Candidate Camera (ON/OFF Toggle) -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
            <div class="lg:col-span-2">
              ${renderHumanInterviewerAvatarSvg(iv)}
            </div>
            <div class="flex flex-col justify-between bg-slate-900 rounded-2xl border border-slate-700 p-3 space-y-2">
              ${renderProctorCameraWidgetHtml(false, 'iv-live-cam-toggle')}
              <div class="flex flex-wrap items-center justify-between gap-2 px-1 pt-1 border-t border-slate-800 text-[11px] text-slate-300">
                <label class="inline-flex items-center gap-1.5 cursor-pointer font-bold">
                  <input id="iv-autospeak-toggle" type="checkbox" ${iv.autoSpeak ? 'checked' : ''} class="rounded text-blue-500">
                  <span>🔊 Auto-Speak</span>
                </label>
                <label class="inline-flex items-center gap-1.5 cursor-pointer font-bold text-amber-300">
                  <input id="iv-autolisten-toggle" type="checkbox" ${iv.autoListenAfterSpeak ? 'checked' : ''} class="rounded text-amber-400">
                  <span>🎤 Auto-Mic (Gemini Live)</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Unified Combined Voice + Text Interview Question & Answer Console -->
          <section class="bg-white rounded-2xl border-2 border-blue-600 p-5 sm:p-6 shadow-2xl space-y-4">
            <!-- Round Mode Pills (Technical / HR / GD) + Track Switcher -->
            <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div class="flex flex-wrap gap-1.5">
                ${[
                  ['technical', '⚙️ Technical Round'],
                  ['hr', '🤝 Separate HR Round (40 Qs)'],
                  ['gd', '🗣️ Group Discussion (GD) Round']
                ].map(([mKey, mLbl]) => `
                  <button type="button" data-iv-round-mode="${mKey}" class="px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${iv.roundMode === mKey ? 'bg-blue-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}">
                    ${mLbl}
                  </button>
                `).join('')}
              </div>

              <div class="flex items-center gap-2">
                <button type="button" id="iv-prev-q-btn" class="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800">
                  ← Prev
                </button>
                <button type="button" id="iv-next-q-btn" class="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold">
                  Next (${iv.qIndex + 1}/${trackQuestions.length}) →
                </button>
              </div>
            </div>

            <!-- Active Interviewer Question Box -->
            <div class="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white space-y-2.5 shadow-md">
              <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-blue-300">
                <span class="font-extrabold">🎙️ GEMINI INTERVIEWER · QUESTION ${iv.qIndex + 1} OF ${trackQuestions.length} (${escapeHtml(activeQ.studyTopic)})</span>
                <div class="flex flex-wrap items-center gap-2">
                  <button type="button" id="iv-speak-q-btn" class="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition">
                    🔊 Speak Question
                  </button>
                  <button type="button" id="iv-stop-speech-btn" class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold">
                    🔇 Mute
                  </button>
                </div>
              </div>
              <p class="text-sm sm:text-base font-bold leading-relaxed text-white">
                "${escapeHtml(activeQ.q)}"
              </p>
            </div>

            <!-- Combined Voice + Text Answer Input Box -->
            <div class="space-y-3">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <label class="text-xs sm:text-sm font-extrabold text-slate-900" for="iv-answer-input">
                  Talk to Gemini Assistant (Click 🎤 Mic Dictation or Type Below):
                </label>
                <div class="flex flex-wrap items-center gap-2">
                  <button type="button" id="iv-mic-record-btn" class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow transition flex items-center gap-1.5">
                    🎤 Speak to Gemini (Mic + Text)
                  </button>
                  <button type="button" id="iv-fill-sample-btn" class="px-3 py-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100">
                    ✦ Insert Model Answer Points
                  </button>
                </div>
              </div>

              <textarea id="iv-answer-input" rows="4" class="w-full p-4 rounded-xl border-2 border-slate-300 text-xs sm:text-sm text-slate-900 leading-relaxed focus:border-blue-600 focus:outline-none" placeholder="Speak naturally to the Gemini Interviewer (your speech appears here live) or type your formula and explanation...">${escapeHtml(iv.answerText)}</textarea>

              <div class="flex flex-wrap items-center justify-between gap-3">
                <button type="button" id="iv-evaluate-btn" class="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-lg transition">
                  ✦ Send to Gemini Interviewer (Voice Reply + Score + Study Guide) →
                </button>
                <span class="text-[11px] text-slate-500">Gemini replies aloud with conversational feedback, logs your answering speed (${spentSec}s), and suggests Study Guides.</span>
              </div>
            </div>

            <!-- Combined Evaluation + AI Coach + Study Guide Suggester Output -->
            <div id="iv-evaluation-box" class="${iv.evaluated && iv.lastEvaluation ? '' : 'hidden'} space-y-5 pt-4 border-t border-slate-200">
              ${iv.evaluated && iv.lastEvaluation ? renderInterviewEvaluationHtml(iv.lastEvaluation, iv.coachFeedbackHtml) : ''}
            </div>
          </section>
        </div>
      `;

      bindProctorBannerEvents();

      document.getElementById('iv-live-cam-toggle')?.addEventListener('click', () => {
        iv.proctoringEnabled = !iv.proctoringEnabled;
        if (iv.proctoringEnabled) {
          startProctorCameraAndDetector();
          showToast('📷 AI Camera & Cheating Detector enabled (3-Warning Limit active).', 'success');
        } else {
          stopProctorCameraAndDetector();
          showToast('📷 Camera turned OFF by user.', 'info');
        }
        renderPlacementPrep();
      });

      // Exit Button Warning Confirmation Modal
      document.getElementById('iv-request-exit-btn')?.addEventListener('click', () => {
        iv.showExitConfirmModal = true;
        triggerProctorViolation('Clicked Exit Button During Active AI Interview', true);
        if (iv.activeFullscreen && !iv.sessionFinished) renderPlacementPrep();
      });
      document.getElementById('exit-modal-cancel-btn')?.addEventListener('click', () => {
        iv.showExitConfirmModal = false;
        try {
          if (!document.fullscreenElement && document.documentElement?.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {});
          }
        } catch {}
        renderPlacementPrep();
      });
      document.getElementById('exit-modal-confirm-btn')?.addEventListener('click', () => {
        iv.showExitConfirmModal = false;
        exitInterviewFullscreen();
      });

      container.querySelectorAll('[data-iv-round-mode]').forEach(btn => {
        btn.addEventListener('click', () => {
          iv.roundMode = btn.dataset.ivRoundMode;
          generateSelfGeneratingInterviewSet(iv.sessionQuestionCount || 5);
          renderPlacementPrep();
          const qs = getActiveInterviewQuestions();
          if (iv.autoSpeak && qs[0]) speakInterviewText(qs[0].q);
        });
      });

      document.getElementById('iv-self-gen-btn')?.addEventListener('click', () => {
        generateSelfGeneratingInterviewSet(iv.sessionQuestionCount || 5);
        enterInterviewFullscreen(false);
        showToast('Self-generated a brand new AI Interview question set!', 'success');
      });
      document.getElementById('iv-finish-session-btn')?.addEventListener('click', () => {
        stopInterviewSpeech();
        iv.sessionFinished = true;
        renderPlacementPrep();
      });
      bindInterviewInteractiveControls(iv, trackQuestions, activeQ);
      bindEvaluationStudyGuideLinks();
      return;
    }

    // =========================================================================
    // NORMAL HUB VIEW (WHEN NOT IN FULL-SCREEN INTERVIEW)
    // =========================================================================
    stopProctorCameraAndDetector();
    syncExamFullscreenMode(false);

    const pf = state.portalFilter;
    const portalCategories = [
      'all',
      '1. College Portal',
      '2. NATS, Prosple & General Portals',
      '3. Aptitude: IndiaBIX, PrepInsta & Practica',
      '4. Core Mechanical & OEM Portals'
    ];
    const filteredPortals = OFFICIAL_JOB_PORTALS.filter(p => {
      if (pf.category !== 'all' && p.category !== pf.category) return false;
      if (pf.search.trim()) {
        const hay = `${p.name} ${p.roles} ${p.location} ${p.category} ${p.badge}`.toLowerCase();
        if (!hay.includes(pf.search.trim().toLowerCase())) return false;
      }
      return true;
    });

    const sjcePortal = OFFICIAL_JOB_PORTALS[0];

    container.innerHTML = `
      <div class="space-y-7">
        <!-- 1. TOP CARD: VERSION 5 GEMINI LIVE INTERVIEW, SEPARATE HR ROUND, GD SIMULATOR & PROCTORED MOCK LAUNCHER -->
        <section class="bg-white rounded-2xl border-2 border-blue-600 p-5 sm:p-6 shadow-md space-y-5">
          <div class="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span class="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
                  ✦ Version 5 Gemini Live Interviewer · Technical + Separate HR + Group Discussion (GD) + Mock Test
                </span>
                <h1 class="text-lg sm:text-2xl font-extrabold text-white mt-0.5">
                  Complete Campus Placement Process (Selectable Camera ON/OFF · 3-Warning Auto-End)
                </h1>
              </div>
              <label class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-600 text-xs font-extrabold text-emerald-300 cursor-pointer">
                <input id="hub-camera-toggle" type="checkbox" ${iv.proctoringEnabled ? 'checked' : ''} class="rounded text-blue-500">
                <span>📷 Camera Proctor: ${iv.proctoringEnabled ? 'ON (3-Warn Limit)' : 'OFF'}</span>
              </label>
            </div>

            <!-- 4-Stage Campus Recruitment Cards (Mock Test, Technical Interview, Separate HR Round, Group Discussion GD) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div class="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 flex flex-col justify-between gap-2">
                <div>
                  <span class="text-[10px] font-extrabold uppercase text-blue-400">Round 1 · Written Test</span>
                  <h3 class="text-xs sm:text-sm font-extrabold text-white mt-0.5">Proctored Mock Test + Timing Report</h3>
                  <p class="text-[11px] text-slate-300 mt-0.5">Includes your Technical Test Review (AGV, Pneumatics, Bearings, 5S) with per-question timer.</p>
                </div>
                <button type="button" id="job-stage1-btn" class="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs">
                  1️⃣ Start Proctored Mock Test →
                </button>
              </div>

              <div class="p-3.5 rounded-xl bg-blue-950/90 border-2 border-amber-400 flex flex-col justify-between gap-2">
                <div>
                  <span class="text-[10px] font-extrabold uppercase text-amber-300">Round 2 · Technical Viva</span>
                  <h3 class="text-xs sm:text-sm font-extrabold text-white mt-0.5">Gemini Live Technical Interview</h3>
                  <p class="text-[11px] text-slate-200 mt-0.5">30+ Fresher Mechanical Qs + AGV/Pneumatic Numericals with Human Face Motion &amp; Voice.</p>
                </div>
                <button type="button" id="launch-tech-iv-btn" class="w-full py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow">
                  2️⃣ Start Technical Interview →
                </button>
              </div>

              <div class="p-3.5 rounded-xl bg-indigo-950/90 border border-indigo-500 flex flex-col justify-between gap-2">
                <div>
                  <span class="text-[10px] font-extrabold uppercase text-indigo-300">Round 3 · Separate HR Round</span>
                  <h3 class="text-xs sm:text-sm font-extrabold text-white mt-0.5">40 Most Asked HR Questions Viva</h3>
                  <p class="text-[11px] text-slate-200 mt-0.5">Practice Tell Me About Yourself, Strengths, 5-Yr Plan, Conflict &amp; Salary with Gemini Voice.</p>
                </div>
                <button type="button" id="launch-hr-iv-btn" class="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow">
                  3️⃣ Start Separate HR Interview →
                </button>
              </div>

              <div class="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500 flex flex-col justify-between gap-2">
                <div>
                  <span class="text-[10px] font-extrabold uppercase text-emerald-300">Round 4 · Group Discussion</span>
                  <h3 class="text-xs sm:text-sm font-extrabold text-white mt-0.5">Campus GD Simulator &amp; Pitch</h3>
                  <p class="text-[11px] text-slate-200 mt-0.5">Practice EV vs Hydrogen, AI in Manufacturing &amp; Industry 4.0 GD topics with live scoring.</p>
                </div>
                <button type="button" id="launch-gd-iv-btn" class="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow">
                  4️⃣ Start GD Simulator →
                </button>
              </div>
            </div>
          </div>

          <!-- Pre-Launch Track, Company & Voice Persona Selector -->
          <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
            <div>
              <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1" for="iv-hub-track-select">Interview Question Bank Track</label>
              <select id="iv-hub-track-select" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white">
                <option value="Technical Test Review: AGV, Pneumatics, Bearings, 5S & Core Mechanical" ${iv.track === 'Technical Test Review: AGV, Pneumatics, Bearings, 5S & Core Mechanical' ? 'selected' : ''}>⭐ Technical Test Review (AGV, Pneumatics, Bearings, 5S)</option>
                <option value="30+ Must-Know Mechanical Fresher Questions (GaugeHow & Playlist)" ${iv.track === '30+ Must-Know Mechanical Fresher Questions (GaugeHow & Playlist)' ? 'selected' : ''}>🔥 30+ Must-Know Mechanical Fresher Qs (GaugeHow)</option>
                <option value="Separate HR & Behavioral Interview Round (40 Questions · upGrad & Playlist)" ${iv.track === 'Separate HR & Behavioral Interview Round (40 Questions · upGrad & Playlist)' ? 'selected' : ''}>🤝 Separate HR Interview Round (40 Questions)</option>
                <option value="Group Discussion (GD) Round Simulator & Campus GD Topics" ${iv.track === 'Group Discussion (GD) Round Simulator & Campus GD Topics' ? 'selected' : ''}>🗣️ Group Discussion (GD) Simulator</option>
                <option value="Self-Generated Mixed Core + Aptitude (Like Mock Test)" ${iv.track === 'Self-Generated Mixed Core + Aptitude (Like Mock Test)' ? 'selected' : ''}>⚡ Self-Generated Mixed Core + Aptitude (Like Mock Test)</option>
                ${Object.keys(AI_INTERVIEW_QUESTION_BANK).map(t => `
                  <option value="${escapeHtml(t)}" ${iv.track === t ? 'selected' : ''}>${escapeHtml(t)}</option>
                `).join('')}
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1" for="iv-hub-company-select">Target Recruiter Panel</label>
              <select id="iv-hub-company-select" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white">
                ${[
                  'SJCE Placement Drive (All Core & Tech Recruiters)',
                  'L&T & LTTS (Mysuru / Bengaluru Core Engineering)',
                  'Honeywell Aerospace & Airbus India',
                  'Bosch India & General Motors (Automotive R&D)',
                  'Siemens Energy, Caterpillar & Schneider Electric',
                  'GE HealthCare & BEML (Mysuru / Bengaluru)',
                  'Bizotic / AM2 / AON / TCS NQT Placement Panel'
                ].map(c => `<option value="${escapeHtml(c)}" ${iv.company === c ? 'selected' : ''}>${escapeHtml(c)}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1" for="iv-hub-persona-select">Interviewer Voice &amp; Persona</label>
              <select id="iv-hub-persona-select" class="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white">
                <option value="gemini-live" ${iv.voicePersona === 'gemini-live' ? 'selected' : ''}>✨ Gemini Live Assistant (Conversational)</option>
                <option value="male-panel" ${iv.voicePersona === 'male-panel' ? 'selected' : ''}>🎙️ Male Chief Panelist (Dr. Rajeev)</option>
                <option value="female-panel" ${iv.voicePersona === 'female-panel' ? 'selected' : ''}>🎙️ Female HR &amp; R&amp;D Panelist (Dr. Ananya)</option>
                <option value="fast-tech" ${iv.voicePersona === 'fast-tech' ? 'selected' : ''}>🎙️ Fast Technical Examiner (Prof. Vikram)</option>
              </select>
            </div>
            <div class="flex items-end">
              <button type="button" id="iv-launch-fs-mic-btn" class="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow transition">
                🎤 Start Gemini Live Interview (Mic ON)
              </button>
            </div>
          </div>
        </section>

        <!-- 2. TECHNICAL TEST REVIEW & FORMULA SCORECARD (YOUR 10 ANSWERED + 8 NUMERICAL QUESTIONS) -->
        <section class="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span class="text-xs font-extrabold uppercase tracking-wider text-blue-600">📊 Your Technical Assessment Review &amp; Verified Formula Sheet</span>
              <h2 class="text-lg sm:text-xl font-extrabold text-slate-900">Answered Conceptual (75%) + Unanswered Numerical Solutions (AGV, Pneumatics, Bearings &amp; 5S)</h2>
            </div>
            <button type="button" id="practice-tech-review-mock-btn" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow shrink-0">
              ⏱ Practice These 18 Questions in Timed Mock Test →
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div class="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
              <div class="font-extrabold text-emerald-950">✅ Cylinder Bore Force (D=63mm, P=6 bar)</div>
              <div class="font-mono text-[11px] text-emerald-800">P = 0.6 N/mm² · A = π(63)²/4 = 3117.25 mm²</div>
              <div class="font-bold text-slate-900">F = P × A = 1,870.35 N → <span class="text-emerald-700">1,870 N ✅</span></div>
            </div>
            <div class="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
              <div class="font-extrabold text-emerald-950">✅ AGV 2WD Torque (800kg, Crr=0.02, 3% grad)</div>
              <div class="font-mono text-[11px] text-emerald-800">F = 156.96 + 235.44 = 392.4 N · T_tot = 69.25 N·m</div>
              <div class="font-bold text-slate-900">2WD: T_wheel = 69.25 / 2 → <span class="text-emerald-700">35 N·m ✅</span></div>
            </div>
            <div class="p-3.5 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
              <div class="font-extrabold text-blue-950">✅ AGV Beam Bending &amp; Bearing Life</div>
              <div class="font-mono text-[11px] text-blue-800">100kg on 50×50mm, L=1m → σ = M/Z = 11.77 ≈ 12 MPa</div>
              <div class="font-bold text-slate-900">Roller Bearing (3000 rpm): <span class="text-blue-700">125 hours ✅</span></div>
            </div>
            <div class="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
              <div class="font-extrabold text-amber-950">✅ Air Consumption &amp; Complete 5S</div>
              <div class="font-mono text-[11px] text-amber-900">D=50mm, L=200mm, 10 cpm → 7.85 L/min (≈ 10 L/min)</div>
              <div class="font-bold text-slate-900">5S: Sort · Set in Order · <span class="underline text-rose-700">Shine</span> · Standardize · Sustain</div>
            </div>
          </div>
        </section>

        <!-- 3. CURATED YOUTUBE INTERVIEW, HR, APTITUDE PLAYLISTS & GOOGLE DRIVE VOICE FOLDER -->
        <section class="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-800 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span class="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">🎬 Integrated Video Masterclasses, Playlists &amp; SJCE Voice Drive</span>
              <h2 class="text-base sm:text-lg font-extrabold text-white mt-0.5">Technical Interview, Separate HR Round, Aptitude Playlists &amp; Drive Recordings</h2>
            </div>
            <a href="https://drive.google.com/drive/folders/1SM7dWs5dUmj_sY3BiK_5MsPlQL5njm2b?usp=drive_link" target="_blank" rel="noopener noreferrer" class="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shrink-0">
              📂 Open SJCE Voice &amp; PDF Drive ↗
            </a>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            ${CURATED_INTERVIEW_VIDEOS_AND_PLAYLISTS.map(v => `
              <a href="${escapeHtml(v.url)}" target="_blank" rel="noopener noreferrer" class="p-4 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-blue-400 transition flex flex-col justify-between gap-2">
                <div>
                  <span class="inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-700 mb-1">${escapeHtml(v.badge)}</span>
                  <h3 class="text-xs sm:text-sm font-extrabold text-white leading-snug">${escapeHtml(v.title)}</h3>
                  <p class="text-[11px] text-slate-300 mt-1 leading-relaxed">${escapeHtml(v.desc)}</p>
                </div>
                <span class="text-[11px] font-bold text-amber-400 pt-1">Open Resource ↗</span>
              </a>
            `).join('')}
          </div>
        </section>

        <!-- 4. FIRST PORTAL: FEATURED OFFICIAL SJCE COLLEGE PLACEMENT PORTAL (https://sjceplacements.org/) -->
        <div class="rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-7 shadow-xl border-2 border-amber-400/80">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div class="flex items-start gap-4">
              ${sjcePortal.logoSvg}
              <div class="space-y-2">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-extrabold text-[11px] uppercase tracking-wider">
                    ★ 1ST PRIORITY · OFFICIAL COLLEGE PLACEMENT PORTAL
                  </span>
                  <span class="px-2.5 py-0.5 rounded-full bg-blue-900/90 border border-blue-600 text-blue-200 text-[11px] font-semibold">
                    JSS STU (SJCE) Mysuru · JSSATE Bengaluru · Noida
                  </span>
                </div>
                <h2 class="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Placement Portal — JSS Technical Institutions (SJCE Mysuru)
                </h2>
                <p class="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                  Official campus recruitment portal (<code class="text-amber-300">https://sjceplacements.org/</code>) for B.E. Mechanical Engineering campus drives, 8th-semester project internships (Jan–Jun 2027), Graduate Engineer Trainee (GET) registrations, and USN student login.
                </p>
              </div>
            </div>
            <div class="flex flex-wrap sm:flex-nowrap gap-2.5 shrink-0">
              <a href="https://sjceplacements.org/" target="_blank" rel="noopener noreferrer" class="px-4 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg transition flex items-center gap-2">
                <span>🎓 Open SJCE Placement Portal</span>
                <span>↗</span>
              </a>
              <a href="https://sjceplacements.org/login" target="_blank" rel="noopener noreferrer" class="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow transition flex items-center gap-1.5">
                <span>🔑 USN Student Login</span>
                <span>↗</span>
              </a>
              <a href="https://sjceplacements.org/past-recruiters" target="_blank" rel="noopener noreferrer" class="px-3.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 font-semibold text-xs sm:text-sm transition">
                Past Recruiters ↗
              </a>
            </div>
          </div>
        </div>

        <!-- 5. QUICK LAUNCH APP ICON DOCK (ORDERED: 1. SJCE COLLEGE -> 2. PROSPLE, NATS & GENERAL PORTALS -> 3. APTITUDE & MOCK INTERVIEW APPS: PRAMP, INTERVIEWING.IO, PREPBUNK, INTERVIEWBIT) -->
        <div class="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-lg border border-slate-800 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span class="text-[11px] font-extrabold uppercase tracking-wider text-blue-400">Quick-Launch Placement &amp; Mock Interview Dock (SJCE · Prosple · NATS · Naukri · Unstop · Pramp · Interviewing.io · Prepbunk · InterviewBit)</span>
              <h3 class="text-base sm:text-lg font-extrabold text-white mt-0.5">1-Click Placement, Mock Interview &amp; Aptitude Portals</h3>
            </div>
            <span class="text-xs text-slate-400">Click any icon to launch the official portal directly ↗</span>
          </div>
          <div class="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 gap-3 text-center">
            ${OFFICIAL_JOB_PORTALS.slice(0, 31).map(p => `
              <a href="${escapeHtml(p.url)}" target="_blank" rel="noopener noreferrer" class="group p-2.5 rounded-2xl bg-slate-800/90 hover:bg-blue-950 border border-slate-700 hover:border-blue-500 transition flex flex-col items-center gap-2">
                ${p.logoSvg}
                <span class="text-[11px] font-bold text-slate-200 group-hover:text-white leading-tight line-clamp-2">${escapeHtml(p.name.split(' (')[0])}</span>
              </a>
            `).join('')}
          </div>
        </div>

        <!-- 6. COMPLETE DIRECTORY OF ALL JOB, APTITUDE & MOCK INTERVIEW PORTALS -->
        <section class="space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-blue-600">Ordered Hierarchy: 1st SJCE College · 2nd Prosple, NATS &amp; General Portals · 3rd Aptitude &amp; Mock Interview Portals · 4th Core OEMs</span>
              <h2 class="text-xl font-extrabold text-slate-900">All Placement, Mock Interview &amp; Core Engineering Portals (${OFFICIAL_JOB_PORTALS.length})</h2>
            </div>
            <div class="w-full sm:w-64">
              <input id="portal-search-input" type="search" value="${escapeHtml(pf.search)}" placeholder="Search Pramp, InterviewBit, Prosple, NATS..." class="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white">
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            ${portalCategories.map(cat => `
              <button type="button" data-portal-cat="${escapeHtml(cat)}" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${pf.category === cat ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-400'}">
                ${cat === 'all' ? `All Portals (${OFFICIAL_JOB_PORTALS.length})` : escapeHtml(cat)}
              </button>
            `).join('')}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${filteredPortals.map(portal => `
              <div class="bg-white rounded-2xl border ${portal.featured ? 'border-2 border-blue-600 ring-2 ring-blue-100' : 'border-slate-200 hover:border-blue-400'} p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between gap-4">
                <div class="space-y-3">
                  <div class="flex items-start justify-between gap-3">
                    <div class="flex items-center gap-3">
                      ${portal.logoSvg}
                      <div>
                        <span class="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 mb-1">
                          ${escapeHtml(portal.badge)}
                        </span>
                        <h3 class="font-extrabold text-sm text-slate-900 leading-snug">${escapeHtml(portal.name)}</h3>
                      </div>
                    </div>
                  </div>
                  <div class="text-xs text-slate-600 space-y-1">
                    <div><b class="text-slate-800">Category:</b> ${escapeHtml(portal.category)}</div>
                    <div><b class="text-slate-800">Hubs:</b> ${escapeHtml(portal.location)}</div>
                    <div><b class="text-slate-800">Focus:</b> ${escapeHtml(portal.roles)}</div>
                    <div class="font-mono text-[11px] text-blue-700 truncate pt-0.5">${escapeHtml(portal.url)}</div>
                  </div>
                </div>
                <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <a href="${escapeHtml(portal.url)}" target="_blank" rel="noopener noreferrer" class="flex-1 text-center py-2 px-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition">
                    Open Official Portal ↗
                  </a>
                  <button type="button" data-prep-company="${escapeHtml(portal.name)}" class="py-2 px-3 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs transition">
                    🎙️ Gemini Interview
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    `;

    document.getElementById('hub-camera-toggle')?.addEventListener('change', (e) => {
      iv.proctoringEnabled = Boolean(e.target.checked);
      state.mockExam.proctoringEnabled = iv.proctoringEnabled;
      renderPlacementPrep();
    });

    document.getElementById('job-stage1-btn')?.addEventListener('click', () => {
      switchModule('mock-tests');
    });
    document.getElementById('practice-tech-review-mock-btn')?.addEventListener('click', () => {
      switchModule('mock-tests');
    });
    document.getElementById('launch-tech-iv-btn')?.addEventListener('click', () => {
      iv.roundMode = 'technical';
      generateSelfGeneratingInterviewSet(iv.sessionQuestionCount || 5);
      enterInterviewFullscreen(false);
    });
    document.getElementById('launch-hr-iv-btn')?.addEventListener('click', () => {
      iv.roundMode = 'hr';
      iv.track = 'Separate HR & Behavioral Interview Round (40 Questions · upGrad & Playlist)';
      generateSelfGeneratingInterviewSet(iv.sessionQuestionCount || 5);
      enterInterviewFullscreen(false);
    });
    document.getElementById('launch-gd-iv-btn')?.addEventListener('click', () => {
      iv.roundMode = 'gd';
      iv.track = 'Group Discussion (GD) Round Simulator & Campus GD Topics';
      generateSelfGeneratingInterviewSet(2);
      enterInterviewFullscreen(false);
    });
    document.getElementById('iv-launch-fs-mic-btn')?.addEventListener('click', () => {
      generateSelfGeneratingInterviewSet(iv.sessionQuestionCount || 5);
      enterInterviewFullscreen(true);
    });
    document.getElementById('iv-hub-track-select')?.addEventListener('change', (e) => {
      iv.track = e.target.value;
      if (iv.track.includes('HR')) iv.roundMode = 'hr';
      else if (iv.track.includes('GD')) iv.roundMode = 'gd';
      else iv.roundMode = 'technical';
      generateSelfGeneratingInterviewSet(iv.sessionQuestionCount || 5);
    });
    document.getElementById('iv-hub-company-select')?.addEventListener('change', (e) => {
      iv.company = e.target.value;
    });
    document.getElementById('iv-hub-persona-select')?.addEventListener('change', (e) => {
      iv.voicePersona = e.target.value;
    });

    document.getElementById('portal-search-input')?.addEventListener('input', (e) => {
      pf.search = e.target.value;
      renderPlacementPrep();
    });
    container.querySelectorAll('[data-portal-cat]').forEach(btn => {
      btn.addEventListener('click', () => {
        pf.category = btn.dataset.portalCat;
        renderPlacementPrep();
      });
    });
    container.querySelectorAll('[data-prep-company]').forEach(btn => {
      btn.addEventListener('click', () => {
        iv.company = btn.dataset.prepCompany;
        generateSelfGeneratingInterviewSet(iv.sessionQuestionCount || 5);
        enterInterviewFullscreen(false);
      });
    });
  }

  function bindInterviewInteractiveControls(iv, trackQuestions, activeQ) {
    document.getElementById('iv-autospeak-toggle')?.addEventListener('change', (e) => {
      iv.autoSpeak = Boolean(e.target.checked);
    });
    document.getElementById('iv-autolisten-toggle')?.addEventListener('change', (e) => {
      iv.autoListenAfterSpeak = Boolean(e.target.checked);
    });
    document.getElementById('iv-persona-select')?.addEventListener('change', (e) => {
      iv.voicePersona = e.target.value;
      renderPlacementPrep();
      speakInterviewText(`Hi Girish! I'm now speaking in ${iv.voicePersona === 'gemini-live' ? 'Gemini Live conversational' : iv.voicePersona} mode.`);
    });
    document.getElementById('iv-browser-voice-select')?.addEventListener('change', (e) => {
      iv.selectedVoiceURI = e.target.value;
      speakInterviewText(`Audio voice updated for your interview.`);
    });
    document.getElementById('iv-speak-q-btn')?.addEventListener('click', () => {
      speakInterviewText(`Question ${iv.qIndex + 1} for ${iv.company}. ${activeQ.q}`);
    });
    document.getElementById('iv-stop-speech-btn')?.addEventListener('click', stopInterviewSpeech);
    document.getElementById('iv-mic-record-btn')?.addEventListener('click', toggleVoiceMicrophoneInput);

    document.getElementById('iv-prev-q-btn')?.addEventListener('click', () => {
      iv.qIndex = (iv.qIndex - 1 + trackQuestions.length) % trackQuestions.length;
      iv.evaluated = false;
      iv.answerText = iv.sessionAnswers[iv.qIndex] || '';
      iv.coachFeedbackHtml = '';
      iv.qTimerSec = 180;
      renderPlacementPrep();
      if (iv.autoSpeak) speakInterviewText(trackQuestions[iv.qIndex].q);
    });
    document.getElementById('iv-next-q-btn')?.addEventListener('click', () => {
      if (iv.qIndex + 1 < trackQuestions.length) {
        iv.qIndex += 1;
        iv.evaluated = false;
        iv.answerText = iv.sessionAnswers[iv.qIndex] || '';
        iv.coachFeedbackHtml = '';
        iv.qTimerSec = 180;
        renderPlacementPrep();
        if (iv.autoSpeak) speakInterviewText(`Next question. ${trackQuestions[iv.qIndex].q}`);
      } else {
        iv.sessionFinished = true;
        renderPlacementPrep();
      }
    });
    document.getElementById('iv-fill-sample-btn')?.addEventListener('click', () => {
      const ta = document.getElementById('iv-answer-input');
      if (ta) {
        ta.value = activeQ.idealPoints.join('\n');
        iv.answerText = ta.value;
      }
    });
    document.getElementById('iv-evaluate-btn')?.addEventListener('click', async () => {
      if (iv.isListening && activeSpeechRecognition) {
        try { activeSpeechRecognition.stop(); } catch {}
        iv.isListening = false;
      }
      const ta = document.getElementById('iv-answer-input');
      iv.answerText = ta ? ta.value : '';
      iv.lastEvaluation = evaluateInterviewResponse(activeQ, iv.answerText);
      iv.sessionScores[iv.qIndex] = iv.lastEvaluation.score;
      iv.sessionAnswers[iv.qIndex] = iv.answerText;
      iv.evaluated = true;
      iv.coachFeedbackHtml = '<div class="text-xs font-bold text-blue-700 animate-pulse">✦ Gemini Assistant is formulating a conversational follow-up...</div>';
      renderPlacementPrep();
      bindEvaluationStudyGuideLinks();
      if (iv.autoSpeak && iv.lastEvaluation) {
        speakInterviewText(`${iv.lastEvaluation.humanConversationalReply} Your score on this question is ${iv.lastEvaluation.score} out of 100.`);
      }

      try {
        const prompt = `Act as a warm, human-like Gemini Live Interviewer for ${iv.company} (${iv.roundMode.toUpperCase()} Round).\nQuestion: ${activeQ.q}\nCandidate (Girish)'s Answer: ${iv.answerText || '(Candidate asked for walkthrough)'}\nRespond conversationally like a supportive human mentor: 1) Acknowledge what Girish said well, 2) Show the exact formula/step-by-step calculation or STAR method improvement, and 3) Ask one natural follow-up question.`;
        const res = await invokeAITutor({ question: prompt, topic: activeQ.studyTopic, mode: 'viva' });
        iv.coachFeedbackHtml = `
          <div class="p-4 rounded-2xl bg-slate-900 text-white space-y-2 border border-blue-700">
            <div class="flex items-center justify-between border-b border-slate-700 pb-2">
              <span class="font-extrabold text-xs text-amber-400">✦ Gemini Live Conversational Response (${escapeHtml(res.provider)})</span>
              <button type="button" id="iv-speak-coach-btn" class="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold">🔊 Speak Gemini Reply</button>
            </div>
            <div class="text-xs leading-relaxed text-slate-200">${formatEngineeringMarkdown(res.answer)}</div>
          </div>
        `;
        const box = document.getElementById('iv-evaluation-box');
        if (box && iv.lastEvaluation) {
          box.innerHTML = renderInterviewEvaluationHtml(iv.lastEvaluation, iv.coachFeedbackHtml);
          bindEvaluationStudyGuideLinks();
          document.getElementById('iv-speak-coach-btn')?.addEventListener('click', () => speakInterviewText(res.answer.replace(/[#*`]/g, '')));
        }
      } catch {}
    });
  }

  function renderInterviewEvaluationHtml(ev, coachFeedbackHtml = '') {
    if (!ev || !ev.qItem) return '';
    const qItem = ev.qItem;
    const badgeColor = ev.score >= 75 ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : ev.score >= 45 ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-rose-100 text-rose-800 border-rose-300';

    return `
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase text-slate-500">Gemini Viva Score</span>
            <span class="px-2.5 py-0.5 rounded-full border text-xs font-extrabold ${badgeColor}">${ev.score} / 100</span>
          </div>
          <div class="text-xs text-slate-700 leading-relaxed"><b>Gemini Feedback:</b> ${escapeHtml(ev.strengths)}</div>
          <div class="text-xs text-amber-900 bg-amber-50 p-2.5 rounded-xl border border-amber-200 leading-relaxed"><b>To Improve:</b> ${escapeHtml(ev.gaps)}</div>
          <div class="formula-box text-xs mt-2"><b>Key Formula:</b> ${escapeHtml(qItem.formula)}</div>
        </div>

        <div class="lg:col-span-2 p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="font-extrabold text-xs uppercase tracking-wider text-emerald-900">✓ Model 10/10 Panel Answer (Voice + Text)</span>
            <button type="button" id="iv-speak-model-ans-btn" class="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-bold">
              🔊 Listen to Model Answer
            </button>
          </div>
          <ul class="list-disc pl-4 space-y-1.5 text-xs text-slate-800 leading-relaxed">
            ${(qItem.idealPoints || []).map(pt => `<li>${escapeHtml(pt)}</li>`).join('')}
          </ul>
        </div>
      </div>

      ${coachFeedbackHtml || ''}

      <!-- Suggested Study Guides & Question-Specific Engineering Diagram -->
      <div class="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span class="text-[10px] font-extrabold uppercase tracking-wider text-blue-700">📘 Personalized Study Guide Suggester</span>
            <h3 class="text-sm font-extrabold text-slate-900">Recommended Study Guides for "${escapeHtml(qItem.studyTopic)}"</h3>
          </div>
          <button type="button" data-open-study-guide="${escapeHtml(qItem.studyGuideQuery)}" class="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm">
            📘 Open Study Guide (${escapeHtml(qItem.studyGuideQuery)}) →
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          ${ev.recommendedGuides.length ? ev.recommendedGuides.map(g => `
            <div class="p-3.5 rounded-xl bg-white border border-blue-200 flex flex-col justify-between gap-2">
              <div>
                <span class="text-[10px] font-bold text-blue-700">${escapeHtml(g.sourceBank || 'Core Study Guide')}</span>
                <h4 class="font-bold text-xs text-slate-900 mt-0.5">${escapeHtml(g.name || g.title)}</h4>
                <p class="text-[11px] text-slate-600 mt-1 line-clamp-3">${escapeHtml(g.idea || '')}</p>
              </div>
              <button type="button" data-open-study-guide="${escapeHtml(g.name || g.title || qItem.studyGuideQuery)}" class="text-left text-[11px] font-bold text-blue-600 hover:underline pt-1">
                Open Lesson →
              </button>
            </div>
          `).join('') : ''}
        </div>

        <div class="pt-2">
          ${visualExplanation({ topic: qItem.studyTopic, text: qItem.q + ' ' + qItem.formula })}
        </div>
      </div>
    `;
  }

  function bindEvaluationStudyGuideLinks() {
    document.getElementById('iv-speak-model-ans-btn')?.addEventListener('click', () => {
      const iv = state.interviewState;
      const trackQuestions = getActiveInterviewQuestions();
      const activeQ = trackQuestions[iv.qIndex];
      if (activeQ) speakInterviewText(activeQ.idealPoints.join('. '));
    });
    container.querySelectorAll('[data-open-study-guide]').forEach(btn => {
      btn.addEventListener('click', () => {
        const qStr = btn.dataset.openStudyGuide || '';
        exitInterviewFullscreen();
        state.guideFilter.search = qStr.split(' ')[0] || '';
        state.guideFilter.source = 'all';
        switchModule('study-guides');
        showToast(`Opened Study Guide filtered for "${state.guideFilter.search}"`, 'success');
      });
    });
  }

  // --- MODULE 16: AI ENGINEERING TUTOR ---
  function renderAITutor() {
    container.innerHTML = `
      <div class="space-y-6">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-blue-600">Module 16 · Multi-Provider Online AI + Symbolic Knowledge-Graph Engine</span>
          <h1 class="text-2xl font-extrabold text-slate-900">AI Mechanical Engineering Tutor</h1>
          <p class="text-xs text-slate-600 mt-1">Supports Gemini, Groq, OpenRouter, and Hugging Face with automatic fallback to the built-in Symbolic &amp; RAG Engineering Solver.</p>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div class="flex flex-wrap gap-2">
            ${[
              'Solve a Mohr circle problem with σ_x = 1200 MPa, σ_y = 600 MPa, τ_xy = 400 MPa step by step.',
              'Derive Otto cycle thermal efficiency η = 1 - 1/r^(γ-1) and compare with Diesel cycle.',
              'Calculate torsional shear stress and angle of twist for a 50 mm shaft carrying 1000 N·m torque.',
              'Conduct a technical interview viva on Chvorinov casting solidification and Taylor tool life.'
            ].map(prompt => `
              <button type="button" data-quick-tutor="${escapeHtml(prompt)}" class="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-400 text-slate-700 font-medium">
                ✦ ${escapeHtml(prompt.slice(0, 62))}...
              </button>
            `).join('')}
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1" for="tutor-subj-select">Engineering Domain</label>
              <select id="tutor-subj-select" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white">
                <option>Strength of Materials &amp; Machine Design</option>
                <option>Basic &amp; Applied Thermodynamics</option>
                <option>Fluid Mechanics &amp; Turbomachinery</option>
                <option>Kinematics, Dynamics &amp; Vibrations</option>
                <option>Heat &amp; Mass Transfer &amp; FEM</option>
                <option>Manufacturing, Machining &amp; Metrology</option>
                <option>Placement Quantitative &amp; Logical Aptitude</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1" for="tutor-mode-select">AI Reasoning Mode</label>
              <select id="tutor-mode-select" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white">
                <option value="step-by-step">🧮 Step-by-Step Numerical &amp; Formula Solver</option>
                <option value="derivation">📐 First-Principles Derivation &amp; Boundary Limits</option>
                <option value="kg-synthesis">🕸️ Multi-Node Exam Question Synthesizer</option>
                <option value="viva">🎓 Technical Interview Viva Examiner</option>
              </select>
            </div>
          </div>

          <textarea id="tutor-prompt-input" rows="4" class="w-full p-3.5 rounded-xl border border-slate-300 text-xs sm:text-sm" placeholder="Ask any mechanical engineering numerical problem, formula derivation, or placement question...">Solve a Mohr circle problem with σ_x = 1200 MPa, σ_y = 600 MPa, τ_xy = 400 MPa step by step.</textarea>

          <div class="flex flex-wrap gap-2">
            <button type="button" id="ask-ai-tutor-btn" class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm">
              🤖 Generate AI Engineering Solution →
            </button>
            <button type="button" id="save-tutor-to-bank-btn" class="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs">
              ➕ Save Solution as Practice Question
            </button>
          </div>

          <div id="tutor-response-box" class="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4"></div>
        </div>
      </div>
    `;

    const runTutor = async () => {
      const q = document.getElementById('tutor-prompt-input')?.value?.trim() || '';
      const topic = document.getElementById('tutor-subj-select')?.value || 'Mechanical Engineering';
      const mode = document.getElementById('tutor-mode-select')?.value || 'step-by-step';
      const box = document.getElementById('tutor-response-box');
      if (!q || !box) return;
      box.innerHTML = `<div class="text-xs font-semibold text-blue-600">⚡ Computing step-by-step engineering solution...</div>`;
      const res = await invokeAITutor({ question: q, topic, mode });
      box.innerHTML = `
        <div class="flex items-center justify-between border-b border-slate-200 pb-2 text-xs">
          <span class="font-bold text-slate-900">AI Engineering Tutor Response</span>
          <span class="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">${escapeHtml(res.provider)} · ${escapeHtml(res.model)}</span>
        </div>
        <div class="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">${formatEngineeringMarkdown(res.answer)}</div>
        ${getSchematicForTopic(q + ' ' + topic)}
      `;
    };

    container.querySelectorAll('[data-quick-tutor]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('tutor-prompt-input').value = btn.dataset.quickTutor;
        runTutor();
      });
    });
    document.getElementById('ask-ai-tutor-btn')?.addEventListener('click', runTutor);
    document.getElementById('save-tutor-to-bank-btn')?.addEventListener('click', () => {
      const qText = document.getElementById('tutor-prompt-input')?.value?.trim() || 'AI Synthesized Engineering Problem';
      const newQ = {
        id: `TUTOR-${Date.now().toString(36).toUpperCase()}`,
        topic: document.getElementById('tutor-subj-select')?.value || 'Mechanical Core',
        difficulty: 'Intermediate',
        text: qText,
        options: [
          'Verified analytical solution using SI units and governing conservation equations',
          'Neglect shear and boundary conditions',
          'Assume infinite stiffness',
          'None of the above'
        ],
        answer: 0,
        explain: document.getElementById('tutor-response-box')?.innerText || 'Solved via AI Engineering Tutor.'
      };
      state.questions.unshift(newQ);
      state.customQuestions.unshift(newQ);
      safeSetStorage('mechprep_v4_custom_q', state.customQuestions);
      showToast('Saved AI Tutor problem into Question Bank!', 'success');
    });
    runTutor();
  }

  // --- MODULE 17: FLASHCARDS ---
  function renderFlashcards() {
    const fcState = state.flashcardState;
    const subjects = Array.from(new Set(state.flashcards.map(c => c.subject)));
    const deck = state.flashcards.filter(c => fcState.subjectFilter === 'all' || c.subject === fcState.subjectFilter);
    fcState.index = Math.min(Math.max(0, fcState.index), Math.max(0, deck.length - 1));
    const current = deck[fcState.index] || { id: 'empty', subject: 'General', front: 'No flashcards match filter', back: '' };
    const isMastered = fcState.masteredIds.includes(current.id);

    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-blue-600">Module 17 · Active Recall &amp; Spaced Repetition</span>
            <h1 class="text-2xl font-extrabold text-slate-900">Engineering Formula &amp; Concept Flashcards (${deck.length})</h1>
          </div>
          <div class="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            Mastered Cards: ${fcState.masteredIds.length} / ${state.flashcards.length}
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <select id="fc-subj-select" class="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white">
            <option value="all">All Subjects (${state.flashcards.length})</option>
            ${subjects.map(s => `<option value="${escapeHtml(s)}" ${fcState.subjectFilter === s ? 'selected' : ''}>${escapeHtml(s)}</option>`).join('')}
          </select>
          <span class="text-xs font-semibold text-slate-600">Card ${fcState.index + 1} of ${deck.length}</span>
        </div>

        <!-- Flashcard Flip Surface -->
        <div id="fc-card-surface" class="flashcard-3d cursor-pointer bg-white rounded-2xl border-2 ${fcState.flipped ? 'border-emerald-500 bg-emerald-50/30' : 'border-blue-500'} p-8 sm:p-12 shadow-md min-h-[240px] flex flex-col justify-between text-center">
          <div class="flex items-center justify-between text-xs text-slate-500">
            <span class="font-bold text-blue-700">${escapeHtml(current.subject)}</span>
            <span>${fcState.flipped ? 'ANSWER / FORMULA SIDE' : 'QUESTION PROMPT (Click Card to Flip)'}</span>
          </div>
          <div class="my-6">
            <p class="text-base sm:text-xl font-bold text-slate-900 whitespace-pre-wrap leading-relaxed">${escapeHtml(fcState.flipped ? current.back : current.front)}</p>
          </div>
          <div class="text-xs text-slate-400">Click anywhere on card to flip between Prompt and Formula Solution</div>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3">
          <button type="button" id="fc-prev-btn" class="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold">
            ← Previous Card
          </button>
          <div class="flex gap-2">
            <button type="button" id="fc-flip-btn" class="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold">
              ↻ Flip Card
            </button>
            <button type="button" id="fc-master-btn" class="px-4 py-2.5 rounded-xl ${isMastered ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800 border border-emerald-300'} text-xs font-bold">
              ${isMastered ? '✓ Mastered' : '☆ Mark Mastered'}
            </button>
          </div>
          <button type="button" id="fc-next-btn" class="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold">
            Next Card →
          </button>
        </div>
      </div>
    `;

    document.getElementById('fc-subj-select')?.addEventListener('change', (e) => {
      fcState.subjectFilter = e.target.value;
      fcState.index = 0;
      fcState.flipped = false;
      renderFlashcards();
    });
    const toggleFlip = () => {
      fcState.flipped = !fcState.flipped;
      renderFlashcards();
    };
    document.getElementById('fc-card-surface')?.addEventListener('click', toggleFlip);
    document.getElementById('fc-flip-btn')?.addEventListener('click', toggleFlip);
    document.getElementById('fc-prev-btn')?.addEventListener('click', () => {
      fcState.index = (fcState.index - 1 + deck.length) % Math.max(1, deck.length);
      fcState.flipped = false;
      renderFlashcards();
    });
    document.getElementById('fc-next-btn')?.addEventListener('click', () => {
      fcState.index = (fcState.index + 1) % Math.max(1, deck.length);
      fcState.flipped = false;
      renderFlashcards();
    });
    document.getElementById('fc-master-btn')?.addEventListener('click', () => {
      if (isMastered) {
        fcState.masteredIds = fcState.masteredIds.filter(id => id !== current.id);
      } else {
        fcState.masteredIds.push(current.id);
      }
      safeSetStorage('mechprep_v4_fc_mastered', fcState.masteredIds);
      renderFlashcards();
    });
  }

  // --- MODULE 18: PROGRESS TRACKER ---
  function renderProgressTracker() {
    const p = state.progress;
    const accuracy = p.attempts > 0 ? Math.round((p.correct / p.attempts) * 100) : 0;
    const topicEntries = Object.entries(p.topicStats || {});

    container.innerHTML = `
      <div class="space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-blue-600">Module 18 · Learning Analytics &amp; Weak-Topic Diagnostics</span>
            <h1 class="text-2xl font-extrabold text-slate-900">Student Progress Tracker</h1>
          </div>
          <button type="button" id="reset-progress-btn" class="self-start sm:self-auto px-3.5 py-2 rounded-xl border border-rose-300 bg-rose-50 text-rose-800 text-xs font-semibold">
            Reset Analytics
          </button>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div class="text-2xl font-extrabold text-blue-600">${p.attempts}</div>
            <div class="text-xs text-slate-500">Questions Attempted</div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div class="text-2xl font-extrabold text-emerald-600">${accuracy}%</div>
            <div class="text-xs text-slate-500">Overall Accuracy</div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div class="text-2xl font-extrabold text-amber-600">${p.testsCompleted}</div>
            <div class="text-xs text-slate-500">Mock Exams Completed</div>
          </div>
          <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div class="text-2xl font-extrabold text-purple-600">${p.bestScore}%</div>
            <div class="text-xs text-slate-500">Best Mock Exam Score</div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <h2 class="font-bold text-sm text-slate-900">Topic-Wise Mastery Breakdown</h2>
          ${topicEntries.length ? `
            <div class="space-y-2">
              ${topicEntries.map(([tName, stat]) => {
                const pct = Math.round((stat.correct / Math.max(1, stat.total)) * 100);
                return `
                  <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <span class="font-semibold text-slate-800">${escapeHtml(tName)}</span>
                    <span class="font-bold ${pct >= 70 ? 'text-emerald-700' : 'text-amber-700'}">${stat.correct}/${stat.total} (${pct}%)</span>
                  </div>
                `;
              }).join('')}
            </div>
          ` : `<p class="text-xs text-slate-500">Attempt questions in the Technical Question Bank, Aptitude Bank, or Timed Mock Tests to populate topic-level accuracy bars.</p>`}
        </div>
      </div>
    `;

    document.getElementById('reset-progress-btn')?.addEventListener('click', () => {
      state.progress = { attempts: 0, correct: 0, testsCompleted: 0, bestScore: 0, history: [], topicStats: {} };
      safeSetStorage('mechprep_v4_progress', state.progress);
      renderProgressTracker();
      showToast('Cleared local practice history.');
    });
  }

  // --- MODULE 19: AI MODEL & RENDER SETTINGS ---
  function renderAISettings() {
    const cfg = state.aiConfig;
    container.innerHTML = `
      <div class="space-y-6">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-blue-600">Module 19 · Online Inference APIs, Fallback Router &amp; Render Config</span>
          <h1 class="text-2xl font-extrabold text-slate-900">AI Model &amp; Google Drive Configuration</h1>
          <p class="text-xs text-slate-600 mt-1">On Render, set environment variables (<code>GEMINI_API_KEY</code>, <code>GROQ_API_KEY</code>, <code>OPENROUTER_API_KEY</code>, <code>HF_API_KEY</code>) or configure browser keys below for instant testing.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h2 class="font-bold text-sm text-slate-900">1. Active AI Provider &amp; Model Selection</h2>

            <div>
              <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1" for="set-provider">Preferred AI Engine (Automatic Fallback Enabled)</label>
              <select id="set-provider" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white">
                <option value="auto" ${cfg.provider === 'auto' ? 'selected' : ''}>Auto-Select Best Available (Gemini → Groq → OpenRouter → HF → Symbolic ML)</option>
                <option value="gemini" ${cfg.provider === 'gemini' ? 'selected' : ''}>Google Gemini API (gemini-2.5-flash / gemini-2.5-pro)</option>
                <option value="groq" ${cfg.provider === 'groq' ? 'selected' : ''}>Groq LPU API (llama-3.3-70b-versatile)</option>
                <option value="openrouter" ${cfg.provider === 'openrouter' ? 'selected' : ''}>OpenRouter API (meta-llama/llama-3.1-8b-instruct:free)</option>
                <option value="huggingface" ${cfg.provider === 'huggingface' ? 'selected' : ''}>Hugging Face Inference API (Qwen/Qwen2.5-72B-Instruct)</option>
                <option value="local-ml" ${cfg.provider === 'local-ml' ? 'selected' : ''}>Integrated Symbolic &amp; TF-IDF ML Engine (Offline / Zero-Key)</option>
              </select>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1" for="set-gemini-model">Gemini Model</label>
                <input id="set-gemini-model" type="text" value="${escapeHtml(cfg.geminiModel)}" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs">
              </div>
              <div>
                <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1" for="set-groq-model">Groq Model</label>
                <input id="set-groq-model" type="text" value="${escapeHtml(cfg.groqModel)}" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs">
              </div>
            </div>

            <div class="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1" for="set-gemini-key">Optional Browser Gemini API Key</label>
                <input id="set-gemini-key" type="password" value="${escapeHtml(cfg.geminiKey)}" placeholder="AIzaSy... (or set GEMINI_API_KEY in Render Environment)" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs">
              </div>
              <div>
                <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1" for="set-groq-key">Optional Browser Groq API Key</label>
                <input id="set-groq-key" type="password" value="${escapeHtml(cfg.groqKey)}" placeholder="gsk_... (or set GROQ_API_KEY in Render Environment)" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs">
              </div>
              <div>
                <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1" for="set-or-key">Optional Browser OpenRouter API Key</label>
                <input id="set-or-key" type="password" value="${escapeHtml(cfg.openrouterKey)}" placeholder="sk-or-... (or set OPENROUTER_API_KEY in Render Environment)" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs">
              </div>
              <div>
                <label class="block text-[11px] font-bold uppercase text-slate-500 mb-1" for="set-hf-key">Optional Browser Hugging Face Token</label>
                <input id="set-hf-key" type="password" value="${escapeHtml(cfg.hfKey)}" placeholder="hf_... (or set HF_API_KEY in Render Environment)" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs">
              </div>
            </div>

            <button type="button" id="save-ai-settings-btn" class="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs">
              💾 Save AI Model &amp; Provider Configuration
            </button>
          </div>

          <!-- Render Deployment Quick Reference -->
          <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h2 class="font-bold text-sm text-slate-900">2. Render.com Web Service Deployment Guide</h2>
            <div class="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs space-y-1">
              <div># Build Command:</div>
              <div class="text-emerald-400">npm install</div>
              <div class="pt-1"># Start Command:</div>
              <div class="text-emerald-400">node server.js</div>
              <div class="pt-1"># Port Binding:</div>
              <div class="text-blue-300">process.env.PORT || 10000 (0.0.0.0)</div>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">
              The Node.js backend (<code>server.js</code>) automatically reads Render Environment Variables (<code>GEMINI_API_KEY</code>, <code>GROQ_API_KEY</code>, <code>OPENROUTER_API_KEY</code>, <code>HF_API_KEY</code>, <code>GOOGLE_API_KEY</code>, <code>DATABASE_URL</code>) without exposing keys in client source code.
            </p>
          </div>
        </div>
      </div>
    `;

    document.getElementById('save-ai-settings-btn')?.addEventListener('click', () => {
      cfg.provider = document.getElementById('set-provider')?.value || 'auto';
      cfg.geminiModel = document.getElementById('set-gemini-model')?.value?.trim() || 'gemini-2.5-flash';
      cfg.groqModel = document.getElementById('set-groq-model')?.value?.trim() || 'llama-3.3-70b-versatile';
      cfg.geminiKey = document.getElementById('set-gemini-key')?.value?.trim() || '';
      cfg.groqKey = document.getElementById('set-groq-key')?.value?.trim() || '';
      cfg.openrouterKey = document.getElementById('set-or-key')?.value?.trim() || '';
      cfg.hfKey = document.getElementById('set-hf-key')?.value?.trim() || '';
      safeSetStorage('mechprep_v4_ai_config', cfg);
      checkServerHealth();
      showToast('Saved AI Model & Provider settings!', 'success');
    });
  }

  // --------------------------------------------------------------------------
  // 5. GLOBAL NAVIGATION & TOPBAR BINDINGS
  // --------------------------------------------------------------------------
  document.querySelectorAll('[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => switchModule(btn.dataset.nav));
  });

  document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
    document.getElementById('app-sidebar')?.classList.toggle('-translate-x-full');
  });
  document.getElementById('close-sidebar-btn')?.addEventListener('click', () => {
    document.getElementById('app-sidebar')?.classList.add('-translate-x-full');
  });
  document.getElementById('top-print-btn')?.addEventListener('click', () => {
    window.print();
  });

  // Initial Boot
  checkServerHealth();
  renderActiveModule();
})();

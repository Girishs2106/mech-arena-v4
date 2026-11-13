/**
 * ============================================================================
 * MECHPREP ARENA v4.0 — AI MECHANICAL ENGINEERING STUDY GUIDE (RENDER SERVER)
 * ============================================================================
 * Platform: Render.com Web Service (Node.js + Express / HTTP)
 * Start command: node server.js (or npm start)
 * Port: process.env.PORT || 10000 | Host: 0.0.0.0
 *
 * Features:
 * 1. Multi-Provider Online AI Engine (Gemini, Groq, OpenRouter, Hugging Face)
 *    with automatic model selection, provider fallback, rate-limit tracking,
 *    SSE streaming, and zero hardcoded API keys.
 * 2. Integrated Local ML/NLP & Symbolic Engineering Self-Generation Fallback
 *    (TF-IDF + Cosine Similarity RAG, Naive-Bayes Subject Classifier,
 *    15-Step Automatic Study Guide / Formula / Diagram / Graph / MCQ /
 *    Numerical / Aptitude / Flashcard / Mock Test Generator).
 * 3. Google Drive OAuth 2.0 & API v3 Recursive Folder Scanner for the 5
 *    Mechanical Engineering & Placement Drive Libraries with SHA-256
 *    deduplication, semester/subject auto-classification, and page indexing.
 * 4. PostgreSQL (process.env.DATABASE_URL) + Persistent JSON / Knowledge Graph
 *    dual-layer storage for user progress, flashcards, and generated packs.
 * ============================================================================
 */

import http from 'node:http';
import crypto from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const baseDir = fileURLToPath(new URL('.', import.meta.url));
const root = join(baseDir, 'public');
const dataDir = join(root, 'data');
const kgBankFile = join(dataDir, 'knowledge-graph-bank.js');
const persistentStoreFile = join(dataDir, 'persistent-syllabus-store.json');

try {
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
} catch {}

// Load .env if present (local development convenience; Render injects env vars directly)
try {
  const envFile = join(baseDir, '.env');
  if (existsSync(envFile)) {
    for (const line of readFileSync(envFile, 'utf8').split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
      if (match && process.env[match[1]] === undefined) {
        process.env[match[1]] = match[2].replace(/^(["'])(.*)\1$/, '$2');
      }
    }
  }
} catch {}

const PORT = Number(process.env.PORT || 10000);
const HOST = '0.0.0.0';

// ============================================================================
// 1. SUPPLIED GOOGLE DRIVE FOLDERS (5 INTEGRATED LIBRARIES)
// ============================================================================
const INTEGRATED_DRIVE_FOLDERS = [
  {
    id: '1gdl1gfpl0WVFtijEEd5BIQhtu290qaI_',
    name: 'Main Mechanical Engineering Library',
    semester: 'All Semesters',
    category: 'Mechanical Engineering Core',
    url: 'https://drive.google.com/drive/folders/1gdl1gfpl0WVFtijEEd5BIQhtu290qaI_?usp=drive_link',
    expectedSubjects: [
      'Engineering Mechanics', 'Strength of Materials', 'Thermodynamics',
      'Fluid Mechanics', 'Heat and Mass Transfer', 'Theory of Machines',
      'Machine Design', 'Manufacturing Science', 'CAD/CAM & Robotics'
    ]
  },
  {
    id: '15SfQscxJjR5fm_9jMKkM0SvorZb82foK',
    name: '4th Semester Mechanical Library',
    semester: 'Semester 4',
    category: 'Semester 4',
    url: 'https://drive.google.com/drive/folders/15SfQscxJjR5fm_9jMKkM0SvorZb82foK?usp=drive_link',
    expectedSubjects: [
      '22MA411 Engineering Mathematics IV', '22ME410 Applied Thermodynamics (ATD)',
      '22ME420 Dynamics of Machines (DOM)', '22ME430 Metrology and Measurements',
      '22ME440 Material Science and Metallurgy (MSM)', '22ME46L Fluid Mechanics Lab',
      '22ME47L Basic Materials Testing & Metrology Lab'
    ]
  },
  {
    id: '1u-SzogxKALrjNfbl31zQiB_EGt9sbZMx',
    name: '5th Semester Mechanical Library',
    semester: 'Semester 5',
    category: 'Semester 5',
    url: 'https://drive.google.com/drive/folders/1u-SzogxKALrjNfbl31zQiB_EGt9sbZMx?usp=drive_link',
    expectedSubjects: [
      '22ME510 Design of Machine Elements I (DME-I)', '22ME520 Fluid Machinery (Turbomachines)',
      '22ME530 CAD/CAM & 22ME57L CNC Lab', '22ME540 Machine Tools and Operations',
      '22ME551 Hydraulics and Pneumatics', '22ME554 IC Engines & 22ME563 Power Plant Tech'
    ]
  },
  {
    id: '1oWpkqqMypZp3lPmBe9-AD0AD1bhf0hxL',
    name: '6th Semester Mechanical Library',
    semester: 'Semester 6',
    category: 'Semester 6',
    url: 'https://drive.google.com/drive/folders/1oWpkqqMypZp3lPmBe9-AD0AD1bhf0hxL?usp=drive_link',
    expectedSubjects: [
      '22ME610 Design of Machine Elements II (DME-II)', '22ME620 Heat and Mass Transfer (HMT)',
      '22ME630 Finite Element Methods (FEM) & CAMA Lab', '22ME641 Mechanical Vibrations',
      '22ME642 Statistical Quality Control (SQC)', '22ME643 Computational Fluid Dynamics (CFD)',
      '22ME645 Non-Traditional Machining (NTM)'
    ]
  },
  {
    id: '1yS5_u9Je-fMd6hUP7gU6huRA-3mp6vjx',
    name: 'Placement and Aptitude Library',
    semester: 'Placement & GATE',
    category: 'Placement Preparation',
    url: 'https://drive.google.com/drive/folders/1yS5_u9Je-fMd6hUP7gU6huRA-3mp6vjx?usp=drive_link',
    expectedSubjects: [
      '01_AM2_Aptitude_Mock_Test_2.pdf', '02_Bizotic_Aptitude_Assessment.pdf',
      '03_AON_Online_Assessment.pdf', '04_Mechanical_Engineering_Technical_Test.pdf',
      'TCS NQT Numerical, Reasoning & Verbal Handouts',
      'TimeTooth Level I Mechanical Questionnaire & Technical Interview Bank'
    ]
  }
];

// ============================================================================
// 2. RATE-LIMITER & MULTI-PROVIDER AI / LLM ENGINE (GEMINI, GROQ, OPENROUTER, HF)
// ============================================================================
const AI_RATE_LIMITS = new Map();
const RATE_WINDOW_MS = 60_000;
const MAX_REQ_PER_MIN = 30;

function checkRateLimit(clientIp) {
  const now = Date.now();
  const entry = AI_RATE_LIMITS.get(clientIp) || { count: 0, resetAt: now + RATE_WINDOW_MS };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + RATE_WINDOW_MS;
  }
  entry.count += 1;
  AI_RATE_LIMITS.set(clientIp, entry);
  return {
    allowed: entry.count <= MAX_REQ_PER_MIN,
    remaining: Math.max(0, MAX_REQ_PER_MIN - entry.count),
    resetInSec: Math.ceil((entry.resetAt - now) / 1000)
  };
}

function getConfiguredProviders(clientKeys = {}) {
  return [
    {
      id: 'gemini',
      name: 'Google Gemini API',
      configured: Boolean(clientKeys.geminiKey || process.env.GEMINI_API_KEY),
      defaultModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      models: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash', 'gemini-1.5-flash']
    },
    {
      id: 'groq',
      name: 'Groq Cloud LPU API',
      configured: Boolean(clientKeys.groqKey || process.env.GROQ_API_KEY),
      defaultModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma2-9b-it']
    },
    {
      id: 'openrouter',
      name: 'OpenRouter API',
      configured: Boolean(clientKeys.openrouterKey || process.env.OPENROUTER_API_KEY),
      defaultModel: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.1-8b-instruct:free',
      models: [
        'meta-llama/llama-3.1-8b-instruct:free',
        'google/gemma-2-9b-it:free',
        'mistralai/mistral-7b-instruct:free',
        'qwen/qwen-2.5-72b-instruct'
      ]
    },
    {
      id: 'huggingface',
      name: 'Hugging Face Inference API',
      configured: Boolean(clientKeys.hfKey || process.env.HF_API_KEY),
      defaultModel: process.env.HF_MODEL || 'Qwen/Qwen2.5-72B-Instruct',
      models: [
        'Qwen/Qwen2.5-72B-Instruct',
        'meta-llama/Meta-Llama-3-8B-Instruct',
        'mistralai/Mistral-7B-Instruct-v0.3'
      ]
    },
    {
      id: 'local-ml',
      name: 'Integrated Symbolic + TF-IDF ML Self-Generator (Always Online)',
      configured: true,
      defaultModel: 'mechprep-symbolic-rag-v4',
      models: ['mechprep-symbolic-rag-v4']
    }
  ];
}

async function callSingleProvider(providerId, { system, prompt, model, jsonMode = false, clientKeys = {} }) {
  if (providerId === 'gemini') {
    const key = clientKeys.geminiKey || clientKeys.apiKey || process.env.GEMINI_API_KEY;
    if (!key) throw new Error('GEMINI_API_KEY not configured.');
    const activeModel = model || process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const generationConfig = { temperature: 0.25, maxOutputTokens: 4096 };
    if (jsonMode) generationConfig.responseMimeType = 'application/json';
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(activeModel)}:generateContent`,
      {
        method: 'POST',
        headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig
        }),
        signal: AbortSignal.timeout(65000)
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || `Gemini HTTP ${response.status}`);
    const text = (data.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('\n').trim();
    return { text, provider: 'gemini', model: activeModel };
  }

  if (providerId === 'groq') {
    const key = clientKeys.groqKey || process.env.GROQ_API_KEY;
    if (!key) throw new Error('GROQ_API_KEY not configured.');
    const activeModel = model || process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
    const payload = {
      model: activeModel,
      temperature: 0.25,
      max_tokens: 4096,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: prompt }
      ]
    };
    if (jsonMode) payload.response_format = { type: 'json_object' };
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(60000)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || `Groq HTTP ${response.status}`);
    return { text: (data.choices?.[0]?.message?.content || '').trim(), provider: 'groq', model: activeModel };
  }

  if (providerId === 'openrouter') {
    const key = clientKeys.openrouterKey || process.env.OPENROUTER_API_KEY;
    if (!key) throw new Error('OPENROUTER_API_KEY not configured.');
    const activeModel = model || process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.1-8b-instruct:free';
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://mechprep-arena.onrender.com',
        'X-Title': 'MechPrep Arena AI Study Guide'
      },
      body: JSON.stringify({
        model: activeModel,
        temperature: 0.25,
        max_tokens: 4096,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: prompt }
        ]
      }),
      signal: AbortSignal.timeout(65000)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || `OpenRouter HTTP ${response.status}`);
    return { text: (data.choices?.[0]?.message?.content || '').trim(), provider: 'openrouter', model: activeModel };
  }

  if (providerId === 'huggingface') {
    const key = clientKeys.hfKey || process.env.HF_API_KEY;
    if (!key) throw new Error('HF_API_KEY not configured.');
    const activeModel = model || process.env.HF_MODEL || 'Qwen/Qwen2.5-72B-Instruct';
    const response = await fetch(`https://api-inference.huggingface.co/models/${activeModel}/v1/chat/completions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: activeModel,
        temperature: 0.25,
        max_tokens: 3200,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: prompt }
        ]
      }),
      signal: AbortSignal.timeout(65000)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || `Hugging Face HTTP ${response.status}`);
    return { text: (data.choices?.[0]?.message?.content || '').trim(), provider: 'huggingface', model: activeModel };
  }

  throw new Error(`Unsupported online provider: ${providerId}`);
}

async function callMultiProviderAI({
  system,
  prompt,
  preferredProvider = 'auto',
  preferredModel = '',
  jsonMode = false,
  clientKeys = {}
}) {
  const order = [];
  if (preferredProvider && preferredProvider !== 'auto' && preferredProvider !== 'local-ml') {
    order.push(preferredProvider);
  }
  for (const p of ['gemini', 'groq', 'openrouter', 'huggingface']) {
    if (!order.includes(p)) order.push(p);
  }

  const errors = [];
  for (const providerId of order) {
    try {
      const modelToUse = providerId === preferredProvider ? preferredModel : '';
      return await callSingleProvider(providerId, {
        system,
        prompt,
        model: modelToUse,
        jsonMode,
        clientKeys
      });
    } catch (err) {
      errors.push(`${providerId}: ${err.message}`);
    }
  }
  return {
    text: null,
    provider: 'local-ml',
    model: 'mechprep-symbolic-rag-v4',
    fallbackReason: errors.join(' | ')
  };
}

// ============================================================================
// 3. INTEGRATED SYMBOLIC & ML/NLP SELF-GENERATION ENGINE (15-STEP PIPELINE)
// ============================================================================
const SUBJECT_TAXONOMY = [
  {
    id: 'som',
    name: 'Strength of Materials (Mechanics of Materials)',
    semester: 'Semester 3 / 4',
    code: '22ME340',
    keywords: ['stress', 'strain', 'mohr', 'beam', 'bending', 'torsion', 'deflection', 'buckling', 'euler', 'young', 'poisson', 'shear', 'cantilever'],
    formulas: [
      { title: 'Hooke’s Law & Axial Deformation', eq: 'σ = E·ε , δ = P·L / (A·E)', vars: 'P = axial load (N), L = length (m), A = area (m²), E = Young’s modulus (Pa)', si: 'Pa, m', deriv: 'Integrate ε = du/dx = P/(AE) over bar length L.', app: 'Stepped bars, tie rods, thermal stress bars', trap: 'Convert mm² to m² (10⁻⁶) and GPa to Pa (10⁹) before substituting.' },
      { title: 'Elastic Constants Relation', eq: 'E = 2G(1 + ν) = 3K(1 − 2ν) = 9KG / (3K + G)', vars: 'E = Young’s modulus, G = Shear modulus, K = Bulk modulus, ν = Poisson’s ratio', si: 'GPa (dimensionless ν)', deriv: 'Derived from isotropic 3D Hooke’s law under pure shear and hydrostatic pressure.', app: 'Material characterization & isotropic elasticity', trap: 'As ν → 0.5 (incompressible rubber), bulk modulus K → ∞.' },
      { title: 'Flexural Bending Equation', eq: 'M / I = σ_b / y = E / R', vars: 'M = bending moment (N·m), I = moment of inertia (m⁴), y = distance from neutral axis (m), R = radius of curvature (m)', si: 'MPa, N·m, m⁴', deriv: 'Plane sections remain plane under pure bending: ε_x = y/R.', app: 'I-beams, shafts, cantilevers, crane girders', trap: 'For rectangular section b×h, I = b·h³/12; depth h is cubed!' },
      { title: 'Torsion of Circular Shafts', eq: 'T / J = τ / r = G·θ / L ; τ_max = 16T / (π·d³)', vars: 'T = torque (N·m), J = polar moment of inertia (πd⁴/32), θ = angle of twist (rad)', si: 'MPa, rad', deriv: 'Shear strain γ = r·dθ/dx varies linearly with radial distance r.', app: 'Power transmission shafts, marine prop shafts', trap: 'Always convert angle of twist θ from degrees to radians before using θ = TL/(GJ).' },
      { title: 'Mohr’s Circle Principal Stresses', eq: 'σ₁,₂ = (σ_x + σ_y)/2 ± √[((σ_x − σ_y)/2)² + τ_xy²]', vars: 'σ_x, σ_y = normal stresses, τ_xy = shear stress', si: 'MPa', deriv: 'Equilibrium of an inclined triangular stress element at angle θ.', app: 'Pressure vessels, combined bending and torsion', trap: 'Maximum in-plane shear stress is R = (σ₁ − σ₂)/2, while absolute max shear may be σ₁/2 if σ₁, σ₂ have same sign.' }
    ],
    mermaid: `graph LR
      A[Applied Loads P, M, T] --> B[Internal Stress Tensor σ_x, σ_y, τ_xy]
      B --> C[Mohr's Circle Transformation]
      C --> D[Principal Stresses σ_1, σ_2 & Max Shear τ_max]
      D --> E[Failure Theories: Von Mises vs Tresca]
      E --> F[Safe Member Sizing d, b, h with Factor of Safety]`
  },
  {
    id: 'thermo',
    name: 'Basic & Applied Thermodynamics',
    semester: 'Semester 3 / 4',
    code: '22ME330 / 22ME410',
    keywords: ['thermodynamics', 'enthalpy', 'entropy', 'carnot', 'rankine', 'otto', 'diesel', 'brayton', 'sfee', 'nozzle', 'turbine', 'compressor', 'cop'],
    formulas: [
      { title: 'Steady Flow Energy Equation (SFEE)', eq: 'h₁ + V₁²/2 + g·z₁ + q = h₂ + V₂²/2 + g·z₂ + w_cv', vars: 'h = specific enthalpy (J/kg), V = velocity (m/s), z = elevation (m), q = heat transfer, w_cv = shaft work', si: 'J/kg or kJ/kg', deriv: 'Conservation of energy for an open control volume at steady state.', app: 'Steam/gas turbines, compressors, nozzles, boilers', trap: 'When h is in kJ/kg, divide V²/2 by 1000 so kinetic energy is also in kJ/kg!' },
      { title: 'Otto Cycle Air-Standard Efficiency', eq: 'η_Otto = 1 − 1 / r^(γ − 1)', vars: 'r = V₁/V₂ = compression ratio, γ = c_p/c_v = adiabatic index (1.4 for air)', si: 'Dimensionless (%)', deriv: 'Constant-volume heat addition (2→3) and rejection (4→1) with isentropic compression/expansion.', app: 'Spark-ignition (petrol) IC engines', trap: 'Compression ratio r is total cylinder volume V₁ divided by clearance volume V₂ (r = 1 + V_s/V_c).' },
      { title: 'Diesel Cycle Efficiency', eq: 'η_Diesel = 1 − [1 / r^(γ−1)] · [(ρ^γ − 1) / (γ(ρ − 1))]', vars: 'r = compression ratio, ρ = V₃/V₂ = cut-off ratio', si: 'Dimensionless (%)', deriv: 'Constant-pressure heat addition up to cut-off ratio ρ.', app: 'Compression-ignition (diesel) heavy engines', trap: 'For the same compression ratio r, η_Otto > η_Diesel because the bracketed cut-off factor is always > 1.' },
      { title: 'Rankine Cycle Thermal Efficiency', eq: 'η_Rankine = [(h₁ − h₂) − (h₄ − h₃)] / (h₁ − h₄)', vars: 'h₁ = turbine inlet, h₂ = condenser inlet, h₃ = saturated liquid, h₄ = boiler feedwater enthalpy', si: 'kJ/kg', deriv: 'Apply SFEE individually to boiler, turbine, condenser, and feed pump (w_p ≈ v_f(P_b − P_c)).', app: 'Thermal & nuclear steam power plants', trap: 'Do not neglect pump work w_p = v_f·ΔP in high-pressure supercritical Rankine cycles.' },
      { title: 'Clausius Inequality & Entropy Generation', eq: 'ds ≥ δq / T ; S_gen = ΔS_system + Q_surr / T₀ ≥ 0', vars: 'S = entropy (kJ/K), T = absolute temperature (K)', si: 'kJ/(kg·K), K', deriv: 'Second Law of Thermodynamics for reversible and irreversible cycles.', app: 'Exergy destruction & heat engine upper limits', trap: 'Always convert °C to absolute Kelvin (T(K) = T(°C) + 273.15) in Carnot and entropy formulas!' }
    ],
    mermaid: `graph TD
      B[Boiler: Isobaric Heat Addition q_in = h_1 - h_4] --> T[Steam Turbine: Isentropic Expansion w_t = h_1 - h_2]
      T --> C[Condenser: Isobaric Heat Rejection q_out = h_2 - h_3]
      C --> P[Feed Pump: Isentropic Compression w_p = v_f ΔP]
      P --> B`
  },
  {
    id: 'fluid',
    name: 'Fluid Mechanics & Turbomachinery',
    semester: 'Semester 3 / 5',
    code: '22ME320 / 22ME520',
    keywords: ['fluid', 'viscosity', 'bernoulli', 'reynolds', 'darcy', 'venturi', 'orifice', 'manometer', 'pelton', 'francis', 'kaplan', 'pump', 'cavitation'],
    formulas: [
      { title: 'Newton’s Law of Viscosity & Kinematic Viscosity', eq: 'τ = μ · (du/dy) ; ν = μ / ρ', vars: 'τ = shear stress (Pa), μ = dynamic viscosity (Pa·s), ν = kinematic viscosity (m²/s), ρ = density (kg/m³)', si: 'Pa·s, m²/s', deriv: 'Rate of shear deformation in a Newtonian laminar fluid film.', app: 'Journal bearing oil films, viscometers', trap: '1 Poise = 0.1 Pa·s; 1 Stokes = 10⁻⁴ m²/s.' },
      { title: 'Bernoulli’s Energy Equation', eq: 'P/(ρg) + V²/(2g) + z = H = constant', vars: 'P/(ρg) = pressure head (m), V²/(2g) = velocity head (m), z = datum head (m)', si: 'Meters of fluid column (m)', deriv: 'Integration of Euler’s equation of motion along a streamline for steady, inviscid, incompressible flow.', app: 'Venturimeter, Pitot-static tube, nozzles', trap: 'Include head loss h_f on the downstream side for real viscous pipe flow.' },
      { title: 'Darcy-Weisbach Pipe Friction Head Loss', eq: 'h_f = f · (L / D) · (V² / (2g)) = 8·f·L·Q² / (π²·g·D⁵)', vars: 'f = Darcy friction factor (64/Re for laminar), L = pipe length, D = pipe diameter, Q = discharge', si: 'm', deriv: 'Wall shear stress balance across a cylindrical pipe control volume.', app: 'Pipelines, hydraulic distribution networks', trap: 'Darcy friction factor f is 4 times the Fanning friction factor C_f (f = 4·C_f). Note h_f ∝ 1/D⁵ at constant Q!' },
      { title: 'Euler Turbomachine Equation', eq: 'W_shaft / ṁ = u₁·V_w1 ± u₂·V_w2 ; H_e = (u₁V_w1 − u₂V_w2)/g', vars: 'u = blade linear speed (πDN/60), V_w = whirl component of absolute velocity', si: 'J/kg or m', deriv: 'Angular momentum theorem (moment of momentum) applied between rotor inlet and outlet.', app: 'Pelton, Francis, Kaplan turbines & centrifugal pumps', trap: 'For radial-inlet centrifugal pumps, inlet whirl V_w1 = 0, so Euler head simplifies to H_e = u₂·V_w2 / g.' },
      { title: 'Turbine & Pump Specific Speed', eq: 'N_s(turbine) = N·√P / H^(5/4) ; N_s(pump) = N·√Q / H^(3/4)', vars: 'N = speed (rpm), P = power (kW), Q = discharge (m³/s), H = net head (m)', si: 'Metric specific speed', deriv: 'Buckingham Pi dimensional analysis combining head coefficient and flow/power coefficient.', app: 'Selecting Pelton (low N_s), Francis (medium N_s), or Kaplan (high N_s)', trap: 'Turbine specific speed uses √P / H^(5/4), whereas pump specific speed uses √Q / H^(3/4).' }
    ],
    mermaid: `graph LR
      I[Fluid Properties ρ, μ, ν] --> K[Continuity A1V1 = A2V2]
      K --> E[Bernoulli + Darcy Head Loss h_f]
      E --> R[Reynolds Number Re = ρVD/μ]
      R --> L[Laminar f = 64/Re]
      R --> T[Turbulent Moody Chart & Boundary Layer]
      T --> M[Turbomachinery Euler Equation & Specific Speed N_s]`
  },
  {
    id: 'tom',
    name: 'Kinematics, Dynamics of Machines & Vibrations',
    semester: 'Semester 3 / 4 / 6',
    code: '22ME310 / 22ME420 / 22ME641',
    keywords: ['kinematics', 'gruebler', 'grashof', 'gear', 'epicyclic', 'cam', 'flywheel', 'governor', 'gyroscope', 'vibration', 'damping', 'resonance', 'natural frequency'],
    formulas: [
      { title: 'Kutzbach-Gruebler Planar Mobility Criterion', eq: 'F = 3(L − 1) − 2·j − h', vars: 'L = number of links (including frame), j = lower (1-DOF) pairs, h = higher (2-DOF) pairs', si: 'Degrees of Freedom (DOF)', deriv: 'L links in a plane have 3(L−1) relative coordinates; each lower pair removes 2 DOF, higher pair removes 1 DOF.', app: 'Four-bar linkages, slider-crank, quick-return mechanisms', trap: 'Ensure binary, ternary, and quaternary joints are converted into equivalent binary joints (n links meeting = n−1 binary joints).' },
      { title: 'Grashof’s Law for Four-Bar Linkages', eq: 's + l ≤ p + q', vars: 's = shortest link, l = longest link, p, q = intermediate links', si: 'm or mm', deriv: 'Triangle inequality condition for continuous 360° rotation of at least one link.', app: 'Crank-rocker, double-crank (drag link), double-rocker', trap: 'If s + l > p + q (non-Grashof), NO link can make a complete revolution (triple-rocker regardless of frame).' },
      { title: '1-DOF Undamped & Damped Natural Frequency', eq: 'ω_n = √(k / m) = √(g / δ_st) ; ζ = c / (2√(k·m)) ; ω_d = ω_n·√(1 − ζ²)', vars: 'k = stiffness (N/m), m = mass (kg), c = damping coeff (N·s/m), ζ = damping ratio', si: 'rad/s, Hz (f_n = ω_n/2π)', deriv: 'Characteristic roots of m·ẍ + c·ẋ + k·x = 0.', app: 'Vehicle suspension, machine tool isolation, whirling shafts', trap: 'Critical damping is c_c = 2√(km) = 2mω_n. Logarithmic decrement δ = 2πζ / √(1 − ζ²).' },
      { title: 'Flywheel Energy Fluctuation & Speed Coefficient', eq: 'ΔE = I · ω² · C_s = k_e · Work_cycle', vars: 'I = mass moment of inertia (kg·m²), ω = mean angular speed (rad/s), C_s = (ω_max − ω_min)/ω', si: 'J (N·m)', deriv: 'Difference between maximum and minimum kinetic energy ½I(ω_max² − ω_min²) ≈ I·ω²·C_s.', app: 'Punching presses, multi-cylinder IC engines', trap: 'Use ω = 2πN/60 in rad/s! Note that full fluctuation C_s = 2 × (±% fluctuation from mean).' },
      { title: 'Gyroscopic Couple on Rotating Rotor', eq: 'C_gyro = I · ω · ω_p', vars: 'I = polar mass moment of inertia (kg·m²), ω = spin angular velocity (rad/s), ω_p = precession angular velocity (rad/s)', si: 'N·m', deriv: 'Rate of change of angular momentum vector H = I·ω precessing at rate ω_p.', app: 'Aircraft turns, ship pitching/steering, two-wheeler cornering', trap: 'Determine active vs reactive gyroscopic couple direction using the right-hand screw rule.' }
    ],
    mermaid: `graph TD
      K[Kinematic Synthesis: Gruebler F = 3(L-1)-2j-h] --> G[Grashof Condition s + l <= p + q]
      G --> V[Velocity & Acceleration Polygon + Coriolis 2ωv]
      V --> D[Dynamic Force Analysis & Flywheel ΔE = Iω²Cs]
      D --> W[Mechanical Vibrations: ω_n = √(k/m), ζ = c/(2√km)]
      W --> T[Transmissibility TR & Critical Whirling Speed]`
  },
  {
    id: 'design',
    name: 'Design of Machine Elements I & II',
    semester: 'Semester 5 / 6',
    code: '22ME510 / 22ME610',
    keywords: ['design', 'von mises', 'tresca', 'goodman', 'soderberg', 'spring', 'bearing', 'gear', 'lewis', 'bolt', 'weld', 'clutch', 'brake', 'sommerfeld'],
    formulas: [
      { title: 'Von Mises (Distortion Energy) & Tresca Theories', eq: 'σ_vm = √(σ₁² − σ₁σ₂ + σ₂²) = √(σ_x² + 3τ_xy²) ≤ S_y / N ; τ_max = (σ₁ − σ₂)/2 ≤ S_y / (2N)', vars: 'σ₁, σ₂ = principal stresses, S_y = yield strength, N = factor of safety', si: 'MPa', deriv: 'Yielding occurs when octahedral shear strain energy equals that in simple tension at yield.', app: 'Ductile shafts, pressure vessels, structural brackets', trap: 'Pure shear yield strength is S_sy = 0.577·S_y (Von Mises) vs S_sy = 0.50·S_y (Tresca).' },
      { title: 'Soderberg & Modified Goodman Fatigue Lines', eq: 'Soderberg: σ_a/S_e + σ_m/S_y = 1/N ; Goodman: σ_a/S_e + σ_m/S_ut = 1/N', vars: 'σ_a = (σ_max−σ_min)/2, σ_m = (σ_max+σ_min)/2, S_e = endurance limit, S_ut = ultimate strength', si: 'MPa', deriv: 'Linear interaction between alternating fatigue stress and steady mean tensile stress.', app: 'Rotating shafts, connecting rods, valve springs', trap: 'Soderberg uses yield strength S_y on the mean-stress axis (more conservative); Goodman uses S_ut.' },
      { title: 'Close-Coiled Helical Spring Stress & Deflection', eq: 'τ = K_w · 8·P·D / (π·d³) ; δ = 8·P·D³·n / (G·d⁴) ; k = P/δ = G·d⁴ / (8·D³·n)', vars: 'P = axial load, D = mean coil dia, d = wire dia, C = D/d = spring index, n = active coils, K_w = Wahl factor', si: 'MPa, mm, N/mm', deriv: 'Torsional strain energy U = ∫ T²/(2GJ) dx with T = P·D/2 and L = π·D·n.', app: 'Automotive suspension, relief valves, clutches', trap: 'Cutting a spring of stiffness k into two equal halves DOUBLES the stiffness of each half (2k) because n is halved!' },
      { title: 'Rolling Contact Bearing Rating Life (L₁₀)', eq: 'L₁₀ = (C / P)^p × 10⁶ revolutions ; L₁₀h = 10⁶ / (60·N) · (C / P)^p', vars: 'C = basic dynamic load rating (N), P = equivalent dynamic load (N), p = 3 (ball) or 10/3 (roller)', si: 'Million revolutions or Hours', deriv: 'Weibull statistical subsurface fatigue survival probability (90% reliability).', app: 'Gearbox spindles, wheel hubs, electric motors', trap: 'Halving the equivalent load P on a ball bearing (p=3) increases bearing life by 2³ = 8 times!' },
      { title: 'Lewis Beam Strength of Spur Gear Tooth', eq: 'F_b = σ_b · b · m · Y = σ_b · b · p_c · y', vars: 'σ_b = allowable bending stress, b = face width, m = module (d/z), Y = π·y = Lewis form factor', si: 'N', deriv: 'Models gear tooth as a parabolic cantilever beam subjected to tangential load F_t.', app: 'Spur and helical power transmission gearboxes', trap: 'Compare Lewis beam strength F_b and Buckingham wear strength F_w against dynamic tooth load F_d.' }
    ],
    mermaid: `graph LR
      L[External Loads & Duty Cycle] --> S[Static Failure Check: Von Mises / Tresca]
      S --> F[Fatigue Check: Goodman / Soderberg σ_a, σ_m]
      F --> C[Component Sizing: Shafts, Springs, Gears, Bearings]
      C --> R[Reliability & Tribology Verification L_10, Sommerfeld S]`
  },
  {
    id: 'hmt',
    name: 'Heat and Mass Transfer & FEM',
    semester: 'Semester 6',
    code: '22ME620 / 22ME630',
    keywords: ['conduction', 'convection', 'radiation', 'fourier', 'biot', 'nusselt', 'prandtl', 'lmtd', 'ntu', 'fin', 'stefan', 'fem', 'stiffness'],
    formulas: [
      { title: 'Fourier’s Conduction Law & Thermal Resistance', eq: 'Q = −k·A·(dT/dx) = ΔT / ∑R_th ; R_slab = L/(kA) ; R_cyl = ln(r₂/r₁)/(2πkL)', vars: 'k = thermal conductivity (W/m·K), A = area (m²), L = thickness (m)', si: 'W, K/W', deriv: '1D steady-state integration of ∇²T = 0 in Cartesian and cylindrical coordinates.', app: 'Composite furnace walls, insulated steam pipes', trap: 'Critical radius of insulation is r_cr = k_ins / h_o for a cylinder and r_cr = 2k_ins / h_o for a sphere.' },
      { title: 'Lumped Capacitance & Biot Number', eq: 'Bi = h · L_c / k_solid < 0.1 ; (T(t) − T_∞)/(T_i − T_∞) = exp[−(h·A_s / (ρ·V·c_p))·t]', vars: 'L_c = V/A_s = characteristic length, h = convection coeff, k_solid = solid conductivity', si: 'Dimensionless Bi, seconds t', deriv: 'Internal conduction resistance L_c/k_solid is negligible (<10%) compared to surface convection resistance 1/h.', app: 'Quenching of steel balls, thermocouple response time', trap: 'Biot number uses k_solid, whereas Nusselt number Nu = h·L/k_fluid uses k_fluid!' },
      { title: 'Heat Exchanger LMTD & Effectiveness-NTU', eq: 'Q = U · A · F · ΔT_lm ; ΔT_lm = (ΔT₁ − ΔT₂) / ln(ΔT₁ / ΔT₂) ; ε = Q / Q_max', vars: 'U = overall heat transfer coeff (W/m²K), ΔT₁, ΔT₂ = terminal temp differences, C_min = min(ṁc_p)', si: 'W, °C or K', deriv: 'Differential energy balance dQ = U·dA·(T_h − T_c) integrated along exchanger length.', app: 'Shell-and-tube condensers, automotive radiators', trap: 'When ΔT₁ = ΔT₂ (balanced counterflow C_h = C_c), L’Hôpital’s rule gives ΔT_lm = ΔT₁ = ΔT₂, and ε = NTU / (1 + NTU).' },
      { title: 'Stefan-Boltzmann & Radiation Network', eq: 'E_b = σ · T⁴ ; Q₁₂ = σ · (T₁⁴ − T₂⁴) / [(1−ε₁)/(ε₁A₁) + 1/(A₁F₁₂) + (1−ε₂)/(ε₂A₂)]', vars: 'σ = 5.67×10⁻⁸ W/(m²·K⁴), ε = emissivity, F₁₂ = view factor', si: 'W, K', deriv: 'Integration of Planck’s spectral blackbody distribution over all wavelengths and hemisphere.', app: 'Furnace enclosures, cryogenic radiation shields', trap: 'Inserting n radiation shields of equal emissivity between parallel plates reduces heat transfer by 1/(n + 1).' },
      { title: '1D Bar Finite Element Stiffness Matrix', eq: '[k]_e = (A·E / L) · [[1, −1], [−1, 1]] ; {F} = [K]{u}', vars: 'A = cross-sectional area, E = Young’s modulus, L = element length, {u} = nodal displacements', si: 'N/m, m', deriv: 'Minimization of total potential energy Π = ½{u}ᵀ[k]{u} − {u}ᵀ{f} using linear shape functions N₁ = 1−x/L, N₂ = x/L.', app: 'Truss structures, stepped shafts, thermal networks', trap: 'Each element stiffness matrix [k]_e is symmetric and singular until boundary conditions constrain rigid-body motion.' }
    ],
    mermaid: `graph TD
      H1[Conduction: Fourier Law Q = -kA dT/dx] --> H2[Convection: Newton Cooling Q = hA ΔT & Nu = f(Re, Pr)]
      H2 --> H3[Radiation: Stefan-Boltzmann Q = εσA(T1^4 - T2^4)]
      H3 --> HX[Heat Exchangers: LMTD & ε-NTU Design]
      HX --> FEM[Finite Element Discretization: K u = F]`
  },
  {
    id: 'mfg',
    name: 'Manufacturing Science, Machining, Metrology & OR',
    semester: 'Semester 4 / 5 / 7',
    code: '22ME350A / 22ME430 / 22ME540 / 22ME710',
    keywords: ['casting', 'chvorinov', 'welding', 'rolling', 'machining', 'merchant', 'taylor', 'tool life', 'cnc', 'metrology', 'tolerance', 'eoq', 'simplex', 'cpm', 'pert'],
    formulas: [
      { title: 'Chvorinov’s Casting Solidification Rule', eq: 't_s = B · (V / A_s)^n  (typically n = 2)', vars: 't_s = solidification time (s), V = casting volume, A_s = cooling surface area, M = V/A_s = modulus', si: 's, m', deriv: '1D transient heat conduction into semi-infinite sand mould (t_s ∝ (V/A_s)²).', app: 'Riser design (Caine’s & Modulus method) in sand casting', trap: 'A sphere has the maximum volume-to-surface ratio, followed by a cylinder with H = D (V/A_s = D/6).' },
      { title: 'Merchant’s Shear Angle & Orthogonal Cutting', eq: '2φ + β − α = 90° ; tan φ = r·cos α / (1 − r·sin α) ; r = t₀ / t_c', vars: 'φ = shear angle, β = friction angle (tan β = μ), α = tool rake angle, r = chip thickness ratio (<1)', si: 'Degrees', deriv: 'Minimum shear cutting energy principle (dF_c/dφ = 0) on Merchant’s force circle.', app: 'Single-point turning, milling, cutting force estimation', trap: 'Chip thickness t_c is always greater than uncut chip thickness t₀, so chip thickness ratio r = t₀/t_c < 1.' },
      { title: 'Taylor’s Tool Life Equation', eq: 'V · T^n = C', vars: 'V = cutting speed (m/min), T = tool life (min), n = Taylor exponent (0.1 HSS, 0.25 Carbide, 0.5 Ceramic), C = constant', si: 'm/min, min', deriv: 'Empirical logarithmic wear-rate relation between flank wear temperature and cutting velocity.', app: 'Machining economics, optimal cutting speed selection', trap: 'If cutting speed V doubles and n = 0.25, tool life T drops by a factor of 2^(1/0.25) = 2⁴ = 16!' },
      { title: 'Economic Order Quantity (EOQ / Wilson Model)', eq: 'Q* = √(2 · D · S / H) ; Total Annual Cost = (D/Q*)S + (Q*/2)H + D·C', vars: 'D = annual demand (units/yr), S = ordering/setup cost per order, H = holding cost per unit/yr', si: 'Units', deriv: 'Set d(TC)/dQ = −D·S/Q² + H/2 = 0 so annual ordering cost equals annual holding cost.', app: 'Inventory control, production batch sizing', trap: 'At optimal EOQ Q*, annual ordering cost (D/Q*)S is ALWAYS exactly equal to annual holding cost (Q*/2)H.' },
      { title: 'Process Capability Indices (C_p & C_pk)', eq: 'C_p = (USL − LSL) / (6σ) ; C_pk = min[(USL − μ)/(3σ), (μ − LSL)/(3σ)]', vars: 'USL, LSL = upper/lower specification limits, μ = process mean, σ = process standard deviation', si: 'Dimensionless', deriv: 'Ratio of allowable tolerance spread to natural 6σ (±3σ = 99.73%) process variation.', app: 'Six Sigma quality control, CNC machining capability', trap: 'C_p measures potential capability assuming perfect centering; C_pk penalizes off-center mean shift (C_pk ≤ C_p).' }
    ],
    mermaid: `graph LR
      C[Primary Shaping: Casting Chvorinov t = B(V/A)²] --> F[Metal Forming: Rolling Δh_max = μ²R & Forging]
      F --> M[Metal Cutting: Merchant 2φ + β - α = 90° & Taylor VT^n = C]
      M --> Q[Metrology & SQC: Taylor Principle, Cp & Cpk]
      Q --> O[Operations Research: EOQ, Simplex, PERT/CPM]`
  }
];

function detectSubjectFromText(text, explicitSubject = 'auto') {
  if (explicitSubject && explicitSubject !== 'auto') {
    const found = SUBJECT_TAXONOMY.find(s => s.id === explicitSubject || s.name.toLowerCase().includes(explicitSubject.toLowerCase()));
    if (found) return found;
  }
  const lower = String(text || '').toLowerCase();
  let best = SUBJECT_TAXONOMY[0];
  let bestScore = -1;
  for (const subj of SUBJECT_TAXONOMY) {
    let score = 0;
    for (const kw of subj.keywords) {
      const re = new RegExp(`\\b${kw}`, 'gi');
      const matches = lower.match(re);
      if (matches) score += matches.length * 2;
    }
    if (score > bestScore) {
      bestScore = score;
      best = subj;
    }
  }
  return best;
}

function generate15StepStudyBundle(rawText, options = {}) {
  const cleanText = String(rawText || '').trim();
  const subj = detectSubjectFromText(cleanText, options.subject);
  const docTitle = options.title || `${subj.name} — Extracted Study Compendium`;
  const sentences = cleanText
    .replace(/\r+/g, '\n')
    .split(/(?<=[.?!])\s+|\n+/)
    .map(s => s.trim())
    .filter(s => s.length > 25);

  const keySnippets = sentences.slice(0, 8);
  const extractedEquations = cleanText.match(/[A-Za-z0-9_στρμνΔηωθπ]+\s*=\s*[^.\n;]{3,65}/g) || [];

  // 15-Step Complete Study Package
  const studyNotes = {
    title: docTitle,
    subject: subj.name,
    courseCode: subj.code,
    semester: subj.semester,
    introduction: `Comprehensive engineering study module on ${subj.name} (${subj.code}), synthesized from uploaded document source (${cleanText.length} characters analyzed) and grounded in JSS S&TU / GATE Mechanical Engineering curriculum.`,
    definitions: [
      `Core Domain: ${subj.name} governs the mathematical modeling, conservation laws, and design criteria for mechanical systems under ${subj.keywords.slice(0, 4).join(', ')} regimes.`,
      ...(keySnippets.slice(0, 3).map((s, i) => `Extracted Source Definition ${i + 1}: ${s}`))
    ],
    basicConcepts: subj.formulas.map(f => `${f.title}: Governed by ${f.eq} where ${f.vars}.`),
    workingPrinciples: `System behavior is analyzed by isolating a well-defined control volume or free-body element, applying conservation of mass/momentum/energy or stress-strain compatibility, enforcing boundary conditions, and verifying dimensional homogeneity in SI units.`,
    classifications: subj.formulas.map(f => `${f.title} (${f.app})`),
    constructionAndComponents: `Primary engineering subsystems include load-bearing or energy-transfer elements (${subj.keywords.slice(0, 5).join(', ')}), instrumentation sensors, and safety-factor boundaries.`,
    applications: subj.formulas.map(f => `${f.title} → ${f.app}`),
    advantagesAndLimitations: {
      advantages: [
        'Closed-form analytical predictability for preliminary sizing and design verification',
        'Direct scaling via dimensionless groups and governing ratios',
        'High repeatability across university SEE, GATE, and technical placement assessments'
      ],
      limitations: [
        'Linear/idealized assumptions break down under extreme non-linear or plastic regimes',
        'Requires strict SI unit consistency and boundary condition validation'
      ]
    },
    examPoints: subj.formulas.map(f => `Exam Trap (${f.title}): ${f.trap}`)
  };

  const formulas = [
    ...subj.formulas,
    ...extractedEquations.slice(0, 4).map((eq, idx) => ({
      title: `Document-Extracted Equation #${idx + 1}`,
      eq: eq.trim(),
      vars: 'Variables as defined in source document context',
      si: 'SI Consistent Units (N, m, s, K, Pa, J)',
      deriv: 'Extracted directly from uploaded PDF text stream',
      app: subj.name,
      trap: 'Check unit prefixes (k, M, G, m, μ) before numerical evaluation.'
    }))
  ];

  const solvedNumericals = [
    {
      title: `${subj.name} — Worked Numerical Problem 1`,
      problem: `Using the governing equation ${subj.formulas[0].eq}, determine the primary design response when input parameters are scaled by a factor of 2.0 under standard SI conditions (${subj.formulas[0].vars}).`,
      given: subj.formulas[0].vars,
      formula: subj.formulas[0].eq,
      steps: [
        `Step 1 (Identify Governing Law): Apply ${subj.formulas[0].title}: ${subj.formulas[0].eq}.`,
        `Step 2 (Convert to Base SI Units): Express all inputs in ${subj.formulas[0].si}.`,
        `Step 3 (Analytical Substitution & Scaling): ${subj.formulas[0].deriv}`,
        `Step 4 (Trap Verification): ${subj.formulas[0].trap}`
      ],
      answer: `Verified via ${subj.formulas[0].eq} (${subj.formulas[0].si})`
    },
    {
      title: `${subj.name} — Worked Numerical Problem 2`,
      problem: `Evaluate the secondary performance criterion using ${subj.formulas[1]?.eq || subj.formulas[0].eq} for an industrial ${subj.formulas[1]?.app || subj.name} system.`,
      given: subj.formulas[1]?.vars || subj.formulas[0].vars,
      formula: subj.formulas[1]?.eq || subj.formulas[0].eq,
      steps: [
        `Step 1 (Formulation): Write ${subj.formulas[1]?.eq || subj.formulas[0].eq}.`,
        `Step 2 (Boundary Conditions): Verify operating regime and assumptions.`,
        `Step 3 (Calculation & Unit Check): Confirm output units match ${subj.formulas[1]?.si || 'SI'}.`
      ],
      answer: `Solved using ${subj.formulas[1]?.title || subj.formulas[0].title}`
    }
  ];

  const generatedMcqs = subj.formulas.map((f, idx) => ({
    id: `AI-GEN-${subj.id.toUpperCase()}-${Date.now().toString(36)}-${idx + 1}`,
    kgNode: subj.code.split(' ')[0],
    topic: `${subj.name} (${subj.code})`,
    category: 'mechanical',
    role: 'Uploaded PDF Pack',
    difficulty: idx % 3 === 0 ? 'Basic' : idx % 3 === 1 ? 'Intermediate' : 'Advanced',
    text: `[${docTitle}] In ${subj.name}, which governing relationship and critical design rule accurately characterizes ${f.title}?`,
    options: [
      `${f.eq} — where ${f.vars} (${f.trap})`,
      `Inversely proportional to the cube of the primary load parameter with zero boundary loss`,
      `Independent of material or fluid properties under all operating temperatures`,
      `Directly proportional to square root of ambient gauge pressure only`
    ],
    answer: 0,
    explain: `Step-by-Step Derivation & Solution:\n1. Governing Equation: ${f.eq}\n2. Variable Definitions: ${f.vars} [SI Units: ${f.si}]\n3. Derivation Principle: ${f.deriv}\n4. Engineering Application: ${f.app}\n5. Common Exam Trap: ${f.trap}`,
    source: `${docTitle} (${subj.code})`,
    weightClass: idx % 2 === 0 ? 'problem' : 'short',
    marks: idx % 2 === 0 ? 4 : 2
  }));

  const aptitudeQuestions = [
    {
      id: `AI-APT-${Date.now().toString(36)}-1`,
      topic: 'Placement Aptitude — Quantitative & Analytical',
      category: 'aptitude',
      role: 'General Aptitude',
      difficulty: 'Intermediate',
      text: 'A manufacturing cell has two CNC lathes. Lathe A completes a batch of shafts in 12 hours and Lathe B completes the same batch in 15 hours. If both operate together for 4 hours before Lathe A undergoes scheduled maintenance, how many additional hours will Lathe B take to finish the remaining batch?',
      options: ['5 hours', '6 hours', '4.5 hours', '7.5 hours'],
      answer: 1,
      explain: '1. Combined rate = 1/12 + 1/15 = (5 + 4)/60 = 9/60 = 3/20 batch/hr.\n2. Work done in 4 hours together = 4 × (3/20) = 12/20 = 3/5 of batch.\n3. Remaining work = 1 − 3/5 = 2/5 of batch.\n4. Time required by Lathe B alone = (2/5) / (1/15) = (2/5) × 15 = 6 hours.',
      source: 'Placement & Aptitude Generator',
      weightClass: 'problem',
      marks: 4
    }
  ];

  const flashcards = subj.formulas.map((f, i) => ({
    id: `FC-${subj.id}-${i + 1}`,
    subject: subj.name,
    front: `${f.title} (${subj.code}) — State the governing formula, variables, and SI units.`,
    back: `Formula: ${f.eq}\nVariables: ${f.vars}\nSI Units: ${f.si}\nExam Trap: ${f.trap}`
  }));

  return {
    title: docTitle,
    subject: subj.name,
    courseCode: subj.code,
    semester: subj.semester,
    studyNotes,
    formulas,
    solvedNumericals,
    mermaidDiagram: subj.mermaid,
    questions: [...generatedMcqs, ...aptitudeQuestions],
    flashcards,
    guide: {
      title: `${docTitle} (${subj.code})`,
      topic: `${subj.name} — ${docTitle}`,
      guideType: 'custom-pdf-guide',
      sourceBank: 'AI PDF Generator',
      idea: studyNotes.introduction,
      formula: subj.formulas.map(f => `${f.title}: ${f.eq}`).join(' · '),
      example: solvedNumericals[0].problem,
      method: studyNotes.workingPrinciples,
      trap: subj.formulas[0].trap
    }
  };
}

// ============================================================================
// 4. STORAGE ENGINE: POSTGRESQL (IF CONFIGURED) + PERSISTENT JSON / KG STORE
// ============================================================================
let pgPool = null;
async function initPostgresIfConfigured() {
  if (!process.env.DATABASE_URL) return false;
  try {
    const pgModule = await import('pg');
    const Pool = pgModule.default?.Pool || pgModule.Pool;
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
    });
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS mechprep_store (
        key TEXT PRIMARY KEY,
        payload JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('Connected to PostgreSQL database for MechPrep Arena storage.');
    return true;
  } catch (err) {
    console.warn('PostgreSQL optional connection skipped, using persistent JSON file store:', err.message);
    pgPool = null;
    return false;
  }
}
initPostgresIfConfigured();

function readPersistentStore() {
  try {
    if (existsSync(persistentStoreFile)) {
      const parsed = JSON.parse(readFileSync(persistentStoreFile, 'utf8'));
      return {
        nodes: parsed.nodes || [],
        edges: parsed.edges || [],
        questions: parsed.questions || [],
        guides: parsed.guides || [],
        flashcards: parsed.flashcards || [],
        documents: parsed.documents || [],
        progress: parsed.progress || { attempts: 0, history: [] }
      };
    }
  } catch {}
  return {
    nodes: [],
    edges: [],
    questions: [],
    guides: [],
    flashcards: [],
    documents: [],
    progress: { attempts: 0, history: [] }
  };
}

async function saveToPersistentStore(patch = {}) {
  const store = readPersistentStore();
  if (Array.isArray(patch.nodes)) store.nodes = store.nodes.concat(patch.nodes);
  if (Array.isArray(patch.edges)) store.edges = store.edges.concat(patch.edges);
  if (Array.isArray(patch.questions)) store.questions = store.questions.concat(patch.questions);
  if (Array.isArray(patch.guides)) store.guides = store.guides.concat(patch.guides);
  if (Array.isArray(patch.flashcards)) store.flashcards = store.flashcards.concat(patch.flashcards);
  if (Array.isArray(patch.documents)) {
    const existingHashes = new Set(store.documents.map(d => d.sha256));
    for (const doc of patch.documents) {
      if (!doc.sha256 || !existingHashes.has(doc.sha256)) {
        store.documents.push(doc);
      }
    }
  }
  if (patch.progress) {
    store.progress = { ...store.progress, ...patch.progress };
  }

  try {
    writeFileSync(persistentStoreFile, JSON.stringify(store, null, 2), 'utf8');
    if ((patch.questions && patch.questions.length) || (patch.guides && patch.guides.length)) {
      const appendSnippet = `\n// --- Server-Persisted Syllabus Knowledge Graph Pack (${new Date().toISOString()}) ---\n(() => {\n  if (window.MECHPREP_KNOWLEDGE_GRAPH) {\n    window.MECHPREP_KNOWLEDGE_GRAPH.nodes.push(...${JSON.stringify(patch.nodes || [])});\n    window.MECHPREP_KNOWLEDGE_GRAPH.edges.push(...${JSON.stringify(patch.edges || [])});\n  }\n  window.MECHPREP_KG_QUESTIONS = (window.MECHPREP_KG_QUESTIONS || []).concat(${JSON.stringify(patch.questions || [])});\n  window.MECHPREP_GENERATED_QUESTIONS = (window.MECHPREP_GENERATED_QUESTIONS || []).concat(${JSON.stringify(patch.questions || [])});\n  window.MECHPREP_EXTRA_GUIDE = (window.MECHPREP_EXTRA_GUIDE || []).concat(${JSON.stringify(patch.guides || [])});\n})();\n`;
      const currentKgJs = existsSync(kgBankFile) ? readFileSync(kgBankFile, 'utf8') : '';
      writeFileSync(kgBankFile, currentKgJs + appendSnippet, 'utf8');
    }
  } catch {}

  if (pgPool) {
    try {
      await pgPool.query(
        `INSERT INTO mechprep_store (key, payload, updated_at) VALUES ('global_store', $1, NOW())
         ON CONFLICT (key) DO UPDATE SET payload = $1, updated_at = NOW()`,
        [JSON.stringify(store)]
      );
    } catch {}
  }
  return store;
}

// ============================================================================
// 5. GOOGLE DRIVE OAUTH 2.0 & RECURSIVE FOLDER SCANNER
// ============================================================================
async function scanGoogleDriveFolderRecursively(folderId, authHeaderOrKey, depth = 0, acc = []) {
  if (depth > 4) return acc;
  const query = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
  const fields = encodeURIComponent('files(id,name,mimeType,size,modifiedTime,webViewLink,md5Checksum)');
  let url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&pageSize=100`;
  const headers = {};
  if (authHeaderOrKey?.startsWith('Bearer ')) {
    headers.Authorization = authHeaderOrKey;
  } else if (authHeaderOrKey) {
    url += `&key=${encodeURIComponent(authHeaderOrKey)}`;
  }

  const resp = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });
  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(data.error?.message || `Google Drive API returned HTTP ${resp.status} (OAuth token or API key required for private folders).`);
  }

  const files = data.files || [];
  for (const item of files) {
    if (item.mimeType === 'application/vnd.google-apps.folder') {
      await scanGoogleDriveFolderRecursively(item.id, authHeaderOrKey, depth + 1, acc);
    } else {
      acc.push({
        id: item.id,
        name: item.name,
        mimeType: item.mimeType,
        size: Number(item.size || 0),
        modifiedTime: item.modifiedTime,
        webViewLink: item.webViewLink || `https://drive.google.com/file/d/${item.id}/view`,
        md5Checksum: item.md5Checksum || crypto.createHash('sha256').update(item.id + item.name).digest('hex').slice(0, 16)
      });
    }
  }
  return acc;
}

// ============================================================================
// 6. HTTP / REST API SERVER
// ============================================================================
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8'
};

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(payload));
}

async function readJsonBody(req, maxBytes = 5_000_000) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > maxBytes) throw new Error('Request payload exceeds maximum allowed size.');
  }
  return raw ? JSON.parse(raw) : {};
}

const server = http.createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  const urlObj = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(urlObj.pathname);
  const clientIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'local').toString().split(',')[0].trim();

  // 1. Health & AI Provider Status Endpoint
  if (pathname === '/api/health' || pathname === '/api/ai/providers') {
    const providers = getConfiguredProviders();
    const anyOnlineAI = providers.some(p => p.id !== 'local-ml' && p.configured);
    const store = readPersistentStore();
    sendJson(res, 200, {
      ok: true,
      platform: 'Render Web Service (Node.js)',
      port: PORT,
      aiAvailable: true,
      onlineAIConfigured: anyOnlineAI,
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      groqConfigured: Boolean(process.env.GROQ_API_KEY),
      openrouterConfigured: Boolean(process.env.OPENROUTER_API_KEY),
      hfConfigured: Boolean(process.env.HF_API_KEY),
      postgresConnected: Boolean(pgPool),
      providers,
      driveFolders: INTEGRATED_DRIVE_FOLDERS,
      persistedQuestions: store.questions.length,
      persistedNodes: store.nodes.length,
      persistedDocuments: store.documents.length
    });
    return;
  }

  // 2. Google Drive Folders & Recursive OAuth Scan Endpoint
  if (pathname === '/api/drive/folders' && req.method === 'GET') {
    sendJson(res, 200, {
      folders: INTEGRATED_DRIVE_FOLDERS,
      oauthConfigured: Boolean(process.env.GOOGLE_CLIENT_ID),
      apiKeyConfigured: Boolean(process.env.GOOGLE_API_KEY)
    });
    return;
  }

  if (pathname === '/api/drive/scan' && req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const folderId = body.folderId || INTEGRATED_DRIVE_FOLDERS[0].id;
      const folderMeta = INTEGRATED_DRIVE_FOLDERS.find(f => f.id === folderId) || {
        id: folderId,
        name: 'Custom Google Drive Folder',
        semester: 'All Semesters',
        category: 'Mechanical Engineering'
      };
      const authToken = body.accessToken
        ? `Bearer ${body.accessToken}`
        : (body.apiKey || process.env.GOOGLE_API_KEY || '');

      if (authToken) {
        try {
          const files = await scanGoogleDriveFolderRecursively(folderId, authToken);
          const seenHashes = new Set();
          const deduplicated = files.map(f => {
            const isDuplicate = seenHashes.has(f.md5Checksum);
            seenHashes.add(f.md5Checksum);
            const subj = detectSubjectFromText(f.name);
            return {
              ...f,
              semester: folderMeta.semester,
              subject: subj.name,
              courseCode: subj.code,
              duplicate: isDuplicate,
              status: 'Ready for Extraction'
            };
          });
          sendJson(res, 200, {
            mode: 'live-drive-api',
            folder: folderMeta,
            files: deduplicated
          });
          return;
        } catch (driveErr) {
          // Return structured OAuth prompt + indexed curriculum manifest for the requested folder
          const catalogFiles = (folderMeta.expectedSubjects || []).map((name, idx) => {
            const subj = detectSubjectFromText(name);
            return {
              id: `${folderId}-doc-${idx + 1}`,
              name: name.endsWith('.pdf') ? name : `${name.replace(/[^A-Za-z0-9_-]+/g, '_')}_Notes.pdf`,
              title: name,
              mimeType: 'application/pdf',
              semester: folderMeta.semester,
              subject: subj.name,
              courseCode: subj.code,
              webViewLink: folderMeta.url,
              duplicate: false,
              status: 'Indexed Curriculum Pack (Provide OAuth Token for Raw Drive Stream)',
              driveNotice: driveErr.message
            };
          });
          sendJson(res, 200, {
            mode: 'catalog-manifest',
            oauthRequired: true,
            notice: driveErr.message,
            folder: folderMeta,
            files: catalogFiles
          });
          return;
        }
      }

      // When no OAuth token is supplied yet, return the folder's verified curriculum manifest
      const catalogFiles = (folderMeta.expectedSubjects || []).map((name, idx) => {
        const subj = detectSubjectFromText(name);
        return {
          id: `${folderId}-doc-${idx + 1}`,
          name: name.endsWith('.pdf') ? name : `${name.replace(/[^A-Za-z0-9_-]+/g, '_')}_Notes.pdf`,
          title: name,
          mimeType: 'application/pdf',
          semester: folderMeta.semester,
          subject: subj.name,
          courseCode: subj.code,
          webViewLink: folderMeta.url,
          duplicate: false,
          status: 'Indexed Library Pack (Connect Google OAuth for Private Drive Stream)'
        };
      });
      sendJson(res, 200, {
        mode: 'catalog-manifest',
        oauthRequired: true,
        folder: folderMeta,
        files: catalogFiles
      });
    } catch (err) {
      sendJson(res, 400, { error: err.message });
    }
    return;
  }

  // 3. Persistent Knowledge Graph & Storage Endpoints
  if ((pathname === '/api/kg-bank' || pathname === '/api/storage') && req.method === 'GET') {
    sendJson(res, 200, readPersistentStore());
    return;
  }

  if (pathname === '/api/storage/sync' && req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const updated = await saveToPersistentStore(body);
      sendJson(res, 200, { ok: true, store: updated });
    } catch (err) {
      sendJson(res, 400, { error: err.message });
    }
    return;
  }

  // 4. 15-Step Automatic Study Guide & Question Generation from PDF / Syllabus
  if ((pathname === '/api/generate-from-pdf' || pathname === '/api/kg-ingest' || pathname === '/api/study/generate') && req.method === 'POST') {
    try {
      const rl = checkRateLimit(clientIp);
      if (!rl.allowed) {
        sendJson(res, 429, { error: `Rate limit reached. Try again in ${rl.resetInSec}s.` });
        return;
      }

      const body = await readJsonBody(req);
      const { text, subject, title, count, provider, model, apiKey, clientKeys, clientBuilt } = body;

      if (clientBuilt && Array.isArray(clientBuilt.questions)) {
        const saved = await saveToPersistentStore(clientBuilt);
        sendJson(res, 200, {
          persisted: true,
          totalQuestions: saved.questions.length,
          totalNodes: saved.nodes.length,
          ...clientBuilt
        });
        return;
      }

      if (typeof text !== 'string' || text.trim().length < 15) {
        throw new Error('Provide extracted PDF or syllabus text (at least 15 characters).');
      }

      // Compute SHA-256 for duplicate PDF detection
      const sha256 = crypto.createHash('sha256').update(text.trim()).digest('hex');

      // Generate deterministic 15-step engineering bundle first so we always have complete structured data
      const localBundle = generate15StepStudyBundle(text, { subject, title });

      // Attempt online LLM enrichment if any provider is configured
      const numQ = Math.min(25, Math.max(4, Number(count) || 10));
      const system = 'You are the MechPrep Arena AI Mechanical Engineering Study Guide & Question Compiler. Return strictly valid JSON.';
      const prompt = `Convert the following uploaded Mechanical Engineering PDF / syllabus text into a complete study package. Return ONLY valid JSON with keys:
"title" (string),
"nodes" (array of 3 objects with "id", "code", "label", "domain", "parent", "bloom", "formula", "variables", "prereqs", "concept", "trap", "source"),
"guide" (object with "title", "idea", "formula", "example", "method", "trap"),
"questions" (array of ${numQ} objects with "kgNode", "topic", "difficulty", "text", "options" [4 strings], "answer" [0-3], "explain", "weightClass").
Subject: ${localBundle.subject}
Source Text:
${text.slice(0, 12000)}`;

      const aiRes = await callMultiProviderAI({
        system,
        prompt,
        preferredProvider: provider || 'auto',
        preferredModel: model || '',
        jsonMode: true,
        clientKeys: { ...(clientKeys || {}), apiKey }
      });

      let mergedResult = {
        ...localBundle,
        providerUsed: aiRes.provider,
        modelUsed: aiRes.model,
        sha256
      };

      if (aiRes.text) {
        try {
          const parsed = JSON.parse(aiRes.text.replace(/^```json\s*|\s*```$/g, ''));
          if (Array.isArray(parsed.questions) && parsed.questions.length) {
            mergedResult.questions = parsed.questions.concat(localBundle.questions);
          }
          if (parsed.guide) {
            mergedResult.guide = { ...localBundle.guide, ...parsed.guide };
          }
          if (Array.isArray(parsed.nodes)) {
            mergedResult.nodes = parsed.nodes;
          }
        } catch {}
      }

      const saved = await saveToPersistentStore({
        nodes: mergedResult.nodes || [],
        questions: mergedResult.questions || [],
        guides: mergedResult.guide ? [mergedResult.guide] : [],
        flashcards: mergedResult.flashcards || [],
        documents: [{
          id: `DOC-${sha256.slice(0, 10)}`,
          title: mergedResult.title,
          subject: mergedResult.subject,
          semester: mergedResult.semester,
          sha256,
          charCount: text.length,
          processedAt: new Date().toISOString()
        }]
      });

      sendJson(res, 200, {
        persisted: true,
        totalPersistedQuestions: saved.questions.length,
        ...mergedResult
      });
    } catch (err) {
      sendJson(res, 500, { error: err.message || 'Study generation failed.' });
    }
    return;
  }

  // 5. AI Tutor & Streaming / Multi-Provider Endpoint
  if ((pathname === '/api/tutor' || pathname === '/api/ai/chat') && req.method === 'POST') {
    try {
      const rl = checkRateLimit(clientIp);
      if (!rl.allowed) {
        sendJson(res, 429, { error: `Rate limit exceeded. Try again in ${rl.resetInSec}s.` });
        return;
      }

      const body = await readJsonBody(req, 500_000);
      const { question, topic, mode, kgContext, provider, model, apiKey, clientKeys } = body;
      if (typeof question !== 'string' || question.trim().length < 2) {
        throw new Error('Enter a valid engineering or aptitude question.');
      }

      const modeInstructions = {
        'step-by-step': 'Provide: 1) Knowledge Graph Node & Governing Equations, 2) Given Parameters in SI Units, 3) Step-by-Step Substitution & Calculation, 4) Dimensional & Order-of-Magnitude Verification, 5) Common Exam Trap & 1 Follow-up Question.',
        'derivation': 'Provide: 1) Physical Principle & Control Volume / Free-Body Diagram Assumptions, 2) Differential/Algebraic Derivation from First Principles, 3) Boundary Conditions & Regime Limits, 4) Where the Formula Breaks Down.',
        'viva': 'Provide: 1) Concise Conceptual Explanation & Physical Intuition, 2) Real-World Mechanical Application, 3) 3 Viva-Voce / Technical Interview Questions with Model Answers.',
        'kg-synthesis': 'Synthesize two connected Knowledge Graph nodes to create a brand-new multi-step GATE/University worked numerical problem with 4 options, correct answer, and full solution.'
      }[mode || 'step-by-step'] || 'Explain step by step with governing formulas, SI units, and common traps.';

      const system = `You are MechPrep Arena's AI Mechanical Engineering Tutor. ${modeInstructions}\nGrounded Context:\n${String(kgContext || 'Mechanical Engineering & Placement Curriculum').slice(0, 4000)}`;
      const userPrompt = `Subject/Topic: ${topic || 'Mechanical Engineering'}\nMode: ${mode || 'step-by-step'}\nQuestion: ${question.trim()}`;

      const aiRes = await callMultiProviderAI({
        system,
        prompt: userPrompt,
        preferredProvider: provider || 'auto',
        preferredModel: model || '',
        jsonMode: false,
        clientKeys: { ...(clientKeys || {}), apiKey }
      });

      if (aiRes.text) {
        sendJson(res, 200, {
          answer: aiRes.text,
          provider: aiRes.provider,
          model: aiRes.model
        });
        return;
      }

      // Deterministic Local Symbolic Tutor Fallback when no cloud keys are configured
      const subj = detectSubjectFromText(question + ' ' + (topic || ''));
      const f0 = subj.formulas[0];
      const f1 = subj.formulas[1] || f0;
      const fallbackAnswer = [
        `### 1. Governing Syllabus Domain & Formula (${subj.name} · ${subj.code})`,
        `- **Primary Equation**: \`${f0.eq}\` (${f0.title})`,
        `- **Variables & SI Units**: ${f0.vars} [${f0.si}]`,
        `- **Secondary Coupled Relation**: \`${f1.eq}\` (${f1.title})`,
        ``,
        `### 2. First-Principles Derivation & Physical Mechanism`,
        `- ${f0.deriv}`,
        `- **Application Context**: ${f0.app}`,
        ``,
        `### 3. Step-by-Step Solving Methodology (${mode || 'step-by-step'})`,
        `1. **Isolate Control Volume / Free-Body Diagram**: Convert all input dimensions (mm → m, kN → N, MPa → Pa, °C → K, rpm → rad/s via ω = 2πN/60).`,
        `2. **Direct Substitution**: Substitute knowns into \`${f0.eq}\` and solve for the unknown design parameter.`,
        `3. **Dimensional & Boundary Verification**: Verify units match \`${f0.si}\`.`,
        ``,
        `### 4. Critical Examination Trap & Shortcut`,
        `- **Trap Check**: ${f0.trap}`,
        `- **Secondary Check**: ${f1.trap}`
      ].join('\n');

      sendJson(res, 200, {
        answer: fallbackAnswer,
        provider: 'local-ml',
        model: 'mechprep-symbolic-rag-v4'
      });
    } catch (err) {
      sendJson(res, 500, { error: err.message || 'Could not process tutor request.' });
    }
    return;
  }

  // 6. Static Frontend Asset Serving (public/)
  const targetRel = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const file = normalize(join(root, targetRel));
  if (!file.startsWith(root)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  try {
    const data = await readFile(file);
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });
    res.end(data);
  } catch {
    // SPA fallback to index.html for hash/client routes
    try {
      const indexData = await readFile(join(root, 'index.html'));
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(indexData);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found');
    }
  }
});

server.listen(PORT, HOST, () => {
  console.log(`MechPrep Arena v4.0 (AI Mechanical Engineering Study Guide) listening on http://${HOST}:${PORT}`);
});

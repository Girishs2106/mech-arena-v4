# MechPrep Arena v5.0 — Unified AI Mechanical Engineering Study Guide & Placement Platform

Complete full-stack Node.js + JavaScript AI-powered Mechanical Engineering Study Guide, 17 Interactive Textbook Schematics & Parametric Calculators, PDF/OCR Processor, Printable University Question Paper (Part A + Part B) Generator, Google Drive Library Connector, and Placement Preparation platform designed for **Render.com**, **Vercel**, and **Netlify**.

## 1. Unified Architecture & Features (v5.0)

- **19 Complete Study & Placement Modules**:
  1. Dashboard
  2. PDF → QP Studio & Google Drive Connector (with Formatted Syllabus Reader, NotebookLM Knowledge Sync, `.js` & `.md` Export, and Printable University Question Paper Part A + Part B)
  3. Semester 4 Hub (JSS S&TU)
  4. Semester 5 Hub (JSS S&TU)
  5. Semester 6 Hub (JSS S&TU)
  6. Mechanical Subjects (28 JSS S&TU Semester III–VIII Courses with CO1–CO5 & Module Equations)
  7. Complete Study Guides (116+ Lessons + Interactive 17-Schematic Textbook Calculator Card + Embedded Knowledge-Graph LLM Studio below Study Guide)
  8. Formula Library (345+ Equations)
  9. Engineering Diagrams (17 Interactive Textbook Schematics + Live Calculators + Mermaid.js Flowchart Studio)
  10. Graph Generator (Chart.js Analytical Curves: Otto vs Diesel, 1-DOF Vibration Magnification & Transmissibility, Stress-Strain, Pump H-Q)
  11. Numerical Problems (9 Deterministic Step-by-Step Engineering Solvers)
  12. Technical Question Bank (with inline question figures and expandable schematic + formula explainers)
  13. Aptitude Practice (with AM2, Bizotic, AON, TCS NQT problems & visual explainers)
  14. Timed Mock Tests (Zero-Spoiler active assessment mode with inline question figures; post-exam review unlocks side-by-side answer comparison, worked derivations, and question-specific SVG schematics & formula graphs)
  15. Placement Preparation
  16. AI Engineering Tutor (Multi-Provider Gemini, Groq, OpenRouter, Hugging Face + Symbolic/RAG Fallback)
  17. Active Flashcards (3D flip deck with mastery tracking)
  18. Progress Tracker (Topic-wise accuracy analytics)
  19. AI Model & Render Settings
- **2,449 Practice Questions & 116 Study Guides** in `public/data/combined_mechprep_data.js` (plus all individual modular data banks preserved in `public/data/`).
- **Corporate Slate Navy & Royal Blue Theme** (`public/styles.css` + Tailwind CSS) with multi-page A4 print stylesheets (`@media print`).

## 2. Running Locally or on Render.com

```bash
npm install
npm start
```

- **Render Start Command**: `node server.js`
- **Port Binding**: `process.env.PORT || 10000` bound to `0.0.0.0`

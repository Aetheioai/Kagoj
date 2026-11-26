<div align="center">

<img src="./public/favicon.svg" alt="Kagoj Logo" width="76" height="76" />

# Kagoj (কাগজ)

### Privacy-First Bangladeshi CV & Marriage Biodata Builder

**Create dignified, print-ready A4 CVs and Marriage Biodatas directly in your browser — 100% free, zero servers, zero watermarks, English & Bangla.**

[English](./README.md) · [**বাংলায় পড়ুন (Read in Bangla)**](./README.bn.md)

<br />

[![Live App](https://img.shields.io/badge/Live_App-aetheioai.github.io%2FKagoj-1e5645?style=for-the-badge&logo=githubpages&logoColor=white)](https://aetheioai.github.io/Kagoj/)
[![License: MIT](https://img.shields.io/badge/License-MIT-24211d?style=for-the-badge)](./LICENSE)
[![Privacy: 100% Local](https://img.shields.io/badge/Privacy-100%25_On--Device-1e5645?style=for-the-badge&logo=letsencrypt&logoColor=white)](#zero-server-privacy)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-c88a2e?style=for-the-badge)](./CONTRIBUTING.md)

<p>
  <strong>Live Website:</strong>
  <a href="https://aetheioai.github.io/Kagoj/">https://aetheioai.github.io/Kagoj/</a>
</p>

</div>

---

## Why Kagoj Exists

Across Bangladesh, preparing a clean job CV or a family marriage biodata (*Biye / Bibaho Biodata*) usually means one of two bad choices:

1. **Local computer compose shops** charge 100 to 300 BDT for basic MS Word formatting, charge again for every tiny edit, and leave your phone number, home address, NID, family details, and personal photos sitting on a stranger's computer.
2. **Western online resume builders** do not understand Bangladeshi education boards (SSC / HSC / Honours / Masters GPA scales), Bangladeshi CV personal blocks, or Marriage Biodata norms (*Desher Bari*, guardian contact, faith invocations) — and lock clean PDF downloads behind accounts, paywalls, or watermarks.

**Kagoj** solves both problems. It gives you a friendly, sketchbook-inspired workspace while producing crisp, dignified, print-ready A4 PDFs — entirely inside your own browser, with **zero backend servers** and **zero cost forever**.

---

## Highlights & Features

### Two Dedicated Bangladeshi Document Modes
- **Bangladeshi CV Builder (Job & Academic)** — Tailored for Bangladeshi banks, corporate companies, NGOs, government offices, and universities. Supports SSC/HSC/Honours/Masters/Diploma GPA & CGPA scales, Career Objective presets, Work Experience & Internships, Skills & Languages, Projects, Training & Certifications, optional Bangladeshi Personal Information block, References, Custom Sections, and Declaration & Signature.
- **Bangladeshi Marriage Biodata Builder (Biye / Bibaho Biodata)** — Built for how Bangladeshi families actually print and share biodatas on paper or over WhatsApp. Includes selectable religious/neutral invocations (Islamic, Hindu/Sanatan, Christian, Buddhist, Neutral, Custom, or None), one-click photo Hide/Show toggle, Personal Details with auto-calculated age, Education & Career, Family Background & Siblings, Present Address & *Desher Bari* (Village/Upazila/District), About Me, Partner Expectations, and Guardian / WhatsApp Contact.

### 59 Print-Ready A4 Templates
- **22 Bangladeshi CV Templates** across Formal, Corporate & Bank, Sidebar, Tech & Modern, and Compact styles.
- **37 Marriage Biodata Templates** across Royal, Floral, Islamic, Hindu / Sanatan, Christian & Buddhist, Modern, and WhatsApp-friendly styles.
- **1-Page & 2-Page Formats** — Dedicated guided questions and smart layout tuning for both single-page crisp sheets and detailed two-page documents.

### Zero-Cut Smart A4 PDF Engine
- **Direct one-click A4 PDF download** right from the browser (no watermarks, no paywalls, works on phones and laptops).
- **Section-aware pagination** — Automatically prevents sections, tables, or rows from being sliced in half across page breaks and replicates ornamental frames cleanly on every page.
- **Smart empty-field handling** — Any field or section left blank disappears cleanly without awkward empty rows or `N/A` clutter.

### Built-In On-Device Photo Editor
- Opens automatically whenever you upload a photo (and re-openable anytime with **Crop & Edit**).
- Drag to position, pinch/wheel zoom, rotate 90°, fine straighten, flip horizontal, switch between **Passport (4:5)**, **Portrait (3:4)**, **Square (1:1)**, or **Free Cut** handles, toggle a **Head & Shoulders Outline Guide**, pick Passport / Rounded / Circle frame shapes, apply Studio Light presets, and inspect a live document header preview before applying.

### Bilingual, Mobile-First & Customizable
- **Full English & Bangla (বাংলা)** interface, document headings, sample datasets, and Bangla digit formatting.
- **Live Customization** — Accent color palette + custom hex picker, Auto/Sans/Serif typography, Compact/Normal/Large font scale, spacing density, photo shape/size, section reordering, section visibility toggles, and custom sections.
- **Adapts to any screen** — Smooth experience from 320px smartphones and tablets to ultrawide desktop monitors.

---

## Zero-Server Privacy

Kagoj is designed from the ground up so **your personal and family information never leaves your device**:

- **No backend server, no database, no accounts, no analytics trackers.**
- Drafts stay strictly in your browser's `localStorage`.
- **Private `.json` Backup & Restore** lets you export your draft to your own device and continue editing later.
- **One-Click "Clear Everything"** wipes all saved drafts and photos cleanly — ideal for shared family laptops or cyber cafes.

Read full details in [SECURITY.md](./SECURITY.md).

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| UI Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Client-Side PDF Export | `html-to-image` + `jsPDF` |
| Image Editing | Native HTML5 Canvas API (zero external image-cropper dependencies) |
| Fonts | Hind Siliguri, Noto Serif Bengali, Cormorant Garamond, Patrick Hand |

---

## Quick Start (Local Development)

Kagoj requires **no API keys, no `.env` secrets, and no backend setup**.

### Prerequisites
- [Node.js](https://nodejs.org/) v20 or newer (recommended)
- `npm` (included with Node.js)

### Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/aetheioai/Kagoj.git
cd Kagoj

# 2. Install dependencies
npm install

# 3. Start the development server (http://localhost:3000)
npm run dev
```

### Build & Verify

```bash
# Type-check with TypeScript
npm run lint

# Build production bundle into dist/
npm run build

# Preview the production build locally
npm run preview
```

---

## Deploying to GitHub Pages

Kagoj is pre-configured with `base: './'`, bundled static assets, `public/.nojekyll`, and an automated GitHub Actions workflow at [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml).

To enable live automatic deployment on your fork or repository:

1. Open your repository on GitHub and go to **Settings → Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions** (important: do *not* serve raw source files from the `main` branch root).
3. Push to `main` (or trigger **Actions → Deploy to GitHub Pages → Run workflow**).
4. Your live site will publish automatically to `https://<username>.github.io/Kagoj/`.

---

## Project Structure

```text
Kagoj/
├── .github/
│   ├── ISSUE_TEMPLATE/        # Bilingual bug, feature & template request forms
│   ├── workflows/
│   │   ├── ci.yml             # PR lint & build verification
│   │   └── deploy.yml         # Automated GitHub Pages deployment
│   └── PULL_REQUEST_TEMPLATE.md
├── public/
│   ├── .nojekyll              # Ensures GitHub Pages serves dist/ cleanly
│   └── favicon.svg            # Hand-drawn Kagoj favicon
├── src/
│   ├── assets/images/         # Sketchbook illustrations & sample portrait
│   ├── components/
│   │   ├── steps/             # ModeStep, CVSteps, BiodataSteps
│   │   ├── templates/         # CVTemplates (22) & BiodataTemplates (37)
│   │   ├── A4PreviewPane.tsx  # Live responsive A4 preview with smart breaks
│   │   ├── CustomizePanel.tsx # Colors, fonts, spacing, section order & toggles
│   │   ├── PhotoEditorModal.tsx # On-device canvas crop, cut & preview studio
│   │   ├── SketchChrome.tsx   # Hand-drawn sketchbook UI primitives & uploader
│   │   └── TemplateGallery.tsx # Filterable miniature A4 template showcase
│   ├── data/
│   │   ├── i18n.ts            # Complete English & Bangla labels
│   │   ├── samples.ts         # 1-Page & 2-Page EN/BN sample CVs & Biodatas
│   │   └── templates.ts       # Metadata for all 59 templates
│   ├── types/builder.ts       # Core TypeScript data models
│   ├── utils/
│   │   ├── pagination.ts      # Zero-cut A4 smart pagination engine
│   │   ├── pdfExport.ts       # High-DPI client-side A4 PDF exporter
│   │   └── storage.ts         # localStorage persistence, backup & Bangla digits
│   ├── App.tsx                # 3-Stage Purpose -> Templates -> Editor workflow
│   ├── index.css              # Sketchbook theme, responsive rules & @media print
│   └── main.tsx               # App entry point
├── README.md                  # English documentation
├── README.bn.md               # Bangla documentation (বাংলা ডকুমেন্টেশন)
├── CONTRIBUTING.md            # Bilingual contribution guide
├── CODE_OF_CONDUCT.md         # Community standards (EN & BN)
├── SECURITY.md                # Privacy & security policy (EN & BN)
├── CHANGELOG.md               # Release history
└── LICENSE                    # MIT License
```

---

## Contributing

Contributions from Bangladesh and around the world are warmly welcome — whether you want to design a new CV or Marriage Biodata template, improve Bangla phrasing, fix a layout bug, or add an accessibility improvement!

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) (available in both English and Bangla) to get started.

---

## License

Distributed under the **MIT License**. See [LICENSE](./LICENSE) for details.

<div align="center">
  <p>Made with care for students, job seekers, and families across Bangladesh.</p>
  <p><a href="https://aetheioai.github.io/Kagoj/">Try Kagoj Live →</a></p>
</div>

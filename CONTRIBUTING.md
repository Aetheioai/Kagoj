# Contributing to Kagoj (কাগজ-এ অবদান রাখুন)

Thank you for your interest in contributing to **Kagoj**! Whether you are fixing a small typo, improving Bangla translations, crafting a new Bangladeshi CV or Marriage Biodata template, or polishing mobile UX, every contribution helps people across Bangladesh save time, money, and privacy.

[**বাংলায় পড়ুন (Read in Bangla below ↓)**](#বাংলায়-অবদান-রাখার-নির্দেশিকা)

---

## Core Design & Privacy Rules (Please Read First)

Every contribution **must** uphold Kagoj's core promises:

1. **Zero-Server Privacy**: Never add analytics, tracking pixels, external cloud storage, accounts, or API calls that transmit user data off-device. Everything must remain 100% browser-local.
2. **Dignified, Print-Ready A4 Output**: While the app UI is warm and sketchbook-inspired, every CV and Marriage Biodata template must output crisp, clean, print-ready A4 pages (`794px × 1123px` coordinate geometry) with zero watermarks.
3. **Bilingual Parity**: Every new UI label, template name, and description must be provided in both **English** and **Bangla (`বাংলা`)**.
4. **Mobile & Desktop Adaptability**: Test your changes across compact mobile viewports (`360px`–`390px`), tablets (`768px`), and desktop screens (`1280px+`).

---

## Local Development Workflow

```bash
# 1. Fork the repository on GitHub and clone your fork
git clone https://github.com/<your-username>/Kagoj.git
cd Kagoj

# 2. Install dependencies
npm install

# 3. Create a descriptive branch
git checkout -b feat/your-feature-name

# 4. Run the local dev server (http://localhost:3000)
npm run dev

# 5. Before opening a PR, verify TypeScript & production build
npm run lint
npm run build
```

---

## How to Add a New CV or Marriage Biodata Template

Adding a new template takes just two files:

1. **Register metadata** in `src/data/templates.ts`:
   - Add an entry to `CV_TEMPLATES` or `BIODATA_TEMPLATES` with a unique `id`, `name`, `nameBn`, `category`, `description`, `descriptionBn`, `accent`, `secondary`, and `paperTint`.
2. **Add layout rendering** in `src/components/templates/CVTemplates.tsx` or `src/components/templates/BiodataTemplates.tsx`:
   - Respect `pageFormat` (`'1-page'` vs `'2-page'`), `customization` (`accentColor`, `fontStyle`, `fontSize`, `spacing`, `photoShape`, `photoSize`, `hiddenSections`, `sectionOrder`), and `language` (`'en'` | `'bn'`).
   - Wrap logical blocks in `<section>` and item rows with `.a4-avoid-break` so `src/utils/pagination.ts` never slices content across pages.
   - If your template has a full-page ornamental border, add `data-pdf-page-frame="true"` so multi-page exports automatically replicate the border cleanly on Page 2.
   - Never render empty sections or `N/A` placeholders when optional fields are blank.

---

## Submitting a Pull Request

1. Keep PRs focused on a single feature, template, or fix.
2. Fill out the Pull Request template checklist.
3. Include before/after screenshots (desktop & mobile) for UI or template changes.
4. Make sure both `npm run lint` and `npm run build` pass with zero errors.

---

## বাংলায় অবদান রাখার নির্দেশিকা

**কাগজ**-এ অবদান রাখার আগ্রহের জন্য আপনাকে আন্তরিক ধন্যবাদ! ছোট কোনো বানান ঠিক করা, বাংলা অনুবাদ উন্নত করা, নতুন সিভি বা বিবাহের বায়োডাটা টেমপ্লেট ডিজাইন করা কিংবা মোবাইল অভিজ্ঞতা উন্নত করা — আপনার প্রতিটি অবদান বাংলাদেশের অসংখ্য মানুষের উপকারে আসবে।

### মূল নীতিমালা (অবশ্যই অনুসরণীয়)

১. **শূন্য-সার্ভার প্রাইভেসি**: কখনোই কোনো ট্র্যাকার, অ্যানালিটিক্স, লগইন বা এমন কোনো কোড যুক্ত করা যাবে না যা ব্যবহারকারীর তথ্য ব্রাউজারের বাইরে পাঠায়।
২. **পরিচ্ছন্ন A4 প্রিন্ট আউটপুট**: প্রতিটি সিভি ও বায়োডাটা টেমপ্লেট অবশ্যই মার্জিত, প্রিন্ট-রেডি A4 মাপে (`794px × 1123px`) হতে হবে এবং কোনো ওয়াটারমার্ক থাকবে না।
৩. **বাংলা ও ইংরেজি সমতা**: নতুন যেকোনো বাটন, লেবেল বা টেমপ্লেটের নাম অবশ্যই ইংরেজি ও বাংলা উভয় ভাষায় দিতে হবে।
৪. **সব স্ক্রিনে উপযোগী**: মোবাইল (৩৬০px), ট্যাবলেট ও ডেস্কটপ — সব স্ক্রিনে পরিবর্তনটি ঠিকমতো কাজ করছে কিনা দেখে নিন।

### Pull Request পাঠানোর ধাপ

১. রিপোজিটরি Fork করুন এবং নিজের কম্পিউটারে `git clone` করুন।
২. নতুন একটি ব্রাঞ্চ তৈরি করুন (যেমন: `feat/new-biodata-template` বা `fix/bangla-label`)।
৩. `npm install` এবং `npm run dev` চালিয়ে আপনার পরিবর্তন পরীক্ষা করুন।
৪. PR পাঠানোর আগে অবশ্যই `npm run lint` এবং `npm run build` চালিয়ে নিশ্চিত করুন কোনো এরর নেই।
৫. UI বা টেমপ্লেট পরিবর্তনের ক্ষেত্রে স্ক্রিনশট যুক্ত করে Pull Request খুলুন।

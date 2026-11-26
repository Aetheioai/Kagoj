# Security & Privacy Policy (নিরাপত্তা ও প্রাইভেসি নীতিমালা)

## Privacy Architecture (English)

**Kagoj** is built as a **100% client-side, zero-server web application**:

- **Zero Data Transmission**: Personal details, family details, phone numbers, addresses, NID numbers, and uploaded photos are processed exclusively inside your browser memory and `localStorage`. No user data is ever sent to any backend server.
- **On-Device Image Editing & PDF Export**: Both photo cropping (HTML5 Canvas) and A4 PDF generation (`html-to-image` + `jsPDF`) execute locally on your device.
- **No Accounts or Tracking**: Kagoj uses zero authentication, zero telemetry, and zero third-party analytics scripts.
- **Clean Wipe for Shared Devices**: Clicking **Clear Everything** deletes the entire Kagoj `localStorage` payload and resets in-memory state immediately.
- **External Network Requests**: The only external network request made by the browser is loading Google Fonts (`Hind Siliguri`, `Noto Serif Bengali`, `Cormorant Garamond`, `Patrick Hand`) for crisp Bangla & English typography.

### Reporting a Vulnerability

If you discover a security vulnerability (such as XSS, unsafe HTML/file handling, or an unintended data leak):

1. **Please do not open a public issue** with exploit details.
2. Use GitHub's **Private Vulnerability Reporting** (under the repository's **Security → Advisories** tab) at `https://github.com/aetheioai/Kagoj/security/advisories/new`.
3. Include a clear description, reproduction steps, and potential impact. We will investigate and patch confirmed issues promptly.

---

## প্রাইভেসি ও নিরাপত্তা নীতিমালা (বাংলা)

**কাগজ** সম্পূর্ণরূপে **১০০% ক্লায়েন্ট-সাইড ও সার্ভারবিহীন** ওয়েব অ্যাপ্লিকেশন হিসেবে তৈরি:

- **কোনো তথ্য সার্ভারে যায় না**: আপনার ব্যক্তিগত তথ্য, পারিবারিক বিবরণ, ফোন নম্বর, ঠিকানা, এনআইডি ও ছবি কেবল আপনার ব্রাউজারের ভেতরেই (`localStorage`) থাকে। কোনো রিমোট সার্ভারে কিছুই পাঠানো হয় না।
- **নিজের ডিভাইসেই ছবি এডিট ও PDF তৈরি**: ছবি ক্রপ করা এবং A4 PDF ডাউনলোড — দুটোই সম্পূর্ণভাবে আপনার ফোন বা কম্পিউটারেই সম্পন্ন হয়।
- **কোনো লগইন বা ট্র্যাকিং নেই**: কোনো একাউন্ট তৈরি করতে হয় না এবং কোনো ট্র্যাকার স্ক্রিপ্ট ব্যবহার করা হয়নি।
- **শেয়ার করা ডিভাইসে নিরাপদ**: ব্যবহার শেষে **সব মুছুন (Clear Everything)** বাটনে ক্লিক করলেই ব্রাউজার থেকে সব তথ্য ও ছবি সাথে সাথে মুছে যায়।

### নিরাপত্তাজনিত কোনো ত্রুটি জানালে

আপনি যদি কোডে কোনো নিরাপত্তা ত্রুটি (যেমন XSS বা অনাকাঙ্ক্ষিত ডেটা লিক) খুঁজে পান, তবে অনুগ্রহ করে পাবলিক ইস্যু না খুলে GitHub-এর **Security → Advisories** অপশনের মাধ্যমে ব্যক্তিগতভাবে আমাদের জানান:
`https://github.com/aetheioai/Kagoj/security/advisories/new`

# GreenFlux Energy App

## Overview
GreenFlux Energy App is a modern, responsive web application for a solar energy marketplace. The project features a unique, immersive landing section and transitions smoothly into a clean, card-based website UI for the rest of the site.

## Features

- **Custom Landing Section:**
  - Animated particle background
  - 3D sun visualization (using Three.js and React Three Fiber)
  - Animated fiber-optic headline text ("POWER THE FUTURE")
  - Modern, interactive hero content
  - Responsive and visually engaging

- **Sticky Navigation Bar:**
  - Logo on the left, menu centered (desktop)
  - Clean, modern style with pill/rounded active menu item
  - Responsive hamburger menu for mobile
  - Remains visible as you scroll

- **Website UI Sections:**
  - After the landing, the site transitions to a clean, white-background, card-based layout
  - Responsive 3-column feature card grid (with placeholder content)
  - All sections are fully mobile responsive

- **Tech Stack:**
  - Next.js (App Router)
  - React 18
  - Tailwind CSS (for rapid, responsive styling)
  - Three.js & @react-three/fiber (for 3D sun effect)
  - Lucide React (for icons)

## Structure

- `src/app/page.tsx` — Main page, includes landing and first website section
- `src/app/components/` — Reusable UI components (navigation, fiber-optic text, 3D sun, etc.)
- `src/app/globals.css` — Global and custom styles (including fiber-optic animation)
- `tailwind.config.js` — Tailwind CSS configuration

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Visit [http://localhost:3000](http://localhost:3000) to view the app.

## Next Steps
- Add more website sections (image/text split, testimonials, newsletter, etc.)
- Refine navigation and card content as needed
- Connect to backend or CMS for dynamic content

---

**Design inspiration:**
- Custom immersive landing
- Modern, clean website UI for all other sections

Feel free to contribute or suggest improvements!

---
name: Clinical Precision
colors:
  surface: '#f8f9ff'
  surface-dim: '#c4dcfd'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eef4ff'
  surface-container: '#e4efff'
  surface-container-high: '#dbe9ff'
  surface-container-highest: '#d1e4ff'
  on-surface: '#011d35'
  on-surface-variant: '#44474e'
  inverse-surface: '#19324b'
  inverse-on-surface: '#e9f1ff'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#4a5f82'
  primary: '#00122b'
  on-primary: '#ffffff'
  primary-container: '#0f2747'
  on-primary-container: '#798fb4'
  inverse-primary: '#b2c7f0'
  secondary: '#006a66'
  on-secondary: '#ffffff'
  secondary-container: '#7ff2ec'
  on-secondary-container: '#006f6b'
  tertiary: '#00141f'
  on-tertiary: '#ffffff'
  tertiary-container: '#002a3c'
  on-tertiary-container: '#0098cd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#b2c7f0'
  on-primary-fixed: '#011b3b'
  on-primary-fixed-variant: '#324769'
  secondary-fixed: '#82f5ef'
  secondary-fixed-dim: '#63d8d3'
  on-secondary-fixed: '#00201f'
  on-secondary-fixed-variant: '#00504d'
  tertiary-fixed: '#c4e7ff'
  tertiary-fixed-dim: '#7bd0ff'
  on-tertiary-fixed: '#001e2c'
  on-tertiary-fixed-variant: '#004c69'
  background: '#f8f9ff'
  on-background: '#011d35'
  surface-variant: '#d1e4ff'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.25'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

This design system is built for high-stakes healthcare environments where clarity, trust, and technological advancement intersect. The aesthetic follows a **Modern Corporate** direction with **Glassmorphic** accents to suggest a futuristic, AI-driven intelligence.

The visual narrative focuses on "Clinical Transparency"—using depth and soft layering to organize complex medical data without overwhelming the practitioner. The emotional response should be one of absolute reliability and effortless efficiency. High-quality whitespace, crisp iconography, and a refined tactile quality through subtle shadows ensure the platform feels premium and authoritative.

## Colors

The palette is anchored by **Deep Navy**, providing a foundation of stability and institutional trust. **Healthcare Teal** and **Soft Cyan** are used strategically for primary actions and data visualizations, evoking a sense of modern medical technology.

- **Primary (Deep Navy):** Use for headers, primary navigation, and high-level structural elements.
- **Secondary (Teal):** Use for primary call-to-actions and active states.
- **Tertiary (Cyan):** Use for AI-driven insights, highlights, and subtle glassmorphic borders.
- **Surface Strategy:** The background uses a cool-toned off-white to reduce eye strain, while cards remain pure white to "pop" via elevation.

## Typography

This design system utilizes a dual-font strategy. **Manrope** is used for headlines to provide a modern, geometric, and friendly character to the interface. **Inter** is used for all body text and UI labels due to its exceptional legibility in data-heavy medical environments.

For information-dense tables, use `body-sm`. For patient records and clinical notes, `body-md` is the standard to ensure maximum readability for practitioners. All labels should be set in Medium or SemiBold weight to clearly distinguish them from data values.

## Layout & Spacing

The layout utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. A strict 8px base unit (the "Step") governs all spatial relationships.

- **Content Containers:** Use a maximum width of 1440px for the main content area to prevent line lengths from becoming illegible.
- **Sidebars:** Fixed at 280px to accommodate clinical navigation without crowding the workspace.
- **Section Spacing:** Use `lg` (40px) between major card groups and `md` (24px) for internal card padding.
- **Mobile Reflow:** On mobile, all cards stack vertically with a 16px margin on the left and right edges.

## Elevation & Depth

Hierarchy is established through **Ambient Shadows** and **Glassmorphic** overlays. Surfaces are tiered to represent the priority of information:

1.  **Level 0 (Base):** The `background_main` color (#F5F9FC). Flat.
2.  **Level 1 (Default Card):** White background with a 1px border (#E2E8F0) and a soft, diffused shadow: `0 4px 20px -2px rgba(16, 42, 67, 0.05)`.
3.  **Level 2 (Active/Hover):** Enhanced shadow with a slight vertical offset to suggest "lift": `0 12px 30px -4px rgba(16, 42, 67, 0.1)`.
4.  **Glass Layers:** Use a background blur of 12px and 80% opacity on the `background_secondary` color for navigation bars or floating AI panels, creating a sense of "living" software.

## Shapes

The shape language is "Soft Professional." This design system avoids aggressive corners to maintain a welcoming, modern healthcare feel while retaining enough structure for serious clinical use.

- **Cards & Containers:** Use `rounded-2xl` (1.5rem / 24px) to create the signature soft-shell look.
- **Buttons & Inputs:** Use `rounded-lg` (0.5rem / 8px) to maintain a more functional, precise feel for interactive elements.
- **Avatars & Status Indicators:** Use fully circular (rounded-full) shapes to contrast with the rectangular grid.

## Components

### Buttons
- **Primary:** Background `#0E9F9A`, Text `#FFFFFF`, `rounded-lg`. High-contrast for life-critical actions.
- **Secondary:** Background `transparent`, Border 2px `#0E9F9A`, Text `#0E9F9A`.
- **Ghost:** Background `transparent`, Text `#627D98`. Used for tertiary actions like "Cancel" or "Go Back."

### Cards
All cards must have 24px internal padding (`spacing-md`). For AI-assisted sections, apply a thin 2px gradient border using the **Soft Cyan** color to signify a "Smart" container.

### Input Fields
Inputs use a white background with a 1px border (#D1D5DB). Upon focus, the border changes to `secondary_color` (Teal) with a subtle 4px glow in the same color at 10% opacity.

### Chips/Tags
Use for patient status (e.g., "Stable," "Critical"). Chips should have a light tinted background of their status color (10% opacity) and the full-strength status color for the text.

### Clinical Data Tables
Rows should have a height of 56px. Use `text_primary` for data values and `text_secondary` for table headers in `label-sm` (all caps). Use subtle 1px horizontal dividers—never vertical lines—to keep the layout clean and airy.

### Patient Profile Header
A glassmorphic header component that sticks to the top of the viewport during scroll, providing persistent access to patient vitals (Heart Rate, BP, Oxygen) in high-contrast Cyan text.
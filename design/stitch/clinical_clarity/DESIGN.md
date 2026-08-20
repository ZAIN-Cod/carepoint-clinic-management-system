---
name: Clinical Clarity
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf4'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dde9ff'
  surface-container-highest: '#d5e3fd'
  on-surface: '#0d1c2f'
  on-surface-variant: '#3d4947'
  inverse-surface: '#233144'
  inverse-on-surface: '#ebf1ff'
  outline: '#6d7a77'
  outline-variant: '#bcc9c6'
  surface-tint: '#006a61'
  primary: '#00685f'
  on-primary: '#ffffff'
  primary-container: '#008378'
  on-primary-container: '#f4fffc'
  inverse-primary: '#6bd8cb'
  secondary: '#55615f'
  on-secondary: '#ffffff'
  secondary-container: '#d8e5e2'
  on-secondary-container: '#5b6765'
  tertiary: '#00685c'
  on-tertiary: '#ffffff'
  tertiary-container: '#008375'
  on-tertiary-container: '#f4fffb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#89f5e7'
  primary-fixed-dim: '#6bd8cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#d8e5e2'
  secondary-fixed-dim: '#bcc9c6'
  on-secondary-fixed: '#121e1c'
  on-secondary-fixed-variant: '#3d4947'
  tertiary-fixed: '#62fae3'
  tertiary-fixed-dim: '#3cddc7'
  on-tertiary-fixed: '#00201c'
  on-tertiary-fixed-variant: '#005047'
  background: '#f8f9ff'
  on-background: '#0d1c2f'
  surface-variant: '#d5e3fd'
typography:
  headline-xl:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  unit-1: 0.25rem
  unit-2: 0.5rem
  unit-4: 1rem
  unit-6: 1.5rem
  unit-8: 2rem
  unit-12: 3rem
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
---

## Brand & Style
The design system is centered on the "Dental Fresh" aesthetic, prioritizing a sense of clinical hygiene, professional reliability, and patient tranquility. The target audience includes health-conscious individuals seeking premium dental care in a stress-free environment. 

The style utilizes a **Modern Minimalist** approach with a **Tactile** twist. It avoids the harshness of traditional medical interfaces by using soft tonal shifts and generous whitespace, creating an atmosphere that feels "breathable." Surfaces are clean and uncomplicated, evoking the feeling of a high-end, sterilized modern clinic.

## Colors
The palette is rooted in the psychology of cleanliness and trust. 

- **Primary Teal (#0D9488):** Used for primary actions, branding, and key navigational elements to establish authority and professional confidence.
- **Secondary Mint (#F0FDFA):** The foundation for backgrounds and large surface areas. It reduces eye strain and provides a cooling, sterile backdrop that is softer than pure white.
- **Tertiary Cyan (#2DD4BF):** Reserved for accent states, success indicators, and interactive highlights.
- **Slate Gray (#334155):** Ensures high-contrast readability for clinical data and patient information.
- **Surface White (#FFFFFF):** Used for elevated cards and input fields to pop against the Mint background.

## Typography
This design system employs a dual-font strategy to balance character with utility. **Outfit** is used for headlines; its geometric yet soft construction feels modern and high-end. **Inter** is used for all body copy and functional UI labels to ensure maximum legibility for medical instructions and scheduling data. 

Hierarchy is maintained through consistent line-heights that favor "airiness." Large display type should use tighter letter spacing to maintain a premium feel, while small labels use expanded tracking for clarity.

## Layout & Spacing
The layout follows a **Fixed Grid** model on desktop and a **Fluid** model on mobile. Content is centered within a 1280px container to ensure information density remains manageable and focused. 

A 12-column system is used for desktop layouts, transitioning to a 4-column system for mobile. Spacing follows a strict 4px/8px baseline rhythm. "Dental Fresh" requires intentional "over-spacing"—when in doubt, increase the margin to prevent the UI from feeling cluttered or stressful. High-priority patient actions (like "Book Appointment") should be surrounded by significant clear space.

## Elevation & Depth
Elevation is communicated through **Ambient Shadows** and **Tonal Layering**. 

1. **Base:** The Secondary Mint (#F0FDFA) acts as the canvas.
2. **Surface:** Cards and containers use a flat White (#FFFFFF) background to signify interactivity and separate content from the canvas.
3. **Shadows:** Use extremely soft, low-opacity shadows (Opacity: 4-6%, Blur: 20px) with a subtle Teal tint in the shadow color. This prevents the "dirty" look of grey shadows and keeps the UI feeling bright.
4. **Active States:** Elements being interacted with should lift slightly (y-offset increase) rather than change color drastically, maintaining the calm atmosphere.

## Shapes
The shape language is defined by **Rounded (0.5rem)** corners. This radius is large enough to feel friendly and safe, but sharp enough to maintain a clinical, professional structure. 

- Large containers and cards should use `rounded-xl` (1.5rem) to create a soft, welcoming framing for patient photos and clinic galleries.
- Buttons and input fields use the standard `rounded` (0.5rem) to signify precision.
- Interactive chips for "Service Categories" (e.g., Cleaning, Orthodontics) should use pill-shaped rounding for a tactile, "clickable" feel.

## Components
- **Buttons:** Primary buttons use a solid Teal fill with white text. Secondary buttons use a Teal outline with a subtle Mint hover state. Transitions must be smooth and slow (250ms) to mirror the calming brand voice.
- **Inputs:** Use white backgrounds with 1px Slate Gray (at 20% opacity) borders. On focus, the border thickens and changes to Primary Teal with a soft outer glow.
- **Cards:** White background, `rounded-xl` corners, and a soft ambient shadow. Cards are the primary vessel for service descriptions and dentist profiles.
- **Chips/Badges:** Used for appointment status (e.g., "Confirmed", "Pending"). These should use low-saturation versions of the status colors (Success: Mint/Teal) to avoid visual alarm.
- **Calendar/Scheduling:** A custom component using a clean grid with high whitespace. Today's date is highlighted with a Teal circle; available slots are indicated by subtle Teal outlines.
- **Progress Indicators:** Used for multi-step booking. Use thin lines and small circular nodes in Teal to maintain a light visual footprint.
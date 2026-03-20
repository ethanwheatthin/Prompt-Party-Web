# Design System Documentation: Neographic Maximalism

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Controlled Riot."** 

This system rejects the sterile, homogenized aesthetic of modern SaaS interfaces in favor of high-energy, '90s-inspired maximalism. It is a visual celebration of pop culture, comic book urgency, and tectonic movement. While traditional UI seeks to disappear, this system demands attention through intentional asymmetry, "sticker" layering, and heavy geometric weight. By utilizing a "Neographic" approach—combining raw brutalist outlines with sophisticated Material-derived tonal palettes—we create an experience that feels both nostalgic and premium.

### Breaking the Template
To avoid a "generic" look, the interface should feel physically assembled rather than digitally rendered. We achieve this through:
- **Tectonic Shifts:** Elements are rarely perfectly aligned; cards and buttons should feature a subtle 1–2 degree skew or rotation.
- **Graphic Overlays:** Information density is broken up by floating geometric patterns (squiggles, dots, and triangles) that act as visual anchors.
- **Signature Outlines:** Every container is defined by a consistent, heavy stroke that mimics high-end print editorial and street art.

---

## 2. Colors
Our palette is a high-contrast interaction between electric "Hero" tones and a clinical, high-key background.

### The Palette
- **Primary (`#aa1e6d` / `#ff6cb4`):** The "Bold Pink" core. Use this for high-impact actions and primary brand moments.
- **Secondary (`#006667` / `#5ef8f8`):** The "Electric Teal." Used for secondary actions and to balance the warmth of the pink.
- **Tertiary (`#5f5f00` / `#fbfb62`):** The "Bright Yellow." Reserved for highlight moments, warnings, and attention-grabbing accents.
- **Surface (`#f6f6f6`):** A sophisticated off-white that prevents the high-contrast elements from feeling too harsh on the eyes.

### The "No-Line" Rule
While individual components use heavy borders, **structural sectioning must never use 1px solid lines.** To divide large content areas, use background color shifts (e.g., moving from `surface` to `surface-container-low`) or "sticker" layering where a card overlaps a background pattern.

### Signature Textures & Gradients
To provide professional polish, use a **Linear Tonal Gradient** for hero sections. Transition from `primary` to `primary-container` at a 135-degree angle. This mimics the halftone color transitions seen in high-end comic production.

---

## 3. Typography
Typography is the voice of the system. We use a "Brutal-Modern" pairing.

- **Display & Headline (Space Grotesk):** This is our "chunky" display font. It should be used at large scales with tight letter-spacing. For a custom editorial feel, apply a `text-transform: uppercase` and a slight `-2px` letter spacing to `display-lg` elements.
- **Body & Labels (Work Sans):** A clean, high-legibility sans-serif that provides a "safe harbor" for information amidst the surrounding visual noise.

**Hierarchy as Identity:** The scale difference between `display-lg` (3.5rem) and `body-md` (0.875rem) is intentional. Use extreme scale shifts to guide the eye—large headers should feel like headlines in a magazine.

---

## 4. Elevation & Depth
In this system, depth is not an illusion of light—it is an illusion of **stacking.**

### The Layering Principle
Depth is achieved by stacking `surface-container` tiers. 
- **Base:** `surface`
- **Sectioning:** `surface-container-low`
- **Floating Cards:** `surface-container-lowest` (pure #ffffff)

### Hard-Drop Shadows
Forget soft, ambient shadows. We use **Comic-Book Shadows.**
- **Style:** 100% opaque or high-opacity (80%+) blocks.
- **Offset:** 4px to 8px on the X and Y axis.
- **Color:** Use the `on-primary-fixed-variant` or a deep version of the background color. This creates a "sticker" effect where the element looks like it's physically raised off the page.

### Glassmorphism
For floating navigation or "quick-action" modals, use a backdrop-blur (12px–20px) combined with a semi-transparent `surface-variant`. This allows the vibrant background patterns to bleed through, softening the layout's "brutalist" edges.

---

## 5. Components

### Buttons (The "Sticker" Style)
- **Primary:** `primary` background, 3px black border (`on-surface`), `on-primary` text.
- **State Change:** On hover, the button should shift -4px X and -4px Y, while the "hard shadow" remains stationary, creating a "press" effect.
- **Shape:** 0px border-radius (Total Square).

### Cards & Containers
- **Forbid Dividers:** Do not use lines to separate content within a card. Use `3.5rem` (Spacing 10) of vertical white space or a subtle background shift to `surface-container-high`.
- **Skew:** Apply a `transform: rotate(-1deg)` to every third card in a grid to break the "bootstrap" feel.

### Geometric Accents
- **Patterns:** Use the `tertiary` and `secondary` tokens to create background "confetti" (dots, triangles). These should be placed behind main content containers to create layers.

### Input Fields
- **Style:** 3px solid black border. 
- **Focus State:** Background shifts to `tertiary_fixed` (Bright Yellow). This provides a high-energy feedback loop for user interaction.

---

## 6. Do's and Don'ts

### Do
- **Do** lean into asymmetry. A header that hangs off the edge of a container is a feature, not a bug.
- **Do** use the Spacing Scale rigorously. High-energy designs require significant "air" (Spacing 12 and 16) to remain readable.
- **Do** mix geometric patterns. A "squiggle" icon next to a "dot" grid adds authentic '90s texture.

### Don't
- **Don't** use border-radius. This system is strictly 0px. Rounded corners will dilute the "cut-and-paste" energy.
- **Don't** use standard "drop shadows." If it doesn't look like it was drawn with a sharpie, it doesn't belong here.
- **Don't** use 1px lines. If a border is needed, it must be at least 3px (the "Heavy Outline" rule).
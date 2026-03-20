# Prompt Party Design System: Neographic Maximalism

## 1. Overview & Creative North Star

The creative north star is **"The Controlled Riot."**

Prompt Party rejects sterile, minimalist UI in favor of high-energy, '90s-inspired maximalism. The interface should feel physically assembled — like stickers slapped onto a zine — not digitally rendered. Every screen, from the host display to the player's phone, should radiate party energy and comic-book urgency.

### Core Principles
- **Tectonic Shifts:** Cards and containers use subtle 1-2 degree rotation to feel "placed" rather than pixel-perfect.
- **Sticker Layering:** Depth comes from overlapping elements with hard shadows, not soft ambient glows.
- **Heavy Outlines:** Every container is defined by thick black strokes (3px+), mimicking street art and print editorial.

---

## 2. Color Palette

High-contrast interaction between electric hero tones and a clinical background.

| Token | Hex | Tailwind | Usage |
|-------|-----|----------|-------|
| Pink (Primary) | `#ff66b2` | `party-pink` | Brand, headings, high-impact actions, urgent timer states |
| Teal (Secondary) | `#5ef8f8` | `party-teal` | Secondary actions, info boxes, timer default, vote selection |
| Yellow (Accent) | `#fbfb62` | `party-yellow` | Room codes, card headers, highlights, badges, winner prompts |
| Background | `#f6f6f6` | `party-bg` | Base surface with dotted pattern overlay |
| Ink / Borders | `#000000` | — | All borders, text, hard shadows |
| Success Green | `#16a34a` | — | "Your prompt won" badges, online status dots |
| Error Red | `#b00020` | — | Error messages (on `#fff0f2` background) |

### Background Texture
Every page uses a dotted radial pattern on the base surface:
```css
background-color: #f6f6f6;
background-image: radial-gradient(#e5e5e5 1px, transparent 1px);
background-size: 20px 20px;
```

### Rules
- **No 1px lines.** If a border is needed, it must be at least 3px.
- Structural sectioning uses background color shifts or sticker layering, never hairline dividers.

---

## 3. Typography

- **Font:** Space Grotesk (loaded via Google Fonts on both host and player pages)
- **Headings:** `font-weight: 900`, `text-transform: uppercase`, `letter-spacing: -0.05em`, often italic
- **Body / Labels:** `font-weight: 700`
- **Room codes:** The largest, most vibrant element on any screen — yellow background, massive bold font

Use extreme scale shifts between headings and body text. Large headers should feel like magazine headlines.

---

## 4. Elevation & Depth

Depth is an illusion of **stacking**, not lighting.

### Hard-Drop Shadows
Forget soft ambient shadows. Prompt Party uses comic-book shadows:
- **Standard elements:** `box-shadow: 4px 4px 0 0 rgba(0,0,0,1)`
- **Cards / stickers:** `box-shadow: 8px 8px 0 0 rgba(0,0,0,1)`
- **Small elements (list items, badges):** `box-shadow: 3px 3px 0 0 rgba(0,0,0,1)`
- **Color:** Always 100% opaque black

### Decorative Shapes
Absolute-positioned pink/teal/yellow squares, triangles, and circles with rotation, placed at `z-index: -1` behind main content to create layered depth.

---

## 5. Components

### Buttons — "Tactile Press-Down"
Every button has a physical press interaction:
```
/* Base */
border: 3px solid #000;
font-weight: 900;
text-transform: uppercase;
box-shadow: 4px 4px 0 0 rgba(0,0,0,1);

/* Hover — lifts up */
transform: translate(-2px, -2px);
box-shadow: 6px 6px 0 0 rgba(0,0,0,1);

/* Active / Pressed — slams down */
transform: translate(0, 0);
box-shadow: none;

/* Transition */
transition: all 75ms ease;
```

Button variants:
| Variant | Background | Text | Context |
|---------|-----------|------|---------|
| Primary | `#fbfb62` | `#000` | Join game, main actions |
| Pink | `#ff66b2` | `#000` | Submit prompt, high-energy actions |
| Green | `#16a34a` | `#fff` | Confirmation actions |

### Cards & Containers — "Sticker" Style
```
background: #fff;
border: 3px solid #000;
box-shadow: 8px 8px 0 0 rgba(0,0,0,1);
```
- Card headers use colored backgrounds (`#fbfb62` yellow, `#5ef8f8` teal) with a 3px bottom border
- Apply `transform: rotate(-1deg)` to `rotate(2deg)` on select cards for sticker energy
- **Never** use divider lines inside cards — use spacing or background color shifts

### Input Fields
```
border: 3px solid #000;
padding: 12px;
font-weight: 700;
font-size: 16px;
outline: none;

/* Focus */
box-shadow: 0 0 0 4px rgba(94, 248, 248, 0.3);
```
- No border-radius, ever
- Placeholder text: `color: #aaa`

### Badges / Tags
```
border: 3px solid #000;
padding: 4px 12px;
font-weight: 900;
text-transform: uppercase;
font-size: 11px;
```
Variants: `.badge-teal` (`#5ef8f8`), `.badge-pink` (`#ff66b2`), `.badge-yellow` (`#fbfb62`)

### Vote Cards
Interactive cards with the same tactile press-down as buttons:
- Default: white background, 3px border, 4px hard shadow
- Selected: `#5ef8f8` teal background
- Disabled: `opacity: 0.4`, cursor not-allowed, no hover effect

### Timer
```
background: #5ef8f8;
border: 3px solid #000;
box-shadow: 4px 4px 0 0 rgba(0,0,0,1);
font-weight: 900;
font-style: italic;
font-size: 32px;
```
- Urgent state (< 10s): background switches to `#ff66b2` pink with a pulse animation

### Splash Screens
Full-screen overlays for phase transitions (e.g., "ALL PROMPTS IN!"):
- Background: `#fbfb62` yellow
- Title: 42px, black, bold italic uppercase with pulse animation
- Subtitle: 22px, `#ff66b2` pink
- Fade-in with scale animation, fade-out after delay

### Player List Items
```
padding: 10px 14px;
border: 3px solid #000;
box-shadow: 3px 3px 0 0 rgba(0,0,0,1);
font-weight: 700;
text-transform: uppercase;
```
- Online status dot: 10px circle, green (`#16a34a`) or gray (`#9ca3af`), 2px black border

---

## 6. Game-Specific Patterns

### Host Display (React + Tailwind)
- Uses Tailwind utility classes with custom tokens (`party-pink`, `party-teal`, `party-yellow`, `party-bg`)
- Most colors used as arbitrary values: `bg-[#ff66b2]`
- Phase components: LobbyPhase, PromptPhase, VotingPhase, PerformancePhase, LeaderboardPhase, ActorRevealPhase
- Room code is always the dominant visual element

### Player Pages (Vanilla HTML/CSS/JS)
- `player.html`, `lobby.html`, `round.html` in `backend/public/`
- Styled with `player.css` — must match the design system manually (no Tailwind)
- Shared utilities in `shared.js`

---

## 7. Do's and Don'ts

### Do
- Lean into asymmetry — a header that hangs off the edge of a container is a feature
- Use generous spacing between elements to keep high-energy designs readable
- Mix geometric decorative patterns (dots, triangles, squiggles) behind content
- Make every interactive element feel physically pressable

### Don't
- **Never** use `border-radius` — this system is strictly 0px everywhere
- **Never** use soft/ambient shadows — if it doesn't look drawn with a marker, it doesn't belong
- **Never** use 1px borders — minimum 3px (the "Heavy Outline" rule)
- **Never** use rounded corners on inputs, buttons, cards, or any element
- **Never** use subtle, muted color palettes — colors should be electric and unapologetic

# Test Assignment: Interactive Line Chart

## Goal

Build an interactive **Line Chart** to visualize A/B test statistics.

The project **must be published on GitHub Pages**.

---

## Data

Use data from `data.json`, which contains fields `date`, `visits`, and `conversions` for each variation.

You need to calculate:

```js
conversionRate = (conversions / visits) * 100;
```

---

## Design

The design mockup is provided in the file `mockup.sketch`.

You can open it using **[Lunacy](https://icons8.ru/lunacy)** — a free Sketch-compatible design tool available for all operating systems.

---

## Requirements

- Display a **conversion rate (conversionRate)** line chart for all variations, showing all values as **percentages**.
- On **hover**, show a **vertical line** and a **popup** with daily data.
- At least **one variation must always be selected**.
- When variations are toggled, both X and Y axes must **adapt automatically** to the visible data range.
- Display all values as **percentages**.
- Responsive layout for screens between **671 px** and **1300 px**.
- Controls:
  - **Variations selector** (choose which lines to display)
  - **Day / Week selector**

---

## Bonus Features

- Zoom / Reset zoom
- Line style selector (`Line`, `Smooth`, `Area`)
- Light / Dark theme toggle
- Export chart to PNG

---

## Tech Stack

- **React + TypeScript**
- Any charting library (e.g. **D3**, **VisX**, **Recharts**, etc.)
- Use **CSS Modules** for component styling.
- The project must:
  1. Be published on **GitHub Pages**
  2. Include a **README** with setup instructions and a short feature overview

---

## Deliverables

1. GitHub repository with full source code
2. Live demo on GitHub Pages
3. Clear README including:
   - Chosen visualization library
   - Implemented and bonus features
   - Local setup instructions


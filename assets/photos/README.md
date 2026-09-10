# Photos

Drop real photos in here with these exact filenames. Each `<img data-photo="...">`
in `index.html` already points at them, so no code changes are needed once
the files exist. Until then, each frame shows a graceful placeholder.

Every chapter supports more than one photo. The layout adapts to how many
`.photo-frame` blocks are in the markup for that chapter:

- **1 photo**: a single frame.
- **2 photos**: a primary frame with a smaller one pinned over its corner.
- **3+ photos**: a grid mosaic, first photo spanning the top.

To add another photo to a chapter, duplicate one of its `.photo-frame` divs
in `index.html` and give the `<img>` the next number in that chapter's
sequence (e.g. `redesk-3.jpg`). The CSS mosaic picks it up automatically.

| Filename | Chapter |
|---|---|
| `citizen-capital-1.jpg`, `citizen-capital-2.jpg` | Analyst, Citizen Capital |
| `redesk-1.jpg`, `redesk-2.jpg` | Co-building Redesk, alongside ESSEC |
| `joko-1.jpg`, `joko-2.jpg` | Account Executive, Joko |
| `sport-1.jpg`, `sport-2.jpg`, `sport-3.jpg` | Sport, always |
| `phoenix-races-1.jpg`, `phoenix-races-2.jpg` | Founder, Phoenix Races |

Frames crop to a portrait or square ratio depending on their spot in the
mosaic (`object-fit: cover`). A vertical or square photo crops cleanly; a
wide landscape will lose its edges. No stock or AI-generated imagery.

# Home page hero images

The homepage hero carousel (`src/components/public/HeroCarousel.tsx`) reads
from this folder. Files are currently placeholders — replace them with real
photos **using the same filenames** and they'll show up automatically, no
code changes needed:

| File | Suggested content |
| --- | --- |
| `hero-1.svg` (or `.jpg`) | Main gate / entrance |
| `hero-2.svg` (or `.jpg`) | Community park |
| `hero-3.svg` (or `.jpg`) | Clubhouse & amenities |
| `hero-4.svg` (or `.jpg`) | Neighbourhood streets |

**If you switch to real photos**, use `.jpg` or `.webp` (not `.svg`) and
update the `HERO_IMAGES` array in `src/app/(public)/page.tsx` to point at
the new extensions. Recommended: landscape orientation, at least 1600px
wide, each under ~300KB (compress before adding — this repo doesn't run
image optimization at upload time).

To add more than 4, or reorder them, just edit `HERO_IMAGES` in
`src/app/(public)/page.tsx`.

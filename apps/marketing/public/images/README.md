# Images

Drop new images into the folder that matches what they are. Reference them from
code as `/images/<folder>/<name>.webp` — anything starting with `/` is served
straight from `public/`.

| Folder        | What goes here                                               |
|---------------|--------------------------------------------------------------|
| `hero/`       | Homepage hero frames and backgrounds                          |
| `sections/`   | Images belonging to one homepage section (Visit Us, promos)   |
| `categories/` | Category tiles and collection headers                         |
| `brand/`      | Logo marks, favicons, watermarks, Open Graph cards            |
| `_unused/`    | Superseded files kept for reference. Safe to delete.          |

## The loose .webp files at this level

Nine files sit directly in this folder rather than in a subfolder:

    bangles1  bracelet2  bridaljewel  dailywear_image  earring1
    earring2  necklace1  rings  rings2

They stay here because **the database stores their paths** as
`/images/<name>.webp` — in `product_images.storage_path` and
`categories.hero_image_path`. Moving one breaks that product or category on the
live site until the row is updated too.

When the catalogue is reseeded, these should move into the `product-images`
Supabase bucket like every other product photo, and this folder will be left
holding only the subfolders above.

## Product photography does NOT go here

Product images are uploaded through the admin panel and live in Supabase
storage, not in this folder. `productImageUrl()` in `src/lib/supabase.ts`
decides: a path starting with `/` is served from here, anything else is fetched
from the `product-images` bucket.

The loose `.webp` files still sitting in this folder are seeded Nihaa data
referenced by `/images/<name>.webp` paths in the database — they are only here
because the seed migration predates the storage bucket.

## Before committing an image

- **Convert to `.webp`** — a JPEG or PNG of the same picture is usually 3–5x larger.
- **Resize to what the page actually renders.** A 2752px-wide file in a 600px
  slot costs the visitor bandwidth for pixels they never see. 1800px is plenty
  for a full-bleed hero; 900px for a card.
- **Target under ~150KB.** Several files here arrived at 800–900KB and
  compressed to under 130KB with no visible difference.
- **Check for watermarks** in the bottom-right corner if the image came from an
  AI generator.

`sharp` is available locally for all of the above.

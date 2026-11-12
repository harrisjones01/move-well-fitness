# MoveWell — a complete fitness & exercise website

A fully built, static fitness site covering **gym strength, yoga, home workouts,
cardio, mobility and active aging** — with content written for **five different age
groups**, plus every supporting page a real site needs.

**46 pages, all `.html`. No frameworks, no build dependencies (Python 3 only), no PHP, no tracking by default.**

---

## 1. Look at it

```bash
cd movewell
python3 -m http.server 8080        # then open http://localhost:8080
```

Plain HTML + one CSS file + one JS file. It runs anywhere — shared hosting, Netlify,
Vercel, GitHub Pages, or a folder on a USB stick.

## 1b. The logo files

`images/logo/` holds 35 PNG versions of the MoveWell logo — horizontal lockups,
square app icons, favicons and a social-share card, all with transparent
backgrounds. See `images/logo/README.md` for which file to use where.

The pages already reference the favicon and Apple touch icon:

```html
<link rel="icon" href="static/favicon.svg" type="image/svg+xml">
<link rel="icon" href="images/logo/favicon-32.png" sizes="32x32" type="image/png">
<link rel="icon" href="images/logo/favicon-16.png" sizes="16x16" type="image/png">
<link rel="apple-touch-icon" href="images/logo/logo-icon-180.png">
```

The header and footer use an inline SVG copy of the same mark, so the logo stays
sharp at any size with no extra request.

---

## 2. What's inside

```
movewell/
├── index.html                    Home — hero, 6 styles, 5 age groups, featured, latest, blog
├── exercises.html                All 13 guides with live level + age filters
├── age-groups.html               Hub for the five age groups
├── blog.html                     Article index
├── category-*.html               6 style pages (gym, yoga, home, cardio, mobility, active aging)
├── age-*.html                    5 age pages (youth, teens, adults, midlife, older adults)
├── exercise-*.html               13 full exercise guides
├── blog-*.html                   6 long-form coaching articles
├── about.html                    About, coaches, review process, funding
├── contact.html                  "Ask a coach" form with age/experience fields
├── advertise.html                Media kit (needed for ad networks & sponsors)
├── disclaimer.html               ⚠️ Health disclaimer — the important one
├── privacy-policy.html           GDPR privacy policy (incl. health-data section)
├── cookie-policy.html            Cookie policy with Google advertising disclosure
├── terms.html                    Terms of use, incl. exercise-at-your-own-risk
├── editorial-policy.html         How guides are written, reviewed and corrected
├── accessibility.html            WCAG 2.2 AA statement
├── search.html                   Instant client-side search
├── sitemap.html · 404.html
├── robots.txt · sitemap.xml · ads.txt · feed.xml
├── static/style.css              Design system — dark green + "volt" lime
├── static/site.js                Nav, filters, search, cookies, saved guides, forms
├── images/  full/ · cards/ · thumbs/   3 pre-cropped sizes each
├── content_exercises.py          Site settings, categories, age groups, 13 exercises
├── content_blogs.py              6 articles
└── build/build.py                The generator
```

### The 13 exercise guides

| Guide | Style | Level | Ages |
|---|---|---|---|
| Goblet Squat | Gym | Beginner | teen → senior |
| Push-Up Progressions (zero → 20) | Home | Beginner | youth → midlife |
| Deadlift Technique | Gym | Intermediate | adults, midlife |
| 15-Minute Morning Yoga Flow | Yoga | All levels | teen → senior |
| Chair Yoga & Balance for Older Adults | Active aging | Beginner | midlife, senior |
| 20-Minute No-Equipment Home Circuit | Home | All levels | teen → midlife |
| Dead Bug (core stability) | Mobility | Beginner | **all five groups** |
| HIIT Intervals for Beginners | Cardio | Beginner | teen → midlife |
| Zone 2 Cardio | Cardio | All levels | adults → senior |
| 10-Minute Daily Mobility Routine | Mobility | All levels | teen → senior |
| 5-Minute Desk Break | Mobility | All levels | teen → senior |
| Movement Games for Kids 5–12 | Home | Beginner | youth |
| Strength Training After 60 | Active aging | Beginner | senior |

Every guide includes: why it works, primary/secondary muscles, a facts panel
(sets, reps, rest, tempo, burn), equipment, numbered set-up and execution steps,
**common mistakes with fixes**, coaching cues and progressions, **safety notes**,
age suitability, a 4–5 question FAQ, author + medical reviewer, and print styles.

## 3. The age-group system

The brief was "exercises for all age groups", so age is a first-class dimension,
not a tag:

- **Five age pages** (`age-youth.html` … `age-senior.html`), each with copy written
  for that group's loading, range-of-motion and recovery needs.
- **Live filters** on `exercises.html` — combine level + age and the grid narrows
  with a live count.
- **Age suitability block** on every guide, linked to the age pages.
- Youth content is play-based and explicitly avoids heavy loading; senior content
  is chair-supported with balance and bone-density framing.

## 4. Editing content

All copy lives in two Python files. You never touch HTML.

**`content_exercises.py`** — `SITE` (name, emails, address, domain), `CATEGORIES`,
`AGE_GROUPS`, and `EXERCISES`. Each exercise is one dict: title, description,
`category`, `level`, `ages`, `goal`, `equipment`, `primary`/`secondary` muscles,
`sets`, `rest`, `tempo`, `calories`, `setup` (list of `(title, detail)` pairs),
`steps`, `faults`, `tips`, `faq`, `safety`, `related`.

**`content_blogs.py`** — the `BLOGS` list. Body blocks: `("p", t)`, `("h2", t)`,
`("h3", t)`, `("ul", [...])`, `("ol", [...])`, `("quote", t)`, `("callout", title, text)`.

Then rebuild:

```bash
cd build && python3 build.py
```

Every page, the sitemap, the RSS feed and the search index regenerate. Change
`SITE["name"]` and it updates across all 46 pages including the schema markup.

## 5. Google display ads

See **`ADS_SETUP.md`**. Short version: set `ADSENSE_CLIENT` in `build/build.py`
and rebuild — every reserved slot becomes a live AdSense unit.

Already built in:
- Reserved ad containers with fixed `min-height` (no layout shift / good CLS)
- `ads.txt` and `robots.txt` allowing `Mediapartners-Google` + `AdsBot-Google`
- Cookie consent banner that stores the choice and emits a `movewell:consent` event
- **All the pages ad networks require for approval** — including an about page,
  contact page, privacy policy, cookie policy, terms and editorial policy
- **An explicit health disclaimer**, which matters a great deal for fitness sites
- Ads never sit inside the step-by-step instructions

## 6. SEO that's already wired up

| Feature | Where |
|---|---|
| `HowTo` schema (step-by-step instructions + supplies) | every exercise guide |
| `FAQPage` schema | every exercise guide |
| `ExerciseAction` + `Article` schema with ratings | every exercise guide |
| `BreadcrumbList` + visible breadcrumbs | all inner pages |
| `BlogPosting`, `CollectionPage`, `WebSite`+`SearchAction`, `AboutPage`, `ContactPage` | relevant pages |
| Unique, length-checked title + description on all 46 pages | verified < 70 / < 175 chars |
| Canonical URLs, Open Graph, Twitter cards | every page |
| `sitemap.xml`, `robots.txt`, RSS `feed.xml` | site root |
| Semantic HTML: one `<h1>`, landmarks, skip link, alt text on every image | all pages |
| System fonts only — zero render-blocking font requests | `style.css` |

## 7. Performance

- No framework, no CSS library, no web fonts. One CSS file, ~7 KB of deferred JS.
- Images pre-cropped at 3 sizes (`cards` 900×675, `full` 1200×800, `thumbs` 420×315),
  lazy-loaded below the fold with explicit width/height.
- Hero image uses `fetchpriority="high"`; everything else lazy.
- The site works fully with JavaScript disabled (only filters/search need it).

## 8. Deployment

Static, so anything works: Netlify / Vercel / Cloudflare Pages (drag the folder),
GitHub Pages, or FTP to `public_html`.

After going live:
1. Change `SITE["url"]` in `content_exercises.py` to your real domain, rebuild.
2. Submit `sitemap.xml` in Google Search Console.
3. Set `ADSENSE_CLIENT` and add your `ads.txt` line.
4. Wire the contact/newsletter forms to a real endpoint (they currently show a
   success state and reset — see `static/site.js`, the `data-newsletter` handler).

## 9. Things worth knowing

- **The health disclaimer is not decoration.** Fitness content carries real injury
  risk and, unlike recipes, genuine legal exposure. `disclaimer.html` and the
  safety note on every guide are written to be defensible. Don't remove them,
  and keep the "get clearance first" list.
- **The coaches and reviewers are placeholders.** Replace the names, credentials
  and bios on `about.html` (and the `author`/`reviewed` fields) with real people
  before publishing. Claiming medical review you don't have would be a serious
  misrepresentation — and for a health site, potentially a legal one.
- **Placeholder figures** — 31,000 readers, 165k pageviews, ratings and review
  counts — are examples. Replace with real numbers (or remove them) before launch.
- **Photography.** Ten of the images are AI-generated concept shots; five are
  in-house variations of those (mirrored/reframed so no two guides share a photo).
  For a fitness site, readers expect real demonstrations: replace them with
  photographed or filmed reps of the actual exercise when you can. The alt text
  is written to describe the pictured position, so update it alongside any swap.
- **The cookie banner is a UI, not a certified CMP.** Serving personalised ads to
  EU/UK visitors requires a Google-certified CMP — see `ADS_SETUP.md`.

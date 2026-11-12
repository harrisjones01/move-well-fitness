# Serving Google display ads on MoveWell

The technical work is done. This is the order to do things in, plus the compliance
points that get health and fitness sites rejected or, worse, penalised.

---

## Step 1 — Before you apply

AdSense reviews content and structure. Structure is already handled; check these:

- [ ] **Real domain, live and public.** Not localhost, not a builder subdomain.
- [ ] **Original content.** 13 full guides (~1,400 words each) and 6 articles
      (~1,000 words each). Do **not** replace this with scraped or spun text —
      it is the most common rejection reason.
- [ ] **Those pages exist and are linked in the footer:** About, Contact, Privacy,
      Cookies, Terms, Disclaimer. ✅ all built.
- [ ] **Every page reachable in ≤2 clicks.** ✅ verified.
- [ ] **No broken links.** ✅ verified — 0 broken internal links across 46 pages.
- [ ] **Replace the placeholder figures** (31,000 readers, 165k pageviews, review
      counts and ratings on `index.html` and `advertise.html`). Reviewers dislike
      invented numbers, and for a health site, invented reviews are an FTC/consumer-law
      problem in most jurisdictions.
- [ ] **Put real people behind the "medically reviewed by" line** on every guide.
      Either name actual qualified reviewers, or remove the claim. Claiming clinical
      review you do not have is misrepresentation.

### Extra caution for fitness/health content

Google applies a stricter standard to health and fitness, and it is worth taking
seriously beyond AdSense:

- Keep the **health disclaimer** page and the **safety note on every guide**. Do not
  delete the "get medical clearance first" list.
- **No before/after transformation imagery**, no weight-loss claims, no "cure" language.
- **No supplement advertising** on guide pages. Our own rules (in
  `advertise.html` and `editorial-policy.html`) prohibit weight-loss pills, appetite
  suppressants and unproven recovery gadgets — enforce them in your ad network's
  category blocks, not just in the copy.
- If you later add affiliate links for equipment, disclose them above the fold.

## Step 2 — Apply

1. <https://adsense.google.com> → sign up with your domain.
2. Add the site; Google gives you a publisher ID like `ca-pub-1234567890123456`.
3. Verify ownership — the build injects the AdSense script into `<head>`, or use
   DNS/ads.txt.
4. Wait for review. Typically 2–4 weeks; rejections come with a reason.

## Step 3 — Switch ads on (one line)

In `build/build.py`, near the top:

```python
ADSENSE_CLIENT = "ca-pub-1234567890123456"   # your publisher ID
GA_ID = "G-XXXXXXXXXX"                       # optional, GA4
```

Rebuild:

```bash
cd build && python3 build.py
```

That one change adds the loader to every page, converts each reserved container
into a live `<ins class="adsbygoogle">` unit, and fires the required push call.

## Step 4 — Create your ad units

The build writes `data-ad-slot="0000000000"`. Either:

**Option A — Auto ads (simplest).** AdSense → Ads → By site → turn on Auto ads,
then remove the `data-ad-slot` attribute from the template. Google places ads
itself. Less control, less tuning.

**Option B — Manual units (recommended).** Create these in AdSense → Ads → By ad
unit and paste each slot ID into `ad_slot()` in `build/build.py`:

| Slot in code | Where it renders | Recommended unit |
|---|---|---|
| `leaderboard` | below header / between sections | Responsive horizontal |
| `inline` | after the step-by-step instructions | Responsive rectangle |
| `square` | guide sidebar | 300×250 / 336×280 |
| `col` | blog and policy sidebars | 300×600 (desktop) |
| `footer` | above the footer | Responsive horizontal |

Every container already reserves height, so enabling ads will not cause cumulative
layout shift — which protects your Core Web Vitals and your rankings.

## Step 5 — `ads.txt`

Add the exact line AdSense gives you to `ads.txt` in the site root:

```
google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0
```

Served at `/ads.txt` already. No BOM, no blank leading line.

## Step 6 — Consent (the legal part — do not skip)

Serving **personalised** ads to EEA, UK or Swiss visitors requires a
**Google-certified CMP** integrating with **TCF v2.2**. Without it AdSense stops
serving to EEA traffic.

The included banner (Accept all / Essential only, stored in `localStorage`)
satisfies the *UX* requirement but is **not** a certified CMP. Two paths:

1. **Google's own CMP** — free, inside AdSense → Privacy & messaging → GDPR.
   Turn on European regulations messaging and either retire our banner or keep it
   for non-EEA visitors. Fastest compliant route.
2. **Third-party CMP** (Cookiebot, Osano, Didomi, Usercentrics). Add their script
   and forward our choice if you keep the banner:

```js
document.addEventListener("movewell:consent", (e) => {
  // e.detail.value === "all" | "essential"
  if (window.yourCmp) window.yourCmp.setConsent(e.detail.value === "all");
});
```

Also:
- **`robots.txt`** already allows `Mediapartners-Google` (required for AdSense to
  read your pages) and `AdsBot-Google`. Do not remove those lines.
- **Cookie policy** already contains the Google advertising disclosure and opt-out
  links (Google Ads Settings, aboutads.info). Keep it.
- **Consent Mode v2** (GA4 + Ads): add `gtag('consent','default',…)` before the GA
  snippet and update it on the `movewell:consent` event.

## Step 7 — Once approved, tune it

- **Start at 3–4 ads per page.** Density beyond that hurts reading and, in Google's
  view, the value of your inventory.
- **The highest-earning slot on an instructional page is the in-content rectangle
  after the instructions.** People scroll to the end of a step list and stop there.
- **Never place an ad inside the numbered steps or the set-up list.** It raises
  invalid-traffic risk and it is genuinely dangerous on a site about physical
  technique — a reader following a squat cue should not be interrupted by an ad.
- **Check viewability** after two weeks. Below 50% usually means the slot is too
  far down the page.
- Replace the placeholder traffic figures as real ones arrive.

---

## Ad slot map (already in the HTML)

| Page type | Slots |
|---|---|
| Home | leaderboard (top), leaderboard (mid), footer |
| Exercise guide | leaderboard (below header), square (sidebar), inline (after instructions), footer |
| Blog post | col (sticky sidebar), inline (end of article), footer |
| Index pages | leaderboard (top), leaderboard (bottom), footer |
| Age / category pages | leaderboard (top), footer |
| About / Contact / Advertise / Policies | col (sidebar), footer |
| Search | leaderboard, footer |

All containers are labelled "Advertisement", use `role="complementary"` +
`aria-label`, and are hidden in the print stylesheet so printed gym copies stay clean.

/* MoveWell — small, dependency-free progressive enhancements.
   Nothing here is required to read a guide; it only improves it. */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------- mobile navigation ---------------- */
  var navToggle = $("#nav-toggle");
  var nav = $("#site-nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && window.innerWidth <= 820) {
        nav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------------- header search ---------------- */
  var searchToggle = $("#search-toggle");
  var searchPanel = $("#search-panel");
  if (searchToggle && searchPanel) {
    searchToggle.addEventListener("click", function () {
      var open = searchPanel.classList.toggle("open");
      searchToggle.setAttribute("aria-expanded", String(open));
      if (open) { var i = $("input", searchPanel); if (i) i.focus(); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && searchPanel.classList.contains("open")) {
        searchPanel.classList.remove("open");
        searchToggle.setAttribute("aria-expanded", "false");
        searchToggle.focus();
      }
    });
  }

  /* ---------------- back to top ---------------- */
  var toTop = $("#to-top");
  if (toTop) {
    window.addEventListener("scroll", function () {
      toTop.classList.toggle("show", window.scrollY > 700);
    }, { passive: true });
    toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  }

  /* ---------------- cookie consent ---------------- */
  var CONSENT_KEY = "movewell_consent";
  var banner = $("#cookie-banner");
  function readConsent() { try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; } }
  function writeConsent(v) {
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify({ value: v, at: Date.now(), v: 1 })); } catch (e) {}
    if (banner) banner.classList.remove("show");
    document.dispatchEvent(new CustomEvent("movewell:consent", { detail: { value: v } }));
  }
  if (banner && !readConsent()) setTimeout(function () { banner.classList.add("show"); }, 1200);
  $$("[data-consent]").forEach(function (b) {
    b.addEventListener("click", function () { writeConsent(b.getAttribute("data-consent")); });
  });
  document.addEventListener("click", function (e) {
    var reset = e.target.closest("[data-cookie-settings]");
    if (reset && banner) {
      try { localStorage.removeItem(CONSENT_KEY); } catch (err) {}
      banner.classList.add("show");
    }
  });

  /* ---------------- forms ---------------- */
  $$("form[data-newsletter], form[data-contact]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector("[data-status]") || form.parentElement.querySelector("[data-status]");
      if (status) status.classList.add("show");
      form.reset();
      // Deployment: POST to your ESP / form endpoint here.
    });
  });

  /* ---------------- save a guide ---------------- */
  var SAVE_KEY = "movewell_saved";
  function getSaved() { try { return JSON.parse(localStorage.getItem(SAVE_KEY) || "[]"); } catch (e) { return []; } }
  $$("[data-save-exercise]").forEach(function (btn) {
    var slug = btn.getAttribute("data-save-exercise");
    var label = btn.querySelector("span");
    function paint(on) {
      btn.setAttribute("aria-pressed", String(on));
      if (label) label.textContent = on ? "Saved" : "Save";
      btn.style.color = on ? "var(--clay)" : "";
    }
    paint(getSaved().indexOf(slug) > -1);
    btn.addEventListener("click", function () {
      var list = getSaved(), i = list.indexOf(slug);
      if (i > -1) { list.splice(i, 1); paint(false); } else { list.push(slug); paint(true); }
      try { localStorage.setItem(SAVE_KEY, JSON.stringify(list)); } catch (e) {}
    });
  });

  /* ---------------- exercise index filters ---------------- */
  var grid = $("#exercise-grid");
  if (grid && grid.children.length) {
    var cards = $$(".card", grid);
    var state = { level: "", age: "" };
    var countEl = $("#filter-count");
    var emptyEl = $("#filter-empty");

    // annotate cards with their data so filtering needs no extra markup
    cards.forEach(function (card) {
      var tags = $$(".card-tags .pill", card).map(function (p) { return p.textContent.trim(); });
      card.dataset.level = tags[0] || "";
      var link = card.querySelector("h3 a");
      card.dataset.slug = link ? link.getAttribute("href") : "";
    });

    function apply() {
      var shown = 0;
      cards.forEach(function (card) {
        var okLevel = !state.level || card.dataset.level === state.level;
        // age filtering is driven by the embedded map (set below)
        var okAge = !state.age || (card.dataset.ages || "").split(" ").indexOf(state.age) > -1;
        var show = okLevel && okAge;
        card.style.display = show ? "" : "none";
        if (show) shown++;
      });
      if (countEl) {
        var bits = [];
        if (state.level) bits.push(state.level.toLowerCase());
        if (state.age) bits.push("age group selected");
        countEl.innerHTML = "Showing <b>" + shown + "</b> of " + cards.length + " guides" +
          (bits.length ? " · " + bits.join(", ") : "");
      }
      if (emptyEl) emptyEl.style.display = shown ? "none" : "block";
    }

    // age metadata (kept small and separate so the card markup stays clean)
    var AGES = {
      "goblet-squat": "teen adult midlife senior",
      "pushup": "youth teen adult midlife",
      "deadlift": "adult midlife",
      "yoga-morning-flow": "teen adult midlife senior",
      "yoga-senior-balance": "senior midlife",
      "bodyweight-circuit": "teen adult midlife",
      "dead-bug": "youth teen adult midlife senior",
      "hiit-intervals": "teen adult midlife",
      "zone-2-cardio": "adult midlife senior",
      "mobility-routine": "teen adult midlife senior",
      "desk-break": "teen adult midlife senior",
      "kids-movement-games": "youth",
      "senior-strength": "senior"
    };
    cards.forEach(function (card) {
      var slug = (card.dataset.slug || "").replace("exercise-", "").replace(".html", "");
      card.dataset.ages = AGES[slug] || "";
    });

    function bind(attr, key) {
      // the chips themselves carry the attribute, so select them directly
      var chips = $$("[" + attr + "]");
      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          chips.forEach(function (c) { c.classList.remove("active"); });
          chip.classList.add("active");
          state[key] = chip.getAttribute(attr) || "";
          apply();
        });
      });
    }
    bind("data-filter-level", "level");
    bind("data-filter-age", "age");
    apply();
  }

  /* ---------------- search page ---------------- */
  var index = window.MOVEWELL_INDEX;
  var resultsBox = $("#search-results");
  if (index && resultsBox) {
    var countEl = $("#search-count");
    var params = new URLSearchParams(location.search);
    var form = $("#search-page-form");
    var input = $("#q");

    function card(item) {
      return '<article class="post-row">' +
        '<a class="thumb" href="' + item.u + '" tabindex="-1" aria-hidden="true">' +
        '<img src="images/cards/' + item.img + '" alt="" width="900" height="675" loading="lazy"></a>' +
        '<div class="body"><span class="pill pill-sky">' + item.type + "</span>" +
        '<h3 style="margin-top:.5rem"><a href="' + item.u + '">' + item.t + "</a></h3>" +
        "<p>" + item.d + "</p>" +
        '<div class="post-meta"><span>' + item.meta + "</span></div></div></article>";
    }

    function run(query) {
      var q = (query || "").trim().toLowerCase(), hits;
      if (!q) {
        hits = index.slice(0, 8);
        if (countEl) countEl.textContent = "Showing the first " + hits.length + " guides — type above to narrow it down.";
      } else {
        var terms = q.split(/\s+/);
        hits = index.filter(function (it) {
          return terms.every(function (t) { return it.k.indexOf(t) > -1; });
        });
        if (countEl) {
          countEl.textContent = hits.length
            ? hits.length + (hits.length === 1 ? " result" : " results") + ' for "' + q + '"'
            : 'No results for "' + q + '". Try “squat”, “yoga”, “balance”, “senior” or “home”.';
        }
      }
      resultsBox.innerHTML = hits.length ? hits.map(card).join("")
        : '<p class="callout">Nothing matched. Browse <a href="exercises.html">all exercises</a> instead.</p>';
    }

    if (input) input.value = params.get("q") || "";
    run(params.get("q") || "");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var q = input ? input.value : "";
        history.replaceState(null, "", "?q=" + encodeURIComponent(q));
        run(q);
      });
      if (input) input.addEventListener("input", function () {
        clearTimeout(input._t);
        input._t = setTimeout(function () { run(input.value); }, 180);
      });
    }
  }
})();

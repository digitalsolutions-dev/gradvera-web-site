/* ============================================================
   First-touch campaign attribution (acquisition model §8.3).
   Runs on every page (imported by site.js). Reads click ids +
   UTM params from the URL once, stores the FIRST touch of the
   session in sessionStorage — no cookie, so it needs no consent
   and dies with the tab — and exposes window.gvAttribution() for
   the demo form. Values are length-capped here and re-validated
   server-side (src/lib/leadPayload.ts).
   ============================================================ */
(function () {
  'use strict';
  var KEY = 'gv_attr';
  var PARAMS = ['gclid', 'gbraid', 'wbraid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  var MAX = 256;

  function read() {
    try {
      var raw = window.sessionStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function write(rec) {
    try { window.sessionStorage.setItem(KEY, JSON.stringify(rec)); }
    catch (e) { /* storage blocked / full: attribution degrades to none */ }
  }
  function hasClickId(rec) { return !!(rec && (rec.gclid || rec.gbraid || rec.wbraid)); }

  function capture() {
    var qs = new URLSearchParams(window.location.search);
    var rec = {
      landingPage: window.location.pathname,
      referrer: (document.referrer || '').slice(0, MAX),
      at: new Date().toISOString(),
    };
    var any = false;
    for (var i = 0; i < PARAMS.length; i++) {
      var v = qs.get(PARAMS[i]);
      if (v) { rec[PARAMS[i]] = v.slice(0, MAX); any = true; }
    }
    var existing = read();
    // First touch wins: keep an existing record that already carries a click id
    // or a campaign. Only create it, or upgrade a bare direct visit to a real
    // campaign touch, when nothing useful is stored yet.
    if (!existing) { write(rec); return; }
    if (!hasClickId(existing) && !existing.utm_source && !existing.utm_campaign && any) { write(rec); }
  }

  /* CookieConsent.astro writes gv-consent=granted|denied; the lead contract
     (leadPayload.ts) speaks accept|reject|unset. */
  function consentState() {
    var m = document.cookie.match(/(?:^|;\s*)gv-consent=([^;]+)/);
    if (!m) return 'unset';
    var v;
    try { v = decodeURIComponent(m[1]); } catch (e) { v = m[1]; }
    if (v === 'granted') return 'accept';
    if (v === 'denied') return 'reject';
    return 'unset';
  }

  window.gvAttribution = function () {
    var rec = read() || {};
    var out = {};
    for (var i = 0; i < PARAMS.length; i++) out[PARAMS[i]] = rec[PARAMS[i]] || '';
    out.landingPage = rec.landingPage || '';
    out.referrer = rec.referrer || '';
    out.submissionPage = window.location.pathname;
    out.submittedAt = new Date().toISOString();
    out.consent = consentState();
    return out;
  };

  capture();
})();

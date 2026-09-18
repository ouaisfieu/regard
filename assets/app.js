/* Regard — JavaScript unique, sans dépendance.
   Le site reste entièrement lisible si ce fichier ne se charge pas. */
(function () {
  "use strict";

  /* ---------- thème clair / sombre ---------- */

  var KEY = "regard:theme";
  var root = document.documentElement;

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function remember(v) {
    try { localStorage.setItem(KEY, v); } catch (e) { /* mode privé */ }
  }

  var saved = stored();
  if (saved === "light" || saved === "dark") root.setAttribute("data-theme", saved);

  function current() {
    var attr = root.getAttribute("data-theme");
    if (attr) return attr;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark" : "light";
  }

  function label(btn) {
    var next = current() === "dark" ? "clair" : "sombre";
    btn.textContent = current() === "dark" ? "Thème clair" : "Thème sombre";
    btn.setAttribute("aria-label", "Basculer vers le thème " + next);
  }

  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    label(toggle);
    toggle.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      remember(next);
      label(toggle);
    });
  }

  /* ---------- sommaire : surlignage de la section lue ---------- */

  var tocLinks = Array.prototype.slice.call(document.querySelectorAll(".toc a[href^='#']"));
  if (tocLinks.length && "IntersectionObserver" in window) {
    var map = {};
    var targets = [];
    tocLinks.forEach(function (a) {
      var el = document.getElementById(decodeURIComponent(a.getAttribute("href").slice(1)));
      if (el) { map[el.id] = a; targets.push(el); }
    });
    var seen = [];
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var i = seen.indexOf(e.target.id);
        if (e.isIntersecting && i === -1) seen.push(e.target.id);
        if (!e.isIntersecting && i !== -1) seen.splice(i, 1);
      });
      tocLinks.forEach(function (a) { a.classList.remove("is-current"); });
      if (seen.length) {
        var first = targets.filter(function (t) { return seen.indexOf(t.id) !== -1; })[0];
        if (first && map[first.id]) map[first.id].classList.add("is-current");
      }
    }, { rootMargin: "-20% 0px -70% 0px" });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ---------- chronologie : filtres par thème ---------- */

  var filters = document.querySelector("[data-filters]");
  var timeline = document.querySelector("[data-timeline]");
  if (filters && timeline) {
    var items = Array.prototype.slice.call(timeline.querySelectorAll("li"));
    var counter = document.querySelector("[data-count]");

    function apply(theme) {
      var shown = 0;
      items.forEach(function (li) {
        var ok = theme === "*" || (li.getAttribute("data-theme") || "").split(" ").indexOf(theme) !== -1;
        li.hidden = !ok;
        if (ok) shown++;
      });
      if (counter) {
        counter.textContent = shown + (shown > 1 ? " repères affichés" : " repère affiché");
      }
    }

    filters.addEventListener("click", function (ev) {
      var btn = ev.target.closest("button[data-theme]");
      if (!btn) return;
      Array.prototype.forEach.call(filters.querySelectorAll("button"), function (b) {
        b.setAttribute("aria-pressed", String(b === btn));
      });
      apply(btn.getAttribute("data-theme"));
    });

    apply("*");
  }

  /* ---------- simulateur de taxe sur les plus-values ---------- */

  var sim = document.getElementById("sim");
  if (sim) {
    sim.classList.remove("sim--nojs");

    var euro = new Intl.NumberFormat("fr-BE", {
      style: "currency", currency: "EUR", maximumFractionDigits: 0
    });

    var num = function (id) {
      var el = document.getElementById(id);
      var v = parseFloat(el && el.value);
      return isFinite(v) ? v : 0;
    };
    var put = function (id, text) {
      var el = document.getElementById(id);
      if (el) el.textContent = text;
    };

    // Barème progressif des participations substantielles, par tranche.
    var PALIERS = [
      { upTo: 1000000, rate: 0 },
      { upTo: 2500000, rate: 0.0125 },
      { upTo: 5000000, rate: 0.025 },
      { upTo: 10000000, rate: 0.05 },
      { upTo: Infinity, rate: 0.10 }
    ];

    function progressif(base) {
      var tax = 0, prev = 0;
      for (var i = 0; i < PALIERS.length; i++) {
        var p = PALIERS[i];
        if (base <= prev) break;
        tax += (Math.min(base, p.upTo) - prev) * p.rate;
        prev = p.upTo;
      }
      return tax;
    }

    function compute() {
      var type = document.getElementById("sim-type").value;
      var buy = num("sim-buy");
      var sell = num("sim-sell");
      var stepEl = document.getElementById("sim-step");
      var hasStep = stepEl && stepEl.value !== "";
      var step = hasStep ? num("sim-step") : buy;
      var allow = Math.max(0, Math.min(15000, num("sim-allow")));

      var gross = sell - buy;
      put("sim-gross", euro.format(gross));

      if (type === "exempt") {
        put("sim-base", "sans objet");
        put("sim-exempt", "sans objet");
        put("sim-tax", euro.format(0));
        put("sim-advice", "L'or d'investissement, l'immobilier, l'épargne-pension, "
          + "les comptes d'épargne et les biens de collection ne relèvent pas de "
          + "cette taxe.");
        return;
      }

      // Cliquet : la référence est la valeur au 31 décembre 2025, sauf si la
      // valeur d'acquisition historique lui est supérieure.
      var reference = Math.max(buy, step);
      var base = Math.max(0, sell - reference);
      put("sim-base", euro.format(base));

      var applied = Math.min(base, allow);
      put("sim-exempt", "− " + euro.format(applied));
      var net = base - applied;

      var tax = 0, advice = "";
      if (type === "speculative") {
        tax = net * 0.33;
        advice = "Taux de 33 % appliqué aux plus-values internes — cession à un "
          + "holding contrôlé — et aux montages jugés spéculatifs.";
      } else if (type === "substantial") {
        tax = progressif(net);
        advice = "Barème progressif par tranche. L'exonération du premier million "
          + "par période glissante de cinq ans est incluse dans le premier palier ; "
          + "son articulation exacte avec l'abattement annuel dépend de la "
          + "situation, le résultat est donc indicatif.";
      } else {
        tax = net * 0.10;
        advice = "Taux ordinaire de 10 %. Depuis le 1er septembre 2026, la retenue "
          + "à la source par l'intermédiaire financier est le régime par défaut.";
      }

      put("sim-tax", euro.format(Math.round(tax)));
      put("sim-advice", advice + " Ce résultat est un ordre de grandeur, pas un "
        + "montant dû.");
    }

    sim.addEventListener("submit", function (ev) {
      ev.preventDefault();
      compute();
    });

    sim.addEventListener("reset", function () {
      window.setTimeout(function () {
        put("sim-gross", "—");
        put("sim-base", "—");
        put("sim-exempt", "—");
        put("sim-tax", "—");
        put("sim-advice", "Renseignez les montants, puis lancez le calcul.");
      }, 0);
    });

    compute();
  }

  /* ---------- ancres cliquables sur les titres ---------- */

  Array.prototype.forEach.call(
    document.querySelectorAll(".prose h2[id], .prose h3[id]"),
    function (h) {
      var a = document.createElement("a");
      a.className = "anchor";
      a.href = "#" + h.id;
      a.textContent = "#";
      a.setAttribute("aria-label", "Lien vers la section « " + h.textContent.trim() + " »");
      h.appendChild(a);
    }
  );
})();

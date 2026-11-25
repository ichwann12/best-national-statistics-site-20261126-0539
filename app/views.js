// NusaStat views: one renderer per section. Each view returns { html, mount, draw }:
// html is the section's markup, mount wires its controls once, draw paints its charts
// (draw is also called again after a window resize, so charts stay sharp).
(function () {
  var D = window.NUSA;
  var C = window.NUSACharts;

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function sourceNote(text) {
    return '<p class="source-note">Source: ' + esc(text) + '</p>';
  }

  function kpiCard(k) {
    return '<a class="kpi-card" href="' + k.route + '">'
      + '<span class="kpi-label">' + esc(k.label) + '</span>'
      + '<span class="kpi-value">' + esc(k.value) + '</span>'
      + '<span class="kpi-note">' + esc(k.note) + '</span>'
      + '<span class="kpi-change">' + esc(k.change) + '</span></a>';
  }

  function factCard(f) {
    return '<article class="fact-card"><h3>' + esc(f.label) + '</h3>'
      + '<p class="fact-value">' + esc(f.value) + '</p>'
      + '<p>' + esc(f.detail) + '</p>'
      + sourceNote(f.source) + '</article>';
  }

  function chartCard(id, title, source, height) {
    return '<section class="chart-card"><h3>' + esc(title) + '</h3>'
      + '<canvas id="' + id + '" class="chart" style="height:' + (height || 260) + 'px" role="img" aria-label="' + esc(title) + '"></canvas>'
      + sourceNote(source) + '</section>';
  }

  // ---------------------------------------------------------------- overview
  function overview() {
    var kpis = D.kpis.map(kpiCard).join('');
    var html =
      '<section class="hero"><h1>Indonesia in numbers</h1>'
      + '<p class="lede">Population, the economy, the 38 provinces, schools and hospitals — the figures people look up about Indonesia, in one place, with the source and year next to every number.</p>'
      + '<p class="hero-meta">Country: Indonesia &nbsp;·&nbsp; Capital: Jakarta &nbsp;·&nbsp; Provinces: 38 &nbsp;·&nbsp; Data years: 2019–2024</p></section>'
      + '<section aria-label="Key indicators"><h2>Key indicators</h2><div class="kpi-grid">' + kpis + '</div></section>'
      + '<section class="chart-row">'
      + chartCard('ov-gdp', 'GDP growth, 2015–2024', D.series.gdpGrowth.source)
      + chartCard('ov-pop', 'Population, 2015–2024 (millions)', D.series.population.source)
      + '</section>'
      + '<section class="explore"><h2>Explore the statistics</h2><div class="explore-grid">'
      + '<a class="explore-card" href="#/population"><strong>Population &amp; demographics</strong><span>283.5 million people, age structure, density and the ten biggest provinces.</span></a>'
      + '<a class="explore-card" href="#/economy"><strong>Economy</strong><span>GDP growth, inflation, unemployment and what the economy is made of.</span></a>'
      + '<a class="explore-card" href="#/provinces"><strong>Provinces</strong><span>All 38 provinces compared — population, area and density, sortable and searchable.</span></a>'
      + '<a class="explore-card" href="#/education-health"><strong>Education &amp; health</strong><span>Literacy, schooling, life expectancy and stunting.</span></a>'
      + '</div></section>'
      + '<section class="releases"><h2>Latest releases</h2><ul class="release-list">'
      + '<li><strong>Nov 2024</strong> — Poverty rate falls to 8.57% (September 2024), the lowest on record. <a href="#/population">See population →</a></li>'
      + '<li><strong>Nov 2024</strong> — GDP grows 5.03% in 2024; GDP per capita reaches about Rp 78.6 million. <a href="#/economy">See economy →</a></li>'
      + '<li><strong>Aug 2024</strong> — Open unemployment down to 4.91%; labour force about 152 million. <a href="#/economy">See economy →</a></li>'
      + '<li><strong>2024</strong> — Human Development Index rises to 75.02; life expectancy 74.2 years. <a href="#/education-health">See education &amp; health →</a></li>'
      + '</ul></section>';
    return {
      html: html,
      mount: function () {},
      draw: function () {
        C.drawLineChart(document.getElementById('ov-gdp'), D.series.gdpGrowth.years, D.series.gdpGrowth.values, { suffix: '%' });
        C.drawBarChart(document.getElementById('ov-pop'), D.series.population.years.map(String), D.series.population.values, { suffix: ' m' });
      },
    };
  }

  // -------------------------------------------------------------- population
  var popMode = 'total';
  function population() {
    var facts = D.demographics.map(factCard).join('');
    var rows = D.series.population.years.map(function (y, i) {
      var prev = i > 0 ? D.series.population.values[i - 1] : null;
      var g = prev ? ((D.series.population.values[i] / prev - 1) * 100).toFixed(1) + '%' : '—';
      return '<tr><td>' + y + '</td><td>' + D.series.population.values[i].toFixed(1) + '</td><td>' + g + '</td></tr>';
    }).join('');
    var html =
      '<section class="page-head"><h1>Population &amp; demographics</h1>'
      + '<p class="lede">Indonesia is the world’s fourth most populous country — about 283.5 million people in 2024, more than half of them on Java, an island smaller than the UK.</p></section>'
      + '<section class="chart-card"><h3 id="pop-chart-title">Total population, 2015–2024</h3>'
      + '<div class="tab-row" role="group" aria-label="Population chart">'
      + '<button class="tab-btn is-active" data-popmode="total">Total population</button>'
      + '<button class="tab-btn" data-popmode="age">Age structure 2024</button>'
      + '<button class="tab-btn" data-popmode="urban">Urban vs rural</button>'
      + '</div>'
      + '<canvas id="pop-chart" class="chart" style="height:280px" role="img" aria-label="Population chart"></canvas>'
      + sourceNote(D.series.population.source) + '</section>'
      + '<section><h2>People, at a glance</h2><div class="fact-grid">' + facts + '</div></section>'
      + '<section><h2>Population by year</h2><table class="data-table"><thead><tr><th>Year</th><th>Population (millions)</th><th>Growth on previous year</th></tr></thead><tbody>'
      + rows + '</tbody></table>' + sourceNote('BPS, Population Census 2020 and mid-year projections; growth computed from the rounded figures.') + '</section>';
    return {
      html: html,
      mount: function () {
        var btns = document.querySelectorAll('[data-popmode]');
        btns.forEach(function (b) {
          b.addEventListener('click', function () {
            popMode = b.getAttribute('data-popmode');
            btns.forEach(function (x) { x.classList.toggle('is-active', x === b); });
            document.getElementById('pop-chart-title').textContent =
              popMode === 'total' ? 'Total population, 2015–2024'
              : popMode === 'age' ? 'Population by broad age group, 2024'
              : 'Where Indonesians live, 2024';
            drawPop();
          });
        });
      },
      draw: drawPop,
    };
    function drawPop() {
      var cv = document.getElementById('pop-chart');
      if (!cv) return;
      if (popMode === 'age') C.drawBarChart(cv, D.series.ageStructure.labels, D.series.ageStructure.values, { suffix: '%' });
      else if (popMode === 'urban') C.drawBarChart(cv, D.series.urbanRural.labels, D.series.urbanRural.values, { suffix: '%' });
      else C.drawLineChart(cv, D.series.population.years, D.series.population.values, { suffix: ' m', floorAtZero: false });
    }
  }

  // ----------------------------------------------------------------- economy
  var ecoMetric = 'gdpGrowth';
  var ecoMeta = {
    gdpGrowth: { title: 'Real GDP growth, 2015–2024', suffix: '%' },
    inflation: { title: 'Consumer price inflation, 2019–2024', suffix: '%' },
    unemployment: { title: 'Open unemployment rate, 2019–2024', suffix: '%' },
  };
  function economy() {
    var facts = D.economy.map(factCard).join('');
    var years = D.series.gdpGrowth.years;
    var rows = years.map(function (y, i) {
      function at(key) {
        var s = D.series[key];
        var j = s.years.indexOf(y);
        return j >= 0 ? s.values[j].toFixed(2) + '%' : '—';
      }
      return '<tr><td>' + y + '</td><td>' + D.series.gdpGrowth.values[i].toFixed(2) + '%</td><td>' + at('inflation') + '</td><td>' + at('unemployment') + '</td></tr>';
    }).join('');
    var html =
      '<section class="page-head"><h1>Economy</h1>'
      + '<p class="lede">A US$ 1.4 trillion economy that has grown about 5% a year for a decade — except for the pandemic year 2020, when it shrank 2.07%.</p></section>'
      + '<section class="chart-card"><h3 id="eco-chart-title">' + ecoMeta[ecoMetric].title + '</h3>'
      + '<div class="tab-row" role="group" aria-label="Economic indicator">'
      + '<button class="tab-btn is-active" data-ecometric="gdpGrowth">GDP growth</button>'
      + '<button class="tab-btn" data-ecometric="inflation">Inflation</button>'
      + '<button class="tab-btn" data-ecometric="unemployment">Unemployment</button>'
      + '</div>'
      + '<canvas id="eco-chart" class="chart" style="height:280px" role="img" aria-label="Economic indicator chart"></canvas>'
      + sourceNote('BPS, National Accounts; Consumer Price Index; National Labour Force Survey (Sakernas).') + '</section>'
      + '<section class="chart-row">'
      + chartCard('eco-sectors', 'What the economy is made of — share of GDP, 2024 (%)', 'BPS, National Accounts 2024', 300)
      + '<section class="chart-card"><h3>Economy in brief</h3><p>Indonesia is Southeast Asia’s largest economy and the world’s 16th largest by nominal GDP. Growth is driven by household consumption (about half of GDP), manufacturing, and commodity exports — coal, palm oil and nickel. Inflation has stayed low since 2023, and unemployment is at its lowest since before the pandemic.</p>'
      + '<p>For a household, the numbers that matter most: prices rose only 1.57% in the year to December 2024, and the poverty rate fell to 8.57% in September 2024.</p>'
      + sourceNote('BPS, 2024') + '</section></section>'
      + '<section><h2>Economy, in numbers</h2><div class="fact-grid">' + facts + '</div></section>'
      + '<section><h2>Annual indicators</h2><table class="data-table"><thead><tr><th>Year</th><th>GDP growth</th><th>Inflation (Dec)</th><th>Unemployment (Aug)</th></tr></thead><tbody>'
      + rows + '</tbody></table>' + sourceNote('BPS, 2015–2024. “—” means the series starts later.') + '</section>';
    return {
      html: html,
      mount: function () {
        var btns = document.querySelectorAll('[data-ecometric]');
        btns.forEach(function (b) {
          b.addEventListener('click', function () {
            ecoMetric = b.getAttribute('data-ecometric');
            btns.forEach(function (x) { x.classList.toggle('is-active', x === b); });
            document.getElementById('eco-chart-title').textContent = ecoMeta[ecoMetric].title;
            drawEco();
          });
        });
      },
      draw: drawEco,
    };
    function drawEco() {
      var s = D.series[ecoMetric];
      var cv = document.getElementById('eco-chart');
      if (cv) C.drawLineChart(cv, s.years, s.values, { suffix: ecoMeta[ecoMetric].suffix });
      var sec = document.getElementById('eco-sectors');
      if (sec) C.drawHbars(sec, D.gdpSectors, { suffix: '%' });
    }
  }

  // --------------------------------------------------------------- provinces
  var provSort = { key: 'pop', dir: -1 };
  var provQuery = '';
  function density(p) { return Math.round((p.pop * 1000000) / p.area); }
  function provRows() {
    var list = D.provinces.filter(function (p) {
      var q = provQuery.trim().toLowerCase();
      return !q || p.name.toLowerCase().indexOf(q) >= 0 || p.capital.toLowerCase().indexOf(q) >= 0;
    });
    list.sort(function (a, b) {
      var k = provSort.key;
      var av = k === 'name' || k === 'capital' ? a[k] : (k === 'density' ? density(a) : a[k]);
      var bv = k === 'name' || k === 'capital' ? b[k] : (k === 'density' ? density(b) : b[k]);
      if (av < bv) return -1 * provSort.dir;
      if (av > bv) return 1 * provSort.dir;
      return 0;
    });
    if (!list.length) return '<tr><td colspan="5" class="empty-cell">No province matches “' + esc(provQuery) + '”. Try another name or capital.</td></tr>';
    return list.map(function (p, i) {
      return '<tr><td>' + (i + 1) + '</td><td><strong>' + esc(p.name) + '</strong></td><td>' + esc(p.capital) + '</td>'
        + '<td>' + p.pop.toFixed(1) + '</td><td>' + p.area.toLocaleString('en-US') + '</td><td>' + density(p).toLocaleString('en-US') + '</td></tr>';
    }).join('');
  }
  function provinces() {
    var top10 = D.provinces.slice().sort(function (a, b) { return b.pop - a.pop; }).slice(0, 10)
      .map(function (p) { return { label: p.name, value: p.pop }; });
    var html =
      '<section class="page-head"><h1>Provinces</h1>'
      + '<p class="lede">Indonesia has 38 provinces, from West Java with about 49.9 million people to Papua Selatan with about 0.6 million. Search the table, or tap a column heading to sort it.</p></section>'
      + '<section class="chart-row">'
      + chartCard('prov-top10', 'Ten most populous provinces, 2024 (millions)', 'BPS, 2024', 300)
      + '<section class="chart-card"><h3>How to read the table</h3>'
      + '<p><strong>Search</strong> filters by province or capital city. <strong>Tap a column heading</strong> to sort — tap again to reverse. Density is people per square kilometre, computed from the rounded population and area figures.</p>'
      + '<p>Java holds about 56% of the population on about 7% of the land. The densest province is DKI Jakarta (about 16,000 people/km²); the sparsest are the Papuan provinces, under 15 people/km².</p>'
      + sourceNote('BPS, 2024 (rounded approximations)') + '</section></section>'
      + '<section><h2>All 38 provinces</h2>'
      + '<div class="table-tools"><label class="search-box">Search provinces or capitals <input id="prov-search" type="search" placeholder="e.g. Jawa, Medan, Papua" value="' + esc(provQuery) + '"></label>'
      + '<span class="result-count" id="prov-count"></span></div>'
      + '<div class="table-scroll"><table class="data-table sortable"><thead><tr>'
      + '<th>#</th>'
      + '<th><button class="sort-btn" data-sort="name">Province</button></th>'
      + '<th><button class="sort-btn" data-sort="capital">Capital</button></th>'
      + '<th><button class="sort-btn" data-sort="pop">Population (m)</button></th>'
      + '<th><button class="sort-btn" data-sort="area">Area (km²)</button></th>'
      + '<th><button class="sort-btn" data-sort="density">Density (/km²)</button></th>'
      + '</tr></thead><tbody id="prov-body"></tbody></table></div>'
      + sourceNote('BPS, 2024. Population and area are rounded approximations; density is computed from them.') + '</section>';
    return {
      html: html,
      mount: function () {
        var body = document.getElementById('prov-body');
        var count = document.getElementById('prov-count');
        var search = document.getElementById('prov-search');
        function refresh() {
          body.innerHTML = provRows();
          var n = body.querySelectorAll('tr').length;
          count.textContent = (provQuery ? 'Matching: ' : 'Showing: ') + (body.querySelector('.empty-cell') ? 0 : n) + ' of 38 provinces';
          document.querySelectorAll('.sort-btn').forEach(function (b) {
            var k = b.getAttribute('data-sort');
            b.classList.toggle('is-sorted', provSort.key === k);
            b.textContent = b.textContent.replace(/ [▲▼]$/, '') + (provSort.key === k ? (provSort.dir === 1 ? ' ▲' : ' ▼') : '');
          });
        }
        search.addEventListener('input', function () { provQuery = search.value; refresh(); });
        document.querySelectorAll('.sort-btn').forEach(function (b) {
          b.addEventListener('click', function () {
            var k = b.getAttribute('data-sort');
            if (provSort.key === k) provSort.dir *= -1;
            else provSort = { key: k, dir: k === 'name' || k === 'capital' ? 1 : -1 };
            refresh();
          });
        });
        refresh();
      },
      draw: function () {
        var cv = document.getElementById('prov-top10');
        if (cv) C.drawHbars(cv, top10, { suffix: ' m' });
      },
    };
  }

  // ------------------------------------------------------- education & health
  var eduTab = 'education';
  function educationHealth() {
    var edu = D.education.map(factCard).join('');
    var hea = D.health.map(factCard).join('');
    var html =
      '<section class="page-head"><h1>Education &amp; health</h1>'
      + '<p class="lede">How Indonesians learn and how long they live: literacy near 96.5%, life expectancy 74.2 years, and stunting down to 19.8% of young children.</p></section>'
      + '<div class="tab-row" role="group" aria-label="Topic">'
      + '<button class="tab-btn is-active" data-edutab="education">Education</button>'
      + '<button class="tab-btn" data-edutab="health">Health</button>'
      + '</div>'
      + '<section id="edu-panel"><h2>Education</h2><div class="fact-grid">' + edu + '</div>'
      + chartCard('edu-lit', 'Literacy rate, age 15+ (%), 2019–2024', D.literacyByYear.source)
      + '</section>'
      + '<section id="health-panel" hidden><h2>Health</h2><div class="fact-grid">' + hea + '</div>'
      + '<section class="chart-card"><h3>Health, in context</h3><p>Life expectancy has risen by about three years in a decade, and child stunting has fallen from 24.4% in 2021 to 19.8% in 2024 — still one of the government’s main targets. The national health insurance scheme (BPJS Kesehatan) covers most of the population, and primary care runs through about 10,400 community health centres (puskesmas).</p>'
      + sourceNote('Ministry of Health; BPS, 2024') + '</section></section>';
    return {
      html: html,
      mount: function () {
        var btns = document.querySelectorAll('[data-edutab]');
        btns.forEach(function (b) {
          b.addEventListener('click', function () {
            eduTab = b.getAttribute('data-edutab');
            btns.forEach(function (x) { x.classList.toggle('is-active', x === b); });
            document.getElementById('edu-panel').hidden = eduTab !== 'education';
            document.getElementById('health-panel').hidden = eduTab !== 'health';
            drawEdu();
          });
        });
      },
      draw: drawEdu,
    };
    function drawEdu() {
      var cv = document.getElementById('edu-lit');
      if (cv && eduTab === 'education') C.drawLineChart(cv, D.literacyByYear.years, D.literacyByYear.values, { suffix: '%', floorAtZero: false });
    }
  }

  function missing() {
    return {
      html: '<section class="page-head"><h1>Page not found</h1><p class="lede">That section does not exist. Try one of these:</p>'
        + '<p><a href="#/">Overview</a> · <a href="#/population">Population</a> · <a href="#/economy">Economy</a> · <a href="#/provinces">Provinces</a> · <a href="#/education-health">Education &amp; Health</a></p></section>',
      mount: function () {},
      draw: function () {},
    };
  }

  window.NUSAViews = {
    overview: overview,
    population: population,
    economy: economy,
    provinces: provinces,
    educationHealth: educationHealth,
    missing: missing,
  };
})();

// NusaStat router: hash routes, one per section. Rendering sets window.__shotReady
// false while a page paints and true once it is on screen, so a screenshot script
// knows when to capture.
//
//   #/                    Overview dashboard
//   #/population          Population & demographics
//   #/economy             Economy
//   #/provinces           Provinces table
//   #/education-health    Education & health
//   #/prices-trade        Prices & trade (inflation, exports, imports)

(function () {
  var VIEWS = window.NUSAViews;
  var app = document.getElementById('app');
  var currentDraw = null;
  var resizeTimer = null;

  var ROUTES = {
    '': VIEWS.overview,
    '/': VIEWS.overview,
    '/population': VIEWS.population,
    '/economy': VIEWS.economy,
    '/provinces': VIEWS.provinces,
    '/education-health': VIEWS.educationHealth,
    '/prices-trade': VIEWS.pricesTrade,
  };

  var TITLES = {
    '': 'NusaStat — Portal Statistik Indonesia',
    '/': 'NusaStat — Portal Statistik Indonesia',
    '/population': 'Population & demographics | NusaStat',
    '/economy': 'Economy | NusaStat',
    '/provinces': 'Provinces | NusaStat',
    '/education-health': 'Education & health | NusaStat',
    '/prices-trade': 'Prices & trade | NusaStat',
  };

  function render() {
    window.__shotReady = false;
    var path = (location.hash || '#/').replace(/^#/, '');
    var view = ROUTES[path] || VIEWS.missing;
    var page = view();
    app.innerHTML = page.html;
    page.mount();
    page.draw();
    currentDraw = page.draw;
    document.title = TITLES[path] || 'NusaStat — Portal Statistik Indonesia';
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      var key = a.getAttribute('data-nav');
      var active = (path === '/' && key === 'overview') || ('/' + key) === path;
      a.classList.toggle('is-active', active);
    });
    window.scrollTo(0, 0);
    window.__shotReady = true;
  }

  window.addEventListener('hashchange', render);
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { if (currentDraw) currentDraw(); }, 150);
  });
  render();
})();

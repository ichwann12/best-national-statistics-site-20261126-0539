// NusaStat charts: small, dependency-free canvas charts drawn from the data in data.js.
// drawBarChart(canvas, labels, values, options) and drawLineChart(canvas, years, values, options).
// Both size the canvas to its CSS box times the device pixel ratio, so charts stay sharp
// on phones and retina screens, and they redraw cleanly when the window resizes.

(function () {
  var INK = '#173a32';
  var MUTED = '#5d6f6a';
  var GRID = '#dfe7e2';
  var TEAL = '#0b5d4e';
  var TEAL_LIGHT = '#2a8a72';
  var AMBER = '#e9a13b';
  var RED = '#c0503c';

  function setupCanvas(canvas) {
    var box = canvas.getBoundingClientRect();
    var w = Math.max(240, Math.round(box.width));
    var h = Math.max(180, Math.round(box.height));
    var dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: w, h: h };
  }

  function niceMax(max) {
    if (max <= 0) return 1;
    var pow = Math.pow(10, Math.floor(Math.log10(max)));
    var n = max / pow;
    var nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
    return nice * pow;
  }

  function fmt(v) {
    if (Math.abs(v) >= 100) return String(Math.round(v));
    return String(Math.round(v * 10) / 10);
  }

  function axes(ctx, x0, y0, x1, y1, min, max, ticks) {
    ctx.strokeStyle = GRID;
    ctx.fillStyle = MUTED;
    ctx.lineWidth = 1;
    ctx.font = '11px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (var i = 0; i <= ticks; i++) {
      var v = min + ((max - min) * i) / ticks;
      var y = y1 - ((v - min) / (max - min)) * (y1 - y0);
      ctx.beginPath();
      ctx.moveTo(x0, y);
      ctx.lineTo(x1, y);
      ctx.stroke();
      ctx.fillText(fmt(v), x0 - 8, y);
    }
  }

  function drawBarChart(canvas, labels, values, opts) {
    opts = opts || {};
    var s = setupCanvas(canvas);
    var ctx = s.ctx;
    var padL = 46, padR = 12, padT = 14, padB = 30;
    var x0 = padL, y0 = padT, x1 = s.w - padR, y1 = s.h - padB;
    var min = opts.min != null ? opts.min : 0;
    var max = niceMax(Math.max.apply(null, values) * 1.08);
    if (min > 0) max = Math.max(max, min * 1.1);
    axes(ctx, x0, y0, x1, y1, min, max, 4);
    var n = values.length;
    var slot = (x1 - x0) / n;
    var barW = Math.min(46, slot * 0.62);
    ctx.font = '11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (var i = 0; i < n; i++) {
      var cx = x0 + slot * (i + 0.5);
      var v = values[i];
      var barH = ((v - min) / (max - min)) * (y1 - y0);
      var by = y1 - barH;
      ctx.fillStyle = opts.colorAt ? opts.colorAt(v, i) : (i === n - 1 ? AMBER : TEAL);
      ctx.beginPath();
      ctx.fillRect(cx - barW / 2, by, barW, Math.max(barH, 1));
      ctx.fillStyle = INK;
      ctx.fillText(fmt(v) + (opts.suffix || ''), cx, by - 15);
      ctx.fillStyle = MUTED;
      ctx.fillText(labels[i], cx, y1 + 8);
    }
  }

  function drawLineChart(canvas, years, values, opts) {
    opts = opts || {};
    var s = setupCanvas(canvas);
    var ctx = s.ctx;
    var padL = 46, padR = 16, padT = 18, padB = 30;
    var x0 = padL, y0 = padT, x1 = s.w - padR, y1 = s.h - padB;
    var min = Math.min.apply(null, values);
    var max = Math.max.apply(null, values);
    // Zero is included in the scale unless the caller opts out (series whose
    // values sit far from zero, like total population, read better zoomed in).
    if (opts.floorAtZero !== false) min = Math.min(0, min);
    var span = max - min;
    var top = min + span * 1.15;
    var bottom = min - span * 0.12;
    axes(ctx, x0, y0, x1, y1, bottom, top, 4);
    function px(i) { return x0 + ((x1 - x0) * i) / (values.length - 1); }
    function py(v) { return y1 - ((v - bottom) / (top - bottom)) * (y1 - y0); }
    // Zero line, highlighted when the series dips below zero (the 2020 contraction).
    if (bottom < 0 && top > 0) {
      ctx.strokeStyle = RED;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(x0, py(0));
      ctx.lineTo(x1, py(0));
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.strokeStyle = TEAL;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    for (var i = 0; i < values.length; i++) {
      if (i === 0) ctx.moveTo(px(i), py(values[i]));
      else ctx.lineTo(px(i), py(values[i]));
    }
    ctx.stroke();
    ctx.font = '11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (var j = 0; j < values.length; j++) {
      var vx = px(j), vy = py(values[j]);
      ctx.fillStyle = values[j] < 0 ? RED : TEAL;
      ctx.beginPath();
      ctx.arc(vx, vy, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = INK;
      // The series low (a negative dip, e.g. 2020) gets its label below the point
      // so the text never sits on top of the dot.
      var isLow = values[j] === Math.min.apply(null, values) && values[j] < 0;
      ctx.fillText(fmt(values[j]) + (opts.suffix || ''), vx, isLow ? vy + 10 : vy - 16);
      ctx.fillStyle = MUTED;
      ctx.fillText(String(years[j]), vx, y1 + 8);
    }
  }

  // Horizontal bar list used for the GDP sector mix and province top 10.
  function drawHbars(canvas, rows, opts) {
    opts = opts || {};
    var s = setupCanvas(canvas);
    var ctx = s.ctx;
    var padL = 172, padR = 52, padT = 8, padB = 8;
    var x0 = padL, x1 = s.w - padR;
    var max = niceMax(Math.max.apply(null, rows.map(function (r) { return r.value; })) * 1.1);
    var rowH = (s.h - padT - padB) / rows.length;
    ctx.font = '12px system-ui, sans-serif';
    for (var i = 0; i < rows.length; i++) {
      var y = padT + rowH * i + rowH * 0.18;
      var bh = rowH * 0.56;
      var bw = ((rows[i].value / max) * (x1 - x0));
      ctx.fillStyle = INK;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(rows[i].label, x0 - 8, y + bh / 2);
      ctx.fillStyle = i === 0 ? AMBER : TEAL_LIGHT;
      ctx.fillRect(x0, y, Math.max(bw, 2), bh);
      ctx.fillStyle = INK;
      ctx.textAlign = 'left';
      ctx.fillText(fmt(rows[i].value) + (opts.suffix || ''), x0 + bw + 7, y + bh / 2);
    }
  }

  window.NUSACharts = {
    drawBarChart: drawBarChart,
    drawLineChart: drawLineChart,
    drawHbars: drawHbars,
  };
})();

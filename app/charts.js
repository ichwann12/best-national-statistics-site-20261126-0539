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
  // Handles negative values (e.g. a CPI group that fell): bars grow left
  // from a zero line instead of drawing backwards over the labels.
  function drawHbars(canvas, rows, opts) {
    opts = opts || {};
    var s = setupCanvas(canvas);
    var ctx = s.ctx;
    var padL = 172, padR = 52, padT = 8, padB = 8;
    var x0 = padL, x1 = s.w - padR;
    var vals = rows.map(function (r) { return r.value; });
    var minV = Math.min.apply(null, vals.concat([0]));
    var maxV = Math.max.apply(null, vals.concat([0]));
    var max = niceMax(maxV * 1.1);
    var min = minV < 0 ? -niceMax(-minV * 1.1) : 0;
    var span = max - min || 1;
    function vx(v) { return x0 + ((v - min) / span) * (x1 - x0); }
    var zeroX = vx(0);
    var rowH = (s.h - padT - padB) / rows.length;
    ctx.font = '12px system-ui, sans-serif';
    // Zero line, only drawn when some value is negative.
    if (min < 0) {
      ctx.strokeStyle = RED;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(zeroX, padT);
      ctx.lineTo(zeroX, s.h - padB);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    for (var i = 0; i < rows.length; i++) {
      var y = padT + rowH * i + rowH * 0.18;
      var bh = rowH * 0.56;
      var v = rows[i].value;
      var bx = Math.min(zeroX, vx(v));
      var bw = Math.abs(vx(v) - zeroX);
      ctx.fillStyle = INK;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(rows[i].label, x0 - 8, y + bh / 2);
      ctx.fillStyle = v < 0 ? RED : (i === 0 ? AMBER : TEAL_LIGHT);
      ctx.fillRect(bx, y, Math.max(bw, 2), bh);
      ctx.fillStyle = INK;
      ctx.textAlign = v < 0 ? 'right' : 'left';
      ctx.fillText(fmt(v) + (opts.suffix || ''), v < 0 ? bx - 7 : zeroX + bw + 7, y + bh / 2);
    }
  }

  // Grouped bars: two series side by side per category, e.g. exports and
  // imports for the same year. Values may be negative; the zero line is drawn.
  function drawGroupedBars(canvas, labels, series, opts) {
    opts = opts || {};
    var s = setupCanvas(canvas);
    var ctx = s.ctx;
    var padL = 52, padR = 14, padT = 20, padB = 34;
    var x0 = padL, y0 = padT, x1 = s.w - padR, y1 = s.h - padB;
    var all = [];
    series.forEach(function (ser) { ser.values.forEach(function (v) { all.push(v); }); });
    var min = Math.min.apply(null, all.concat([0]));
    var max = Math.max.apply(null, all.concat([0]));
    var span = max - min || 1;
    var top = max + span * 0.12;
    var bottom = min - span * 0.12;
    axes(ctx, x0, y0, x1, y1, bottom, top, 4);
    function py(v) { return y1 - ((v - bottom) / (top - bottom)) * (y1 - y0); }
    // Zero line, dashed, so negative bars read as below the line.
    ctx.strokeStyle = RED;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(x0, py(0));
    ctx.lineTo(x1, py(0));
    ctx.stroke();
    ctx.setLineDash([]);
    var colors = [TEAL, AMBER];
    var n = labels.length;
    var slot = (x1 - x0) / n;
    var groupW = Math.min(64, slot * 0.66);
    var barW = groupW / series.length;
    ctx.font = '11px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (var i = 0; i < n; i++) {
      var gx = x0 + slot * (i + 0.5) - groupW / 2;
      for (var j = 0; j < series.length; j++) {
        var v = series[j].values[i];
        var bx = gx + j * barW;
        var topY = Math.min(py(v), py(0));
        var h = Math.abs(py(v) - py(0));
        ctx.fillStyle = colors[j % colors.length];
        ctx.beginPath();
        ctx.fillRect(bx + 1, topY, Math.max(barW - 2, 1), Math.max(h, 1));
        ctx.fillStyle = INK;
        ctx.fillText(fmt(v) + (opts.suffix || ''), bx + barW / 2, v >= 0 ? topY - 15 : topY + h + 4);
      }
      ctx.fillStyle = MUTED;
      ctx.fillText(labels[i], x0 + slot * (i + 0.5), y1 + 8);
    }
    // Legend, drawn above the plot area, right-aligned so it never sits
    // next to the top axis tick label.
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    var legendW = 0;
    series.forEach(function (ser) {
      legendW += 17 + ctx.measureText(ser.name).width + 22;
    });
    var lx = x1 - (legendW - 22);
    series.forEach(function (ser, k) {
      ctx.fillStyle = colors[k % colors.length];
      ctx.fillRect(lx, y0 - 12, 12, 12);
      ctx.fillStyle = INK;
      ctx.fillText(ser.name, lx + 17, y0 - 6);
      lx += 17 + ctx.measureText(ser.name).width + 22;
    });
  }

  window.NUSACharts = {
    drawBarChart: drawBarChart,
    drawLineChart: drawLineChart,
    drawHbars: drawHbars,
    drawGroupedBars: drawGroupedBars,
  };
})();

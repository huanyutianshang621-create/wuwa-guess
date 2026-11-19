/* ============================================================
 * 鸣潮立绘猜猜看 · 游戏逻辑
 * ------------------------------------------------------------
 * 存档写在浏览器 localStorage 的 "wuwa-guess-v1" 里，
 * 关掉网页、关机都不会丢；下次打开点「继续」接着猜。
 *
 * 想改的东西多半在 config.js（选项数、计分、图片目录、属性颜色）
 * 和 data.js（角色名单）。这里只放流程。
 * ============================================================ */

(function () {
  "use strict";

  var CFG = window.WUWA_CONFIG;
  var CHARS = window.WUWA_CHARACTERS;
  var STORE = "wuwa-guess-v1";
  var OPT = CFG.OPTION_COUNT || 4;

  var byId = {};
  var ELEM = {};
  CHARS.forEach(function (c) { byId[c.id] = c; });
  CFG.ELEMENTS.forEach(function (e) { ELEM[e.id] = e; });

  var S = null;      /* 存档状态 */
  var Q = null;      /* 当前这题 */
  var artId = null;  /* 立绘区当前显示的角色 */
  var toastTimer = 0;

  var screen = "start";      /* start | play | finish */
  var backToStart = false;   /* 图鉴是从开始页点开的，关掉要回开始页 */

  function $(id) { return document.getElementById(id); }

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function emptyPartial() {
    return { e: null, elemPick: null, n: null, namePick: null };
  }

  function blank() {
    return {
      v: 1,
      order: shuffle(CHARS.map(function (c) { return c.id; })),
      i: 0,
      score: 0,
      done: {},
      partial: emptyPartial()
    };
  }

  /* ---------------- 存档 ---------------- */

  function load() {
    var s = null;
    try { s = JSON.parse(window.localStorage.getItem(STORE) || "null"); } catch (err) { s = null; }
    if (!s || s.v !== 1 || !Array.isArray(s.order)) return blank();

    /* 兼容改过 data.js 的存档：删掉已不存在的角色，新角色追加到队尾 */
    var known = {}, seen = {};
    CHARS.forEach(function (c) { known[c.id] = true; });
    s.order = s.order.filter(function (id) {
      if (!known[id] || seen[id]) return false;
      seen[id] = true;
      return true;
    });
    var miss = CHARS.filter(function (c) { return !seen[c.id]; })
      .map(function (c) { return c.id; });
    if (miss.length) s.order = s.order.concat(shuffle(miss));

    if (typeof s.i !== "number" || s.i < 0 || s.i > s.order.length) s.i = 0;
    if (typeof s.score !== "number") s.score = 0;
    if (!s.done || typeof s.done !== "object") s.done = {};
    if (!s.partial) s.partial = emptyPartial();
    return s;
  }

  function save() {
    try { window.localStorage.setItem(STORE, JSON.stringify(S)); } catch (err) { /* 隐私模式 */ }
  }

  /* ---------------- 统计 ---------------- */

  function stats() {
    var d = S.done;
    var ids = Object.keys(d);
    var e = 0, n = 0, miss = [];
    ids.forEach(function (id) {
      var r = d[id] || {};
      if (r.e) e++;
      if (r.n) n++;
      if (!(r.e && r.n)) miss.push(id);
    });
    return { seen: ids.length, e: e, n: n, miss: miss };
  }

  /* ---------------- 出题 ---------------- */

  function buildQuestion(c) {
    var pool = CHARS.filter(function (x) { return x.id !== c.id; });
    var others = shuffle(pool.slice()).slice(0, Math.max(1, OPT - 1))
      .map(function (x) { return x.name; });
    others.push(c.name);
    return { c: c, names: shuffle(others) };
  }

  function boot() {
    Q = null;
    if (S.i < S.order.length) {
      var c = byId[S.order[S.i]];
      if (c) Q = buildQuestion(c);
    }
    if (!Q) artId = null;
    render();
  }

  function showScreen(name) {
    screen = name;
    render();
  }

  function startGame() {
    screen = "play";
    boot();   /* boot 里会 render：有下一题就去 play，题目用完就去 finish */
  }

  function reset() {
    S = blank();
    artId = null;
    save();
    boot();
    toast("进度已清空，重新开始");
  }

  function review() {
    var st = stats();
    if (!st.miss.length) return;
    S.order = shuffle(st.miss.slice());
    S.i = 0;
    S.partial = emptyPartial();
    artId = null;
    save();
    boot();
    toast("复习模式：只出答错的 " + S.order.length + " 张");
  }

  /* ---------------- 答题 ---------------- */

  function pickElement(id) {
    if (!Q || S.partial.e !== null) return;
    var ok = (id === Q.c.element);
    S.partial.e = ok;
    S.partial.elemPick = id;
    if (ok) S.score += CFG.SCORE.element;
    save();
    render();
  }

  function pickName(name) {
    if (!Q || S.partial.e === null || S.partial.n !== null) return;
    var ok = (name === Q.c.name);
    S.partial.n = ok;
    S.partial.namePick = name;
    if (ok) S.score += CFG.SCORE.name;
    if (ok && S.partial.e) S.score += CFG.SCORE.both;
    S.done[Q.c.id] = { e: S.partial.e, n: ok };
    save();
    render();
  }

  function next() {
    if (!Q) return;
    S.i += 1;
    S.partial = emptyPartial();
    save();
    boot();
  }

  /* ---------------- 渲染 ---------------- */

  function render() {
    var st = stats();
    $("stat-progress").textContent = st.seen + " / " + CHARS.length;
    $("stat-score").textContent = S.score + " 分";

    /* 开始页：只露出开始页，顶栏和答题区都收起来 */
    if (screen === "start") {
      document.body.classList.add("on-start");
      $("start").hidden = false;
      $("play").hidden = true;
      $("finish").hidden = true;
      $("start-progress").textContent = st.seen
        ? "已经认出 " + st.seen + " / " + CHARS.length + " 张，接着上次继续"
        : CHARS.length + " 张立绘，一次认不完也没关系，随时能关";
      $("btn-start").textContent = st.seen ? "继续猜" : "开始猜";
      return;
    }

    document.body.classList.remove("on-start");
    $("start").hidden = true;
    screen = Q ? "play" : "finish";
    $("play").hidden = !Q;
    $("finish").hidden = !!Q;

    if (!Q) { renderFinish(st); return; }
    renderArt();
    renderElements();
    $("name-label").textContent = (S.partial.e === null) ? "先选属性，再选名字" : "她叫什么";
    renderNames();
    renderAnswer();
  }

  /* 给已有的 <img> 换上某角色的立绘，按 IMG_DIRS 顺序回退。
     复用同一个元素，避免每次开关面板都重新建 img、重新解码大图。 */
  function setImg(img, c) {
    var dirs = CFG.IMG_DIRS || [];
    var k = 0;
    img.classList.remove("broken");
    if (!dirs.length) {
      img.onerror = null;
      img.removeAttribute("src");
      img.classList.add("broken");
      return;
    }
    img.onerror = function () {
      k += 1;
      if (k >= dirs.length) {
        img.onerror = null;
        img.removeAttribute("src");
        img.classList.add("broken");
        return;
      }
      img.src = encodeURI(dirs[k] + c.img);
    };
    img.src = encodeURI(dirs[0] + c.img);
  }

  function makeImg(c) {
    var img = document.createElement("img");
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    setImg(img, c);
    return img;
  }

  function renderArt() {
    var c = Q.c;
    if (artId === c.id) return;
    artId = c.id;
    var box = $("art");
    box.innerHTML = "";
    box.appendChild(makeImg(c));
  }

  function renderElements() {
    var c = Q.c, p = S.partial;
    var html = "";
    CFG.ELEMENTS.forEach(function (e) {
      var cls = "chip";
      if (p.e !== null) {
        cls += (e.id === c.element) ? " right"
             : (e.id === p.elemPick) ? " wrong" : " dim";
      }
      html += '<button class="' + cls + '" style="--c:' + e.color + '"'
            + ' data-id="' + e.id + '"' + (p.e !== null ? " disabled" : "") + '>'
            + '<span class="line"><i class="dot"></i><span class="nm">' + e.name + '</span></span>'
            + '<span class="hint">' + e.hint + '</span>'
            + '</button>';
    });
    $("elem-row").innerHTML = html;
  }

  function renderNames() {
    var p = S.partial;
    var locked = (p.e === null);   /* 属性还没选，名字选项先锁着 */
    var html = "";
    Q.names.forEach(function (nm, idx) {
      var cls = "opt" + (locked ? " wait" : "");
      if (p.n !== null) {
        cls += (nm === Q.c.name) ? " right"
             : (nm === p.namePick) ? " wrong" : " dim";
      }
      html += '<button class="' + cls + '" data-name="' + nm + '"'
            + ((locked || p.n !== null) ? " disabled" : "") + '>'
            + '<span class="idx">' + (idx + 1) + '</span>' + nm
            + '</button>';
    });
    $("name-row").innerHTML = html;
  }

  function renderAnswer() {
    var box = $("answer");
    var p = S.partial, c = Q.c;
    if (p.n === null) { box.hidden = true; box.innerHTML = ""; return; }

    var e = ELEM[c.element];
    var gain = (p.e ? CFG.SCORE.element : 0)
             + (p.n ? CFG.SCORE.name : 0)
             + (p.e && p.n ? CFG.SCORE.both : 0);
    var last = (S.i >= S.order.length - 1);

    box.innerHTML =
      '<div class="ans-head">答案</div>'
      + '<div class="ans-line"><b>名字</b><span class="val">' + c.name + '</span>'
      + '<span class="mark ' + (p.n ? "ok" : "bad") + '">' + (p.n ? "✓" : "✗") + '</span></div>'
      + '<div class="ans-line"><b>属性</b><span class="val" style="color:' + e.color + '">' + e.name + '</span>'
      + '<span class="mark ' + (p.e ? "ok" : "bad") + '">' + (p.e ? "✓" : "✗") + '</span></div>'
      + '<div class="ans-meta">' + new Array(c.star + 1).join("★")
      + ' &nbsp;·&nbsp; ' + c.weapon + ' &nbsp;·&nbsp; ' + c.version + ' 版本</div>'
      + '<div class="ans-gain">本题得分 <b>+' + gain + '</b></div>'
      + '<div class="ans-actions"><button class="btn" id="btn-next">'
      + (last ? "查看结果" : "下一张") + '</button></div>';
    box.hidden = false;
  }

  function renderFinish(st) {
    var total = CHARS.length;
    $("finish").innerHTML =
      '<h2>' + (st.seen >= total ? "全部认完了" : "这一轮结束了") + '</h2>'
      + '<p>已经认出 ' + st.seen + ' / ' + total + ' 张</p>'
      + '<p>属性答对 <b class="hl">' + st.e + '</b> 次 &nbsp;·&nbsp; 名字答对 <b class="hl">' + st.n + '</b> 次</p>'
      + '<p>累计 <b class="hl">' + S.score + '</b> 分</p>'
      + '<div class="actions">'
      + '<button class="btn" data-act="restart">重新洗牌再玩</button>'
      + (st.miss.length
          ? '<button class="btn secondary" data-act="review">复习答错的 ' + st.miss.length + ' 张</button>'
          : "")
      + '<button class="btn secondary" data-act="gallery">看图鉴</button>'
      + '</div>';
  }

  /* ---------------- 图鉴 ---------------- */

  function cmpVersion(a, b) {
    var pa = String(a).split(".").map(Number);
    var pb = String(b).split(".").map(Number);
    var len = Math.max(pa.length, pb.length);
    for (var i = 0; i < len; i++) {
      var x = pa[i] || 0, y = pb[i] || 0;
      if (x !== y) return x - y;
    }
    return 0;
  }

  var galBuilt = false;
  var galMode = "normal";

  function renderGallery(mode) {
    var grid = $("gallery-grid");
    var preview = (mode === "preview");
    /* 图鉴建过一次就只更新状态，不再重建：57 张大图每次重新解码是主要卡顿来源 */
    if (galBuilt && galMode === mode && grid.childElementCount === CHARS.length) {
      if (!preview) refreshGallery();
      return;
    }
    galMode = mode;
    galBuilt = true;
    grid.innerHTML = "";
    var list = CHARS.slice().sort(function (a, b) {
      return cmpVersion(a.version, b.version) || a.name.localeCompare(b.name, "zh");
    });
    list.forEach(function (c) {
      var solved = !!S.done[c.id];
      var item = document.createElement("div");
      item.setAttribute("data-id", c.id);
      if (preview) {
        /* 开始页的图鉴：只有立绘，名字、属性点、简介一律不给 */
        item.className = "gal-item preview clickable";
      } else {
        item.className = "gal-item " + (solved ? "solved" : "unsolved");
        if (solved || CFG.GALLERY_SHOW_LOCKED) item.className += " clickable";
      }
      item.appendChild(makeImg(c));

      if (!preview) {
        var cap = document.createElement("div");
        cap.className = "cap";
        cap.textContent = solved ? c.name : "？？？";
        item.appendChild(cap);

        if (solved) {
          var b = document.createElement("span");
          b.className = "badge";
          b.style.background = ELEM[c.element].color;
          b.title = ELEM[c.element].name;
          item.appendChild(b);
        }
      }
      grid.appendChild(item);
    });
  }

  /* 只更新已认出/未认出的表现，不动 <img> */
  function refreshGallery() {
    var grid = $("gallery-grid");
    Array.prototype.forEach.call(grid.children, function (item) {
      var id = item.getAttribute("data-id");
      var c = byId[id];
      if (!c) return;
      var solved = !!S.done[id];
      item.className = "gal-item " + (solved ? "solved" : "unsolved");
      if (solved || CFG.GALLERY_SHOW_LOCKED) item.className += " clickable";

      var cap = item.querySelector(".cap");
      if (cap) cap.textContent = solved ? c.name : "？？？";

      var e = ELEM[c.element] || { name: "", color: "#8899aa" };
      var badge = item.querySelector(".badge");
      if (solved) {
        if (!badge) {
          badge = document.createElement("span");
          badge.className = "badge";
          item.appendChild(badge);
        }
        badge.style.background = e.color;
        badge.title = e.name;
      } else if (badge) {
        badge.parentNode.removeChild(badge);
      }
    });
  }

  function toggleGallery(show, mode) {
    var g = $("gallery");
    var willShow = (typeof show === "boolean") ? show : g.hidden;
    if (!willShow) {
      g.hidden = true;
      if (backToStart) { backToStart = false; showScreen("start"); }
      return;
    }
    /* 从开始页进来的图鉴只给看脸：没有名字、属性、简介，点开也只有大图 */
    var preview = (mode === "preview") || (screen === "start");
    if (screen === "start") { backToStart = true; $("start").hidden = true; }
    $("gallery-title").textContent = preview ? "图鉴 · 只看立绘" : "图鉴";
    $("btn-gallery-close").textContent = preview ? "返回" : "关闭";
    renderGallery(preview ? "preview" : "normal");
    g.hidden = false;
    g.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------------- 图鉴大图 ---------------- */

  function openLightbox(id, artOnly) {
    var c = byId[id];
    if (!c) return;
    var e = ELEM[c.element] || { name: "?", color: "#8899aa" };
    var bio = (window.WUWA_BIOS || {})[id] || "";
    var box = $("lightbox");
    box.classList.toggle("art-only", !!artOnly);

    /* 面板结构是写死在 index.html 里的，这里只换文字和图片，不重建 DOM */
    setImg($("lb-img"), c);
    $("lb-name").textContent = c.name;
    $("lb-elem").style.color = e.color;
    $("lb-elem-name").textContent = e.name;
    $("lb-meta").textContent = new Array(c.star + 1).join("★")
      + " · " + c.weapon + " · " + c.version + " 版本";
    $("lb-bio").textContent = bio;
    $("lb-bio").hidden = !bio;

    box.hidden = false;
    document.body.classList.add("lb-open");
  }

  function closeLightbox() {
    var box = $("lightbox");
    if (!box || box.hidden) return;
    box.hidden = true;
    box.classList.remove("art-only");
    document.body.classList.remove("lb-open");
  }

  /* ---------------- 提示条 ---------------- */

  function toast(msg) {
    var t = $("toast");
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 1800);
  }

  /* ---------------- 事件 ---------------- */

  function onKey(ev) {
    if (!$("lightbox").hidden) {
      if (ev.key === "Escape") closeLightbox();
      return;
    }
    if (!$("gallery").hidden) {
      if (ev.key === "Escape") toggleGallery(false);
      return;
    }
    if (screen === "start") {
      if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); startGame(); }
      return;
    }
    if (!Q) return;

    var p = S.partial;
    if (p.n !== null) {
      if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); next(); }
      return;
    }
    var n = parseInt(ev.key, 10);
    if (!n || n < 1) return;
    if (p.e === null) {
      var e = CFG.ELEMENTS[n - 1];
      if (e) pickElement(e.id);
    } else {
      var nm = Q.names[n - 1];
      if (nm) pickName(nm);
    }
  }

  function init() {
    var fresh = false;
    try { fresh = !window.localStorage.getItem(STORE); } catch (err) { fresh = false; }
    S = load();

    $("elem-row").addEventListener("click", function (ev) {
      var b = ev.target.closest ? ev.target.closest("button.chip") : null;
      if (!b || b.disabled) return;
      pickElement(b.getAttribute("data-id"));
    });

    $("name-row").addEventListener("click", function (ev) {
      var b = ev.target.closest ? ev.target.closest("button.opt") : null;
      if (!b || b.disabled) return;
      pickName(b.getAttribute("data-name"));
    });

    $("answer").addEventListener("click", function (ev) {
      var b = ev.target.closest ? ev.target.closest("button") : null;
      if (b && b.id === "btn-next") next();
    });

    $("finish").addEventListener("click", function (ev) {
      var b = ev.target.closest ? ev.target.closest("button[data-act]") : null;
      if (!b) return;
      var act = b.getAttribute("data-act");
      if (act === "restart") reset();
      else if (act === "review") review();
      else if (act === "gallery") toggleGallery(true);
    });

    $("btn-start").addEventListener("click", startGame);
    $("btn-start-gallery").addEventListener("click", function () { toggleGallery(true, "preview"); });

    $("btn-gallery").addEventListener("click", function () { toggleGallery(); });
    $("btn-gallery-close").addEventListener("click", function () { toggleGallery(false); });

    $("gallery-grid").addEventListener("click", function (ev) {
      var item = ev.target.closest ? ev.target.closest(".gal-item") : null;
      if (!item) return;
      if (!item.classList.contains("clickable")) {
        toast("认出它之后才能放大看");
        return;
      }
      openLightbox(item.getAttribute("data-id"), item.classList.contains("preview"));
    });

    $("lightbox").addEventListener("click", function (ev) {
      var t = ev.target;
      var onCard = t.closest ? t.closest(".lb-card") : null;
      var onClose = t.closest ? t.closest("[data-lb-close]") : null;
      if (onClose || !onCard) closeLightbox();
    });
    $("btn-reset").addEventListener("click", function () {
      if (window.confirm("清空进度，从第一张重新开始？")) reset();
    });

    document.addEventListener("keydown", onKey);
    showScreen("start");
    if (fresh) toast("先选属性，再选名字；进度自动保存，随时可以关掉");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

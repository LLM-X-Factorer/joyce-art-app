// 由渲染脚本注入 window.__PLAN__：{ storyboard, timeline, captions, total, images, swatches, mode }
// seek(t) 只依赖 t：同一个 t 总是得到同一帧，便于逐帧截图。
//
// 场景类型：title / artwork（fit 全图 | cover 铺满）/ compare（上下对比）/ triptych / quote / outro
// 强调方式（scene.emphasis[]，按内容选用，at/until 为本段时长的比例）：
//   ring 圈注 · spotlight 聚光 · inset 局部放大卡 · trace 描线 · swatch 取色 · stat 数字 · year 年份印章 · quote 引文卡
(function () {
  const plan = window.__PLAN__;
  const W = 1080;
  const H = plan.mode === "cover" ? 1440 : 1920;
  const FADE = 0.5;
  const stage = document.getElementById("stage");
  const sb = plan.storyboard;

  const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
  const ease = (u) => 0.5 - Math.cos(Math.PI * clamp(u)) / 2;
  const lerp = (a, b, u) => a + (b - a) * u;
  const el = (tag, cls, parent, html) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (html != null) node.innerHTML = html;
    if (parent) parent.appendChild(node);
    return node;
  };
  const svgEl = (tag, attrs, parent) => {
    const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    if (parent) parent.appendChild(node);
    return node;
  };
  const image = (workKey) => plan.images[sb.works[workKey].image];

  /** 根据焦点与缩放计算图片在框内的位置（铺满框，不露边） */
  function place(img, box, cam, natural) {
    const s = Math.max(box.w / natural.w, box.h / natural.h) * cam.zoom;
    const tx = clamp(box.w / 2 - cam.cx * natural.w * s, box.w - natural.w * s, 0);
    const ty = clamp(box.h / 2 - cam.cy * natural.h * s, box.h - natural.h * s, 0);
    img.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
    return { s, tx, ty };
  }
  const camAt = (camera, u) => {
    const [a, b = a] = camera;
    return { cx: lerp(a.cx, b.cx, u), cy: lerp(a.cy, b.cy, u), zoom: lerp(a.zoom, b.zoom, u) };
  };
  function artImg(parent, workKey) {
    const info = image(workKey);
    const img = el("img", "art", parent);
    img.src = info.url;
    img.style.width = `${info.w}px`;
    img.style.height = `${info.h}px`;
    return { img, natural: { w: info.w, h: info.h } };
  }

  // ---------- 强调方式 ----------
  const EMPHASIS = {
    ring(fx, layer) {
      fx.ring = el("div", "ring", layer);
      if (fx.label) fx.labelEl = el("div", "ring-label", layer, fx.label);
    },
    spotlight(fx, layer) {
      fx.shade = el("div", "spotlight", layer);
      if (fx.label) fx.labelEl = el("div", "ring-label", layer, fx.label);
    },
    inset(fx, layer, entry) {
      const card = el("div", `inset inset-${fx.position ?? "top"}`, layer);
      const width = fx.width ?? 440; // 横向细节可以放宽卡片
      card.style.width = `${width + 40}px`;
      const frame = el("div", "inset-frame", card);
      const info = image(fx.work ?? entry.scene.work);
      const crop = el("div", "inset-crop", frame);
      crop.style.width = `${width}px`;
      // 用背景图显示原图中的一块区域
      const scale = width / (fx.w * info.w);
      crop.style.backgroundImage = `url(${info.url})`;
      crop.style.backgroundSize = `${info.w * scale}px ${info.h * scale}px`;
      crop.style.backgroundPosition = `${-fx.x * info.w * scale}px ${-fx.y * info.h * scale}px`;
      crop.style.height = `${fx.h * info.h * scale}px`;
      if (fx.label) el("div", "inset-label", card, fx.label);
      fx.card = card;
    },
    trace(fx, layer) {
      fx.svg = svgEl("svg", { class: "trace", width: W, height: H, viewBox: `0 0 ${W} ${H}` }, layer);
      fx.path = svgEl(
        "polyline",
        { fill: "none", stroke: "rgba(255,236,196,0.95)", "stroke-width": 7, "stroke-linecap": "round", "stroke-linejoin": "round" },
        fx.svg
      );
      if (fx.arrow) fx.head = svgEl("polygon", { fill: "rgba(255,236,196,0.95)" }, fx.svg);
      if (fx.label) fx.labelEl = el("div", "ring-label", layer, fx.label);
    },
    swatch(fx, layer, entry) {
      const row = el("div", "swatches", layer);
      const colors = plan.swatches[`${entry.index}:${entry.scene.emphasis.indexOf(fx)}`] ?? [];
      fx.chips = colors.map((c, k) => {
        const chip = el("div", "chip", row);
        el("i", null, chip).style.background = c;
        el("span", null, chip, fx.names?.[k] ?? "");
        return chip;
      });
      if (fx.label) el("div", "swatch-label", row, fx.label);
      fx.row = row;
    },
    stat(fx, layer) {
      const box = el("div", "stat", layer);
      fx.num = el("strong", null, box);
      el("span", null, box, fx.label);
      fx.box = box;
    },
    year(fx, layer) {
      fx.stamp = el("div", "year-stamp", layer, fx.text);
    },
    quote(fx, layer) {
      fx.veil = el("div", "quote-veil", layer);
      const card = el("div", "quote-card", layer);
      el("blockquote", null, card, fx.text);
      el("cite", null, card, fx.source);
      fx.card = card;
    }
  };

  function updateEmphasis(entry, fx, local, dur, p) {
    const start = (fx.at ?? 0.12) * dur;
    const stop = (fx.until ?? 1) * dur + 0.4;
    const show = ease((local - start) / 0.55) * (1 - ease((local - stop) / 0.4));
    // 图片坐标 → 屏幕坐标（随镜头移动）
    const toScreen = (x, y) => ({
      x: entry.box.left + p.tx + x * entry.natural.w * p.s,
      y: entry.box.top + p.ty + y * entry.natural.h * p.s
    });
    if (fx.ring) {
      const c = toScreen(fx.x, fx.y);
      const r = fx.r * entry.natural.w * p.s;
      fx.ring.style.cssText = `left:${c.x - r}px;top:${c.y - r}px;width:${2 * r}px;height:${2 * r}px;opacity:${show};transform:scale(${lerp(1.25, 1, show)})`;
      if (fx.labelEl) fx.labelEl.style.cssText = `left:${c.x}px;top:${c.y + r + 18}px;opacity:${show}`;
    }
    if (fx.shade) {
      const c = toScreen(fx.x, fx.y);
      const rx = fx.rx * entry.natural.w * p.s;
      const ry = (fx.ry ?? fx.rx) * entry.natural.w * p.s;
      fx.shade.style.background = `radial-gradient(ellipse ${rx}px ${ry}px at ${c.x}px ${c.y}px, transparent 62%, rgba(8,6,4,${0.72 * show}) 100%)`;
      if (fx.labelEl) fx.labelEl.style.cssText = `left:${c.x}px;top:${c.y + ry + 10}px;opacity:${show}`;
    }
    if (fx.card && fx.type === "inset") {
      fx.card.style.opacity = String(show);
      fx.card.style.transform = `translateY(${lerp(30, 0, show)}px) scale(${lerp(0.94, 1, show)})`;
    }
    if (fx.svg) {
      const pts = fx.points.map(([x, y]) => toScreen(x, y));
      let length = 0;
      for (let i = 1; i < pts.length; i += 1) length += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
      const draw = ease((local - start) / Math.max(0.6, (fx.draw ?? 0.3) * dur));
      fx.path.setAttribute("points", pts.map((q) => `${q.x},${q.y}`).join(" "));
      fx.path.setAttribute("stroke-dasharray", `${length}`);
      fx.path.setAttribute("stroke-dashoffset", `${length * (1 - draw)}`);
      fx.svg.style.opacity = String(1 - ease((local - stop) / 0.4));
      if (fx.head && pts.length > 1) {
        const a = pts.at(-2);
        const b = pts.at(-1);
        const ang = Math.atan2(b.y - a.y, b.x - a.x);
        const wing = (d) => ({ x: b.x - 34 * Math.cos(ang + d), y: b.y - 34 * Math.sin(ang + d) });
        fx.head.setAttribute("points", [b, wing(0.45), wing(-0.45)].map((q) => `${q.x},${q.y}`).join(" "));
        fx.head.style.opacity = String(draw > 0.97 ? 1 : 0);
      }
      if (fx.labelEl) {
        const anchor = toScreen(...fx.points[fx.labelAt ?? fx.points.length - 1]);
        fx.labelEl.style.cssText = `left:${anchor.x}px;top:${anchor.y + 30}px;opacity:${ease((draw - 0.8) / 0.2) * (1 - ease((local - stop) / 0.4))}`;
      }
    }
    if (fx.row) {
      fx.row.style.opacity = String(show > 0 ? 1 : 0);
      fx.chips.forEach((chip, k) => {
        const s = ease((local - start - k * 0.25) / 0.45) * (1 - ease((local - stop) / 0.4));
        chip.style.opacity = String(s);
        chip.style.transform = `translateY(${lerp(24, 0, s)}px)`;
      });
    }
    if (fx.box) {
      const value = Math.round(fx.value * ease((local - start) / 1.4));
      fx.num.textContent = `${fx.prefix ?? ""}${value.toLocaleString("en-US")}${fx.suffix ?? ""}`;
      fx.box.style.opacity = String(show);
    }
    if (fx.stamp) {
      fx.stamp.style.opacity = String(show * 0.92);
      fx.stamp.style.transform = `scale(${lerp(1.15, 1, show)})`;
    }
    if (fx.veil) {
      fx.veil.style.opacity = String(show);
      fx.card.style.opacity = String(show);
      fx.card.style.transform = `translateY(${lerp(30, 0, show)}px)`;
    }
  }

  // ---------- 构建场景 ----------
  const seenWorks = new Set();
  const layers = plan.timeline.map((slot, index) => {
    const scene = sb.segments[index].scene;
    const layer = el("div", "layer", stage);
    layer.style.zIndex = String(index + 1);
    const entry = { slot, scene, layer, index, effects: [] };

    if (scene.type === "artwork" || scene.type === "title" || scene.type === "quote") {
      const work = sb.works[scene.work];
      const info = image(scene.work);
      const mode = scene.type === "artwork" ? scene.mode : "cover";
      if (mode === "fit") {
        el("div", "backdrop", layer).style.backgroundImage = `url(${info.url})`;
        const boxH = Math.round(1000 * (info.h / info.w));
        const top = Math.round((scene.fitCenter ?? 700) - boxH / 2);
        const frame = el("div", "fit-frame", layer);
        frame.style.top = `${top}px`;
        frame.style.height = `${boxH}px`;
        entry.box = { w: 1000, h: boxH, left: 40, top };
        Object.assign(entry, artImg(frame, scene.work));
      } else {
        const vp = el("div", "viewport", layer);
        entry.box = { w: W, h: H, left: 0, top: 0 };
        Object.assign(entry, artImg(vp, scene.work));
      }
      el("div", "shade-top", layer);
      el("div", "shade-bottom", layer);

      if (scene.type === "title") {
        entry.img.style.filter = "brightness(0.45) saturate(0.9)";
        const card = el("div", "title-card", layer);
        el("div", "eyebrow", card, `第 ${sb.episode} 课 · ${sb.theme}`);
        el("h1", null, card, (sb.titleLines ?? [sb.title]).join("<br />"));
        entry.card = card;
      } else if (scene.type === "artwork" && !seenWorks.has(scene.work) && scene.label !== false) {
        const label = el("div", "work-label", layer);
        el("h2", null, label, `《${work.title}》`);
        el("p", null, label, work.meta);
        el("small", null, label, work.credit);
        entry.label = label;
      }
      if (scene.type === "quote") entry.img.style.filter = "brightness(0.5) saturate(0.8)";
      // 引文场景、或明确不显示标签的镜头，把作品标签留给下一次出场
      if (scene.type !== "quote" && scene.label !== false) seenWorks.add(scene.work);
    } else if (scene.type === "compare") {
      entry.panes = scene.panes.map((pane, k) => {
        const box = el("div", "pane", layer);
        box.style.top = `${k === 0 ? 210 : 830}px`;
        const vp = el("div", "viewport", box);
        const art = artImg(vp, pane.work);
        const tag = el("div", "pane-tag", box);
        el("b", null, tag, pane.label);
        if (pane.sub) el("span", null, tag, pane.sub);
        seenWorks.add(pane.work);
        return { pane, box, ...art, rect: { w: 1000, h: 580 } };
      });
    } else if (scene.type === "triptych") {
      const words = scene.words ?? ["一幅画", "一座塔", "一片星空"];
      entry.bands = scene.works.map((key, k) => {
        const band = el("div", "band", layer);
        band.style.top = `${250 + k * 420}px`;
        const img = el("img", null, band);
        img.src = image(key).url;
        img.style.objectPosition = scene.focus?.[k] ?? "center";
        el("span", null, band, words[k]);
        return band;
      });
    } else if (scene.type === "endcard") {
      // 片尾：品牌 + 下一课预告，背景为下一课作品
      const vp = el("div", "viewport", layer);
      entry.box = { w: W, h: H, left: 0, top: 0 };
      Object.assign(entry, artImg(vp, scene.work));
      entry.img.style.filter = "brightness(0.42) saturate(0.85)";
      el("div", "shade-bottom", layer);
      const card = el("div", "endcard", layer);
      el("div", "end-eyebrow", card, sb.series.split(" · ")[1] ?? "");
      el("div", "end-brand", card, sb.series.split(" · ")[0]);
      const next = el("div", "end-next", card);
      el("span", null, next, scene.next.label ?? "下一课");
      el("strong", null, next, scene.next.title);
      if (scene.next.sub) el("small", null, next, scene.next.sub);
      el("div", "end-site", card, "art.llmxfactor.cloud");
      entry.endcard = card;
    } else if (scene.type === "outro") {
      layer.classList.add("outro");
      el("div", "q-eyebrow", layer, scene.eyebrow ?? "留一个问题给你");
      el("div", "question", layer, scene.question);
      const site = el("div", "site", layer);
      el("strong", null, site, "艺术史公共书房");
      el("p", null, site, scene.siteNote ?? "作品背景、视觉分析与延伸问题");
      el("em", null, site, "art.llmxfactor.cloud");
    }

    for (const fx of scene.emphasis ?? []) {
      EMPHASIS[fx.type]?.(fx, layer, entry);
      entry.effects.push(fx);
    }
    return entry;
  });

  // ---------- 公共元素 ----------
  const header = el("div", null, stage);
  header.id = "header";
  el("span", null, header, sb.series);
  el("b", null, header, `${sb.episode} ${sb.theme}`);
  const caption = el("div", null, stage);
  caption.id = "caption";
  const progress = el("div", null, stage);
  progress.id = "progress";
  const bar = el("i", null, progress);

  function opacityAt(i, t) {
    const start = layers[i].slot.start;
    const next = layers[i + 1]?.slot.start ?? Infinity;
    if (t > next + FADE) return 0;
    if (i === 0) return 1;
    return ease((t - (start - FADE / 2)) / FADE);
  }

  window.seek = function seek(t) {
    let light = false;
    for (const entry of layers) {
      const op = opacityAt(entry.index, t);
      entry.layer.style.opacity = String(op);
      entry.layer.style.visibility = op <= 0 ? "hidden" : "visible";
      if (op <= 0) continue;
      const { start, end } = entry.slot;
      const dur = Math.max(0.5, end - start + 0.4);
      const u = ease((t - start) / dur);
      const local = t - start;

      let p = null;
      if (entry.img) p = place(entry.img, entry.box, camAt(entry.scene.camera ?? [{ cx: 0.5, cy: 0.5, zoom: 1 }], u), entry.natural);
      if (entry.panes) {
        entry.panes.forEach(({ pane, box, img, natural, rect }, k) => {
          place(img, rect, camAt(pane.camera, u), natural);
          const s = ease((local - k * 0.5) / 0.6);
          box.style.opacity = String(s);
          box.style.transform = `translateY(${lerp(36, 0, s)}px)`;
        });
      }
      for (const fx of entry.effects) updateEmphasis(entry, fx, local, dur, p ?? { s: 1, tx: 0, ty: 0 });

      if (entry.card && entry.scene.type === "title") {
        const show = ease((local - 0.2) / 0.8) * (1 - ease((t - (end - 0.1)) / 0.35));
        entry.card.style.opacity = String(show);
        entry.card.style.transform = `translateY(${lerp(40, 0, show)}px)`;
      }
      if (entry.label) {
        const show = ease((local - 0.3) / 0.7) * (1 - ease((local - 3.6) / 0.7));
        entry.label.style.opacity = String(show);
        entry.label.style.transform = `translateY(${lerp(30, 0, ease((local - 0.3) / 0.7))}px)`;
      }
      if (entry.endcard) {
        [...entry.endcard.children].forEach((child, k) => {
          const show = ease((local - 0.15 - k * 0.35) / 0.6);
          child.style.opacity = String(show);
          child.style.transform = `translateY(${lerp(30, 0, show)}px)`;
        });
      }
      if (entry.bands) {
        entry.bands.forEach((band, k) => {
          const show = ease((local - k * 0.7) / 0.6);
          band.style.opacity = String(show);
          band.style.transform = `translateY(${lerp(40, 0, show)}px)`;
        });
      }
      if (entry.scene.type === "outro" && op > 0.5) light = true;
    }
    document.body.classList.toggle("light-caption", light);
    const cap = plan.captions.find((c) => t >= c.start && t < c.end);
    caption.textContent = cap ? cap.text : "";
    bar.style.width = `${clamp(t / plan.total) * 100}%`;
  };

  if (plan.mode === "cover") {
    document.body.classList.add("cover-mode");
    caption.style.display = "none";
    progress.style.display = "none";
  }

  window.__ready = Promise.all(
    [...document.images].map((img) => (img.complete ? Promise.resolve() : new Promise((r) => (img.onload = img.onerror = r))))
  ).then(() => document.fonts.ready);
})();

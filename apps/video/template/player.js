// 由渲染脚本注入 window.__PLAN__：{ storyboard, timeline, captions, total, imageBase, mode }
// seek(t) 是纯函数式的：同一个 t 总是得到同一帧，便于逐帧截图。
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
  const imgSrc = (work) => `${plan.imageBase}/${sb.works[work].image}.webp`;

  // ---------- 镜头：根据焦点与缩放计算图片位置 ----------
  function place(img, box, cam, natural) {
    const s = Math.max(box.w / natural.w, box.h / natural.h) * cam.zoom;
    let tx = box.w / 2 - cam.cx * natural.w * s;
    let ty = box.h / 2 - cam.cy * natural.h * s;
    tx = clamp(tx, box.w - natural.w * s, 0);
    ty = clamp(ty, box.h - natural.h * s, 0);
    img.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
    return { s, tx, ty };
  }

  // ---------- 构建场景 ----------
  const seenWorks = new Set();
  const layers = plan.timeline.map((slot, index) => {
    const seg = sb.segments[index];
    const scene = seg.scene;
    const layer = el("div", "layer", stage);
    layer.style.zIndex = String(index + 1);
    const entry = { slot, scene, layer, index };

    if (scene.type === "artwork" || scene.type === "title") {
      const work = sb.works[scene.work];
      const natural = plan.sizes[work.image];
      const mode = scene.type === "title" ? "cover" : scene.mode;
      if (mode === "fit") {
        el("div", "backdrop", layer).style.backgroundImage = `url(${imgSrc(scene.work)})`;
        const boxH = Math.round(1000 * (natural.h / natural.w));
        const frame = el("div", "fit-frame", layer);
        frame.style.top = `${Math.round(700 - boxH / 2)}px`;
        frame.style.height = `${boxH}px`;
        entry.box = { w: 1000, h: boxH, left: 40, top: Math.round(700 - boxH / 2) };
        entry.img = el("img", "art", frame);
      } else {
        const vp = el("div", "viewport", layer);
        entry.box = { w: W, h: H, left: 0, top: 0 };
        entry.img = el("img", "art", vp);
      }
      entry.img.src = imgSrc(scene.work);
      entry.img.style.width = `${natural.w}px`;
      entry.img.style.height = `${natural.h}px`;
      entry.natural = natural;
      el("div", "shade-top", layer);
      el("div", "shade-bottom", layer);

      if (scene.highlight) {
        entry.ring = el("div", "ring", layer);
        entry.ringLabel = el("div", "ring-label", layer, scene.highlight.label);
      }
      if (scene.type === "title") {
        entry.img.style.filter = "brightness(0.45) saturate(0.9)";
        const card = el("div", "title-card", layer);
        el("div", "eyebrow", card, `第 ${sb.episode} 课 · ${sb.theme}`);
        el("h1", null, card, (sb.titleLines ?? [sb.title]).join("<br />"));
        entry.card = card;
      } else if (!seenWorks.has(scene.work)) {
        const label = el("div", "work-label", layer);
        el("h2", null, label, `《${work.title}》`);
        el("p", null, label, work.meta);
        el("small", null, label, work.credit);
        entry.label = label;
      }
      seenWorks.add(scene.work);
    } else if (scene.type === "triptych") {
      const words = ["一幅画", "一座塔", "一片星空"];
      entry.bands = scene.works.map((key, k) => {
        const band = el("div", "band", layer);
        band.style.top = `${250 + k * 420}px`;
        const img = el("img", null, band);
        img.src = imgSrc(key);
        const focus = { olympia: "26% 32%", eiffel: "48% 30%", starry: "50% 36%" }[key] || "center";
        img.style.objectPosition = focus;
        el("span", null, band, words[k]);
        return band;
      });
    } else if (scene.type === "outro") {
      layer.classList.add("outro");
      el("div", "q-eyebrow", layer, "留一个问题给你");
      el("div", "question", layer, scene.question);
      const site = el("div", "site", layer);
      el("strong", null, site, "艺术史公共书房");
      el("p", null, site, "这三件作品的背景、视觉分析与延伸问题");
      el("em", null, site, "art.llmxfactor.cloud");
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
    let outroVisible = false;
    for (const entry of layers) {
      const op = opacityAt(entry.index, t);
      entry.layer.style.opacity = String(op);
      entry.layer.style.visibility = op <= 0 ? "hidden" : "visible";
      if (op <= 0) continue;
      const { start, end } = entry.slot;
      const u = ease((t - start) / Math.max(0.5, end - start + 0.4));
      const local = t - start;

      if (entry.img) {
        const [a, b] = entry.scene.camera;
        const cam = { cx: lerp(a.cx, b.cx, u), cy: lerp(a.cy, b.cy, u), zoom: lerp(a.zoom, b.zoom, u) };
        const p = place(entry.img, entry.box, cam, entry.natural);
        if (entry.ring) {
          const h = entry.scene.highlight;
          const x = entry.box.left + p.tx + h.x * entry.natural.w * p.s;
          const y = entry.box.top + p.ty + h.y * entry.natural.h * p.s;
          const r = h.r * entry.natural.w * p.s;
          // appear：圈注出现的时间点（占本段时长的比例），默认开场 0.8 秒后
          const appearAt = h.appear != null ? h.appear * (end - start) : 0.8;
          const show = ease((local - appearAt) / 0.6);
          entry.ring.style.cssText = `left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;opacity:${show};transform:scale(${lerp(1.25, 1, show)})`;
          entry.ringLabel.style.cssText = `left:${x}px;top:${y + r + 18}px;opacity:${show}`;
        }
      }
      if (entry.card) {
        // 标题在转场前先淡出，避免叠在下一个画面上
        const show = ease((local - 0.2) / 0.8) * (1 - ease((t - (end - 0.1)) / 0.35));
        entry.card.style.opacity = String(show);
        entry.card.style.transform = `translateY(${lerp(40, 0, show)}px)`;
      }
      if (entry.label) {
        const show = ease((local - 0.3) / 0.7) * (1 - ease((local - 3.6) / 0.7));
        entry.label.style.opacity = String(show);
        entry.label.style.transform = `translateY(${lerp(30, 0, ease((local - 0.3) / 0.7))}px)`;
      }
      if (entry.bands) {
        entry.bands.forEach((band, k) => {
          const show = ease((local - k * 0.7) / 0.6);
          band.style.opacity = String(show);
          band.style.transform = `translateY(${lerp(40, 0, show)}px)`;
        });
      }
      if (entry.scene.type === "outro" && op > 0.5) outroVisible = true;
    }
    document.body.classList.toggle("light-caption", outroVisible);

    const cap = plan.captions.find((c) => t >= c.start && t < c.end);
    caption.textContent = cap ? cap.text : "";
    bar.style.width = `${clamp(t / plan.total) * 100}%`;
  };

  // 封面模式：只显示标题场景，不显示字幕与进度条
  if (plan.mode === "cover") {
    document.body.classList.add("cover-mode");
    caption.style.display = "none";
    progress.style.display = "none";
  }

  window.__ready = Promise.all(
    [...document.images].map((img) => (img.complete ? Promise.resolve() : new Promise((r) => (img.onload = img.onerror = r))))
  ).then(() => document.fonts.ready);
})();

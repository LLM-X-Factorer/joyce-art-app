<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useExplore } from "@/composables/useExplore";

const { t } = useI18n();
const router = useRouter();
const { explore } = useExplore();
</script>

<template>
  <section class="hero">
    <div class="museum-walk" aria-hidden="true">
      <div class="realistic-temple-layer"></div>
      <div class="temple-vignette-layer"></div>
      <svg class="svg-defs" width="0" height="0" focusable="false">
        <defs>
          <linearGradient id="marble-face" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stop-color="#c8cbc7" />
            <stop offset="16%" stop-color="#fbfbf7" />
            <stop offset="36%" stop-color="#eef0ec" />
            <stop offset="52%" stop-color="#d7dbd6" />
            <stop offset="74%" stop-color="#ffffff" />
            <stop offset="100%" stop-color="#bfc4bf" />
          </linearGradient>
          <linearGradient id="marble-edge" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="52%" stop-color="#d9ddd8" />
            <stop offset="100%" stop-color="#aeb5af" />
          </linearGradient>
          <linearGradient id="plant-leaf" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stop-color="#7f9a74" />
            <stop offset="100%" stop-color="#38583d" />
          </linearGradient>
          <filter id="carved-shadow" x="-30%" y="-20%" width="160%" height="150%">
            <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#626762" flood-opacity="0.18" />
          </filter>
          <symbol id="doric-column" viewBox="0 0 180 720">
            <path d="M22 64 H158 L146 95 H34 Z" fill="url(#marble-edge)" stroke="#8b918c" stroke-width="1.4" />
            <path d="M38 96 C48 124 132 124 142 96 L152 145 H28 Z" fill="url(#marble-face)" stroke="#969c97" stroke-width="1.2" />
            <path d="M20 142 H160 V166 H20 Z" fill="url(#marble-edge)" stroke="#8f9690" stroke-width="1.2" />
            <path d="M44 166 H136 L126 640 H54 Z" fill="url(#marble-face)" stroke="#8b918c" stroke-width="1.4" />
            <path d="M54 172 C64 265 60 542 54 634" fill="none" stroke="#a9afaa" stroke-width="2" opacity="0.55" />
            <path d="M70 170 C76 272 74 548 68 636" fill="none" stroke="#8e9690" stroke-width="2.4" opacity="0.56" />
            <path d="M88 169 C91 266 91 548 88 637" fill="none" stroke="#b8bdb8" stroke-width="1.8" opacity="0.62" />
            <path d="M107 170 C103 276 105 548 112 636" fill="none" stroke="#8f9690" stroke-width="2.3" opacity="0.52" />
            <path d="M126 172 C117 270 121 542 128 634" fill="none" stroke="#aab0ab" stroke-width="2" opacity="0.55" />
            <path d="M58 184 C76 214 104 226 127 248" fill="none" stroke="#8a918c" stroke-width="1.4" opacity="0.16" />
            <path d="M116 248 C92 306 76 344 62 418" fill="none" stroke="#8a918c" stroke-width="1.6" opacity="0.15" />
            <path d="M71 470 C100 512 116 566 121 628" fill="none" stroke="#7f8781" stroke-width="1.3" opacity="0.14" />
            <path d="M28 638 H152 V666 H28 Z" fill="url(#marble-edge)" stroke="#8b918c" stroke-width="1.2" />
            <path d="M12 666 H168 V696 H12 Z" fill="url(#marble-face)" stroke="#8b918c" stroke-width="1.2" />
          </symbol>
        </defs>
      </svg>

      <div class="temple-layer entablature-layer">
        <svg viewBox="0 0 1400 190" preserveAspectRatio="none">
          <path d="M54 16 H1346 L1318 52 H82 Z" fill="url(#marble-edge)" stroke="#8c928d" stroke-width="2" />
          <path d="M80 52 H1320 V108 H80 Z" fill="url(#marble-face)" stroke="#a1a6a1" stroke-width="1.5" />
          <path d="M70 108 H1330 V132 H70 Z" fill="url(#marble-edge)" stroke="#8c928d" stroke-width="1.5" />
          <path d="M42 132 H1358 V170 H42 Z" fill="url(#marble-face)" stroke="#8c928d" stroke-width="1.8" />
          <g opacity="0.42" fill="#a2a9a3">
            <rect x="250" y="64" width="18" height="38" rx="2" />
            <rect x="312" y="64" width="18" height="38" rx="2" />
            <rect x="374" y="64" width="18" height="38" rx="2" />
            <rect x="436" y="64" width="18" height="38" rx="2" />
            <rect x="498" y="64" width="18" height="38" rx="2" />
            <rect x="560" y="64" width="18" height="38" rx="2" />
            <rect x="622" y="64" width="18" height="38" rx="2" />
            <rect x="684" y="64" width="18" height="38" rx="2" />
            <rect x="746" y="64" width="18" height="38" rx="2" />
            <rect x="808" y="64" width="18" height="38" rx="2" />
            <rect x="870" y="64" width="18" height="38" rx="2" />
            <rect x="932" y="64" width="18" height="38" rx="2" />
            <rect x="994" y="64" width="18" height="38" rx="2" />
            <rect x="1056" y="64" width="18" height="38" rx="2" />
            <rect x="1118" y="64" width="18" height="38" rx="2" />
          </g>
          <path d="M200 38 C355 70 455 16 612 42" fill="none" stroke="#89908b" stroke-width="2" opacity="0.13" />
          <path d="M780 32 C872 64 1008 58 1188 34" fill="none" stroke="#89908b" stroke-width="2" opacity="0.12" />
        </svg>
      </div>

      <div class="temple-layer marble-floor-layer">
        <svg viewBox="0 0 1400 460" preserveAspectRatio="none">
          <path d="M-120 82 H1520 L1660 460 H-260 Z" fill="#ecece6" opacity="0.7" />
          <path d="M-120 82 H1520" stroke="#b9beb8" stroke-width="2" opacity="0.45" />
          <path d="M200 82 L58 460 M438 82 L364 460 M700 82 V460 M962 82 L1036 460 M1200 82 L1342 460" stroke="#a8aea8" stroke-width="1.4" opacity="0.24" />
          <path d="M-40 178 H1440 M-92 282 H1492 M-160 398 H1560" stroke="#b8beb8" stroke-width="1.1" opacity="0.22" />
        </svg>
      </div>

      <div class="temple-layer foreground-left-columns">
        <svg viewBox="0 0 560 760" preserveAspectRatio="none">
          <use href="#doric-column" x="4" y="28" width="178" height="728" opacity="0.94" />
          <use href="#doric-column" x="186" y="10" width="190" height="748" filter="url(#carved-shadow)" />
          <use href="#doric-column" x="354" y="34" width="174" height="724" opacity="0.9" />
        </svg>
      </div>

      <div class="temple-layer foreground-right-columns">
        <svg viewBox="0 0 560 760" preserveAspectRatio="none">
          <use href="#doric-column" x="28" y="34" width="174" height="724" opacity="0.9" />
          <use href="#doric-column" x="196" y="10" width="190" height="748" filter="url(#carved-shadow)" />
          <use href="#doric-column" x="378" y="28" width="178" height="728" opacity="0.94" />
        </svg>
      </div>

      <div class="temple-layer plants-layer">
        <svg viewBox="0 0 1400 620" preserveAspectRatio="none">
          <g transform="translate(58 448)">
            <path d="M32 126 H98 C104 96 94 74 70 70 H54 C30 76 22 98 32 126 Z" fill="#d9dbd4" stroke="#9aa19a" />
            <path d="M64 76 C54 42 32 18 8 0 C18 40 32 68 64 76 Z" fill="url(#plant-leaf)" />
            <path d="M68 78 C84 44 116 26 150 20 C124 54 100 76 68 78 Z" fill="url(#plant-leaf)" />
            <path d="M60 80 C52 54 62 28 84 6 C90 44 82 68 60 80 Z" fill="#6f8f63" />
          </g>
          <g transform="translate(1170 430) scale(-1 1)">
            <path d="M32 126 H98 C104 96 94 74 70 70 H54 C30 76 22 98 32 126 Z" fill="#d9dbd4" stroke="#9aa19a" />
            <path d="M64 76 C54 42 32 18 8 0 C18 40 32 68 64 76 Z" fill="url(#plant-leaf)" />
            <path d="M68 78 C84 44 116 26 150 20 C124 54 100 76 68 78 Z" fill="url(#plant-leaf)" />
            <path d="M60 80 C52 54 62 28 84 6 C90 44 82 68 60 80 Z" fill="#6f8f63" />
          </g>
        </svg>
      </div>
    </div>
    <nav class="nav" :aria-label="t('top.navLabel')">
      <div class="brand-mark">A</div>
      <div>
        <p class="eyebrow">{{ t("nav.eyebrow") }}</p>
        <p class="nav-subtitle">{{ t("nav.subtitle") }}</p>
      </div>
    </nav>

    <div class="hero-grid">
      <div class="hero-copy">
        <h1 class="welcome-title" :aria-label="t('hero.welcomeLabel')">
          <span lang="el">Καλώς ήρθατε</span>
          <span lang="en">Welcome</span>
          <span lang="fr">Bienvenue</span>
          <span lang="zh-Hans">欢迎</span>
        </h1>
        <div class="hero-actions">
          <button type="button" class="hero-action-card coffee-action" :aria-label="t('hero.coffeeLabel')" @click="router.push('/cafe')">
            <span class="action-icon latte-icon" aria-hidden="true">
              <span class="steam steam-one"></span>
              <span class="steam steam-two"></span>
              <span class="cup"></span>
              <span class="saucer"></span>
            </span>
            <span>{{ t("hero.coffee") }}</span>
          </button>
          <button type="button" class="hero-action-card map-action" :aria-label="t('hero.mapLabel')" @click="router.push('/map')">
            <span class="action-icon map-icon" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </span>
            <span>{{ t("hero.map") }}</span>
          </button>
          <button type="button" class="hero-action-card essay-action" :aria-label="t('hero.essayLabel')" @click="router.push('/essay')">
            <span class="action-icon essay-icon" aria-hidden="true">
              <span class="essay-paper-icon"></span>
              <span class="essay-pen-icon"></span>
            </span>
            <span>{{ t("hero.essay") }}</span>
          </button>
          <button type="button" class="hero-action-card explore-action" :aria-label="t('hero.exploreLabel')" @click="explore">
            <span class="action-icon compass-icon" aria-hidden="true">
              <span class="needle"></span>
            </span>
            <span>{{ t("hero.explore") }}</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

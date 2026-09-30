<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import type { EssayMode } from "@common-room/shared";
import { api, ApiError } from "@/lib/api";
import { accountsEnabled } from "@/lib/features";
import { essayWordTotal, scoreEssayResponse, type EssayResult } from "@/lib/essay";
import { useAuthStore } from "@/stores/auth";
import { useContentStore } from "@/stores/content";
import { useSavedStore } from "@/stores/saved";
import { useUiStore } from "@/stores/ui";

const { t, locale } = useI18n();
const route = useRoute();
const content = useContentStore();
const saved = useSavedStore();
const auth = useAuthStore();
const ui = useUiStore();

// ---------- 当前题目 ----------
const savedWorks = computed(() => content.works.filter((work) => saved.has(work.slug)));
const pool = computed(() => (ui.essay.mode === "essay" && savedWorks.value.length ? savedWorks.value : content.works));
const work = computed(() => {
  const pinned = ui.essay.workSlug ? content.workBySlug.get(ui.essay.workSlug) : undefined;
  if (pinned) return pinned;
  const index = ui.essay.mode === "visual" ? ui.essay.visualIndex : ui.essay.questionIndex;
  return pool.value[index % pool.value.length] ?? content.works[0];
});
const era = computed(() => (work.value ? content.eraBySlug.get(work.value.eraSlug) : undefined));
const isEssay = computed(() => ui.essay.mode === "essay");
const question = computed(() => {
  const questions = work.value?.questions ?? [];
  return questions[ui.essay.questionIndex % Math.max(1, questions.length)] || t("essay.fallbackQuestion", { title: work.value?.title ?? "" });
});
const taskTitle = computed(() => (isEssay.value ? question.value : t("essay.titleVisual", { title: work.value?.title ?? "" })));

function setMode(mode: EssayMode) {
  ui.essay.mode = mode;
}

function nextTask() {
  ui.essay.workSlug = "";
  const size = pool.value.length || 1;
  if (ui.essay.mode === "visual") ui.essay.visualIndex = (ui.essay.visualIndex + 1) % size;
  else ui.essay.questionIndex = (ui.essay.questionIndex + 1) % size;
  feedback.value = null;
  closeSubmit();
}

// ---------- 草稿 ----------
const thesis = ref("");
const body = ref("");
const wordCount = computed(() => essayWordTotal(body.value));
type SaveState = "idle" | "local" | "saving" | "saved" | "failed";
const saveState = ref<SaveState>("idle");
const serverDrafts = ref(new Map<string, { thesis: string; body: string }>());
let saveTimer: number | undefined;
let loadingDraft = false;

const draftKey = () => (work.value ? `${work.value.slug}:${ui.essay.mode}` : "");
const localKey = (key: string) => `cr.draft.${key}`;

function readLocalDraft(key: string) {
  try {
    return JSON.parse(localStorage.getItem(localKey(key)) ?? "null") as { thesis: string; body: string } | null;
  } catch {
    return null;
  }
}

async function loadServerDrafts() {
  if (!auth.loggedIn) return;
  const data = await api<{ drafts: { workSlug: string; mode: string; thesis: string; body: string }[] }>("/me/drafts").catch(
    () => ({ drafts: [] })
  );
  serverDrafts.value = new Map(data.drafts.map((draft) => [`${draft.workSlug}:${draft.mode}`, draft]));
}

function loadDraft() {
  const key = draftKey();
  if (!key) return;
  loadingDraft = true;
  const local = readLocalDraft(key);
  const remote = auth.loggedIn ? serverDrafts.value.get(key) : undefined;
  const draft = remote ?? local;
  thesis.value = draft?.thesis ?? "";
  body.value = draft?.body ?? "";
  saveState.value = draft ? (auth.loggedIn && remote ? "saved" : "local") : "idle";
  feedback.value = null;
  // 游客时写在本机的草稿，登录后第一次打开时写入账号
  if (auth.loggedIn && !remote && local) scheduleSave(0);
  queueMicrotask(() => (loadingDraft = false));
}

interface DraftSnapshot {
  key: string;
  workSlug: string;
  mode: EssayMode;
  thesis: string;
  body: string;
}
let pending: DraftSnapshot | null = null;

async function persist(snap: DraftSnapshot) {
  const payload = { thesis: snap.thesis, body: snap.body };
  const empty = !payload.thesis.trim() && !payload.body.trim();
  // 切换题目后，旧草稿的保存结果不应覆盖当前草稿的状态
  const setState = (state: SaveState) => {
    if (snap.key === draftKey()) saveState.value = state;
  };
  if (empty) localStorage.removeItem(localKey(snap.key));
  else localStorage.setItem(localKey(snap.key), JSON.stringify(payload));
  if (!auth.loggedIn) {
    setState(empty ? "idle" : "local");
    return;
  }
  setState("saving");
  try {
    await api("/me/drafts", { method: "PUT", body: { workSlug: snap.workSlug, mode: snap.mode, ...payload } });
    serverDrafts.value.set(snap.key, payload);
    // 已安全保存到账号，本机备份可以移除
    localStorage.removeItem(localKey(snap.key));
    setState(empty ? "idle" : "saved");
  } catch {
    setState("failed");
  }
}

function scheduleSave(delay = 900) {
  if (!work.value) return;
  pending = { key: draftKey(), workSlug: work.value.slug, mode: ui.essay.mode, thesis: thesis.value, body: body.value };
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(flushSave, delay);
}

function flushSave() {
  window.clearTimeout(saveTimer);
  saveTimer = undefined;
  const snap = pending;
  pending = null;
  if (snap) void persist(snap);
}

watch([thesis, body], () => {
  if (!loadingDraft) scheduleSave();
});
watch(draftKey, () => {
  flushSave();
  loadDraft();
});

function clearDraft() {
  thesis.value = "";
  body.value = "";
  feedback.value = null;
}

// ---------- 本地规则反馈 ----------
const feedback = ref<EssayResult | null>(null);
function getFeedback() {
  if (!work.value) return;
  feedback.value = scoreEssayResponse(
    work.value,
    content.titlesFor(work.value.slug),
    era.value?.label ?? "",
    ui.essay.mode,
    thesis.value,
    body.value
  );
}

// ---------- 提交给作者 ----------
type SubmitStep = "closed" | "login" | "unavailable" | "pending" | "form" | "done";
const submitStep = ref<SubmitStep>("closed");
const helpRequested = ref("");
const submitError = ref("");
const submitting = ref(false);

async function openSubmit() {
  submitError.value = "";
  if (!auth.loggedIn) {
    submitStep.value = "login";
    return;
  }
  const status = await api<{ open: boolean; hasPending: boolean }>("/me/submission-status").catch(() => null);
  if (!status) {
    submitError.value = t("auth.errors.network");
    return;
  }
  submitStep.value = status.hasPending ? "pending" : status.open ? "form" : "unavailable";
}

function closeSubmit() {
  submitStep.value = "closed";
  submitError.value = "";
}

async function confirmSubmit() {
  if (!work.value || submitting.value) return;
  submitting.value = true;
  submitError.value = "";
  try {
    await api("/me/submissions", {
      body: {
        workSlug: work.value.slug,
        mode: ui.essay.mode,
        thesis: thesis.value,
        body: body.value,
        helpRequested: helpRequested.value
      }
    });
    submitStep.value = "done";
    helpRequested.value = "";
  } catch (error) {
    const code = error instanceof ApiError ? error.code : "unknown";
    if (code === "pending_exists") submitStep.value = "pending";
    else if (code === "capacity_full" || code === "submissions_closed") submitStep.value = "unavailable";
    else if (code === "validation_error") submitError.value = t("essay.bodyTooShort");
    else submitError.value = t("auth.errors.unknown");
  } finally {
    submitting.value = false;
  }
}

onMounted(async () => {
  content.load(locale.value === "zh" ? "en" : "zh");
  if (typeof route.query.work === "string") ui.essay.workSlug = route.query.work;
  await auth.fetchMe();
  await loadServerDrafts();
  loadDraft();
});
watch(
  () => auth.loggedIn,
  async () => {
    await loadServerDrafts();
    loadDraft();
  }
);
onBeforeUnmount(flushSave);
</script>

<template>
  <section v-if="work" class="essay-room page-room" aria-labelledby="essay-room-title">
    <div class="essay-heading">
      <div>
        <p class="eyebrow">{{ t("essay.eyebrow") }}</p>
        <h2 id="essay-room-title">{{ t("essay.title") }}</h2>
        <p>{{ t("essay.intro") }}</p>
      </div>
      <div class="essay-mode-switch" :aria-label="t('essay.modeLabel')">
        <button type="button" :class="{ 'is-selected': !isEssay }" @click="setMode('visual')">{{ t("essay.modeVisual") }}</button>
        <button type="button" :class="{ 'is-selected': isEssay }" @click="setMode('essay')">{{ t("essay.modeEssay") }}</button>
      </div>
    </div>
    <div class="essay-layout">
      <article class="essay-paper" aria-live="polite">
        <div class="essay-task">
          <figure class="essay-artwork">
            <img
              :src="work.image?.url"
              :alt="work.title"
              loading="lazy"
              :style="{ objectPosition: work.imagePosition || 'center center' }"
            />
            <figcaption>{{ work.title }} · {{ work.date }}</figcaption>
          </figure>
          <div class="essay-task-copy">
            <p class="eyebrow">{{ isEssay ? t("essay.kickerEssay") : t("essay.kickerVisual") }}</p>
            <h3>{{ taskTitle }}</h3>
            <p>{{ isEssay ? t("essay.promptEssay") : t("essay.promptVisual") }}</p>
            <button type="button" class="inline-action" @click="nextTask">{{ t("essay.newTask") }}</button>
          </div>
        </div>
        <div class="essay-writing-fields">
          <label for="essay-thesis">{{ t("essay.thesis") }}</label>
          <input id="essay-thesis" v-model="thesis" type="text" maxlength="500" :placeholder="t('essay.thesisPlaceholder')" autocomplete="off" />
          <label for="essay-draft">{{ t("essay.draft") }}</label>
          <textarea id="essay-draft" v-model="body" rows="10" maxlength="12000" :placeholder="t('essay.draftPlaceholder')"></textarea>
        </div>
        <div class="essay-submit-row">
          <p class="essay-count">
            <span>{{ wordCount }}</span> {{ t("essay.words") }}
            <span v-if="saveState !== 'idle'" class="save-state" :class="`is-${saveState}`">· {{ t(`essay.save.${saveState}`) }}</span>
          </p>
          <button type="button" class="inline-action" @click="clearDraft">{{ t("essay.clear") }}</button>
          <button id="essay-submit-response" type="button" @click="getFeedback">{{ t("essay.submit") }}</button>
        </div>
        <section v-if="feedback" class="essay-feedback">
          <h3>{{ t("essay.feedbackTitle", { band: t(`essay.band.${feedback.band}`), score: feedback.score }) }}</h3>
          <p>
            {{
              t("essay.feedbackMeta", {
                title: work.title,
                words: feedback.words,
                mode: isEssay ? t("essay.modeEssay") : t("essay.modeVisual")
              })
            }}
          </p>
          <ul>
            <li v-for="key in feedback.feedback" :key="key">{{ t(`essay.feedback.${key}`) }}</li>
          </ul>
          <p class="feedback-disclaimer">{{ t("essay.feedbackDisclaimer") }}</p>
        </section>

        <section v-if="accountsEnabled" class="author-submit">
          <button v-if="submitStep === 'closed'" type="button" class="inline-action" @click="openSubmit">
            {{ t("essay.submitToAuthor") }}
          </button>
          <p v-if="submitError" class="form-error">{{ submitError }}</p>
          <div v-if="submitStep === 'login'" class="submit-panel">
            <p>{{ t("essay.loginToSubmit") }}</p>
            <RouterLink class="inline-action" :to="{ name: 'login', query: { redirect: `/essay?work=${work.slug}` } }">
              {{ t("top.login") }}
            </RouterLink>
          </div>
          <div v-else-if="submitStep === 'unavailable' || submitStep === 'pending'" class="submit-panel">
            <p>{{ submitStep === "pending" ? t("essay.pendingExists") : t("essay.submissionsClosed") }}</p>
            <button type="button" class="inline-action" @click="closeSubmit">{{ t("essay.cancel") }}</button>
          </div>
          <div v-else-if="submitStep === 'form'" class="submit-panel">
            <p>{{ t("essay.submitIntro") }}</p>
            <label for="help-requested">{{ t("essay.helpRequested") }}</label>
            <input id="help-requested" v-model="helpRequested" type="text" maxlength="500" :placeholder="t('essay.helpPlaceholder')" />
            <div class="submit-preview">
              <p class="eyebrow">{{ t("essay.preview") }} · {{ work.title }}</p>
              <p v-if="thesis"><strong>{{ thesis }}</strong></p>
              <p class="preview-body">{{ body }}</p>
            </div>
            <div class="detail-actions">
              <button type="button" class="inline-action" @click="closeSubmit">{{ t("essay.cancel") }}</button>
              <button type="button" class="primary-action" :disabled="submitting" @click="confirmSubmit">
                {{ t("essay.confirmSubmit") }}
              </button>
            </div>
          </div>
          <div v-else-if="submitStep === 'done'" class="submit-panel is-success">
            <p>{{ t("essay.submitted") }}</p>
            <RouterLink class="inline-action" to="/me?tab=submissions">{{ t("top.me") }}</RouterLink>
          </div>
        </section>
      </article>
      <aside class="essay-method">
        <h3>{{ t("essay.moves") }}</h3>
        <p>
          {{ savedWorks.length ? t("essay.savedNoteSome", { count: savedWorks.length }) : t("essay.savedNoteNone") }}
        </p>
        <ol>
          <li><strong>{{ t("essay.moveContext") }}</strong><span>{{ t("essay.moveContextText") }}</span></li>
          <li><strong>{{ t("essay.moveVisual") }}</strong><span>{{ t("essay.moveVisualText") }}</span></li>
          <li><strong>{{ t("essay.moveArgument") }}</strong><span>{{ t("essay.moveArgumentText") }}</span></li>
          <li><strong>{{ t("essay.moveImplication") }}</strong><span>{{ t("essay.moveImplicationText") }}</span></li>
        </ol>
      </aside>
    </div>
  </section>
</template>

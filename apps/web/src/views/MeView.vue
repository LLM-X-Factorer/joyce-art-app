<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import type { SubmissionDto } from "@common-room/shared";
import { api, errorKey } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { useContentStore } from "@/stores/content";
import { useSavedStore } from "@/stores/saved";
import { useUiStore } from "@/stores/ui";

const TABS = ["saved", "drafts", "submissions", "chat", "workshop", "account"] as const;
type Tab = (typeof TABS)[number];

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const content = useContentStore();
const saved = useSavedStore();
const ui = useUiStore();

const tab = computed<Tab>(() => (TABS.includes(route.query.tab as Tab) ? (route.query.tab as Tab) : "saved"));
function setTab(next: Tab) {
  router.replace({ query: { tab: next } });
}

const savedWorks = computed(() => saved.slugs.map((slug) => content.workBySlug.get(slug)).filter((w) => w !== undefined));

interface Draft {
  workSlug: string;
  mode: "visual" | "essay";
  thesis: string;
  body: string;
  updatedAt: string;
}
const drafts = ref<Draft[]>([]);
const submissions = ref<SubmissionDto[]>([]);
const chat = ref<{ role: string; content: string; source: string | null; createdAt: string }[]>([]);
const applications = ref<{ id: number; status: string; createdAt: string }[]>([]);

const formatTime = (value: string) =>
  new Date(value).toLocaleString(locale.value === "zh" ? "zh-CN" : "en-GB", { dateStyle: "medium", timeStyle: "short" });
const workTitle = (slug: string) => content.workBySlug.get(slug)?.title ?? slug;

async function load(which: Tab) {
  if (which === "drafts") drafts.value = (await api<{ drafts: Draft[] }>("/me/drafts")).drafts;
  if (which === "submissions") submissions.value = (await api<{ submissions: SubmissionDto[] }>("/me/submissions")).submissions;
  if (which === "chat") chat.value = (await api<{ messages: typeof chat.value }>("/me/chat")).messages;
  if (which === "workshop") applications.value = (await api<{ applications: typeof applications.value }>("/me/workshop-applications")).applications;
}

onMounted(() => load(tab.value).catch(() => undefined));
watch(tab, (value) => load(value).catch(() => undefined));

function continueDraft(draft: Draft) {
  ui.essay.mode = draft.mode;
  ui.essay.workSlug = draft.workSlug;
  router.push({ name: "essay", query: { work: draft.workSlug } });
}

async function withdraw(id: number) {
  await api(`/me/submissions/${id}/withdraw`, { method: "POST", body: {} });
  await load("submissions");
}
async function complete(id: number) {
  await api(`/me/submissions/${id}/complete`, { method: "POST", body: {} });
  await load("submissions");
}

// ---------- 账号 ----------
const displayName = ref(auth.user?.displayName ?? "");
const profileSaved = ref(false);
async function saveProfile() {
  await auth.updateProfile({ displayName: displayName.value.trim() });
  profileSaved.value = true;
  window.setTimeout(() => (profileSaved.value = false), 2000);
}
const currentPassword = ref("");
const newPassword = ref("");
const passwordMessage = ref("");
async function changePassword() {
  passwordMessage.value = "";
  try {
    await api("/auth/change-password", { body: { currentPassword: currentPassword.value, newPassword: newPassword.value } });
    passwordMessage.value = t("me.passwordChanged");
    currentPassword.value = "";
    newPassword.value = "";
  } catch (error) {
    passwordMessage.value = t(`auth.errors.${errorKey(error)}`);
  }
}
async function logout() {
  await auth.logout();
  router.push("/");
}
</script>

<template>
  <section class="me-page page-room">
    <header class="me-heading">
      <div>
        <p class="eyebrow">{{ t("me.title") }}</p>
        <h2>{{ t("me.greeting", { name: auth.user?.displayName || auth.user?.email || "" }) }}</h2>
        <p>{{ t("me.intro") }}</p>
      </div>
      <nav class="me-tabs" role="tablist">
        <button
          v-for="item in TABS"
          :key="item"
          type="button"
          role="tab"
          :aria-selected="tab === item"
          :class="{ 'is-selected': tab === item }"
          @click="setTab(item)"
        >
          {{ t(`me.tabs.${item}`) }}
        </button>
      </nav>
    </header>

    <div v-if="tab === 'saved'" class="me-panel">
      <p v-if="savedWorks.length === 0" class="me-empty">{{ t("me.savedEmpty") }}</p>
      <div v-else class="me-saved-grid">
        <RouterLink v-for="work in savedWorks" :key="work!.slug" class="me-saved-card" :to="{ name: 'work', params: { slug: work!.slug } }">
          <img :src="work!.image?.thumbUrl" alt="" loading="lazy" :style="{ objectPosition: work!.imagePosition || 'center' }" />
          <span>
            <strong>{{ work!.title }}</strong>
            <small>{{ work!.date }} · {{ t(`collection.category.${work!.category}`) }}</small>
          </span>
        </RouterLink>
      </div>
    </div>

    <div v-else-if="tab === 'drafts'" class="me-panel">
      <p v-if="drafts.length === 0" class="me-empty">
        {{ t("me.draftsEmpty") }} <RouterLink to="/essay">{{ t("hero.essay") }}</RouterLink>
      </p>
      <article v-for="draft in drafts" :key="`${draft.workSlug}-${draft.mode}`" class="me-item">
        <div>
          <p class="eyebrow">{{ draft.mode === "essay" ? t("essay.modeEssay") : t("essay.modeVisual") }} · {{ t("me.updatedAt", { time: formatTime(draft.updatedAt) }) }}</p>
          <h3>{{ workTitle(draft.workSlug) }}</h3>
          <p v-if="draft.thesis"><strong>{{ draft.thesis }}</strong></p>
          <p class="me-excerpt">{{ draft.body }}</p>
        </div>
        <button type="button" class="inline-action" @click="continueDraft(draft)">{{ t("me.continueWriting") }}</button>
      </article>
    </div>

    <div v-else-if="tab === 'submissions'" class="me-panel">
      <p v-if="submissions.length === 0" class="me-empty">{{ t("me.submissionsEmpty") }}</p>
      <article v-for="item in submissions" :key="item.id" class="me-item submission-item">
        <div>
          <p class="eyebrow">
            <span class="status-badge" :class="`is-${item.status}`">{{ t(`me.status.${item.status}`) }}</span>
            {{ formatTime(item.createdAt) }} · {{ item.mode === "essay" ? t("essay.modeEssay") : t("essay.modeVisual") }}
          </p>
          <h3>{{ item.workTitle[locale as "zh" | "en"] || item.workTitle.en }}</h3>
          <template v-if="item.thesis">
            <strong>{{ t("me.yourThesis") }}</strong>
            <p>{{ item.thesis }}</p>
          </template>
          <strong>{{ t("me.yourResponse") }}</strong>
          <p class="me-excerpt is-full">{{ item.body }}</p>
          <template v-if="item.helpRequested">
            <strong>{{ t("me.helpRequested") }}</strong>
            <p>{{ item.helpRequested }}</p>
          </template>
          <div v-if="item.reply" class="author-reply">
            <strong>{{ t("me.authorReply") }}<template v-if="item.reply.authorName"> · {{ item.reply.authorName }}</template></strong>
            <p>{{ item.reply.body }}</p>
            <small>{{ formatTime(item.reply.sentAt) }}</small>
          </div>
          <p v-if="item.closeReason && item.closeReason !== 'completed_by_user'" class="form-hint">
            {{ t("me.closeReason", { reason: item.closeReason }) }}
          </p>
        </div>
        <div class="detail-actions">
          <button v-if="item.status === 'pending'" type="button" class="inline-action" @click="withdraw(item.id)">{{ t("me.withdraw") }}</button>
          <button v-if="item.status === 'replied'" type="button" class="inline-action" @click="complete(item.id)">{{ t("me.complete") }}</button>
          <RouterLink v-if="item.status === 'replied'" class="inline-action" :to="{ name: 'essay', query: { work: item.workSlug } }">
            {{ t("me.reviseInEssay") }}
          </RouterLink>
        </div>
      </article>
    </div>

    <div v-else-if="tab === 'chat'" class="me-panel">
      <p v-if="chat.length === 0" class="me-empty">{{ t("me.chatEmpty") }} <RouterLink to="/cafe">{{ t("top.cafe") }}</RouterLink></p>
      <div v-else class="chat-log me-chat">
        <article v-for="(message, index) in chat" :key="index" class="chat-message" :class="message.role === 'user' ? 'guest' : 'historian'">
          <strong>
            {{ message.role === "user" ? t("cafe.you") : t("cafe.historian") }}
            <span v-if="message.source" class="chat-source" :class="`is-${message.source}`">
              {{ message.source === "ai" ? t("cafe.sourceAi") : t("cafe.sourceLocal") }}
            </span>
          </strong>
          <p>{{ message.content }}</p>
        </article>
      </div>
    </div>

    <div v-else-if="tab === 'workshop'" class="me-panel">
      <p v-if="applications.length === 0" class="me-empty">
        {{ t("me.workshopEmpty") }} <RouterLink to="/workshop">{{ t("footer.workshop") }}</RouterLink>
      </p>
      <article v-for="application in applications" :key="application.id" class="me-item">
        <div>
          <p class="eyebrow">#{{ application.id }} · {{ formatTime(application.createdAt) }}</p>
          <h3>{{ t(`me.applicationStatus.${application.status}`) }}</h3>
        </div>
      </article>
    </div>

    <div v-else class="me-panel me-account">
      <form class="auth-card" @submit.prevent="saveProfile">
        <label>{{ t("me.accountEmail") }}</label>
        <input :value="auth.user?.email" type="email" disabled />
        <label for="profile-name">{{ t("auth.displayName") }}</label>
        <input id="profile-name" v-model="displayName" type="text" maxlength="40" />
        <button type="submit" class="primary-action">{{ profileSaved ? t("me.saved") : t("me.save") }}</button>
      </form>
      <form class="auth-card" @submit.prevent="changePassword">
        <h3>{{ t("me.changePassword") }}</h3>
        <label for="current-password">{{ t("me.currentPassword") }}</label>
        <input id="current-password" v-model="currentPassword" type="password" autocomplete="current-password" required />
        <label for="new-password">{{ t("auth.newPassword") }}</label>
        <input id="new-password" v-model="newPassword" type="password" autocomplete="new-password" minlength="8" maxlength="72" required />
        <p v-if="passwordMessage" class="form-hint" role="status">{{ passwordMessage }}</p>
        <button type="submit" class="primary-action">{{ t("me.changePassword") }}</button>
      </form>
      <button type="button" class="inline-action" @click="logout">{{ t("auth.logout") }}</button>
    </div>
  </section>
</template>

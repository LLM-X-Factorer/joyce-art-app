<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import type { ChatResponse, ChatSource } from "@common-room/shared";
import { api, ApiError } from "@/lib/api";
import { accountsEnabled } from "@/lib/features";
import { useAuthStore } from "@/stores/auth";
import { useContentStore } from "@/stores/content";
import { useUiStore } from "@/stores/ui";

interface Message {
  role: "user" | "assistant";
  content: string;
  source?: ChatSource | null;
  notice?: ChatResponse["notice"];
  pending?: boolean;
}

// 游客的对话只保存在本次访问的内存中
const guestMessages = ref<Message[]>([]);

const { t, locale } = useI18n();
const content = useContentStore();
const auth = useAuthStore();
const ui = useUiStore();

const userMessages = ref<Message[]>([]);
const messages = computed(() => (auth.loggedIn ? userMessages.value : guestMessages.value));
const question = ref("");
const status = ref("");
const busy = ref(false);
const input = ref<HTMLInputElement | null>(null);
const log = ref<HTMLElement | null>(null);

const drink = computed(
  () => content.coffeeOptions.find((option) => option.slug === ui.cafe.drink) ?? content.coffeeOptions[0]
);

async function loadHistory() {
  if (!auth.loggedIn) return;
  const data = await api<{ messages: Message[] }>("/me/chat").catch(() => ({ messages: [] }));
  userMessages.value = data.messages;
  scrollLog();
}

function scrollLog() {
  nextTick(() => {
    if (log.value) log.value.scrollTop = log.value.scrollHeight;
  });
}

function chooseDrink(slug: string) {
  ui.cafe.drink = slug;
  status.value = "";
}

function order() {
  status.value = t("cafe.ordered", { drink: drink.value?.name ?? "" });
  input.value?.focus();
}

async function ask() {
  const text = question.value.trim();
  if (!text || busy.value) return;
  busy.value = true;
  question.value = "";
  const list = auth.loggedIn ? userMessages.value : guestMessages.value;
  const history = list
    .filter((message) => !message.pending)
    .slice(-6)
    .map(({ role, content }) => ({ role, content: content.slice(0, 800) }));
  list.push({ role: "user", content: text });
  const reply = reactive<Message>({ role: "assistant", content: t("cafe.thinking"), pending: true });
  list.push(reply);
  scrollLog();
  try {
    const data = await api<ChatResponse>("/chat", {
      body: {
        question: text,
        drink: drink.value?.name,
        language: locale.value,
        history: auth.loggedIn ? undefined : history
      }
    });
    Object.assign(reply, { content: data.answer, source: data.source, notice: data.notice, pending: false });
  } catch (error) {
    const key = error instanceof ApiError && error.code === "rate_limited" ? "auth.errors.rate_limited" : "cafe.networkError";
    Object.assign(reply, { content: t(key), pending: false });
  } finally {
    busy.value = false;
    scrollLog();
  }
}

async function clearHistory() {
  if (auth.loggedIn) {
    await api("/me/chat", { method: "DELETE", body: {} }).catch(() => undefined);
    userMessages.value = [];
  } else {
    guestMessages.value = [];
  }
}

onMounted(async () => {
  await auth.fetchMe();
  await loadHistory();
  if (ui.cafe.prefill) {
    question.value = ui.cafe.prefill;
    ui.cafe.prefill = "";
  }
  input.value?.focus();
});
watch(() => auth.loggedIn, loadHistory);
</script>

<template>
  <section class="cafe-room page-room" aria-labelledby="cafe-room-title">
    <div class="cafe-counter">
      <div>
        <p class="eyebrow">{{ t("cafe.eyebrow") }}</p>
        <h2 id="cafe-room-title">{{ t("cafe.title") }}</h2>
        <p>{{ t("cafe.intro") }}</p>
      </div>
      <div class="coffee-menu" :aria-label="t('cafe.menu')">
        <button
          v-for="option in content.coffeeOptions"
          :key="option.slug"
          type="button"
          class="coffee-choice"
          :class="{ 'is-selected': option.slug === drink?.slug }"
          :aria-pressed="option.slug === drink?.slug"
          @click="chooseDrink(option.slug)"
        >
          <span class="drink-art" :class="`drink-${option.slug === 'hot-chocolate' ? 'chocolate' : option.slug}`" aria-hidden="true">
            <span></span>
          </span>
          <span class="drink-name">{{ option.name }}</span>
          <small>{{ option.description }}</small>
        </button>
      </div>
    </div>
    <div class="cafe-layout">
      <div class="coffee-ticket" :data-drink="drink?.slug">
        <div class="ticket-cup" aria-hidden="true">
          <span class="ticket-steam one"></span>
          <span class="ticket-steam two"></span>
          <span class="ticket-steam three"></span>
          <span class="ticket-latte"></span>
        </div>
        <p class="eyebrow">{{ t("cafe.order") }}</p>
        <h3>{{ drink?.name }}</h3>
        <p>{{ drink?.note }}</p>
        <button id="buy-coffee" type="button" @click="order">{{ t("cafe.buy") }}</button>
        <p class="coffee-status" aria-live="polite">{{ status }}</p>
        <p class="cafe-note">{{ t("cafe.orderNote") }}</p>
      </div>
      <div class="historian-chat" aria-labelledby="historian-chat-title">
        <div class="chat-heading">
          <div>
            <p class="eyebrow">{{ t("cafe.ai") }}</p>
            <h3 id="historian-chat-title">{{ t("cafe.askTitle") }}</h3>
          </div>
          <button v-if="messages.length" type="button" class="chat-clear" @click="clearHistory">
            {{ t("cafe.clearHistory") }}
          </button>
          <span v-else>{{ t("cafe.open") }}</span>
        </div>
        <div ref="log" class="chat-log" aria-live="polite">
          <article class="chat-message historian">
            <strong>{{ t("cafe.historian") }}</strong>
            <p>{{ t("cafe.greeting") }}</p>
          </article>
          <article
            v-for="(message, index) in messages"
            :key="index"
            class="chat-message"
            :class="message.role === 'user' ? 'guest' : 'historian'"
          >
            <strong>
              {{ message.role === "user" ? t("cafe.you") : t("cafe.historian") }}
              <span v-if="message.source" class="chat-source" :class="`is-${message.source}`">
                {{ message.source === "ai" ? t("cafe.sourceAi") : t("cafe.sourceLocal") }}
              </span>
            </strong>
            <p>{{ message.content }}</p>
            <small v-if="message.notice" class="chat-notice">{{ t(`cafe.notice.${message.notice}`) }}</small>
          </article>
        </div>
        <form class="chat-form" @submit.prevent="ask">
          <label for="historian-question">{{ t("cafe.question") }}</label>
          <input
            id="historian-question"
            ref="input"
            v-model="question"
            type="text"
            maxlength="1200"
            :placeholder="t('cafe.placeholder')"
            autocomplete="off"
          />
          <button type="submit" :disabled="busy">{{ t("cafe.ask") }}</button>
        </form>
        <p v-if="accountsEnabled && !auth.loggedIn" class="chat-hint">
          <RouterLink :to="{ name: 'login', query: { redirect: '/cafe' } }">{{ t("cafe.historyHint") }}</RouterLink>
        </p>
      </div>
    </div>
  </section>
</template>

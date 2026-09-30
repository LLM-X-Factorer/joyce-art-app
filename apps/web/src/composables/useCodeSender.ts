import { onBeforeUnmount, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { errorKey } from "@/lib/api";

/** 发送邮箱验证码并提供 60 秒倒计时 */
export function useCodeSender(purpose: "register" | "reset") {
  const auth = useAuthStore();
  const seconds = ref(0);
  const sending = ref(false);
  const sent = ref(false);
  let timer: number | undefined;

  async function send(email: string): Promise<string | null> {
    if (sending.value || seconds.value > 0) return null;
    sending.value = true;
    try {
      await auth.sendCode(email.trim(), purpose);
      sent.value = true;
      seconds.value = 60;
      timer = window.setInterval(() => {
        seconds.value -= 1;
        if (seconds.value <= 0) window.clearInterval(timer);
      }, 1000);
      return null;
    } catch (error) {
      return errorKey(error);
    } finally {
      sending.value = false;
    }
  }

  onBeforeUnmount(() => window.clearInterval(timer));
  return { send, seconds, sending, sent };
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 页脚展示的 ICP 备案号 */
  readonly VITE_ICP_NUMBER?: string;
  /** 公安备案号（可选） */
  readonly VITE_PSB_NUMBER?: string;
  /** 隐私政策与用户协议中的运营者名称、联系邮箱 */
  readonly VITE_OPERATOR_NAME?: string;
  readonly VITE_CONTACT_EMAIL?: string;
  /** "false" 时关闭公众账号功能 */
  readonly VITE_ACCOUNTS_ENABLED?: string;
}

interface Window {
  __wxjs_environment?: string;
}

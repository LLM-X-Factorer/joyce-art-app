/** 构建时开关：VITE_ACCOUNTS_ENABLED=false 时隐藏注册、登录、我的书房与提交给作者，网站以游客模式运行 */
export const accountsEnabled = import.meta.env.VITE_ACCOUNTS_ENABLED !== "false";

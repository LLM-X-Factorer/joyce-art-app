/** 是否运行在微信小程序 web-view 中 */
export function isMiniProgram(): boolean {
  return window.__wxjs_environment === "miniprogram" || /miniProgram/i.test(navigator.userAgent);
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

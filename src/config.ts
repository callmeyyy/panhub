/**
 * 接口地址（硬编码，指向 PanHub 官方服务）
 *
 * 本工程是 PanHub 开源的**纯静态前台**，只做两件事：
 *   1. 调 API 搜索
 *   2. 调 API「获取」（转存归因）
 * 登录交给 wx-auth 公共组件，数据由官方 API 提供。
 *
 * 为什么写死地址：搜索与「获取」是强登录接口，登录态由官方服务统一校验，
 * 换地址并不能绕过校验；写死可避免部署方误配导致页面白屏。
 */
export const API_BASE = "https://panhub.shenzjd.com/api";

/** wx-auth 公共登录服务（登录态唯一签发方） */
export const WX_AUTH_API_BASE = "https://wx-auth.shenzjd.com";

/**
 * wx-auth-sdk UMD 包（全局单例 window.WxAuth）的 CDN 候选列表。
 *
 * 容灾（对齐官方站 2026-09-20）：unpkg 主源、jsdelivr 备源——服务器在海外，
 * 约七成用户在中国，unpkg 一旦不可达（TCP 黑洞时 onerror/onload 都不触发），
 * 认证弹窗这条硬门槛会直接不可用。按列表顺序尝试，单个失败/超时立即切下一个。
 *
 * 版本下限（对齐官方站 2026-09-24）：匿名票据 getOrCreateAnonTicket 需
 * SDK ≥1.2.44——unpkg 锁 ^1.2.44（minor 自动跟进），jsdelivr 锁 @1（major
 * 锁定）。major breaking 不会静默上线。
 */
export const WX_AUTH_SDK_URLS: readonly string[] = [
  "https://unpkg.com/wx-auth-sdk@^1.2.44/dist/wx-auth.umd.js",
  "https://cdn.jsdelivr.net/npm/wx-auth-sdk@1/dist/wx-auth.umd.js",
];

/** 主源（旧配置名保留：app 内动态补插兜底仍先试主源） */
export const WX_AUTH_SDK_URL = WX_AUTH_SDK_URLS[0];

/**
 * 是否启用微信登录
 *
 * true（当前）：正常登录模式——顶部导航渲染（含头像登录入口），
 * 服务端返回 401（未登录/登录态过期）时吊起 wx-auth 登录弹窗，
 * 登录成功后自动重试本次「获取」，无需再点一次。
 *
 * 设为 false 可整体关闭登录：不渲染顶部导航、不弹登录窗，「获取」401 时
 * 直接给友好提示。注意 wx-auth SDK 无论开关如何都要加载——它还负责签发
 * 搜索/转存/探活所需的匿名票据（?at=），关掉它请求会被服务端拒绝；
 * SDK 只做静默初始化（silent），无 UI，用户无感。
 *
 * 另注：搜索本身对访客开放（checkSearchAuth 已无调用方），开关只影响
 * 「获取」转存这一处登录卡点。
 */
export const AUTH_ENABLED = true;

export const SITE_NAME = "PanHub";

/** 每轮搜索的累计结果上限（与后端默认一致：达到后出现「继续」） */
export const MAX_RESULTS_PER_ROUND = 90;

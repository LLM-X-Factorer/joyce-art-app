# 腾讯云邮件推送（SES）模板

腾讯云个人账号只能通过 API 按**审核通过的模板**发信（2026-03-02 之后新开通的个人账号不能使用 SMTP）。本站共需要 4 个模板。

在 SES 控制台「邮件模板 → 创建模板」中逐个创建：模板名称照下表填写，内容类型选 HTML，把对应的 HTML 粘贴进去。**变量名必须与下文一致**（`{{code}}`、`{{url}}`、`{{item}}`、`{{summary}}`），否则发信会失败。

**关于 `url`**：腾讯云审核要求模板中的链接保留固定域名，不能整个网址都由变量替换。因此模板里写死 `https://art.llmxfactor.cloud/{{url}}`，程序传入的 `url` 只是**不带开头斜杠的站内路径**：作者回复通知为 `me?tab=submissions`，待处理通知为 `admin/`（见 `apps/server/src/lib/mailer.ts` 中的 `REPLY_NOTICE_PATH`、`AUTHOR_NOTICE_PATH`）。如果站点域名变更，需要同步修改这两个模板并重新审核。

审核通过后，把每个模板的 **模板 ID**（数字）填入 `deploy/.env`：

| 模板名称 | 用途 | 变量 | `.env` 变量 |
| --- | --- | --- | --- |
| 艺术史公共书房-注册验证码 | 注册时发送验证码 | `code` | `SES_TEMPLATE_REGISTER_CODE` |
| 艺术史公共书房-重置密码验证码 | 找回密码时发送验证码 | `code` | `SES_TEMPLATE_RESET_CODE` |
| 艺术史公共书房-作者回复通知 | 作者回复了用户提交的练习 | `url`（站内路径） | `SES_TEMPLATE_REPLY_NOTICE` |
| 艺术史公共书房-待处理通知 | 有新练习提交或新工作坊申请时通知作者 | `item`、`summary`、`url`（站内路径） | `SES_TEMPLATE_AUTHOR_NOTICE` |

邮件主题由程序传入（例如「艺术史公共书房 · 注册验证码」），模板只负责正文。

---

## 1. 注册验证码（变量：code）

```html
<div style="font-family: -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif; color: #231f19; line-height: 1.7; max-width: 520px;">
  <p>你好，</p>
  <p>你正在注册「艺术史公共书房」账号，验证码是：</p>
  <p style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #2f7690;">{{code}}</p>
  <p>验证码 10 分钟内有效。如果不是你本人操作，请忽略此邮件。</p>
  <hr style="border: none; border-top: 1px solid #e6e1d6;" />
  <p style="color: #71695e; font-size: 13px;">Your verification code for The Art Historian's Common Room is <b>{{code}}</b>. It expires in 10 minutes. If you did not request it, please ignore this email.</p>
  <p style="color: #71695e; font-size: 12px;">此邮件由系统自动发送，请勿直接回复。</p>
</div>
```

## 2. 重置密码验证码（变量：code）

```html
<div style="font-family: -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif; color: #231f19; line-height: 1.7; max-width: 520px;">
  <p>你好，</p>
  <p>你正在重置「艺术史公共书房」账号的密码，验证码是：</p>
  <p style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #2f7690;">{{code}}</p>
  <p>验证码 10 分钟内有效。如果不是你本人操作，请忽略此邮件，你的密码不会改变。</p>
  <hr style="border: none; border-top: 1px solid #e6e1d6;" />
  <p style="color: #71695e; font-size: 13px;">Your password reset code for The Art Historian's Common Room is <b>{{code}}</b>. It expires in 10 minutes. If you did not request it, please ignore this email.</p>
  <p style="color: #71695e; font-size: 12px;">此邮件由系统自动发送，请勿直接回复。</p>
</div>
```

## 3. 作者回复通知（变量：url = `me?tab=submissions`）

```html
<div style="font-family: -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif; color: #231f19; line-height: 1.7; max-width: 520px;">
  <p>你好，</p>
  <p>作者已经回复了你在「艺术史公共书房」提交的练习，欢迎回到「我的书房」查看并继续修改。</p>
  <p><a href="https://art.llmxfactor.cloud/{{url}}" style="color: #2f7690;">https://art.llmxfactor.cloud/{{url}}</a></p>
  <hr style="border: none; border-top: 1px solid #e6e1d6;" />
  <p style="color: #71695e; font-size: 13px;">The author has replied to the practice you submitted. Open My Study to read it: https://art.llmxfactor.cloud/{{url}}</p>
  <p style="color: #71695e; font-size: 12px;">此邮件由系统自动发送，请勿直接回复。</p>
</div>
```

## 4. 待处理通知（变量：item、summary、url = `admin/`）

发给作者本人，不含用户的联系方式等个人信息，详情在后台查看。

```html
<div style="font-family: -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif; color: #231f19; line-height: 1.7; max-width: 520px;">
  <p>「艺术史公共书房」有一项新内容需要处理：</p>
  <p><b>{{item}}</b></p>
  <p>{{summary}}</p>
  <p>请登录管理后台查看：<a href="https://art.llmxfactor.cloud/{{url}}" style="color: #2f7690;">https://art.llmxfactor.cloud/{{url}}</a></p>
  <p style="color: #71695e; font-size: 12px;">此邮件由系统自动发送，请勿直接回复。</p>
</div>
```

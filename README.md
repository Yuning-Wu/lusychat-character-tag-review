# LusyChat 角色 Tag · 迁移后审核

这是一个只读静态审核页，展示 Tag 清理迁移后 50 个正式库公开角色的一次性 AI 初筛结果。

- 角色范围：`status=1`、`station=100`、`visible=Public`。
- 原 Tag 和新增候选均按产品正常逻辑使用当前 120 个可见 Tag。
- 同时展示新增与严格删除建议；Xiaoya 评论涉及的 Tag 禁止删除。
- 所有建议均未写入正式库。
- `Female` 已从正式目录删除；`Size Difference`、`Taboo` 已正常启用。
- AI 使用单次批量筛选：新增置信度不低于 70，删除不低于 95；删除还会经过确定性规则校验，只保留直接矛盾。
- 页面 UI 与 AI 建议使用简体中文；角色原信息及当前 Tag 使用 `zh-TW` 多语言内容。

打开 `index.html` 即可查看，线上版本由 GitHub Pages 发布。
